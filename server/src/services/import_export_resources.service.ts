import { Injectable, Optional } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { ExportResourcesDto } from '@dto/export-resources.dto';
import { AppImportExportService } from './app_import_export.service';
import { JumpstartDbImportExportService } from './jumpstart_db_import_export_service';
import { ImportResourcesDto } from '@dto/import-resources.dto';
import { AppsService } from './apps.service';
import { CloneResourcesDto } from '@dto/clone-resources.dto';
import { isEmpty } from 'lodash';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class ImportExportResourcesService {
  constructor(
    private readonly appImportExportService: AppImportExportService,
    private readonly appsService: AppsService,
    private readonly jumpstartDbImportExportService: JumpstartDbImportExportService,
    // TODO: remove optional decorator when
    // ENABLE_JUMPSTART_DB flag is deprecated
    @Optional()
    @InjectEntityManager('jumpstartDb')
    private readonly jumpstartDbManager: EntityManager
  ) {}

  async export(user: User, exportResourcesDto: ExportResourcesDto) {
    const resourcesExport = {};
    if (exportResourcesDto.jumpstart_database) {
      resourcesExport['jumpstart_database'] = [];

      for (const tjdb of exportResourcesDto.jumpstart_database) {
        !isEmpty(tjdb) &&
          resourcesExport['jumpstart_database'].push(
            await this.jumpstartDbImportExportService.export(exportResourcesDto.organization_id, tjdb)
          );
      }
    }

    if (exportResourcesDto.app) {
      resourcesExport['app'] = [];

      for (const app of exportResourcesDto.app) {
        resourcesExport['app'].push({
          definition: await this.appImportExportService.export(user, app.id, app.search_params),
        });
      }
    }

    return resourcesExport;
  }

  async import(user: User, importResourcesDto: ImportResourcesDto, cloning = false) {
    let tableNameMapping = {};
    const imports = { app: [], jumpstart_database: [] };
    const importingVersion = importResourcesDto.jumpstart_version;

    if (!isEmpty(importResourcesDto.jumpstart_database)) {
      const res = await this.jumpstartDbImportExportService.bulkImport(importResourcesDto, importingVersion, cloning);
      tableNameMapping = res.tableNameMapping;
      imports.jumpstart_database = res.jumpstart_database;
    }

    if (!isEmpty(importResourcesDto.app)) {
      for (const appImportDto of importResourcesDto.app) {
        user.organizationId = importResourcesDto.organization_id;
        const createdApp = await this.appImportExportService.import(
          user,
          appImportDto.definition,
          appImportDto.appName,
          {
            jumpstart_database: tableNameMapping,
          },
          importResourcesDto.jumpstart_version,
          cloning
        );
        imports.app.push({ id: createdApp.id, name: createdApp.name });
      }
    }

    return imports;
  }

  async clone(user: User, cloneResourcesDto: CloneResourcesDto) {
    const tablesForApp = await this.appsService.findJumpstartDbTables(cloneResourcesDto.app[0].id);

    const exportResourcesDto = new ExportResourcesDto();
    exportResourcesDto.organization_id = cloneResourcesDto.organization_id;
    exportResourcesDto.app = [{ id: cloneResourcesDto.app[0].id, search_params: null }];
    exportResourcesDto.jumpstart_database = tablesForApp;

    const resourceExport = await this.export(user, exportResourcesDto);
    resourceExport['organization_id'] = cloneResourcesDto.organization_id;
    resourceExport['app'][0]['appName'] = cloneResourcesDto.app[0].name;
    const clonedResource = await this.import(user, resourceExport as ImportResourcesDto, true);

    return clonedResource;
  }
}
