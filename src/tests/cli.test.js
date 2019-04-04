const cli = require('../cli');

describe('when we construct a new cli', () => {
    it('should be an error if there is no config passed to the cli', () => {
        const test = async () => await cli();
        try {
            await test();
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });

    it('should be an error if there is no entities configured', async () => {
        const test = async () => await cli({});
        try {
            await test();
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });
});
