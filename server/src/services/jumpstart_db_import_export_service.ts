import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { ExportJumpstartDatabaseDto } from '@dto/export-resources.dto';
import { ImportResourcesDto, ImportJumpstartDatabaseDto } from '@dto/import-resources.dto';
import { JumpstartDbService } from './jumpstart_db.service';
import { EntityManager } from 'typeorm';
import { InternalTable } from 'src/entities/internal_table.entity';
import { transformTjdbImportDto } from 'src/helpers/tjdb_dto_transforms';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class JumpstartDbImportExportService {
  constructor(
    private readonly jumpstartDbService: JumpstartDbService,
    private readonly manager: EntityManager,
    // TODO: remove optional decorator when
    // ENABLE_JUMPSTART_DB flag is deprecated
    @Optional()
    @InjectEntityManager('jumpstartDb')
    private readonly jumpstartDbManager: EntityManager
  ) {}

  async export(organizationId: string, tjDbDto: ExportJumpstartDatabaseDto) {
    const internalTable = await this.manager.findOne(InternalTable, {
      where: { organizationId, id: tjDbDto.table_id },
    });

    if (!internalTable) throw new NotFoundException('Jumpstart database table not found');

    const { columns, foreign_keys } = await this.jumpstartDbService.perform(organizationId, 'view_table', {
      id: tjDbDto.table_id,
    });

    return {
      id: internalTable.id,
      table_name: internalTable.tableName,
      schema: { columns, foreign_keys },
    };
  }

  async bulkImport(importResourcesDto: ImportResourcesDto, importingVersion: string, cloning: boolean) {
    const tableNameMapping = {};
    const tjdbDatabase = [];
    const tableNameForeignKeyMapping = {};
    const transformedTableNameMapping = {};
    const queryRunner = this.manager.connection.createQueryRunner();
    const tjdbQueryRunner = this.jumpstartDbManager.connection.createQueryRunner();
    const connectionManagers = { appManager: queryRunner.manager, tjdbManager: tjdbQueryRunner.manager };
    await tjdbQueryRunner.connect();
    await tjdbQueryRunner.startTransaction();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const tjdbImportDto of importResourcesDto.jumpstart_database) {
        const transformedDto = transformTjdbImportDto(tjdbImportDto, importingVersion);
        const { foreign_keys } = transformedDto.schema;
        const createdTable = await this.import(
          importResourcesDto.organization_id,
          transformedDto,
          cloning,
          connectionManagers
        );
        transformedTableNameMapping[tjdbImportDto.table_name] = createdTable.table_name;
        if (foreign_keys.length) tableNameForeignKeyMapping[createdTable.table_name] = foreign_keys;
        tableNameMapping[tjdbImportDto.id] = createdTable;
        tjdbDatabase.push(createdTable);
      }
      for (const tableName in tableNameForeignKeyMapping) {
        const foreignKeys = tableNameForeignKeyMapping[tableName].map((ele) => {
          return {
            ...ele,
            referenced_table_name:
              transformedTableNameMapping?.[ele.referenced_table_name] || ele.referenced_table_name,
          };
        });
        await this.jumpstartDbService.perform(
          importResourcesDto.organization_id,
          'create_foreign_key',
          {
            table_name: tableName,
            foreign_keys: foreignKeys,
          },
          connectionManagers
        );
      }

      await tjdbQueryRunner.commitTransaction();
      await queryRunner.commitTransaction();
      await this.jumpstartDbManager.query("NOTIFY pgrst, 'reload schema'");
      return { tableNameMapping, jumpstart_database: tjdbDatabase };
    } catch (err) {
      await tjdbQueryRunner.rollbackTransaction();
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await tjdbQueryRunner.release();
      await queryRunner.release();
    }
  }

  async import(
    organizationId: string,
    tjDbDto: ImportJumpstartDatabaseDto,
    cloning = false,
    connectionManagers: Record<string, EntityManager> = {}
  ) {
    const { appManager } = connectionManagers;
    const internalTableWithSameNameExists = await appManager.findOne(InternalTable, {
      where: {
        tableName: tjDbDto.table_name,
        organizationId,
      },
    });

    if (
      cloning &&
      internalTableWithSameNameExists &&
      (await this.isTableColumnsSubset(internalTableWithSameNameExists, tjDbDto))
    )
      return { id: internalTableWithSameNameExists.id, name: internalTableWithSameNameExists.tableName };

    const tableName = internalTableWithSameNameExists
      ? `${tjDbDto.table_name}_${new Date().getTime()}`
      : tjDbDto.table_name;

    // TODO: Add support for foreign keys
    const { columns } = tjDbDto.schema;

    return await this.jumpstartDbService.perform(
      organizationId,
      'create_table',
      {
        table_name: tableName,
        ...{ columns, foreign_keys: [] },
      },
      connectionManagers
    );
  }

  async isTableColumnsSubset(internalTable: InternalTable, tjDbDto: ImportJumpstartDatabaseDto): Promise<boolean> {
    const dtoColumns = new Set<string>(tjDbDto.schema.columns.map((c) => c.column_name));

    const internalTableColumnSchema = await this.jumpstartDbService.perform(internalTable.organizationId, 'view_table', {
      id: internalTable.id,
    });
    const internalTableColumns = new Set<string>(internalTableColumnSchema.map((c) => c.column_name));
    const isSubset = (subset: Set<string>, superset: Set<string>) => [...subset].every((item) => superset.has(item));

    return isSubset(dtoColumns, internalTableColumns);
  }
}
