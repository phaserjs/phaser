var BottomCenter = require('../../../../src/display/align/in/BottomCenter');

describe('Phaser.Display.Align.In.BottomCenter', function ()
{
    var gameObject;
    var alignIn;

    beforeEach(function ()
    {
        // origin 0.5: x is center, y is center
        gameObject = { x: 0, y: 0, width: 50, height: 30, originX: 0.5, originY: 0.5 };
        alignIn    = { x: 0, y: 0, width: 200, height: 100, originX: 0.5, originY: 0.5 };
    });

    it('should return the gameObject', function ()
    {
        var result = BottomCenter(gameObject, alignIn);

        expect(result).toBe(gameObject);
    });

    it('should align gameObject center-x to alignIn center-x with default offsets', function ()
    {
        BottomCenter(gameObject, alignIn);

        // GetCenterX(alignIn) = 0 - (200 * 0.5) + (200 * 0.5) = 0
        // SetCenterX sets gameObject.x = (0 + 25) - 25 = 0
        expect(gameObject.x).toBeCloseTo(0);
    });

    it('should align gameObject bottom to alignIn bottom with default offsets', function ()
    {
        BottomCenter(gameObject, alignIn);

        // GetBottom(alignIn) = (0 + 100) - (100 * 0.5) = 50
        // SetBottom: gameObject.y = (50 - 30) + (30 * 0.5) = 35
        expect(gameObject.y).toBeCloseTo(35);
    });

    it('should apply horizontal offsetX to center-x alignment', function ()
    {
        BottomCenter(gameObject, alignIn, 20, 0);

        // GetCenterX(alignIn) = 0; target centerX = 0 + 20 = 20
        // SetCenterX: gameObject.x = (20 + 25) - 25 = 20
        expect(gameObject.x).toBeCloseTo(20);
    });

    it('should apply vertical offsetY to bottom alignment', function ()
    {
        BottomCenter(gameObject, alignIn, 0, 10);

        // GetBottom(alignIn) = 50; target bottom = 50 + 10 = 60
        // SetBottom: gameObject.y = (60 - 30) + 15 = 45
        expect(gameObject.y).toBeCloseTo(45);
    });

    it('should apply negative offsetX', function ()
    {
        BottomCenter(gameObject, alignIn, -15, 0);

        // target centerX = 0 + (-15) = -15
        // SetCenterX: gameObject.x = (-15 + 25) - 25 = -15
        expect(gameObject.x).toBeCloseTo(-15);
    });

    it('should apply negative offsetY', function ()
    {
        BottomCenter(gameObject, alignIn, 0, -10);

        // target bottom = 50 + (-10) = 40
        // SetBottom: gameObject.y = (40 - 30) + 15 = 25
        expect(gameObject.y).toBeCloseTo(25);
    });

    it('should apply both offsetX and offsetY together', function ()
    {
        BottomCenter(gameObject, alignIn, 10, 5);

        // centerX target = 0 + 10 = 10 => gameObject.x = 10
        // bottom target = 50 + 5 = 55 => gameObject.y = (55 - 30) + 15 = 40
        expect(gameObject.x).toBeCloseTo(10);
        expect(gameObject.y).toBeCloseTo(40);
    });

    it('should work correctly when alignIn has non-center origin (0, 0)', function ()
    {
        alignIn = { x: 100, y: 100, width: 200, height: 100, originX: 0, originY: 0 };

        BottomCenter(gameObject, alignIn);

        // GetCenterX(alignIn) = 100 - (200 * 0) + (200 * 0.5) = 200
        // GetBottom(alignIn) = (100 + 100) - (100 * 0) = 200
        // SetCenterX gameObject.x = (200 + 25) - 25 = 200
        // SetBottom gameObject.y = (200 - 30) + 15 = 185
        expect(gameObject.x).toBeCloseTo(200);
        expect(gameObject.y).toBeCloseTo(185);
    });

    it('should work correctly when gameObject has non-center origin (0, 0)', function ()
    {
        gameObject = { x: 0, y: 0, width: 50, height: 30, originX: 0, originY: 0 };

        BottomCenter(gameObject, alignIn);

        // GetCenterX(alignIn) = 0
        // SetCenterX: offsetX = 50 * 0 = 0; gameObject.x = (0 + 0) - 25 = -25
        // GetBottom(alignIn) = 50
        // SetBottom: gameObject.y = (50 - 30) + (30 * 0) = 20
        expect(gameObject.x).toBeCloseTo(-25);
        expect(gameObject.y).toBeCloseTo(20);
    });

    it('should work correctly when gameObject has bottom-right origin (1, 1)', function ()
    {
        gameObject = { x: 0, y: 0, width: 50, height: 30, originX: 1, originY: 1 };

        BottomCenter(gameObject, alignIn);

        // GetCenterX(alignIn) = 0
        // SetCenterX: offsetX = 50 * 1 = 50; gameObject.x = (0 + 50) - 25 = 25
        // GetBottom(alignIn) = 50
        // SetBottom: gameObject.y = (50 - 30) + (30 * 1) = 50
        expect(gameObject.x).toBeCloseTo(25);
        expect(gameObject.y).toBeCloseTo(50);
    });

    it('should correctly position when alignIn is offset from origin', function ()
    {
        alignIn = { x: 50, y: 80, width: 100, height: 60, originX: 0.5, originY: 0.5 };

        BottomCenter(gameObject, alignIn);

        // GetCenterX(alignIn) = 50 - (100 * 0.5) + 50 = 50
        // GetBottom(alignIn) = (80 + 60) - (60 * 0.5) = 110
        // SetCenterX: gameObject.x = (50 + 25) - 25 = 50
        // SetBottom: gameObject.y = (110 - 30) + 15 = 95
        expect(gameObject.x).toBeCloseTo(50);
        expect(gameObject.y).toBeCloseTo(95);
    });

    it('should work with zero-size gameObject', function ()
    {
        gameObject = { x: 0, y: 0, width: 0, height: 0, originX: 0.5, originY: 0.5 };

        BottomCenter(gameObject, alignIn);

        // GetCenterX(alignIn) = 0
        // SetCenterX: gameObject.x = (0 + 0) - 0 = 0
        // GetBottom(alignIn) = 50
        // SetBottom: gameObject.y = (50 - 0) + 0 = 50
        expect(gameObject.x).toBeCloseTo(0);
        expect(gameObject.y).toBeCloseTo(50);
    });

    it('should work with floating point dimensions', function ()
    {
        gameObject = { x: 0, y: 0, width: 33.3, height: 21.7, originX: 0.5, originY: 0.5 };
        alignIn    = { x: 10.5, y: 20.5, width: 150.6, height: 80.4, originX: 0.5, originY: 0.5 };

        BottomCenter(gameObject, alignIn);

        // GetCenterX(alignIn) = 10.5 - (150.6 * 0.5) + (150.6 * 0.5) = 10.5
        // GetBottom(alignIn) = (20.5 + 80.4) - (80.4 * 0.5) = 60.7
        var expectedCenterX = 10.5;
        var expectedBottom = 60.7;

        // Verify by computing GetCenterX and GetBottom on result
        var resultCenterX = gameObject.x - (gameObject.width * gameObject.originX) + (gameObject.width * 0.5);
        var resultBottom = (gameObject.y + gameObject.height) - (gameObject.height * gameObject.originY);

        expect(resultCenterX).toBeCloseTo(expectedCenterX);
        expect(resultBottom).toBeCloseTo(expectedBottom);
    });

    it('should work with negative coordinates', function ()
    {
        alignIn = { x: -100, y: -50, width: 200, height: 100, originX: 0.5, originY: 0.5 };

        BottomCenter(gameObject, alignIn);

        // GetCenterX(alignIn) = -100 - (200*0.5) + (200*0.5) = -100
        // GetBottom(alignIn) = (-50 + 100) - (100*0.5) = 0
        // SetCenterX: gameObject.x = (-100 + 25) - 25 = -100
        // SetBottom: gameObject.y = (0 - 30) + 15 = -15
        expect(gameObject.x).toBeCloseTo(-100);
        expect(gameObject.y).toBeCloseTo(-15);
    });

    it('should use zero as default offsetX when not provided', function ()
    {
        var withDefault = { x: 0, y: 0, width: 50, height: 30, originX: 0.5, originY: 0.5 };
        var withExplicit = { x: 0, y: 0, width: 50, height: 30, originX: 0.5, originY: 0.5 };

        BottomCenter(withDefault, alignIn);
        BottomCenter(withExplicit, alignIn, 0, 0);

        expect(withDefault.x).toBeCloseTo(withExplicit.x);
        expect(withDefault.y).toBeCloseTo(withExplicit.y);
    });

    it('should use zero as default offsetY when not provided', function ()
    {
        var withDefault = { x: 0, y: 0, width: 50, height: 30, originX: 0.5, originY: 0.5 };
        var withExplicit = { x: 0, y: 0, width: 50, height: 30, originX: 0.5, originY: 0.5 };

        BottomCenter(withDefault, alignIn, 5);
        BottomCenter(withExplicit, alignIn, 5, 0);

        expect(withDefault.x).toBeCloseTo(withExplicit.x);
        expect(withDefault.y).toBeCloseTo(withExplicit.y);
    });
});
