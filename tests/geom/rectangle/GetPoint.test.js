var GetPoint = require('../../../src/geom/rectangle/GetPoint');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Rectangle.GetPoint', function ()
{
    // Helper: create a simple rectangle mock
    // right = x + width, bottom = y + height
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

    // 100x100 rect at origin — perimeter = 400
    var rect;

    beforeEach(function ()
    {
        rect = makeRect(0, 0, 100, 100);
    });

    // -------------------------------------------------------------------------
    // Output object
    // -------------------------------------------------------------------------

    it('should return a new Vector2 when no out argument is provided', function ()
    {
        var result = GetPoint(rect, 0);
        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return the provided out object', function ()
    {
        var out = new Vector2();
        var result = GetPoint(rect, 0, out);
        expect(result).toBe(out);
    });

    it('should accept a plain object as out and populate x and y', function ()
    {
        var out = { x: 0, y: 0 };
        GetPoint(rect, 0.125, out);
        expect(out.x).toBeCloseTo(50);
        expect(out.y).toBeCloseTo(0);
    });

    // -------------------------------------------------------------------------
    // Boundary: position <= 0 or >= 1 → top-left corner
    // -------------------------------------------------------------------------

    it('should return the top-left corner for position 0', function ()
    {
        var p = GetPoint(rect, 0);
        expect(p.x).toBe(rect.x);
        expect(p.y).toBe(rect.y);
    });

    it('should return the top-left corner for position 1', function ()
    {
        var p = GetPoint(rect, 1);
        expect(p.x).toBe(rect.x);
        expect(p.y).toBe(rect.y);
    });

    it('should return the top-left corner for position less than 0', function ()
    {
        var p = GetPoint(rect, -0.5);
        expect(p.x).toBe(rect.x);
        expect(p.y).toBe(rect.y);
    });

    it('should return the top-left corner for position greater than 1', function ()
    {
        var p = GetPoint(rect, 2);
        expect(p.x).toBe(rect.x);
        expect(p.y).toBe(rect.y);
    });

    // -------------------------------------------------------------------------
    // Face 1: top edge (position in (0, 0.25] on a square)
    // p = perimeter * position; p <= width → x = rect.x + p, y = rect.y
    // -------------------------------------------------------------------------

    it('should return a point on the top edge for position 0.125 (midpoint of top)', function ()
    {
        // perimeter = 400, p = 50, Face 1: x = 0+50 = 50, y = 0
        var p = GetPoint(rect, 0.125);
        expect(p.x).toBeCloseTo(50);
        expect(p.y).toBeCloseTo(0);
    });

    it('should return the top-right corner for position 0.25', function ()
    {
        // p = 100 <= width(100), Face 1: x = 0+100 = 100, y = 0
        var p = GetPoint(rect, 0.25);
        expect(p.x).toBeCloseTo(100);
        expect(p.y).toBeCloseTo(0);
    });

    // -------------------------------------------------------------------------
    // Face 2: right edge (position in (0.25, 0.5] on a square)
    // p > width → x = rect.right, y = rect.y + (p - width)
    // -------------------------------------------------------------------------

    it('should return a point on the right edge for position 0.375 (midpoint of right)', function ()
    {
        // p = 150 > 100, Face 2: x = 100, y = 0 + 50 = 50
        var p = GetPoint(rect, 0.375);
        expect(p.x).toBeCloseTo(100);
        expect(p.y).toBeCloseTo(50);
    });

    it('should return the bottom-right corner for position 0.5', function ()
    {
        // position not > 0.5; p = 200 > 100, Face 2: x = 100, y = 0+100 = 100
        var p = GetPoint(rect, 0.5);
        expect(p.x).toBeCloseTo(100);
        expect(p.y).toBeCloseTo(100);
    });

    // -------------------------------------------------------------------------
    // Face 3: bottom edge (position in (0.5, 0.75] on a square)
    // p -= (width+height); p <= width → x = rect.right - p, y = rect.bottom
    // -------------------------------------------------------------------------

    it('should return a point on the bottom edge for position 0.625 (midpoint of bottom)', function ()
    {
        // p = 250 - 200 = 50 <= 100, Face 3: x = 100-50 = 50, y = 100
        var p = GetPoint(rect, 0.625);
        expect(p.x).toBeCloseTo(50);
        expect(p.y).toBeCloseTo(100);
    });

    it('should return the bottom-left corner for position 0.75', function ()
    {
        // p = 300 - 200 = 100 <= 100, Face 3: x = 100-100 = 0, y = 100
        var p = GetPoint(rect, 0.75);
        expect(p.x).toBeCloseTo(0);
        expect(p.y).toBeCloseTo(100);
    });

    // -------------------------------------------------------------------------
    // Face 4: left edge (position in (0.75, 1) on a square)
    // p -= (width+height); p > width → x = rect.x, y = rect.bottom - (p - width)
    // -------------------------------------------------------------------------

    it('should return a point on the left edge for position 0.875 (midpoint of left)', function ()
    {
        // p = 350 - 200 = 150 > 100, Face 4: x = 0, y = 100-(150-100) = 50
        var p = GetPoint(rect, 0.875);
        expect(p.x).toBeCloseTo(0);
        expect(p.y).toBeCloseTo(50);
    });

    it('should return a point near the top-left for position just below 1', function ()
    {
        // position 0.999 → p = 399.6 - 200 = 199.6 > 100, Face 4: x=0, y=100-(99.6)=0.4
        var p = GetPoint(rect, 0.999);
        expect(p.x).toBeCloseTo(0);
        expect(p.y).toBeCloseTo(0.4);
    });

    // -------------------------------------------------------------------------
    // Non-origin rectangle
    // -------------------------------------------------------------------------

    it('should work correctly for a rectangle not at the origin', function ()
    {
        var r = makeRect(10, 20, 100, 100);
        // position 0.125 → midpoint of top edge → x = 10+50 = 60, y = 20
        var p = GetPoint(r, 0.125);
        expect(p.x).toBeCloseTo(60);
        expect(p.y).toBeCloseTo(20);
    });

    it('should return the correct top-left for a non-origin rectangle at position 0', function ()
    {
        var r = makeRect(50, 75, 200, 100);
        var p = GetPoint(r, 0);
        expect(p.x).toBe(50);
        expect(p.y).toBe(75);
    });

    it('should return right-edge midpoint for non-square rectangle at correct position', function ()
    {
        // rect 200x100 at origin, perimeter = 600
        // right edge starts at p=200 (position 200/600 = 0.333...)
        // right edge midpoint: p = 200 + 50 = 250, position = 250/600 ≈ 0.4167
        var r = makeRect(0, 0, 200, 100);
        var pos = 250 / 600;
        var p = GetPoint(r, pos);
        expect(p.x).toBeCloseTo(200);
        expect(p.y).toBeCloseTo(50);
    });

    it('should handle a very thin rectangle (height=1)', function ()
    {
        var r = makeRect(0, 0, 100, 1);
        // perimeter = 202; position 0.5 → p = 101
        // not > 0.5; p > width (101 > 100), Face 2: x = 100, y = 0 + (101-100) = 1
        var p = GetPoint(r, 0.5);
        expect(p.x).toBeCloseTo(100);
        expect(p.y).toBeCloseTo(1);
    });

    it('should handle a very thin rectangle (width=1)', function ()
    {
        var r = makeRect(0, 0, 1, 100);
        // perimeter = 202; position 0.5 → p = 101
        // not > 0.5; p > width (101 > 1), Face 2: x = 1, y = 0 + (101-1) = 100
        var p = GetPoint(r, 0.5);
        expect(p.x).toBeCloseTo(1);
        expect(p.y).toBeCloseTo(100);
    });

    // -------------------------------------------------------------------------
    // Floating-point positions
    // -------------------------------------------------------------------------

    it('should handle floating-point positions correctly on top edge', function ()
    {
        // position 0.1 → p = 40, Face 1: x = 40, y = 0
        var p = GetPoint(rect, 0.1);
        expect(p.x).toBeCloseTo(40);
        expect(p.y).toBeCloseTo(0);
    });

    it('should handle floating-point positions correctly on bottom edge', function ()
    {
        // position 0.6 → p = 240 - 200 = 40 <= 100, Face 3: x = 100-40 = 60, y = 100
        var p = GetPoint(rect, 0.6);
        expect(p.x).toBeCloseTo(60);
        expect(p.y).toBeCloseTo(100);
    });

    // -------------------------------------------------------------------------
    // Position just past 0.5
    // -------------------------------------------------------------------------

    it('should switch to face 3/4 logic for position just above 0.5', function ()
    {
        // position 0.5001 → p = 400*0.5001 = 200.04 - 200 = 0.04 <= 100
        // Face 3: x = 100 - 0.04 = 99.96, y = 100
        var p = GetPoint(rect, 0.5001);
        expect(p.x).toBeCloseTo(99.96, 1);
        expect(p.y).toBeCloseTo(100);
    });
});
