var BottomLeft = require('../../../../src/display/align/to/BottomLeft');

describe('Phaser.Display.Align.To.BottomLeft', function ()
{
    function makeObject(x, y, width, height, originX, originY)
    {
        return { x: x, y: y, width: width, height: height, originX: originX, originY: originY };
    }

    it('should return the game object', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 50, 200, 100, 0, 0);

        var result = BottomLeft(gameObject, alignTo);

        expect(result).toBe(gameObject);
    });

    it('should place gameObject directly below alignTo with left edges aligned (zero origin)', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 50, 200, 100, 0, 0);

        // GetLeft(alignTo)   = 100 - (200 * 0) = 100
        // GetBottom(alignTo) = (50 + 100) - (100 * 0) = 150
        // SetLeft => gameObject.x = 100 + (50 * 0) = 100
        // SetTop  => gameObject.y = 150 + (50 * 0) = 150
        BottomLeft(gameObject, alignTo);

        expect(gameObject.x).toBe(100);
        expect(gameObject.y).toBe(150);
    });

    it('should account for alignTo origin when computing left and bottom', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 50, 200, 100, 0.5, 0.5);

        // GetLeft(alignTo)   = 100 - (200 * 0.5) = 0
        // GetBottom(alignTo) = (50 + 100) - (100 * 0.5) = 100
        // SetLeft => gameObject.x = 0 + (50 * 0) = 0
        // SetTop  => gameObject.y = 100 + (50 * 0) = 100
        BottomLeft(gameObject, alignTo);

        expect(gameObject.x).toBe(0);
        expect(gameObject.y).toBe(100);
    });

    it('should account for gameObject origin when setting position', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignTo = makeObject(100, 50, 200, 100, 0, 0);

        // GetLeft(alignTo)   = 100 - (200 * 0) = 100
        // GetBottom(alignTo) = (50 + 100) - (100 * 0) = 150
        // SetLeft => gameObject.x = 100 + (50 * 0.5) = 125
        // SetTop  => gameObject.y = 150 + (50 * 0.5) = 175
        BottomLeft(gameObject, alignTo);

        expect(gameObject.x).toBe(125);
        expect(gameObject.y).toBe(175);
    });

    it('should apply offsetX to shift left edge', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 50, 200, 100, 0, 0);

        // GetLeft(alignTo) = 100, offsetX=20
        // SetLeft => gameObject.x = (100 - 20) + 0 = 80
        // GetBottom(alignTo) = 150, offsetY=0
        // SetTop  => gameObject.y = 150 + 0 = 150
        BottomLeft(gameObject, alignTo, 20, 0);

        expect(gameObject.x).toBe(80);
        expect(gameObject.y).toBe(150);
    });

    it('should apply offsetY to shift top edge', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 50, 200, 100, 0, 0);

        // GetLeft(alignTo) = 100, offsetX=0
        // SetLeft => gameObject.x = 100
        // GetBottom(alignTo) = 150, offsetY=30
        // SetTop  => gameObject.y = 180
        BottomLeft(gameObject, alignTo, 0, 30);

        expect(gameObject.x).toBe(100);
        expect(gameObject.y).toBe(180);
    });

    it('should apply both offsetX and offsetY together', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 50, 200, 100, 0, 0);

        // GetLeft(alignTo) = 100, offsetX=10
        // SetLeft => gameObject.x = 90
        // GetBottom(alignTo) = 150, offsetY=20
        // SetTop  => gameObject.y = 170
        BottomLeft(gameObject, alignTo, 10, 20);

        expect(gameObject.x).toBe(90);
        expect(gameObject.y).toBe(170);
    });

    it('should default offsetX and offsetY to zero when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 50, 200, 100, 0, 0);

        var withOffsets = makeObject(0, 0, 50, 50, 0, 0);
        var withoutOffsets = makeObject(0, 0, 50, 50, 0, 0);

        BottomLeft(withOffsets, alignTo, 0, 0);
        BottomLeft(withoutOffsets, alignTo);

        expect(withoutOffsets.x).toBe(withOffsets.x);
        expect(withoutOffsets.y).toBe(withOffsets.y);
    });

    it('should work with negative offsetX', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 50, 200, 100, 0, 0);

        // GetLeft(alignTo) = 100, offsetX=-15
        // SetLeft => gameObject.x = (100 - (-15)) + 0 = 115
        BottomLeft(gameObject, alignTo, -15, 0);

        expect(gameObject.x).toBe(115);
    });

    it('should work with negative offsetY', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 50, 200, 100, 0, 0);

        // GetBottom(alignTo) = 150, offsetY=-10
        // SetTop => gameObject.y = 140
        BottomLeft(gameObject, alignTo, 0, -10);

        expect(gameObject.y).toBe(140);
    });

    it('should work when alignTo is at origin (0, 0)', function ()
    {
        var gameObject = makeObject(0, 0, 32, 32, 0, 0);
        var alignTo = makeObject(0, 0, 64, 64, 0, 0);

        // GetLeft(alignTo)   = 0 - (64 * 0) = 0
        // GetBottom(alignTo) = (0 + 64) - (64 * 0) = 64
        // SetLeft => gameObject.x = 0 + 0 = 0
        // SetTop  => gameObject.y = 64 + 0 = 64
        BottomLeft(gameObject, alignTo);

        expect(gameObject.x).toBe(0);
        expect(gameObject.y).toBe(64);
    });

    it('should work with negative alignTo coordinates', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(-100, -80, 200, 100, 0, 0);

        // GetLeft(alignTo)   = -100 - (200 * 0) = -100
        // GetBottom(alignTo) = (-80 + 100) - (100 * 0) = 20
        // SetLeft => gameObject.x = -100 + 0 = -100
        // SetTop  => gameObject.y = 20 + 0 = 20
        BottomLeft(gameObject, alignTo);

        expect(gameObject.x).toBe(-100);
        expect(gameObject.y).toBe(20);
    });

    it('should work with floating point positions', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(10.5, 20.5, 100, 80, 0, 0);

        // GetLeft(alignTo)   = 10.5
        // GetBottom(alignTo) = (20.5 + 80) - 0 = 100.5
        // SetLeft => gameObject.x = 10.5
        // SetTop  => gameObject.y = 100.5
        BottomLeft(gameObject, alignTo);

        expect(gameObject.x).toBeCloseTo(10.5);
        expect(gameObject.y).toBeCloseTo(100.5);
    });

    it('should work with full origin (1, 1) on alignTo', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(200, 100, 200, 100, 1, 1);

        // GetLeft(alignTo)   = 200 - (200 * 1) = 0
        // GetBottom(alignTo) = (100 + 100) - (100 * 1) = 100
        // SetLeft => gameObject.x = 0
        // SetTop  => gameObject.y = 100
        BottomLeft(gameObject, alignTo);

        expect(gameObject.x).toBe(0);
        expect(gameObject.y).toBe(100);
    });

    it('should only modify x and y on the gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignTo = makeObject(100, 50, 200, 100, 0, 0);

        BottomLeft(gameObject, alignTo);

        expect(gameObject.width).toBe(50);
        expect(gameObject.height).toBe(50);
        expect(gameObject.originX).toBe(0.5);
        expect(gameObject.originY).toBe(0.5);
    });

    it('should not modify the alignTo object', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 50, 200, 100, 0, 0);

        BottomLeft(gameObject, alignTo);

        expect(alignTo.x).toBe(100);
        expect(alignTo.y).toBe(50);
        expect(alignTo.width).toBe(200);
        expect(alignTo.height).toBe(100);
    });
});
