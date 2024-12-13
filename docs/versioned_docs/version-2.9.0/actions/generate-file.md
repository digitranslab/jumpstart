---
id: generate-file
title: Generate file
---

# Generate file

This action allows you to construct files on the fly and let users download it.

## Options

| Option | Description |
|--------|-------------|
| Type   | Type of file to be generated. Types: `CSV` and `Text` |
| File name | Name of the file to be generated |
| Data | Data that will be used to construct the file. Its format will depend on the file type, as specified in the following section |
| Debounce | Debounce field is empty by default, you can enter a numerical value to specify the time in milliseconds after which the action will be performed. ex: `300` |

:::tip
Check how to run **[generate file action using RunJS](/docs/how-to/run-actions-from-runjs/#generate-file)**.
:::

### CSV Data Format

To use the `CSV` file format, the data field should contain an array of objects. JumpStart assumes that the keys in each object are the same and represent the column headers of the CSV file.

Example:

```javascript
{{
  [
    { name: 'John', email: 'john@jumpstart.com' },
    { name: 'Sarah', email: 'sarah@jumpstart.com' },
  ]
}}
```

Using the above code snippet will generate a CSV file with the following content:

```csv
name,email
John,john@jumpstart.com
Sarah,sarah@jumpstart.com
```

### Text Data Format

To use the `Text` file format, the data field should contain a string. 

If you want to generate a text file based on an array of objects, you need to stringify the data before providing it. 

For example, if you are using the table component to provide the data, you can enter **`{{JSON.stringify(components.table1.currentPageData)}}`** in the Data field.
