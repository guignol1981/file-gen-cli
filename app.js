#!/usr/bin/env node

const args = process.argv.slice(2);
const figlet = require('figlet');
const chalk = require('chalk');
const CLI = require('./src/cli');
const generator = require('./src/generator');
const path = require('path');
const fetch = require('node-fetch');
const registrator = require('./src/registrator');
const deducer = require('./src/deducer');
// const endpoint = 'http://localhost:3000';
const endpoint = 'https://file-gen-cli.herokuapp.com';

try {
    const registerConfig = async () => {
        try {
            const config = require(path.join(process.cwd(), 'gencli.json'));
            await registrator(config, endpoint);
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

        await generator(
            config,
            (entityConfig = config.entityConfigs.find(
                (ec) => ec.name === entityName
            )),
            instanceName,
            endpoint
        );
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
        } else if (args[0] === 'deduce') {
            deducer(args[1], args[2], args[3]);
        } else if (args[0] === 'list') {
            const { configs } = await fetch(`${endpoint}/configs`).then((res) =>
                res.json()
            );
            configs.forEach((c) => {
                console.log('name: ', c.name);
                console.log('description: ', c.description);
                console.log('author: ', c.author);
                console.log('----');
            });
        } else {
            await generateFiles();
        }

        goodbye();
    };

    run();
} catch (e) {
    console.log(e);
}
