var SetTop = require('../../../src/display/bounds/SetTop');

describe('Phaser.Display.Bounds.SetTop', function ()
{
    it('should set y based on value, height, and originY', function ()
    {
        var gameObject = { x: 0, y: 0, height: 100, originY: 0.5 };

        SetTop(gameObject, 200);

        expect(gameObject.y).toBe(250);
    });

    it('should return the game object', function ()
    {
        var gameObject = { x: 0, y: 0, height: 100, originY: 0.5 };

        var result = SetTop(gameObject, 0);

        expect(result).toBe(gameObject);
    });

    it('should position correctly with originY of 0', function ()
    {
        var gameObject = { x: 0, y: 0, height: 100, originY: 0 };

        SetTop(gameObject, 50);

        expect(gameObject.y).toBe(50);
    });

    it('should position correctly with originY of 1', function ()
    {
        var gameObject = { x: 0, y: 0, height: 100, originY: 1 };

        SetTop(gameObject, 50);

        expect(gameObject.y).toBe(150);
    });

    it('should position correctly with originY of 0.5', function ()
    {
        var gameObject = { x: 0, y: 0, height: 80, originY: 0.5 };

        SetTop(gameObject, 100);

        expect(gameObject.y).toBe(140);
    });

    it('should work with a value of zero', function ()
    {
        var gameObject = { x: 0, y: 100, height: 60, originY: 0.5 };

        SetTop(gameObject, 0);

        expect(gameObject.y).toBe(30);
    });

    it('should work with negative values', function ()
    {
        var gameObject = { x: 0, y: 0, height: 100, originY: 0.5 };

        SetTop(gameObject, -100);

        expect(gameObject.y).toBe(-50);
    });

    it('should work with a zero height', function ()
    {
        var gameObject = { x: 0, y: 0, height: 0, originY: 0.5 };

        SetTop(gameObject, 200);

        expect(gameObject.y).toBe(200);
    });

    it('should work with floating point values', function ()
    {
        var gameObject = { x: 0, y: 0, height: 100, originY: 0.5 };

        SetTop(gameObject, 10.5);

        expect(gameObject.y).toBeCloseTo(60.5);
    });

    it('should not modify x', function ()
    {
        var gameObject = { x: 42, y: 0, height: 100, originY: 0.5 };

        SetTop(gameObject, 200);

        expect(gameObject.x).toBe(42);
    });

    it('should work with large values', function ()
    {
        var gameObject = { x: 0, y: 0, height: 1000, originY: 0.5 };

        SetTop(gameObject, 5000);

        expect(gameObject.y).toBe(5500);
    });

    it('should work with a non-standard originY', function ()
    {
        var gameObject = { x: 0, y: 0, height: 200, originY: 0.25 };

        SetTop(gameObject, 100);

        expect(gameObject.y).toBe(150);
    });
});
