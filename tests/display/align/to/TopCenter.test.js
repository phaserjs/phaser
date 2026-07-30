var TopCenter = require('../../../../src/display/align/to/TopCenter');

describe('Phaser.Display.Align.To.TopCenter', function ()
{
    function makeObject (x, y, width, height, originX, originY)
    {
        return { x: x, y: y, width: width, height: height, originX: originX, originY: originY };
    }

    // Helpers mirroring the bounds functions used internally
    function getCenterX (obj)
    {
        return obj.x - (obj.width * obj.originX) + (obj.width * 0.5);
    }

    function getTop (obj)
    {
        return obj.y - (obj.height * obj.originY);
    }

    function getBottom (obj)
    {
        return obj.y + (obj.height * (1 - obj.originY));
    }

    it('should return the gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 80, 80, 0.5, 0.5);
        var result = TopCenter(gameObject, alignTo);

        expect(result).toBe(gameObject);
    });

    it('should place the bottom of gameObject flush with the top of alignTo', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 80, 80, 0.5, 0.5);

        TopCenter(gameObject, alignTo);

        expect(getBottom(gameObject)).toBeCloseTo(getTop(alignTo));
    });

    it('should align the center X of gameObject with the center X of alignTo', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 80, 80, 0.5, 0.5);

        TopCenter(gameObject, alignTo);

        expect(getCenterX(gameObject)).toBeCloseTo(getCenterX(alignTo));
    });

    it('should default offsetX to 0 when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 80, 80, 0.5, 0.5);

        TopCenter(gameObject, alignTo);

        expect(getCenterX(gameObject)).toBeCloseTo(getCenterX(alignTo));
    });

    it('should default offsetY to 0 when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 80, 80, 0.5, 0.5);

        TopCenter(gameObject, alignTo);

        expect(getBottom(gameObject)).toBeCloseTo(getTop(alignTo));
    });

    it('should apply positive offsetX to shift gameObject right', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 80, 80, 0.5, 0.5);

        TopCenter(gameObject, alignTo, 10, 0);

        expect(getCenterX(gameObject)).toBeCloseTo(getCenterX(alignTo) + 10);
    });

    it('should apply negative offsetX to shift gameObject left', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 80, 80, 0.5, 0.5);

        TopCenter(gameObject, alignTo, -15, 0);

        expect(getCenterX(gameObject)).toBeCloseTo(getCenterX(alignTo) - 15);
    });

    it('should apply positive offsetY to add vertical gap above alignTo', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 80, 80, 0.5, 0.5);

        TopCenter(gameObject, alignTo, 0, 20);

        expect(getBottom(gameObject)).toBeCloseTo(getTop(alignTo) - 20);
    });

    it('should apply negative offsetY to overlap into alignTo', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 80, 80, 0.5, 0.5);

        TopCenter(gameObject, alignTo, 0, -20);

        expect(getBottom(gameObject)).toBeCloseTo(getTop(alignTo) + 20);
    });

    it('should work correctly with origin at (0, 0)', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0, 0);
        var alignTo = makeObject(200, 200, 80, 80, 0, 0);

        TopCenter(gameObject, alignTo);

        expect(getCenterX(gameObject)).toBeCloseTo(getCenterX(alignTo));
        expect(getBottom(gameObject)).toBeCloseTo(getTop(alignTo));
    });

    it('should work correctly with origin at (1, 1)', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 1, 1);
        var alignTo = makeObject(200, 200, 80, 80, 1, 1);

        TopCenter(gameObject, alignTo);

        expect(getCenterX(gameObject)).toBeCloseTo(getCenterX(alignTo));
        expect(getBottom(gameObject)).toBeCloseTo(getTop(alignTo));
    });

    it('should work with objects of different sizes', function ()
    {
        var gameObject = makeObject(0, 0, 200, 50, 0.5, 0.5);
        var alignTo = makeObject(300, 400, 30, 30, 0.5, 0.5);

        TopCenter(gameObject, alignTo);

        expect(getCenterX(gameObject)).toBeCloseTo(getCenterX(alignTo));
        expect(getBottom(gameObject)).toBeCloseTo(getTop(alignTo));
    });

    it('should work when alignTo is positioned at the origin', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(0, 0, 80, 80, 0.5, 0.5);

        TopCenter(gameObject, alignTo);

        expect(getCenterX(gameObject)).toBeCloseTo(getCenterX(alignTo));
        expect(getBottom(gameObject)).toBeCloseTo(getTop(alignTo));
    });

    it('should work with negative positions', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(-100, -100, 80, 80, 0.5, 0.5);

        TopCenter(gameObject, alignTo);

        expect(getCenterX(gameObject)).toBeCloseTo(getCenterX(alignTo));
        expect(getBottom(gameObject)).toBeCloseTo(getTop(alignTo));
    });

    it('should work with floating point dimensions and positions', function ()
    {
        var gameObject = makeObject(0, 0, 55.5, 33.3, 0.5, 0.5);
        var alignTo = makeObject(123.7, 456.8, 44.2, 22.1, 0.5, 0.5);

        TopCenter(gameObject, alignTo);

        expect(getCenterX(gameObject)).toBeCloseTo(getCenterX(alignTo));
        expect(getBottom(gameObject)).toBeCloseTo(getTop(alignTo));
    });

    it('should apply both offsetX and offsetY together', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 80, 80, 0.5, 0.5);

        TopCenter(gameObject, alignTo, 30, 15);

        expect(getCenterX(gameObject)).toBeCloseTo(getCenterX(alignTo) + 30);
        expect(getBottom(gameObject)).toBeCloseTo(getTop(alignTo) - 15);
    });

    it('should mutate gameObject x and y properties', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 80, 80, 0.5, 0.5);

        TopCenter(gameObject, alignTo);

        // x = (centerX of alignTo + offsetX=0 + width*originX) - width*0.5
        // centerX of alignTo = 200; x = (200 + 50) - 50 = 200
        expect(gameObject.x).toBeCloseTo(200);
        // y = (top of alignTo - 0 - height) + height*originY
        // top of alignTo = 200 - 40 = 160; y = (160 - 100) + 50 = 110
        expect(gameObject.y).toBeCloseTo(110);
    });

    it('should not mutate the alignTo object', function ()
    {
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var alignTo = makeObject(200, 200, 80, 80, 0.5, 0.5);

        TopCenter(gameObject, alignTo);

        expect(alignTo.x).toBe(200);
        expect(alignTo.y).toBe(200);
        expect(alignTo.width).toBe(80);
        expect(alignTo.height).toBe(80);
    });
});
