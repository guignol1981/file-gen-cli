const inquirer = require('inquirer');
const FileGen = require('./file-gen');

class CLI {
    constructor(config) {
        this.configGuard(config);

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
        }])
            .then(answer => answer['ENTITY']);
    }

    queryInstanceNameSingular() {
        return inquirer.prompt([{
            name: "SINGULAR",
            type: "input",
            message: "What is the instance name?"
        }])
            .then(answer => answer['SINGULAR']);
    }

    queryInstanceNamePlural() {
        return inquirer.prompt([{
            name: "PLURAL",
            type: "input",
            message: "What is the instance plural name?"
        }])
            .then(answer => answer['PLURAL']);
    }
};

module.exports = (async function () {
    const config = require('../example/gencli.json');
    const cli = new CLI(config);
    const fileGen = new FileGen(config);

    const entityName = await cli.queryEntity();
    const instanceNameSingular = await cli.queryInstanceNameSingular();
    const instanceNamePlural = await cli.queryInstanceNamePlural();
    const entityConfig = config.entityConfigs.find(ec => ec.name === entityName);

    fileGen.generate(entityConfig, { singular: instanceNameSingular, plural: instanceNamePlural });
})();

