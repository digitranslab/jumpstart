---
id: ecs
title: AWS ECS
---

# Deploying JumpStart on Amazon ECS

:::info
You should setup a PostgreSQL database manually to be used by JumpStart.
:::

You can effortlessly deploy Amazon Elastic Container Service (ECS) by utilizing a [CloudFormation template](https://aws.amazon.com/cloudformation/):

To deploy all the services at once, simply employ the following template:

```
curl -LO https://jumpstart-deployments.s3.us-west-1.amazonaws.com/cloudformation/Cloudfomation-template-one-click.yml
```

If you already have existing services and wish to integrate JumpStart seamlessly into your current Virtual Private Cloud (VPC) or other setups, you can opt for the following template:

```
curl -LO https://jumpstart-deployments.s3.us-west-1.amazonaws.com/cloudformation/Cloudformation-deploy.yml
``` 

<div style={{paddingTop:'24px'}}>

## Redis

:::info
JumpStart requires configuring Redis which is used for enabling multiplayer editing and for background jobs.
:::

To deploy Redis on an ECS cluster, please follow the steps outlined below.

Please note that if you already have an existing Redis setup, you can continue using it. However, if you need to create a new Redis service, you can follow the steps provided below.

- Create a new take definition 
  <img className="screenshot-full" src="/img/setup/ecs/ecs-1.png" alt="ECS Setup" />

- Please add container and image tag as shown below: <br/>
  **Make sure that you are using redis version 6.x.x**
  <img className="screenshot-full" src="/img/setup/ecs/ecs-2.png" alt="ECS Setup" />

- Ensure that when creating a service, Redis is integrated into the same cluster where your JumpStart app will be deployed. <br/>
  **Note: Please enable public IP**
  <img className="screenshot-full" src="/img/setup/ecs/ecs-3.png" alt="ECS Setup" />

</div>

<div style={{paddingTop:'24px'}}>

## JumpStart

Follow the steps below to deploy JumpStart on a ECS cluster.

1. Setup a PostgreSQL database, JumpStart uses a postgres database as the persistent storage for storing data related to users and apps.
2. Create a target group and an application load balancer to route traffic onto JumpStart containers. You can [reference](https://docs.aws.amazon.com/AmazonECS/latest/userguide/create-application-load-balancer.html) AWS docs to set it up. Please note that JumpStart server exposes `/api/health`, which you can configure for health checks.
3. Create task definition for deploying JumpStart app as a service on your preconfigured cluster.
    1. Select Fargate as launch type compatibility
    2. Configure IAM roles and set operating system family as Linux. 
    3. Select task size to have 3GB of memory and 1vCpu
        <img className="screenshot-full" src="/img/setup/ecs/ecs-4.png" alt="ECS Setup" />
    4. Add container details that is shown: <br/>
       Specify your container name ex: `JumpStart` <br/>
       Set the image you intend to deploy. ex: `digitranslab/jumpstart:ee-lts-latest` <br/>
       Update port mappings at container port `3000` for tcp protocol. 
        <img className="screenshot-full" src="/img/setup/ecs/ecs-5.png" alt="ECS Setup" />

        Specify environmental values for the container. You'd want to make use of secrets to store sensitive information or credentials, kindly refer the AWS [docs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html) to set it up. You can also store the env in S3 bucket, kindly refer the AWS [docs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/taskdef-envfiles.html) . 
        <img className="screenshot-full" src="/img/setup/ecs/ecs-6.png" alt="ECS Setup" />

        :::info
        For the setup, JumpStart requires:
        <ul> 
        - **JUMPSTART_DB** 
        - **JUMPSTART_DB_HOST**
        - **JUMPSTART_DB_USER**
        - **JUMPSTART_DB_PASS**
        - **PG_HOST**
        - **PG_DB**
        - **PG_USER**
        - **PG_PASS**
        - **SECRET_KEY_BASE** 
        - **LOCKBOX_KEY**
        </ul>
        <br/>
        Read **[environment variables reference](/docs/setup/env-vars)**
        :::

        Additionally, include the Redis environment variables within the JumpStart container mentioned above if you have followed the previous steps to create Redis.
        ```
        REDIS_HOST=<public ip of redis task>
        REDIS_PORT=6379
        REDIS_USER=default
        REDIS_PASSWORD=
        ```
    5. Make sure `Use log collection checked` and `Docker configuration` with the command `npm run start:dev`
        <img className="screenshot-full" src="/img/setup/ecs/ecs-8.png" alt="ECS Setup" />

4. Create a service to run your task definition within your cluster.

  - Select the cluster which you have created
  - Select launch type as Fargate 
    <img className="screenshot-full" src="/img/setup/ecs/ecs-9.png" alt="ECS Setup" />
  - Select the cluster and set the service name
  - You can set the number of tasks to start with as two
  - Rest of the values can be kept as default
    <img className="screenshot-full" src="/img/setup/ecs/ecs-10.png" alt="ECS Setup" />
  - Click on next step to configure networking options
  - Select your designated VPC, Subnets and Security groups. Kindly ensure that the security group allows for inbound traffic to http port 3000 for the task.
    <img className="screenshot-full" src="/img/setup/ecs/ecs-11.png" alt="ECS Setup" />
  - Since migrations are run as a part of container boot, please specify health check grace period for 900 seconds. Select the application loadbalancer option and set the target group name to the one we had created earlier. This will auto populate the health check endpoints.

:::info
The setup above is just a template. Feel free to update the task definition and configure parameters for resources and environment variables according to your needs.
:::

</div>

<div style={{paddingTop:'24px'}}>

## JumpStart Database

To use JumpStart Database, you'd have to set up and deploy PostgREST server which helps querying JumpStart Database. You can learn more about this feature [here](/docs/jumpstart-db/jumpstart-database).

Deploying JumpStart Database is mandatory from JumpStart 3.0 or else the migration might break, checkout the following docs to know more about new major version, including breaking changes that require you to adjust your applications accordingly:
- [Self Hosted](./upgrade-to-v3.md)
- [Cloud](./cloud-v3-migration.md)

Follow the steps below to deploy PostgREST on a ECS cluster. 

1. Create a new take definition

  <div style={{textAlign: 'center'}}>

  <img className="screenshot-full" src="/img/setup/ecs/ecs-12.png" alt="ECS Setup" />

  </div>
  
  Add the container details and image tag as shown below:

  <div style={{textAlign: 'center'}}>

  <img className="screenshot-full" src="/img/setup/ecs/ecs-13.png" alt="ECS Setup" />

  </div>
  
  Under environmental variable please add corresponding PostgREST env variables. You can also refer [env variable](/docs/setup/env-vars/#postgrest-server-required).

  <div style={{textAlign: 'center'}}>

  <img className="screenshot-full" src="/img/setup/ecs/ecs-14.png" alt="ECS Setup" />

  </div>


2. Create service and make sure the postgrest is within the same cluster as JumpStart app. 

  <div style={{textAlign: 'center'}}>

  <img className="screenshot-full" src="/img/setup/ecs/ecs-15.png" alt="ECS Setup" />

  </div>


3. Specify a service name and leave the remaining settings at their default configurations.

  <div style={{textAlign: 'center'}}>

  <img className="screenshot-full" src="/img/setup/ecs/ecs-16.png" alt="ECS Setup" />

  </div>

4. Ensure that the PostgREST service resides within the same Virtual Private Cloud (VPC), and confirm that port 3001 is included in the security group used by the JumpStart app. **Note: Please enable public IP**

  <div style={{textAlign: 'center'}}>

  <img className="screenshot-full" src="/img/setup/ecs/ecs-17.png" alt="ECS Setup" />

  </div>

Update JumpStart deployment with the appropriate env variables [here](/docs/setup/env-vars/#enable-jumpstart-database-required) and apply the changes.

</div>

## Upgrading to the Latest LTS Version

New LTS versions are released every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [JumpStart Docker Hub](https://hub.docker.com/r/digitranslab/jumpstart/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `digitranslab/jumpstart:ee-lts-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

- Users on versions earlier than **v2.23.0-ee2.10.2** must first upgrade to this version before proceeding to the LTS version.

*If you have any questions feel free to join our [Slack Community](https://jumpstart.com/slack) or send us an email at hello@jumpstart.com.*
