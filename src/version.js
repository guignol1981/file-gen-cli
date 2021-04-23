const pjson = require('../package.json');
module.exports = () => {
    console.log(`v.${pjson.version}`);
};
