---
id: kubernetes-aks
title: Kubernetes (AKS)
---

# Deploying JumpStart on Kubernetes (AKS)

:::info
You should setup a PostgreSQL database manually to be used by JumpStart. We recommend using Azure Database for PostgreSQL since this guide is for deploying using AKS.
:::

Follow the steps below to deploy JumpStart on a AKS Kubernetes cluster.

1. Create an AKS cluster and connect to it to start with the deployment. You can follow the steps as mentioned on the [Azure's documentation](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough-portal).

2. Create k8s deployment

   ```bash
     curl -LO https://jumpstart-deployments.s3.us-west-1.amazonaws.com/kubernetes/AKS/deployment.yaml
   ```

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

Make sure to edit the environment variables in the `deployment.yaml`. We advise to use secrets to setup sensitive information. You can check out the available options [here](/docs/setup/env-vars).

:::info
If there are self signed HTTPS endpoints that JumpStart needs to connect to, please make sure that `NODE_EXTRA_CA_CERTS` environment variable is set to the absolute path containing the certificates. You can make use of kubernetes secrets to mount the certificate file onto the containers.
:::

3. Create k8s service and reserve a static IP and expose it via a service load balancer as mentioned in the [doc](https://docs.microsoft.com/en-us/azure/aks/static-ip). You can refer `service.yaml`.
   ```bash
    curl -LO https://jumpstart-deployments.s3.us-west-1.amazonaws.com/kubernetes/AKS/service.yaml
   ```

4. Apply YAML configs

   ```bash
    kubectl apply -f deployment.yaml, service.yaml
   ```

You will be able to access your JumpStart installation once the pods and services running.

## JumpStart Database

To use JumpStart Database, you'd have to set up and deploy PostgREST server which helps querying JumpStart Database. Please [follow the instructions here](/docs/setup/env-vars/#enable-jumpstart-database-required).

1. Setup PostgREST server

   ```bash
     kubectl apply -f https://jumpstart-deployments.s3.us-west-1.amazonaws.com/kubernetes/AKS/postgrest.yaml
   ```

2. Update JumpStart deployment with the appropriate env variables [here](https://jumpstart-deployments.s3.us-west-1.amazonaws.com/kubernetes/AKS/deployment.yaml) and apply the changes.

## Upgrading to the Latest LTS Version

New LTS versions are released every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [JumpStart Docker Hub](https://hub.docker.com/r/digitranslab/jumpstart/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `digitranslab/jumpstart:EE-LTS-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

- Users on versions earlier than **v2.23.0-ee2.10.2** must first upgrade to this version before proceeding to the LTS version.

*If you have any questions feel free to join our [Slack Community](https://jumpstart.com/slack) or send us an email at hello@jumpstart.com.*
