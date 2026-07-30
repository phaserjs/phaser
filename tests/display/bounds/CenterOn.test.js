var CenterOn = require('../../../src/display/bounds/CenterOn');

describe('Phaser.Display.Bounds.CenterOn', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            originX: 0.5,
            originY: 0.5
        };
    });

    it('should return the game object', function ()
    {
        var result = CenterOn(gameObject, 0, 0);

        expect(result).toBe(gameObject);
    });

    it('should center the game object on the given coordinates with default origin', function ()
    {
        CenterOn(gameObject, 200, 300);

        // offsetX = 100 * 0.5 = 50, x = (200 + 50) - 50 = 200
        expect(gameObject.x).toBe(200);
        // offsetY = 100 * 0.5 = 50, y = (300 + 50) - 50 = 300
        expect(gameObject.y).toBe(300);
    });

    it('should center on zero coordinates', function ()
    {
        CenterOn(gameObject, 0, 0);

        expect(gameObject.x).toBe(0);
        expect(gameObject.y).toBe(0);
    });

    it('should center on negative coordinates', function ()
    {
        CenterOn(gameObject, -100, -200);

        expect(gameObject.x).toBe(-100);
        expect(gameObject.y).toBe(-200);
    });

    it('should account for non-default origin when centering x', function ()
    {
        gameObject.originX = 0;
        gameObject.originY = 0.5;

        CenterOn(gameObject, 200, 200);

        // offsetX = 100 * 0 = 0, x = (200 + 0) - 50 = 150
        expect(gameObject.x).toBe(150);
        // offsetY = 100 * 0.5 = 50, y = (200 + 50) - 50 = 200
        expect(gameObject.y).toBe(200);
    });

    it('should account for non-default origin when centering y', function ()
    {
        gameObject.originX = 0.5;
        gameObject.originY = 1;

        CenterOn(gameObject, 200, 200);

        // offsetX = 100 * 0.5 = 50, x = (200 + 50) - 50 = 200
        expect(gameObject.x).toBe(200);
        // offsetY = 100 * 1 = 100, y = (200 + 100) - 50 = 250
        expect(gameObject.y).toBe(250);
    });

    it('should account for origin of zero on both axes', function ()
    {
        gameObject.originX = 0;
        gameObject.originY = 0;

        CenterOn(gameObject, 200, 300);

        // offsetX = 100 * 0 = 0, x = (200 + 0) - 50 = 150
        expect(gameObject.x).toBe(150);
        // offsetY = 100 * 0 = 0, y = (300 + 0) - 50 = 250
        expect(gameObject.y).toBe(250);
    });

    it('should account for origin of one on both axes', function ()
    {
        gameObject.originX = 1;
        gameObject.originY = 1;

        CenterOn(gameObject, 200, 300);

        // offsetX = 100 * 1 = 100, x = (200 + 100) - 50 = 250
        expect(gameObject.x).toBe(250);
        // offsetY = 100 * 1 = 100, y = (300 + 100) - 50 = 350
        expect(gameObject.y).toBe(350);
    });

    it('should handle non-square game objects', function ()
    {
        gameObject.width = 200;
        gameObject.height = 50;
        gameObject.originX = 0.5;
        gameObject.originY = 0.5;

        CenterOn(gameObject, 100, 100);

        // offsetX = 200 * 0.5 = 100, x = (100 + 100) - 100 = 100
        expect(gameObject.x).toBe(100);
        // offsetY = 50 * 0.5 = 25, y = (100 + 25) - 25 = 100
        expect(gameObject.y).toBe(100);
    });

    it('should handle floating point coordinates', function ()
    {
        CenterOn(gameObject, 100.5, 200.75);

        expect(gameObject.x).toBeCloseTo(100.5);
        expect(gameObject.y).toBeCloseTo(200.75);
    });

    it('should handle a game object with zero dimensions', function ()
    {
        gameObject.width = 0;
        gameObject.height = 0;
        gameObject.originX = 0.5;
        gameObject.originY = 0.5;

        CenterOn(gameObject, 50, 75);

        // offsetX = 0 * 0.5 = 0, x = (50 + 0) - 0 = 50
        expect(gameObject.x).toBe(50);
        // offsetY = 0 * 0.5 = 0, y = (75 + 0) - 0 = 75
        expect(gameObject.y).toBe(75);
    });

    it('should set both x and y independently', function ()
    {
        CenterOn(gameObject, 300, 400);

        expect(gameObject.x).toBe(300);
        expect(gameObject.y).toBe(400);
    });
});
