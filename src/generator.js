const changeCase = require('change-case');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

module.exports = async (config, entityConfig, instanceName, endpoint) => {
    if (!config || !config.cliName) {
        throw Error(
            'there is a problem with your configuration, please refer to documentation'
        );
    }

    const createDir = (dirName) => {
        if (fs.existsSync(path.normalize(dirName))) {
            return;
        }

        fs.mkdirSync(path.normalize(dirName));
    };

    const getFilePath = (dirName, fileConfig) => {
        const fileName = fileConfig.name.replace(
            '*',
            `${changeCase[config.fileNameCase || 'kebab'](
                instanceName.singular
            )}`
        );

        return `${dirName}/${fileName}`;
    };

    const getTemplateContent = async (fileConfig) => {
        const { template } = await fetch(
            `${endpoint}/configs/${config.cliName}/files/${fileConfig.template}`
        ).then((res) => res.json());

        return replaceTemplatePlaceholders(template);
    };

    const createFile = async (fileConfig) => {
        if (!fileConfig.template) {
            fs.openSync(path.normalize(fileConfig.path), 'w');
            return Promise.resolve();
        }

        const contents = await getTemplateContent(fileConfig);

        fs.writeFileSync(path.normalize(fileConfig.path), contents);
    };

    const replaceTemplatePlaceholders = (contents) => {
        contents = contents
            .replace(
                /{{SINGULAR_PASCAL}}/gi,
                changeCase.pascalCase(instanceName.singular)
            )
            .replace(
                /{{SINGULAR_CAMEL}}/gi,
                changeCase.camelCase(instanceName.singular)
            )
            .replace(
                /{{SINGULAR_CONSTANT}}/gi,
                changeCase.constantCase(instanceName.singular)
            )
            .replace(
                /{{SINGULAR_KEBAB}}/gi,
                changeCase.kebabCase(instanceName.singular)
            )
            .replace(
                /{{SINGULAR_SNAKE}}/gi,
                changeCase.snakeCase(instanceName.singular)
            )
            .replace(
                /{{PLURAL_PASCAL}}/gi,
                changeCase.pascalCase(instanceName.plural)
            )
            .replace(
                /{{PLURAL_CAMEL}}/gi,
                changeCase.camelCase(instanceName.plural)
            )
            .replace(
                /{{PLURAL_CONSTANT}}/gi,
                changeCase.constantCase(instanceName.plural)
            )
            .replace(
                /{{PLURAL_KEBAB}}/gi,
                changeCase.kebabCase(instanceName.plural)
            )
            .replace(
                /{{PLURAL_SNAKE}}/gi,
                changeCase.snakeCase(instanceName.plural)
            );

        return replacePrefixedTemplatePlaceholders(contents);
    };

    const replacePrefixedTemplatePlaceholders = (contents) => {
        const prefixedSingular = `${instanceName.prefix} ${instanceName.singular}`;
        const prefixedPlural = `${instanceName.prefix} ${instanceName.plural}`;

        return contents
            .replace(
                /{{PREFIXED_SINGULAR_PASCAL}}/gi,
                changeCase.pascalCase(prefixedSingular)
            )
            .replace(
                /{{PREFIXED_SINGULAR_CAMEL}}/gi,
                changeCase.camelCase(prefixedSingular)
            )
            .replace(
                /{{PREFIXED_SINGULAR_CONSTANT}}/gi,
                changeCase.constantCase(prefixedSingular)
            )
            .replace(
                /{{PREFIXED_SINGULAR_KEBAB}}/gi,
                changeCase.kebabCase(prefixedSingular)
            )
            .replace(
                /{{PREFIXED_SINGULAR_SNAKE}}/gi,
                changeCase.snakeCase(prefixedSingular)
            )
            .replace(
                /{{PREFIXED_PLURAL_PASCAL}}/gi,
                changeCase.pascalCase(prefixedPlural)
            )
            .replace(
                /{{PREFIXED_PLURAL_CAMEL}}/gi,
                changeCase.camelCase(prefixedPlural)
            )
            .replace(
                /{{PREFIXED_PLURAL_CONSTANT}}/gi,
                changeCase.constantCase(prefixedPlural)
            )
            .replace(
                /{{PREFIXED_PLURAL_KEBAB}}/gi,
                changeCase.kebabCase(prefixedPlural)
            )
            .replace(
                /{{PREFIXED_PLURAL_SNAKE}}/gi,
                changeCase.snakeCase(prefixedPlural)
            );
    };

    return await Promise.all(
        entityConfig.fileConfigs.map(async (fileConfig) => {
            const dirName = `${process.cwd()}/${changeCase[
                config.folderNameCase || 'kebab'
            ](instanceName.singular)}`;

            createDir(dirName);

            instanceName.prefix = entityConfig.prefix;
            fileConfig.path = getFilePath(dirName, fileConfig);

            return await createFile(fileConfig);
        })
    );
};
