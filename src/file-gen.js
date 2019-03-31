const changeCase = require('change-case');
const fs = require('fs');

module.exports = class FileGen {
    constructor(config) {
        this.configGuard(config);

        this.folderNameCase = config.folderNameCase;
        this.fileNameCase = config.fileNameCase;
        this.fileExtension = config.fileExtension;
        this.templatePath = config.templatePath;
    }

    configGuard(config) {
        if (!config || !config.folderNameCase || !config.fileNameCase || !config.templatePath) {
            throw Error('there is a problem with your configuration, please refer to documentation');
        }
    }

    generate(entityConfig, instanceName) {
        entityConfig.fileConfigs.forEach(fileConfig => {
            const dirName = `${process.cwd()}${entityConfig.path}/${changeCase[this.folderNameCase](instanceName.singular)}`;

            this.createDir(dirName);

            instanceName.prefix = entityConfig.prefix;
            fileConfig.path = this.getFilePath(dirName, fileConfig, instanceName);

            this.createFile(fileConfig, instanceName);
        });
    }

    createDir(dirName) {
        if (fs.existsSync(dirName)) {
            return;
        }
        fs.mkdirSync(dirName);
    }

    getFilePath(dirName, fileConfig, instanceName) {
        const fileExtension = fileConfig.extension || this.fileExtension;
        const fileName = fileConfig.name.replace('*', `${changeCase[this.fileNameCase](instanceName.singular)}`);

        return `${dirName}/${fileName}.${fileExtension}`;
    }

    createFile(fileConfig, instanceName) {
        if (!fileConfig.template) {
            fs.openSync(fileConfig.path, 'w');
            return;
        }

        const contents = this.getTemplateContent(fileConfig, instanceName);

        fs.writeFileSync(fileConfig.path, contents);
    }

    getTemplateContent(fileConfig, instanceName) {
        let contents = fs.readFileSync(`${process.cwd()}${this.templatePath}/${fileConfig.template}`, 'utf8');

        return this.replaceTemplatePlaceholders(contents, instanceName);
    }

    replaceTemplatePlaceholders(contents, instanceName) {
        contents = contents
            .replace(/{{SINGULAR_PASCAL_CASE}}/gi, changeCase.pascalCase(instanceName.singular))
            .replace(/{{SINGULAR_CAMEL_CASE}}/gi, changeCase.camelCase(instanceName.singular))
            .replace(/{{SINGULAR_CONSTANT_CASE}}/gi, changeCase.constant(instanceName.singular))
            .replace(/{{SINGULAR_KEBAB_CASE}}/gi, changeCase.kebabCase(instanceName.singular))
            .replace(/{{PLURAL_PASCAL_CASE}}/gi, changeCase.pascalCase(instanceName.plural))
            .replace(/{{PLURAL_CAMEL_CASE}}/gi, changeCase.camelCase(instanceName.plural))
            .replace(/{{PLURAL_CONSTANT_CASE}}/gi, changeCase.constant(instanceName.plural))
            .replace(/{{PLURAL_KEBAB_CASE}}/gi, changeCase.kebabCase(instanceName.plural));

        return this.replacePrefixedTemplatePlaceholders(contents, instanceName);
    }

    replacePrefixedTemplatePlaceholders(contents, instanceName) {
        const prefixedSingular = `${instanceName.prefix} ${instanceName.singular}`;
        const prefixedPlural = `${instanceName.prefix} ${instanceName.plural}`;

        return contents.replace(/{{PREFIXED_SINGULAR_PASCAL_CASE}}/gi, changeCase.pascalCase(prefixedSingular))
            .replace(/{{PREFIXED_SINGULAR_CAMEL_CASE}}/gi, changeCase.camelCase(prefixedSingular))
            .replace(/{{PREFIXED_SINGULAR_CONSTANT_CASE}}/gi, changeCase.constant(prefixedSingular))
            .replace(/{{PREFIXED_SINGULAR_KEBAB_CASE}}/gi, changeCase.kebabCase(prefixedSingular))
            .replace(/{{PREFIXED_PLURAL_PASCAL_CASE}}/gi, changeCase.pascalCase(prefixedPlural))
            .replace(/{{PREFIXED_PLURAL_CAMEL_CASE}}/gi, changeCase.camelCase(prefixedPlural))
            .replace(/{{PREFIXED_PLURAL_CONSTANT_CASE}}/gi, changeCase.constant(prefixedPlural))
            .replace(/{{PREFIXED_PLURAL_KEBAB_CASE}}/gi, changeCase.kebabCase(prefixedPlural));
    }
};
