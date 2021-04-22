const inquirer = require('inquirer');
const tree = require('../tree');
const chalk = require('chalk');
module.exports = class CLI {
    constructor(config) {
        this.configGuard(config);

        this.entityConfigs = config.entityConfigs;
    }

    configGuard(config) {
        if (
            !config ||
            !Array.isArray(config.entityConfigs) ||
            config.entityConfigs.length === 0
        ) {
            throw Error(
                'there is a problem with your configuration, please refer to documentation'
            );
        }
    }

    async init() {
        const entityName = await this.queryEntity();

        console.log(
            chalk.blue('this will generate this structure: (* = instance name)')
        );
        console.log(
            chalk.green(process.cwd().split('\\').pop()),
            chalk.yellow('<<< you are here')
        );
        console.log(
            chalk.green(
                tree(this.entityConfigs.find((ec) => ec.name === entityName))
            )
        );

        const instanceNameSingular = await this.queryInstanceNameSingular();

        let instanceNamePlural = '';

        if (
            !this.entityConfigs.find((ec) => ec.name === entityName)
                .singularOnly
        ) {
            instanceNamePlural = await this.queryInstanceNamePlural();
        }

        return Promise.resolve({
            entityName,
            instanceName: {
                singular: instanceNameSingular.trim(),
                plural: instanceNamePlural.trim(),
            },
        });
    }

    queryEntity() {
        return inquirer
            .prompt([
                {
                    name: 'ENTITY',
                    type: 'list',
                    message:
                        'Please select one of the bellow entities to generate',
                    choices: this.entityConfigs.map((el) => el.name),
                },
            ])
            .then((answer) => answer['ENTITY']);
    }

    queryInstanceNameSingular() {
        return inquirer
            .prompt([
                {
                    name: 'SINGULAR',
                    type: 'input',
                    message: 'What is the instance name?',
                },
            ])
            .then((answer) => answer['SINGULAR']);
    }

    queryInstanceNamePlural() {
        return inquirer
            .prompt([
                {
                    name: 'PLURAL',
                    type: 'input',
                    message: 'What is the instance plural name?',
                },
            ])
            .then((answer) => answer['PLURAL']);
    }
};
