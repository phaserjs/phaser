var Random = require('../../../src/math/angle/Random');

describe('Phaser.Math.Angle.Random', function ()
{
    it('should return a number', function ()
    {
        expect(typeof Random()).toBe('number');
    });

    it('should return a value greater than or equal to -pi', function ()
    {
        for (var i = 0; i < 1000; i++)
        {
            expect(Random()).toBeGreaterThanOrEqual(-Math.PI);
        }
    });

    it('should return a value less than or equal to pi', function ()
    {
        for (var i = 0; i < 1000; i++)
        {
            expect(Random()).toBeLessThanOrEqual(Math.PI);
        }
    });

    it('should return values within [-pi, pi] range over many iterations', function ()
    {
        for (var i = 0; i < 1000; i++)
        {
            var angle = Random();
            expect(angle).toBeGreaterThanOrEqual(-Math.PI);
            expect(angle).toBeLessThanOrEqual(Math.PI);
        }
    });

    it('should return varying values over multiple calls', function ()
    {
        var results = {};
        for (var i = 0; i < 100; i++)
        {
            results[Random()] = true;
        }
        expect(Object.keys(results).length).toBeGreaterThan(1);
    });
});
