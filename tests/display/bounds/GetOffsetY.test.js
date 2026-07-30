var GetOffsetY = require('../../../src/display/bounds/GetOffsetY');

describe('Phaser.Display.Bounds.GetOffsetY', function ()
{
    it('should return zero when originY is zero', function ()
    {
        var gameObject = { height: 100, originY: 0 };
        expect(GetOffsetY(gameObject)).toBe(0);
    });

    it('should return height when originY is one', function ()
    {
        var gameObject = { height: 100, originY: 1 };
        expect(GetOffsetY(gameObject)).toBe(100);
    });

    it('should return half height when originY is 0.5', function ()
    {
        var gameObject = { height: 200, originY: 0.5 };
        expect(GetOffsetY(gameObject)).toBe(100);
    });

    it('should return height multiplied by originY', function ()
    {
        var gameObject = { height: 80, originY: 0.25 };
        expect(GetOffsetY(gameObject)).toBe(20);
    });

    it('should return zero when height is zero', function ()
    {
        var gameObject = { height: 0, originY: 0.5 };
        expect(GetOffsetY(gameObject)).toBe(0);
    });

    it('should work with negative height', function ()
    {
        var gameObject = { height: -100, originY: 0.5 };
        expect(GetOffsetY(gameObject)).toBe(-50);
    });

    it('should work with negative originY', function ()
    {
        var gameObject = { height: 100, originY: -0.5 };
        expect(GetOffsetY(gameObject)).toBe(-50);
    });

    it('should work with floating point height', function ()
    {
        var gameObject = { height: 33.3, originY: 0.5 };
        expect(GetOffsetY(gameObject)).toBeCloseTo(16.65);
    });

    it('should work with floating point originY', function ()
    {
        var gameObject = { height: 100, originY: 0.333 };
        expect(GetOffsetY(gameObject)).toBeCloseTo(33.3);
    });

    it('should return correct value when both values are negative', function ()
    {
        var gameObject = { height: -100, originY: -0.5 };
        expect(GetOffsetY(gameObject)).toBe(50);
    });

    it('should return a number type', function ()
    {
        var gameObject = { height: 64, originY: 0.5 };
        expect(typeof GetOffsetY(gameObject)).toBe('number');
    });
});
