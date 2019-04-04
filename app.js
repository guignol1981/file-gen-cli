#!/usr/bin/env node

const figlet = require('figlet');
const chalk = require('chalk');
const config = require(process.cwd() + '/gencli.json');
const cli = require('./src/cli');
const fileGen = require('./src/file-gen');

const greet = () => {
    console.log(chalk.green(figlet.textSync('file-gen-cli', {})));
};

const goodbye = () => {
    console.log(chalk.white.bgBlue.bold(`Done!`));
};

const run = async () => {
    greet();

    cli(config, (entityName, instanceName) => fileGen(
        config,
        config.entityConfigs.find(ec => ec.name === entityName),
        instanceName,
        () => goodbye()
    ));
};

run();
