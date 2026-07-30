var In = require('../../../../src/math/easing/quadratic/In');

describe('Phaser.Math.Easing.Quadratic.In', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(In(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(In(1)).toBe(1);
    });

    it('should return v * v for a midpoint value', function ()
    {
        expect(In(0.5)).toBeCloseTo(0.25);
    });

    it('should return correct values across the range 0 to 1', function ()
    {
        expect(In(0.25)).toBeCloseTo(0.0625);
        expect(In(0.75)).toBeCloseTo(0.5625);
    });

    it('should return a positive value for negative input', function ()
    {
        expect(In(-1)).toBe(1);
        expect(In(-0.5)).toBeCloseTo(0.25);
    });

    it('should return values greater than 1 for v greater than 1', function ()
    {
        expect(In(2)).toBe(4);
        expect(In(3)).toBe(9);
    });

    it('should produce values smaller than v for v between 0 and 1', function ()
    {
        expect(In(0.3)).toBeLessThan(0.3);
        expect(In(0.9)).toBeLessThan(0.9);
    });

    it('should return a number type', function ()
    {
        expect(typeof In(0.5)).toBe('number');
    });

    it('should handle floating point input', function ()
    {
        expect(In(0.1)).toBeCloseTo(0.01);
        expect(In(0.9)).toBeCloseTo(0.81);
    });
});
