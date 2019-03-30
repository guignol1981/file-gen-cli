const FileGen = require('../file-gen');

describe('when we construct a new file gen', () => {
    it('should be an error if there is no config passed to the file gen', () => {
        const test = () => new FileGen();

        expect(test).toThrowError();
    });

    it('should be an error if there is no folderNameCase configured', () => {
        let test = () => new FileGen({
            fileNameCase: 'test',
            templatePath: 'test'
        });

        expect(test).toThrowError();
    });

    it('should be an error if there is no fileNameCase configured', () => {
        let test = () => new FileGen({
            folderNameCase: 'test',
            templatePath: 'test'
        });

        expect(test).toThrowError();
    });

    it('should be an error if there is no templatePath configured', () => {
        let test = () => new FileGen({
            folderNameCase: 'test',
            fileNameCase: 'test'
        });

        expect(test).toThrowError();
    });
});
