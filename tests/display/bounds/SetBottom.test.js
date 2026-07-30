var SetBottom = require('../../../src/display/bounds/SetBottom');

describe('Phaser.Display.Bounds.SetBottom', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = { x: 0, y: 0, width: 100, height: 50, originY: 0 };
    });

    it('should return the game object', function ()
    {
        var result = SetBottom(gameObject, 100);

        expect(result).toBe(gameObject);
    });

    it('should set y so the bottom aligns to value when originY is 0', function ()
    {
        SetBottom(gameObject, 200);

        // y = (200 - 50) + (50 * 0) = 150
        expect(gameObject.y).toBe(150);
    });

    it('should set y so the bottom aligns to value when originY is 1', function ()
    {
        gameObject.originY = 1;

        SetBottom(gameObject, 200);

        // y = (200 - 50) + (50 * 1) = 200
        expect(gameObject.y).toBe(200);
    });

    it('should set y so the bottom aligns to value when originY is 0.5', function ()
    {
        gameObject.originY = 0.5;

        SetBottom(gameObject, 200);

        // y = (200 - 50) + (50 * 0.5) = 150 + 25 = 175
        expect(gameObject.y).toBe(175);
    });

    it('should work with a value of zero', function ()
    {
        SetBottom(gameObject, 0);

        // y = (0 - 50) + (50 * 0) = -50
        expect(gameObject.y).toBe(-50);
    });

    it('should work with negative values', function ()
    {
        SetBottom(gameObject, -100);

        // y = (-100 - 50) + (50 * 0) = -150
        expect(gameObject.y).toBe(-150);
    });

    it('should work with negative values and non-zero originY', function ()
    {
        gameObject.originY = 0.5;

        SetBottom(gameObject, -100);

        // y = (-100 - 50) + (50 * 0.5) = -150 + 25 = -125
        expect(gameObject.y).toBe(-125);
    });

    it('should work with floating point values', function ()
    {
        gameObject.height = 33.3;
        gameObject.originY = 0.5;

        SetBottom(gameObject, 100);

        // y = (100 - 33.3) + (33.3 * 0.5) = 66.7 + 16.65 = 83.35
        expect(gameObject.y).toBeCloseTo(83.35);
    });

    it('should work with zero height', function ()
    {
        gameObject.height = 0;

        SetBottom(gameObject, 100);

        // y = (100 - 0) + (0 * 0) = 100
        expect(gameObject.y).toBe(100);
    });

    it('should work with large values', function ()
    {
        gameObject.height = 1000;
        gameObject.originY = 0;

        SetBottom(gameObject, 5000);

        // y = (5000 - 1000) + (1000 * 0) = 4000
        expect(gameObject.y).toBe(4000);
    });

    it('should not modify other properties of the game object', function ()
    {
        SetBottom(gameObject, 100);

        expect(gameObject.x).toBe(0);
        expect(gameObject.width).toBe(100);
        expect(gameObject.height).toBe(50);
        expect(gameObject.originY).toBe(0);
    });

    it('should overwrite a previously set y value', function ()
    {
        gameObject.y = 999;

        SetBottom(gameObject, 100);

        expect(gameObject.y).toBe(50);
    });
});
