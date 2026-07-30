var BottomRight = require('../../../../src/display/align/in/BottomRight');

describe('Phaser.Display.Align.In.BottomRight', function ()
{
    function makeObject (x, y, width, height, originX, originY)
    {
        return { x: x, y: y, width: width, height: height, originX: originX, originY: originY };
    }

    // GetRight  = (x + width) - (width * originX)
    // GetBottom = (y + height) - (height * originY)
    // SetRight  => x = (value - width) + (width * originX)
    // SetBottom => y = (value - height) + (height * originY)

    it('should return the gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 200, 200, 0, 0);
        var result = BottomRight(gameObject, alignIn);

        expect(result).toBe(gameObject);
    });

    it('should align gameObject to the bottom-right of alignIn with no offset', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 200, 200, 0, 0);

        BottomRight(gameObject, alignIn);

        // GetRight(alignIn) = (0 + 200) - (200 * 0) = 200
        // SetRight(gameObject, 200) => x = (200 - 50) + (50 * 0) = 150
        expect(gameObject.x).toBe(150);

        // GetBottom(alignIn) = (0 + 200) - (200 * 0) = 200
        // SetBottom(gameObject, 200) => y = (200 - 50) + (50 * 0) = 150
        expect(gameObject.y).toBe(150);
    });

    it('should apply positive offsetX to the right position', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 200, 200, 0, 0);

        BottomRight(gameObject, alignIn, 10, 0);

        // GetRight(alignIn) = 200, + offsetX 10 = 210
        // SetRight(gameObject, 210) => x = (210 - 50) + 0 = 160
        expect(gameObject.x).toBe(160);
        expect(gameObject.y).toBe(150);
    });

    it('should apply negative offsetX to the right position', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 200, 200, 0, 0);

        BottomRight(gameObject, alignIn, -10, 0);

        // GetRight(alignIn) = 200, + offsetX -10 = 190
        // SetRight(gameObject, 190) => x = (190 - 50) + 0 = 140
        expect(gameObject.x).toBe(140);
        expect(gameObject.y).toBe(150);
    });

    it('should apply positive offsetY to the bottom position', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 200, 200, 0, 0);

        BottomRight(gameObject, alignIn, 0, 10);

        expect(gameObject.x).toBe(150);
        // GetBottom(alignIn) = 200, + offsetY 10 = 210
        // SetBottom(gameObject, 210) => y = (210 - 50) + 0 = 160
        expect(gameObject.y).toBe(160);
    });

    it('should apply negative offsetY to the bottom position', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 200, 200, 0, 0);

        BottomRight(gameObject, alignIn, 0, -10);

        expect(gameObject.x).toBe(150);
        // GetBottom(alignIn) = 200, + offsetY -10 = 190
        // SetBottom(gameObject, 190) => y = (190 - 50) + 0 = 140
        expect(gameObject.y).toBe(140);
    });

    it('should apply both offsetX and offsetY', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 200, 200, 0, 0);

        BottomRight(gameObject, alignIn, 5, -5);

        expect(gameObject.x).toBe(155);
        expect(gameObject.y).toBe(145);
    });

    it('should default offsetX and offsetY to zero when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 200, 200, 0, 0);

        BottomRight(gameObject, alignIn);

        expect(gameObject.x).toBe(150);
        expect(gameObject.y).toBe(150);
    });

    it('should account for gameObject origin when positioning', function ()
    {
        // originX=0.5, originY=0.5 (centered origin)
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(0, 0, 200, 200, 0, 0);

        BottomRight(gameObject, alignIn);

        // GetRight(alignIn) = 200
        // SetRight(gameObject, 200) => x = (200 - 50) + (50 * 0.5) = 150 + 25 = 175
        expect(gameObject.x).toBe(175);

        // GetBottom(alignIn) = 200
        // SetBottom(gameObject, 200) => y = (200 - 50) + (50 * 0.5) = 150 + 25 = 175
        expect(gameObject.y).toBe(175);
    });

    it('should account for alignIn origin when computing its right and bottom edges', function ()
    {
        // alignIn with origin (0.5, 0.5)
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 200, 200, 0.5, 0.5);

        BottomRight(gameObject, alignIn);

        // GetRight(alignIn) = (0 + 200) - (200 * 0.5) = 200 - 100 = 100
        // SetRight(gameObject, 100) => x = (100 - 50) + 0 = 50
        expect(gameObject.x).toBe(50);

        // GetBottom(alignIn) = (0 + 200) - (200 * 0.5) = 100
        // SetBottom(gameObject, 100) => y = (100 - 50) + 0 = 50
        expect(gameObject.y).toBe(50);
    });

    it('should work when alignIn is positioned at a non-zero coordinate', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 100, 200, 200, 0, 0);

        BottomRight(gameObject, alignIn);

        // GetRight(alignIn) = (100 + 200) - 0 = 300
        // SetRight(gameObject, 300) => x = (300 - 50) + 0 = 250
        expect(gameObject.x).toBe(250);

        // GetBottom(alignIn) = (100 + 200) - 0 = 300
        // SetBottom(gameObject, 300) => y = (300 - 50) + 0 = 250
        expect(gameObject.y).toBe(250);
    });

    it('should work with objects of different sizes', function ()
    {
        var gameObject = makeObject(0, 0, 100, 80, 0, 0);
        var alignIn = makeObject(0, 0, 400, 300, 0, 0);

        BottomRight(gameObject, alignIn);

        // GetRight(alignIn) = 400, SetRight => x = 400 - 100 = 300
        expect(gameObject.x).toBe(300);
        // GetBottom(alignIn) = 300, SetBottom => y = 300 - 80 = 220
        expect(gameObject.y).toBe(220);
    });

    it('should work with floating point dimensions', function ()
    {
        var gameObject = makeObject(0, 0, 33.3, 33.3, 0, 0);
        var alignIn = makeObject(0, 0, 100, 100, 0, 0);

        BottomRight(gameObject, alignIn);

        // GetRight(alignIn) = 100, SetRight => x = 100 - 33.3 = 66.7
        expect(gameObject.x).toBeCloseTo(66.7);
        // GetBottom(alignIn) = 100, SetBottom => y = 100 - 33.3 = 66.7
        expect(gameObject.y).toBeCloseTo(66.7);
    });

    it('should work when gameObject is larger than alignIn', function ()
    {
        var gameObject = makeObject(0, 0, 300, 300, 0, 0);
        var alignIn = makeObject(0, 0, 100, 100, 0, 0);

        BottomRight(gameObject, alignIn);

        // SetRight => x = (100 - 300) + 0 = -200
        expect(gameObject.x).toBe(-200);
        // SetBottom => y = (100 - 300) + 0 = -200
        expect(gameObject.y).toBe(-200);
    });

    it('should work with zero-sized gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 0, 0, 0, 0);
        var alignIn = makeObject(0, 0, 200, 200, 0, 0);

        BottomRight(gameObject, alignIn);

        // SetRight => x = (200 - 0) + 0 = 200
        expect(gameObject.x).toBe(200);
        // SetBottom => y = (200 - 0) + 0 = 200
        expect(gameObject.y).toBe(200);
    });

    it('should work with negative alignIn coordinates', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(-100, -100, 200, 200, 0, 0);

        BottomRight(gameObject, alignIn);

        // GetRight(alignIn) = (-100 + 200) - 0 = 100
        // SetRight => x = (100 - 50) = 50
        expect(gameObject.x).toBe(50);

        // GetBottom(alignIn) = (-100 + 200) - 0 = 100
        // SetBottom => y = (100 - 50) = 50
        expect(gameObject.y).toBe(50);
    });
});
