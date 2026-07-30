var RightCenter = require('../../../../src/display/align/in/RightCenter');
var GetRight = require('../../../../src/display/bounds/GetRight');
var GetCenterY = require('../../../../src/display/bounds/GetCenterY');

describe('Phaser.Display.Align.In.RightCenter', function ()
{
    var gameObject;
    var alignIn;

    function makeObject (x, y, width, height, originX, originY)
    {
        return { x: x, y: y, width: width, height: height, originX: originX, originY: originY };
    }

    beforeEach(function ()
    {
        gameObject = makeObject(0, 0, 50, 50, 0, 0);
        alignIn = makeObject(0, 0, 200, 100, 0, 0);
    });

    it('should return the gameObject', function ()
    {
        var result = RightCenter(gameObject, alignIn);

        expect(result).toBe(gameObject);
    });

    it('should align the right edge of gameObject with the right edge of alignIn', function ()
    {
        RightCenter(gameObject, alignIn);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn));
    });

    it('should align the vertical center of gameObject with the vertical center of alignIn', function ()
    {
        RightCenter(gameObject, alignIn);

        expect(GetCenterY(gameObject)).toBeCloseTo(GetCenterY(alignIn));
    });

    it('should default offsetX to 0 when not provided', function ()
    {
        RightCenter(gameObject, alignIn);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn));
    });

    it('should default offsetY to 0 when not provided', function ()
    {
        RightCenter(gameObject, alignIn);

        expect(GetCenterY(gameObject)).toBeCloseTo(GetCenterY(alignIn));
    });

    it('should apply a positive horizontal offset', function ()
    {
        var offsetX = 20;

        RightCenter(gameObject, alignIn, offsetX);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn) + offsetX);
    });

    it('should apply a negative horizontal offset', function ()
    {
        var offsetX = -15;

        RightCenter(gameObject, alignIn, offsetX);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn) + offsetX);
    });

    it('should apply a positive vertical offset', function ()
    {
        var offsetY = 30;

        RightCenter(gameObject, alignIn, 0, offsetY);

        expect(GetCenterY(gameObject)).toBeCloseTo(GetCenterY(alignIn) + offsetY);
    });

    it('should apply a negative vertical offset', function ()
    {
        var offsetY = -25;

        RightCenter(gameObject, alignIn, 0, offsetY);

        expect(GetCenterY(gameObject)).toBeCloseTo(GetCenterY(alignIn) + offsetY);
    });

    it('should apply both horizontal and vertical offsets simultaneously', function ()
    {
        var offsetX = 10;
        var offsetY = -10;

        RightCenter(gameObject, alignIn, offsetX, offsetY);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn) + offsetX);
        expect(GetCenterY(gameObject)).toBeCloseTo(GetCenterY(alignIn) + offsetY);
    });

    it('should work correctly with non-zero origin values', function ()
    {
        gameObject = makeObject(0, 0, 60, 40, 0.5, 0.5);
        alignIn = makeObject(100, 80, 300, 200, 0.5, 0.5);

        RightCenter(gameObject, alignIn);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn));
        expect(GetCenterY(gameObject)).toBeCloseTo(GetCenterY(alignIn));
    });

    it('should work correctly with origin at (1, 1)', function ()
    {
        gameObject = makeObject(0, 0, 80, 60, 1, 1);
        alignIn = makeObject(50, 50, 200, 150, 1, 1);

        RightCenter(gameObject, alignIn);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn));
        expect(GetCenterY(gameObject)).toBeCloseTo(GetCenterY(alignIn));
    });

    it('should work when alignIn is positioned at the origin', function ()
    {
        alignIn = makeObject(0, 0, 100, 80, 0, 0);
        gameObject = makeObject(500, 500, 40, 40, 0, 0);

        RightCenter(gameObject, alignIn);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn));
        expect(GetCenterY(gameObject)).toBeCloseTo(GetCenterY(alignIn));
    });

    it('should work with negative alignIn position', function ()
    {
        alignIn = makeObject(-200, -150, 100, 80, 0, 0);
        gameObject = makeObject(0, 0, 40, 40, 0, 0);

        RightCenter(gameObject, alignIn);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn));
        expect(GetCenterY(gameObject)).toBeCloseTo(GetCenterY(alignIn));
    });

    it('should work with floating point dimensions', function ()
    {
        alignIn = makeObject(10.5, 20.5, 100.5, 60.5, 0, 0);
        gameObject = makeObject(0, 0, 30.5, 20.5, 0, 0);

        RightCenter(gameObject, alignIn);

        expect(GetRight(gameObject)).toBeCloseTo(GetRight(alignIn));
        expect(GetCenterY(gameObject)).toBeCloseTo(GetCenterY(alignIn));
    });

    it('should set correct x position when offsetX is zero and originX is zero', function ()
    {
        alignIn = makeObject(0, 0, 200, 100, 0, 0);
        gameObject = makeObject(0, 0, 50, 50, 0, 0);

        RightCenter(gameObject, alignIn);

        // GetRight(alignIn) = 0 + 200 = 200; SetRight(gameObject, 200): x = 200 - 50 = 150
        expect(gameObject.x).toBe(150);
    });

    it('should set correct y position when offsetY is zero and originY is zero', function ()
    {
        alignIn = makeObject(0, 0, 200, 100, 0, 0);
        gameObject = makeObject(0, 0, 50, 50, 0, 0);

        RightCenter(gameObject, alignIn);

        // GetCenterY(alignIn) = 0 + 50 = 50; SetCenterY(gameObject, 50): y = 50 - 25 = 25
        expect(gameObject.y).toBe(25);
    });

    it('should not modify the alignIn object', function ()
    {
        alignIn = makeObject(100, 200, 300, 150, 0.5, 0.5);
        var origX = alignIn.x;
        var origY = alignIn.y;

        RightCenter(gameObject, alignIn);

        expect(alignIn.x).toBe(origX);
        expect(alignIn.y).toBe(origY);
    });
});
