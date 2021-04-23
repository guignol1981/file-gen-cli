const { default: chalk } = require('chalk');

const SYMBOLS = {
    BRANCH: '├── ',
    EMPTY: '',
    INDENT: '    ',
    LAST_BRANCH: '└── ',
    VERTICAL: '│   ',
};

module.exports = () => {
    console.log(SYMBOLS.EMPTY);
    console.log(chalk.cyan(`Command list: `));
    console.log(
        chalk.blue(`${SYMBOLS.INDENT + SYMBOLS.BRANCH} list [...tags]`)
    );
    console.log(
        `${
            SYMBOLS.INDENT + SYMBOLS.VERTICAL + SYMBOLS.LAST_BRANCH
        } List registed CLIs with optinal tags filter`
    );

    console.log(`${SYMBOLS.INDENT + SYMBOLS.VERTICAL}`);

    console.log(
        chalk.blue(
            `${
                SYMBOLS.INDENT + SYMBOLS.BRANCH
            } deduce  <instance name> [<prefix> <plural>]`
        )
    );
    console.log(
        `${
            SYMBOLS.INDENT + SYMBOLS.VERTICAL + SYMBOLS.LAST_BRANCH
        } Deduce template from files where command is executed.`
    );
    console.log(`${SYMBOLS.INDENT + SYMBOLS.VERTICAL}`);

    console.log(chalk.blue(`${SYMBOLS.INDENT + SYMBOLS.BRANCH} register`));
    console.log(
        `${
            SYMBOLS.INDENT + SYMBOLS.VERTICAL + SYMBOLS.LAST_BRANCH
        } Register the CLI from the gencli.json where command is executed.`
    );
    console.log(`${SYMBOLS.INDENT + SYMBOLS.VERTICAL}`);

    console.log(
        chalk.blue(`${SYMBOLS.INDENT + SYMBOLS.BRANCH} -v || -version`)
    );
    console.log(`${SYMBOLS.INDENT + SYMBOLS.VERTICAL}`);

    console.log(chalk.blue(`${SYMBOLS.INDENT + SYMBOLS.BRANCH} -h || -help`));
    console.log(`${SYMBOLS.INDENT + SYMBOLS.VERTICAL}`);

    console.log(
        chalk.blue(`${SYMBOLS.INDENT + SYMBOLS.LAST_BRANCH} <cli name>`)
    );
    console.log(
        `${
            SYMBOLS.INDENT + SYMBOLS.INDENT + SYMBOLS.LAST_BRANCH
        } Use a registered CLI.`
    );
};
