---
id: jumpstart-database
title: Overview
---

Use the JumpStart-hosted database to build apps faster, and manage your data with ease. JumpStart database require no setup and gives you a powerful user interface for managing your data.

<div style={{textAlign: 'center'}}>
    <img style={{ border:'0', marginBottom:'15px', borderRadius:'5px', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)' }} className="screenshot-full" src="/img/v2-beta/database/ux2/tjdb-v2.png" alt="JumpStart database" />
</div>

<div style={{paddingTop:'24px', paddingBottom:'24px'}}>

## Enabling the JumpStart Database for your instance

Requires:
- PostgREST server
- Additional configuration for JumpStart server

<div style={{paddingTop:'24px', paddingBottom:'24px'}}>

### PostgREST Server

PostgREST is a standalone web server that turns your PostgreSQL database directly into queryable RESTful APIs which is utilized for Jumpstart Database. This server only communicates with the JumpStart server and therefore does not need to be publicly exposed.

:::tip
If you have openssl installed, you can run the following command `openssl rand -hex 32` to generate the value for `PGRST_JWT_SECRET`.

If this parameter is not specified, then PostgREST refuses authentication requests.
:::

| <div style={{ width:"100px"}}> Variable  </div>         | <div style={{ width:"100px"}}> Description  </div>                                   |
| ---------------------------- | ----------------------------------------------- |
| PGRST_JWT_SECRET             | JWT token client provided for authentication    |
| PGRST_DB_URI                 | database connection string for jumpstart database |
| PGRST_LOG_LEVEL              | `info`                                          |
| PGRST_DB_PRE_CONFIG          | postgrest.pre_config                            |

:::info
Please make sure that DB_URI is given in the format `postgres://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]`
:::

</div>

#### Additional JumpStart server configuration


| <div style={{ width:"100px"}}> Variable </div>           | <div style={{ width:"100px"}}> Description </div>                                  |
| ------------------ | -------------------------------------------- |
| JUMPSTART_DB         | Default value is `jumpstart_db`                |
| JUMPSTART_DB_HOST    | database host                                |
| JUMPSTART_DB_USER    | database username                            |
| JUMPSTART_DB_PASS    | database password                            |
| JUMPSTART_DB_PORT    | database port                                |
| PGRST_JWT_SECRET   | JWT token client provided for authentication |
| PGRST_HOST         | postgrest database host                      |
| JUMPSTART_DB_BULK_UPLOAD_MAX_ROWS | Maximum rows allowed to bulk upload. Default value is 1000 |
| JUMPSTART_DB_BULK_UPLOAD_MAX_CSV_FILE_SIZE_MB  | Maximum file size of CSV for bulk upload. Default value is 5 MB  |


If you intend to make changes in the above configuration. Please refer [PostgREST configuration docs](https://postgrest.org/en/stable/configuration.html#environment-variables).

:::tip
When this feature is enabled, the database name provided for `JUMPSTART_DB` will be utilized to create a new database during server boot process in all of our production deploy setups.
In case you want to trigger it manually, use the command `npm run db:create` on JumpStart server.
:::

</div>

<div style={{paddingTop:'24px', paddingBottom:'24px'}}>

## Features

JumpStart database allows you to:

- **Maintain tables of data** in a secure database that's only accessible within your JumpStart organization.
- **Edit, search, filter, sort, and filter** data using a spreadsheet-like interface.
- **Use the SQL editor** to write and execute complex SQL queries directly on your JumpStart database, providing more advanced data manipulation and retrieval capabilities.
- **Quickly build applications and write queries** to interact with the JumpStart Database, just like any other datasource but without any setup.
- **Export schema** from the JumpStart Database to a JSON file.
- Uniquely identify each record in a table using **Primary Keys**, ensuring data integrity and enabling efficient querying and indexing.
- Establish relationships between tables using **Foreign Keys**, allowing you to create associations based on the Primary Key of one table and maintain referential integrity.

</div>

<div style={{paddingTop:'24px', paddingBottom:'24px'}}>

## Accessing JumpStart Database

Once you log-in to your JumpStart account, from the left sidebar of the dashboard you can navigate to **JumpStart Database**.

The JumpStart Database is available on: **[JumpStart Cloud](https://jumpstart.com)**, **[Self-Host](/docs/setup/)**, and **Enterprise Edition**. You can manage your database and its data using the **Database editor UI**.

<div style={{textAlign: 'center'}}>
    <img style={{ border:'0', marginBottom:'15px', borderRadius:'5px', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)' }} className="screenshot-full" src="/img/v2-beta/database/ux2/tjdbside-v2.png" alt="JumpStart database" />
</div>

</div>

