const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

exports.registor = async (config, endpoint) => {
    await fetch(`${endpoint}/configs`, {
        method: 'POST',
        body: JSON.stringify(config),
        headers: {
            'Authorization': `Bearer ${config.token}`,
            'Content-Type': 'application/json',
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

                    await fetch(`${endpoint}/configs/${config.cliName}/files`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${config.token}`,
                            'Content-Type':
                                'multipart/form-data; boundary=' +
                                formData.getBoundary(),
                        },
                        body: formData,
                    });
                })
            );
        })
    );
};
