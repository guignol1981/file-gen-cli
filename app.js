#!/usr/bin/env node

const args = process.argv.slice(2);
const figlet = require('figlet');
const chalk = require('chalk');
const CLI = require('./src/cli');
const FileGen = require('./src/file-gen');
const path = require('path');
const request = require('request');
const fs = require('fs');
const FormData = require('form-data');

try {
    const registerConfig = async () => {
        const config = require(path.join(process.cwd(), 'gencli.json'));
        await request.post('https://file-gen-cli.herokuapp.com/configs', {
            json: true,
            body: config,
            auth: {
                bearer: config.token,
            },
        });

        await Promise.all(
            config.entityConfigs.map(async (ec) => {
                await Promise.all(
                    ec.fileConfigs.map(async (fc) => {
                        const formData = new FormData();
                        formData.append(
                            'file',
                            fs.createReadStream(
                                path.join(process.cwd(), fc.template)
                            ),
                            {
                                filename: fc.template,
                            }
                        );
                        await request.post(
                            `https://file-gen-cli.herokuapp.com/configs/${config.cliName}/files`,
                            {
                                headers: {
                                    'Content-Type':
                                        'multipart/form-data; boundary=' +
                                        formData.getBoundary(),
                                },
                                body: formData,
                                auth: {
                                    bearer: config.token,
                                },
                            }
                        );
                    })
                );
            })
        );
    };

    const generateFiles = () => {
        return new Promise((resolve) => {
            request.get(
                `https://file-gen-cli.herokuapp.com/configs/${args[0]}`,
                async (err, req, body) => {
                    const config = JSON.parse(body).config;

                    let cli = new CLI(config);
                    let { entityName, instanceName } = await cli.init();

                    const fileGen = new FileGen(
                        args[0],
                        config,
                        (entityConfig = config.entityConfigs.find(
                            (ec) => ec.name === entityName
                        )),
                        instanceName
                    );

                    await fileGen.generate();
                    resolve();
                }
            );
        });
    };

    const greet = () => {
        console.log(
            chalk.green(
                figlet.textSync('file-gen-cli', {
                    font: 'speed',
                })
            )
        );
        console.log(
            chalk.white.bgBlue.bold(
                `By Vincent Guillemette - github/guignol1981`
            )
        );
    };

    const goodbye = () => {
        console.log(chalk.white.bgBlue.bold(`Done!`));
        process.exit();
    };

    const run = async () => {
        greet();

        if (args[0] === 'register') {
            await registerConfig();
        } else {
            await generateFiles();
        }

        goodbye();
    };

    run();
} catch (e) {
    console.log(e);
}
