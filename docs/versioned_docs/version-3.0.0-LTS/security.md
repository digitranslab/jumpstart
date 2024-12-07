---
id: security
title: Security
slug: /security
---

# Security

<div style={{paddingTop:'24px', paddingBottom:'24px'}}>

## Uncompromised Data Security with SOC 2 Compliance

With SOC 2 compliance, JumpStart ensures the highest level of data security. The adherence to SOC 2 standards mirrors the rigorous data protection measures in place, covering everything from encryption to robust access controls. It also guarantees a consistent level of service availability and process integrity, instilling confidence in our customers and stakeholders about the safe handling of their sensitive information.

</div>

<div style={{paddingTop:'24px', paddingBottom:'24px'}}>

## Data Storage

JumpStart does not store data returned from your data sources. JumpStart server acts as a proxy and passes the data as it is to the JumpStart client. The credentials for the data sources are handled by the server and never exposed to the client. For example, if you are making an API request, the query is run from the server and not from the frontend.

</div>

<div style={{paddingTop:'24px', paddingBottom:'24px'}}>

## Datasource Credentials
All the datasource credentials are securely encrypted using `aes-256-gcm`. The credentials are never exposed to the frontend ( JumpStart client ).

</div>

<div style={{paddingTop:'24px', paddingBottom:'24px'}}>

## Other Security Features
- **TLS**: If you are using JumpStart cloud, all connections are encrypted using TLS. We also have documentation for setting up TLS for self-hosted installations of JumpStart.
- **Audit logs**: Audit logs are available on the enterprise edition of JumpStart. Every user action is logged along with the IP addresses and user information.
- **Request logging**: All the requests to server are logged. If self-hosted, you can easily extend JumpStart to use your preferred logging service. JumpStart comes with built-in Sentry integration.
- **Whitelisted IPs**: If you are using JumpStart cloud, you can whitelist our IP address (34.86.81.252) so that your datasources are not exposed to the public.
- **Backups**: JumpStart cloud is hosted on AWS using EKS with autoscaling and regular backups.

If you notice a security vulnerability, please let the team know by sending an email to `security@jumpstart.com`. 

</div>