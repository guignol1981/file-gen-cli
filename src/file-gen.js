const changeCase = require('change-case');
const fs = require('fs');

let folderNameCase;
let fileNameCase;
let fileExtension;
let templatePath;

const configGuard = (config) => {
    if (!config || !config.folderNameCase || !config.fileNameCase || !config.templatePath) {
        throw Error('there is a problem with your configuration, please refer to documentation');
    }
};

const generate = (entityConfig, instanceName) => {
    entityConfig.fileConfigs.forEach(fileConfig => {
        const dirName = `${process.cwd()}${entityConfig.path}/${changeCase[folderNameCase](instanceName.singular)}`;

        createDir(dirName);

        instanceName.prefix = entityConfig.prefix;
        fileConfig.path = getFilePath(dirName, fileConfig, instanceName);

        createFile(fileConfig, instanceName);
    });
};

const createDir = (dirName) => {
    if (fs.existsSync(dirName)) {
        return;
    }
    fs.mkdirSync(dirName);
};

const getFilePath = (dirName, fileConfig, instanceName) => {
    fileExtension = fileConfig.extension || fileExtension;
    const fileName = fileConfig.name.replace('*', `${changeCase[fileNameCase](instanceName.singular)}`);

    return `${dirName}/${fileName}.${fileExtension}`;
};

const createFile = (fileConfig, instanceName) => {
    if (!fileConfig.template) {
        fs.openSync(fileConfig.path, 'w');
        return;
    }

    const contents = getTemplateContent(fileConfig, instanceName);

    fs.writeFileSync(fileConfig.path, contents);
};

const getTemplateContent = (fileConfig, instanceName) => {
    let contents = fs.readFileSync(`${process.cwd()}${templatePath}/${fileConfig.template}`, 'utf8');

    return replaceTemplatePlaceholders(contents, instanceName);
};

const replaceTemplatePlaceholders = (contents, instanceName) => {
    contents = contents
        .replace(/{{SINGULAR_PASCAL_CASE}}/gi, changeCase.pascalCase(instanceName.singular))
        .replace(/{{SINGULAR_CAMEL_CASE}}/gi, changeCase.camelCase(instanceName.singular))
        .replace(/{{SINGULAR_CONSTANT_CASE}}/gi, changeCase.constantCase(instanceName.singular))
        .replace(/{{SINGULAR_KEBAB_CASE}}/gi, changeCase.kebabCase(instanceName.singular))
        .replace(/{{SINGULAR_SNAKE_CASE}}/gi, changeCase.snakeCase(instanceName.singular))
        .replace(/{{PLURAL_PASCAL_CASE}}/gi, changeCase.pascalCase(instanceName.plural))
        .replace(/{{PLURAL_CAMEL_CASE}}/gi, changeCase.camelCase(instanceName.plural))
        .replace(/{{PLURAL_CONSTANT_CASE}}/gi, changeCase.constantCase(instanceName.plural))
        .replace(/{{PLURAL_KEBAB_CASE}}/gi, changeCase.kebabCase(instanceName.plural))
        .replace(/{{PLURAL_SNAKE_CASE}}/gi, changeCase.snakeCase(instanceName.plural));

    return replacePrefixedTemplatePlaceholders(contents, instanceName);
};

const replacePrefixedTemplatePlaceholders = (contents, instanceName) => {
    const prefixedSingular = `${instanceName.prefix} ${instanceName.singular}`;
    const prefixedPlural = `${instanceName.prefix} ${instanceName.plural}`;

    return contents.replace(/{{PREFIXED_SINGULAR_PASCAL_CASE}}/gi, changeCase.pascalCase(prefixedSingular))
        .replace(/{{PREFIXED_SINGULAR_CAMEL_CASE}}/gi, changeCase.camelCase(prefixedSingular))
        .replace(/{{PREFIXED_SINGULAR_CONSTANT_CASE}}/gi, changeCase.constantCase(prefixedSingular))
        .replace(/{{PREFIXED_SINGULAR_KEBAB_CASE}}/gi, changeCase.kebabCase(prefixedSingular))
        .replace(/{{PREFIXED_SINGULAR_SNAKE_CASE}}/gi, changeCase.snakeCase(prefixedSingular))
        .replace(/{{PREFIXED_PLURAL_PASCAL_CASE}}/gi, changeCase.pascalCase(prefixedPlural))
        .replace(/{{PREFIXED_PLURAL_CAMEL_CASE}}/gi, changeCase.camelCase(prefixedPlural))
        .replace(/{{PREFIXED_PLURAL_CONSTANT_CASE}}/gi, changeCase.constantCase(prefixedPlural))
        .replace(/{{PREFIXED_PLURAL_KEBAB_CASE}}/gi, changeCase.kebabCase(prefixedPlural))
        .replace(/{{PREFIXED_PLURAL_SNAKE_CASE}}/gi, changeCase.snakeCase(prefixedPlural));
}

module.exports = function (config, entityConfig, instanceName, cb) {
    configGuard(config);

    folderNameCase = config.folderNameCase;
    fileNameCase = config.fileNameCase;
    fileExtension = config.fileExtension;
    templatePath = config.templatePath;

    generate(entityConfig, instanceName);

    cb();
};
