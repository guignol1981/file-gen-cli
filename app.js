#!/usr/bin/env node

const args = process.argv.slice(2);
const figlet = require('figlet');
const chalk = require('chalk');
const CLI = require('./src/cli');
const FileGen = require('./src/file-gen');
const firebase = require('firebase');
const path = require('path');
const gcloudStorate = require('@google-cloud/storage');

const storage = new gcloudStorate.Storage({
    projectId: 'fil-gen-cli',
    keyFilename: path.join(__dirname, 'gcloud.json'),
});

const firebaseConfig = {
    apiKey: 'AIzaSyBKZn5TmFbPudGEN-1iKDiC6sHvZLxxW6k',
    authDomain: 'fil-gen-cli.firebaseapp.com',
    projectId: 'fil-gen-cli',
    storageBucket: 'fil-gen-cli.appspot.com',
    messagingSenderId: '484720598120',
    appId: '1:484720598120:web:4e96db7b1f4b07c9f7efdd',
    measurementId: 'G-RYXZ5393XZ',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firestore = firebaseApp.firestore();
const greet = () => {
    console.log(
        chalk.green(
            figlet.textSync('file-gen-cli', {
                font: 'speed',
            })
        )
    );
    console.log(
        chalk.white.bgBlue.bold(`By Vincent Guillemette - github/guignol1981`)
    );
};

const goodbye = () => {
    console.log(chalk.white.bgBlue.bold(`Done!`));
    process.exit();
};

if (args[0] === 'register') {
    const config = require(path.join(process.cwd(), 'gencli.json'));

    firestore.collection('configs').doc(args[1]).set(config);

    config.entityConfigs.forEach((ec) => {
        ec.fileConfigs.forEach((fc) => {
            storage
                .bucket('fil-gen-cli.appspot.com')
                .upload(path.join(process.cwd(), fc.template), {
                    destination: `${args[1]}/${fc.template}`,
                });
        });
    });

    goodbye();
} else {
    const run = async () => {
        greet();

        const snap = await firestore.collection('configs').doc(args[0]).get();
        const config = snap.data();

        let cli = new CLI(config);

        await cli.init((entityName, instanceName) => {
            new FileGen(
                args[0],
                config,
                (entityConfig = config.entityConfigs.find(
                    (ec) => ec.name === entityName
                )),
                instanceName,
                firestore,
                storage
            );
        });

        goodbye();
    };

    run();
}
