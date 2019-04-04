const inquirer = require('inquirer');

const configGuard = (config) => {
    if (!config || !Array.isArray(config.entityConfigs) || config.entityConfigs.length === 0) {
        throw Error('there is a problem with your configuration, please refer to documentation');
    }
};

const queryEntity = (entityNames) => {
    return inquirer.prompt([{
        name: "ENTITY",
        type: "list",
        message: "Please select one of the bellow entities to generate",
        choices: entityNames
    }])
        .then(answer => answer['ENTITY']);
};

const queryInstanceNameSingular = () => {
    return inquirer.prompt([{
        name: "SINGULAR",
        type: "input",
        message: "What is the instance name?"
    }])
        .then(answer => answer['SINGULAR']);
};

const queryInstanceNamePlural = () => {
    return inquirer.prompt([{
        name: "PLURAL",
        type: "input",
        message: "What is the instance plural name?"
    }])
        .then(answer => answer['PLURAL']);
};

module.exports = async function (config, cb) {
    configGuard(config);

    const entityName = await queryEntity(config.entityConfigs.map(el => el.name));
    const instanceNameSingular = await queryInstanceNameSingular();
    const instanceNamePlural = await queryInstanceNamePlural();

    cb(entityName, { singular: instanceNameSingular, plural: instanceNamePlural });
};


