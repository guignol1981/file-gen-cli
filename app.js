#!/usr/bin/env node

const args = process.argv.slice(2);
const chalk = require('chalk');
const list = require('./src/list');
const generate = require('./src/generate');
const register = require('./src/register');
const deduce = require('./src/deduce');
const version = require('./src/version');
const help = require('./src/help');
process.env.APP_BASE_URL = `https://file-gen-cli.herokuapp.com`;

const greet = () => {
    console.log(chalk.white.bold.bgGreen(' CLI-fy '));
    console.log(
        chalk.blue.bold(
            `Contribute! https://github.com/guignol1981/file-gen-cli`
        )
    );
};

const done = () => {
    console.log(chalk.white.bold.bgGreen(`Done!`));
    process.exit();
};

try {
    const run = async () => {
        greet();

        if (args[0] === '-v' || args[0] === '-version') {
            version();
        } else if (args[0] === '-h' || args[0] === '-help') {
            help();
        } else if (args[0] === 'register') {
            await register();
        } else if (args[0] === 'deduce') {
            await deduce(...args.slice(1));
        } else if (args[0] === 'list') {
            await list(args.slice(1));
        } else {
            await generate(args[0]);
        }

        done();
    };

    run();
} catch (e) {
    console.log(e);
}
