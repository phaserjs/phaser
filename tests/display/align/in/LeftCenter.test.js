var LeftCenter = require('../../../../src/display/align/in/LeftCenter');

describe('Phaser.Display.Align.In.LeftCenter', function ()
{
    // Helper: creates a mock game object with default origin at (0.5, 0.5)
    function makeObject (x, y, width, height, originX, originY)
    {
        return {
            x: x !== undefined ? x : 0,
            y: y !== undefined ? y : 0,
            width: width !== undefined ? width : 100,
            height: height !== undefined ? height : 100,
            originX: originX !== undefined ? originX : 0.5,
            originY: originY !== undefined ? originY : 0.5
        };
    }

    it('should return the gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignIn = makeObject(200, 200, 200, 200);
        var result = LeftCenter(gameObject, alignIn);

        expect(result).toBe(gameObject);
    });

    it('should align the left edge of gameObject with the left edge of alignIn', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(200, 200, 200, 200, 0.5, 0.5);

        // GetLeft(alignIn) = 200 - (200 * 0.5) = 100
        // SetLeft sets gameObject.x = value + (width * originX)
        // gameObject.x = 100 + (50 * 0.5) = 125
        LeftCenter(gameObject, alignIn);

        expect(gameObject.x).toBe(125);
    });

    it('should vertically center gameObject within alignIn', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(200, 200, 200, 200, 0.5, 0.5);

        // GetCenterY(alignIn) = 200 - (200 * 0.5) + (200 * 0.5) = 200
        // SetCenterY: offsetY = 50 * 0.5 = 25; gameObject.y = (200 + 25) - (50 * 0.5) = 200
        LeftCenter(gameObject, alignIn);

        expect(gameObject.y).toBe(200);
    });

    it('should apply positive offsetX to shift left edge inward', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(200, 200, 200, 200, 0.5, 0.5);

        // GetLeft(alignIn) = 100
        // SetLeft value = 100 - 20 = 80
        // gameObject.x = 80 + 25 = 105
        LeftCenter(gameObject, alignIn, 20);

        expect(gameObject.x).toBe(105);
    });

    it('should apply negative offsetX to shift left edge outward', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(200, 200, 200, 200, 0.5, 0.5);

        // GetLeft(alignIn) = 100
        // SetLeft value = 100 - (-20) = 120
        // gameObject.x = 120 + 25 = 145
        LeftCenter(gameObject, alignIn, -20);

        expect(gameObject.x).toBe(145);
    });

    it('should apply positive offsetY to shift gameObject downward', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(200, 200, 200, 200, 0.5, 0.5);

        // GetCenterY(alignIn) = 200
        // SetCenterY with y = 200 + 30 = 230
        // gameObject.y = (230 + 25) - 25 = 230
        LeftCenter(gameObject, alignIn, 0, 30);

        expect(gameObject.y).toBe(230);
    });

    it('should apply negative offsetY to shift gameObject upward', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(200, 200, 200, 200, 0.5, 0.5);

        // GetCenterY(alignIn) = 200
        // SetCenterY with y = 200 + (-30) = 170
        // gameObject.y = (170 + 25) - 25 = 170
        LeftCenter(gameObject, alignIn, 0, -30);

        expect(gameObject.y).toBe(170);
    });

    it('should apply both offsetX and offsetY simultaneously', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(200, 200, 200, 200, 0.5, 0.5);

        LeftCenter(gameObject, alignIn, 10, 15);

        // left: 100 - 10 = 90; gameObject.x = 90 + 25 = 115
        // centerY: 200 + 15 = 215; gameObject.y = (215 + 25) - 25 = 215
        expect(gameObject.x).toBe(115);
        expect(gameObject.y).toBe(215);
    });

    it('should default offsetX and offsetY to zero when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(200, 200, 200, 200, 0.5, 0.5);

        var withDefaults = LeftCenter(gameObject, alignIn);

        var gameObject2 = makeObject(0, 0, 50, 50, 0.5, 0.5);
        LeftCenter(gameObject2, alignIn, 0, 0);

        expect(withDefaults.x).toBe(gameObject2.x);
        expect(withDefaults.y).toBe(gameObject2.y);
    });

    it('should work with zero-origin game objects', function ()
    {
        var gameObject = makeObject(0, 0, 60, 40, 0, 0);
        var alignIn = makeObject(300, 150, 400, 200, 0, 0);

        // GetLeft(alignIn) = 300 - (400 * 0) = 300
        // SetLeft: gameObject.x = 300 + (60 * 0) = 300
        // GetCenterY(alignIn) = 150 - (200 * 0) + (200 * 0.5) = 250
        // SetCenterY: offsetY = 40 * 0 = 0; gameObject.y = (250 + 0) - (40 * 0.5) = 230
        LeftCenter(gameObject, alignIn);

        expect(gameObject.x).toBe(300);
        expect(gameObject.y).toBe(230);
    });

    it('should work with top-left origin (0, 0) alignIn and center-origin gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 100, 60, 0.5, 0.5);
        var alignIn = makeObject(0, 0, 400, 300, 0, 0);

        // GetLeft(alignIn) = 0 - (400 * 0) = 0
        // SetLeft: gameObject.x = 0 + (100 * 0.5) = 50
        // GetCenterY(alignIn) = 0 - (300 * 0) + (300 * 0.5) = 150
        // SetCenterY: offsetY = 60 * 0.5 = 30; gameObject.y = (150 + 30) - (60 * 0.5) = 150
        LeftCenter(gameObject, alignIn);

        expect(gameObject.x).toBe(50);
        expect(gameObject.y).toBe(150);
    });

    it('should work when alignIn is larger than gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 20, 20, 0.5, 0.5);
        var alignIn = makeObject(500, 400, 300, 200, 0.5, 0.5);

        // GetLeft(alignIn) = 500 - (300 * 0.5) = 350
        // SetLeft: gameObject.x = 350 + (20 * 0.5) = 360
        // GetCenterY(alignIn) = 400 - (200 * 0.5) + (200 * 0.5) = 400
        // SetCenterY: offsetY = 20 * 0.5 = 10; gameObject.y = (400 + 10) - (20 * 0.5) = 400
        LeftCenter(gameObject, alignIn);

        expect(gameObject.x).toBe(360);
        expect(gameObject.y).toBe(400);
    });

    it('should work when alignIn is smaller than gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 200, 200, 0.5, 0.5);
        var alignIn = makeObject(100, 100, 50, 50, 0.5, 0.5);

        // GetLeft(alignIn) = 100 - (50 * 0.5) = 75
        // SetLeft: gameObject.x = 75 + (200 * 0.5) = 175
        // GetCenterY(alignIn) = 100 - (50 * 0.5) + (50 * 0.5) = 100
        // SetCenterY: offsetY = 200 * 0.5 = 100; gameObject.y = (100 + 100) - (200 * 0.5) = 100
        LeftCenter(gameObject, alignIn);

        expect(gameObject.x).toBe(175);
        expect(gameObject.y).toBe(100);
    });

    it('should work with negative positions', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(-100, -80, 200, 160, 0.5, 0.5);

        // GetLeft(alignIn) = -100 - (200 * 0.5) = -200
        // SetLeft: gameObject.x = -200 + (50 * 0.5) = -175
        // GetCenterY(alignIn) = -80 - (160 * 0.5) + (160 * 0.5) = -80
        // SetCenterY: offsetY = 50 * 0.5 = 25; gameObject.y = (-80 + 25) - (50 * 0.5) = -80
        LeftCenter(gameObject, alignIn);

        expect(gameObject.x).toBe(-175);
        expect(gameObject.y).toBe(-80);
    });

    it('should work with floating point dimensions', function ()
    {
        var gameObject = makeObject(0, 0, 33.3, 44.4, 0.5, 0.5);
        var alignIn = makeObject(100, 100, 200, 100, 0.5, 0.5);

        // GetLeft(alignIn) = 100 - 100 = 0
        // SetLeft: gameObject.x = 0 + (33.3 * 0.5) = 16.65
        // GetCenterY(alignIn) = 100 - 50 + 50 = 100
        // SetCenterY: offsetY = 44.4 * 0.5 = 22.2; gameObject.y = (100 + 22.2) - 22.2 = 100
        LeftCenter(gameObject, alignIn);

        expect(gameObject.x).toBeCloseTo(16.65);
        expect(gameObject.y).toBeCloseTo(100);
    });

    it('should not modify alignIn object', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(200, 200, 200, 200, 0.5, 0.5);

        var origX = alignIn.x;
        var origY = alignIn.y;
        var origWidth = alignIn.width;
        var origHeight = alignIn.height;

        LeftCenter(gameObject, alignIn);

        expect(alignIn.x).toBe(origX);
        expect(alignIn.y).toBe(origY);
        expect(alignIn.width).toBe(origWidth);
        expect(alignIn.height).toBe(origHeight);
    });
});
