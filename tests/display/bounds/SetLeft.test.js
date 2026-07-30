var SetLeft = require('../../../src/display/bounds/SetLeft');

describe('Phaser.Display.Bounds.SetLeft', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = {
            x: 0,
            y: 0,
            width: 100,
            originX: 0.5
        };
    });

    it('should return the game object', function ()
    {
        var result = SetLeft(gameObject, 0);

        expect(result).toBe(gameObject);
    });

    it('should set x accounting for width and originX', function ()
    {
        SetLeft(gameObject, 50);

        expect(gameObject.x).toBe(100);
    });

    it('should position correctly with zero origin', function ()
    {
        gameObject.originX = 0;

        SetLeft(gameObject, 50);

        expect(gameObject.x).toBe(50);
    });

    it('should position correctly with full origin of 1', function ()
    {
        gameObject.originX = 1;

        SetLeft(gameObject, 50);

        expect(gameObject.x).toBe(150);
    });

    it('should position correctly with default center origin of 0.5', function ()
    {
        gameObject.width = 200;
        gameObject.originX = 0.5;

        SetLeft(gameObject, 100);

        expect(gameObject.x).toBe(200);
    });

    it('should set x to zero when value is zero and originX is zero', function ()
    {
        gameObject.originX = 0;

        SetLeft(gameObject, 0);

        expect(gameObject.x).toBe(0);
    });

    it('should handle negative values', function ()
    {
        gameObject.originX = 0;

        SetLeft(gameObject, -50);

        expect(gameObject.x).toBe(-50);
    });

    it('should handle negative values with non-zero origin', function ()
    {
        gameObject.width = 100;
        gameObject.originX = 0.5;

        SetLeft(gameObject, -100);

        expect(gameObject.x).toBe(-50);
    });

    it('should handle zero width', function ()
    {
        gameObject.width = 0;
        gameObject.originX = 0.5;

        SetLeft(gameObject, 75);

        expect(gameObject.x).toBe(75);
    });

    it('should handle floating point values', function ()
    {
        gameObject.width = 33;
        gameObject.originX = 0.5;

        SetLeft(gameObject, 10);

        expect(gameObject.x).toBeCloseTo(26.5);
    });

    it('should not modify y', function ()
    {
        gameObject.y = 42;

        SetLeft(gameObject, 10);

        expect(gameObject.y).toBe(42);
    });

    it('should overwrite an existing x value', function ()
    {
        gameObject.x = 999;
        gameObject.originX = 0;

        SetLeft(gameObject, 10);

        expect(gameObject.x).toBe(10);
    });
});
