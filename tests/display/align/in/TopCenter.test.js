var TopCenter = require('../../../../src/display/align/in/TopCenter');
var GetCenterX = require('../../../../src/display/bounds/GetCenterX');
var GetTop = require('../../../../src/display/bounds/GetTop');

function makeObject (x, y, width, height, originX, originY)
{
    return {
        x: x,
        y: y,
        width: width,
        height: height,
        originX: originX !== undefined ? originX : 0.5,
        originY: originY !== undefined ? originY : 0.5
    };
}

describe('Phaser.Display.Align.In.TopCenter', function ()
{
    var gameObject;
    var alignIn;

    beforeEach(function ()
    {
        gameObject = makeObject(0, 0, 100, 50, 0.5, 0.5);
        alignIn = makeObject(200, 300, 400, 200, 0.5, 0.5);
    });

    it('should return the gameObject', function ()
    {
        var result = TopCenter(gameObject, alignIn);

        expect(result).toBe(gameObject);
    });

    it('should align the center X of gameObject to the center X of alignIn', function ()
    {
        TopCenter(gameObject, alignIn);

        expect(GetCenterX(gameObject)).toBeCloseTo(GetCenterX(alignIn));
    });

    it('should align the top of gameObject to the top of alignIn', function ()
    {
        TopCenter(gameObject, alignIn);

        expect(GetTop(gameObject)).toBeCloseTo(GetTop(alignIn));
    });

    it('should default offsetX to 0 when not provided', function ()
    {
        TopCenter(gameObject, alignIn);

        expect(GetCenterX(gameObject)).toBeCloseTo(GetCenterX(alignIn));
    });

    it('should default offsetY to 0 when not provided', function ()
    {
        TopCenter(gameObject, alignIn);

        expect(GetTop(gameObject)).toBeCloseTo(GetTop(alignIn));
    });

    it('should apply a positive offsetX to shift right', function ()
    {
        TopCenter(gameObject, alignIn, 50);

        expect(GetCenterX(gameObject)).toBeCloseTo(GetCenterX(alignIn) + 50);
    });

    it('should apply a negative offsetX to shift left', function ()
    {
        TopCenter(gameObject, alignIn, -30);

        expect(GetCenterX(gameObject)).toBeCloseTo(GetCenterX(alignIn) - 30);
    });

    it('should apply a positive offsetY to shift upward', function ()
    {
        TopCenter(gameObject, alignIn, 0, 20);

        expect(GetTop(gameObject)).toBeCloseTo(GetTop(alignIn) - 20);
    });

    it('should apply a negative offsetY to shift downward', function ()
    {
        TopCenter(gameObject, alignIn, 0, -15);

        expect(GetTop(gameObject)).toBeCloseTo(GetTop(alignIn) + 15);
    });

    it('should apply both offsetX and offsetY simultaneously', function ()
    {
        TopCenter(gameObject, alignIn, 25, 10);

        expect(GetCenterX(gameObject)).toBeCloseTo(GetCenterX(alignIn) + 25);
        expect(GetTop(gameObject)).toBeCloseTo(GetTop(alignIn) - 10);
    });

    it('should work when gameObject and alignIn have the same dimensions', function ()
    {
        var obj = makeObject(0, 0, 200, 100, 0.5, 0.5);
        var container = makeObject(100, 100, 200, 100, 0.5, 0.5);

        TopCenter(obj, container);

        expect(GetCenterX(obj)).toBeCloseTo(GetCenterX(container));
        expect(GetTop(obj)).toBeCloseTo(GetTop(container));
    });

    it('should work when gameObject is larger than alignIn', function ()
    {
        var large = makeObject(0, 0, 800, 600, 0.5, 0.5);
        var small = makeObject(100, 100, 50, 50, 0.5, 0.5);

        TopCenter(large, small);

        expect(GetCenterX(large)).toBeCloseTo(GetCenterX(small));
        expect(GetTop(large)).toBeCloseTo(GetTop(small));
    });

    it('should work with origin (0, 0)', function ()
    {
        var obj = makeObject(10, 20, 100, 50, 0, 0);
        var container = makeObject(200, 150, 300, 200, 0, 0);

        TopCenter(obj, container);

        expect(GetCenterX(obj)).toBeCloseTo(GetCenterX(container));
        expect(GetTop(obj)).toBeCloseTo(GetTop(container));
    });

    it('should work with origin (1, 1)', function ()
    {
        var obj = makeObject(10, 20, 100, 50, 1, 1);
        var container = makeObject(200, 150, 300, 200, 1, 1);

        TopCenter(obj, container);

        expect(GetCenterX(obj)).toBeCloseTo(GetCenterX(container));
        expect(GetTop(obj)).toBeCloseTo(GetTop(container));
    });

    it('should work with non-uniform origins', function ()
    {
        var obj = makeObject(0, 0, 120, 80, 0.3, 0.7);
        var container = makeObject(400, 300, 500, 250, 0.2, 0.4);

        TopCenter(obj, container);

        expect(GetCenterX(obj)).toBeCloseTo(GetCenterX(container));
        expect(GetTop(obj)).toBeCloseTo(GetTop(container));
    });

    it('should work with alignIn positioned at the origin (0, 0)', function ()
    {
        var container = makeObject(0, 0, 200, 100, 0.5, 0.5);

        TopCenter(gameObject, container);

        expect(GetCenterX(gameObject)).toBeCloseTo(GetCenterX(container));
        expect(GetTop(gameObject)).toBeCloseTo(GetTop(container));
    });

    it('should work with negative positions', function ()
    {
        var container = makeObject(-500, -300, 200, 100, 0.5, 0.5);

        TopCenter(gameObject, container);

        expect(GetCenterX(gameObject)).toBeCloseTo(GetCenterX(container));
        expect(GetTop(gameObject)).toBeCloseTo(GetTop(container));
    });

    it('should work with floating point positions', function ()
    {
        var container = makeObject(123.456, 78.9, 200, 100, 0.5, 0.5);

        TopCenter(gameObject, container);

        expect(GetCenterX(gameObject)).toBeCloseTo(GetCenterX(container));
        expect(GetTop(gameObject)).toBeCloseTo(GetTop(container));
    });

    it('should work with floating point offsets', function ()
    {
        TopCenter(gameObject, alignIn, 10.5, 7.25);

        expect(GetCenterX(gameObject)).toBeCloseTo(GetCenterX(alignIn) + 10.5);
        expect(GetTop(gameObject)).toBeCloseTo(GetTop(alignIn) - 7.25);
    });

    it('should work with zero-dimension objects', function ()
    {
        var dot = makeObject(50, 50, 0, 0, 0.5, 0.5);
        var container = makeObject(200, 200, 400, 200, 0.5, 0.5);

        TopCenter(dot, container);

        expect(GetCenterX(dot)).toBeCloseTo(GetCenterX(container));
        expect(GetTop(dot)).toBeCloseTo(GetTop(container));
    });

    it('should mutate gameObject x and y properties', function ()
    {
        var originalX = gameObject.x;
        var originalY = gameObject.y;

        TopCenter(gameObject, alignIn);

        expect(gameObject.x !== originalX || gameObject.y !== originalY).toBe(true);
    });

    it('should not mutate alignIn properties', function ()
    {
        var originalX = alignIn.x;
        var originalY = alignIn.y;

        TopCenter(gameObject, alignIn);

        expect(alignIn.x).toBe(originalX);
        expect(alignIn.y).toBe(originalY);
    });

    it('should correctly set x based on width and originX when centering', function ()
    {
        // gameObject: width=100, originX=0.5 => x = centerX - width*0.5 + width*originX = centerX
        // alignIn centerX = 200 - (400*0.5) + (400*0.5) = 200
        var obj = makeObject(0, 0, 100, 50, 0.5, 0.5);
        var container = makeObject(200, 300, 400, 200, 0.5, 0.5);

        TopCenter(obj, container);

        // centerX of container = 200 - 200 + 200 = 200
        // SetCenterX(obj, 200): offsetX = 100*0.5 = 50, obj.x = (200 + 50) - 50 = 200
        expect(obj.x).toBeCloseTo(200);
    });

    it('should correctly set y based on height and originY when aligning top', function ()
    {
        // alignIn top = 300 - (200*0.5) = 200
        // SetTop(obj, 200): obj.y = 200 + (50*0.5) = 225
        var obj = makeObject(0, 0, 100, 50, 0.5, 0.5);
        var container = makeObject(200, 300, 400, 200, 0.5, 0.5);

        TopCenter(obj, container);

        expect(obj.y).toBeCloseTo(225);
    });
});
