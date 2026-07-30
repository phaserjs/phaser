var RightCenter = require('../../../../src/display/align/to/RightCenter');

describe('Phaser.Display.Align.To.RightCenter', function ()
{
    function makeObject(x, y, width, height, originX, originY)
    {
        return { x: x, y: y, width: width, height: height, originX: originX, originY: originY };
    }

    // With origin (0,0):
    //   GetRight(alignTo)  = alignTo.x + alignTo.width
    //   GetCenterY(alignTo) = alignTo.y + alignTo.height * 0.5
    //   SetLeft(go, v)     => go.x = v
    //   SetCenterY(go, v)  => go.y = v - go.height * 0.5

    it('should return the game object', function ()
    {
        var gameObject = makeObject(0, 0, 100, 50, 0, 0);
        var alignTo = makeObject(50, 100, 200, 80, 0, 0);

        var result = RightCenter(gameObject, alignTo);

        expect(result).toBe(gameObject);
    });

    it('should align the left edge of gameObject to the right edge of alignTo', function ()
    {
        var gameObject = makeObject(0, 0, 100, 50, 0, 0);
        var alignTo = makeObject(50, 100, 200, 80, 0, 0);

        // GetRight(alignTo) = 50 + 200 = 250
        // SetLeft(gameObject, 250) => gameObject.x = 250 + 100*0 = 250
        RightCenter(gameObject, alignTo);

        expect(gameObject.x).toBe(250);
    });

    it('should vertically center gameObject to alignTo', function ()
    {
        var gameObject = makeObject(0, 0, 100, 50, 0, 0);
        var alignTo = makeObject(50, 100, 200, 80, 0, 0);

        // GetCenterY(alignTo) = 100 - 80*0 + 80*0.5 = 140
        // SetCenterY(gameObject, 140) => go.y = (140 + 50*0) - 50*0.5 = 140 - 25 = 115
        RightCenter(gameObject, alignTo);

        expect(gameObject.y).toBe(115);
    });

    it('should default offsetX and offsetY to zero', function ()
    {
        var gameObject = makeObject(0, 0, 100, 50, 0, 0);
        var alignTo = makeObject(0, 0, 200, 80, 0, 0);

        var withDefaults = makeObject(0, 0, 100, 50, 0, 0);
        var withExplicit = makeObject(0, 0, 100, 50, 0, 0);

        RightCenter(withDefaults, alignTo);
        RightCenter(withExplicit, alignTo, 0, 0);

        expect(withDefaults.x).toBe(withExplicit.x);
        expect(withDefaults.y).toBe(withExplicit.y);
    });

    it('should apply a positive offsetX to the horizontal position', function ()
    {
        var gameObject = makeObject(0, 0, 100, 50, 0, 0);
        var alignTo = makeObject(50, 100, 200, 80, 0, 0);

        // GetRight(alignTo) = 250, offsetX = 20
        // SetLeft(gameObject, 270) => gameObject.x = 270
        RightCenter(gameObject, alignTo, 20, 0);

        expect(gameObject.x).toBe(270);
    });

    it('should apply a negative offsetX to the horizontal position', function ()
    {
        var gameObject = makeObject(0, 0, 100, 50, 0, 0);
        var alignTo = makeObject(50, 100, 200, 80, 0, 0);

        // GetRight(alignTo) = 250, offsetX = -30
        // SetLeft(gameObject, 220) => gameObject.x = 220
        RightCenter(gameObject, alignTo, -30, 0);

        expect(gameObject.x).toBe(220);
    });

    it('should apply a positive offsetY to the vertical position', function ()
    {
        var gameObject = makeObject(0, 0, 100, 50, 0, 0);
        var alignTo = makeObject(50, 100, 200, 80, 0, 0);

        // GetCenterY(alignTo) = 140, offsetY = 15
        // SetCenterY(gameObject, 155) => go.y = (155 + 0) - 25 = 130
        RightCenter(gameObject, alignTo, 0, 15);

        expect(gameObject.y).toBe(130);
    });

    it('should apply a negative offsetY to the vertical position', function ()
    {
        var gameObject = makeObject(0, 0, 100, 50, 0, 0);
        var alignTo = makeObject(50, 100, 200, 80, 0, 0);

        // GetCenterY(alignTo) = 140, offsetY = -10
        // SetCenterY(gameObject, 130) => go.y = (130 + 0) - 25 = 105
        RightCenter(gameObject, alignTo, 0, -10);

        expect(gameObject.y).toBe(105);
    });

    it('should apply both offsetX and offsetY together', function ()
    {
        var gameObject = makeObject(0, 0, 100, 50, 0, 0);
        var alignTo = makeObject(50, 100, 200, 80, 0, 0);

        RightCenter(gameObject, alignTo, 10, 20);

        expect(gameObject.x).toBe(260);
        expect(gameObject.y).toBe(135);
    });

    it('should handle non-zero originX on gameObject', function ()
    {
        // originX = 0.5 means SetLeft adds width * 0.5 to x
        var gameObject = makeObject(0, 0, 100, 50, 0.5, 0);
        var alignTo = makeObject(0, 0, 200, 80, 0, 0);

        // GetRight(alignTo) = 200
        // SetLeft(gameObject, 200) => gameObject.x = 200 + 100*0.5 = 250
        RightCenter(gameObject, alignTo);

        expect(gameObject.x).toBe(250);
    });

    it('should handle non-zero originX on alignTo', function ()
    {
        // originX = 0.5 means GetRight = x + width - width * 0.5 = x + width * 0.5
        var gameObject = makeObject(0, 0, 100, 50, 0, 0);
        var alignTo = makeObject(100, 0, 200, 80, 0.5, 0);

        // GetRight(alignTo) = 100 + 200 - 200*0.5 = 200
        // SetLeft(gameObject, 200) => gameObject.x = 200
        RightCenter(gameObject, alignTo);

        expect(gameObject.x).toBe(200);
    });

    it('should handle non-zero originY on gameObject', function ()
    {
        // originY = 0.5: SetCenterY offsetY = height * 0.5
        // go.y = (centerY + height*0.5) - height*0.5 = centerY
        var gameObject = makeObject(0, 0, 100, 50, 0, 0.5);
        var alignTo = makeObject(0, 100, 200, 80, 0, 0);

        // GetCenterY(alignTo) = 100 + 80*0.5 = 140
        // SetCenterY(gameObject, 140): offsetY = 50*0.5 = 25; go.y = (140 + 25) - 25 = 140
        RightCenter(gameObject, alignTo);

        expect(gameObject.y).toBe(140);
    });

    it('should handle non-zero originY on alignTo', function ()
    {
        // originY = 0.5: GetCenterY = y - height*0.5 + height*0.5 = y
        var gameObject = makeObject(0, 0, 100, 50, 0, 0);
        var alignTo = makeObject(0, 200, 200, 80, 0, 0.5);

        // GetCenterY(alignTo) = 200 - 80*0.5 + 80*0.5 = 200
        // SetCenterY(gameObject, 200): go.y = (200 + 0) - 25 = 175
        RightCenter(gameObject, alignTo);

        expect(gameObject.y).toBe(175);
    });

    it('should work when alignTo is at the origin', function ()
    {
        var gameObject = makeObject(0, 0, 60, 40, 0, 0);
        var alignTo = makeObject(0, 0, 100, 80, 0, 0);

        // GetRight(alignTo) = 100
        // GetCenterY(alignTo) = 40
        // SetLeft(gameObject, 100) => go.x = 100
        // SetCenterY(gameObject, 40) => go.y = 40 - 20 = 20
        RightCenter(gameObject, alignTo);

        expect(gameObject.x).toBe(100);
        expect(gameObject.y).toBe(20);
    });

    it('should work with negative positions', function ()
    {
        var gameObject = makeObject(0, 0, 100, 50, 0, 0);
        var alignTo = makeObject(-300, -200, 100, 60, 0, 0);

        // GetRight(alignTo) = -300 + 100 = -200
        // GetCenterY(alignTo) = -200 + 30 = -170
        // SetLeft(gameObject, -200) => go.x = -200
        // SetCenterY(gameObject, -170) => go.y = -170 - 25 = -195
        RightCenter(gameObject, alignTo);

        expect(gameObject.x).toBe(-200);
        expect(gameObject.y).toBe(-195);
    });

    it('should work with floating point dimensions', function ()
    {
        var gameObject = makeObject(0, 0, 33.3, 22.2, 0, 0);
        var alignTo = makeObject(10.5, 20.5, 50.5, 40.4, 0, 0);

        // GetRight(alignTo) = 10.5 + 50.5 = 61
        // GetCenterY(alignTo) = 20.5 + 20.2 = 40.7
        // SetLeft(go, 61) => go.x = 61
        // SetCenterY(go, 40.7) => go.y = 40.7 - 11.1
        RightCenter(gameObject, alignTo);

        expect(gameObject.x).toBeCloseTo(61, 5);
        expect(gameObject.y).toBeCloseTo(29.6, 5);
    });

    it('should work when both objects have the same dimensions', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0, 0);
        var alignTo = makeObject(200, 200, 100, 100, 0, 0);

        // GetRight(alignTo) = 300
        // GetCenterY(alignTo) = 250
        // SetLeft(go, 300) => go.x = 300
        // SetCenterY(go, 250) => go.y = 250 - 50 = 200
        RightCenter(gameObject, alignTo);

        expect(gameObject.x).toBe(300);
        expect(gameObject.y).toBe(200);
    });

    it('should not modify alignTo object', function ()
    {
        var gameObject = makeObject(0, 0, 100, 50, 0, 0);
        var alignTo = makeObject(50, 100, 200, 80, 0, 0);

        RightCenter(gameObject, alignTo, 5, 10);

        expect(alignTo.x).toBe(50);
        expect(alignTo.y).toBe(100);
        expect(alignTo.width).toBe(200);
        expect(alignTo.height).toBe(80);
    });
});
