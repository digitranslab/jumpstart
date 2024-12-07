---
id: openshift
title: Openshift
---

# Deploying JumpStart on Openshift

:::info 
You should setup a PostgreSQL database manually to be used by JumpStart.
:::

*If you have any questions feel free to join our [Slack Community](https://jumpstart.com/slack) or send us an email at hello@jumpstart.com.*

Follow the steps below to deploy JumpStart on Openshift.

1. Setup a PostgreSQL database JumpStart uses a postgres database as the persistent storage for storing data related to users and apps. We do not have plans to support other databases such as MySQL.

2. Create a Kubernetes secret with name `server`. For the minimal setup, JumpStart requires `pg_host`, `pg_db`, `pg_user`, `pg_password`, `secret_key_base` & `lockbox_key` keys in the secret.

Read **[environment variables reference](https://docs.jumpstart.com/docs/setup/env-vars)**

3. Once you have logged into the Openshift developer dashboard click on `+Add` tab. Select import YAML from the local machine.

:::note
When entering one or more files and use --- to separate each definition
:::

Copy paste deployment.yaml to the online editor 

```
https://raw.githubusercontent.com/digitranslab/jumpstart/main/deploy/openshift/deployment.yaml
```


Copy paste the service.yaml to the online editor

```
https://raw.githubusercontent.com/digitranslab/jumpstart/main/deploy/openshift/service.yaml
```

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/setup/openshift/online-yaml-editor.png" alt="online yaml editor" />
 
</div>

Once you have added the files click on create.

:info
If there are self signed HTTPS endpoints that Jumpstart needs to connect to, please make sure that `NODE_EXTRA_CA_CERTS` environment variable is set to the absolute path containing the certificates. You can make use of kubernetes secrets to mount the certificate file onto the containers.
:::


4. Navigate to topology tab and use the visual connector to establish the connect between jumpstart-deployment and postgresql as shown in the screenshot below. 

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/setup/openshift/toplogy.png" alt="toplogy" />
 
</div>

## JumpStart Database

You can know more about jumpstart database [here](https://docs.jumpstart.com/docs/jumpstart-database)

If you intend to use this feature, you'd have to set up and deploy PostgREST server which helps querying JumpStart Database. Please [follow the instructions here](https://docs.jumpstart.com/docs/setup/env-vars/#enable-jumpstart-database--optional-) for additional environment variables configuration to be done.

```
https://raw.githubusercontent.com/digitranslab/jumpstart/main/deploy/openshift/postgrest.yaml
```

## Upgrading to the Latest Version

The latest version includes architectural changes and, hence, comes with new migrations.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest Version:

- It is **crucial to perform a comprehensive backup of your database** before starting the upgrade process to prevent data loss.

- Ensure that your current version is v2.23.0-ee2.10.2 before upgrading. 

- Users on versions earlier than v2.23.0-ee2.10.2 must first upgrade to this version before proceeding to the latest version.

For specific issues or questions, refer to our **[Slack](https://jumpstart.slack.com/join/shared_invite/zt-25438diev-mJ6LIZpJevG0LXCEcL0NhQ#)**.