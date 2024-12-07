---
id: jumpstart-subpath
title: Deploying JumpStart on a subpath
---

JumpStart can now be deployed at a subpath rather than the root (`/`) of a public domain. Example subpath installation URL: **`http://www.yourcompany.com/apps/jumpstart`**

You'll need to setup the following environment variables if JumpStart installation is on a domain subpath:

| variable | value |
| -------- | ---------------------- |
| JUMPSTART_HOST | the public URL ( eg: https://www.yourcompany.com )  |
| SUB_PATH | Set a subpath to this variable. The subpath is to be set with trailing `/` and is applicable only when the server is serving the frontend client. ( eg: `/apps/jumpstart/` )  |


:::info
See all **[Environment Variables](/docs/setup/env-vars)** here.
:::

## Upgrading to the Latest Version

The latest version includes architectural changes and, hence, comes with new migrations.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest Version:

- It is **crucial to perform a comprehensive backup of your database** before starting the upgrade process to prevent data loss.

- Ensure that your current version is v2.23.0-ee2.10.2 before upgrading. 

- Users on versions earlier than v2.23.0-ee2.10.2 must first upgrade to this version before proceeding to the latest version.

*If you have any questions feel free to join our [Slack Community](https://jumpstart.com/slack) or send us an email at hello@jumpstart.com.*