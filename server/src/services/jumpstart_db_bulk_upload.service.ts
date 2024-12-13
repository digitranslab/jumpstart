import { BadRequestException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InternalTable } from 'src/entities/internal_table.entity';
import * as csv from 'fast-csv';
import { JumpstartDbService } from './jumpstart_db.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { pipeline } from 'stream/promises';
import { PassThrough } from 'stream';
import { v4 as uuid } from 'uuid';
import { TJDB, JumpstartDatabaseColumn, JumpstartDatabaseDataTypes } from 'src/modules/jumpstart_db/jumpstart-db.types';

const MAX_ROW_COUNT = 1000;

@Injectable()
export class JumpstartDbBulkUploadService {
  constructor(
    private readonly manager: EntityManager,
    // TODO: remove optional decorator when
    // ENABLE_JUMPSTART_DB flag is deprecated
    @Optional()
    @InjectEntityManager('jumpstartDb')
    private readonly jumpstartDbManager: EntityManager,
    private readonly jumpstartDbService: JumpstartDbService
  ) {}

  async perform(organizationId: string, tableName: string, fileBuffer: Buffer) {
    const internalTable = await this.manager.findOne(InternalTable, {
      select: ['id'],
      where: { organizationId, tableName },
    });

    if (!internalTable) {
      throw new NotFoundException(`Table ${tableName} not found`);
    }

    const { columns: internalTableDatabaseColumn }: { columns: JumpstartDatabaseColumn[] } =
      await this.jumpstartDbService.perform(organizationId, 'view_table', {
        table_name: tableName,
      });

    return await this.bulkUploadCsv(internalTable.id, internalTableDatabaseColumn, fileBuffer);
  }

  async bulkUploadCsv(
    internalTableId: string,
    internalTableDatabaseColumn: JumpstartDatabaseColumn[],
    fileBuffer: Buffer
  ): Promise<{ processedRows: number }> {
    const rowsToUpsert = [];
    const passThrough = new PassThrough();
    const csvStream = csv.parseString(fileBuffer.toString(), {
      headers: true,
      strictColumnHandling: true,
      discardUnmappedColumns: true,
    });
    const primaryKeyColumnSchema = internalTableDatabaseColumn.filter(
      (colDetails) => colDetails.keytype === 'PRIMARY KEY'
    );
    const primaryKeyValuesToUpsert = new Set();
    let rowsProcessed = 0;

    csvStream
      .on('headers', (headers) => this.validateHeadersAsColumnSubset(internalTableDatabaseColumn, headers, csvStream))
      .transform((row) =>
        this.validateAndParseColumnDataType(
          internalTableDatabaseColumn,
          primaryKeyColumnSchema,
          row,
          rowsProcessed,
          csvStream
        )
      )
      .on('data', (row) => {
        rowsProcessed++;

        const primaryKeyValuesIdentifier = Object.entries(row)
          .map(([columnName, value]) => {
            const primaryKey = this.findPrimaryKey(columnName, primaryKeyColumnSchema);

            if (isEmpty(primaryKey)) return null;
            if (isEmpty(value) && !isEmpty(primaryKey.column_default)) return uuid();
            return value;
          })
          .filter((value) => value !== null)
          .join('-');

        if (primaryKeyValuesToUpsert.has(primaryKeyValuesIdentifier)) {
          throw new BadRequestException(`Duplicate primary key found on row[${rowsProcessed + 1}]`);
        }

        primaryKeyValuesToUpsert.add(primaryKeyValuesIdentifier);
        rowsToUpsert.push(row);
      })
      .on('error', (error) => {
        csvStream.destroy();
        passThrough.emit('error', new BadRequestException(error));
      })
      .on('end', () => {
        passThrough.emit('end');
      });

    await pipeline(passThrough, csvStream);

    await this.jumpstartDbManager.transaction(async (jumpstartDbManager) => {
      await this.bulkUpsertRows(jumpstartDbManager, rowsToUpsert, internalTableId, internalTableDatabaseColumn);
    });

    return { processedRows: rowsProcessed };
  }

