var GetLineToLine = require('../../../src/geom/intersects/GetLineToLine');
var Vector3 = require('../../../src/math/Vector3');

describe('Phaser.Geom.Intersects.GetLineToLine', function ()
{
    function makeLine(x1, y1, x2, y2)
    {
        return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }

    // -------------------------------------------------------------------------
    // Parallel / no-intersection cases
    // -------------------------------------------------------------------------

    it('should return null for parallel horizontal lines', function ()
    {
        var line1 = makeLine(0, 0, 10, 0);
        var line2 = makeLine(0, 5, 10, 5);

        expect(GetLineToLine(line1, line2)).toBeNull();
    });

    it('should return null for parallel vertical lines', function ()
    {
        var line1 = makeLine(0, 0, 0, 10);
        var line2 = makeLine(5, 0, 5, 10);

        expect(GetLineToLine(line1, line2)).toBeNull();
    });

    it('should return null for parallel diagonal lines', function ()
    {
        var line1 = makeLine(0, 0, 10, 10);
        var line2 = makeLine(0, 5, 10, 15);

        expect(GetLineToLine(line1, line2)).toBeNull();
    });

    it('should return null when segments do not reach each other (T shape, no overlap)', function ()
    {
        var line1 = makeLine(0, 0, 4, 0);
        var line2 = makeLine(6, -5, 6, 5);

        expect(GetLineToLine(line1, line2)).toBeNull();
    });

    it('should return null when lines would intersect as rays but segments do not overlap', function ()
    {
        var line1 = makeLine(0, 0, 1, 0);
        var line2 = makeLine(5, -1, 5, 1);

        expect(GetLineToLine(line1, line2)).toBeNull();
    });

    // -------------------------------------------------------------------------
    // Basic intersections (segment mode)
    // -------------------------------------------------------------------------

    it('should return a Vector3 when segments intersect', function ()
    {
        var line1 = makeLine(0, 0, 10, 0);
        var line2 = makeLine(5, -5, 5, 5);

        var result = GetLineToLine(line1, line2);

        expect(result).not.toBeNull();
        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(0);
    });

    it('should return correct intersection for two diagonal lines', function ()
    {
        var line1 = makeLine(0, 0, 10, 10);
        var line2 = makeLine(0, 10, 10, 0);

        var result = GetLineToLine(line1, line2);

        expect(result).not.toBeNull();
        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(5);
    });

    it('should return t=0.5 when intersection is at the midpoint of line1', function ()
    {
        var line1 = makeLine(0, 0, 10, 0);
        var line2 = makeLine(5, -5, 5, 5);

        var result = GetLineToLine(line1, line2);

        expect(result).not.toBeNull();
        expect(result.z).toBeCloseTo(0.5);
    });

    it('should return t=0 when intersection is at the start of line1', function ()
    {
        var line1 = makeLine(0, 0, 10, 0);
        var line2 = makeLine(0, -5, 0, 5);

        var result = GetLineToLine(line1, line2);

        expect(result).not.toBeNull();
        expect(result.z).toBeCloseTo(0);
        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(0);
    });

    it('should return t=1 when intersection is at the end of line1', function ()
    {
        var line1 = makeLine(0, 0, 10, 0);
        var line2 = makeLine(10, -5, 10, 5);

        var result = GetLineToLine(line1, line2);

        expect(result).not.toBeNull();
        expect(result.z).toBeCloseTo(1);
        expect(result.x).toBeCloseTo(10);
        expect(result.y).toBeCloseTo(0);
    });

    it('should return an instance of Vector3', function ()
    {
        var line1 = makeLine(0, 0, 10, 0);
        var line2 = makeLine(5, -5, 5, 5);

        var result = GetLineToLine(line1, line2);

        expect(result).toBeInstanceOf(Vector3);
    });

    // -------------------------------------------------------------------------
    // out parameter
    // -------------------------------------------------------------------------

    it('should populate a provided out Vector3', function ()
    {
        var line1 = makeLine(0, 0, 10, 0);
        var line2 = makeLine(5, -5, 5, 5);
        var out = new Vector3();

        var result = GetLineToLine(line1, line2, false, out);

        expect(result).toBe(out);
        expect(out.x).toBeCloseTo(5);
        expect(out.y).toBeCloseTo(0);
        expect(out.z).toBeCloseTo(0.5);
    });

    it('should create a new Vector3 when out is not provided', function ()
    {
        var line1 = makeLine(0, 0, 10, 0);
        var line2 = makeLine(5, -5, 5, 5);

        var result = GetLineToLine(line1, line2);

        expect(result).toBeInstanceOf(Vector3);
    });

    // -------------------------------------------------------------------------
    // isRay mode
    // -------------------------------------------------------------------------

    it('should return null when isRay=false and intersection is beyond line1 end', function ()
    {
        var line1 = makeLine(0, 0, 3, 0);
        var line2 = makeLine(5, -5, 5, 5);

        expect(GetLineToLine(line1, line2, false)).toBeNull();
    });

    it('should intersect beyond the segment end when isRay=true (u has no upper bound)', function ()
    {
        // line1 goes from (0,0) to (3,0); line2 crosses at x=5 (beyond line1's end)
        // In ray mode: u (param along line1/ray) has no upper bound — only t (param along line2) must be [0,1]
        var line1 = makeLine(0, 0, 3, 0);
        var line2 = makeLine(5, -5, 5, 5);

        // t = 0.5 (within line2), u = 5/3 > 1 but allowed as a ray → should return intersection
        var result = GetLineToLine(line1, line2, true);

        expect(result).not.toBeNull();
        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(0);
    });

    it('should return intersection in ray mode when line2 is within range', function ()
    {
        // line1 is a short segment, line2 (ray) crosses through it
        var line1 = makeLine(0, 0, 10, 0);
        var line2 = makeLine(5, -1, 5, 1);

        var result = GetLineToLine(line1, line2, true);

        expect(result).not.toBeNull();
        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(0);
    });

    it('should return null in ray mode when line1 is degenerate (zero length)', function ()
    {
        var line1 = makeLine(5, 5, 5, 5);
        var line2 = makeLine(0, 0, 10, 10);

        // denom will be 0 for a degenerate line1 (dx1=0, dy1=0)
        expect(GetLineToLine(line1, line2, true)).toBeNull();
    });

    it('should return null in ray mode when t is negative (intersection behind ray origin)', function ()
    {
        // line2 is short and sits to the left; line1 points right — no backwards hit
        var line1 = makeLine(10, 0, 20, 0);
        var line2 = makeLine(5, -5, 5, 5);

        // t = param along line2, u = param along line1 — u will be negative
        expect(GetLineToLine(line1, line2, true)).toBeNull();
    });

    // -------------------------------------------------------------------------
    // Edge / floating point cases
    // -------------------------------------------------------------------------

    it('should handle negative coordinate lines', function ()
    {
        var line1 = makeLine(-10, -10, 10, 10);
        var line2 = makeLine(-10, 10, 10, -10);

        var result = GetLineToLine(line1, line2);

        expect(result).not.toBeNull();
        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(0);
    });

    it('should handle floating point coordinates', function ()
    {
        var line1 = makeLine(0, 0, 1, 0);
        var line2 = makeLine(0.5, -0.5, 0.5, 0.5);

        var result = GetLineToLine(line1, line2);

        expect(result).not.toBeNull();
        expect(result.x).toBeCloseTo(0.5);
        expect(result.y).toBeCloseTo(0);
        expect(result.z).toBeCloseTo(0.5);
    });

    it('should handle a vertical line1 and horizontal line2', function ()
    {
        var line1 = makeLine(5, 0, 5, 10);
        var line2 = makeLine(0, 5, 10, 5);

        var result = GetLineToLine(line1, line2);

        expect(result).not.toBeNull();
        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(5);
        expect(result.z).toBeCloseTo(0.5);
    });

    it('should return null when denom is zero (collinear overlapping lines)', function ()
    {
        var line1 = makeLine(0, 0, 10, 0);
        var line2 = makeLine(2, 0, 8, 0);

        expect(GetLineToLine(line1, line2)).toBeNull();
    });

    it('should default isRay to false when not provided', function ()
    {
        // Segments that intersect — should return a result regardless of isRay default
        var line1 = makeLine(0, 0, 10, 0);
        var line2 = makeLine(5, -5, 5, 5);

        var result1 = GetLineToLine(line1, line2);
        var result2 = GetLineToLine(line1, line2, false);

        expect(result1).not.toBeNull();
        expect(result2).not.toBeNull();
        expect(result1.x).toBeCloseTo(result2.x);
        expect(result1.y).toBeCloseTo(result2.y);
        expect(result1.z).toBeCloseTo(result2.z);
    });
});
