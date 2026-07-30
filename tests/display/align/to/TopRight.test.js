var TopRight = require('../../../../src/display/align/to/TopRight');

describe('Phaser.Display.Align.To.TopRight', function ()
{
    // Helper: create a mock game object with origin at top-left (0,0)
    function makeObject (x, y, width, height, originX, originY)
    {
        return {
            x: x === undefined ? 0 : x,
            y: y === undefined ? 0 : y,
            width: width === undefined ? 100 : width,
            height: height === undefined ? 100 : height,
            originX: originX === undefined ? 0 : originX,
            originY: originY === undefined ? 0 : originY
        };
    }

    it('should return the gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignTo = makeObject(200, 200, 100, 100);
        var result = TopRight(gameObject, alignTo);
        expect(result).toBe(gameObject);
    });

    it('should align right edges when both objects have zero origin', function ()
    {
        // alignTo: x=200, width=100, originX=0 => right = 200+100 - 100*0 = 300
        // gameObject should have right edge at 300
        // SetRight: x = (300 - 50) + 50*0 = 250
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(200, 200, 100, 100, 0, 0);
        TopRight(gameObject, alignTo);
        expect(gameObject.x).toBe(250);
    });

    it('should position gameObject bottom at alignTo top when both have zero origin', function ()
    {
        // alignTo: y=200, height=100, originY=0 => top = 200 - 100*0 = 200
        // SetBottom: y = (200 - 50) + 50*0 = 150
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(200, 200, 100, 100, 0, 0);
        TopRight(gameObject, alignTo);
        expect(gameObject.y).toBe(150);
    });

    it('should apply horizontal offsetX to x position', function ()
    {
        // right of alignTo = 300, offsetX = 20 => SetRight(gameObject, 320)
        // x = (320 - 50) + 0 = 270
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(200, 200, 100, 100, 0, 0);
        TopRight(gameObject, alignTo, 20);
        expect(gameObject.x).toBe(270);
    });

    it('should apply vertical offsetY to y position', function ()
    {
        // top of alignTo = 200, offsetY = 10 => SetBottom(gameObject, 190)
        // y = (190 - 50) + 0 = 140
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(200, 200, 100, 100, 0, 0);
        TopRight(gameObject, alignTo, 0, 10);
        expect(gameObject.y).toBe(140);
    });

    it('should apply both offsetX and offsetY together', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(200, 200, 100, 100, 0, 0);
        TopRight(gameObject, alignTo, 15, 25);
        // right = 300 + 15 = 315 => x = 315 - 50 = 265
        // top = 200, bottom target = 200 - 25 = 175 => y = 175 - 50 = 125
        expect(gameObject.x).toBe(265);
        expect(gameObject.y).toBe(125);
    });

    it('should default offsetX and offsetY to zero when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(200, 200, 100, 100, 0, 0);
        TopRight(gameObject, alignTo);
        expect(gameObject.x).toBe(250);
        expect(gameObject.y).toBe(150);
    });

    it('should handle objects with centered origin (0.5, 0.5)', function ()
    {
        // alignTo: x=200, y=200, width=100, height=100, originX=0.5, originY=0.5
        // GetRight(alignTo) = 200 + 100 - 100*0.5 = 250
        // GetTop(alignTo) = 200 - 100*0.5 = 150
        // gameObject: width=50, height=50, originX=0.5, originY=0.5
        // SetRight: x = (250 - 50) + 50*0.5 = 200 + 25 = 225
        // SetBottom: y = (150 - 50) + 50*0.5 = 100 + 25 = 125
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 100, 100, 0.5, 0.5);
        TopRight(gameObject, alignTo);
        expect(gameObject.x).toBe(225);
        expect(gameObject.y).toBe(125);
    });

    it('should handle negative offsetX (shift left)', function ()
    {
        // right = 300, offsetX = -10 => SetRight(gameObject, 290)
        // x = 290 - 50 = 240
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(200, 200, 100, 100, 0, 0);
        TopRight(gameObject, alignTo, -10, 0);
        expect(gameObject.x).toBe(240);
    });

    it('should handle negative offsetY (shift down)', function ()
    {
        // top = 200, offsetY = -10 => SetBottom(gameObject, 210)
        // y = 210 - 50 = 160
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(200, 200, 100, 100, 0, 0);
        TopRight(gameObject, alignTo, 0, -10);
        expect(gameObject.y).toBe(160);
    });

    it('should handle alignTo at origin (0, 0)', function ()
    {
        // alignTo: x=0, y=0, width=100, height=100, origin=0
        // GetRight = 0+100 - 100*0 = 100
        // GetTop = 0 - 100*0 = 0
        // SetRight: x = (100 - 50) + 0 = 50
        // SetBottom: y = (0 - 50) + 0 = -50
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(0, 0, 100, 100, 0, 0);
        TopRight(gameObject, alignTo);
        expect(gameObject.x).toBe(50);
        expect(gameObject.y).toBe(-50);
    });

    it('should handle negative alignTo position', function ()
    {
        // alignTo: x=-200, y=-200, width=100, height=100, origin=0
        // GetRight = -200 + 100 - 0 = -100
        // GetTop = -200 - 0 = -200
        // SetRight(gameObject, -100): x = (-100 - 50) + 0 = -150
        // SetBottom(gameObject, -200): y = (-200 - 50) + 0 = -250
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(-200, -200, 100, 100, 0, 0);
        TopRight(gameObject, alignTo);
        expect(gameObject.x).toBe(-150);
        expect(gameObject.y).toBe(-250);
    });

    it('should handle floating point positions and sizes', function ()
    {
        // alignTo: x=10.5, y=20.5, width=30.5, height=40.5, origin=0
        // GetRight = 10.5 + 30.5 = 41
        // GetTop = 20.5
        // gameObject: width=15.5, height=25.5, origin=0
        // SetRight: x = (41 - 15.5) + 0 = 25.5
        // SetBottom: y = (20.5 - 25.5) + 0 = -5
        var gameObject = makeObject(0, 0, 15.5, 25.5, 0, 0);
        var alignTo = makeObject(10.5, 20.5, 30.5, 40.5, 0, 0);
        TopRight(gameObject, alignTo);
        expect(gameObject.x).toBeCloseTo(25.5);
        expect(gameObject.y).toBeCloseTo(-5);
    });

    it('should handle zero-size gameObject', function ()
    {
        // gameObject: width=0, height=0, origin=0
        // SetRight: x = right_of_alignTo - 0 + 0 = 300
        // SetBottom: y = top_of_alignTo - 0 + 0 = 200
        var gameObject = makeObject(0, 0, 0, 0, 0, 0);
        var alignTo = makeObject(200, 200, 100, 100, 0, 0);
        TopRight(gameObject, alignTo);
        expect(gameObject.x).toBe(300);
        expect(gameObject.y).toBe(200);
    });

    it('should not modify the alignTo object', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(200, 200, 100, 100, 0, 0);
        TopRight(gameObject, alignTo);
        expect(alignTo.x).toBe(200);
        expect(alignTo.y).toBe(200);
        expect(alignTo.width).toBe(100);
        expect(alignTo.height).toBe(100);
    });
});
