var FloatBetween = require('../../src/math/FloatBetween');

describe('Phaser.Math.FloatBetween', function ()
{
    it('should return a number within the given range', function ()
    {
        var result = FloatBetween(0, 1);

        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(1);
    });

    it('should return min when min and max are equal', function ()
    {
        expect(FloatBetween(5, 5)).toBe(5);
    });

    it('should stay within range over many iterations', function ()
    {
        var min = 10;
        var max = 20;

        for (var i = 0; i < 1000; i++)
        {
            var result = FloatBetween(min, max);

            expect(result).toBeGreaterThanOrEqual(min);
            expect(result).toBeLessThan(max);
        }
    });

    it('should work with negative bounds', function ()
    {
        for (var i = 0; i < 100; i++)
        {
            var result = FloatBetween(-10, -1);

            expect(result).toBeGreaterThanOrEqual(-10);
            expect(result).toBeLessThan(-1);
        }
    });

    it('should work with a range that spans negative to positive', function ()
    {
        for (var i = 0; i < 100; i++)
        {
            var result = FloatBetween(-5, 5);

            expect(result).toBeGreaterThanOrEqual(-5);
            expect(result).toBeLessThan(5);
        }
    });

    it('should return a floating point number type', function ()
    {
        expect(typeof FloatBetween(0, 100)).toBe('number');
    });

    it('should return min when Math.random returns 0', function ()
    {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        expect(FloatBetween(5, 10)).toBe(5);

        vi.restoreAllMocks();
    });

    it('should return a value close to max when Math.random approaches 1', function ()
    {
        vi.spyOn(Math, 'random').mockReturnValue(0.9999999);

        var result = FloatBetween(0, 10);

        expect(result).toBeCloseTo(10, 5);
        expect(result).toBeLessThan(10);

        vi.restoreAllMocks();
    });

    it('should work with large ranges', function ()
    {
        for (var i = 0; i < 100; i++)
        {
            var result = FloatBetween(-1000000, 1000000);

            expect(result).toBeGreaterThanOrEqual(-1000000);
            expect(result).toBeLessThan(1000000);
        }
    });

    it('should work with fractional bounds', function ()
    {
        for (var i = 0; i < 100; i++)
        {
            var result = FloatBetween(0.5, 1.5);

            expect(result).toBeGreaterThanOrEqual(0.5);
            expect(result).toBeLessThan(1.5);
        }
    });
});
