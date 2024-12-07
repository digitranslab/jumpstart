---
id: heroku
title: Heroku
---

# Deploying JumpStart on Heroku

<iframe width="800" height="500" src="https://www.youtube.com/embed/ApDtwE1OXY0" frameborder="0" allowfullscreen width="100%"></iframe>

*If you have any questions feel free to join our [Slack Community](https://jumpstart.com/slack) or send us an email at hello@jumpstart.com.*


### Follow the steps below to deploy JumpStart on Heroku:

1. Click the button below to start one click deployment.  
   <div style={{textAlign: 'center'}}>

   [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/digitranslab/jumpstart/tree/main)

   </div>

2. On Heroku tab, you'll be asked to provide an `App name` and `Choose a region`. Enter the name for your deployment and select the region according to your choice.

<div style={{textAlign: 'center'}}>

 <img className="screenshot-full" src="/img/setup/heroku/appname.png" alt="heroku appname" />
 
</div>

3. Now let's enter the `Config vars` to configure additional [environment variables](/docs/setup/env-vars) that are required for the installation.
   - **LOCKBOX_MASTER_KEY**: JumpStart server uses lockbox to encrypt datasource credentials. You should set the environment variable LOCKBOX_MASTER_KEY with a 32 byte hexadecimal string. If you have OpenSSL installed, you can run the command `openssl rand -hex 32` to generate the key.
   - **NODE_ENV**: By default NODE_ENV is set to production. 
   - **NODE_OPTIONS**: Node options are configured to increase node memory to support app build.
   - **SECRET_KEY_BASE**: JumpStart server uses a secure 64 byte hexadecimal string to encrypt session cookies. You should set the environment variable SECRET_KEY_BASE. If you have OpenSSL installed, you can run the command `openssl rand -hex 64` to generate the key.
   - **JUMPSTART_HOST**: Public URL of JumpStart installation. This is usually `https://<app-name-in-first-step\>.herokuapp.com`.
   - **JUMPSTART_SERVER_URL**: URL of JumpStart server installation. (This is same as the JUMPSTART_HOST for Heroku deployments)


4. Click on `Deploy app` button at the bottom to initiate the build.

5. After the successful build, you'll see two buttons at the bottom: `Manage App` and `View`. Click on the `View` to open the app or click on `Manage App` to configure any settings.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/setup/heroku/build.png" alt="heroku build" />

</div>


:::tip
JumpStart server and client can be deployed as standalone applications. If you do not want to deploy the client on Heroku, modify `package.json` accordingly. We have a [guide](/docs/setup/client) on deploying JumpStart client using services such as Firebase.
:::



### Deploying Jumpstart Database

If you intend to use this feature, you'd have to set up and deploy PostgREST server which helps querying JumpStart Database.

This feature is only enabled if `ENABLE_JUMPSTART_DB` is set to `true` in the Jumpstart application.

#### Follow the steps below to deploy JumpStart Database on Heroku:

:::note
Please install Heroku CLI on your local machine. Please refer Heroku CLI installation steps [**here**](https://devcenter.heroku.com/articles/heroku-cli). 
:::

1. **Create a new Heroku app using the PostgREST buildpack**

 1.1 Create a folder with your app name. Please give a unique name to the app.  

  ```bash
  mkdir ${YOUR_PGRST_APP_NAME}
  cd $${YOUR_PGRST_APP_NAME}
  git init
  ```

  1.2 Add PostgREST buildpack to your app. 
  
  ```bash
  heroku apps:create ${YOUR_PGRST_APP_NAME} --buildpack https://github.com/PostgREST/postgrest-heroku.git
  heroku git:remote -a ${YOUR_PGRST_APP_NAME}
  ```

2. **Attach the Jumpstart app’s PostgreSQL database your Jumpstart database app**

  `${HEROKU_PG_DB_NAME` Should be the name of the PostgreSQL created by the Jumpstart app. 

  You can get the `${HEROKU_PG_DB_NAME` of the Jumpstart application from the Resources tab under Heroku Postgre attachments as shown below. (eg: `${HEROKU_PG_DB_NAME = postgresql-transparent-24158` ). 

  ```bash
  heroku addons:attach ${HEROKU_PG_DB_NAME} -a ${YOUR_PGRST_APP_NAME}
  ```

  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/heroku/PostgreSQL-database.png" alt="PostgreSQL-database" />
  </div>


3. **Create a Procfile**

  :::info
  The Procfile is a simple text file that is named Procfile without a file extension. For example, Procfile.txt is not valid.
  :::

  Please paste the below string within the Procfile file.

  ```bash
  web: PGRST_SERVER_HOST=0.0.0.0 PGRST_SERVER_PORT=${PORT} PGRST_DB_URI=${PGRST_DB_URI:-${DATABASE_URL}} ./postgrest-${POSTGREST_VER}
  ```


4. **Set environment variables**

  You can also refer environment variable [**here**](/docs/setup/env-vars/#enable-jumpstart-database--optional-).

  :::tip
  If you have openssl installed, you can run the following command `openssl rand -hex 32` to generate the value for `PGRST_JWT_SECRET`.

  If this parameter is not specified then PostgREST refuses authentication requests.
  :::

  ```bash
  heroku config:set PGRST_JWT_SECRET=
  heroku config:set POSTGREST_VER=10.0.0 
  ```

  You can also refer environment variable [**here**](/docs/setup/env-vars/#enable-jumpstart-database--optional-).  


5. **Build and deploy your app**

  ```bash
  git add Procfile
  git commit -m "PostgREST on Heroku"
  git push --set-upstream heroku main
  ```

  Your Heroku app should be live at `${YOUR_APP_NAME}.herokuapp.com`. 


6. **Additional environment variables for Jumpstart application**


  Please enter the below env variables in the Jumpstart application, under the setting tab. You can also refer environment variable [**here**](/docs/setup/env-vars/#enable-jumpstart-database--optional-).

## Upgrading to the Latest Version

The latest version includes architectural changes and, hence, comes with new migrations.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest Version:

- It is **crucial to perform a comprehensive backup of your database** before starting the upgrade process to prevent data loss.

- Ensure that your current version is v2.23.0-ee2.10.2 before upgrading. 

- Users on versions earlier than v2.23.0-ee2.10.2 must first upgrade to this version before proceeding to the latest version.

For specific issues or questions, refer to our **[Slack](https://jumpstart.slack.com/join/shared_invite/zt-25438diev-mJ6LIZpJevG0LXCEcL0NhQ#)**.