  async bulkUpsertRows(
    jumpstartDbManager: EntityManager,
    rowsToUpsert: unknown[],
    internalTableId: string,
    internalTableDatabaseColumn: JumpstartDatabaseColumn[]
  ) {
    if (isEmpty(rowsToUpsert)) return;

    const primaryKeyColumns = internalTableDatabaseColumn
      .filter((colDetails) => colDetails.keytype === 'PRIMARY KEY')
      .map((colDetails) => colDetails.column_name);

    const serialTypeColumns = internalTableDatabaseColumn
      .filter((colDetails) => colDetails.data_type === 'integer' && /^nextval\(/.test(colDetails.column_default))
      .map((colDetails) => colDetails.column_name);

    const allValueSets = [];
    let allPlaceholders = [];
    let parameterIndex = 1;

    for (const row of rowsToUpsert) {
      const valueSet = [];
      const currentPlaceholders = [];

      for (const col of Object.keys(row)) {
        if (serialTypeColumns.includes(col) || (row[col] === null && primaryKeyColumns.includes(col))) {
          valueSet.push('DEFAULT');
        } else {
          valueSet.push(`$${parameterIndex++}`);
          currentPlaceholders.push(row[col]);
        }
      }

      allValueSets.push(`(${valueSet.join(', ')})`);
      allPlaceholders = allPlaceholders.concat(currentPlaceholders);
    }

    const allColumns = Object.keys(rowsToUpsert[0]);

    const onConflictUpdate = allColumns
      .filter((col) => !primaryKeyColumns.includes(col))
      .map((col) => `"${col}" = EXCLUDED."${col}"`)
      .join(', ');

    const primaryKeyColumnsQuoted = primaryKeyColumns.map((column) => `"${column}"`);
    const columnsQuoted = allColumns.map((column) => `"${column}"`);
    const queryText =
      `INSERT INTO "${internalTableId}" (${columnsQuoted.join(', ')}) ` +
      `VALUES ${allValueSets.join(', ')} ` +
      `ON CONFLICT (${primaryKeyColumnsQuoted.join(', ')}) ` +
      `DO UPDATE SET ${onConflictUpdate};`;

    await jumpstartDbManager.query(queryText, allPlaceholders);
  }

  async validateHeadersAsColumnSubset(
    internalTableDatabaseColumn: JumpstartDatabaseColumn[],
    headers: string[],
    csvStream: csv.CsvParserStream<csv.ParserRow<any>, csv.ParserRow<any>>
  ) {
    const internalTableColumns = new Set<string>(internalTableDatabaseColumn.map((c) => c.column_name));
    const columnsInCsv = new Set<string>(headers);
    const isSubset = (subset: Set<string>, superset: Set<string>) => [...subset].every((item) => superset.has(item));

    if (!isSubset(columnsInCsv, internalTableColumns)) {
      const columnsNotIntable = [...columnsInCsv].filter((element) => !internalTableColumns.has(element));

      csvStream.emit('error', `Columns ${columnsNotIntable.join(',')} not found in table`);
    }
  }

  findPrimaryKey(columnName: string, primaryKeyColumns: JumpstartDatabaseColumn[]) {
    return primaryKeyColumns.find(
      (colDetails) => colDetails.column_name === columnName && colDetails.keytype === 'PRIMARY KEY'
    );
  }

  validateAndParseColumnDataType(
    internalTableDatabaseColumn: JumpstartDatabaseColumn[],
    primaryKeyColumnSchema: JumpstartDatabaseColumn[],
    row: unknown,
    rowsProcessed: number,
    csvStream: csv.CsvParserStream<csv.ParserRow<any>, csv.ParserRow<any>>
  ) {
    if (rowsProcessed >= MAX_ROW_COUNT) csvStream.emit('error', `Row count cannot be greater than ${MAX_ROW_COUNT}`);

    try {
      const columnsInCsv = Object.keys(row);
      const transformedRow = columnsInCsv.reduce((result, columnInCsv) => {
        const columnDetails = internalTableDatabaseColumn.find((colDetails) => colDetails.column_name === columnInCsv);
        const primaryKey = this.findPrimaryKey(columnInCsv, primaryKeyColumnSchema);

        if (!isEmpty(primaryKey) && isEmpty(primaryKey.column_default) && isEmpty(row[columnInCsv]))
          throw `Primary key required for column ${columnDetails.column_name}`;

        result[columnInCsv] = this.convertToDataType(row[columnInCsv], columnDetails.data_type);
        return result;
      }, {});

      return transformedRow;
    } catch (error) {
      csvStream.emit('error', `Error at row[${rowsProcessed + 1}]: ${error}`);
    }
  }

  convertToDataType(columnValue: string, supportedDataType: JumpstartDatabaseDataTypes) {
    if (!columnValue) return null;

    switch (supportedDataType) {
      case TJDB.boolean:
        return this.convertBoolean(columnValue);
      case TJDB.integer:
      case TJDB.double_precision:
      case TJDB.bigint:
        return this.convertNumber(columnValue, supportedDataType);
      default:
        return columnValue;
    }
  }

  convertBoolean(str: string) {
    const parsedString = str.toLowerCase().trim();
    if (parsedString === 'true' || parsedString === 'false') return str;

    throw `${str} is not a valid boolean string`;
  }

  convertNumber(str: string, dataType: 'integer' | 'bigint' | 'double precision') {
    if (dataType === 'integer' && !isNaN(parseInt(str, 10))) return str;
    if (dataType === 'double precision' && !isNaN(parseFloat(str))) return str;
    if (dataType === 'bigint' && typeof BigInt(str) === 'bigint') return str;

    throw `${str} is not a valid ${dataType}`;
  }
}
