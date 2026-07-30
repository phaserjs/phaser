var GetAdvancedValue = require('../../../src/utils/object/GetAdvancedValue');
var MATH = require('../../../src/math');
var RandomDataGenerator = require('../../../src/math/random-data-generator/RandomDataGenerator');

describe('Phaser.Utils.Objects.GetAdvancedValue', function ()
{
    beforeAll(function ()
    {
        MATH.RND = new RandomDataGenerator([ Date.now() ]);
    });

    it('should return a plain value from a source object', function ()
    {
        var source = { x: 4 };
        expect(GetAdvancedValue(source, 'x', 0)).toBe(4);
    });

    it('should return the default value when the key does not exist', function ()
    {
        var source = {};
        expect(GetAdvancedValue(source, 'x', 99)).toBe(99);
    });

    it('should return the default value when the source is an empty object', function ()
    {
        expect(GetAdvancedValue({}, 'missing', 'default')).toBe('default');
    });

    it('should return the default value when the key resolves to null via GetValue', function ()
    {
        var source = { x: null };
        expect(GetAdvancedValue(source, 'x', 42)).toBe(42);
    });

    it('should invoke a function value and return its result', function ()
    {
        var source = {
            x: function (key)
            {
                return key + '_result';
            }
        };
        expect(GetAdvancedValue(source, 'x', null)).toBe('x_result');
    });

    it('should pass the key as the argument to a function value', function ()
    {
        var receivedKey;
        var source = {
            myProp: function (key)
            {
                receivedKey = key;
                return 7;
            }
        };
        GetAdvancedValue(source, 'myProp', null);
        expect(receivedKey).toBe('myProp');
    });

    it('should pick a value from an array', function ()
    {
        var choices = [10, 20, 30];
        var source = { x: choices };
        var result = GetAdvancedValue(source, 'x', null);
        expect(choices).toContain(result);
    });

    it('should always pick within bounds of the array over many iterations', function ()
    {
        var choices = ['a', 'b', 'c', 'd'];
        var source = { x: choices };
        for (var i = 0; i < 100; i++)
        {
            var result = GetAdvancedValue(source, 'x', null);
            expect(choices).toContain(result);
        }
    });

    it('should return a randInt value within the specified range', function ()
    {
        var source = { x: { randInt: [5, 10] } };
        for (var i = 0; i < 50; i++)
        {
            var result = GetAdvancedValue(source, 'x', null);
            expect(result).toBeGreaterThanOrEqual(5);
            expect(result).toBeLessThanOrEqual(10);
            expect(Number.isInteger(result)).toBe(true);
        }
    });

    it('should return a randFloat value within the specified range', function ()
    {
        var source = { x: { randFloat: [1.0, 2.0] } };
        for (var i = 0; i < 50; i++)
        {
            var result = GetAdvancedValue(source, 'x', null);
            expect(result).toBeGreaterThanOrEqual(1.0);
            expect(result).toBeLessThanOrEqual(2.0);
        }
    });

    it('should return a plain object unchanged when it has no randInt or randFloat', function ()
    {
        var inner = { someKey: 'someValue' };
        var source = { x: inner };
        var result = GetAdvancedValue(source, 'x', null);
        expect(result).toBe(inner);
    });

    it('should support nested key access using dot notation', function ()
    {
        var source = { banner: { hideBanner: true } };
        expect(GetAdvancedValue(source, 'banner.hideBanner', false)).toBe(true);
    });

    it('should return the default value for a missing nested key', function ()
    {
        var source = { banner: {} };
        expect(GetAdvancedValue(source, 'banner.hideBanner', false)).toBe(false);
    });

    it('should return a string value correctly', function ()
    {
        var source = { name: 'phaser' };
        expect(GetAdvancedValue(source, 'name', '')).toBe('phaser');
    });

    it('should return a boolean false value correctly', function ()
    {
        var source = { flag: false };
        expect(GetAdvancedValue(source, 'flag', true)).toBe(false);
    });

    it('should return zero correctly and not treat it as falsy default fallback', function ()
    {
        var source = { count: 0 };
        expect(GetAdvancedValue(source, 'count', 99)).toBe(0);
    });

    it('should return a single-element array pick correctly', function ()
    {
        var source = { x: [42] };
        expect(GetAdvancedValue(source, 'x', null)).toBe(42);
    });

    it('should return randInt when min equals max', function ()
    {
        var source = { x: { randInt: [7, 7] } };
        expect(GetAdvancedValue(source, 'x', null)).toBe(7);
    });

    it('should return randFloat when min equals max', function ()
    {
        var source = { x: { randFloat: [3.5, 3.5] } };
        expect(GetAdvancedValue(source, 'x', null)).toBeCloseTo(3.5);
    });
});
