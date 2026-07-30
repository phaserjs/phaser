var SetRight = require('../../../src/display/bounds/SetRight');

describe('Phaser.Display.Bounds.SetRight', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = { x: 0, y: 0, width: 100, originX: 0 };
    });

    it('should return the game object', function ()
    {
        var result = SetRight(gameObject, 200);

        expect(result).toBe(gameObject);
    });

    it('should set x so the right edge aligns with value when originX is 0', function ()
    {
        gameObject.width = 100;
        gameObject.originX = 0;

        SetRight(gameObject, 300);

        expect(gameObject.x).toBe(200);
    });

    it('should set x so the right edge aligns with value when originX is 1', function ()
    {
        gameObject.width = 100;
        gameObject.originX = 1;

        SetRight(gameObject, 300);

        expect(gameObject.x).toBe(300);
    });

    it('should set x so the right edge aligns with value when originX is 0.5', function ()
    {
        gameObject.width = 100;
        gameObject.originX = 0.5;

        SetRight(gameObject, 300);

        expect(gameObject.x).toBe(250);
    });

    it('should work with a value of zero', function ()
    {
        gameObject.width = 100;
        gameObject.originX = 0;

        SetRight(gameObject, 0);

        expect(gameObject.x).toBe(-100);
    });

    it('should work with a negative value', function ()
    {
        gameObject.width = 100;
        gameObject.originX = 0;

        SetRight(gameObject, -50);

        expect(gameObject.x).toBe(-150);
    });

    it('should work with a zero-width game object', function ()
    {
        gameObject.width = 0;
        gameObject.originX = 0;

        SetRight(gameObject, 200);

        expect(gameObject.x).toBe(200);
    });

    it('should work with floating point width and origin', function ()
    {
        gameObject.width = 50.5;
        gameObject.originX = 0.5;

        SetRight(gameObject, 100);

        expect(gameObject.x).toBeCloseTo(74.75);
    });

    it('should work with a large value', function ()
    {
        gameObject.width = 200;
        gameObject.originX = 0;

        SetRight(gameObject, 10000);

        expect(gameObject.x).toBe(9800);
    });

    it('should not modify y', function ()
    {
        gameObject.y = 42;

        SetRight(gameObject, 200);

        expect(gameObject.y).toBe(42);
    });

    it('should use the correct formula: x = (value - width) + (width * originX)', function ()
    {
        gameObject.width = 80;
        gameObject.originX = 0.25;

        SetRight(gameObject, 500);

        var expected = (500 - 80) + (80 * 0.25);
        expect(gameObject.x).toBeCloseTo(expected);
    });
});
