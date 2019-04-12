const changeCase = require('change-case');
const fs = require('fs');

module.exports = class FileGen {
    constructor(config) {
        this.configGuard(config);

        this.folderNameCase = config.folderNameCase;
        this.fileNameCase = config.fileNameCase;
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
        const fileName = fileConfig.name.replace('*', `${changeCase[this.fileNameCase](instanceName.singular)}`);

        return `${dirName}/${fileName}`;
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
            .replace(/{{SINGULAR_PASCAL}}/gi, changeCase.pascalCase(instanceName.singular))
            .replace(/{{SINGULAR_CAMEL}}/gi, changeCase.camelCase(instanceName.singular))
            .replace(/{{SINGULAR_CONSTANT}}/gi, changeCase.constantCase(instanceName.singular))
            .replace(/{{SINGULAR_KEBAB}}/gi, changeCase.kebabCase(instanceName.singular))
            .replace(/{{SINGULAR_SNAKE}}/gi, changeCase.snakeCase(instanceName.singular))
            .replace(/{{PLURAL_PASCAL}}/gi, changeCase.pascalCase(instanceName.plural))
            .replace(/{{PLURAL_CAMEL}}/gi, changeCase.camelCase(instanceName.plural))
            .replace(/{{PLURAL_CONSTANT}}/gi, changeCase.constantCase(instanceName.plural))
            .replace(/{{PLURAL_KEBAB}}/gi, changeCase.kebabCase(instanceName.plural))
            .replace(/{{PLURAL_SNAKE}}/gi, changeCase.snakeCase(instanceName.plural));

        return this.replacePrefixedTemplatePlaceholders(contents, instanceName);
    }

    replacePrefixedTemplatePlaceholders(contents, instanceName) {
        const prefixedSingular = `${instanceName.prefix} ${instanceName.singular}`;
        const prefixedPlural = `${instanceName.prefix} ${instanceName.plural}`;

        return contents.replace(/{{PREFIXED_SINGULAR_PASCAL}}/gi, changeCase.pascalCase(prefixedSingular))
            .replace(/{{PREFIXED_SINGULAR_CAMEL}}/gi, changeCase.camelCase(prefixedSingular))
            .replace(/{{PREFIXED_SINGULAR_CONSTANT}}/gi, changeCase.constantCase(prefixedSingular))
            .replace(/{{PREFIXED_SINGULAR_KEBAB}}/gi, changeCase.kebabCase(prefixedSingular))
            .replace(/{{PREFIXED_SINGULAR_SNAKE}}/gi, changeCase.snakeCase(prefixedSingular))
            .replace(/{{PREFIXED_PLURAL_PASCAL}}/gi, changeCase.pascalCase(prefixedPlural))
            .replace(/{{PREFIXED_PLURAL_CAMEL}}/gi, changeCase.camelCase(prefixedPlural))
            .replace(/{{PREFIXED_PLURAL_CONSTANT}}/gi, changeCase.constantCase(prefixedPlural))
            .replace(/{{PREFIXED_PLURAL_KEBAB}}/gi, changeCase.kebabCase(prefixedPlural))
            .replace(/{{PREFIXED_PLURAL_SNAKE}}/gi, changeCase.snakeCase(prefixedPlural));
    }
};
