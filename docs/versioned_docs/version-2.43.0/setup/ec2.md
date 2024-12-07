---
id: ec2
title: AWS EC2
---

# Deploying JumpStart on Amazon EC2

:::info
You should setup a PostgreSQL database manually to be used by the JumpStart server.
:::

*If you have any questions feel free to join our [Slack Community](https://jumpstart.com/slack) or send us an email at hello@jumpstart.com.*

You can effortlessly deploy Amazon Elastic Compute Cloud Service (EC2) by utilizing a **CloudFormation template**. This template will deploy all the services required to run JumpStart on AWS EC2 instances. 

To deploy all the services at once, simply employ the following template:
```
curl -LO https://jumpstart-deployments.s3.us-west-1.amazonaws.com/cloudformation/EC2-cloudfomration.yml
```

Follow the steps below to deploy JumpStart on AWS EC2 instances.

1. Setup a PostgreSQL database and make sure that the database is accessible from the EC2 instance.

2. Login to your AWS management console and go to the EC2 management page.

3. Under the `Images` section, click on the `AMIs` button.

4. Find the [JumpStart version](https://github.com/digitranslab/jumpstart/releases) you want to deploy. Now, from the AMI search page, select the search type as "Public Images" and input the version you'd want `AMI Name : jumpstart_vX.X.X.ubuntu_bionic` in the search bar.

5. Select JumpStart's AMI and bootup an EC2 instance.

  Creating a new security group is recommended. For example, if the installation should receive traffic from the internet, the inbound rules of the security group should look like this:

   protocol| port     | allowed_cidr|
   ----| -----------  | ----------- |
   tcp | 22           | your IP |
   tcp | 80           | 0.0.0.0/0 |
   tcp | 443          | 0.0.0.0/0   |


6. Once the instance boots up, SSH into the instance by running `ssh -i <path_to_pem_file> ubuntu@<public_ip_of_the_instance>`

7. Switch to the app directory by running `cd ~/app`. Modify the contents of the `.env` file. ( Eg: `vim .env` )

   The default `.env` file looks like this:
   ```bash
   JUMPSTART_HOST=http://<example>
   LOCKBOX_MASTER_KEY=<example>
   SECRET_KEY_BASE=<example>
   PG_DB=jumpstart_prod
   PG_USER=<pg user name>
   PG_HOST=<pg host>
   PG_PASS=<pg user password>
   ```
   Read **[environment variables reference](/docs/setup/env-vars)**

   :::info
   If there are self signed HTTPS endpoints that Jumpstart needs to connect to, please make sure that `NODE_EXTRA_CA_CERTS` environment variable is set to the absolute path containing the certificates.
   :::

8. `JUMPSTART_HOST` environment variable determines where you can access the JumpStart client. It can either be the public ipv4 address of your instance or a custom domain that you want to use.

   Examples:
   `JUMPSTART_HOST=http://12.34.56.78` or
   `JUMPSTART_HOST=https://yourdomain.com` or
   `JUMPSTART_HOST=https://jumpstart.yourdomain.com`

   :::info
   We use a [lets encrypt](https://letsencrypt.org/) plugin on top of nginx to create TLS certificates on the fly.
   :::

   :::info
   Please make sure that `JUMPSTART_HOST` starts with either `http://` or `https://`
   :::

9. Once you've configured the `.env` file, run `./setup_app`. This script will install all the dependencies of JumpStart and then will start the required services.

10. If you've set a custom domain for `JUMPSTART_HOST`, add a `A record` entry in your DNS settings to point to the IP address of the EC2 instance.

12. You're all done, JumpStart client would now be served at the value you've set in `JUMPSTART_HOST`.

#### Deploying Jumpstart Database

JumpStart AMI comes inbuilt with PostgREST. If you intend to use this feature, you'd only have to setup the environment variables in `~/app/.env` file and run `./setup_app` script.

You can learn more about this feature [here](/docs/jumpstart-database).

## Upgrading to the Latest LTS Version

New LTS versions are released every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [JumpStart Docker Hub](https://hub.docker.com/r/digitranslab/jumpstart/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `digitranslab/jumpstart:EE-LTS-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

- Users on versions earlier than **v2.23.0-ee2.10.2** must first upgrade to this version before proceeding to the LTS version.

For specific issues or questions, refer to our **[Slack](https://jumpstart.slack.com/join/shared_invite/zt-25438diev-mJ6LIZpJevG0LXCEcL0NhQ#)**.






