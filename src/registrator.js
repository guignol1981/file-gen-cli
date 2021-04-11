const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

exports.registor = async (config, endpoint) => {
    const res = await fetch(`${endpoint}/configs`, {
        method: 'POST',
        body: JSON.stringify(config),
        headers: {
            'Authorization': `Bearer ${config.token}`,
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json());

    console.log(res.msg);

    if (!res.ok) {
        return;
    }

    await Promise.all(
        config.entityConfigs.map(async (ec) => {
            await Promise.all(
                ec.fileConfigs.map(async (fc) => {
                    if (!fs.existsSync(path.join(process.cwd(), fc.template))) {
                        throw `couldn't find ${fc.template} template, add the template in this folder and try again!`;
                    }

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
                    const res = await fetch(
                        `${endpoint}/configs/${config.cliName}/files`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${config.token}`,
                                'Content-Type':
                                    'multipart/form-data; boundary=' +
                                    formData.getBoundary(),
                            },
                            body: formData,
                        }
                    ).then((res) => res.json());

                    console.log(res.msg);
                })
            );
        })
    );
};
