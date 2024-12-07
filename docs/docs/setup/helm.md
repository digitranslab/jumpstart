---
id: helm
title: Helm
---

# Deploying JumpStart with Helm Chart

This repository contains Helm charts for deploying [JumpStart](https://github.com/digitranslab/helm-charts) on a Kubernetes Cluster using Helm v3. The charts include an integrated PostgreSQL server that is enabled by default. However, you have the option to disable it and configure a different PostgreSQL server by updating the `values.yml` file.

## Installation

### From Helm repo
```bash
helm repo add jumpstart https://github.com/digitranslab/helm-charts.git
helm install jumpstart digitranslab/jumpstart
```

### From the Source
1. Clone the repository and navigate to this directory
2. Run `helm dependency update`
3. It is recommended but optional to modify the values in the `values.yaml` file, such as usernames, passwords, persistence settings, etc.
4. Run `helm install -n $NAMESPACE --create-namespace $RELEASE .`

Remember to replace the variables with your specific configuration values.

## JumpStart Database

JumpStart offers a hosted database solution that allows you to build applications quickly and manage your data effortlessly. The JumpStart database requires no setup and provides a user-friendly interface for data management.

For more information about the JumpStart database, you can visit [here](/docs/jumpstart-db/jumpstart-database).

You need to set up and deploy the PostgREST server, which facilitates querying the JumpStart Database.

## Upgrading to the Latest LTS Version

New LTS versions are released every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [JumpStart Docker Hub](https://hub.docker.com/r/digitranslab/jumpstart/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `digitranslab/jumpstart:ee-lts-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

- Users on versions earlier than **v2.23.0-ee2.10.2** must first upgrade to this version before proceeding to the LTS version.

*If you have any questions feel free to join our [Slack Community](https://jumpstart.com/slack) or send us an email at hello@jumpstart.com.*
