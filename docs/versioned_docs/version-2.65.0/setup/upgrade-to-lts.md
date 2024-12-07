---
id: upgrade-to-lts
title: Upgrading JumpStart to the LTS Version

---

JumpStart has released its first Long Term Support (LTS) version, which provides extended support and stability for your environments. Upgrading to this LTS version ensures you benefit from the latest features and security updates while maintaining a stable and supported environment.

### Check the latest LTS Version

JumpStart will be releasing new LTS versions every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [JumpStart Docker Hub](https://hub.docker.com/r/digitranslab/jumpstart/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `digitranslab/jumpstart:EE-LTS-latest`.

### Prerequisites

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

- Users on versions earlier than **v2.23.0-ee2.10.2** must first upgrade to this version before proceeding to the LTS version.

### Upgrade Process

The upgrade process depends on your deployment method. You can follow the upgrade process under the respective setup guides:

- [Upgrade JumpStart on DigitalOcean](/docs/setup/digitalocean#upgrading-to-the-latest-lts-version)
- [Upgrade JumpStart on Docker](/docs/setup/docker#upgrading-to-the-latest-lts-version)
- [Upgrade JumpStart on AWS EC2](/docs/setup/ec2#upgrading-to-the-latest-lts-version)
- [Upgrade JumpStart on AWS ECS](/docs/setup/ecs#upgrading-to-the-latest-lts-version)
- [Upgrade JumpStart on OpenShift](/docs/setup/openshift#upgrading-to-the-latest-lts-version)
- [Upgrade JumpStart on Helm](/docs/setup/helm#upgrading-to-the-latest-lts-version)
- [Upgrade JumpStart on Kubernetes](/docs/setup/kubernetes#upgrading-to-the-latest-lts-version)
- [Upgrade JumpStart on Kubernetes(GKE)](/docs/setup/kubernetes-gke#upgrading-to-the-latest-lts-version)
- [Upgrade JumpStart on Kubernetes(AKS)](/docs/setup/kubernetes-aks#upgrading-to-the-latest-lts-version)
- [Upgrade JumpStart on Azure Container Apps](/docs/setup/azure-container#upgrading-to-the-latest-lts-version)
- [Upgrade JumpStart on Google Cloud Run](/docs/setup/google-cloud-run#upgrading-to-the-latest-lts-version)


