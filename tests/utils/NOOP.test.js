var NOOP = require('../../src/utils/NOOP');

describe('Phaser.Utils.NOOP', function ()
{
    it('should be a function', function ()
    {
        expect(typeof NOOP).toBe('function');
    });

    it('should return undefined when called with no arguments', function ()
    {
        expect(NOOP()).toBeUndefined();
    });

    it('should return undefined when called with arguments', function ()
    {
        expect(NOOP(1, 2, 3)).toBeUndefined();
    });

    it('should not throw when called', function ()
    {
        expect(function () { NOOP(); }).not.toThrow();
    });

    it('should not throw when called with various argument types', function ()
    {
        expect(function () { NOOP(null, undefined, {}, [], 'string', 42, true); }).not.toThrow();
    });
});
