const fs = require('fs');
const changeCase = require('change-case');
const path = require('path');

module.exports = (instanceName, prefix = '', plural = '') => {
    if (!fs.existsSync(path.normalize('templates'))) {
        fs.mkdirSync(path.normalize('templates'));
    }

    fs.readdirSync(path.normalize(process.cwd())).forEach((file) => {
        let content = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');

        if (prefix) {
            content = content
                .replace(
                    new RegExp(
                        changeCase.pascalCase(`${prefix}-${instanceName}`),
                        'g'
                    ),
                    `{{PREFIXED_SINGULAR_PASCAL}}`
                )
                .replace(
                    new RegExp(
                        changeCase.kebabCase(`${prefix}-${instanceName}`),
                        'g'
                    ),
                    `{{PREFIXED_SINGULAR_KEBAB}}`
                )
                .replace(
                    new RegExp(
                        changeCase.snakeCase(`${prefix}-${instanceName}`),
                        'g'
                    ),
                    `{{PREFIXED_SINGULAR_SNAKE}}`
                )
                .replace(
                    new RegExp(
                        changeCase.constantCase(`${prefix}-${instanceName}`),
                        'g'
                    ),
                    `{{PREFIXED_SINGULAR_CONSTANT}}`
                )
                .replace(
                    new RegExp(
                        changeCase.camelCase(`${prefix}-${instanceName}`),
                        'g'
                    ),
                    `{{PREFIXED_SINGULAR_CAMEL}}`
                );
            if (plural) {
                content = content
                    .replace(
                        new RegExp(
                            changeCase.pascalCase(`${prefix}-${plural}`),
                            'g'
                        ),
                        `{{PREFIXED_PLURAL_PASCAL}}`
                    )
                    .replace(
                        new RegExp(
                            changeCase.kebabCase(`${prefix}-${plural}`),
                            'g'
                        ),
                        `{{PREFIXED_PLURAL_KEBAB}}`
                    )
                    .replace(
                        new RegExp(
                            changeCase.snakeCase(`${prefix}-${plural}`),
                            'g'
                        ),
                        `{{PREFIXED_PLURAL_SNAKE}}`
                    )
                    .replace(
                        new RegExp(
                            changeCase.constantCase(`${prefix}-${plural}`),
                            'g'
                        ),
                        `{{PREFIXED_PLURAL_CONSTANT}}`
                    )
                    .replace(
                        new RegExp(
                            changeCase.camelCase(`${prefix}-${plural}`),
                            'g'
                        ),
                        `{{PREFIXED_PLURAL_CAMEL}}`
                    );
            }
        }

        content = content
            .replace(
                new RegExp(changeCase.pascalCase(instanceName), 'g'),
                `{{SINGULAR_PASCAL}}`
            )
            .replace(
                new RegExp(changeCase.kebabCase(instanceName), 'g'),
                `{{SINGULAR_KEBAB}}`
            )
            .replace(
                new RegExp(changeCase.snakeCase(instanceName), 'g'),
                `{{SINGULAR_SNAKE}}`
            )
            .replace(
                new RegExp(changeCase.constantCase(instanceName), 'g'),
                `{{SINGULAR_CONSTANT}}`
            )
            .replace(
                new RegExp(changeCase.camelCase(instanceName), 'g'),
                `{{SINGULAR_CAMEL}}`
            );
        if (plural) {
            content = content
                .replace(
                    new RegExp(changeCase.pascalCase(plural), 'g'),
                    `{{PLURAL_PASCAL}}`
                )
                .replace(
                    new RegExp(changeCase.kebabCase(plural), 'g'),
                    `{{PLURAL_KEBAB}}`
                )
                .replace(
                    new RegExp(changeCase.snakeCase(plural), 'g'),
                    `{{PLURAL_SNAKE}}`
                )
                .replace(
                    new RegExp(changeCase.constantCase(plural), 'g'),
                    `{{PLURAL_CONSTANT}}`
                )
                .replace(
                    new RegExp(changeCase.camelCase(plural), 'g'),
                    `{{PLURAL_CAMEL}}`
                );
        }

        fs.writeFileSync(
            path.join(process.cwd(), '/templates', file + '.txt'),
            content
        );
    });
};
