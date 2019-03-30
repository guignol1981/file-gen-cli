const FileGen = require('../file-gen');

describe('when we construct a new file gen', () => {
    it('should be an error if there is no config passed to the file gen', () => {
        const test = () => new FileGen();

        expect(test).toThrowError();
    });

    it('should be an error if there is no entities configured', () => {
        let test = () => new FileGen({});

        expect(test).toThrowError();
    });
});
