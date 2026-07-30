var Between = require('../../src/math/Between');

describe('Phaser.Math.Between', function ()
{
    it('should always return an integer', function ()
    {
        for (var i = 0; i < 100; i++)
        {
            var result = Between(0, 10);
            expect(Number.isInteger(result)).toBe(true);
        }
    });

    it('should return values within the given range (inclusive)', function ()
    {
        for (var i = 0; i < 1000; i++)
        {
            var result = Between(5, 15);
            expect(result).toBeGreaterThanOrEqual(5);
            expect(result).toBeLessThanOrEqual(15);
        }
    });

    it('should return the only possible value when min equals max', function ()
    {
        for (var i = 0; i < 50; i++)
        {
            expect(Between(7, 7)).toBe(7);
        }
    });

    it('should work with negative ranges', function ()
    {
        for (var i = 0; i < 100; i++)
        {
            var result = Between(-10, -5);
            expect(result).toBeGreaterThanOrEqual(-10);
            expect(result).toBeLessThanOrEqual(-5);
        }
    });

    it('should work with a range spanning zero', function ()
    {
        for (var i = 0; i < 100; i++)
        {
            var result = Between(-5, 5);
            expect(result).toBeGreaterThanOrEqual(-5);
            expect(result).toBeLessThanOrEqual(5);
        }
    });

    it('should produce a distribution across the range (not always the same value)', function ()
    {
        var results = new Set();

        for (var i = 0; i < 200; i++)
        {
            results.add(Between(0, 10));
        }

        // With 200 samples over 11 possible values, we should hit at least 5 distinct values
        expect(results.size).toBeGreaterThan(5);
    });
});
