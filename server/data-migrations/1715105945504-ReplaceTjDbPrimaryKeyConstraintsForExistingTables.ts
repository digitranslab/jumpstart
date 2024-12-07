import { InternalTable } from 'src/entities/internal_table.entity';
import { MigrationProgress, processDataInBatches } from 'src/helpers/utils.helper';
import { EntityManager, MigrationInterface, QueryRunner } from 'typeorm';
import { createConnection } from 'typeorm';
import { jumpstartDbOrmconfig } from 'ormconfig';

// With the new changes in TJDB for primary and foreign keys, we are using
// TypeORM methods to create constraints. Existing primary key constraints
// that were made do not follow the TypeORM naming strategy and therefore
// break when tried to modify. Therefore we are removing and recreating
// them to follow the same naming convention throughout
export class ReplaceTjDbPrimaryKeyConstraintsForExistingTables1715105945504 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (process.env.ENABLE_JUMPSTART_DB !== 'true') return;
    const batchSize = 1000;
    const entityManager = queryRunner.manager;
    const jumpstartDbConnection = await createConnection({
      ...jumpstartDbOrmconfig,
      name: 'jumpstartDbMigration',
    } as any);
    const jumpstartDbManager = jumpstartDbConnection.createEntityManager();
    const totalTables = await entityManager.count(InternalTable);
    console.log(`Tables to migrate: ${totalTables}`);

    const migrationProgress = new MigrationProgress(
      'ReplaceTjDbPrimaryKeyConstraintsForExistingTables1715105945504',
      totalTables
    );

    try {
      await jumpstartDbManager.transaction(async (jumpstartDbManager) => {
        await processDataInBatches(
          entityManager,
          async (entityManager, skip, take) => {
            return await entityManager.find(InternalTable, {
              order: { createdAt: 'ASC' },
              take,
              skip,
            });
          },
          async (entityManager: EntityManager, internalTables: InternalTable[]) => {
            await this.recreatePrimaryKeys(jumpstartDbManager, internalTables, migrationProgress);
          },
          batchSize
        );
      });
    } catch (error) {
      console.error('Error during processing batches: ', error);
      throw error;
    } finally {
      await jumpstartDbConnection.close();
    }
  }

  private async recreatePrimaryKeys(
    jumpstartDbManager: EntityManager,
    internalTables: InternalTable[],
    migrationProgress: MigrationProgress
  ) {
    for (const internalTable of internalTables) {
      const tableName = internalTable.id;

      // Fetch current primary key columns
      const table = await jumpstartDbManager.queryRunner.getTable(tableName);
      const primaryKeyColumns = await getPrimaryKeyDetails(jumpstartDbManager, tableName);

      // primary keys created in legacy code is dropped
      if (primaryKeyColumns.length === 1) {
        const primaryKeyDetails = primaryKeyColumns[0];

        if (primaryKeyDetails.constraint_name.endsWith('_pkey')) {
          await jumpstartDbManager.queryRunner.query(
            `ALTER TABLE "${table.name}" DROP CONSTRAINT "${primaryKeyDetails.constraint_name}";`
          );

          await jumpstartDbManager.queryRunner.createPrimaryKey(tableName, [primaryKeyDetails.column_name]);
        }
      }

      migrationProgress.show();
    }

    async function getPrimaryKeyDetails(
      jumpstartDbManager: EntityManager,
      tableName: string
    ): Promise<{ column_name: string; data_type: string; constraint_name: string }[]> {
      const query = `
        SELECT
            a.attname AS column_name,
            t.typname AS data_type,
            con.conname AS constraint_name
        FROM
            pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        JOIN pg_class c ON c.oid = i.indrelid
        JOIN pg_constraint con ON con.conindid = i.indexrelid
        JOIN pg_type t ON t.oid = a.atttypid
        WHERE
            c.relname = $1
            AND i.indisprimary;
    `;
      const primaryKeyDetails = await jumpstartDbManager.query(query, [tableName]);
      return primaryKeyDetails;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
