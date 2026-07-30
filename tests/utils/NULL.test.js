var NULL = require('../../src/utils/NULL');

describe('Phaser.Utils.NULL', function ()
{
    it('should be a function', function ()
    {
        expect(typeof NULL).toBe('function');
    });

    it('should return null when called with no arguments', function ()
    {
        expect(NULL()).toBeNull();
    });

    it('should return null when called with arguments', function ()
    {
        expect(NULL(1, 2, 3)).toBeNull();
    });

    it('should return null when called with object arguments', function ()
    {
        expect(NULL({ a: 1 }, [1, 2])).toBeNull();
    });

    it('should always return null on repeated calls', function ()
    {
        expect(NULL()).toBeNull();
        expect(NULL()).toBeNull();
        expect(NULL()).toBeNull();
    });
});
