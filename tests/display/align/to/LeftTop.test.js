var LeftTop = require('../../../../src/display/align/to/LeftTop');

describe('Phaser.Display.Align.To.LeftTop', function ()
{
    function makeObject (x, y, width, height, originX, originY)
    {
        return { x: x, y: y, width: width, height: height, originX: originX, originY: originY };
    }

    it('should return the gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 60, 40, 0, 0);
        var alignTo = makeObject(200, 100, 100, 80, 0, 0);

        var result = LeftTop(gameObject, alignTo);

        expect(result).toBe(gameObject);
    });

    it('should align the right edge of gameObject to the left edge of alignTo (origin 0,0)', function ()
    {
        var gameObject = makeObject(0, 0, 60, 40, 0, 0);
        var alignTo = makeObject(200, 100, 100, 80, 0, 0);

        // GetLeft(alignTo) = 200 - (100 * 0) = 200
        // SetRight(gameObject, 200): gameObject.x = (200 - 60) + (60 * 0) = 140
        LeftTop(gameObject, alignTo);

        expect(gameObject.x).toBe(140);
    });

    it('should align the top edge of gameObject to the top edge of alignTo (origin 0,0)', function ()
    {
        var gameObject = makeObject(0, 0, 60, 40, 0, 0);
        var alignTo = makeObject(200, 100, 100, 80, 0, 0);

        // GetTop(alignTo) = 100 - (80 * 0) = 100
        // SetTop(gameObject, 100): gameObject.y = 100 + (40 * 0) = 100
        LeftTop(gameObject, alignTo);

        expect(gameObject.y).toBe(100);
    });

    it('should align correctly with centered origin (0.5, 0.5)', function ()
    {
        var gameObject = makeObject(0, 0, 60, 40, 0.5, 0.5);
        var alignTo = makeObject(200, 100, 100, 80, 0.5, 0.5);

        // GetLeft(alignTo) = 200 - (100 * 0.5) = 150
        // SetRight(gameObject, 150): gameObject.x = (150 - 60) + (60 * 0.5) = 90 + 30 = 120
        // GetTop(alignTo) = 100 - (80 * 0.5) = 60
        // SetTop(gameObject, 60): gameObject.y = 60 + (40 * 0.5) = 80
        LeftTop(gameObject, alignTo);

        expect(gameObject.x).toBe(120);
        expect(gameObject.y).toBe(80);
    });

    it('should apply a positive horizontal offset', function ()
    {
        var gameObject = makeObject(0, 0, 60, 40, 0, 0);
        var alignTo = makeObject(200, 100, 100, 80, 0, 0);

        // GetLeft(alignTo) = 200
        // SetRight(gameObject, 200 - 10 = 190): gameObject.x = (190 - 60) + 0 = 130
        LeftTop(gameObject, alignTo, 10, 0);

        expect(gameObject.x).toBe(130);
        expect(gameObject.y).toBe(100);
    });

    it('should apply a positive vertical offset', function ()
    {
        var gameObject = makeObject(0, 0, 60, 40, 0, 0);
        var alignTo = makeObject(200, 100, 100, 80, 0, 0);

        // GetTop(alignTo) = 100
        // SetTop(gameObject, 100 - 20 = 80): gameObject.y = 80 + 0 = 80
        LeftTop(gameObject, alignTo, 0, 20);

        expect(gameObject.x).toBe(140);
        expect(gameObject.y).toBe(80);
    });

    it('should apply both horizontal and vertical offsets', function ()
    {
        var gameObject = makeObject(0, 0, 60, 40, 0, 0);
        var alignTo = makeObject(200, 100, 100, 80, 0, 0);

        // offsetX=10, offsetY=20
        // gameObject.x = (190 - 60) + 0 = 130
        // gameObject.y = 80 + 0 = 80
        LeftTop(gameObject, alignTo, 10, 20);

        expect(gameObject.x).toBe(130);
        expect(gameObject.y).toBe(80);
    });

    it('should apply negative offsets, moving gameObject further from alignTo', function ()
    {
        var gameObject = makeObject(0, 0, 60, 40, 0, 0);
        var alignTo = makeObject(200, 100, 100, 80, 0, 0);

        // GetLeft(alignTo) = 200
        // SetRight(gameObject, 200 - (-10) = 210): gameObject.x = (210 - 60) + 0 = 150
        // GetTop(alignTo) = 100
        // SetTop(gameObject, 100 - (-20) = 120): gameObject.y = 120 + 0 = 120
        LeftTop(gameObject, alignTo, -10, -20);

        expect(gameObject.x).toBe(150);
        expect(gameObject.y).toBe(120);
    });

    it('should default offsetX to 0 when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 60, 40, 0, 0);
        var alignTo = makeObject(200, 100, 100, 80, 0, 0);
        var gameObjectWithOffset = makeObject(0, 0, 60, 40, 0, 0);

        LeftTop(gameObject, alignTo);
        LeftTop(gameObjectWithOffset, alignTo, 0, 0);

        expect(gameObject.x).toBe(gameObjectWithOffset.x);
        expect(gameObject.y).toBe(gameObjectWithOffset.y);
    });

    it('should default offsetY to 0 when offsetX is provided but offsetY is not', function ()
    {
        var gameObject = makeObject(0, 0, 60, 40, 0, 0);
        var alignTo = makeObject(200, 100, 100, 80, 0, 0);
        var gameObjectWithOffset = makeObject(0, 0, 60, 40, 0, 0);

        LeftTop(gameObject, alignTo, 5);
        LeftTop(gameObjectWithOffset, alignTo, 5, 0);

        expect(gameObject.x).toBe(gameObjectWithOffset.x);
        expect(gameObject.y).toBe(gameObjectWithOffset.y);
    });

    it('should place gameObject to the left of alignTo when aligned flush', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30, 0, 0);
        var alignTo = makeObject(300, 150, 120, 60, 0, 0);

        LeftTop(gameObject, alignTo);

        // right edge of gameObject = gameObject.x + gameObject.width = 250 + 50 = 300
        // left edge of alignTo = 300
        expect(gameObject.x + gameObject.width).toBe(300);
    });

    it('should align the top edges flush when offsetY is zero', function ()
    {
        var gameObject = makeObject(0, 0, 50, 30, 0, 0);
        var alignTo = makeObject(300, 150, 120, 60, 0, 0);

        LeftTop(gameObject, alignTo);

        // top of gameObject = gameObject.y = 150
        // top of alignTo = alignTo.y = 150
        expect(gameObject.y).toBe(alignTo.y);
    });

    it('should work with floating point dimensions and origins', function ()
    {
        var gameObject = makeObject(0, 0, 75, 50, 0.25, 0.75);
        var alignTo = makeObject(100, 80, 200, 100, 0.5, 0.5);

        // GetLeft(alignTo) = 100 - (200 * 0.5) = 0
        // SetRight(gameObject, 0): gameObject.x = (0 - 75) + (75 * 0.25) = -75 + 18.75 = -56.25
        // GetTop(alignTo) = 80 - (100 * 0.5) = 30
        // SetTop(gameObject, 30): gameObject.y = 30 + (50 * 0.75) = 30 + 37.5 = 67.5
        LeftTop(gameObject, alignTo);

        expect(gameObject.x).toBeCloseTo(-56.25);
        expect(gameObject.y).toBeCloseTo(67.5);
    });

    it('should work when alignTo is at the origin (0, 0)', function ()
    {
        var gameObject = makeObject(50, 50, 40, 30, 0, 0);
        var alignTo = makeObject(0, 0, 80, 60, 0, 0);

        // GetLeft(alignTo) = 0
        // SetRight(gameObject, 0): gameObject.x = (0 - 40) + 0 = -40
        // GetTop(alignTo) = 0
        // SetTop(gameObject, 0): gameObject.y = 0 + 0 = 0
        LeftTop(gameObject, alignTo);

        expect(gameObject.x).toBe(-40);
        expect(gameObject.y).toBe(0);
    });

    it('should work with negative coordinates', function ()
    {
        var gameObject = makeObject(0, 0, 60, 40, 0, 0);
        var alignTo = makeObject(-100, -50, 80, 60, 0, 0);

        // GetLeft(alignTo) = -100 - 0 = -100
        // SetRight(gameObject, -100): gameObject.x = (-100 - 60) + 0 = -160
        // GetTop(alignTo) = -50 - 0 = -50
        // SetTop(gameObject, -50): gameObject.y = -50 + 0 = -50
        LeftTop(gameObject, alignTo);

        expect(gameObject.x).toBe(-160);
        expect(gameObject.y).toBe(-50);
    });

    it('should work with zero-size gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 0, 0, 0, 0);
        var alignTo = makeObject(200, 100, 100, 80, 0, 0);

        // GetLeft(alignTo) = 200
        // SetRight(gameObject, 200): gameObject.x = (200 - 0) + 0 = 200
        // GetTop(alignTo) = 100
        // SetTop(gameObject, 100): gameObject.y = 100 + 0 = 100
        LeftTop(gameObject, alignTo);

        expect(gameObject.x).toBe(200);
        expect(gameObject.y).toBe(100);
    });
});
