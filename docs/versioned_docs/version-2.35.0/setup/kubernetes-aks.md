---
id: kubernetes-aks
title: Kubernetes (AKS)
---

# Deploying JumpStart on Kubernetes (AKS)

:::info
You should setup a PostgreSQL database manually to be used by JumpStart. We recommend using Azure Database for PostgreSQL since this guide is for deploying using AKS.
:::

*If you have any questions feel free to join our [Slack Community](https://jumpstart.com/slack) or send us an email at hello@jumpstart.com.*

Follow the steps below to deploy JumpStart on a AKS Kubernetes cluster.

1. Create an AKS cluster and connect to it to start with the deployment. You can follow the steps as mentioned on the [Azure's documentation](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough-portal).

2. Create k8s deployment

   ```bash
     curl -LO https://jumpstart-deployments.s3.us-west-1.amazonaws.com/kubernetes/AKS/deployment.yaml
   ```

Make sure to edit the environment variables in the `deployment.yaml`. We advise to use secrets to setup sensitive information. You can check out the available options [here](https://docs.jumpstart.com/docs/setup/env-vars).

:::info
If there are self signed HTTPS endpoints that Jumpstart needs to connect to, please make sure that `NODE_EXTRA_CA_CERTS` environment variable is set to the absolute path containing the certificates. You can make use of kubernetes secrets to mount the certificate file onto the containers.
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

If you intend to use this feature, you'd have to set up and deploy PostgREST server which helps querying JumpStart Database. Please [follow the instructions here](/docs/setup/env-vars/#enable-jumpstart-database--optional-) for additional environment variables configuration to be done.

1. Setup PostgREST server

   ```bash
     kubectl apply -f https://jumpstart-deployments.s3.us-west-1.amazonaws.com/kubernetes/AKS/postgrest.yaml
   ```

2. Update JumpStart deployment with the appropriate env variables [here](https://jumpstart-deployments.s3.us-west-1.amazonaws.com/kubernetes/AKS/deployment.yaml) and apply the changes.

## Upgrading to the Latest Version

The latest version includes architectural changes and, hence, comes with new migrations.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest Version:

- It is **crucial to perform a comprehensive backup of your database** before starting the upgrade process to prevent data loss.

- Ensure that your current version is v2.23.0-ee2.10.2 before upgrading. 

- Users on versions earlier than v2.23.0-ee2.10.2 must first upgrade to this version before proceeding to the latest version.

For specific issues or questions, refer to our **[Slack](https://jumpstart.slack.com/join/shared_invite/zt-25438diev-mJ6LIZpJevG0LXCEcL0NhQ#)**.
