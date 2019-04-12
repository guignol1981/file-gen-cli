const fs = require('fs');
const FileGen = require('../file-gen');
const changeCase = require('change-case');
const config = require('./gencli.json');
const rimraf = require('rimraf');

jest.mock('change-case');

changeCase.pascal.mockImplementation(() => 'test');
changeCase.camel.mockImplementation(() => 'test');
changeCase.kebab.mockImplementation(() => 'test');
changeCase.constant.mockImplementation(() => 'test');
changeCase.snake.mockImplementation(() => 'test');

describe('when we construct a new file gen', () => {
    it('should be an error if there is no config passed to the file gen', () => {
        const fileGen = () => new FileGen();

        expect(fileGen).toThrowError();
    });

    it('should be an error if there is no folderNameCase configured', () => {
        let fileGen = () => new FileGen({
            fileNameCase: 'test'
        });

        expect(fileGen).toThrowError();
    });

    it('should be an error if there is no fileNameCase configured', () => {
        let fileGen = () => new FileGen({
            folderNameCase: 'test'
        });

        expect(fileGen).toThrowError();
    });
});

describe('when we generate a new entity instance', () => {
    let fileGen;

    beforeEach(() => {
        changeCase.camel.mockClear();
        changeCase.pascal.mockClear();
        changeCase.kebab.mockClear();
        changeCase.constant.mockClear();

        fileGen = new FileGen(config);
        fileGen.generate(config.entityConfigs[0], { singular: 'test', plural: 'tests' });
    });

    it('should create folder if it does not exist', () => {
        expect(fs.existsSync('src/tests/test-entity/test')).toBe(true);
    });

    it('should create file', () => {
        expect(fs.existsSync('src/tests/test-entity/test/test-test.ts')).toBe(true);
    });

    it('it should transform all template keywords', () => {
        expect(changeCase.pascal).toBeCalledWith('test');
        expect(changeCase.camel).toBeCalledWith('test');
        expect(changeCase.kebab).toBeCalledWith('test');
        expect(changeCase.constant).toBeCalledWith('test');
        expect(changeCase.snake).toBeCalledWith('test');
        expect(changeCase.pascal).toBeCalledWith('tests');
        expect(changeCase.camel).toBeCalledWith('tests');
        expect(changeCase.kebab).toBeCalledWith('tests');
        expect(changeCase.constant).toBeCalledWith('tests');
        expect(changeCase.snake).toBeCalledWith('tests');
        expect(changeCase.pascal).toBeCalledWith('test test');
        expect(changeCase.camel).toBeCalledWith('test test');
        expect(changeCase.kebab).toBeCalledWith('test test');
        expect(changeCase.constant).toBeCalledWith('test test');
        expect(changeCase.snake).toBeCalledWith('test test');
        expect(changeCase.pascal).toBeCalledWith('test tests');
        expect(changeCase.camel).toBeCalledWith('test tests');
        expect(changeCase.kebab).toBeCalledWith('test tests');
        expect(changeCase.constant).toBeCalledWith('test tests');
        expect(changeCase.snake).toBeCalledWith('test tests');
    });

    afterEach(() => {
        rimraf.sync('src/tests/test-entity/test');
    });
});
