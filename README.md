JumpStart is a **low-code framework** to build and deploy internal tools with minimal engineering effort. JumpStart's drag-and-drop frontend builder allows you to create complex, responsive frontends within minutes. Additionally, you can integrate various data sources, including databases like PostgreSQL, MongoDB, and Elasticsearch; API endpoints with OpenAPI spec and OAuth2 support; SaaS tools such as Stripe, Slack, Google Sheets, Airtable, and Notion; as well as object storage services like S3, GCS, and Minio, to fetch and write data.


## All features

- **Visual App Builder:** 45+ built-in responsive components, including Tables, Charts, Lists, Forms, and Progress Bars.
- **JumpStart Database:** Built-in no-code database.
- **Multi-Page:** Build an application with multiple pages.
- **Multiplayer editing:** Allows simultaneous app building by multiple developers.
- **50+ data sources:** Integrate with external databases, cloud storage, and APIs.
- **Desktop & mobile:** Customize layout widths to fit various screen sizes.
- **Self-host:** Supports Docker, Kubernetes, AWS EC2, Google Cloud Run, and more.
- **Collaborate:** Add comments anywhere on the canvas and tag your team members.
- **Extend with plugins:** Use our [command-line tool](https://www.npmjs.com/package/@jumpstart/cli) to easily bootstrap new connectors.
- **Version control:** Manage multiple application versions with a structured release cycle.
- **Run JS & Python code:** Execute custom JavaScript and Python snippets.
- **Granular access control:** Set permissions at both group and app levels.
- **Low-code:** Use JS code almost anywhere within the builder, such as setting text color based on status with 
`status === 'success' ? 'green' : 'red'`.
- **No-code query editors:** Query Editors are available for all supported data sources.
- **Join and transform data:** Transform query results using JavaScript or Python code.
- **Secure:** All the credentials are securely encrypted using `aes-256-gcm`.
- **Data Privacy:** JumpStart serves solely as a proxy and does not store data.
- **SSO:** Supports multiple Single Sign-On providers.

<hr>

## Quickstart
The easiest way to get started with JumpStart is by creating a [JumpStart Cloud](https://jumpstart.com) account. JumpStart Cloud offers a hosted solution of JumpStart. If you want to self-host JumpStart, kindly proceed to [deployment documentation](https://docs.jumpstart.com/docs/setup/).

You can deploy JumpStart on DigitalOcean using one-click-deployment.


### Try using Docker
Want to give JumpStart a quick spin on your local machine? You can run the following command from your terminal to have JumpStart up and running right away.


```bash
docker run \
  --name jumpstart \
  --restart unless-stopped \
  -p 80:80 \
  --platform linux/amd64 \
  -v jumpstart_data:/var/lib/postgresql/13/main \
  digitranslab/js-try:ee-lts-latest
```

*For users upgrading their JumpStart version, we recommend choosing the LTS version over the latest version. The LTS version ensures stability with production bug fixes, security patches, and performance enhancements.*

## Tutorials and examples

[Time Tracker Application](https://docs.jumpstart.com/docs/#quickstart-guide)<br>
[Build your own CMS using low-code](https://blog.jumpstart.com/build-cms-using-lowcode-and-mongodb/)<br>
[AWS S3 Browser](https://blog.jumpstart.com/build-an-aws-s3-broswer-with-jumpstart/)<br>

## Documentation
Documentation is available at https://docs.jumpstart.com.

- [Getting Started](https://docs.jumpstart.com)<br>
- [Data source Reference](https://docs.jumpstart.com/docs/data-sources/airtable/)<br>
- [Component Reference](https://docs.jumpstart.com/docs/widgets/button)

## Self-hosted
You can use JumpStart Cloud for a fully managed solution. If you want to self-host JumpStart, we have guides on deploying JumpStart on Kubernetes, AWS EC2, Docker, and more.

| Provider  | Documentation |
| :------------- | :------------- |
| Digital Ocean | [Link](https://docs.jumpstart.com/docs/setup/digitalocean)  |
| Docker  | [Link](https://docs.jumpstart.com/docs/setup/docker)   |
| AWS EC2 | [Link](https://docs.jumpstart.com/docs/setup/ec2)  |
| AWS ECS | [Link](https://docs.jumpstart.com/docs/setup/ecs)   |
| OpenShift | [Link](https://docs.jumpstart.com/docs/setup/openshift)   |
| Helm | [Link](https://docs.jumpstart.com/docs/setup/helm)   |
| AWS EKS (Kubernetes) | [Link](https://docs.jumpstart.com/docs/setup/kubernetes)   |
| GCP GKE (Kubernetes) | [Link](https://docs.jumpstart.com/docs/setup/kubernetes-gke)   |
| Azure AKS (Kubernetes) | [Link](https://docs.jumpstart.com/docs/setup/kubernetes-aks)   |
| Azure Container | [Link](https://docs.jumpstart.com/docs/setup/azure-container)   |
| Google Cloud Run  | [Link](https://docs.jumpstart.com/docs/setup/google-cloud-run)   |
| Deploying JumpStart client  | [Link](https://docs.jumpstart.com/docs/setup/client)   |
| Deploying JumpStart on a Subpath  | [Link](https://docs.jumpstart.com/docs/setup/jumpstart-subpath/)   |

## Marketplace 
JumpStart can now be found on both AWS and Azure Marketplaces, making it simpler than ever to access and deploy our app-building platform.

Find JumpStart on AWS Marketplace [here](https://aws.amazon.com/marketplace/pp/prodview-fxjto27jkpqfg?sr=0-1&ref_=beagle&applicationId=AWSMPContessa) and explore seamless integration on Azure Marketplace [here](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/jumpstartsolutioninc1679496832216.jumpstart?tab=Overview).
