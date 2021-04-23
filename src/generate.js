const changeCase = require('change-case');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const CLI = require('./cli');

const generate = async (config, entityConfig, instanceName) => {
    let dirName;

    if (!config || !config.cliName) {
        throw Error(
            'there is a problem with your configuration, please refer to documentation'
        );
    }

    const createDir = () => {
        dirName = `${process.cwd()}`;

        if (!entityConfig.flat) {
            dirName += `/${changeCase[config.folderNameCase || 'kebab'](
                instanceName.singular
            )}`;
        }

        dirName = path.normalize(dirName);

        if (fs.existsSync(path.normalize(dirName))) {
            return;
        }

        fs.mkdirSync(path.normalize(dirName));
    };

    const getFilePath = (fileConfig) => {
        const fileName = fileConfig.name.replace(
            '*',
            `${changeCase[config.fileNameCase || 'kebab'](
                instanceName.singular
            )}`
        );

        if (
            fileConfig.path &&
            !fs.existsSync(path.join(dirName, fileConfig.path))
        ) {
            fs.mkdirSync(path.join(dirName, fileConfig.path), {
                recursive: true,
            });
        }

        return path.join(dirName, fileConfig.path || '', fileName);
    };

    const getTemplateContent = async (fileConfig) => {
        const { template } = await fetch(
            `${process.env.APP_BASE_URL}/configs/${config.cliName}/files/${fileConfig.template}`,
            {
                method: 'POST',
                body: JSON.stringify({ instanceName }),
                headers: { 'Content-Type': 'application/json' },
            }
        ).then((res) => res.json());

        return template;
    };

    const createFile = async (fileConfig) => {
        if (!fileConfig.template) {
            fs.openSync(path.normalize(fileConfig.path), 'w');
            return Promise.resolve();
        }

        const contents = await getTemplateContent(fileConfig);

        fs.writeFileSync(path.normalize(fileConfig.path), contents);
    };

    return await Promise.all(
        entityConfig.fileConfigs.map(async (fileConfig) => {
            createDir();

            instanceName.prefix = entityConfig.prefix;
            fileConfig.path = getFilePath(fileConfig);

            return await createFile(fileConfig);
        })
    );
};

module.exports = async (cliName) => {
    const { config } = await fetch(
        `${process.env.APP_BASE_URL}/configs/${cliName}`
    ).then((res) => res.json());

    let cli = new CLI(config);

    let { entityName, instanceName } = await cli.init();

    await generate(
        config,
        (entityConfig = config.entityConfigs.find(
            (ec) => ec.name === entityName
        )),
        instanceName,
        process.env.APP_BASE_URL
    );
};
