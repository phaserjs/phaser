var ContainsRect = require('../../../src/geom/rectangle/ContainsRect');

describe('Phaser.Geom.Rectangle.ContainsRect', function ()
{
    function makeRect(x, y, width, height)
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

    it('should return true when rectB is fully inside rectA', function ()
    {
        var rectA = makeRect(0, 0, 100, 100);
        var rectB = makeRect(10, 10, 50, 50);

        expect(ContainsRect(rectA, rectB)).toBe(true);
    });

    it('should return false when rectB is larger than rectA by area', function ()
    {
        var rectA = makeRect(0, 0, 50, 50);
        var rectB = makeRect(10, 10, 100, 100);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB left edge touches rectA left edge', function ()
    {
        var rectA = makeRect(0, 0, 100, 100);
        var rectB = makeRect(0, 10, 50, 50);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB right edge touches rectA right edge', function ()
    {
        var rectA = makeRect(0, 0, 100, 100);
        var rectB = makeRect(50, 10, 50, 50);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB top edge touches rectA top edge', function ()
    {
        var rectA = makeRect(0, 0, 100, 100);
        var rectB = makeRect(10, 0, 50, 50);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB bottom edge touches rectA bottom edge', function ()
    {
        var rectA = makeRect(0, 0, 100, 100);
        var rectB = makeRect(10, 50, 50, 50);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB is completely outside rectA to the right', function ()
    {
        var rectA = makeRect(0, 0, 100, 100);
        var rectB = makeRect(200, 10, 20, 20);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB is completely outside rectA to the left', function ()
    {
        var rectA = makeRect(100, 0, 100, 100);
        var rectB = makeRect(10, 10, 20, 20);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB is completely outside rectA above', function ()
    {
        var rectA = makeRect(0, 100, 100, 100);
        var rectB = makeRect(10, 10, 20, 20);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB is completely outside rectA below', function ()
    {
        var rectA = makeRect(0, 0, 100, 100);
        var rectB = makeRect(10, 200, 20, 20);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB partially overlaps rectA on the left', function ()
    {
        var rectA = makeRect(50, 0, 100, 100);
        var rectB = makeRect(10, 10, 80, 50);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB partially overlaps rectA on the right', function ()
    {
        var rectA = makeRect(0, 0, 100, 100);
        var rectB = makeRect(80, 10, 80, 50);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB partially overlaps rectA on the top', function ()
    {
        var rectA = makeRect(0, 50, 100, 100);
        var rectB = makeRect(10, 10, 50, 80);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB partially overlaps rectA on the bottom', function ()
    {
        var rectA = makeRect(0, 0, 100, 100);
        var rectB = makeRect(10, 80, 50, 80);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB is the same size and position as rectA', function ()
    {
        var rectA = makeRect(0, 0, 100, 100);
        var rectB = makeRect(0, 0, 100, 100);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectA has zero area', function ()
    {
        var rectA = makeRect(0, 0, 0, 0);
        var rectB = makeRect(0, 0, 10, 10);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return true when rectB has zero area but its point is inside rectA', function ()
    {
        var rectA = makeRect(0, 0, 100, 100);
        var rectB = makeRect(10, 10, 0, 0);

        expect(ContainsRect(rectA, rectB)).toBe(true);
    });

    it('should work correctly with negative coordinates', function ()
    {
        var rectA = makeRect(-100, -100, 200, 200);
        var rectB = makeRect(-50, -50, 50, 50);

        expect(ContainsRect(rectA, rectB)).toBe(true);
    });

    it('should return false when negative-coordinate rectB touches the edge of rectA', function ()
    {
        var rectA = makeRect(-100, -100, 200, 200);
        var rectB = makeRect(-100, -50, 50, 50);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should work correctly with floating point coordinates', function ()
    {
        var rectA = makeRect(0, 0, 100, 100);
        var rectB = makeRect(0.1, 0.1, 50, 50);

        expect(ContainsRect(rectA, rectB)).toBe(true);
    });

    it('should return false when rectB x is exactly at rectA x (strict containment)', function ()
    {
        var rectA = makeRect(10, 10, 100, 100);
        var rectB = makeRect(10, 20, 50, 50);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should return false when rectB bottom is exactly at rectA bottom (strict containment)', function ()
    {
        var rectA = makeRect(0, 0, 100, 100);
        var rectB = makeRect(10, 50, 50, 50);

        expect(ContainsRect(rectA, rectB)).toBe(false);
    });

    it('should handle a small rectB well inside a large rectA', function ()
    {
        var rectA = makeRect(0, 0, 1000, 1000);
        var rectB = makeRect(1, 1, 1, 1);

        expect(ContainsRect(rectA, rectB)).toBe(true);
    });
});
