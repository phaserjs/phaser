var Normalize = require('../../../src/math/angle/Normalize');

describe('Phaser.Math.Angle.Normalize', function ()
{
    it('should return zero for an angle of zero', function ()
    {
        expect(Normalize(0)).toBe(0);
    });

    it('should return a positive angle unchanged when already in [0, 2pi]', function ()
    {
        expect(Normalize(1)).toBeCloseTo(1);
        expect(Normalize(Math.PI)).toBeCloseTo(Math.PI);
        expect(Normalize(Math.PI / 2)).toBeCloseTo(Math.PI / 2);
    });

    it('should return 2pi for an input of exactly 2pi (wraps to 0)', function ()
    {
        expect(Normalize(2 * Math.PI)).toBeCloseTo(0);
    });

    it('should normalize a negative angle to the [0, 2pi] range', function ()
    {
        expect(Normalize(-Math.PI)).toBeCloseTo(Math.PI);
    });

    it('should normalize -Math.PI/2 to 3*Math.PI/2', function ()
    {
        expect(Normalize(-Math.PI / 2)).toBeCloseTo(3 * Math.PI / 2);
    });

    it('should normalize a negative angle greater than -2pi', function ()
    {
        expect(Normalize(-0.5)).toBeCloseTo(2 * Math.PI - 0.5);
    });

    it('should normalize an angle greater than 2pi by wrapping it', function ()
    {
        expect(Normalize(3 * Math.PI)).toBeCloseTo(Math.PI);
    });

    it('should normalize an angle of 4pi to 0', function ()
    {
        expect(Normalize(4 * Math.PI)).toBeCloseTo(0);
    });

    it('should normalize a large negative angle', function ()
    {
        expect(Normalize(-4 * Math.PI)).toBeCloseTo(0);
    });

    it('should normalize -3*Math.PI to Math.PI', function ()
    {
        expect(Normalize(-3 * Math.PI)).toBeCloseTo(Math.PI);
    });

    it('should return a result within [0, 2pi] for arbitrary positive values', function ()
    {
        var result = Normalize(7.5);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(2 * Math.PI);
    });

    it('should return a result within [0, 2pi] for arbitrary negative values', function ()
    {
        var result = Normalize(-7.5);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(2 * Math.PI);
    });

    it('should handle very small positive angles', function ()
    {
        expect(Normalize(0.0001)).toBeCloseTo(0.0001);
    });

    it('should handle very small negative angles', function ()
    {
        var result = Normalize(-0.0001);
        expect(result).toBeCloseTo(2 * Math.PI - 0.0001);
    });
});
