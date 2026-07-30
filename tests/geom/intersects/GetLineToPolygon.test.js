var GetLineToPolygon = require('../../../src/geom/intersects/GetLineToPolygon');
var Vector4 = require('../../../src/math/Vector4');

//  Helper: create a plain-object line with x1, y1, x2, y2
function makeLine (x1, y1, x2, y2)
{
    return { x1: x1, y1: y1, x2: x2, y2: y2 };
}

//  Helper: create a minimal polygon-like object with a points array
function makePolygon (points)
{
    return { points: points };
}

//  Shared test geometry:
//  A horizontal line along y=0 from x=0 to x=10.
//  Polygons that straddle y=0 (i.e. cross y=0) will intersect it.
//  Their left vertical edge is the first intersection found (smallest t).
//
//  hitPoly:  square at x=4–6 crossing y=0 — closest segment at x=4, t=0.4
//  nearPoly: square at x=1–3 crossing y=0 — closest segment at x=1, t=0.1
//  farPoly:  square at x=7–9 crossing y=0 — closest segment at x=7, t=0.7
//  noHitPoly: square entirely above y=0 — no intersection

describe('Phaser.Geom.Intersects.GetLineToPolygon', function ()
{
    var line;
    var hitPoly;
    var nearPoly;
    var farPoly;
    var noHitPoly;

    beforeEach(function ()
    {
        line = makeLine(0, 0, 10, 0);

        hitPoly  = makePolygon([{ x: 4, y: -1 }, { x: 6, y: -1 }, { x: 6, y: 1 }, { x: 4, y: 1 }]);
        nearPoly = makePolygon([{ x: 1, y: -1 }, { x: 3, y: -1 }, { x: 3, y: 1 }, { x: 1, y: 1 }]);
        farPoly  = makePolygon([{ x: 7, y: -1 }, { x: 9, y: -1 }, { x: 9, y: 1 }, { x: 7, y: 1 }]);
        noHitPoly = makePolygon([{ x: 1, y: 5 }, { x: 9, y: 5 }, { x: 9, y: 9 }, { x: 1, y: 9 }]);
    });

    // -------------------------------------------------------------------------
    // Null / no-intersection cases
    // -------------------------------------------------------------------------

    it('should return null when the polygon array is empty', function ()
    {
        var result = GetLineToPolygon(line, []);

        expect(result).toBeNull();
    });

    it('should return null when a single polygon does not intersect the line', function ()
    {
        var result = GetLineToPolygon(line, [noHitPoly]);

        expect(result).toBeNull();
    });

    it('should return null when none of multiple polygons intersect the line', function ()
    {
        var result = GetLineToPolygon(line, [noHitPoly, noHitPoly]);

        expect(result).toBeNull();
    });

    // -------------------------------------------------------------------------
    // Basic intersection
    // -------------------------------------------------------------------------

    it('should return a Vector4 when an intersection is found', function ()
    {
        var result = GetLineToPolygon(line, [hitPoly]);

        expect(result).not.toBeNull();
        expect(result).toBeInstanceOf(Vector4);
    });

    it('should set x and y to the intersection point coordinates', function ()
    {
        var result = GetLineToPolygon(line, [hitPoly]);

        //  hitPoly left edge is vertical at x=4, crossing y=0
        expect(result.x).toBeCloseTo(4, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should set z to the parametric t value of the closest intersection', function ()
    {
        var result = GetLineToPolygon(line, [hitPoly]);

        //  x=4 is 40% of the way along a line from x=0 to x=10
        expect(result.z).toBeCloseTo(0.4, 5);
    });

    it('should set w to 0 when only one polygon is provided as an array', function ()
    {
        var result = GetLineToPolygon(line, [hitPoly]);

        expect(result.w).toBe(0);
    });

    // -------------------------------------------------------------------------
    // Single polygon (non-array) input
    // -------------------------------------------------------------------------

    it('should accept a single polygon object instead of an array', function ()
    {
        var result = GetLineToPolygon(line, hitPoly);

        expect(result).not.toBeNull();
        expect(result.x).toBeCloseTo(4, 5);
        expect(result.w).toBe(0);
    });

    // -------------------------------------------------------------------------
    // Multiple polygons — closest wins
    // -------------------------------------------------------------------------

    it('should return the intersection from the closest polygon when multiple intersect', function ()
    {
        //  farPoly (index 0) intersects at t≈0.7; nearPoly (index 1) at t≈0.1
        var result = GetLineToPolygon(line, [farPoly, nearPoly]);

        expect(result.x).toBeCloseTo(1, 5);
        expect(result.z).toBeCloseTo(0.1, 5);
    });

    it('should set w to the index of the closest polygon', function ()
    {
        //  nearPoly is at index 1
        var result = GetLineToPolygon(line, [farPoly, nearPoly]);

        expect(result.w).toBe(1);
    });

    it('should keep the first polygon result when it is already the closest', function ()
    {
        //  nearPoly (index 0) at t≈0.1 is closer than farPoly (index 1) at t≈0.7
        var result = GetLineToPolygon(line, [nearPoly, farPoly]);

        expect(result.x).toBeCloseTo(1, 5);
        expect(result.w).toBe(0);
    });

    it('should ignore non-intersecting polygons and return the intersecting one', function ()
    {
        //  noHitPoly (index 0) misses; hitPoly (index 1) hits
        var result = GetLineToPolygon(line, [noHitPoly, hitPoly]);

        expect(result).not.toBeNull();
        expect(result.w).toBe(1);
    });

    it('should correctly identify the closest among three intersecting polygons', function ()
    {
        //  Order: far (t≈0.7), hit (t≈0.4), near (t≈0.1) — near should win at index 2
        var result = GetLineToPolygon(line, [farPoly, hitPoly, nearPoly]);

        expect(result.x).toBeCloseTo(1, 5);
        expect(result.w).toBe(2);
    });

    // -------------------------------------------------------------------------
    // out parameter
    // -------------------------------------------------------------------------

    it('should write results into the provided out Vector4', function ()
    {
        var out = new Vector4();
        var result = GetLineToPolygon(line, [hitPoly], false, out);

        expect(result).toBe(out);
    });

    it('should populate the provided out Vector4 with intersection values', function ()
    {
        var out = new Vector4();
        GetLineToPolygon(line, [hitPoly], false, out);

        expect(out.x).toBeCloseTo(4, 5);
        expect(out.y).toBeCloseTo(0, 5);
        expect(out.z).toBeCloseTo(0.4, 5);
        expect(out.w).toBe(0);
    });

    it('should create a new Vector4 when no out is provided', function ()
    {
        var result = GetLineToPolygon(line, [hitPoly]);

        expect(result).toBeInstanceOf(Vector4);
    });

    it('should reset out to zero when no intersection is found', function ()
    {
        var out = new Vector4();
        out.set(99, 99, 99, 99);

        var result = GetLineToPolygon(line, [noHitPoly], false, out);

        expect(result).toBeNull();
        expect(out.x).toBe(0);
        expect(out.y).toBe(0);
        expect(out.z).toBe(0);
        expect(out.w).toBe(0);
    });

    // -------------------------------------------------------------------------
    // isRay flag
    // -------------------------------------------------------------------------

    it('should not intersect a polygon beyond the line endpoint when isRay is false', function ()
    {
        //  Short segment from (0,0) to (5,0); farPoly is at x=7 which is beyond x=5
        var shortLine = makeLine(0, 0, 5, 0);
        var result = GetLineToPolygon(shortLine, [farPoly], false);

        expect(result).toBeNull();
    });

    it('should intersect a polygon beyond the line endpoint when isRay is true', function ()
    {
        //  Short segment treated as ray; farPoly at x=7 is beyond x=5 but ray continues
        var shortLine = makeLine(0, 0, 5, 0);
        var result = GetLineToPolygon(shortLine, [farPoly], true);

        expect(result).not.toBeNull();
        expect(result.x).toBeCloseTo(7, 5);
    });
});
