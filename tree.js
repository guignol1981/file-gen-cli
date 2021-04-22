'use strict';

const path = require('path');

const SYMBOLS = {
    BRANCH: '├── ',
    EMPTY: '',
    INDENT: '    ',
    LAST_BRANCH: '└── ',
    VERTICAL: '│   ',
};

function print(entity) {
    const lines = [];

    let tree = {};

    if (!entity.flat) {
        lines.push(SYMBOLS.LAST_BRANCH + '*');
    }

    entity.fileConfigs.forEach((file, fi, fa) => {
        let pathParts = path.join(file.path || '').split('\\');
        const parsePath = (path, branch) => {
            if (!branch[path[0]]) {
                branch[path[0]] = {};
            }
            if (path[1]) {
                parsePath(path.slice(1), branch[path[0]]);
            } else {
                if (!(branch[path[0]] instanceof Array)) {
                    branch[path[0]] = [];
                }
                if (!branch[path[0]].includes(file.name)) {
                    branch[path[0]].push(file.name);
                }
                return;
            }
        };

        parsePath(pathParts, tree);
    });

    const parseTree = (branch, line) => {
        if (branch instanceof Array) {
            lines.push(line + SYMBOLS.LAST_BRANCH + branch[0]);
            branch.forEach((b) => {
                lines.push(line + SYMBOLS.LAST_BRANCH + b);
            });
            return;
        }

        Object.keys(branch).forEach((k, ki) => {
            let newLine = line;
            if (k !== '.') {
                lines.push(
                    line +
                        (Object.keys(branch).length === ki + 1
                            ? SYMBOLS.LAST_BRANCH
                            : SYMBOLS.BRANCH) +
                        k
                );

                if (Object.keys(branch).length === ki + 1) {
                    newLine += SYMBOLS.INDENT;
                } else {
                    newLine += SYMBOLS.VERTICAL;
                }
            }

            parseTree(branch[k], newLine);
        });
    };

    parseTree(tree, SYMBOLS.INDENT);

    return lines;
}

function tree(entity) {
    return print(entity).join('\n');
}

module.exports = tree;
