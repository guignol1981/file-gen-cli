#!/usr/bin/env node

const args = process.argv.slice(2);
const figlet = require('figlet');
const chalk = require('chalk');
const CLI = require('./src/cli');
const FileGen = require('./src/file-gen');
const path = require('path');
const fetch = require('node-fetch');
const { registor } = require('./src/registor');
const endpoint = 'http://localhost:3000';
// const endpoint = 'https://file-gen-cli.herokuapp.com';

try {
    const registerConfig = async () => {
        try {
            const config = require(path.join(process.cwd(), 'gencli.json'));
            await registor(config, endpoint);
        } catch (e) {
            console.log(e);
        }
    };

    const generateFiles = async () => {
        const { config } = await fetch(
            `${endpoint}/configs/${args[0]}`
        ).then((res) => res.json());

        let cli = new CLI(config);

        let { entityName, instanceName } = await cli.init();

        const fileGen = new FileGen(
            config,
            (entityConfig = config.entityConfigs.find(
                (ec) => ec.name === entityName
            )),
            instanceName,
            endpoint
        );

        await fileGen.generate();
    };

    const greet = () => {
        console.log(
            chalk.green(
                figlet.textSync('file-gen-cli', {
                    font: 'speed',
                })
            )
        );
        console.log(
            chalk.white.bgBlue.bold(
                `By Vincent Guillemette - github/guignol1981`
            )
        );
    };

    const goodbye = () => {
        console.log(chalk.white.bgBlue.bold(`Done!`));
        process.exit();
    };

    const run = async () => {
        greet();

        if (args[0] === 'register') {
            await registerConfig();
        } else {
            await generateFiles();
        }

        goodbye();
    };

    run();
} catch (e) {
    console.log(e);
}
