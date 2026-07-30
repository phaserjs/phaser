var LeftBottom = require('../../../../src/display/align/to/LeftBottom');
var GetLeft = require('../../../../src/display/bounds/GetLeft');
var GetBottom = require('../../../../src/display/bounds/GetBottom');

describe('Phaser.Display.Align.To.LeftBottom', function ()
{
    var gameObject;
    var alignTo;

    beforeEach(function ()
    {
        gameObject = { x: 0, y: 0, width: 80, height: 60, originX: 0, originY: 0 };
        alignTo = { x: 200, y: 100, width: 100, height: 50, originX: 0, originY: 0 };
    });

    it('should return the gameObject', function ()
    {
        var result = LeftBottom(gameObject, alignTo);

        expect(result).toBe(gameObject);
    });

    it('should align gameObject right edge to alignTo left edge with no offset', function ()
    {
        LeftBottom(gameObject, alignTo);

        // GetLeft(alignTo) = 200, so SetRight(gameObject, 200) => gameObject.x = 200 - 80 = 120
        expect(gameObject.x).toBe(120);
    });

    it('should align gameObject bottom edge to alignTo bottom edge with no offset', function ()
    {
        LeftBottom(gameObject, alignTo);

        // GetBottom(alignTo) = (100 + 50) - 0 = 150, so SetBottom(gameObject, 150) => gameObject.y = 150 - 60 = 90
        expect(gameObject.y).toBe(90);
    });

    it('should default offsetX to zero when not provided', function ()
    {
        LeftBottom(gameObject, alignTo);

        expect(gameObject.x).toBe(120);
    });

    it('should default offsetY to zero when not provided', function ()
    {
        LeftBottom(gameObject, alignTo);

        expect(gameObject.y).toBe(90);
    });

    it('should apply positive offsetX to shift gameObject further left', function ()
    {
        LeftBottom(gameObject, alignTo, 10, 0);

        // SetRight(gameObject, GetLeft(alignTo) - 10) = SetRight(gameObject, 190) => gameObject.x = 190 - 80 = 110
        expect(gameObject.x).toBe(110);
    });

    it('should apply negative offsetX to shift gameObject closer to alignTo', function ()
    {
        LeftBottom(gameObject, alignTo, -10, 0);

        // SetRight(gameObject, GetLeft(alignTo) - (-10)) = SetRight(gameObject, 210) => gameObject.x = 210 - 80 = 130
        expect(gameObject.x).toBe(130);
    });

    it('should apply positive offsetY to shift gameObject further down', function ()
    {
        LeftBottom(gameObject, alignTo, 0, 20);

        // SetBottom(gameObject, GetBottom(alignTo) + 20) = SetBottom(gameObject, 170) => gameObject.y = 170 - 60 = 110
        expect(gameObject.y).toBe(110);
    });

    it('should apply negative offsetY to shift gameObject upward', function ()
    {
        LeftBottom(gameObject, alignTo, 0, -20);

        // SetBottom(gameObject, GetBottom(alignTo) - 20) = SetBottom(gameObject, 130) => gameObject.y = 130 - 60 = 70
        expect(gameObject.y).toBe(70);
    });

    it('should apply both offsetX and offsetY together', function ()
    {
        LeftBottom(gameObject, alignTo, 10, 20);

        // x: SetRight(gameObject, 190) => 190 - 80 = 110
        // y: SetBottom(gameObject, 170) => 170 - 60 = 110
        expect(gameObject.x).toBe(110);
        expect(gameObject.y).toBe(110);
    });

    it('should account for gameObject originX when positioning', function ()
    {
        gameObject.originX = 0.5;

        LeftBottom(gameObject, alignTo);

        // SetRight(gameObject, 200): gameObject.x = (200 - 80) + (80 * 0.5) = 120 + 40 = 160
        expect(gameObject.x).toBe(160);
    });

    it('should account for gameObject originY when positioning', function ()
    {
        gameObject.originY = 0.5;

        LeftBottom(gameObject, alignTo);

        // SetBottom(gameObject, 150): gameObject.y = (150 - 60) + (60 * 0.5) = 90 + 30 = 120
        expect(gameObject.y).toBe(120);
    });

    it('should account for alignTo originX when calculating left edge', function ()
    {
        alignTo.originX = 0.5;

        LeftBottom(gameObject, alignTo);

        // GetLeft(alignTo) = 200 - (100 * 0.5) = 200 - 50 = 150
        // SetRight(gameObject, 150) => gameObject.x = 150 - 80 = 70
        expect(gameObject.x).toBe(70);
    });

    it('should account for alignTo originY when calculating bottom edge', function ()
    {
        alignTo.originY = 0.5;

        LeftBottom(gameObject, alignTo);

        // GetBottom(alignTo) = (100 + 50) - (50 * 0.5) = 150 - 25 = 125
        // SetBottom(gameObject, 125) => gameObject.y = 125 - 60 = 65
        expect(gameObject.y).toBe(65);
    });

    it('should work when gameObject is larger than alignTo', function ()
    {
        gameObject.width = 200;
        gameObject.height = 150;

        LeftBottom(gameObject, alignTo);

        // GetLeft(alignTo) = 200, SetRight(gameObject, 200) => gameObject.x = 200 - 200 = 0
        // GetBottom(alignTo) = 150, SetBottom(gameObject, 150) => gameObject.y = 150 - 150 = 0
        expect(gameObject.x).toBe(0);
        expect(gameObject.y).toBe(0);
    });

    it('should work with zero-sized gameObject', function ()
    {
        gameObject.width = 0;
        gameObject.height = 0;

        LeftBottom(gameObject, alignTo);

        // SetRight(gameObject, 200) => gameObject.x = 200 - 0 + 0 = 200
        // SetBottom(gameObject, 150) => gameObject.y = 150 - 0 + 0 = 150
        expect(gameObject.x).toBe(200);
        expect(gameObject.y).toBe(150);
    });

    it('should work with negative coordinates', function ()
    {
        alignTo.x = -100;
        alignTo.y = -50;

        LeftBottom(gameObject, alignTo);

        // GetLeft(alignTo) = -100 - 0 = -100
        // SetRight(gameObject, -100) => gameObject.x = -100 - 80 = -180
        // GetBottom(alignTo) = (-50 + 50) - 0 = 0
        // SetBottom(gameObject, 0) => gameObject.y = 0 - 60 = -60
        expect(gameObject.x).toBe(-180);
        expect(gameObject.y).toBe(-60);
    });

    it('should work with floating point dimensions', function ()
    {
        gameObject.width = 50.5;
        gameObject.height = 30.5;
        alignTo.x = 100.5;
        alignTo.y = 50.5;
        alignTo.width = 60.5;
        alignTo.height = 40.5;

        LeftBottom(gameObject, alignTo);

        // GetLeft(alignTo) = 100.5 - 0 = 100.5
        // SetRight(gameObject, 100.5) => gameObject.x = 100.5 - 50.5 = 50
        // GetBottom(alignTo) = (50.5 + 40.5) - 0 = 91
        // SetBottom(gameObject, 91) => gameObject.y = 91 - 30.5 = 60.5
        expect(gameObject.x).toBeCloseTo(50, 5);
        expect(gameObject.y).toBeCloseTo(60.5, 5);
    });

    it('should position gameObject so its right edge equals alignTo left edge', function ()
    {
        LeftBottom(gameObject, alignTo);

        var alignToLeft = GetLeft(alignTo);
        var gameObjectRight = gameObject.x + gameObject.width - (gameObject.width * gameObject.originX);

        expect(gameObjectRight).toBeCloseTo(alignToLeft, 5);
    });

    it('should position gameObject so its bottom edge equals alignTo bottom edge', function ()
    {
        LeftBottom(gameObject, alignTo);

        var alignToBottom = GetBottom(alignTo);
        var gameObjectBottom = (gameObject.y + gameObject.height) - (gameObject.height * gameObject.originY);

        expect(gameObjectBottom).toBeCloseTo(alignToBottom, 5);
    });

    it('should not mutate the alignTo object', function ()
    {
        var originalX = alignTo.x;
        var originalY = alignTo.y;

        LeftBottom(gameObject, alignTo);

        expect(alignTo.x).toBe(originalX);
        expect(alignTo.y).toBe(originalY);
    });
});
