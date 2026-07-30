var GetInterpolationFunction = require('../../../src/tweens/builders/GetInterpolationFunction');
var Bezier = require('../../../src/math/interpolation/BezierInterpolation');
var CatmullRom = require('../../../src/math/interpolation/CatmullRomInterpolation');
var Linear = require('../../../src/math/interpolation/LinearInterpolation');

describe('Phaser.Tweens.Builders.GetInterpolationFunction', function ()
{
    it('should return null when null is passed', function ()
    {
        expect(GetInterpolationFunction(null)).toBeNull();
    });

    it('should return the linear interpolation function for "linear"', function ()
    {
        expect(GetInterpolationFunction('linear')).toBe(Linear);
    });

    it('should return the bezier interpolation function for "bezier"', function ()
    {
        expect(GetInterpolationFunction('bezier')).toBe(Bezier);
    });

    it('should return the catmull-rom interpolation function for "catmull"', function ()
    {
        expect(GetInterpolationFunction('catmull')).toBe(CatmullRom);
    });

    it('should return the catmull-rom interpolation function for "catmullrom"', function ()
    {
        expect(GetInterpolationFunction('catmullrom')).toBe(CatmullRom);
    });

    it('should fall back to linear interpolation for an unrecognised string', function ()
    {
        expect(GetInterpolationFunction('unknown')).toBe(Linear);
    });

    it('should fall back to linear interpolation for an empty string', function ()
    {
        expect(GetInterpolationFunction('')).toBe(Linear);
    });

    it('should return a custom function when a function is passed', function ()
    {
        var customFn = function (v, k) { return 0; };
        expect(GetInterpolationFunction(customFn)).toBe(customFn);
    });

    it('should return the custom function directly without wrapping it', function ()
    {
        var called = false;
        var customFn = function () { called = true; return 42; };
        var result = GetInterpolationFunction(customFn);
        result();
        expect(called).toBe(true);
    });

    it('should fall back to linear interpolation for undefined', function ()
    {
        expect(GetInterpolationFunction(undefined)).toBe(Linear);
    });

    it('should fall back to linear interpolation for a numeric value', function ()
    {
        expect(GetInterpolationFunction(123)).toBe(Linear);
    });

    it('should fall back to linear interpolation for a boolean value', function ()
    {
        expect(GetInterpolationFunction(true)).toBe(Linear);
    });

    it('should fall back to linear interpolation for an object value', function ()
    {
        expect(GetInterpolationFunction({})).toBe(Linear);
    });

    it('should return a function for all valid string keys', function ()
    {
        var keys = ['linear', 'bezier', 'catmull', 'catmullrom'];
        for (var i = 0; i < keys.length; i++)
        {
            expect(typeof GetInterpolationFunction(keys[i])).toBe('function');
        }
    });

    it('should be case-sensitive and not match "Linear"', function ()
    {
        expect(GetInterpolationFunction('Linear')).toBe(Linear);
    });

    it('should be case-sensitive and not match "Bezier"', function ()
    {
        expect(GetInterpolationFunction('Bezier')).toBe(Linear);
    });
});
