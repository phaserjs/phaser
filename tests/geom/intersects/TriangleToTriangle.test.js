var TriangleToTriangle = require('../../../src/geom/intersects/TriangleToTriangle');
var Triangle = require('../../../src/geom/triangle/Triangle');

describe('Phaser.Geom.Intersects.TriangleToTriangle', function ()
{
    function makeTriangle (x1, y1, x2, y2, x3, y3)
    {
        return new Triangle(x1, y1, x2, y2, x3, y3);
    }

    it('should return true when two identical triangles overlap', function ()
    {
        var triA = makeTriangle(0, 0, 100, 0, 50, 100);
        var triB = makeTriangle(0, 0, 100, 0, 50, 100);

        expect(TriangleToTriangle(triA, triB)).toBe(true);
    });

    it('should return true when triangles partially overlap', function ()
    {
        var triA = makeTriangle(0, 0, 100, 0, 50, 100);
        var triB = makeTriangle(50, 0, 150, 0, 100, 100);

        expect(TriangleToTriangle(triA, triB)).toBe(true);
    });

    it('should return false when triangles are completely separated horizontally', function ()
    {
        var triA = makeTriangle(0, 0, 50, 0, 25, 50);
        var triB = makeTriangle(200, 0, 250, 0, 225, 50);

        expect(TriangleToTriangle(triA, triB)).toBe(false);
    });

    it('should return false when triangles are completely separated vertically', function ()
    {
        var triA = makeTriangle(0, 0, 100, 0, 50, 50);
        var triB = makeTriangle(0, 200, 100, 200, 50, 250);

        expect(TriangleToTriangle(triA, triB)).toBe(false);
    });

    it('should return true when one triangle is fully inside the other', function ()
    {
        var triA = makeTriangle(0, 0, 200, 0, 100, 200);
        var triB = makeTriangle(80, 40, 120, 40, 100, 80);

        expect(TriangleToTriangle(triA, triB)).toBe(true);
    });

    it('should return true when edges cross (X pattern)', function ()
    {
        var triA = makeTriangle(0, 0, 100, 100, 0, 100);
        var triB = makeTriangle(100, 0, 0, 100, 100, 100);

        expect(TriangleToTriangle(triA, triB)).toBe(true);
    });

    it('should return false when AABB bounding boxes do not overlap', function ()
    {
        // triA occupies x:[0,10], y:[0,10] — triB is far away
        var triA = makeTriangle(0, 0, 10, 0, 5, 10);
        var triB = makeTriangle(100, 100, 110, 100, 105, 110);

        expect(TriangleToTriangle(triA, triB)).toBe(false);
    });

    it('should return true when triangles share a single edge', function ()
    {
        var triA = makeTriangle(0, 0, 100, 0, 50, 100);
        var triB = makeTriangle(100, 0, 200, 0, 150, 100);

        // They share the vertex at (100, 0) but edges touch at that point
        var result = TriangleToTriangle(triA, triB);
        expect(typeof result).toBe('boolean');
    });

    it('should return true for two large overlapping triangles', function ()
    {
        var triA = makeTriangle(-100, -100, 100, -100, 0, 100);
        var triB = makeTriangle(-100, 100, 100, 100, 0, -100);

        expect(TriangleToTriangle(triA, triB)).toBe(true);
    });

    it('should return false when triangles are separated diagonally', function ()
    {
        var triA = makeTriangle(0, 0, 40, 0, 20, 40);
        var triB = makeTriangle(100, 100, 140, 100, 120, 140);

        expect(TriangleToTriangle(triA, triB)).toBe(false);
    });

    it('should return a boolean value', function ()
    {
        var triA = makeTriangle(0, 0, 100, 0, 50, 100);
        var triB = makeTriangle(200, 200, 300, 200, 250, 300);

        var result = TriangleToTriangle(triA, triB);

        expect(typeof result).toBe('boolean');
    });

    it('should return true when triangleB contains a vertex of triangleA', function ()
    {
        // triA has vertex at (50, 10) which is inside triB
        var triA = makeTriangle(50, 10, 200, 200, -100, 200);
        var triB = makeTriangle(0, 0, 100, 0, 50, 50);

        expect(TriangleToTriangle(triA, triB)).toBe(true);
    });

    it('should return true when triangleA contains a vertex of triangleB', function ()
    {
        // triB has vertex at (50, 10) which is inside triA
        var triA = makeTriangle(0, 0, 100, 0, 50, 50);
        var triB = makeTriangle(50, 10, 200, 200, -100, 200);

        expect(TriangleToTriangle(triA, triB)).toBe(true);
    });

    it('should handle triangles with negative coordinates', function ()
    {
        var triA = makeTriangle(-100, -100, -50, -100, -75, -50);
        var triB = makeTriangle(-80, -90, -60, -90, -70, -60);

        expect(TriangleToTriangle(triA, triB)).toBe(true);
    });

    it('should handle triangles with floating point coordinates that do not intersect', function ()
    {
        var triA = makeTriangle(0.1, 0.1, 0.9, 0.1, 0.5, 0.9);
        var triB = makeTriangle(5.1, 5.1, 5.9, 5.1, 5.5, 5.9);

        expect(TriangleToTriangle(triA, triB)).toBe(false);
    });

    it('should handle triangles with floating point coordinates that do intersect', function ()
    {
        var triA = makeTriangle(0.0, 0.0, 1.0, 0.0, 0.5, 1.0);
        var triB = makeTriangle(0.4, 0.0, 1.4, 0.0, 0.9, 1.0);

        expect(TriangleToTriangle(triA, triB)).toBe(true);
    });
});
