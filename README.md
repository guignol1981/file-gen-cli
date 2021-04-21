[![Build Status](https://travis-ci.com/guignol1981/file-gen-cli.svg?branch=master)](https://travis-ci.com/guignol1981/file-gen-cli)
[![CodeFactor](https://www.codefactor.io/repository/github/guignol1981/file-gen-cli/badge)](https://www.codefactor.io/repository/github/guignol1981/file-gen-cli)
[![npm version](https://badge.fury.io/js/file-gen-cli.svg)](https://badge.fury.io/js/file-gen-cli)
[![BCH compliance](https://bettercodehub.com/edge/badge/guignol1981/file-gen-cli?branch=master)](https://bettercodehub.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Speed up with

![Logo](/src/assets/logo.PNG?raw=true 'Logo')

A CLI that generate files for your application

## Getting started

-   install globaly with
    > `npm i file-gen-cli@latest -g`
-   Add a folder to hold your templates and gencli.json files
    > files templates examples [here](https://github.com/guignol1981/file-gen-cli/tree/master/example)
    > see bellow for gencli configuration [here](https://github.com/guignol1981/file-gen-cli/tree/master/example/gencli.json)
-   Register your cli config with
    > `file-gen-cli register`
-   Use your cli with
    > `file-gen-cli myCliName`
-   List clis with
    > `file-gen-cli list
-   Deduce templates from a folder
    > `file-gen-cli deduce <instanceName> [<prefix> <instanceNamePlural>]`

## How it works

When you use the register parameters, file-gen-cli will lookup in the folder it's being executed for a gencli.json file. It will then save in the cloud this config associeted with the cliName parameters. It will then look each file configs of each entity configs then will look for each of the templates files name in the folder it's being executed. It will then store those file in the cloud associated with the cli name.

### You can rewrite the config the same way

When the register is done, and you use file-gen-cli with you cli name as parameter, it will then generate the files.

File gen cli use an heroku hosted server app to manage the configs, see how it works here <https://github.com/guignol1981/file-gen-cli-server>

## Documentation (gencli.json)

### General config

| Param          | definition                            | default | required | possible values                       |
| -------------- | ------------------------------------- | ------- | -------- | ------------------------------------- |
| cliName        | name of your cli                      |         | true     | a string with no spaces               |
| description    | desc of your config (for public list) |         | true     |                                       |
| token          | a jwt to generate new config          |         | true     | contact me to get a token             |
| fileNameCase   | the case of the files name            | kebab   | false    | kebab, camel, pascal, constant, snake |
| folderNameCase | the case of the folders name          | kebab   | false    | kebab, camel, pascal, constant, snake |
| entityConfigs  | an array of entity configs            |         | true     | see Entity config bellow              |

### Entity config

| Param        | definition                                                   | default | required | possible values |
| ------------ | ------------------------------------------------------------ | ------- | -------- | --------------- |
| name         | the entity name                                              |         | true     |                 |
| prefix       | the entity prefix that can occur in different files template |         | false    |                 |
| fileConfigs  | an array of file configs                                     |         | true     |                 |
| singularOnly | if there is only singular name occurence in templates        | false   | false    |                 |
| flat         | determine if the cli should create a folder for the instance | false   | false    |                 |

### File config

| Param    | definition                                                               | default | required | possible values |
| -------- | ------------------------------------------------------------------------ | ------- | -------- | --------------- |
| name     | the file name (the `*` symbole is replaced by the entity instance name)  |         | true     |                 |
| template | the template name for the file (no template will generate an empty file) |         | false    |                 |
| path     | path to create the file relative to the instance path                    | ./      | false    |                 |

### Templates

| keywords (\* = supported cases) | replaced with                                     |
| ------------------------------- | ------------------------------------------------- |
| {{SINGULAR_*}}                  | instance name with specified case                 |
| {{PLURAL_*}}                    | instance plural name with specified case          |
| {{PREFIXED_SINGULAR_*}}         | instance prefixed name with specified case        |
| {{PREFIXED_PLURAL_*}}           | instance prefixed plural name with specified case |

### Supported Cases

CAMEL,
CAPITAL,
CONSTANT,
DOT,
HEADER,
NO,
KEBAB (deprecate, use PARAM)
PARAM,
PASCAL,
PATH,
SENTENCE,
SNAKE,

## TODO (feel free to help)

-   Convert to Typescript

## Contributing

-   Feel free to suggest features, submit issues or update the documentation!

## Contributors

-   Contribute and add your name here!

## License

-   Copyright (c) 2019 Vincent Guillemette (github: guignol1981) Licensed under the MIT license.
