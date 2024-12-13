---
id: delete-multiple-rows
title: Delete multiple rows in table
---

The table component in the JumpStart has the option for bulk selection of rows that can have various use cases such as **updating** or **deleting** records. However, the datasources does not support bulk delete or bulk update operations. 

In this guide, we will learn how we can delete multiple rows in a table. We have assumed that you have successfully connected the data source. For this guide, we will be using the PostgreSQL data source as an example database, currently, this workaround can be used only for PostgreSQL and MySQL.

## 1. Create a query to fetch the data from the database

Create a new query, name it `getRecords` and use SQL mode:
```sql
SELECT * FROM jumpstart // replace jumpstart with your table name
```

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/how-to/delete-rows/getRecords.png" alt="How-to: Delete multiple rows in table" />

</div>

<br/>

Enable the **Run the query on application load?** option. This will ensure that the query is executed when the application is loaded. 

## 2. Load the data on the table

Now, we will load the data on the table. For this, we will use the `getRecords` query that we created in the previous step. Drag the table component from the right sidebar and drop it on the canvas. 

On table properties, go to the table data property and set the value to `{{queries.getRecords.data}}`. This will load the data from the `getRecords` query on the table. 

Run the query and you should see the data loaded on the table.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/how-to/delete-rows/querydata.png" alt="How-to: Delete multiple rows in table" />

</div>

<br/>

## 3. Enable bulk row selection on table

Now, we will enable the bulk row selection on the table. For this, go to the table properties and enable the **Bulk selection** option. Enabling this option will allow you to select multiple rows on the table. This option is disabled by default.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/how-to/delete-rows/bulkselection.png" alt="How-to: Delete multiple rows in table" />

</div>

<br/>

## 4. Create a custom javascript query

Now, we will create a custom javascript query that will **generate a SQL statement** to delete the selected rows from the table component based on a list of selected IDs, assuming the IDs are stored in the **id** column and that the name of the table component is **table1**. The actual database name should be replaced with **jumpstart** as indicated in the SQL statemnent in the code below:

```js
const uniqueIdentifier = "id";
const idsToDelete = Object.values(components.table1.selectedRows).map(dataUpdate => dataUpdate[uniqueIdentifier]);

const idsString = idsToDelete.map(id => `'${id}'`).join(', ');

const SQL = `DELETE FROM jumpstart WHERE ${uniqueIdentifier} IN (${idsString});`;

return SQL;
```

If you click on the **Preview** button, you should see the SQL statement generated by the query:

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/how-to/delete-rows/runjs.png" alt="How-to: Delete multiple rows in table" />

</div>

<br/>

Now, let's select a few rows on the table and then preview the SQL query generated by the javascript query:

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/how-to/delete-rows/runjs1.png" alt="How-to: Delete multiple rows in table" />

</div>

<br/>

## 5. Create a new query to delete the rows

Now, we will create a new query to delete the rows from the table. Create a new query, name it `delete` and use SQL mode:

```sql
{{queries.runjs1.data}} // replace runjs1 with the name of the javascript query
```

In this query, we are dynamically loading the SQL statement generated by the javascript query.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/how-to/delete-rows/delete.png" alt="How-to: Delete multiple rows in table" />

</div>

<br/>

## 6. Add a button to delete the selected rows

Now, we will add a button to delete the selected rows from the table. Drag the button component from the right sidebar and drop it on the canvas. Edit its properties and set the **Button text** to **Delete**. 

Add a new **Event** to the button on **On click** event to trigger the **Run Query** action and select the `runjs1` query that we created in the previously.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/how-to/delete-rows/button.png" alt="How-to: Delete multiple rows in table" />

</div>

<br/> 

Optionally, we can add a loading state to the button whenever the `delete` or `getRecords` query is running:
```js
{{queries.delete.isLoading || queries.getRecords.isLoading}}
```

Now, whenever you click on the button, the javascript query will generate a SQL statement to delete the selected rows from the table but to delete the rows from the database, we need to add event handler to the **runjs1** query to trigger the **delete** query whenever the `runjs1` query is **executed and successfull**.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/how-to/delete-rows/eventrunjs.png" alt="How-to: Delete multiple rows in table" />

</div>

<br/> 

Now, whenever you click on the button, the javascript query will generate a delete SQL statement with selected rows on the table and the `delete` query will delete the rows from the database.

Similarly, you can add an Event to the **delete** query to trigger the **getRecords** query whenever the `delete` query is executed and successful. This will ensure that the table is updated with the latest data from the database.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/how-to/delete-rows/eventdelete.png" alt="How-to: Delete multiple rows in table" />

</div>

<br/> 

## 7. Preview the application

The application is now ready. Click on the **Preview** button on the topbar of the app builder to preview the application. 