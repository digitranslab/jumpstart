---
id: mailgun
title: Mailgun
---

JumpStart can connect to your Mailgun account to send emails.

:::info
The Mailgun API Datasource supports for interaction with the mail endpoint of the [Mailgun API](https://documentation.mailgun.com/en/latest/api-intro.html#authentication-1).
:::

<div style={{paddingTop:'24px'}}>

## Connection

To establish a connection with the **Mailgun** data source, click on the **+ Add new data source** button located on the query panel or navigate to the [Data Sources](/docs/data-sources/overview) page from the JumpStart dashboard.

JumpStart requires the following to connect to your Mailgun:
- **API key**

<img class="screenshot-full" src="/img/datasource-reference/mailgun/mailgun-datasource-v3.png" alt="JumpStart - Data source - Mailgun" />

:::tip
Mailgun API key is required to create an Mailgun datasource on JumpStart. You can generate API key by visiting [Mailgun account page](https://app.mailgun.com/app/account/security/api_keys).
:::

</div>

<div style={{paddingTop:'24px'}}>

## Supported Operations

### Email Service

#### Required parameters:

- **Send email to**
- **Send email from**
- **Subject**
- **Body as text**

#### Optional parameters:

- **Body as HTML**

<img class="screenshot-full" src="/img/datasource-reference/mailgun/mailgunQuery.png" alt="JumpStart - Data source - Mailgun Query" />

:::info
**Send mail to** - accepts a single email id. 
For example:
`{{"dev@jumpstart.io"}}`.

**Send mail from** - accepts a string.
For example: `admin@jumpstart.io`
:::

:::tip
**Send a single email to multiple recipients** - The `Send mail to` field can contain an array of recipients, which will send a single email with all of the recipients in the field.

**Send multiple individual emails to multiple recipients** - set <b>Multiple recipients</b> field to `{{true}}` and the `Send mail to` field will be split into multiple emails and send to each recipient.
:::

</div>
