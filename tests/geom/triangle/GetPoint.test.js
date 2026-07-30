var GetPoint = require('../../../src/geom/triangle/GetPoint');

// 3-4-5 right triangle (scaled x10): vertices (0,0), (30,0), (30,40)
// Line A: (0,0)→(30,0)   length 30
// Line B: (30,0)→(30,40) length 40
// Line C: (30,40)→(0,0)  length 50
// Perimeter = 120
function createMockTriangle ()
{
    return {
        getLineA: function () { return { x1: 0, y1: 0, x2: 30, y2: 0 }; },
        getLineB: function () { return { x1: 30, y1: 0, x2: 30, y2: 40 }; },
        getLineC: function () { return { x1: 30, y1: 40, x2: 0, y2: 0 }; }
    };
}

describe('Phaser.Geom.Triangle.GetPoint', function ()
{
    var triangle;

    beforeEach(function ()
    {
        triangle = createMockTriangle();
    });

    // -------------------------------------------------------------------------
    // Return value / out parameter
    // -------------------------------------------------------------------------

    it('should return a Vector2-like object with x and y properties', function ()
    {
        var result = GetPoint(triangle, 0.5);

        expect(result).toBeDefined();
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
    });

    it('should return the provided out object', function ()
    {
        var out = { x: 0, y: 0 };
        var result = GetPoint(triangle, 0.5, out);

        expect(result).toBe(out);
    });

    it('should create a new out object when none is provided', function ()
    {
        var result1 = GetPoint(triangle, 0.5);
        var result2 = GetPoint(triangle, 0.5);

        expect(result1).not.toBe(result2);
    });

    // -------------------------------------------------------------------------
    // Boundary positions (0 and 1) → start of line A
    // -------------------------------------------------------------------------

    it('should return the start of line A for position 0', function ()
    {
        var result = GetPoint(triangle, 0);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should return the start of line A for position 1', function ()
    {
        var result = GetPoint(triangle, 1);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should return the start of line A for negative positions', function ()
    {
        var result = GetPoint(triangle, -0.5);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should return the start of line A for positions greater than 1', function ()
    {
        var result = GetPoint(triangle, 1.5);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    // -------------------------------------------------------------------------
    // Points on Line A
    // perimeter=120, line A covers p in [0, 30)
    // position=0.1 → p=12; localPosition=12/30=0.4 → x=12, y=0
    // -------------------------------------------------------------------------

    it('should return a point on line A for small position values', function ()
    {
        // position=0.1 → p=12, localPosition=0.4 → (12, 0)
        var result = GetPoint(triangle, 0.1);

        expect(result.x).toBeCloseTo(12, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should return a point near the start of line A for very small positions', function ()
    {
        // position=0.01 → p=1.2, localPosition=1.2/30=0.04 → (1.2, 0)
        var result = GetPoint(triangle, 0.01);

        expect(result.x).toBeCloseTo(1.2, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    // -------------------------------------------------------------------------
    // Points on Line B
    // line B covers p in [30, 70]; position=0.5 → p=60
    // p-=30 → 30; localPosition=30/40=0.75 → x=30, y=30
    // -------------------------------------------------------------------------

    it('should return a point on line B for mid-range position values', function ()
    {
        // position=0.5 → p=60; on line B: p-30=30, local=0.75 → (30, 30)
        var result = GetPoint(triangle, 0.5);

        expect(result.x).toBeCloseTo(30, 5);
        expect(result.y).toBeCloseTo(30, 5);
    });

    it('should return the start of line B when position lands exactly at the line A/B boundary', function ()
    {
        // position=30/120=0.25 → p=30; p < 30 is false, p > 70 is false → line B
        // p-=30 → 0; localPosition=0 → (30, 0)
        var result = GetPoint(triangle, 30 / 120);

        expect(result.x).toBeCloseTo(30, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should return the end of line B when position lands exactly at the line B/C boundary', function ()
    {
        // position=70/120; p=70; p > 70 is false → line B
        // p-=30 → 40; localPosition=1 → (30, 40)
        var result = GetPoint(triangle, 70 / 120);

        expect(result.x).toBeCloseTo(30, 5);
        expect(result.y).toBeCloseTo(40, 5);
    });

    // -------------------------------------------------------------------------
    // Points on Line C
    // line C covers p > 70; position=0.75 → p=90
    // p-=70 → 20; localPosition=20/50=0.4 → x=30-12=18, y=40-16=24
    // -------------------------------------------------------------------------

    it('should return a point on line C for large position values', function ()
    {
        // position=0.75 → p=90; on line C: p-70=20, local=0.4
        // x=30+(0-30)*0.4=18, y=40+(0-40)*0.4=24
        var result = GetPoint(triangle, 0.75);

        expect(result.x).toBeCloseTo(18, 5);
        expect(result.y).toBeCloseTo(24, 5);
    });

    it('should return the end of line C (back to origin) as position approaches 1', function ()
    {
        // position very close to 1, p very close to 120 → near (0, 0)
        var result = GetPoint(triangle, 0.9999);

        expect(result.x).toBeCloseTo(0, 1);
        expect(result.y).toBeCloseTo(0, 1);
    });

    it('should return a midpoint on line C for position at the midpoint of that segment', function ()
    {
        // line C midpoint at p=95; position=95/120
        // p-=70 → 25; localPosition=25/50=0.5 → x=30-15=15, y=40-20=20
        var result = GetPoint(triangle, 95 / 120);

        expect(result.x).toBeCloseTo(15, 5);
        expect(result.y).toBeCloseTo(20, 5);
    });

    // -------------------------------------------------------------------------
    // Degenerate / edge-case triangles
    // -------------------------------------------------------------------------

    it('should return NaN coordinates for a fully degenerate zero-length triangle', function ()
    {
        // All sides zero-length → perimeter=0, division by zero → NaN
        var degenerate = {
            getLineA: function () { return { x1: 0, y1: 0, x2: 0, y2: 0 }; },
            getLineB: function () { return { x1: 0, y1: 0, x2: 0, y2: 0 }; },
            getLineC: function () { return { x1: 0, y1: 0, x2: 0, y2: 0 }; }
        };

        var result = GetPoint(degenerate, 0.5);

        expect(isNaN(result.x)).toBe(true);
        expect(isNaN(result.y)).toBe(true);
    });

    it('should handle negative coordinate triangles', function ()
    {
        var negTri = {
            getLineA: function () { return { x1: -30, y1: 0, x2: 0, y2: 0 }; },
            getLineB: function () { return { x1: 0, y1: 0, x2: 0, y2: -40 }; },
            getLineC: function () { return { x1: 0, y1: -40, x2: -30, y2: 0 }; }
        };

        // position=0 → start of line A
        var result = GetPoint(negTri, 0);

        expect(result.x).toBe(-30);
        expect(result.y).toBe(0);
    });

    it('should mutate and return the provided out object with updated coordinates', function ()
    {
        var out = { x: 999, y: 999 };

        GetPoint(triangle, 0.1);

        // without out, original out object should be unchanged
        expect(out.x).toBe(999);
        expect(out.y).toBe(999);

        GetPoint(triangle, 0.1, out);

        expect(out.x).not.toBe(999);
        expect(out.y).not.toBe(999);
    });
});
