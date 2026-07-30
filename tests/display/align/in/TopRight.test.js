var TopRight = require('../../../../src/display/align/in/TopRight');
var GetRight = require('../../../../src/display/bounds/GetRight');
var GetTop = require('../../../../src/display/bounds/GetTop');

describe('Phaser.Display.Align.In.TopRight', function ()
{
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
        var gameObject = makeObject(0, 0, 50, 30);
        var alignIn = makeObject(100, 50, 200, 100);

        var result = TopRight(gameObject, alignIn);

        expect(result).toBe(gameObject);
    });

    it('should align the right edge of gameObject to the right edge of alignIn', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30);
        var alignIn = makeObject(100, 50, 200, 100);

        TopRight(gameObject, alignIn);

        expect(GetRight(gameObject)).toBe(GetRight(alignIn));
    });

    it('should align the top edge of gameObject to the top edge of alignIn', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30);
        var alignIn = makeObject(100, 50, 200, 100);

        TopRight(gameObject, alignIn);

        expect(GetTop(gameObject)).toBe(GetTop(alignIn));
    });

    it('should position gameObject correctly with origin 0,0', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30, 0, 0);
        var alignIn = makeObject(100, 50, 200, 100, 0, 0);

        TopRight(gameObject, alignIn);

        // GetRight(alignIn) = 100 + 200 = 300, SetRight sets x = 300 - 50 = 250
        expect(gameObject.x).toBe(250);
        // GetTop(alignIn) = 50, SetTop sets y = 50
        expect(gameObject.y).toBe(50);
    });

    it('should use offsetX to shift the right edge horizontally', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30, 0, 0);
        var alignIn = makeObject(100, 50, 200, 100, 0, 0);

        TopRight(gameObject, alignIn, 20, 0);

        // GetRight(alignIn) = 300, + offsetX 20 = 320, SetRight: x = 320 - 50 = 270
        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn) + 20);
    });

    it('should use offsetY to shift the top edge vertically', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30, 0, 0);
        var alignIn = makeObject(100, 50, 200, 100, 0, 0);

        TopRight(gameObject, alignIn, 0, 15);

        // GetTop(alignIn) = 50, - offsetY 15 = 35
        expect(GetTop(gameObject)).toBeCloseTo(GetTop(alignIn) - 15);
    });

    it('should apply both offsetX and offsetY together', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30, 0, 0);
        var alignIn = makeObject(100, 50, 200, 100, 0, 0);

        TopRight(gameObject, alignIn, 10, 20);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn) + 10);
        expect(GetTop(gameObject)).toBeCloseTo(GetTop(alignIn) - 20);
    });

    it('should default offsetX and offsetY to zero when not provided', function ()
    {
        var gameObjectA = makeObject(0, 0, 50, 30, 0, 0);
        var gameObjectB = makeObject(0, 0, 50, 30, 0, 0);
        var alignIn = makeObject(100, 50, 200, 100, 0, 0);

        TopRight(gameObjectA, alignIn);
        TopRight(gameObjectB, alignIn, 0, 0);

        expect(gameObjectA.x).toBe(gameObjectB.x);
        expect(gameObjectA.y).toBe(gameObjectB.y);
    });

    it('should handle negative offsetX', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30, 0, 0);
        var alignIn = makeObject(100, 50, 200, 100, 0, 0);

        TopRight(gameObject, alignIn, -30, 0);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn) - 30);
    });

    it('should handle negative offsetY', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30, 0, 0);
        var alignIn = makeObject(100, 50, 200, 100, 0, 0);

        TopRight(gameObject, alignIn, 0, -10);

        expect(GetTop(gameObject)).toBeCloseTo(GetTop(alignIn) + 10);
    });

    it('should work correctly with non-zero origins on gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30, 0.5, 0.5);
        var alignIn = makeObject(100, 50, 200, 100, 0, 0);

        TopRight(gameObject, alignIn);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn));
        expect(GetTop(gameObject)).toBeCloseTo(GetTop(alignIn));
    });

    it('should work correctly with non-zero origins on alignIn', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30, 0, 0);
        var alignIn = makeObject(100, 50, 200, 100, 0.5, 0.5);

        TopRight(gameObject, alignIn);

        // GetRight(alignIn) = (100+200) - (200*0.5) = 200
        // GetTop(alignIn) = 50 - (100*0.5) = 0
        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn));
        expect(GetTop(gameObject)).toBeCloseTo(GetTop(alignIn));
    });

    it('should work when alignIn is at the origin', function ()
    {
        var gameObject = makeObject(99, 99, 50, 30, 0, 0);
        var alignIn = makeObject(0, 0, 200, 100, 0, 0);

        TopRight(gameObject, alignIn);

        // GetRight(alignIn) = 200, GetTop(alignIn) = 0
        expect(GetRight(gameObject)).toBe(200);
        expect(GetTop(gameObject)).toBe(0);
    });

    it('should work with zero-size game objects', function ()
    {
        var gameObject = makeObject(0, 0, 0, 0, 0, 0);
        var alignIn = makeObject(100, 50, 200, 100, 0, 0);

        TopRight(gameObject, alignIn);

        expect(GetRight(gameObject)).toBe(GetRight(alignIn));
        expect(GetTop(gameObject)).toBe(GetTop(alignIn));
    });

    it('should work with floating point positions and sizes', function ()
    {
        var gameObject = makeObject(0, 0, 25.5, 15.5, 0, 0);
        var alignIn = makeObject(10.5, 20.5, 100.5, 50.5, 0, 0);

        TopRight(gameObject, alignIn);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn));
        expect(GetTop(gameObject)).toBeCloseTo(GetTop(alignIn));
    });

    it('should work with negative position alignIn', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30, 0, 0);
        var alignIn = makeObject(-200, -100, 100, 80, 0, 0);

        TopRight(gameObject, alignIn);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn));
        expect(GetTop(gameObject)).toBeCloseTo(GetTop(alignIn));
    });

    it('should mutate gameObject x and y in place', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30, 0, 0);
        var alignIn = makeObject(100, 50, 200, 100, 0, 0);

        TopRight(gameObject, alignIn);

        expect(gameObject.x).not.toBe(0);
        expect(gameObject.y).not.toBe(0);
    });

    it('should not mutate alignIn', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30, 0, 0);
        var alignIn = makeObject(100, 50, 200, 100, 0, 0);

        TopRight(gameObject, alignIn, 5, 5);

        expect(alignIn.x).toBe(100);
        expect(alignIn.y).toBe(50);
        expect(alignIn.width).toBe(200);
        expect(alignIn.height).toBe(100);
    });
});
