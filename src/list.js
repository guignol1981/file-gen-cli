const { default: chalk } = require('chalk');
const fetch = require('node-fetch');

module.exports = async (tags) => {
    const { configs } = await fetch(
        `${process.env.APP_BASE_URL}/configs/list`,
        {
            method: 'POST',
            body: JSON.stringify({ tags }),
            headers: { 'Content-Type': 'application/json' },
        }
    ).then((res) => res.json());
    configs.forEach((c) => {
        console.log(chalk.green('name: ', c.name));
        console.log(chalk.blue('description: ', c.description));
        console.log(chalk.cyan('author: ', c.author));
        console.log('----');
    });
};
