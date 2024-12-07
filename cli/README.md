jumpstart cli
=================
<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @jumpstart/cli
$ jumpstart COMMAND
running command...
$ jumpstart (--version)
@jumpstart/cli/0.0.13 darwin-x64 node-v14.17.3
$ jumpstart --help [COMMAND]
USAGE
  $ jumpstart COMMAND
...
```
<!-- usagestop -->

Command should be executed inside `Jumpstart` directory

# Commands
<!-- commands -->
* [`jumpstart info`](#jumpstart-info)
* [`jumpstart plugin create PLUGIN_NAME`](#jumpstart-plugin-create-plugin_name)
* [`jumpstart plugin delete PLUGIN_NAME`](#jumpstart-plugin-delete-plugin_name)
* [`jumpstart plugin install NPM_MODULE`](#jumpstart-plugin-install-npm_module)

## `jumpstart info`

This command returns the information about where jumpstart is being run

```
USAGE
  $ jumpstart info

DESCRIPTION
  This command returns the information about where jumpstart is being run
```

_See code: [dist/commands/info.ts](https://github.com/digitranslab/jumpstart/blob/v0.0.13/dist/commands/info.ts)_

## `jumpstart plugin create PLUGIN_NAME`

Create a new jumpstart plugin

```
USAGE
  $ jumpstart plugin create [PLUGIN_NAME] [--type database|api|cloud-storage] [-b] [-m]

ARGUMENTS
  PLUGIN_NAME  Name of the plugin

FLAGS
  -b, --build
  -m, --marketplace
  --type=<option>    <options: database|api|cloud-storage>

DESCRIPTION
  Create a new jumpstart plugin

EXAMPLES
  $ jumpstart plugin create <name> --type=<database | api | cloud-storage> [--build]
```

## `jumpstart plugin delete PLUGIN_NAME`

Delete a jumpstart plugin

```
USAGE
  $ jumpstart plugin delete [PLUGIN_NAME] [-b]

ARGUMENTS
  PLUGIN_NAME  Name of the plugin

FLAGS
  -b, --build

DESCRIPTION
  Delete a jumpstart plugin

EXAMPLES
  $ jumpstart plugin delete <name> [--build]
```

## `jumpstart plugin install NPM_MODULE`

Installs a new npm module inside a jumpstart plugin

```
USAGE
  $ jumpstart plugin install [NPM_MODULE] --plugin <value>

ARGUMENTS
  NPM_MODULE  Name of the npm module

FLAGS
  --plugin=<value>  (required)

DESCRIPTION
  Installs a new npm module inside a jumpstart plugin

EXAMPLES
  $ jumpstart plugin install <npm_module> --plugin <plugin_name>
```
<!-- commandsstop -->
