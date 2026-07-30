var SetCenterX = require('../../../src/display/bounds/SetCenterX');

describe('Phaser.Display.Bounds.SetCenterX', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = {
            x: 0,
            width: 100,
            originX: 0.5
        };
    });

    it('should return the game object', function ()
    {
        var result = SetCenterX(gameObject, 0);

        expect(result).toBe(gameObject);
    });

    it('should position x correctly when originX is 0.5 (center origin)', function ()
    {
        // offsetX = 100 * 0.5 = 50, x = (200 + 50) - 50 = 200
        SetCenterX(gameObject, 200);

        expect(gameObject.x).toBe(200);
    });

    it('should position x correctly when originX is 0 (top-left origin)', function ()
    {
        gameObject.originX = 0;

        // offsetX = 100 * 0 = 0, x = (200 + 0) - 50 = 150
        SetCenterX(gameObject, 200);

        expect(gameObject.x).toBe(150);
    });

    it('should position x correctly when originX is 1 (top-right origin)', function ()
    {
        gameObject.originX = 1;

        // offsetX = 100 * 1 = 100, x = (200 + 100) - 50 = 250
        SetCenterX(gameObject, 200);

        expect(gameObject.x).toBe(250);
    });

    it('should work with zero as the target x', function ()
    {
        // offsetX = 100 * 0.5 = 50, x = (0 + 50) - 50 = 0
        SetCenterX(gameObject, 0);

        expect(gameObject.x).toBe(0);
    });

    it('should work with negative x values', function ()
    {
        // offsetX = 100 * 0.5 = 50, x = (-100 + 50) - 50 = -100
        SetCenterX(gameObject, -100);

        expect(gameObject.x).toBe(-100);
    });

    it('should work with zero width', function ()
    {
        gameObject.width = 0;

        // offsetX = 0 * 0.5 = 0, x = (150 + 0) - 0 = 150
        SetCenterX(gameObject, 150);

        expect(gameObject.x).toBe(150);
    });

    it('should work with floating point x values', function ()
    {
        // offsetX = 100 * 0.5 = 50, x = (10.5 + 50) - 50 = 10.5
        SetCenterX(gameObject, 10.5);

        expect(gameObject.x).toBeCloseTo(10.5);
    });

    it('should work with floating point width', function ()
    {
        gameObject.width = 33.3;
        gameObject.originX = 0.5;

        // offsetX = 33.3 * 0.5 = 16.65, x = (100 + 16.65) - 16.65 = 100
        SetCenterX(gameObject, 100);

        expect(gameObject.x).toBeCloseTo(100);
    });

    it('should work with floating point originX', function ()
    {
        gameObject.originX = 0.25;

        // offsetX = 100 * 0.25 = 25, x = (200 + 25) - 50 = 175
        SetCenterX(gameObject, 200);

        expect(gameObject.x).toBe(175);
    });

    it('should mutate the game object x property', function ()
    {
        gameObject.x = 999;

        SetCenterX(gameObject, 50);

        expect(gameObject.x).not.toBe(999);
    });

    it('should correctly center with large width', function ()
    {
        gameObject.width = 800;
        gameObject.originX = 0.5;

        // offsetX = 800 * 0.5 = 400, x = (400 + 400) - 400 = 400
        SetCenterX(gameObject, 400);

        expect(gameObject.x).toBe(400);
    });

    it('should not modify other game object properties', function ()
    {
        gameObject.y = 42;

        SetCenterX(gameObject, 100);

        expect(gameObject.y).toBe(42);
        expect(gameObject.width).toBe(100);
        expect(gameObject.originX).toBe(0.5);
    });
});
