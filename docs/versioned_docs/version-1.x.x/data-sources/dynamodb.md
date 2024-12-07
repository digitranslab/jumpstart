---
id: dynamodb
title: DynamoDB
---

# DynamoDB

JumpStart can connect to DynamoDB to read and write data.

## Connection

To add a new DynamoDB, click on the `+` button on data sources panel at the left-bottom corner of the app editor. Select DynamoDB from the modal that pops up.

JumpStart requires the following to connect to your DynamoDB.

- **Region**
- **Access key**
- **Secret key**

It is recommended to create a new IAM user for the database so that you can control the access levels of JumpStart.

<img className="screenshot-full" src="/img/datasource-reference/dynamo-connect.png" alt="JumpStart - Dynamo connection" height="250"/>


Click on 'Test connection' button to verify if the credentials are correct and that the database is accessible to JumpStart server. Click on 'Save' button to save the data source.

## Querying DynamoDB

Click on `+` button of the query manager at the bottom panel of the editor and select the database added in the previous step as the data source. Select the operation that you want to perform and click 'Save' to save the query.

<img className="screenshot-full" src="/img/datasource-reference/dynamo-query.png" alt="JumpStart - Dynamo query" height="250"/>


Click on the 'run' button to run the query. NOTE: Query should be saved before running.

:::tip
Query results can be transformed using transformations. Read our transformations documentation to see how: [link](/docs/tutorial/transformations)
:::
