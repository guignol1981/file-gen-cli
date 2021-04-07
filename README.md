
[![Build Status](https://travis-ci.com/guignol1981/file-gen-cli.svg?branch=master)](https://travis-ci.com/guignol1981/file-gen-cli)
[![CodeFactor](https://www.codefactor.io/repository/github/guignol1981/file-gen-cli/badge)](https://www.codefactor.io/repository/github/guignol1981/file-gen-cli)
[![npm version](https://badge.fury.io/js/file-gen-cli.svg)](https://badge.fury.io/js/file-gen-cli)
[![BCH compliance](https://bettercodehub.com/edge/badge/guignol1981/file-gen-cli?branch=master)](https://bettercodehub.com/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Speed up with

![Logo](/src/assets/logo.PNG?raw=true "Logo")

A CLI that generate files for your application

## Installation
 - run  with
 	> `npx file-gen-cli`
 - Add a folder to hold your files templates
	 >  files templates examples [here](https://github.com/guignol1981/file-gen-cli/tree/master/example/cli-templates)
 - Add a **gencli.json** file at the root of your project
	>  gencli.json example [here](https://github.com/guignol1981/file-gen-cli/blob/master/example/gencli.json)

## Documentation (gencli.json)

### General config
|  Param |  definition  |  default | required | possible values |
|-|-|-|-|-|
|fileNameCase|the case of the files name|kebab|false|kebab, camel, pascal, constant, snake|
|folderNameCase|the case of the folders name|kebab|false|kebab, camel, pascal, constant, snake|
|templatePath|the path to the files template (from project root), the path will be normalized||true||
|entityConfigs|an array of entity configs||true||

### Entity config
|  Param |  definition  |  default | required | possible values |
|-|-|-|-|-|
|name|the entity name||true||
|path|the path where to create the entity instances (from project root), the path will be normalized||true||
|prefix|the entity prefix that can occur in different files template||false||
|fileConfigs|an array of file configs||true||
|singularOnly|if there is only singular name instances|false|false||

### File config
|  Param |  definition  |  default | required | possible values |
|-|-|-|-|-|
|name|the file name (the `*` symbole is replaced by the entity instance name)||true||
|template|the template name for the file (no template will generate an empty file)||false||

### Templates

|keyword|replaced with|
|-|-|
|{{SINGULAR_PASCAL}}|instance name pascal case|
|{{SINGULAR_CAMEL}}|instance name camel case|
|{{SINGULAR_CONSTANT}}|instance name constant case|
|{{SINGULAR_KEBAB}}|instance name kebab case|
|{{SINGULAR_SNAKE}}|instance name kebab case|
|{{PLURAL_PASCAL}}|instance plural name pascal case|
|{{PLURAL_CAMEL}}|instance plural name came case|
|{{PLURAL_CONSTANT}}|instance plural name constant case|
|{{PLURAL_KEBAB}}|instance plural name kebab case|
|{{PLURAL_SNAKE}}|instance plural name kebab case|
|{{PREFIXED_SINGULAR_PASCAL}}|instance prefixed name pascal case|
|{{PREFIXED_SINGULAR_CAMEL}}|instance prefixed name camel case|
|{{PREFIXED_SINGULAR_CONSTANT}}|instance prefixed name constant case|
|{{PREFIXED_SINGULAR_KEBAB}}|instance prefixed name kebab case|
|{{PREFIXED_SINGULAR_SNAKE}}|instance prefixed name kebab case|
|{{PREFIXED_PLURAL_PASCAL}}|instance prefixed plural name pascal case|
|{{PREFIXED_PLURAL_CAMEL}}|instance prefixed plural name camel case|
|{{PREFIXED_PLURAL_CONSTANT}}|instance prefixed plural name constant case|
|{{PREFIXED_PLURAL_KEBAB}}|instance prefixed plural name kebab case|
|{{PREFIXED_PLURAL_SNAKE}}|instance prefixed plural name kebab case|

## TODO (feel free to help)

- Support nested folders
- Generate gencli.json from cli menu
- "Exit" cli option
- Convert to Typescript

## Contributing

 - Feel free to suggest features, submit issues or update the documentation!

## Contributors

 - Contribute and add your name here!

## License

- Copyright (c) 2019 Vincent Guillemette (github: guignol1981) Licensed under the MIT license.

