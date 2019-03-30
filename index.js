#!/usr/bin/env node

const figlet = require('figlet');
const chalk = require('chalk');
const config = require(process.cwd() + '/gencli.json');
const CLI = require('./src/cli');
const FileGen = require('./src/file-gen');

const greet = () => {
    console.log(
        chalk.green(
            figlet.textSync(this.name || 'gen-cli', {
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );
    console.log(
        chalk.white.bgBlue.bold(`By Vincent Guillemette - github/guignol1981`)
    );
};

const run = async () => {
    greet();

    const fileGen = new FileGen(config);
    const cli = new CLI(config);

    const entityAnswer = await cli.queryEntity();
    const instanceNameSingularAnswer = await cli.queryInstanceNameSingular();
    const instanceNamePluralAnswer = await cli.queryInstanceNamePlural();

    const entityConfig = config.entityConfigs.find(ec => ec.name === entityAnswer['ENTITY']);

    fileGen.generate(entityConfig, { singular: instanceNameSingularAnswer['SINGULAR'], plural: instanceNamePluralAnswer['PLURAL'] });
};

run();
