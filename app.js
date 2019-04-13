#!/usr/bin/env node

const figlet = require('figlet');
const chalk = require('chalk');
const config = require(process.cwd() + '/gencli.json');
const CLI = require('./src/cli');
const FileGen = require('./src/file-gen');

const greet = () => {
    console.log(
        chalk.green(
            figlet.textSync('file-gen-cli', {
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );
    console.log(
        chalk.white.bgBlue.bold(`By Vincent Guillemette - github/guignol1981`)
    );
};

const goodbye = () => {
    console.log(
        chalk.white.bgBlue.bold(`Done!`)
    );
};

const run = async () => {
    greet();

    let cli = new CLI(config);

    await cli.init((entityName, instanceName) => {
        new FileGen(
            config,
            entityConfig = config.entityConfigs.find(ec => ec.name === entityName),
            instanceName
        )
    });

    goodbye();
};

run();
