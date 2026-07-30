var RandomRGB = require('../../../src/display/color/RandomRGB');
var Color = require('../../../src/display/color/Color');

describe('Phaser.Display.Color.RandomRGB', function ()
{
    it('should return a Color object', function ()
    {
        var result = RandomRGB();
        expect(result).toBeInstanceOf(Color);
    });

    it('should use defaults of 0 and 255 when called with no arguments', function ()
    {
        var iterations = 100;
        for (var i = 0; i < iterations; i++)
        {
            var result = RandomRGB();
            expect(result.red).toBeGreaterThanOrEqual(0);
            expect(result.red).toBeLessThanOrEqual(255);
            expect(result.green).toBeGreaterThanOrEqual(0);
            expect(result.green).toBeLessThanOrEqual(255);
            expect(result.blue).toBeGreaterThanOrEqual(0);
            expect(result.blue).toBeLessThanOrEqual(255);
        }
    });

    it('should return r, g, b values within the given min/max range', function ()
    {
        var min = 100;
        var max = 200;
        var iterations = 100;
        for (var i = 0; i < iterations; i++)
        {
            var result = RandomRGB(min, max);
            expect(result.red).toBeGreaterThanOrEqual(min);
            expect(result.red).toBeLessThanOrEqual(max);
            expect(result.green).toBeGreaterThanOrEqual(min);
            expect(result.green).toBeLessThanOrEqual(max);
            expect(result.blue).toBeGreaterThanOrEqual(min);
            expect(result.blue).toBeLessThanOrEqual(max);
        }
    });

    it('should return exact value when min equals max', function ()
    {
        var result = RandomRGB(128, 128);
        expect(result.red).toBe(128);
        expect(result.green).toBe(128);
        expect(result.blue).toBe(128);
    });

    it('should return 0 for all channels when min and max are both 0', function ()
    {
        var result = RandomRGB(0, 0);
        expect(result.red).toBe(0);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(0);
    });

    it('should return 255 for all channels when min and max are both 255', function ()
    {
        var result = RandomRGB(255, 255);
        expect(result.red).toBe(255);
        expect(result.green).toBe(255);
        expect(result.blue).toBe(255);
    });

    it('should respect a narrow range', function ()
    {
        var min = 50;
        var max = 55;
        var iterations = 50;
        for (var i = 0; i < iterations; i++)
        {
            var result = RandomRGB(min, max);
            expect(result.red).toBeGreaterThanOrEqual(min);
            expect(result.red).toBeLessThanOrEqual(max);
            expect(result.green).toBeGreaterThanOrEqual(min);
            expect(result.green).toBeLessThanOrEqual(max);
            expect(result.blue).toBeGreaterThanOrEqual(min);
            expect(result.blue).toBeLessThanOrEqual(max);
        }
    });

    it('should produce integer channel values', function ()
    {
        var result = RandomRGB(0, 255);
        expect(Number.isInteger(result.red)).toBe(true);
        expect(Number.isInteger(result.green)).toBe(true);
        expect(Number.isInteger(result.blue)).toBe(true);
    });

    it('should produce different values across multiple calls given a wide range', function ()
    {
        var results = [];
        for (var i = 0; i < 20; i++)
        {
            results.push(RandomRGB(0, 255).red);
        }
        var allSame = results.every(function (v) { return v === results[0]; });
        expect(allSame).toBe(false);
    });
});
