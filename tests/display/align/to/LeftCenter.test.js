var LeftCenter = require('../../../../src/display/align/to/LeftCenter');

describe('Phaser.Display.Align.To.LeftCenter', function ()
{
    function makeObject(x, y, width, height, originX, originY)
    {
        return {
            x: x || 0,
            y: y || 0,
            width: width || 100,
            height: height || 100,
            originX: (originX !== undefined) ? originX : 0.5,
            originY: (originY !== undefined) ? originY : 0.5
        };
    }

    it('should return the gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100);
        var alignTo = makeObject(200, 200, 100, 100);

        var result = LeftCenter(gameObject, alignTo);

        expect(result).toBe(gameObject);
    });

    it('should align the right edge of gameObject to the left edge of alignTo', function ()
    {
        // alignTo: x=200, width=100, originX=0.5 => left = 200 - 100*0.5 = 150
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 100, 100, 0.5, 0.5);

        LeftCenter(gameObject, alignTo);

        // GetLeft(alignTo) = 200 - 100*0.5 = 150
        // SetRight(gameObject, 150): gameObject.x = (150 - 100) + (100 * 0.5) = 50 + 50 = 100
        // GetRight(gameObject) = 100 - (100 * 0.5) + 100 = 100 - 50 + 100 = 150 ... no
        // GetLeft(gameObject after) = gameObject.x - width * originX = 100 - 100*0.5 = 50
        // right of gameObject = left + width = 50 + 100 = 150
        // left of alignTo = 150. Correct.
        var rightOfGameObject = gameObject.x - (gameObject.width * gameObject.originX) + gameObject.width;
        var leftOfAlignTo = alignTo.x - (alignTo.width * alignTo.originX);

        expect(rightOfGameObject).toBeCloseTo(leftOfAlignTo);
    });

    it('should vertically center gameObject with alignTo', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 300, 100, 80, 0.5, 0.5);

        LeftCenter(gameObject, alignTo);

        // GetCenterY(alignTo) = 300 - 80*0.5 + 80*0.5 = 300
        // SetCenterY(gameObject, 300): offsetY = 100*0.5 = 50; y = (300 + 50) - 100*0.5 = 350 - 50 = 300
        // GetCenterY(gameObject) = 300 - 100*0.5 + 100*0.5 = 300
        var centerYGameObject = gameObject.y - (gameObject.height * gameObject.originY) + (gameObject.height * 0.5);
        var centerYAlignTo = alignTo.y - (alignTo.height * alignTo.originY) + (alignTo.height * 0.5);

        expect(centerYGameObject).toBeCloseTo(centerYAlignTo);
    });

    it('should apply horizontal offset to the right edge alignment', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 100, 100, 0.5, 0.5);

        LeftCenter(gameObject, alignTo, 20, 0);

        // GetLeft(alignTo) = 150; SetRight(gameObject, 150 - 20 = 130)
        var rightOfGameObject = gameObject.x - (gameObject.width * gameObject.originX) + gameObject.width;
        var leftOfAlignTo = alignTo.x - (alignTo.width * alignTo.originX);

        expect(rightOfGameObject).toBeCloseTo(leftOfAlignTo - 20);
    });

    it('should apply vertical offset to the center alignment', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 100, 100, 0.5, 0.5);

        LeftCenter(gameObject, alignTo, 0, 30);

        var centerYGameObject = gameObject.y - (gameObject.height * gameObject.originY) + (gameObject.height * 0.5);
        var centerYAlignTo = alignTo.y - (alignTo.height * alignTo.originY) + (alignTo.height * 0.5);

        expect(centerYGameObject).toBeCloseTo(centerYAlignTo + 30);
    });

    it('should apply both horizontal and vertical offsets', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 100, 100, 0.5, 0.5);

        LeftCenter(gameObject, alignTo, 15, 25);

        var rightOfGameObject = gameObject.x - (gameObject.width * gameObject.originX) + gameObject.width;
        var leftOfAlignTo = alignTo.x - (alignTo.width * alignTo.originX);
        var centerYGameObject = gameObject.y - (gameObject.height * gameObject.originY) + (gameObject.height * 0.5);
        var centerYAlignTo = alignTo.y - (alignTo.height * alignTo.originY) + (alignTo.height * 0.5);

        expect(rightOfGameObject).toBeCloseTo(leftOfAlignTo - 15);
        expect(centerYGameObject).toBeCloseTo(centerYAlignTo + 25);
    });

    it('should default offsetX to zero when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 100, 100, 0.5, 0.5);

        LeftCenter(gameObject, alignTo);

        var rightOfGameObject = gameObject.x - (gameObject.width * gameObject.originX) + gameObject.width;
        var leftOfAlignTo = alignTo.x - (alignTo.width * alignTo.originX);

        expect(rightOfGameObject).toBeCloseTo(leftOfAlignTo);
    });

    it('should default offsetY to zero when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 100, 100, 0.5, 0.5);

        LeftCenter(gameObject, alignTo);

        var centerYGameObject = gameObject.y - (gameObject.height * gameObject.originY) + (gameObject.height * 0.5);
        var centerYAlignTo = alignTo.y - (alignTo.height * alignTo.originY) + (alignTo.height * 0.5);

        expect(centerYGameObject).toBeCloseTo(centerYAlignTo);
    });

    it('should work with zero-origin objects', function ()
    {
        // originX=0, originY=0 means position is at top-left
        var gameObject = makeObject(0, 0, 80, 60, 0, 0);
        var alignTo = makeObject(300, 200, 120, 100, 0, 0);

        LeftCenter(gameObject, alignTo);

        // GetLeft(alignTo) = 300 - 120*0 = 300
        // SetRight(gameObject, 300): x = (300 - 80) + (80 * 0) = 220
        // GetCenterY(alignTo) = 200 - 100*0 + 100*0.5 = 250
        // SetCenterY(gameObject, 250): offsetY = 60*0 = 0; y = (250 + 0) - 60*0.5 = 220
        expect(gameObject.x).toBeCloseTo(220);
        expect(gameObject.y).toBeCloseTo(220);
    });

    it('should work with negative offsets', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 100, 100, 0.5, 0.5);

        LeftCenter(gameObject, alignTo, -10, -20);

        var rightOfGameObject = gameObject.x - (gameObject.width * gameObject.originX) + gameObject.width;
        var leftOfAlignTo = alignTo.x - (alignTo.width * alignTo.originX);
        var centerYGameObject = gameObject.y - (gameObject.height * gameObject.originY) + (gameObject.height * 0.5);
        var centerYAlignTo = alignTo.y - (alignTo.height * alignTo.originY) + (alignTo.height * 0.5);

        expect(rightOfGameObject).toBeCloseTo(leftOfAlignTo + 10);
        expect(centerYGameObject).toBeCloseTo(centerYAlignTo - 20);
    });

    it('should work with differently sized objects', function ()
    {
        var gameObject = makeObject(0, 0, 50, 200, 0.5, 0.5);
        var alignTo = makeObject(400, 100, 150, 60, 0.5, 0.5);

        LeftCenter(gameObject, alignTo);

        // GetLeft(alignTo) = 400 - 150*0.5 = 325
        // SetRight(gameObject, 325): x = (325 - 50) + (50 * 0.5) = 275 + 25 = 300
        // GetCenterY(alignTo) = 100 - 60*0.5 + 60*0.5 = 100
        // SetCenterY(gameObject, 100): offsetY = 200*0.5=100; y = (100+100) - 200*0.5 = 200 - 100 = 100
        expect(gameObject.x).toBeCloseTo(300);
        expect(gameObject.y).toBeCloseTo(100);
    });

    it('should work when alignTo is positioned at origin', function ()
    {
        var gameObject = makeObject(500, 500, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(0, 0, 100, 100, 0.5, 0.5);

        LeftCenter(gameObject, alignTo);

        // GetLeft(alignTo) = 0 - 100*0.5 = -50
        // SetRight(gameObject, -50): x = (-50 - 100) + 100*0.5 = -150 + 50 = -100
        // GetCenterY(alignTo) = 0 - 100*0.5 + 100*0.5 = 0
        // SetCenterY(gameObject, 0): offsetY=50; y = (0+50) - 50 = 0
        expect(gameObject.x).toBeCloseTo(-100);
        expect(gameObject.y).toBeCloseTo(0);
    });

    it('should work with floating point positions and sizes', function ()
    {
        var gameObject = makeObject(0, 0, 33.3, 44.4, 0.5, 0.5);
        var alignTo = makeObject(100.5, 200.7, 66.6, 88.8, 0.5, 0.5);

        LeftCenter(gameObject, alignTo);

        var rightOfGameObject = gameObject.x - (gameObject.width * gameObject.originX) + gameObject.width;
        var leftOfAlignTo = alignTo.x - (alignTo.width * alignTo.originX);
        var centerYGameObject = gameObject.y - (gameObject.height * gameObject.originY) + (gameObject.height * 0.5);
        var centerYAlignTo = alignTo.y - (alignTo.height * alignTo.originY) + (alignTo.height * 0.5);

        expect(rightOfGameObject).toBeCloseTo(leftOfAlignTo);
        expect(centerYGameObject).toBeCloseTo(centerYAlignTo);
    });
});
