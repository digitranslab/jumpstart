---
id: jumpstart-database
title: JumpStart Database
---

Use the JumpStart-hosted database to build apps faster, and manage your data with ease. JumpStart database require no setup and give you a powerful user interface for managing your data.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/tabledash.png" alt="JumpStart Database" />

</div>

## Enabling the JumpStart Database for your instance

Requires:
- PostgREST server
- Additional configuration for JumpStart server

This feature is only enabled if [`ENABLE_JUMPSTART_DB`](/docs/setup/env-vars#enable-jumpstart-database--optional-) is set to `true`.

### PostgREST server

PostgREST is a standalone web server that turns your PostgreSQL database directly into queryable RESTful APIs which is utilized for Jumpstart Database. This server only talks with JumpStart server and therefore does not have to be publicly exposed.

:::tip
If you have openssl installed, you can run the following command `openssl rand -hex 32` to generate the value for `PGRST_JWT_SECRET`.

If this parameter is not specified then PostgREST refuses authentication requests.
:::

| variable           | description                                     |
| ------------------ | ----------------------------------------------- |
| PGRST_JWT_SECRET   | JWT token client provided for authentication    |
| PGRST_DB_URI       | database connection string for jumpstart database |
| PGRST_LOG_LEVEL    | `info`                                          |

:::info
Please make sure that DB_URI is given in the format `postgres://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]`
:::

#### Additional JumpStart server configuration


| variable           | description                                  |
| ------------------ | -------------------------------------------- |
| ENABLE_JUMPSTART_DB  | `true` or `false`                            |
| JUMPSTART_DB         | Default value is `jumpstart_db`                |
| JUMPSTART_DB_HOST    | database host                                |
| JUMPSTART_DB_USER    | database username                            |
| JUMPSTART_DB_PASS    | database password                            |
| JUMPSTART_DB_PORT    | database port                                |
| PGRST_JWT_SECRET   | JWT token client provided for authentication |
| PGRST_HOST         | postgrest database host                      |


If you intent to make changes in the above configuration. Please refer [PostgREST configuration docs](https://postgrest.org/en/stable/configuration.html#environment-variables).

:::tip
When this feature is enabled, the database name provided for `JUMPSTART_DB` will be utilized to create a new database during server boot process in all of our production deploy setups.
Incase you want to trigger it manually, use the command `npm run db:create` on JumpStart server.
:::

## Features

JumpStart database allows you to:

- **[Maintain tables of data](#accessing-jumpstart-database)** in a secure database that's only accessible within your JumpStart organization.
- **[Edit, search, filter, sort, and filter](#database-editor)** data using a spreadsheet-like interface.
- **[Quickly build applications and write queries](#querying-data-from-the-jumpstart-database)** to interact with the JumpStart Database, just like any other datasource but without any setup.
- **[Export table](#export-table)** from the JumpStart Database to a JSON file.

## Accessing JumpStart Database

Once you log-in to your JumpStart account, from the left sidebar of the dashboard you can navigate to **JumpStart Database**.

The JumpStart Database is available on: **[JumpStart Cloud](https://jumpstart.com)**, **[Self-Host](/docs/setup/)**, and **Enterprise Edition**. You can view and manage your database and the data it contains using the **Database editor UI**.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/sidebaroption.png" alt="JumpStart Database" />

</div>

## Database Editor

You can manage the JumpStart Database directly from the Database Editor. JumpStart Database organizes the data into **tables** that can have different structures. All the tables will be listed lexicographically on the left, click on any of the table to view the table data.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/tablescol.png" alt="JumpStart Database" />

</div>

### Create New Table

For creating a new table in JumpStart Database, click on the **Create New Table** button on the top left corner of the Database editor.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/createnew.png" alt="JumpStart Database" />

</div>

When the **Create New Table** button is clicked, a drawer opens up from the right from where you can enter the details of your new table.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/create2.png" alt="JumpStart Database editor"/>

</div>

#### For creating a new table, you'll need to:
- Enter a **Table name**
- Add **Columns** (Any one column is required to be set as Primary key)

#### Supported data types
- **varchar**: varchar data type is used to store characters of indefinite length
- **serial**: serial is used to generate a sequence of integers which are often used as the Primary key of a table.
- **int**: It is a numeric data type used to store whole numbers, that is, numbers without fractional components.
- **float**: float is also a numeric data type that is used to store inexact, variable-precision values.
- **boolean**: boolean data type can hold true, false, and null values.
- **bigint**: bigint is a numeric data type that is used to store whole numbers, that is, numbers without fractional components.

Click on **Create** button to create a new table.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/datatypes.png" alt="JumpStart Database editor" width="500"/>

</div>

### Search Table

You can enter a search term to search through all tables in the database.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/search.png" alt="JumpStart Database editor" />

</div>

### Add column

You can add a new column to the existing table by clicking on the **Add new column** button from the top of the database editor.

A drawer from the right will open up from where you can create a new column by entering the values for the new column such as:
- **Column name**: name of the column (key)
- **Data type**: Check available data types [here](#supported-data-types)
- **Default Value** Any default value for the column (not mandatory)

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/addnewcolumn.png" alt="JumpStart Database editor"/>

</div>

### Delete column

To delete a particular column, just click on the column header and the **delete** button will appear, click on it to delete the column.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/deletecol.png" alt="JumpStart Database editor" />

</div>

### Add new row

To add a new row to the existing table data, click on the **Add new row** button. A drawer will open from the right where you can **enter the values** for the new row.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/addnewrow.png" alt="JumpStart Database editor" />

</div>

### Edit row

To edit the rows from the JumpStart database dashboard, click on the **Edit row** button. A drawer will open from the right from where first you need to **select the id** of the row to be edited from the dropdown and then you can edit the cell values of the selected row.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/editrow.gif" alt="JumpStart Database editor"  />

</div>

### Bulk upload data

You can bulk upload data to the JumpStart database by clicking on the **Bulk upload data** button on the top of the database editor. On clicking the button, a drawer will open from the right from where you can upload a **CSV** file. This file is used to upsert records onto the table. If data for id column is missing it will insert new record with the row data else if id is present it will update the corresponding record with the corresponding row data.

From the drawer, users can download the **template CSV file** in which they can enter the data to be uploaded to the JumpStart database's table or format their CSV file in the same way as the template file.

Once the CSV file is ready, click on the file picker to select the file or drag and drop the file in the file picker. Now, click on the **Upload data** button to upload the data to the JumpStart database.

**Requirements**:
- The data types of columns in the CSV file should match those in the JumpStart database table.
- The `id` column with a `serial` data type should not contain duplicate values.

**Limitations**:
- There is a limit of 1000 rows per CSV file that can be uploaded to the JumpStart database.
- The CSV file should not exceed 2MB in size.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/uploadcsv.png" alt="JumpStart Database editor" />

</div>

### Delete records

To delete one or many records/rows, select on the checkbox at the right of the record or records that you want to delete. As soon as you select a single record, the button to delete record will appear on the top, click on the **Delete record** button to delete the selected records.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/deleterec.png" alt="JumpStart Database editor" />

</div>

### Filter

You can add as many filter as you want into the table by clicking on the **Filter** button present on the top of the database editor.

#### Adding a filter on the table data
- Select a **column** from the Columns dropdown
- Choose an **[operation](#available-operations-are)**
- Enter a **value** for the selected operation

#### Available operations are:
- **equals**: This operation is used to check if the value of the column is equal to the value entered in the input field. 
- **greater than**: This operation is used to check if the value of the column is greater than the value entered in the input field. 
- **greater than or equal**: This operation is used to check if the value of the column is greater than or equal to the value entered in the input field. 
- **less than**: This operation is used to check if the value of the column is less than the value entered in the input field.
- **less than or equal**: This operation is used to check if the value of the column is less than or equal to the value entered in the input field. 
- **not equal**: This operation is used to check if the value of the column is not equal to the value entered in the input field. 
- **like**: This operation is used to check if the value of the column is like the value entered in the input field. This operation is case-sensitive. ex: `JumpStart` will not match `jumpstart`
- **ilike**: This operation is used to check if the value of the column is like the value entered in the input field. This operation is case-insensitive. ex: `JumpStart` will match `jumpstart`
- **match**: This operation is used to check if the value of the column is like the value entered in the input field. This operation is case-sensitive. ex: `JumpStart` will not match `jumpstart`. This operation uses regular expressions. ex: `^JumpStart$` will match `JumpStart` but not `JumpStart Inc`. 
- **imatch**: This operation is used to check if the value of the column is like the value entered in the input field. This operation is case-insensitive. This operation uses regular expressions. ex: `^JumpStart$` will match `JumpStart` but not `JumpStart Inc`.
- **in**: This operation is used to check if the value of the column is in the list of values entered in the input field. ex: `1,2,3`
- **contains**: This operation is used to check if the value of the column contains the value entered in the input field. This operation is case-sensitive. ex: `JumpStart` will not match `jumpstart`
- **contained**: This operation is used to check if the value of the column is contained in the value entered in the input field. This operation is case-sensitive. ex: `JumpStart` will not match `jumpstart`
- **not**: This operation is used to negate the result of the operation selected in the dropdown. ex: `not equals` will return all the records where the value of the column is not equal to the value entered in the input field.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/filters.png" alt="JumpStart Database editor" />

</div>

### Sort

To sort the table data, click on the **Sort** button on top, select a **column** from the dropdown, and then choose an order **ascending** or **descending**.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/sort.png" alt="JumpStart Database editor" />

</div>

### Edit table

To edit the table name, click on the three vertical dots icon on the right of the table name and then click on the **Edit** option. A drawer will open from the right from where you can edit the table name.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/edittablename.png" alt="JumpStart Database editor" />

</div>

### Export table

The export table option allows you to download the selected table schema in a JSON file. This does not export the table data.

While [exporting the app](https://docs.jumpstart.com/docs/dashboard#export-app), you can choose to export the app with or without table schema connected to the app.

To export the table schema, click on the three vertical dots icon on the right of the table name and then click on the **Export** option. A JSON file will be downloaded with the table schema.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/export.png" alt="JumpStart Database editor" />

</div>

### Delete table

To delete a table, click on the three vertical dots icon on the right of the table name and then click on the **Delete** option. A confirmation modal will appear, click on the **Delete** button to delete the table.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/v2-beta/database/newui2/deletetable.png" alt="JumpStart Database editor" />

</div>

## Querying data from the JumpStart database

Querying JumpStart database is as easy as querying any other datasource on JumpStart.

- Go to the **query panel**, and click on the **+Add** button to add a new query, and select **JumpStart Database**
    <div style={{textAlign: 'center'}}>

    <img className="screenshot-full" src="/img/v2-beta/database/newui/qtjdb.png" alt="JumpStart Database editor" />

    </div>

- Select the **table** that you want to query from the dropdown, choose an **operation** from the dropdown, and then enter the required parameters for the selected operation. Click on the **Run** button to execute the query.
    <div style={{textAlign: 'center'}}>

    <img className="screenshot-full" src="/img/v2-beta/database/newui/qtjdb2.png" alt="JumpStart Database editor" />

    </div>

  :::info
  - **Preview** button on the query panel returns the query response without executing the query. Once clicked, the response will be displayed on the Preview section of the query panel which can be viewed as JSON or Raw.
  - When a new query is created, by default the query name is set to `jumpstartdbN` (where N is a number) - you can rename the query by click on the query name or from the left sidebar of query panel.
  :::

### Available operations

### List rows
This operation returns all the records from the table

#### Optional parameters
- **Filter**: Add a condition by choosing a column, an operation, and the value for filtering the records.
- **Sort**: Sort the query response by choosing a column and the order (ascending or descending).
- **Limit**: Limit the number of records to be returned by entering a number.

### Create row
This operation creates a new record in the table. You can create a single record or multiple records at once.

#### Required parameters
- **Columns**: Choose the columns for which you want to add values for the new record and enter the values for the selected columns. You can also add a new column by clicking on the **+Add column** button.

### Update row
This operation updates a record in the table. You can update a single record or multiple records at once.

#### Required parameter
- **Filter**: Add a condition by choosing a column, an operation, and the value for updating a particular record.
- **Columns**: Choose the columns for which you want to update the values for the selected record and enter the values for the selected columns.

### Delete row
This operation deletes a record in the table. You can delete a single record or multiple records at once.

#### Required parameters
- **Filter**: Add a condition by choosing a column, an operation, and the value for deleting a particular record.
- **Limit**: Limit the number of records to be deleted by entering a number.

### Join tables

You can join two or more tables in the JumpStart database by using the **Join** operation.

#### Required parameters
- **From**: In the **From** section, there are the following parameters:
    - **Selected Table**: Select the table from which you want to join the other table. 
    - **Type of Join**: Select the type of join you want to perform. The available options are: `Inner Join`, `Left Join`, `Right Join`, and `Full Outer Join`.
    - **Joining Table**: Select the table that you want to join with the selected table.
    - **On**: Select the column from the **selected table** and the **joining table** on which you want to join the tables. Currently, only `=` operation is supported for joining tables.
    - **AND or OR condition**: You can add multiple conditions by clicking on the **+Add more** button below each join. The conditions can be joined by `AND` or `OR` operation.

  <div style={{textAlign: 'center'}}>

  <img className="screenshot-full" src="/img/v2-beta/database/newui/join1.png" alt="JumpStart Database editor" />

  </div>

- **Filter**: Add a condition by choosing a column, an operation, and the value for filtering the records. The operations supported are same as the [filter operations](#available-operations-are) for the **List rows** operation.
- **Sort**: Sort the query response by choosing a column and the order (ascending or descending).
- **Limit**: Limit the number of records to be returned by entering a number. 
- **Offset**: Offset the number of records to be returned by entering a number. This parameter is used for pagination.
- **Select**: Select the columns that you want to return in the query response. By default, all the columns are selected.

  <div style={{textAlign: 'center'}}>

  <img className="screenshot-full" src="/img/v2-beta/database/newui/join2.png" alt="JumpStart Database editor" />

  </div>

:::info
If you have any other questions or feedback about **JumpStart Database**, please reach us out at hello@jumpstart.com or join our **[Slack Community](https://www.jumpstart.com/slack)**
:::
