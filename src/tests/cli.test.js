const CLI = require('../cli');

describe('when we construct a new cli', () => {
    it('should be an error if there is no config passed to the cli', () => {
        const test = () => new CLI();

        expect(test).toThrowError();
    });

    it('should be an error if there is no entities configured', () => {
        let test = () => new CLI({});

        expect(test).toThrowError();
    });
});

