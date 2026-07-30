var TopLeft = require('../../../../src/display/align/to/TopLeft');

describe('Phaser.Display.Align.To.TopLeft', function ()
{
    var gameObject;
    var alignTo;

    beforeEach(function ()
    {
        // gameObject: 50x30, origin (0.5, 0.5), positioned at (100, 100)
        gameObject = { x: 100, y: 100, width: 50, height: 30, originX: 0.5, originY: 0.5 };

        // alignTo: 80x40, origin (0.5, 0.5), positioned at (200, 200)
        // GetLeft(alignTo) = 200 - (80 * 0.5) = 160
        // GetTop(alignTo)  = 200 - (40 * 0.5) = 180
        alignTo = { x: 200, y: 200, width: 80, height: 40, originX: 0.5, originY: 0.5 };
    });

    it('should return the gameObject', function ()
    {
        var result = TopLeft(gameObject, alignTo);

        expect(result).toBe(gameObject);
    });

    it('should align the left edge of gameObject with the left edge of alignTo', function ()
    {
        // GetLeft(alignTo) = 200 - (80 * 0.5) = 160
        // SetLeft sets: gameObject.x = 160 + (50 * 0.5) = 185
        TopLeft(gameObject, alignTo);

        expect(gameObject.x).toBe(185);
    });

    it('should place the bottom of gameObject flush with the top of alignTo', function ()
    {
        // GetTop(alignTo) = 200 - (40 * 0.5) = 180
        // SetBottom sets: gameObject.y = (180 - 30) + (30 * 0.5) = 150 + 15 = 165
        TopLeft(gameObject, alignTo);

        expect(gameObject.y).toBe(165);
    });

    it('should default offsetX and offsetY to 0 when not provided', function ()
    {
        var resultNoOffset = TopLeft({ x: 0, y: 0, width: 50, height: 30, originX: 0.5, originY: 0.5 }, alignTo);
        var resultZeroOffset = TopLeft({ x: 0, y: 0, width: 50, height: 30, originX: 0.5, originY: 0.5 }, alignTo, 0, 0);

        expect(resultNoOffset.x).toBe(resultZeroOffset.x);
        expect(resultNoOffset.y).toBe(resultZeroOffset.y);
    });

    it('should apply a positive offsetX by shifting gameObject left', function ()
    {
        // GetLeft(alignTo) = 160; offsetX = 10
        // SetLeft: gameObject.x = (160 - 10) + (50 * 0.5) = 150 + 25 = 175
        TopLeft(gameObject, alignTo, 10, 0);

        expect(gameObject.x).toBe(175);
    });

    it('should apply a positive offsetY by shifting gameObject upward', function ()
    {
        // GetTop(alignTo) = 180; offsetY = 20
        // SetBottom: gameObject.y = ((180 - 20) - 30) + (30 * 0.5) = 130 + 15 = 145
        TopLeft(gameObject, alignTo, 0, 20);

        expect(gameObject.y).toBe(145);
    });

    it('should apply a negative offsetX by shifting gameObject right', function ()
    {
        // SetLeft: gameObject.x = (160 - (-10)) + 25 = 170 + 25 = 195
        TopLeft(gameObject, alignTo, -10, 0);

        expect(gameObject.x).toBe(195);
    });

    it('should apply a negative offsetY by shifting gameObject downward', function ()
    {
        // SetBottom: gameObject.y = ((180 - (-20)) - 30) + 15 = 170 + 15 = 185
        TopLeft(gameObject, alignTo, 0, -20);

        expect(gameObject.y).toBe(185);
    });

    it('should apply both offsetX and offsetY together', function ()
    {
        // GetLeft(alignTo) = 160, offsetX = 5 => SetLeft value = 155
        // gameObject.x = 155 + 25 = 180
        // GetTop(alignTo) = 180, offsetY = 10 => SetBottom value = 170
        // gameObject.y = (170 - 30) + 15 = 155
        TopLeft(gameObject, alignTo, 5, 10);

        expect(gameObject.x).toBe(180);
        expect(gameObject.y).toBe(155);
    });

    it('should work when gameObject has zero origin', function ()
    {
        gameObject.originX = 0;
        gameObject.originY = 0;

        // GetLeft(alignTo) = 160; SetLeft: gameObject.x = 160 + 0 = 160
        // GetTop(alignTo)  = 180; SetBottom: gameObject.y = (180 - 30) + 0 = 150
        TopLeft(gameObject, alignTo);

        expect(gameObject.x).toBe(160);
        expect(gameObject.y).toBe(150);
    });

    it('should work when gameObject has origin of 1', function ()
    {
        gameObject.originX = 1;
        gameObject.originY = 1;

        // SetLeft: gameObject.x = 160 + (50 * 1) = 210
        // SetBottom: gameObject.y = (180 - 30) + (30 * 1) = 180
        TopLeft(gameObject, alignTo);

        expect(gameObject.x).toBe(210);
        expect(gameObject.y).toBe(180);
    });

    it('should work when alignTo has zero-size bounds', function ()
    {
        alignTo = { x: 100, y: 100, width: 0, height: 0, originX: 0.5, originY: 0.5 };

        // GetLeft(alignTo) = 100; SetLeft: gameObject.x = 100 + 25 = 125
        // GetTop(alignTo)  = 100; SetBottom: gameObject.y = (100 - 30) + 15 = 85
        TopLeft(gameObject, alignTo);

        expect(gameObject.x).toBe(125);
        expect(gameObject.y).toBe(85);
    });

    it('should work with floating point dimensions and origins', function ()
    {
        gameObject = { x: 0, y: 0, width: 10, height: 10, originX: 0.3, originY: 0.7 };
        alignTo = { x: 50, y: 50, width: 20, height: 20, originX: 0.25, originY: 0.75 };

        // GetLeft(alignTo) = 50 - (20 * 0.25) = 50 - 5 = 45
        // SetLeft: gameObject.x = 45 + (10 * 0.3) = 45 + 3 = 48
        // GetTop(alignTo)  = 50 - (20 * 0.75) = 50 - 15 = 35
        // SetBottom: gameObject.y = (35 - 10) + (10 * 0.7) = 25 + 7 = 32
        TopLeft(gameObject, alignTo);

        expect(gameObject.x).toBeCloseTo(48);
        expect(gameObject.y).toBeCloseTo(32);
    });

    it('should work with negative coordinates', function ()
    {
        alignTo = { x: -50, y: -50, width: 80, height: 40, originX: 0.5, originY: 0.5 };

        // GetLeft(alignTo) = -50 - 40 = -90
        // SetLeft: gameObject.x = -90 + 25 = -65
        // GetTop(alignTo)  = -50 - 20 = -70
        // SetBottom: gameObject.y = (-70 - 30) + 15 = -85
        TopLeft(gameObject, alignTo);

        expect(gameObject.x).toBe(-65);
        expect(gameObject.y).toBe(-85);
    });
});
