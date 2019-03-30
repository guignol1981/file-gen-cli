
[![Build Status](https://travis-ci.com/guignol1981/gen-cli.svg?branch=master)](https://travis-ci.com/guignol1981/file-gen-cli)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![BCH compliance](https://bettercodehub.com/edge/badge/guignol1981/file-gen-cli?branch=master)](https://bettercodehub.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# file-gen-cli

A command line interface that generate files for your application

## Installation
 - `npm install file-gen-cli --save-dev`
 - Add a **gencli.json** file at the root of your project
	>  gencli.json example [here](https://github.com/guignol1981/gen-cli/blob/master/src/tests/gencli.json)
 - Add this script in your **package.json**
 	>  "my-app-name-cli": "./node_modules/.bin/file-gen-cli"
 - Add a folder to hold your files templates
 - Run with npm `run my-app-name-cli`

## Documentation

### General config
|  Params |  definition  |  default | required | possible values |
|-|-|-|-|-|
|cliName|the name of your cli|file-gen-cli|false|
|fileExtension|the extension of the generated files (can be override individually)||true|
|fileNameCase|the case of the files name|kebab|false|kebab, camel, pascal, constant
|folderNameCase|the case of the folders name|kebab|false|kebab, camel, pascal, constant|
|templatePath|the path to the files template||true||
|entityConfigs|an array of entity configs||true||

### Entity config
|  Params |  definition  |  default | required | possible values |
|-|-|-|-|-|
|name|the entity instance name||true||
|rootPath|the path where to create the entity instance||true||
|prefix|the entity prefix that can occur in different files template||false||
|fileConfigs|an array of file configs||true||

### File config
|  Params |  definition  |  default | required | possible values |
|-|-|-|-|-|
|name|the file name (the `*` symbole is replaced by the entity instance name)||true||
|template|the template name for the file (no template will generate an empty file)||false||
|extension|override the file extension of the general config|the fileExtension value|false||

## TODO

 - Expand test suite coverage
 - Better documentation
 - Allow to fetch template from url in config file
 - Fix better code integration

## Contributing

 - Feel free to suggest features, submit issues or update the documentation!

## License

- Copyright (c) 2018 Vincent Guillemette (github: guignol1981) Licensed under the MIT license.

