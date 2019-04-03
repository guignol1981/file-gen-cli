#!/usr/bin/env node

const figlet = require('figlet');
const chalk = require('chalk');
// const config = require(process.cwd() + '/gencli.json');
// const CLI = require('./src/cli');
// const FileGen = require('./src/file-gen');


const greet = () => {
    console.log(chalk.green(figlet.textSync('file-gen-cli', {})));
};

const goodbye = () => {
    console.log(chalk.white.bgBlue.bold(`Done!`));
};

const run = async () => {
    greet();
    await require('./src/cli');
    goodbye();
};

run();
