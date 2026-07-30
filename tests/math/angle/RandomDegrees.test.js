var RandomDegrees = require('../../../src/math/angle/RandomDegrees');

describe('Phaser.Math.Angle.RandomDegrees', function ()
{
    it('should return a number', function ()
    {
        expect(typeof RandomDegrees()).toBe('number');
    });

    it('should return a value within the range [-180, 180]', function ()
    {
        var result = RandomDegrees();

        expect(result).toBeGreaterThanOrEqual(-180);
        expect(result).toBeLessThanOrEqual(180);
    });

    it('should stay within [-180, 180] over many iterations', function ()
    {
        for (var i = 0; i < 1000; i++)
        {
            var result = RandomDegrees();

            expect(result).toBeGreaterThanOrEqual(-180);
            expect(result).toBeLessThanOrEqual(180);
        }
    });

    it('should return different values across multiple calls', function ()
    {
        var results = {};
        var unique = 0;

        for (var i = 0; i < 20; i++)
        {
            var val = RandomDegrees();

            if (!results[val])
            {
                results[val] = true;
                unique++;
            }
        }

        expect(unique).toBeGreaterThan(1);
    });

    it('should return floating point values', function ()
    {
        var hasFloat = false;

        for (var i = 0; i < 100; i++)
        {
            var result = RandomDegrees();

            if (result !== Math.floor(result))
            {
                hasFloat = true;
                break;
            }
        }

        expect(hasFloat).toBe(true);
    });
});
