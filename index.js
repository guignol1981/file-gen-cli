#!/usr/bin/env node

const figlet = require('figlet');
const chalk = require('chalk');
const config = require(process.cwd() + '/gencli.json');
const CLI = require('./src/cli');
const FileGen = require('./src/file-gen');

const greet = () => {
    console.log(
        chalk.green(
            figlet.textSync(config.cliName || 'file-gen-cli', {
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );
    console.log(
        chalk.white.bgBlue.bold(`By Vincent Guillemette - github/guignol1981`)
    );
};

const done = () => {
    console.log(
        chalk.white.bgBlue.bold(`Done!`)
    );
};

const run = async () => {
    greet();

    const fileGen = new FileGen(config);
    const cli = new CLI(config);
    const entityName = await cli.queryEntity();
    const instanceNameSingular = await cli.queryInstanceNameSingular();
    const instanceNamePlural = await cli.queryInstanceNamePlural();
    const entityConfig = config.entityConfigs.find(ec => ec.name === entityName);

    fileGen.generate(entityConfig, { singular: instanceNameSingular, plural: instanceNamePlural });

    done();
};

run();
