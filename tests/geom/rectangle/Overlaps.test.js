var Overlaps = require('../../../src/geom/rectangle/Overlaps');

describe('Phaser.Geom.Rectangle.Overlaps', function ()
{
    function makeRect (x, y, width, height)
    {
        return {
            x: x,
            y: y,
            width: width,
            height: height,
            right: x + width,
            bottom: y + height
        };
    }

    it('should return true when two rectangles overlap partially', function ()
    {
        var a = makeRect(0, 0, 10, 10);
        var b = makeRect(5, 5, 10, 10);

        expect(Overlaps(a, b)).toBe(true);
    });

    it('should return true when rectB is fully inside rectA', function ()
    {
        var a = makeRect(0, 0, 20, 20);
        var b = makeRect(5, 5, 5, 5);

        expect(Overlaps(a, b)).toBe(true);
    });

    it('should return true when rectA is fully inside rectB', function ()
    {
        var a = makeRect(5, 5, 5, 5);
        var b = makeRect(0, 0, 20, 20);

        expect(Overlaps(a, b)).toBe(true);
    });

    it('should return false when rectangles are separated horizontally', function ()
    {
        var a = makeRect(0, 0, 10, 10);
        var b = makeRect(20, 0, 10, 10);

        expect(Overlaps(a, b)).toBe(false);
    });

    it('should return false when rectangles are separated vertically', function ()
    {
        var a = makeRect(0, 0, 10, 10);
        var b = makeRect(0, 20, 10, 10);

        expect(Overlaps(a, b)).toBe(false);
    });

    it('should return false when rectangles are separated diagonally', function ()
    {
        var a = makeRect(0, 0, 10, 10);
        var b = makeRect(20, 20, 10, 10);

        expect(Overlaps(a, b)).toBe(false);
    });

    it('should return false when rectangles share only a left/right edge', function ()
    {
        var a = makeRect(0, 0, 10, 10);
        var b = makeRect(10, 0, 10, 10);

        expect(Overlaps(a, b)).toBe(false);
    });

    it('should return false when rectangles share only a top/bottom edge', function ()
    {
        var a = makeRect(0, 0, 10, 10);
        var b = makeRect(0, 10, 10, 10);

        expect(Overlaps(a, b)).toBe(false);
    });

    it('should return false when rectangles share only a corner point', function ()
    {
        var a = makeRect(0, 0, 10, 10);
        var b = makeRect(10, 10, 10, 10);

        expect(Overlaps(a, b)).toBe(false);
    });

    it('should return true when rectangles overlap by a single pixel horizontally', function ()
    {
        var a = makeRect(0, 0, 11, 10);
        var b = makeRect(10, 0, 10, 10);

        expect(Overlaps(a, b)).toBe(true);
    });

    it('should return true when rectangles overlap by a single pixel vertically', function ()
    {
        var a = makeRect(0, 0, 10, 11);
        var b = makeRect(0, 10, 10, 10);

        expect(Overlaps(a, b)).toBe(true);
    });

    it('should return true for identical rectangles', function ()
    {
        var a = makeRect(5, 5, 10, 10);
        var b = makeRect(5, 5, 10, 10);

        expect(Overlaps(a, b)).toBe(true);
    });

    it('should work with negative coordinates', function ()
    {
        var a = makeRect(-10, -10, 15, 15);
        var b = makeRect(-5, -5, 15, 15);

        expect(Overlaps(a, b)).toBe(true);
    });

    it('should return false when both rectangles are at negative coordinates and do not overlap', function ()
    {
        var a = makeRect(-30, -30, 10, 10);
        var b = makeRect(-10, -10, 10, 10);

        expect(Overlaps(a, b)).toBe(false);
    });

    it('should work with floating point coordinates that overlap', function ()
    {
        var a = makeRect(0, 0, 5.5, 5.5);
        var b = makeRect(5, 5, 5.5, 5.5);

        expect(Overlaps(a, b)).toBe(true);
    });

    it('should work with floating point coordinates that do not overlap', function ()
    {
        var a = makeRect(0, 0, 5, 5);
        var b = makeRect(5.1, 5.1, 5, 5);

        expect(Overlaps(a, b)).toBe(false);
    });

    it('should return true when rectB overlaps rectA from the left', function ()
    {
        var a = makeRect(10, 0, 10, 10);
        var b = makeRect(0, 0, 15, 10);

        expect(Overlaps(a, b)).toBe(true);
    });

    it('should return true when rectB overlaps rectA from above', function ()
    {
        var a = makeRect(0, 10, 10, 10);
        var b = makeRect(0, 0, 10, 15);

        expect(Overlaps(a, b)).toBe(true);
    });
});
