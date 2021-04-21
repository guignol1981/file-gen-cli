const fs = require('fs');
const changeCase = require('change-case');
const path = require('path');
const fetch = require('node-fetch');

module.exports = async (instanceName, endpoint) => {
    if (!fs.existsSync(path.normalize('templates'))) {
        fs.mkdirSync(path.normalize('templates'));
    }

    await Promise.all(
        fs.readdirSync(process.cwd()).map(async (file) => {
            if (!fs.lstatSync(path.join(process.cwd(), file)).isFile()) return;
            let raw = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');

            const { template } = await fetch(`${endpoint}/templates/deduce`, {
                method: 'POST',
                body: JSON.stringify({ instanceName, template: raw }),
                headers: { 'Content-Type': 'application/json' },
            }).then((res) => res.json());

            fs.writeFileSync(
                path.join(process.cwd(), '/templates', file + '.txt'),
                template
            );
        })
    );
};
