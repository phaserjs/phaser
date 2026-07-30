var GetBottom = require('../../../src/display/bounds/GetBottom');

describe('Phaser.Display.Bounds.GetBottom', function ()
{
    it('should return y + height when originY is zero', function ()
    {
        var gameObject = { x: 0, y: 10, width: 100, height: 50, originX: 0, originY: 0 };

        expect(GetBottom(gameObject)).toBe(60);
    });

    it('should return y when originY is one', function ()
    {
        var gameObject = { x: 0, y: 100, width: 100, height: 50, originX: 0, originY: 1 };

        expect(GetBottom(gameObject)).toBe(100);
    });

    it('should return y + half height when originY is 0.5', function ()
    {
        var gameObject = { x: 0, y: 100, width: 100, height: 50, originX: 0, originY: 0.5 };

        expect(GetBottom(gameObject)).toBe(125);
    });

    it('should work when y is zero', function ()
    {
        var gameObject = { x: 0, y: 0, width: 100, height: 80, originX: 0, originY: 0 };

        expect(GetBottom(gameObject)).toBe(80);
    });

    it('should work with negative y values', function ()
    {
        var gameObject = { x: 0, y: -50, width: 100, height: 100, originX: 0, originY: 0 };

        expect(GetBottom(gameObject)).toBe(50);
    });

    it('should work with negative y and originY of 0.5', function ()
    {
        var gameObject = { x: 0, y: -50, width: 100, height: 100, originX: 0, originY: 0.5 };

        expect(GetBottom(gameObject)).toBe(0);
    });

    it('should work with height of zero', function ()
    {
        var gameObject = { x: 0, y: 200, width: 100, height: 0, originX: 0, originY: 0.5 };

        expect(GetBottom(gameObject)).toBe(200);
    });

    it('should work with large values', function ()
    {
        var gameObject = { x: 0, y: 1000, width: 500, height: 400, originX: 0, originY: 0 };

        expect(GetBottom(gameObject)).toBe(1400);
    });

    it('should work with floating point y and height', function ()
    {
        var gameObject = { x: 0, y: 10.5, width: 100, height: 20.4, originX: 0, originY: 0 };

        expect(GetBottom(gameObject)).toBeCloseTo(30.9);
    });

    it('should work with floating point originY', function ()
    {
        var gameObject = { x: 0, y: 100, width: 100, height: 200, originX: 0, originY: 0.25 };

        expect(GetBottom(gameObject)).toBe(250);
    });

    it('should ignore x and width values', function ()
    {
        var gameObjectA = { x: 0, y: 50, width: 100, height: 60, originX: 0, originY: 0 };
        var gameObjectB = { x: 999, y: 50, width: 9999, height: 60, originX: 0, originY: 0 };

        expect(GetBottom(gameObjectA)).toBe(GetBottom(gameObjectB));
    });

    it('should return correct value when y is negative and originY is one', function ()
    {
        var gameObject = { x: 0, y: -100, width: 50, height: 200, originX: 0, originY: 1 };

        expect(GetBottom(gameObject)).toBe(-100);
    });
});
