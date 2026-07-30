var GetTop = require('../../../src/display/bounds/GetTop');

describe('Phaser.Display.Bounds.GetTop', function ()
{
    it('should return y when originY is zero', function ()
    {
        var gameObject = { y: 100, height: 50, originY: 0 };

        expect(GetTop(gameObject)).toBe(100);
    });

    it('should return y minus height when originY is one', function ()
    {
        var gameObject = { y: 100, height: 50, originY: 1 };

        expect(GetTop(gameObject)).toBe(50);
    });

    it('should return y minus half height when originY is 0.5', function ()
    {
        var gameObject = { y: 100, height: 50, originY: 0.5 };

        expect(GetTop(gameObject)).toBe(75);
    });

    it('should return zero when y equals height times originY', function ()
    {
        var gameObject = { y: 50, height: 100, originY: 0.5 };

        expect(GetTop(gameObject)).toBe(0);
    });

    it('should return negative value when result is negative', function ()
    {
        var gameObject = { y: 0, height: 100, originY: 0.5 };

        expect(GetTop(gameObject)).toBe(-50);
    });

    it('should work with zero y', function ()
    {
        var gameObject = { y: 0, height: 80, originY: 0 };

        expect(GetTop(gameObject)).toBe(0);
    });

    it('should work with zero height', function ()
    {
        var gameObject = { y: 200, height: 0, originY: 0.5 };

        expect(GetTop(gameObject)).toBe(200);
    });

    it('should work with negative y', function ()
    {
        var gameObject = { y: -50, height: 100, originY: 0 };

        expect(GetTop(gameObject)).toBe(-50);
    });

    it('should work with negative y and non-zero originY', function ()
    {
        var gameObject = { y: -50, height: 100, originY: 0.5 };

        expect(GetTop(gameObject)).toBe(-100);
    });

    it('should work with floating point values', function ()
    {
        var gameObject = { y: 10.5, height: 3.0, originY: 0.5 };

        expect(GetTop(gameObject)).toBeCloseTo(9);
    });

    it('should work with large values', function ()
    {
        var gameObject = { y: 10000, height: 2000, originY: 0.5 };

        expect(GetTop(gameObject)).toBe(9000);
    });

    it('should return the correct value for default Phaser origin of 0.5', function ()
    {
        var gameObject = { y: 300, height: 200, originY: 0.5 };

        expect(GetTop(gameObject)).toBe(200);
    });
});
