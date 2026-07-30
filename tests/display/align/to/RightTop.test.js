var RightTop = require('../../../../src/display/align/to/RightTop');

describe('Phaser.Display.Align.To.RightTop', function ()
{
    var gameObject;
    var alignTo;

    beforeEach(function ()
    {
        gameObject = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };
        alignTo = { x: 200, y: 100, width: 80, height: 60, originX: 0.5, originY: 0.5 };
    });

    it('should return the game object', function ()
    {
        var result = RightTop(gameObject, alignTo);

        expect(result).toBe(gameObject);
    });

    it('should align the left edge of gameObject to the right edge of alignTo', function ()
    {
        // alignTo right = 200 + 80 - (80 * 0.5) = 200 + 80 - 40 = 240
        // SetLeft sets gameObject.x = 240 + (100 * 0.5) = 240 + 50 = 290
        RightTop(gameObject, alignTo);

        expect(gameObject.x).toBe(290);
    });

    it('should align the top edge of gameObject to the top edge of alignTo', function ()
    {
        // alignTo top = 100 - (60 * 0.5) = 100 - 30 = 70
        // SetTop sets gameObject.y = 70 + (50 * 0.5) = 70 + 25 = 95
        RightTop(gameObject, alignTo);

        expect(gameObject.y).toBe(95);
    });

    it('should default offsetX to 0 when not provided', function ()
    {
        var withoutOffset = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };
        var withOffset = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };

        RightTop(withoutOffset, alignTo);
        RightTop(withOffset, alignTo, 0);

        expect(withoutOffset.x).toBe(withOffset.x);
    });

    it('should default offsetY to 0 when not provided', function ()
    {
        var withoutOffset = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };
        var withOffset = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };

        RightTop(withoutOffset, alignTo);
        RightTop(withOffset, alignTo, 0, 0);

        expect(withoutOffset.y).toBe(withOffset.y);
    });

    it('should apply positive offsetX to shift gameObject further right', function ()
    {
        var base = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };
        var offset = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };

        RightTop(base, alignTo, 0);
        RightTop(offset, alignTo, 20);

        expect(offset.x).toBe(base.x + 20);
    });

    it('should apply negative offsetX to shift gameObject to the left', function ()
    {
        var base = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };
        var offset = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };

        RightTop(base, alignTo, 0);
        RightTop(offset, alignTo, -15);

        expect(offset.x).toBe(base.x - 15);
    });

    it('should apply positive offsetY to shift gameObject upward', function ()
    {
        // offsetY is subtracted from the top: SetTop(gameObject, GetTop(alignTo) - offsetY)
        var base = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };
        var offset = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };

        RightTop(base, alignTo, 0, 0);
        RightTop(offset, alignTo, 0, 10);

        expect(offset.y).toBe(base.y - 10);
    });

    it('should apply negative offsetY to shift gameObject downward', function ()
    {
        var base = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };
        var offset = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };

        RightTop(base, alignTo, 0, 0);
        RightTop(offset, alignTo, 0, -10);

        expect(offset.y).toBe(base.y + 10);
    });

    it('should work with zero-origin game objects', function ()
    {
        var go = { x: 0, y: 0, width: 100, height: 50, originX: 0, originY: 0 };
        var at = { x: 50, y: 80, width: 60, height: 40, originX: 0, originY: 0 };

        // alignTo right = 50 + 60 - (60 * 0) = 110
        // SetLeft: go.x = 110 + (100 * 0) = 110
        // alignTo top = 80 - (40 * 0) = 80
        // SetTop: go.y = 80 + (50 * 0) = 80
        RightTop(go, at);

        expect(go.x).toBe(110);
        expect(go.y).toBe(80);
    });

    it('should work with full-origin (1) game objects', function ()
    {
        var go = { x: 0, y: 0, width: 100, height: 50, originX: 1, originY: 1 };
        var at = { x: 50, y: 80, width: 60, height: 40, originX: 1, originY: 1 };

        // alignTo right = 50 + 60 - (60 * 1) = 50
        // SetLeft: go.x = 50 + (100 * 1) = 150
        // alignTo top = 80 - (40 * 1) = 40
        // SetTop: go.y = 40 + (50 * 1) = 90
        RightTop(go, at);

        expect(go.x).toBe(150);
        expect(go.y).toBe(90);
    });

    it('should work with negative positions', function ()
    {
        var go = { x: 0, y: 0, width: 40, height: 30, originX: 0.5, originY: 0.5 };
        var at = { x: -100, y: -50, width: 60, height: 40, originX: 0.5, originY: 0.5 };

        // alignTo right = -100 + 60 - (60 * 0.5) = -100 + 60 - 30 = -70
        // SetLeft: go.x = -70 + (40 * 0.5) = -70 + 20 = -50
        // alignTo top = -50 - (40 * 0.5) = -50 - 20 = -70
        // SetTop: go.y = -70 + (30 * 0.5) = -70 + 15 = -55
        RightTop(go, at);

        expect(go.x).toBe(-50);
        expect(go.y).toBe(-55);
    });

    it('should work with floating point dimensions', function ()
    {
        var go = { x: 0, y: 0, width: 33.3, height: 22.2, originX: 0.5, originY: 0.5 };
        var at = { x: 10, y: 10, width: 44.4, height: 11.1, originX: 0.5, originY: 0.5 };

        // alignTo right = 10 + 44.4 - (44.4 * 0.5) = 10 + 44.4 - 22.2 = 32.2
        // SetLeft: go.x = 32.2 + (33.3 * 0.5) = 32.2 + 16.65 = 48.85
        // alignTo top = 10 - (11.1 * 0.5) = 10 - 5.55 = 4.45
        // SetTop: go.y = 4.45 + (22.2 * 0.5) = 4.45 + 11.1 = 15.55
        RightTop(go, at);

        expect(go.x).toBeCloseTo(48.85);
        expect(go.y).toBeCloseTo(15.55);
    });

    it('should work with both offsets applied simultaneously', function ()
    {
        var go = { x: 0, y: 0, width: 100, height: 50, originX: 0.5, originY: 0.5 };
        var at = { x: 200, y: 100, width: 80, height: 60, originX: 0.5, originY: 0.5 };

        // alignTo right = 200 + 80 - 40 = 240; SetLeft: go.x = 240 + 20 + 50 = 310
        // alignTo top = 100 - 30 = 70; SetTop: go.y = 70 - 15 + 25 = 80
        RightTop(go, at, 20, 15);

        expect(go.x).toBe(310);
        expect(go.y).toBe(80);
    });
});
