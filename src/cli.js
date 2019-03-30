const inquirer = require('inquirer');

module.exports = class CLI {
    constructor(config) {
        this.configGuard();

        this.name = config.cliName || 'file-gen-cli';
        this.entityConfigs = config.entityConfigs;
    }

    configGuard(config) {
        if (!config || !Array.isArray(config.entityConfigs) || config.entityConfigs.length === 0) {
            throw Error('there is a problem with your configuration, please refer to documentation');
        }
    }

    queryEntity() {
        return inquirer.prompt([{
            name: "ENTITY",
            type: "list",
            message: "Please select one of the bellow entities to generate",
            choices: this.entityConfigs.map(el => el.name)
        }]);
    }

    queryInstanceNameSingular() {
        return inquirer.prompt([{
            name: "SINGULAR",
            type: "input",
            message: "What is the instance name?"
        }]);
    }

    queryInstanceNamePlural() {
        return inquirer.prompt([{
            name: "PLURAL",
            type: "input",
            message: "What is the instance plural name?"
        }]);
    }
};

