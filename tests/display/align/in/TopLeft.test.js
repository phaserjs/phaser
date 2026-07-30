var TopLeft = require('../../../../src/display/align/in/TopLeft');

describe('Phaser.Display.Align.In.TopLeft', function ()
{
    // Helper to create a mock game object
    // With originX=0, originY=0: left=x, top=y
    // With originX=0.5, originY=0.5: left=x-width/2, top=y-height/2
    function makeObject(x, y, width, height, originX, originY)
    {
        return {
            x: x,
            y: y,
            width: width,
            height: height,
            originX: originX !== undefined ? originX : 0,
            originY: originY !== undefined ? originY : 0
        };
    }

    it('should return the game object', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(100, 100, 200, 200);

        var result = TopLeft(gameObject, alignIn);

        expect(result).toBe(gameObject);
    });

    it('should align left edge of gameObject to left edge of alignIn with zero origin', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn);

        // alignIn left = 100 - (200 * 0) = 100
        // gameObject.x = 100 + (50 * 0) = 100
        expect(gameObject.x).toBe(100);
    });

    it('should align top edge of gameObject to top edge of alignIn with zero origin', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn);

        // alignIn top = 100 - (200 * 0) = 100
        // gameObject.y = 100 + (50 * 0) = 100
        expect(gameObject.y).toBe(100);
    });

    it('should align correctly with center origin on alignIn', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(200, 150, 200, 100, 0.5, 0.5);

        TopLeft(gameObject, alignIn);

        // alignIn left = 200 - (200 * 0.5) = 100
        // gameObject.x = 100 + (50 * 0) = 100
        expect(gameObject.x).toBe(100);

        // alignIn top = 150 - (100 * 0.5) = 100
        // gameObject.y = 100 + (50 * 0) = 100
        expect(gameObject.y).toBe(100);
    });

    it('should align correctly with center origin on gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 50, 40, 0.5, 0.5);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn);

        // alignIn left = 100 - (200 * 0) = 100
        // gameObject.x = 100 + (50 * 0.5) = 125
        expect(gameObject.x).toBe(125);

        // alignIn top = 100 - (200 * 0) = 100
        // gameObject.y = 100 + (40 * 0.5) = 120
        expect(gameObject.y).toBe(120);
    });

    it('should apply positive offsetX to shift gameObject right', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn, 20, 0);

        // alignIn left = 100, SetLeft(gameObject, 100 - 20) = 80
        // gameObject.x = 80 + (50 * 0) = 80
        expect(gameObject.x).toBe(80);
        expect(gameObject.y).toBe(100);
    });

    it('should apply positive offsetY to shift gameObject down', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn, 0, 30);

        // alignIn top = 100, SetTop(gameObject, 100 - 30) = 70
        // gameObject.y = 70 + (50 * 0) = 70
        expect(gameObject.x).toBe(100);
        expect(gameObject.y).toBe(70);
    });

    it('should apply both offsetX and offsetY', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn, 10, 15);

        expect(gameObject.x).toBe(90);
        expect(gameObject.y).toBe(85);
    });

    it('should apply negative offsetX to shift gameObject left', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn, -20, 0);

        // SetLeft(gameObject, 100 - (-20)) = 120
        // gameObject.x = 120
        expect(gameObject.x).toBe(120);
    });

    it('should apply negative offsetY to shift gameObject up', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn, 0, -30);

        // SetTop(gameObject, 100 - (-30)) = 130
        // gameObject.y = 130
        expect(gameObject.y).toBe(130);
    });

    it('should default offsetX to 0 when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn);

        expect(gameObject.x).toBe(100);
    });

    it('should default offsetY to 0 when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn);

        expect(gameObject.y).toBe(100);
    });

    it('should default offsetY to 0 when only offsetX is provided', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn, 10);

        expect(gameObject.y).toBe(100);
    });

    it('should handle alignIn at negative coordinates', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(-50, -80, 100, 100);

        TopLeft(gameObject, alignIn);

        // alignIn left = -50 - (100 * 0) = -50
        // alignIn top = -80 - (100 * 0) = -80
        expect(gameObject.x).toBe(-50);
        expect(gameObject.y).toBe(-80);
    });

    it('should handle floating point coordinates', function ()
    {
        var gameObject = makeObject(0, 0, 10, 10);
        var alignIn = makeObject(10.5, 20.5, 100, 100);

        TopLeft(gameObject, alignIn);

        expect(gameObject.x).toBeCloseTo(10.5);
        expect(gameObject.y).toBeCloseTo(20.5);
    });

    it('should handle floating point offsets', function ()
    {
        var gameObject = makeObject(0, 0, 10, 10);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn, 0.5, 1.5);

        expect(gameObject.x).toBeCloseTo(99.5);
        expect(gameObject.y).toBeCloseTo(98.5);
    });

    it('should handle zero-sized gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 0, 0);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn);

        expect(gameObject.x).toBe(100);
        expect(gameObject.y).toBe(100);
    });

    it('should align at origin when alignIn is at 0,0 with zero origin', function ()
    {
        var gameObject = makeObject(999, 999, 50, 50);
        var alignIn = makeObject(0, 0, 100, 100);

        TopLeft(gameObject, alignIn);

        expect(gameObject.x).toBe(0);
        expect(gameObject.y).toBe(0);
    });

    it('should not modify alignIn object', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(100, 100, 200, 200);

        TopLeft(gameObject, alignIn, 10, 20);

        expect(alignIn.x).toBe(100);
        expect(alignIn.y).toBe(100);
        expect(alignIn.width).toBe(200);
        expect(alignIn.height).toBe(200);
    });
});
