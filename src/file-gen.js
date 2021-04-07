const changeCase = require('change-case');
const fs = require('fs');
const path = require('path');

module.exports = class FileGen {
    constructor(
        projectId,
        config,
        entityConfig,
        instanceName,
        firestore,
        storage
    ) {
        this.configGuard(config);

        this.folderNameCase = config.folderNameCase;
        this.fileNameCase = config.fileNameCase;
        this.templatePath = config.templatePath;
        this.firestore = firestore;
        this.storage = storage;
        this.projectId = projectId;
        this.generate(entityConfig, instanceName);
    }

    configGuard(config) {
        if (
            !config ||
            !config.folderNameCase ||
            !config.fileNameCase ||
            !config.templatePath
        ) {
            throw Error(
                'there is a problem with your configuration, please refer to documentation'
            );
        }
    }

    generate(entityConfig, instanceName) {
        entityConfig.fileConfigs.forEach((fileConfig) => {
            const dirName = `${process.cwd()}/${changeCase[this.folderNameCase](
                instanceName.singular
            )}`;

            this.createDir(dirName);

            instanceName.prefix = entityConfig.prefix;
            fileConfig.path = this.getFilePath(
                dirName,
                fileConfig,
                instanceName
            );

            this.createFile(fileConfig, instanceName);
        });
    }

    createDir(dirName) {
        if (fs.existsSync(path.normalize(dirName))) {
            return;
        }

        fs.mkdirSync(path.normalize(dirName));
    }

    getFilePath(dirName, fileConfig, instanceName) {
        const fileName = fileConfig.name.replace(
            '*',
            `${changeCase[this.fileNameCase](instanceName.singular)}`
        );

        return `${dirName}/${fileName}`;
    }

    createFile(fileConfig, instanceName) {
        if (!fileConfig.template) {
            fs.openSync(path.normalize(fileConfig.path), 'w');
            return;
        }

        this.getTemplateContent(fileConfig, instanceName).then((contents) => {
            fs.writeFileSync(path.normalize(fileConfig.path), contents);
        });
    }

    async getTemplateContent(fileConfig, instanceName) {
        const bucketFile = await this.storage
            .bucket('fil-gen-cli.appspot.com')
            .file(`${this.projectId}/${fileConfig.template}`);
        const file = await bucketFile.download();
        return this.replaceTemplatePlaceholders(
            file[0].toString('utf8'),
            instanceName
        );
    }

    replaceTemplatePlaceholders(contents, instanceName) {
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

        return this.replacePrefixedTemplatePlaceholders(contents, instanceName);
    }

    replacePrefixedTemplatePlaceholders(contents, instanceName) {
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
    }
};
