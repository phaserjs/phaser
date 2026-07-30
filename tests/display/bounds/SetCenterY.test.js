var SetCenterY = require('../../../src/display/bounds/SetCenterY');

describe('Phaser.Display.Bounds.SetCenterY', function ()
{
    it('should return the game object', function ()
    {
        var gameObject = { x: 0, y: 0, width: 100, height: 100, originX: 0.5, originY: 0.5 };

        var result = SetCenterY(gameObject, 0);

        expect(result).toBe(gameObject);
    });

    it('should center the game object vertically at the given coordinate with default origin', function ()
    {
        var gameObject = { x: 0, y: 0, width: 100, height: 100, originX: 0.5, originY: 0.5 };

        SetCenterY(gameObject, 100);

        expect(gameObject.y).toBe(100);
    });

    it('should position correctly with origin at zero', function ()
    {
        var gameObject = { x: 0, y: 0, width: 100, height: 100, originX: 0, originY: 0 };

        SetCenterY(gameObject, 100);

        // offsetY = 100 * 0 = 0; y = (100 + 0) - (100 * 0.5) = 50
        expect(gameObject.y).toBe(50);
    });

    it('should position correctly with origin at one', function ()
    {
        var gameObject = { x: 0, y: 0, width: 100, height: 100, originX: 1, originY: 1 };

        SetCenterY(gameObject, 100);

        // offsetY = 100 * 1 = 100; y = (100 + 100) - (100 * 0.5) = 150
        expect(gameObject.y).toBe(150);
    });

    it('should center at y = 0', function ()
    {
        var gameObject = { x: 0, y: 0, width: 100, height: 100, originX: 0.5, originY: 0.5 };

        SetCenterY(gameObject, 0);

        // offsetY = 100 * 0.5 = 50; y = (0 + 50) - (100 * 0.5) = 0
        expect(gameObject.y).toBe(0);
    });

    it('should center at a negative y coordinate', function ()
    {
        var gameObject = { x: 0, y: 0, width: 100, height: 100, originX: 0.5, originY: 0.5 };

        SetCenterY(gameObject, -100);

        // offsetY = 100 * 0.5 = 50; y = (-100 + 50) - (100 * 0.5) = -100
        expect(gameObject.y).toBe(-100);
    });

    it('should work with non-square dimensions', function ()
    {
        var gameObject = { x: 0, y: 0, width: 200, height: 50, originX: 0.5, originY: 0.5 };

        SetCenterY(gameObject, 200);

        // offsetY = 50 * 0.5 = 25; y = (200 + 25) - (50 * 0.5) = 200
        expect(gameObject.y).toBe(200);
    });

    it('should work with floating point y value', function ()
    {
        var gameObject = { x: 0, y: 0, width: 100, height: 100, originX: 0.5, originY: 0.5 };

        SetCenterY(gameObject, 50.5);

        // offsetY = 100 * 0.5 = 50; y = (50.5 + 50) - (100 * 0.5) = 50.5
        expect(gameObject.y).toBeCloseTo(50.5);
    });

    it('should work with floating point origin', function ()
    {
        var gameObject = { x: 0, y: 0, width: 100, height: 100, originX: 0.5, originY: 0.25 };

        SetCenterY(gameObject, 100);

        // offsetY = 100 * 0.25 = 25; y = (100 + 25) - (100 * 0.5) = 75
        expect(gameObject.y).toBeCloseTo(75);
    });

    it('should work with a zero height game object', function ()
    {
        var gameObject = { x: 0, y: 0, width: 100, height: 0, originX: 0.5, originY: 0.5 };

        SetCenterY(gameObject, 100);

        // offsetY = 0 * 0.5 = 0; y = (100 + 0) - (0 * 0.5) = 100
        expect(gameObject.y).toBe(100);
    });

    it('should not modify the x property', function ()
    {
        var gameObject = { x: 42, y: 0, width: 100, height: 100, originX: 0.5, originY: 0.5 };

        SetCenterY(gameObject, 100);

        expect(gameObject.x).toBe(42);
    });

    it('should update y correctly for large coordinates', function ()
    {
        var gameObject = { x: 0, y: 0, width: 100, height: 100, originX: 0.5, originY: 0.5 };

        SetCenterY(gameObject, 10000);

        // offsetY = 100 * 0.5 = 50; y = (10000 + 50) - 50 = 10000
        expect(gameObject.y).toBe(10000);
    });
});
