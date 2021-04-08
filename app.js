#!/usr/bin/env node

const args = process.argv.slice(2);
const figlet = require('figlet');
const chalk = require('chalk');
const CLI = require('./src/cli');
const FileGen = require('./src/file-gen');
const firebase = require('firebase');
const path = require('path');
const gcloudStorate = require('@google-cloud/storage');
const firebaseConfig = {
    apiKey: 'AIzaSyBKZn5TmFbPudGEN-1iKDiC6sHvZLxxW6k',
    authDomain: 'fil-gen-cli.firebaseapp.com',
    projectId: 'fil-gen-cli',
    storageBucket: 'fil-gen-cli.appspot.com',
    messagingSenderId: '484720598120',
    appId: '1:484720598120:web:4e96db7b1f4b07c9f7efdd',
    measurementId: 'G-RYXZ5393XZ',
};

try {
    const storage = new gcloudStorate.Storage({
        projectId: 'fil-gen-cli',
        keyFilename: path.join(__dirname, 'gcloud.json'),
    });
    const firebaseApp = firebase.initializeApp(firebaseConfig);
    const firestore = firebaseApp.firestore();

    const registerConfig = async () => {
        const config = require(path.join(process.cwd(), 'gencli.json'));

        firestore.collection('configs').doc(args[1]).set(config);

        await storage
            .bucket('fil-gen-cli.appspot.com')
            .deleteFiles({ prefix: args[1] });

        await Promise.all(
            config.entityConfigs.map(async (ec) => {
                return await Promise.all(
                    ec.fileConfigs.map(async (fc) => {
                        return await storage
                            .bucket('fil-gen-cli.appspot.com')
                            .upload(path.join(process.cwd(), fc.template), {
                                destination: `${args[1]}/${fc.template}`,
                            });
                    })
                );
            })
        );
    };

    const generateFiles = async () => {
        const snap = await firestore.collection('configs').doc(args[0]).get();
        const config = snap.data();

        // let cli = new CLI(config);
        // let { entityName, instanceName } = await cli.init();
        entityName = 'module';
        instanceName = {
            singular: 'test',
            plural: 'test',
        };
        const fileGen = new FileGen(
            args[0],
            config,
            (entityConfig = config.entityConfigs.find(
                (ec) => ec.name === entityName
            )),
            instanceName,
            firestore,
            storage
        );

        return await fileGen.generate();
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
