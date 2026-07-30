var Rotate = require('../../../src/geom/triangle/Rotate');
var InCenter = require('../../../src/geom/triangle/InCenter');

describe('Phaser.Geom.Triangle.Rotate', function ()
{
    function makeTri (x1, y1, x2, y2, x3, y3)
    {
        return { x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3 };
    }

    it('should return the same triangle object', function ()
    {
        var tri = makeTri(0, 0, 100, 0, 50, 100);
        var result = Rotate(tri, 0);
        expect(result).toBe(tri);
    });

    it('should not change vertex positions when rotating by zero', function ()
    {
        var tri = makeTri(0, 0, 100, 0, 50, 100);
        Rotate(tri, 0);
        expect(tri.x1).toBeCloseTo(0);
        expect(tri.y1).toBeCloseTo(0);
        expect(tri.x2).toBeCloseTo(100);
        expect(tri.y2).toBeCloseTo(0);
        expect(tri.x3).toBeCloseTo(50);
        expect(tri.y3).toBeCloseTo(100);
    });

    it('should not change vertex positions when rotating by 2*PI (full rotation)', function ()
    {
        var tri = makeTri(0, 0, 100, 0, 50, 100);
        Rotate(tri, Math.PI * 2);
        expect(tri.x1).toBeCloseTo(0);
        expect(tri.y1).toBeCloseTo(0);
        expect(tri.x2).toBeCloseTo(100);
        expect(tri.y2).toBeCloseTo(0);
        expect(tri.x3).toBeCloseTo(50);
        expect(tri.y3).toBeCloseTo(100);
    });

    it('should rotate vertices around the incenter', function ()
    {
        var tri = makeTri(0, 0, 100, 0, 50, 100);
        var center = InCenter(tri);
        var cx = center.x;
        var cy = center.y;

        // distance from each vertex to incenter should be preserved after rotation
        var d1Before = Math.sqrt(Math.pow(tri.x1 - cx, 2) + Math.pow(tri.y1 - cy, 2));
        var d2Before = Math.sqrt(Math.pow(tri.x2 - cx, 2) + Math.pow(tri.y2 - cy, 2));
        var d3Before = Math.sqrt(Math.pow(tri.x3 - cx, 2) + Math.pow(tri.y3 - cy, 2));

        Rotate(tri, Math.PI / 4);

        var newCenter = InCenter(tri);
        var d1After = Math.sqrt(Math.pow(tri.x1 - newCenter.x, 2) + Math.pow(tri.y1 - newCenter.y, 2));
        var d2After = Math.sqrt(Math.pow(tri.x2 - newCenter.x, 2) + Math.pow(tri.y2 - newCenter.y, 2));
        var d3After = Math.sqrt(Math.pow(tri.x3 - newCenter.x, 2) + Math.pow(tri.y3 - newCenter.y, 2));

        expect(d1After).toBeCloseTo(d1Before);
        expect(d2After).toBeCloseTo(d2Before);
        expect(d3After).toBeCloseTo(d3Before);
    });

    it('should rotate by PI/2 (90 degrees) correctly', function ()
    {
        var tri = makeTri(0, 0, 100, 0, 50, 100);
        var center = InCenter(tri);
        var cx = center.x;
        var cy = center.y;

        // compute expected positions manually for vertex 1
        var angle = Math.PI / 2;
        var tx = tri.x1 - cx;
        var ty = tri.y1 - cy;
        var expectedX1 = tx * Math.cos(angle) - ty * Math.sin(angle) + cx;
        var expectedY1 = tx * Math.sin(angle) + ty * Math.cos(angle) + cy;

        Rotate(tri, angle);

        expect(tri.x1).toBeCloseTo(expectedX1);
        expect(tri.y1).toBeCloseTo(expectedY1);
    });

    it('should rotate by PI (180 degrees), placing vertices opposite the incenter', function ()
    {
        var tri = makeTri(0, 0, 100, 0, 50, 100);
        var center = InCenter(tri);
        var cx = center.x;
        var cy = center.y;

        var orig = { x1: tri.x1, y1: tri.y1, x2: tri.x2, y2: tri.y2, x3: tri.x3, y3: tri.y3 };

        Rotate(tri, Math.PI);

        // After 180-degree rotation, each vertex should be reflected through the incenter
        expect(tri.x1).toBeCloseTo(2 * cx - orig.x1);
        expect(tri.y1).toBeCloseTo(2 * cy - orig.y1);
        expect(tri.x2).toBeCloseTo(2 * cx - orig.x2);
        expect(tri.y2).toBeCloseTo(2 * cy - orig.y2);
        expect(tri.x3).toBeCloseTo(2 * cx - orig.x3);
        expect(tri.y3).toBeCloseTo(2 * cy - orig.y3);
    });

    it('should handle negative rotation angles', function ()
    {
        var triPos = makeTri(0, 0, 100, 0, 50, 100);
        var triNeg = makeTri(0, 0, 100, 0, 50, 100);

        Rotate(triPos, Math.PI / 3);
        Rotate(triNeg, -Math.PI / 3);

        // positive and negative rotations should move vertices in opposite directions
        // rotating by +angle then -angle should cancel out
        var triBack = makeTri(triPos.x1, triPos.y1, triPos.x2, triPos.y2, triPos.x3, triPos.y3);
        Rotate(triBack, -Math.PI / 3);

        expect(triBack.x1).toBeCloseTo(0);
        expect(triBack.y1).toBeCloseTo(0);
        expect(triBack.x2).toBeCloseTo(100);
        expect(triBack.y2).toBeCloseTo(0);
        expect(triBack.x3).toBeCloseTo(50);
        expect(triBack.y3).toBeCloseTo(100);
    });

    it('should produce NaN for a degenerate triangle (zero perimeter causes division by zero in incenter)', function ()
    {
        var tri = makeTri(0, 0, 0, 0, 0, 0);
        Rotate(tri, Math.PI / 4);
        // InCenter divides by zero when all vertices coincide; results are NaN
        expect(isNaN(tri.x1)).toBe(true);
        expect(isNaN(tri.y1)).toBe(true);
    });

    it('should handle a triangle with negative coordinates', function ()
    {
        var tri = makeTri(-50, -50, 50, -50, 0, 50);
        var center = InCenter(tri);
        var cx = center.x;
        var cy = center.y;

        var d1 = Math.sqrt(Math.pow(tri.x1 - cx, 2) + Math.pow(tri.y1 - cy, 2));

        Rotate(tri, Math.PI / 6);

        var newCenter = InCenter(tri);
        var d1After = Math.sqrt(Math.pow(tri.x1 - newCenter.x, 2) + Math.pow(tri.y1 - newCenter.y, 2));

        expect(d1After).toBeCloseTo(d1);
    });

    it('should mutate the triangle in place', function ()
    {
        var tri = makeTri(0, 0, 100, 0, 50, 100);
        Rotate(tri, Math.PI / 4);
        // vertices should have changed from original values for a non-trivial angle
        var unchanged = (
            tri.x1 === 0 && tri.y1 === 0 &&
            tri.x2 === 100 && tri.y2 === 0 &&
            tri.x3 === 50 && tri.y3 === 100
        );
        expect(unchanged).toBe(false);
    });
});
