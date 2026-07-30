var BottomRight = require('../../../../src/display/align/to/BottomRight');

describe('Phaser.Display.Align.To.BottomRight', function ()
{
    var gameObject;
    var alignTo;

    beforeEach(function ()
    {
        gameObject = { x: 0, y: 0, width: 30, height: 30, originX: 0, originY: 0 };
        alignTo = { x: 100, y: 100, width: 50, height: 50, originX: 0, originY: 0 };
    });

    it('should return the gameObject', function ()
    {
        var result = BottomRight(gameObject, alignTo);

        expect(result).toBe(gameObject);
    });

    it('should align gameObject below and flush with the right edge of alignTo (origin 0,0)', function ()
    {
        // GetRight(alignTo) = (100+50) - (50*0) = 150
        // GetBottom(alignTo) = (100+50) - (50*0) = 150
        // SetRight: gameObject.x = (150 - 30) + (30*0) = 120
        // SetTop:   gameObject.y = 150 + (30*0) = 150
        BottomRight(gameObject, alignTo);

        expect(gameObject.x).toBe(120);
        expect(gameObject.y).toBe(150);
    });

    it('should default offsetX and offsetY to zero when not provided', function ()
    {
        var withDefaults = { x: 0, y: 0, width: 30, height: 30, originX: 0, originY: 0 };
        var withExplicit = { x: 0, y: 0, width: 30, height: 30, originX: 0, originY: 0 };

        BottomRight(withDefaults, alignTo);
        BottomRight(withExplicit, alignTo, 0, 0);

        expect(withDefaults.x).toBe(withExplicit.x);
        expect(withDefaults.y).toBe(withExplicit.y);
    });

    it('should apply positive offsetX to shift gameObject right', function ()
    {
        // GetRight(alignTo) + 10 = 160
        // SetRight: x = (160 - 30) + 0 = 130
        BottomRight(gameObject, alignTo, 10, 0);

        expect(gameObject.x).toBe(130);
        expect(gameObject.y).toBe(150);
    });

    it('should apply positive offsetY to shift gameObject down', function ()
    {
        // GetBottom(alignTo) + 20 = 170
        // SetTop: y = 170 + 0 = 170
        BottomRight(gameObject, alignTo, 0, 20);

        expect(gameObject.x).toBe(120);
        expect(gameObject.y).toBe(170);
    });

    it('should apply both positive offsetX and offsetY', function ()
    {
        BottomRight(gameObject, alignTo, 10, 20);

        expect(gameObject.x).toBe(130);
        expect(gameObject.y).toBe(170);
    });

    it('should apply negative offsetX to shift gameObject left', function ()
    {
        // GetRight(alignTo) - 5 = 145
        // SetRight: x = (145 - 30) + 0 = 115
        BottomRight(gameObject, alignTo, -5, 0);

        expect(gameObject.x).toBe(115);
        expect(gameObject.y).toBe(150);
    });

    it('should apply negative offsetY to shift gameObject up', function ()
    {
        // GetBottom(alignTo) - 10 = 140
        // SetTop: y = 140 + 0 = 140
        BottomRight(gameObject, alignTo, 0, -10);

        expect(gameObject.x).toBe(120);
        expect(gameObject.y).toBe(140);
    });

    it('should correctly align when alignTo has origin (0.5, 0.5)', function ()
    {
        alignTo.originX = 0.5;
        alignTo.originY = 0.5;

        // GetRight(alignTo) = (100+50) - (50*0.5) = 150 - 25 = 125
        // GetBottom(alignTo) = (100+50) - (50*0.5) = 150 - 25 = 125
        // SetRight: x = (125 - 30) + (30*0) = 95
        // SetTop:   y = 125 + (30*0) = 125
        BottomRight(gameObject, alignTo);

        expect(gameObject.x).toBe(95);
        expect(gameObject.y).toBe(125);
    });

    it('should correctly align when gameObject has origin (0.5, 0.5)', function ()
    {
        gameObject.originX = 0.5;
        gameObject.originY = 0.5;

        // GetRight(alignTo) = 150, GetBottom(alignTo) = 150
        // SetRight: x = (150 - 30) + (30*0.5) = 120 + 15 = 135
        // SetTop:   y = 150 + (30*0.5) = 150 + 15 = 165
        BottomRight(gameObject, alignTo);

        expect(gameObject.x).toBe(135);
        expect(gameObject.y).toBe(165);
    });

    it('should correctly align when both objects have origin (0.5, 0.5)', function ()
    {
        alignTo.originX = 0.5;
        alignTo.originY = 0.5;
        gameObject.originX = 0.5;
        gameObject.originY = 0.5;

        // GetRight(alignTo) = (100+50) - (50*0.5) = 125
        // GetBottom(alignTo) = (100+50) - (50*0.5) = 125
        // SetRight: x = (125 - 30) + (30*0.5) = 95 + 15 = 110
        // SetTop:   y = 125 + (30*0.5) = 125 + 15 = 140
        BottomRight(gameObject, alignTo);

        expect(gameObject.x).toBe(110);
        expect(gameObject.y).toBe(140);
    });

    it('should align when alignTo is at origin (0, 0)', function ()
    {
        alignTo.x = 0;
        alignTo.y = 0;

        // GetRight(alignTo) = (0+50) - 0 = 50
        // GetBottom(alignTo) = (0+50) - 0 = 50
        // SetRight: x = (50 - 30) + 0 = 20
        // SetTop:   y = 50 + 0 = 50
        BottomRight(gameObject, alignTo);

        expect(gameObject.x).toBe(20);
        expect(gameObject.y).toBe(50);
    });

    it('should align when alignTo has negative coordinates', function ()
    {
        alignTo.x = -200;
        alignTo.y = -150;

        // GetRight(alignTo) = (-200+50) - 0 = -150
        // GetBottom(alignTo) = (-150+50) - 0 = -100
        // SetRight: x = (-150 - 30) + 0 = -180
        // SetTop:   y = -100 + 0 = -100
        BottomRight(gameObject, alignTo);

        expect(gameObject.x).toBe(-180);
        expect(gameObject.y).toBe(-100);
    });

    it('should set gameObject right edge equal to alignTo right edge (no offset)', function ()
    {
        BottomRight(gameObject, alignTo);

        // GetRight(gameObject) = (x + width) - (width * originX)
        var rightOfGameObject = (gameObject.x + gameObject.width) - (gameObject.width * gameObject.originX);
        var rightOfAlignTo = (alignTo.x + alignTo.width) - (alignTo.width * alignTo.originX);

        expect(rightOfGameObject).toBe(rightOfAlignTo);
    });

    it('should set gameObject top edge equal to alignTo bottom edge (no offset)', function ()
    {
        BottomRight(gameObject, alignTo);

        // GetTop(gameObject) = y - (height * originY)
        var topOfGameObject = gameObject.y - (gameObject.height * gameObject.originY);
        // GetBottom(alignTo) = (y + height) - (height * originY)
        var bottomOfAlignTo = (alignTo.y + alignTo.height) - (alignTo.height * alignTo.originY);

        expect(topOfGameObject).toBe(bottomOfAlignTo);
    });

    it('should handle floating point positions', function ()
    {
        alignTo.x = 10.5;
        alignTo.y = 20.7;
        alignTo.width = 40.2;
        alignTo.height = 30.4;

        // GetRight(alignTo) = (10.5+40.2) - 0 = 50.7
        // GetBottom(alignTo) = (20.7+30.4) - 0 = 51.1
        // SetRight: x = (50.7 - 30) + 0 = 20.7
        // SetTop:   y = 51.1 + 0 = 51.1
        BottomRight(gameObject, alignTo);

        expect(gameObject.x).toBeCloseTo(20.7, 5);
        expect(gameObject.y).toBeCloseTo(51.1, 5);
    });

    it('should handle floating point offsets', function ()
    {
        BottomRight(gameObject, alignTo, 1.5, 2.5);

        // GetRight(alignTo) + 1.5 = 151.5 → x = 151.5 - 30 = 121.5
        // GetBottom(alignTo) + 2.5 = 152.5 → y = 152.5
        expect(gameObject.x).toBeCloseTo(121.5, 5);
        expect(gameObject.y).toBeCloseTo(152.5, 5);
    });

    it('should only modify x and y of gameObject, not width, height, or origin', function ()
    {
        BottomRight(gameObject, alignTo);

        expect(gameObject.width).toBe(30);
        expect(gameObject.height).toBe(30);
        expect(gameObject.originX).toBe(0);
        expect(gameObject.originY).toBe(0);
    });

    it('should not modify any properties of alignTo', function ()
    {
        var originalX = alignTo.x;
        var originalY = alignTo.y;
        var originalWidth = alignTo.width;
        var originalHeight = alignTo.height;

        BottomRight(gameObject, alignTo);

        expect(alignTo.x).toBe(originalX);
        expect(alignTo.y).toBe(originalY);
        expect(alignTo.width).toBe(originalWidth);
        expect(alignTo.height).toBe(originalHeight);
    });
});
