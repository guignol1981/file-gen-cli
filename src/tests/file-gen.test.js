const fs = require('fs');
const FileGen = require('../file-gen');
const changeCase = require('change-case');
const config = require('./gencli.json');
const rimraf = require('rimraf');

jest.mock('change-case');

changeCase.kebab.mockImplementation(() => 'test');

describe('when we construct a new file gen', () => {
    it('should be an error if there is no config passed to the file gen', () => {
        const fileGen = () => new FileGen();

        expect(fileGen).toThrowError();
    });

    it('should be an error if there is no folderNameCase configured', () => {
        let fileGen = () => new FileGen({
            fileNameCase: 'test',
            templatePath: 'test'
        });

        expect(fileGen).toThrowError();
    });

    it('should be an error if there is no fileNameCase configured', () => {
        let fileGen = () => new FileGen({
            folderNameCase: 'test',
            templatePath: 'test'
        });

        expect(fileGen).toThrowError();
    });

    it('should be an error if there is no templatePath configured', () => {
        let fileGen = () => new FileGen({
            folderNameCase: 'test',
            fileNameCase: 'test'
        });

        expect(fileGen).toThrowError();
    });
});

describe('when we generate a new entity instance', () => {
    let fileGen;

    beforeEach(() => {
        fileGen = new FileGen(config);
        fileGen.generate(config.entityConfigs[0], { singular: 'test', plural: 'tests' });
    });

    it('should create folder if it does not exist', () => {
        expect(fs.existsSync('src/tests/test-entity/test')).toBe(true);
    });

    it('should create file', () => {
        expect(fs.existsSync('src/tests/test-entity/test/test-test.ts')).toBe(true);
    });

    afterEach(() => {
        rimraf.sync('src/tests/test-entity/test');
    });
});
