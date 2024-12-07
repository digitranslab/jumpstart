---
id: jumpstart-cli
title: JumpStart CLI
---

JumpStart CLI is a powerful tool that empowers developers to effortlessly create and enhance Marketplace plugins for JumpStart workspace.

:::info
Starting from JumpStart CLI version 0.0.14, the creation of datasource plugins has been deprecated to prioritise marketplace plugins. This change enhances the plugin development experience and aligns with JumpStart's roadmap.
:::

## Installation

In order to manage plugins for the JumpStart marketplace, including creating, updating, and deleting, you will need to utilize **[jumpstart-cli](https://www.npmjs.com/package/@jumpstart/cli)**. This can be installed via npm by entering the following command:

```bash
npm install -g @jumpstart/cli
```

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/jumpstart-cli/install.png" alt="JumpStart CLI installation" />

</div>

#### Ensure the installation was successful

```bash
jumpstart --version
```

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/jumpstart-cli/version.png" alt="JumpStart CLI version check" />

</div>

## Commands

### info

This command returns the information about where jumpstart is being run

```bash
jumpstart info
```

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/jumpstart-cli/info.png" alt="JumpStart CLI info" />

</div>

### create

This command creates a new plugin.

```bash
jumpstart plugin create PLUGIN_NAME
```
:::tip
Read the detailed guide on creating a marketplace plugin [here](/docs/contributing-guide/marketplace/creating-a-plugin).
:::

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/jumpstart-cli/create.gif" alt="JumpStart CLI : create plugin" />

</div>

### delete

This command deletes a plugin.

```bash
jumpstart plugin delete PLUGIN_NAME
```

The CLI will prompt developers to verify if the plugin to be deleted is a marketplace plugin before proceeding with the deletion.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/jumpstart-cli/delete.gif" alt="JumpStart CLI: delete plugin" />

</div>

### install

Installs a new npm module inside a jumpstart plugin

```bash
jumpstart plugin install [NPM_MODULE] --plugin <value>
```