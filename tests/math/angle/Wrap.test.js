var Wrap = require('../../../src/math/angle/Wrap');

describe('Phaser.Math.Angle.Wrap', function ()
{
    it('should return zero for an angle of zero', function ()
    {
        expect(Wrap(0)).toBe(0);
    });

    it('should return the angle unchanged when within range', function ()
    {
        expect(Wrap(1)).toBeCloseTo(1);
        expect(Wrap(-1)).toBeCloseTo(-1);
        expect(Wrap(2)).toBeCloseTo(2);
        expect(Wrap(-2)).toBeCloseTo(-2);
    });

    it('should wrap PI to -PI', function ()
    {
        expect(Wrap(Math.PI)).toBeCloseTo(-Math.PI);
    });

    it('should return just below PI for an angle just below PI', function ()
    {
        expect(Wrap(Math.PI - 0.001)).toBeCloseTo(Math.PI - 0.001);
    });

    it('should return -PI for an angle of -PI', function ()
    {
        expect(Wrap(-Math.PI)).toBeCloseTo(-Math.PI);
    });

    it('should wrap an angle greater than PI', function ()
    {
        expect(Wrap(Math.PI + 0.1)).toBeCloseTo(-Math.PI + 0.1);
    });

    it('should wrap an angle less than -PI', function ()
    {
        expect(Wrap(-Math.PI - 0.1)).toBeCloseTo(Math.PI - 0.1);
    });

    it('should wrap 2*PI to zero', function ()
    {
        expect(Wrap(2 * Math.PI)).toBeCloseTo(0);
    });

    it('should wrap -2*PI to zero', function ()
    {
        expect(Wrap(-2 * Math.PI)).toBeCloseTo(0);
    });

    it('should wrap 3*PI correctly', function ()
    {
        expect(Wrap(3 * Math.PI)).toBeCloseTo(-Math.PI);
    });

    it('should wrap -3*PI correctly', function ()
    {
        expect(Wrap(-3 * Math.PI)).toBeCloseTo(-Math.PI);
    });

    it('should handle large positive angles', function ()
    {
        var result = Wrap(100);
        expect(result).toBeGreaterThanOrEqual(-Math.PI);
        expect(result).toBeLessThan(Math.PI);
    });

    it('should handle large negative angles', function ()
    {
        var result = Wrap(-100);
        expect(result).toBeGreaterThanOrEqual(-Math.PI);
        expect(result).toBeLessThan(Math.PI);
    });

    it('should return a value in the range [-PI, PI) for any input', function ()
    {
        var angles = [ -10, -6, -4, -Math.PI, -1, 0, 1, Math.PI, 4, 6, 10 ];

        for (var i = 0; i < angles.length; i++)
        {
            var result = Wrap(angles[i]);
            expect(result).toBeGreaterThanOrEqual(-Math.PI);
            expect(result).toBeLessThan(Math.PI);
        }
    });

    it('should handle floating point angles', function ()
    {
        var result = Wrap(1.5707963267948966); // PI/2
        expect(result).toBeCloseTo(Math.PI / 2);
    });
});
