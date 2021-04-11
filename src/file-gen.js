const changeCase = require('change-case');
const fs = require('fs');
const path = require('path');
const request = require('request');

module.exports = class FileGen {
    constructor(configName, config, entityConfig, instanceName, endpoint) {
        this.configGuard(config);

        this.folderNameCase = config.folderNameCase;
        this.fileNameCase = config.fileNameCase;
        this.configName = configName;
        this.entityConfig = entityConfig;
        this.instanceName = instanceName;
        this.endpoint = endpoint;
    }

    configGuard(config) {
        if (!config || !config.folderNameCase || !config.fileNameCase) {
            throw Error(
                'there is a problem with your configuration, please refer to documentation'
            );
        }
    }

    async generate() {
        return await Promise.all(
            this.entityConfig.fileConfigs.map(async (fileConfig) => {
                const dirName = `${process.cwd()}/${changeCase[
                    this.folderNameCase
                ](this.instanceName.singular)}`;

                this.createDir(dirName);

                this.instanceName.prefix = this.entityConfig.prefix;
                fileConfig.path = this.getFilePath(dirName, fileConfig);

                return await this.createFile(fileConfig);
            })
        );
    }

    createDir(dirName) {
        if (fs.existsSync(path.normalize(dirName))) {
            return;
        }

        fs.mkdirSync(path.normalize(dirName));
    }

    getFilePath(dirName, fileConfig) {
        const fileName = fileConfig.name.replace(
            '*',
            `${changeCase[this.fileNameCase](this.instanceName.singular)}`
        );

        return `${dirName}/${fileName}`;
    }

    async createFile(fileConfig) {
        if (!fileConfig.template) {
            fs.openSync(path.normalize(fileConfig.path), 'w');
            return Promise.resolve();
        }

        const contents = await this.getTemplateContent(fileConfig);

        fs.writeFileSync(path.normalize(fileConfig.path), contents);

        return Promise.resolve();
    }

    async getTemplateContent(fileConfig) {
        return new Promise((resolve) => {
            request.get(
                `${this.endpoint}configs/${this.configName}/files/${fileConfig.template}`,
                (err, req, body) => {
                    resolve(
                        this.replaceTemplatePlaceholders(
                            JSON.parse(body).content
                        )
                    );
                }
            );
        });
    }

    replaceTemplatePlaceholders(contents) {
        contents = contents
            .replace(
                /{{SINGULAR_PASCAL}}/gi,
                changeCase.pascalCase(this.instanceName.singular)
            )
            .replace(
                /{{SINGULAR_CAMEL}}/gi,
                changeCase.camelCase(this.instanceName.singular)
            )
            .replace(
                /{{SINGULAR_CONSTANT}}/gi,
                changeCase.constantCase(this.instanceName.singular)
            )
            .replace(
                /{{SINGULAR_KEBAB}}/gi,
                changeCase.kebabCase(this.instanceName.singular)
            )
            .replace(
                /{{SINGULAR_SNAKE}}/gi,
                changeCase.snakeCase(this.instanceName.singular)
            )
            .replace(
                /{{PLURAL_PASCAL}}/gi,
                changeCase.pascalCase(this.instanceName.plural)
            )
            .replace(
                /{{PLURAL_CAMEL}}/gi,
                changeCase.camelCase(this.instanceName.plural)
            )
            .replace(
                /{{PLURAL_CONSTANT}}/gi,
                changeCase.constantCase(this.instanceName.plural)
            )
            .replace(
                /{{PLURAL_KEBAB}}/gi,
                changeCase.kebabCase(this.instanceName.plural)
            )
            .replace(
                /{{PLURAL_SNAKE}}/gi,
                changeCase.snakeCase(this.instanceName.plural)
            );

        return this.replacePrefixedTemplatePlaceholders(contents);
    }

    replacePrefixedTemplatePlaceholders(contents, instanceName) {
        const prefixedSingular = `${this.instanceName.prefix} ${this.instanceName.singular}`;
        const prefixedPlural = `${this.instanceName.prefix} ${this.instanceName.plural}`;

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
