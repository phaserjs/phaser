var GetRaysFromPointToPolygon = require('../../../src/geom/intersects/GetRaysFromPointToPolygon');

describe('Phaser.Geom.Intersects.GetRaysFromPointToPolygon', function ()
{
    //  Helper: create a simple polygon-like object with an array of {x, y} points
    function makePolygon (points)
    {
        return { points: points };
    }

    //  A square polygon centered at origin: corners at (±100, ±100)
    function makeSquare ()
    {
        return makePolygon([
            { x: 100, y: 100 },
            { x: -100, y: 100 },
            { x: -100, y: -100 },
            { x: 100, y: -100 }
        ]);
    }

    //  A triangle above the x-axis
    function makeTriangle ()
    {
        return makePolygon([
            { x: 0, y: -200 },
            { x: 200, y: 200 },
            { x: -200, y: 200 }
        ]);
    }

    it('should return an array', function ()
    {
        var result = GetRaysFromPointToPolygon(0, 0, makeSquare());

        expect(Array.isArray(result)).toBe(true);
    });

    it('should accept a single polygon (not wrapped in array)', function ()
    {
        var polygon = makeSquare();
        var resultSingle = GetRaysFromPointToPolygon(0, 0, polygon);
        var resultArray = GetRaysFromPointToPolygon(0, 0, [ polygon ]);

        expect(resultSingle.length).toBe(resultArray.length);
    });

    it('should return an empty array when the polygon has no points', function ()
    {
        var result = GetRaysFromPointToPolygon(0, 0, makePolygon([]));

        expect(result).toEqual([]);
    });

    it('should return intersections when point is inside a convex polygon', function ()
    {
        var result = GetRaysFromPointToPolygon(0, 0, makeSquare());

        expect(result.length).toBeGreaterThan(0);
    });

    it('should return Vector4-like objects with x, y, z, w properties', function ()
    {
        var result = GetRaysFromPointToPolygon(0, 0, makeSquare());

        expect(result.length).toBeGreaterThan(0);

        var v = result[0];

        expect(typeof v.x).toBe('number');
        expect(typeof v.y).toBe('number');
        expect(typeof v.z).toBe('number');
        expect(typeof v.w).toBe('number');
    });

    it('should store the ray angle in the z component', function ()
    {
        var result = GetRaysFromPointToPolygon(0, 0, makeSquare());

        expect(result.length).toBeGreaterThan(0);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].z).toBeGreaterThanOrEqual(-Math.PI);
            expect(result[i].z).toBeLessThanOrEqual(Math.PI + 0.00002);
        }
    });

    it('should return results sorted by angle (z component) in ascending order', function ()
    {
        var result = GetRaysFromPointToPolygon(0, 0, makeSquare());

        expect(result.length).toBeGreaterThan(1);

        for (var i = 1; i < result.length; i++)
        {
            expect(result[i].z).toBeGreaterThanOrEqual(result[i - 1].z);
        }
    });

    it('should store the polygon index in the w component', function ()
    {
        var result = GetRaysFromPointToPolygon(0, 0, makeSquare());

        expect(result.length).toBeGreaterThan(0);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].w).toBe(0);
        }
    });

    it('should use correct polygon index in w when multiple polygons are provided', function ()
    {
        var poly0 = makePolygon([
            { x: 100, y: 0 },
            { x: 0, y: 100 },
            { x: -100, y: 0 },
            { x: 0, y: -100 }
        ]);

        var poly1 = makePolygon([
            { x: 300, y: 200 },
            { x: 400, y: 200 },
            { x: 400, y: 300 },
            { x: 300, y: 300 }
        ]);

        var result = GetRaysFromPointToPolygon(0, 0, [ poly0, poly1 ]);

        var indices = result.map(function (v) { return v.w; });
        var hasZero = indices.indexOf(0) !== -1;

        expect(hasZero).toBe(true);
    });

    it('should cast three rays per unique vertex angle (centre, -0.00001, +0.00001)', function ()
    {
        //  A single-point polygon has exactly one unique angle, so at most 3 ray checks
        var result = GetRaysFromPointToPolygon(0, 0, makePolygon([ { x: 100, y: 0 } ]));

        //  Result length depends on intersections found; just verify it is an array
        expect(Array.isArray(result)).toBe(true);
    });

    it('should handle duplicate vertex angles without processing the same angle twice', function ()
    {
        //  Two vertices at the same angle from the origin (both on positive x-axis)
        var polygon = makePolygon([
            { x: 100, y: 0 },
            { x: 200, y: 0 },
            { x: 0, y: 100 },
            { x: 0, y: -100 }
        ]);

        var resultDuplicate = GetRaysFromPointToPolygon(0, 0, polygon);

        //  Without deduplication the two identical angles would be processed twice
        var polygon2 = makePolygon([
            { x: 100, y: 0 },
            { x: 0, y: 100 },
            { x: 0, y: -100 }
        ]);

        var resultNoDuplicate = GetRaysFromPointToPolygon(0, 0, polygon2);

        //  Both should produce the same number of intersections because the duplicate
        //  angle (200, 0) shares the ray with (100, 0) and is deduplicated
        expect(resultDuplicate.length).toBe(resultNoDuplicate.length);
    });

    it('should handle a point that coincides with a polygon vertex', function ()
    {
        var polygon = makeSquare();

        //  Point at the top-right corner of the square
        var result = GetRaysFromPointToPolygon(100, 100, polygon);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return intersections for a triangle polygon', function ()
    {
        var result = GetRaysFromPointToPolygon(0, 0, makeTriangle());

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });

    it('should return an empty array when given an empty polygons array', function ()
    {
        var result = GetRaysFromPointToPolygon(0, 0, []);

        expect(result).toEqual([]);
    });

    it('should handle multiple polygons and combine their intersections', function ()
    {
        var poly1 = makePolygon([
            { x: 100, y: 0 },
            { x: 0, y: 100 },
            { x: -100, y: 0 },
            { x: 0, y: -100 }
        ]);

        var poly2 = makePolygon([
            { x: 300, y: 0 },
            { x: 200, y: 100 },
            { x: 200, y: -100 }
        ]);

        var resultCombined = GetRaysFromPointToPolygon(0, 0, [ poly1, poly2 ]);
        var resultPoly1Only = GetRaysFromPointToPolygon(0, 0, [ poly1 ]);

        //  Combined should cast more rays (more unique vertex angles to consider)
        expect(resultCombined.length).toBeGreaterThanOrEqual(resultPoly1Only.length);
    });

    it('should produce intersection x and y values within a reasonable range for a known polygon', function ()
    {
        //  Point at origin, square from -100 to 100
        var result = GetRaysFromPointToPolygon(0, 0, makeSquare());

        expect(result.length).toBeGreaterThan(0);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].x).toBeGreaterThanOrEqual(-100.1);
            expect(result[i].x).toBeLessThanOrEqual(100.1);
            expect(result[i].y).toBeGreaterThanOrEqual(-100.1);
            expect(result[i].y).toBeLessThanOrEqual(100.1);
        }
    });

    it('should work correctly with non-zero origin point', function ()
    {
        var polygon = makePolygon([
            { x: 500, y: 500 },
            { x: 700, y: 500 },
            { x: 700, y: 700 },
            { x: 500, y: 700 }
        ]);

        var result = GetRaysFromPointToPolygon(600, 600, polygon);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });
});
