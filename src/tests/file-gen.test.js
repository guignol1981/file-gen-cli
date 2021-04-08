const fs = require('fs');
const FileGen = require('../file-gen');
const changeCase = require('change-case');
const config = require('./gencli.json');

jest.mock('change-case');

describe('when we construct a new file gen', () => {
    it('should be an error if there is no config passed to the file gen', () => {
        const fileGen = () => new FileGen();

        expect(fileGen).toThrowError();
    });

    it('should be an error if there is no folderNameCase configured', () => {
        let fileGen = () =>
            new FileGen({
                fileNameCase: 'test',
            });

        expect(fileGen).toThrowError();
    });

    it('should be an error if there is no fileNameCase configured', () => {
        let fileGen = () =>
            new FileGen({
                folderNameCase: 'test',
            });

        expect(fileGen).toThrowError();
    });
});
