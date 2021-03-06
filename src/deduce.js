const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

module.exports = async (singular, prefix = '', plural = '') => {
    const instanceName = {
        singular,
        prefix,
        plural,
    };

    if (!fs.existsSync(path.normalize('templates'))) {
        fs.mkdirSync(path.normalize('templates'));
    }

    await Promise.all(
        fs.readdirSync(process.cwd()).map(async (file) => {
            if (!fs.lstatSync(path.join(process.cwd(), file)).isFile()) return;
            let raw = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');

            const { template } = await fetch(
                `${process.env.APP_BASE_URL}/templates/deduce`,
                {
                    method: 'POST',
                    body: JSON.stringify({ instanceName, template: raw }),
                    headers: { 'Content-Type': 'application/json' },
                }
            ).then((res) => res.json());

            fs.writeFileSync(
                path.join(process.cwd(), '/templates', file + '.txt'),
                template
            );
        })
    );
};
