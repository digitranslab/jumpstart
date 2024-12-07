import HttpClient from '@/_helpers/http-client';
import { deepClone } from '@/_helpers/utilities/utils.helpers';
import _ from 'lodash';

const jumpstartAdapter = new HttpClient();

function findOne(headers, tableId, query = '') {
  jumpstartAdapter.headers = { ...jumpstartAdapter.headers, ...headers };
  return jumpstartAdapter.get(`/jumpstart-db/proxy/${tableId}?${query}`, headers);
}

function findAll(organizationId) {
  return jumpstartAdapter.get(`/jumpstart-db/organizations/${organizationId}/tables`);
}

function createTable(organizationId, tableName, columns, foreignKeyColumns, checkingValues = false) {
  return jumpstartAdapter.post(`/jumpstart-db/organizations/${organizationId}/table`, {
    table_name: tableName,
    columns,
    ...(checkingValues && { foreign_keys: foreignKeyColumns }),
  });
}

function viewTable(organizationId, tableName) {
  return jumpstartAdapter.get(`/jumpstart-db/organizations/${organizationId}/table/${tableName}`);
}

function bulkUpload(organizationId, tableName, file) {
  return jumpstartAdapter.post(`/jumpstart-db/organizations/${organizationId}/table/${tableName}/bulk-upload`, file);
}

function createRow(headers, tableId, data) {
  return jumpstartAdapter.post(`/jumpstart-db/proxy/${tableId}`, data, headers);
}

function createColumn(
  organizationId,
  tableId,
  columnName,
  dataType,
  defaultValue,
  isNotNull,
  isUniqueConstraint,
  isCheckSerialType = false,
  checkingValues = false,
  foreignKeyArray
) {
  return jumpstartAdapter.post(`/jumpstart-db/organizations/${organizationId}/table/${tableId}/column`, {
    column: {
      column_name: columnName,
      data_type: dataType,
      ...(!isCheckSerialType && { column_default: defaultValue === 'Null' ? null : defaultValue }),
      constraints_type: {
        is_not_null: isNotNull,
        is_unique: isUniqueConstraint,
      },
    },
    ...(checkingValues && { foreign_keys: foreignKeyArray }),
  });
}

function updateTable(organizationId, tableName, columns) {
  return jumpstartAdapter.patch(`/jumpstart-db/${organizationId}/perform`, {
    action: 'update_table',
    table_name: tableName,
    columns,
  });
}

function renameTable(organizationId, tableName, newTableName, data = []) {
  let bodyData = deepClone(data);
  bodyData.forEach((obj) => {
    ['new_column', 'old_column'].forEach(function (key) {
      if (obj[key]?.data_type === 'serial') delete obj[key]?.column_default;
      delete obj[key]?.dataTypeDetails;
    });
  });
  return jumpstartAdapter.patch(`/jumpstart-db/organizations/${organizationId}/table/${tableName}`, {
    table_name: tableName,
    ...(newTableName !== tableName && { new_table_name: newTableName }),
    columns: bodyData,
  });
}

function editForeignKey(organizationId, tableName, id, data = []) {
  return jumpstartAdapter.put(`/jumpstart-db/organizations/${organizationId}/table/${tableName}/foreignkey`, {
    foreign_key_id: id,
    foreign_keys: data,
  });
}

function createForeignKey(organizationId, tableName, data = []) {
  return jumpstartAdapter.post(`/jumpstart-db/organizations/${organizationId}/table/${tableName}/foreignkey`, {
    foreign_keys: data,
  });
}

function deleteForeignKey(organizationId, tableName, id) {
  return jumpstartAdapter.delete(`/jumpstart-db/organizations/${organizationId}/table/${tableName}/foreignkey/${id}`);
}

function updateRows(headers, tableId, data, query = '') {
  return jumpstartAdapter.patch(`/jumpstart-db/proxy/${tableId}?${query}`, data, headers);
}

function updateColumn(organizationId, tableName, columns) {
  return jumpstartAdapter.patch(
    `/jumpstart-db/organizations/${organizationId}/table/${tableName}/column`,
    columns,
    organizationId
  );
}

function deleteRows(headers, tableId, query = '') {
  return jumpstartAdapter.delete(`/jumpstart-db/proxy/${tableId}?${query}`, headers);
}

function deleteColumn(organizationId, tableName, columnName) {
  return jumpstartAdapter.delete(`/jumpstart-db/organizations/${organizationId}/table/${tableName}/column/${columnName}`);
}

function deleteTable(organizationId, tableName) {
  return jumpstartAdapter.delete(`/jumpstart-db/organizations/${organizationId}/table/${tableName}`);
}

function joinTables(organizationId, data) {
  return jumpstartAdapter.post(`jumpstart-db/organizations/${organizationId}/join`, data);
}

export const jumpstartDatabaseService = {
  findOne,
  findAll,
  viewTable,
  createRow,
  createTable,
  createColumn,
  updateTable,
  updateRows,
  deleteRows,
  deleteColumn,
  deleteTable,
  renameTable,
  bulkUpload,
  joinTables,
  updateColumn,
  editForeignKey,
  createForeignKey,
  deleteForeignKey,
};
