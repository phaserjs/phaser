var BottomLeft = require('../../../../src/display/align/in/BottomLeft');

describe('Phaser.Display.Align.In.BottomLeft', function ()
{
    function makeObject (x, y, width, height, originX, originY)
    {
        return { x: x, y: y, width: width, height: height, originX: originX, originY: originY };
    }

    it('should return the game object', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 100, 200, 200, 0, 0);

        var result = BottomLeft(gameObject, alignIn);

        expect(result).toBe(gameObject);
    });

    it('should align game object to the bottom-left of alignIn with zero origin', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 100, 200, 200, 0, 0);

        // GetLeft(alignIn) = 100 - (200 * 0) = 100
        // GetBottom(alignIn) = (100 + 200) - (200 * 0) = 300
        // SetLeft: gameObject.x = 100 + (50 * 0) = 100
        // SetBottom: gameObject.y = (300 - 50) + (50 * 0) = 250
        BottomLeft(gameObject, alignIn);

        expect(gameObject.x).toBe(100);
        expect(gameObject.y).toBe(250);
    });

    it('should align game object to the bottom-left of alignIn with 0.5 origin', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(100, 100, 200, 200, 0.5, 0.5);

        // GetLeft(alignIn) = 100 - (200 * 0.5) = 0
        // GetBottom(alignIn) = (100 + 200) - (200 * 0.5) = 200
        // SetLeft: gameObject.x = 0 + (50 * 0.5) = 25
        // SetBottom: gameObject.y = (200 - 50) + (50 * 0.5) = 175
        BottomLeft(gameObject, alignIn);

        expect(gameObject.x).toBe(25);
        expect(gameObject.y).toBe(175);
    });

    it('should apply positive offsetX by moving the game object left', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 100, 200, 200, 0, 0);

        // GetLeft(alignIn) = 100
        // SetLeft(gameObject, 100 - 10) => x = 90
        BottomLeft(gameObject, alignIn, 10, 0);

        expect(gameObject.x).toBe(90);
        expect(gameObject.y).toBe(250);
    });

    it('should apply positive offsetY by moving the game object down', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 100, 200, 200, 0, 0);

        // GetBottom(alignIn) = 300
        // SetBottom(gameObject, 300 + 20) => y = (320 - 50) = 270
        BottomLeft(gameObject, alignIn, 0, 20);

        expect(gameObject.x).toBe(100);
        expect(gameObject.y).toBe(270);
    });

    it('should apply both offsetX and offsetY together', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 100, 200, 200, 0, 0);

        BottomLeft(gameObject, alignIn, 10, 20);

        expect(gameObject.x).toBe(90);
        expect(gameObject.y).toBe(270);
    });

    it('should apply negative offsetX by moving the game object right', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 100, 200, 200, 0, 0);

        // SetLeft(gameObject, 100 - (-10)) => x = 110
        BottomLeft(gameObject, alignIn, -10, 0);

        expect(gameObject.x).toBe(110);
        expect(gameObject.y).toBe(250);
    });

    it('should apply negative offsetY by moving the game object up', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 100, 200, 200, 0, 0);

        // SetBottom(gameObject, 300 + (-20)) => y = (280 - 50) = 230
        BottomLeft(gameObject, alignIn, 0, -20);

        expect(gameObject.x).toBe(100);
        expect(gameObject.y).toBe(230);
    });

    it('should default offsetX and offsetY to zero when not provided', function ()
    {
        var gameObjectA = makeObject(0, 0, 50, 50, 0, 0);
        var gameObjectB = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 100, 200, 200, 0, 0);

        BottomLeft(gameObjectA, alignIn);
        BottomLeft(gameObjectB, alignIn, 0, 0);

        expect(gameObjectA.x).toBe(gameObjectB.x);
        expect(gameObjectA.y).toBe(gameObjectB.y);
    });

    it('should work when alignIn is positioned at the origin', function ()
    {
        var gameObject = makeObject(999, 999, 40, 40, 0, 0);
        var alignIn = makeObject(0, 0, 100, 100, 0, 0);

        // GetLeft(alignIn) = 0
        // GetBottom(alignIn) = 100
        // SetLeft: x = 0
        // SetBottom: y = (100 - 40) = 60
        BottomLeft(gameObject, alignIn);

        expect(gameObject.x).toBe(0);
        expect(gameObject.y).toBe(60);
    });

    it('should work with negative alignIn coordinates', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(-200, -200, 100, 100, 0, 0);

        // GetLeft(alignIn) = -200
        // GetBottom(alignIn) = (-200 + 100) = -100
        // SetLeft: x = -200
        // SetBottom: y = (-100 - 50) = -150
        BottomLeft(gameObject, alignIn);

        expect(gameObject.x).toBe(-200);
        expect(gameObject.y).toBe(-150);
    });

    it('should work with floating point positions and sizes', function ()
    {
        var gameObject = makeObject(0, 0, 10.5, 10.5, 0, 0);
        var alignIn = makeObject(50.5, 50.5, 100.5, 100.5, 0, 0);

        // GetLeft(alignIn) = 50.5
        // GetBottom(alignIn) = 50.5 + 100.5 = 151
        // SetLeft: x = 50.5
        // SetBottom: y = (151 - 10.5) = 140.5
        BottomLeft(gameObject, alignIn);

        expect(gameObject.x).toBeCloseTo(50.5);
        expect(gameObject.y).toBeCloseTo(140.5);
    });

    it('should work when game object and alignIn have the same size', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0, 0);
        var alignIn = makeObject(100, 100, 100, 100, 0, 0);

        // GetLeft(alignIn) = 100
        // GetBottom(alignIn) = 200
        // SetLeft: x = 100
        // SetBottom: y = (200 - 100) = 100
        BottomLeft(gameObject, alignIn);

        expect(gameObject.x).toBe(100);
        expect(gameObject.y).toBe(100);
    });

    it('should work when game object is larger than alignIn', function ()
    {
        var gameObject = makeObject(0, 0, 300, 300, 0, 0);
        var alignIn = makeObject(100, 100, 100, 100, 0, 0);

        // GetLeft(alignIn) = 100
        // GetBottom(alignIn) = 200
        // SetLeft: x = 100
        // SetBottom: y = (200 - 300) = -100
        BottomLeft(gameObject, alignIn);

        expect(gameObject.x).toBe(100);
        expect(gameObject.y).toBe(-100);
    });

    it('should only mutate x and y on the game object', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(100, 100, 200, 200, 0, 0);

        BottomLeft(gameObject, alignIn);

        expect(gameObject.width).toBe(50);
        expect(gameObject.height).toBe(50);
        expect(gameObject.originX).toBe(0.5);
        expect(gameObject.originY).toBe(0.5);
    });

    it('should not mutate the alignIn object', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 100, 200, 200, 0, 0);

        BottomLeft(gameObject, alignIn);

        expect(alignIn.x).toBe(100);
        expect(alignIn.y).toBe(100);
        expect(alignIn.width).toBe(200);
        expect(alignIn.height).toBe(200);
    });
});
