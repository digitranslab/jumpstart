---
id: tracking
title: Tracking
slug: /tracking
---

# Tracking    

:::tip
JumpStart does not store any data fetched from the data sources. JumpStart acts as a proxy and the data from data sources is sent to the client application without storing.
:::

## Server

:::tip
Self-hosted version of JumpStart pings our server to fetch the latest product updates every 24 hours. You can disable this by setting the value of `CHECK_FOR_UPDATES` environment variable to `false`. This feature is enabled by default.
:::

## Client 

JumpStart tracks anonymous usage data such as page loads and clicks. JumpStart tracks only the events and doesn't capture data from data sources.

Tracking can be disabled by setting the value environment variable `ENABLE_TRACKING` to `0`. 
