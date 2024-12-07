---
id: google-cloud-run
title: Google Cloud Run
---

# Deploying JumpStart on Google Cloud Run

:::info
You should setup a PostgreSQL database manually to be used by JumpStart.
:::

*If you have any questions feel free to join our [Slack Community](https://jumpstart.com/slack) or send us an email at hello@jumpstart.com.*

Follow the steps below to deploy JumpStart on Cloud run with `gcloud` CLI.


## Deploying JumpStart application
1. Create a new Google Cloud Run Service:

<div style={{textAlign: 'left'}}>
  <img className="screenshot-full" src="/img/cloud-run/google-cloud-run-setup.png" alt="Google Cloud Run New Setup" />
</div>

2. Ingress and Authentication can be set as shown below, to begin with. Feel free to change the security configurations as per you see fit.

  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/cloud-run/ingress-auth.png" alt="ingress-auth" />
  </div>

3. Under containers tab, please make sure the port is set to 3000 and command `npm, run, start:prod` is entered in container argument field with CPU capacity set to 2GiB:

  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/cloud-run/port-and-capacity-postgrest-v2.png" alt="port-and-capacity-jumpstart" />
  </div>


- If the command mentioned above is not compatible, please use the following command structure instead:

 <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/cloud-run/port-and-capacity-postgrest-alternative-command.png" alt="port-and-capacity-jumpstart-alternative-command" />
  </div>

- Should you encounter any migration issues, please execute the following command. Be aware that executing this command may cause the revision to break. However, modifying the command back to `npm, run, start:prod` will successfully reboot the instance:

 <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/cloud-run/port-and-capacity-postgrest-migration-fix-command.png" alt="port-and-capacity-jumpstart-migration-fix-command" />
  </div>

4. Under environmental variable please add the below JumpStart application variables. You can also refer env variable [**here**](/docs/setup/env-vars). 

  Update `JUMPSTART_HOST` environment variable if you want to use the default url assigned with Cloud run after the initial deploy.

  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/cloud-run/env-variable-jumpstart.png" alt="env-variable-jumpstart" />
  </div>

:::tip
If you are using [Public IP](https://cloud.google.com/sql/docs/postgres/connect-run) for Cloud SQL, then database host connection (value for `PG_HOST`) needs to be set using unix socket format, `/cloudsql/<CLOUD_SQL_CONNECTION_NAME>`.  
:::


5. Please go to the connection tab. Under Cloud SQL instance please select the PostgreSQL database which you have set-up.

  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/cloud-run/cloud-SQL-jumpstart.png" alt="cloud-SQL-jumpstart" />
  </div>


Click on deploy once the above parameters are set. 

:::info
Once the Service is created and live, to make the  Cloud Service URL public. Please follow the steps [**here**](https://cloud.google.com/run/docs/securing/managing-access) to make the service public.
:::

### Deploying JumpStart Database 

If you intend to use this feature, you'd have to set up and deploy PostgREST server which helps querying JumpStart Database.

#### PostgREST server 

1. Cloud Run requires prebuilt image to be present within cloud registry. You can pull specific PostgREST image from docker hub and then tag with your project to push it to cloud registry.

   ```bash
   gcloud auth configure-docker
   docker pull postgrest/postgrest:v10.1.1.20221215
   docker tag postgrest/postgrest:v10.1.1.20221215 gcr.io/jumpstart-test-338806/postgrest/postgrest:v10.1.1.20221215
   docker push gcr.io/jumpstart-test-338806/postgrest/postgrest:v10.1.1.20221215
   ```
  
  Please run the above command by launching googleCLI which will help to push the PostgREST image to Google container registry. 

  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/cloud-run/CLI.png" alt="CLI" />
  </div>


2. Once the PostgREST image is pushed. Click on create service.

  Select and add the pushed PostgREST image as shown in below.

  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/cloud-run/create-service-cloud-run-postgrest.png" alt="create-service-cloud-run-postgrest" />
  </div>  


3. Ingress and Authentication can be set as shown below, to begin with. Feel free to change the security configurations as per you see fit.

  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/cloud-run/ingress-auth.png" alt="ingress-auth" />
  </div>


4. Under containers tab, please make sure the port is set 3000 and CPU capacity is set to 1GiB.

  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/cloud-run/port-and-capacity-postgrest.png" alt="port-and-capacity-postgrest" />
  </div>
  
5. Under environmental variable please add corresponding JumpStart database env variables. You can also refer [env variable](/docs/setup/env-vars/#enable-jumpstart-database--optional-).

6. Please go to connection tab. Under Cloud SQL instance please select the PostgreSQL database which you have set-up for JumpStart application or the separate PostgreSQL database created respective to JumpStart Database from the drop-down option.


  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/cloud-run/Cloud-SQL-instance.png" alt="Cloud-SQL-instance" />
  </div>
  

Click on deploy once the above parameters are set. 

:::info
Once the Service is created and live, to make the  Cloud Service URL public. Please follow the steps [**here**](https://cloud.google.com/run/docs/securing/managing-access) to make the service public.
:::



7. Additional Environmental variable to be added to JumpStart application or JumpStart Server connect to PostgREST server. You can also refer env variable [**here**](/docs/setup/env-vars/#enable-jumpstart-database--optional-)


  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/cloud-run/env-for-jumpstart.png" alt="env-for-jumpstart" />
  </div>


## Upgrading to the Latest LTS Version

New LTS versions are released every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [JumpStart Docker Hub](https://hub.docker.com/r/digitranslab/jumpstart/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `digitranslab/jumpstart:EE-LTS-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

- Users on versions earlier than **v2.23.0-ee2.10.2** must first upgrade to this version before proceeding to the LTS version.

For specific issues or questions, refer to our **[Slack](https://jumpstart.slack.com/join/shared_invite/zt-25438diev-mJ6LIZpJevG0LXCEcL0NhQ#)**.