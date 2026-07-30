var GetBounds = require('../../../src/display/bounds/GetBounds');

describe('Phaser.Display.Bounds.GetBounds', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = {
            x: 0,
            y: 0,
            width: 100,
            height: 50,
            originX: 0.5,
            originY: 0.5
        };
    });

    it('should return a Rectangle when no output is provided', function ()
    {
        var result = GetBounds(gameObject);

        expect(result).toBeDefined();
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
        expect(typeof result.width).toBe('number');
        expect(typeof result.height).toBe('number');
    });

    it('should return the provided output object', function ()
    {
        var output = { x: 0, y: 0, width: 0, height: 0 };
        var result = GetBounds(gameObject, output);

        expect(result).toBe(output);
    });

    it('should calculate correct x from left edge with center origin', function ()
    {
        // x=0, width=100, originX=0.5 => left = 0 - (100 * 0.5) = -50
        var result = GetBounds(gameObject);

        expect(result.x).toBe(-50);
    });

    it('should calculate correct y from top edge with center origin', function ()
    {
        // y=0, height=50, originY=0.5 => top = 0 - (50 * 0.5) = -25
        var result = GetBounds(gameObject);

        expect(result.y).toBe(-25);
    });

    it('should set width equal to gameObject width', function ()
    {
        var result = GetBounds(gameObject);

        expect(result.width).toBe(100);
    });

    it('should set height equal to gameObject height', function ()
    {
        var result = GetBounds(gameObject);

        expect(result.height).toBe(50);
    });

    it('should calculate correct bounds with top-left origin (0, 0)', function ()
    {
        gameObject.originX = 0;
        gameObject.originY = 0;
        gameObject.x = 10;
        gameObject.y = 20;

        var result = GetBounds(gameObject);

        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(100);
        expect(result.height).toBe(50);
    });

    it('should calculate correct bounds with bottom-right origin (1, 1)', function ()
    {
        gameObject.originX = 1;
        gameObject.originY = 1;
        gameObject.x = 100;
        gameObject.y = 50;

        var result = GetBounds(gameObject);

        // left = 100 - (100 * 1) = 0, right = (100 + 100) - (100 * 1) = 100
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(100);
        expect(result.height).toBe(50);
    });

    it('should calculate correct bounds with non-zero position and center origin', function ()
    {
        gameObject.x = 200;
        gameObject.y = 100;
        gameObject.width = 80;
        gameObject.height = 40;
        gameObject.originX = 0.5;
        gameObject.originY = 0.5;

        var result = GetBounds(gameObject);

        // left = 200 - (80 * 0.5) = 160
        // top  = 100 - (40 * 0.5) = 80
        expect(result.x).toBe(160);
        expect(result.y).toBe(80);
        expect(result.width).toBe(80);
        expect(result.height).toBe(40);
    });

    it('should handle negative position values', function ()
    {
        gameObject.x = -50;
        gameObject.y = -25;
        gameObject.originX = 0;
        gameObject.originY = 0;

        var result = GetBounds(gameObject);

        expect(result.x).toBe(-50);
        expect(result.y).toBe(-25);
        expect(result.width).toBe(100);
        expect(result.height).toBe(50);
    });

    it('should handle zero dimensions', function ()
    {
        gameObject.width = 0;
        gameObject.height = 0;
        gameObject.x = 10;
        gameObject.y = 20;

        var result = GetBounds(gameObject);

        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should populate an existing plain object output', function ()
    {
        var output = { x: 999, y: 999, width: 999, height: 999 };

        gameObject.x = 0;
        gameObject.y = 0;
        gameObject.originX = 0;
        gameObject.originY = 0;

        GetBounds(gameObject, output);

        expect(output.x).toBe(0);
        expect(output.y).toBe(0);
        expect(output.width).toBe(100);
        expect(output.height).toBe(50);
    });

    it('should handle floating point origin values', function ()
    {
        gameObject.x = 10;
        gameObject.y = 10;
        gameObject.width = 100;
        gameObject.height = 60;
        gameObject.originX = 0.25;
        gameObject.originY = 0.75;

        var result = GetBounds(gameObject);

        // left = 10 - (100 * 0.25) = -15
        // top  = 10 - (60 * 0.75) = -35
        expect(result.x).toBeCloseTo(-15);
        expect(result.y).toBeCloseTo(-35);
        expect(result.width).toBeCloseTo(100);
        expect(result.height).toBeCloseTo(60);
    });
});
