var Linear = require('../../src/math/Linear');

describe('Phaser.Math.Linear', function ()
{
    it('should return p0 when t is 0', function ()
    {
        expect(Linear(10, 20, 0)).toBe(10);
    });

    it('should return p1 when t is 1', function ()
    {
        expect(Linear(10, 20, 1)).toBe(20);
    });

    it('should return the midpoint when t is 0.5', function ()
    {
        expect(Linear(0, 100, 0.5)).toBe(50);
    });

    it('should interpolate at 25%', function ()
    {
        expect(Linear(0, 100, 0.25)).toBe(25);
    });

    it('should interpolate at 75%', function ()
    {
        expect(Linear(0, 100, 0.75)).toBe(75);
    });

    it('should extrapolate beyond t=1', function ()
    {
        expect(Linear(0, 100, 2)).toBe(200);
    });

    it('should extrapolate below t=0', function ()
    {
        expect(Linear(0, 100, -1)).toBe(-100);
    });

    it('should work with negative value ranges', function ()
    {
        expect(Linear(-50, 50, 0.5)).toBe(0);
        expect(Linear(-100, -50, 0.5)).toBe(-75);
    });

    it('should return p0 when p0 equals p1', function ()
    {
        expect(Linear(5, 5, 0.5)).toBe(5);
    });

    it('should work with floating point values', function ()
    {
        expect(Linear(0.1, 0.9, 0.5)).toBeCloseTo(0.5);
    });
});
