#!/usr/bin/env node

const args = process.argv.slice(2);
const figlet = require('figlet');
const chalk = require('chalk');
const CLI = require('./src/cli');
const FileGen = require('./src/file-gen');
const path = require('path');
const firebaseAdmin = require('firebase-admin');

try {
    const registerConfig = async () => {
        const config = require(path.join(process.cwd(), 'gencli.json'));
        const admin = firebaseAdmin.initializeApp(
            firebaseAdmin.credential.cert(config.accountKey)
        );

        admin.firestore().collection('configs').doc(args[1]).set(config);

        await admin
            .storage()
            .bucket('fil-gen-cli.appspot.com')
            .deleteFiles({ prefix: args[1] });

        await Promise.all(
            config.entityConfigs.map(async (ec) => {
                return await Promise.all(
                    ec.fileConfigs.map(async (fc) => {
                        return await admin
                            .storage()
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
        // read only service account, can be published
        const admin = firebaseAdmin.initializeApp(
            firebaseAdmin.credential.cert({
                type: 'service_account',
                project_id: 'fil-gen-cli',
                private_key_id: '4b49c40c464b121db8a4db142e2800c3d9f01d38',
                private_key:
                    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHTszN2wIzRByT\nrs/SNoOApnysGqwKUlzztYCQEDzI1ztUWM8Jm7yR7bjcCXWd5DE1zZhAwsvfZ8o5\nU3MPKf2OYJvJnYxYlzwdTuIjS//Qv7ob3yJzaQ08joKMYY+ag8AnWOw6MN2OFWmB\n4sAy6zhc6oKZCqSrIweMYXLFSXXPRQ1x3/ZPdO1CLASX0VhAXVUTm7Hkgk5VMCYi\nECCLz7nkSMp7VZ8UDabtXtID6p4anx2voEWDNmozx/bU/jPWMXF8omnPPX2LFD6n\n5O6Tag8UjemVjVDA+5T3Lg1BfYFLDxd5ZxcvHksBTcee0lbDQLH6le4EdmrFkEAh\nY4KkS+2BAgMBAAECggEAGIxUHWbENpxFCMuXPUUJnWbkJC6E0iCi4kGQvC3Dztjz\nrcfieER+TVsCUde4bOIWTZItFoznn3ShK75jhZKecFLl3UdSafb2qIV2xPIvZ/61\nZYluLNjbkIHdAn1hup5PpIkHT4OFRmLMw/qxwZPHNWqM+1ycO5fs7hVylWoe4JBh\nGHD5hOYNV/5g2ZnIm3EILWGIWTVcc7A2IQNlpUD+ck241Z4xl6Ix7FSfgntpphLP\nccIRnh/4snEjypq1DpYmDPMPa2JgyKg4fMEA2WJmanjjrLcuP5MsplgfYAQc06xu\nZrPQPW7E0p7oMDs0eADXS6EsfY4owPzzU09ne+yMoQKBgQDmE5P3Sd3dlUnLYKuA\nkIkLQQl9PHwyTzU6dfEhKflVCLBS9dYvvFKsJnsyk3RtX1ZD0wO9tM60wvTuv+Pw\nD5H56RVa7v+kMr2ZVuu6NGS793PiSFfU+/J9g0DU5qgZWJyytu111rXTFgshZBEc\n+4WFM5/g4REVO8ozxextJscVEwKBgQDdw7fDd0TJNEASZb+GVPJdqaskVOCiNMUT\nNpoXt+P6MTg1cwHeyw0iZ0i74kmosT+Kz5+4xHWzVZ5QhtCym+WZeePxv3SFA9Gp\neMJ6UjtfZCoSSZD7LMKtmtj+wbtflMkZTnTX2tmN8sDpPO48+g1mvIs7m9PBJBsp\nBNx7YPmJmwKBgBevrk0IGsJEK0u30RA0UReKg4qUHokjZGx3VfK/Gn8pnNV9n6Zc\ncfptH8POMG9OIFhtMfZm1d0AMS0fLj05rSKYX210K3dhDenqa+xIlpJPYGvMXNZ9\ndbJ8P8FrWaT6XW98q6e1ChUIMO8oGSbtsgpLjUsegJ66ABAicTuvgVFnAoGAaaK7\nPF7p4zYCd0EEdIauVLNnlIzh3CJq5fYSfM3ZyOn9Lmi0MV5jyUmNugHWuIaGECdK\nnAbpUh2spgsyCoJ8YhlP3W4noNzq2GFvsjjNk2jxKXjlmN//dBbY2rGKAcOr72QS\nAGh9TUKfZfriOSWbkJ6rbB+UROJgFa/9HsBY3ZUCgYEAo6rEwhHyg7OladjMMQOK\nBZ+3ovXIKIFW4DVORa0HeaYn8CZPBKucvNhGutR/cZWfNYTqzCvZCrlhjGYdGDC/\nGt8uyPG0gfumGkQaAGgY216Oh7Y78ASEYTDC4WiPpSFmOwlrXC8m7Rx8sByQkKxi\nQUJdWkUuLInurmUfG9MJOVg=\n-----END PRIVATE KEY-----\n',
                client_email: 'cli-reader@fil-gen-cli.iam.gserviceaccount.com',
                client_id: '108057293471165185420',
                auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                token_uri: 'https://oauth2.googleapis.com/token',
                auth_provider_x509_cert_url:
                    'https://www.googleapis.com/oauth2/v1/certs',
                client_x509_cert_url:
                    'https://www.googleapis.com/robot/v1/metadata/x509/cli-reader%40fil-gen-cli.iam.gserviceaccount.com',
            })
        );

        const snap = await admin
            .firestore()
            .collection('configs')
            .doc(args[0])
            .get();
        const config = snap.data();

        let cli = new CLI(config);
        let { entityName, instanceName } = await cli.init();

        const fileGen = new FileGen(
            args[0],
            config,
            (entityConfig = config.entityConfigs.find(
                (ec) => ec.name === entityName
            )),
            instanceName,
            admin.firestore(),
            admin.storage()
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
