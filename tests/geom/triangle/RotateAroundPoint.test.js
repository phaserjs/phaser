var RotateAroundPoint = require('../../../src/geom/triangle/RotateAroundPoint');

describe('Phaser.Geom.Triangle.RotateAroundPoint', function ()
{
    function makeTriangle (x1, y1, x2, y2, x3, y3)
    {
        return { x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3 };
    }

    function makePoint (x, y)
    {
        return { x: x, y: y };
    }

    it('should return the same triangle object', function ()
    {
        var tri = makeTriangle(0, 0, 1, 0, 0, 1);
        var point = makePoint(0, 0);
        var result = RotateAroundPoint(tri, point, 0);
        expect(result).toBe(tri);
    });

    it('should not change the triangle when angle is zero', function ()
    {
        var tri = makeTriangle(1, 2, 3, 4, 5, 6);
        var point = makePoint(0, 0);
        RotateAroundPoint(tri, point, 0);
        expect(tri.x1).toBeCloseTo(1);
        expect(tri.y1).toBeCloseTo(2);
        expect(tri.x2).toBeCloseTo(3);
        expect(tri.y2).toBeCloseTo(4);
        expect(tri.x3).toBeCloseTo(5);
        expect(tri.y3).toBeCloseTo(6);
    });

    it('should rotate 90 degrees around the origin', function ()
    {
        var tri = makeTriangle(1, 0, 0, 1, -1, 0);
        var point = makePoint(0, 0);
        RotateAroundPoint(tri, point, Math.PI / 2);
        expect(tri.x1).toBeCloseTo(0);
        expect(tri.y1).toBeCloseTo(1);
        expect(tri.x2).toBeCloseTo(-1);
        expect(tri.y2).toBeCloseTo(0);
        expect(tri.x3).toBeCloseTo(0);
        expect(tri.y3).toBeCloseTo(-1);
    });

    it('should rotate 180 degrees around the origin', function ()
    {
        var tri = makeTriangle(1, 0, 0, 1, 2, 3);
        var point = makePoint(0, 0);
        RotateAroundPoint(tri, point, Math.PI);
        expect(tri.x1).toBeCloseTo(-1);
        expect(tri.y1).toBeCloseTo(0);
        expect(tri.x2).toBeCloseTo(0);
        expect(tri.y2).toBeCloseTo(-1);
        expect(tri.x3).toBeCloseTo(-2);
        expect(tri.y3).toBeCloseTo(-3);
    });

    it('should rotate 360 degrees and return to original position', function ()
    {
        var tri = makeTriangle(3, 1, 5, 2, 1, 4);
        var point = makePoint(0, 0);
        RotateAroundPoint(tri, point, Math.PI * 2);
        expect(tri.x1).toBeCloseTo(3);
        expect(tri.y1).toBeCloseTo(1);
        expect(tri.x2).toBeCloseTo(5);
        expect(tri.y2).toBeCloseTo(2);
        expect(tri.x3).toBeCloseTo(1);
        expect(tri.y3).toBeCloseTo(4);
    });

    it('should rotate around a non-origin point', function ()
    {
        var tri = makeTriangle(2, 1, 4, 1, 3, 3);
        var point = makePoint(3, 1);
        RotateAroundPoint(tri, point, Math.PI / 2);
        // x1=2,y1=1 relative to (3,1) is (-1,0) -> rotated 90deg -> (0,-1) -> absolute (3,0)
        expect(tri.x1).toBeCloseTo(3);
        expect(tri.y1).toBeCloseTo(0);
        // x2=4,y2=1 relative to (3,1) is (1,0) -> rotated 90deg -> (0,1) -> absolute (3,2)
        expect(tri.x2).toBeCloseTo(3);
        expect(tri.y2).toBeCloseTo(2);
        // x3=3,y3=3 relative to (3,1) is (0,2) -> rotated 90deg -> (-2,0) -> absolute (1,1)
        expect(tri.x3).toBeCloseTo(1);
        expect(tri.y3).toBeCloseTo(1);
    });

    it('should rotate a triangle with a negative angle', function ()
    {
        var tri = makeTriangle(0, 1, 1, 0, 0, -1);
        var point = makePoint(0, 0);
        RotateAroundPoint(tri, point, -Math.PI / 2);
        // (0,1) rotated -90 deg -> (1,0)
        expect(tri.x1).toBeCloseTo(1);
        expect(tri.y1).toBeCloseTo(0);
        // (1,0) rotated -90 deg -> (0,-1)
        expect(tri.x2).toBeCloseTo(0);
        expect(tri.y2).toBeCloseTo(-1);
        // (0,-1) rotated -90 deg -> (-1,0)
        expect(tri.x3).toBeCloseTo(-1);
        expect(tri.y3).toBeCloseTo(0);
    });

    it('should use point.x and point.y as the pivot', function ()
    {
        var tri = makeTriangle(5, 5, 7, 5, 5, 7);
        var point = makePoint(5, 5);
        RotateAroundPoint(tri, point, Math.PI / 2);
        // vertex at pivot should not move
        expect(tri.x1).toBeCloseTo(5);
        expect(tri.y1).toBeCloseTo(5);
        // (7,5) relative to (5,5) is (2,0) -> rotated 90deg -> (0,2) -> absolute (5,7)
        expect(tri.x2).toBeCloseTo(5);
        expect(tri.y2).toBeCloseTo(7);
        // (5,7) relative to (5,5) is (0,2) -> rotated 90deg -> (-2,0) -> absolute (3,5)
        expect(tri.x3).toBeCloseTo(3);
        expect(tri.y3).toBeCloseTo(5);
    });

    it('should mutate the triangle in place', function ()
    {
        var tri = makeTriangle(1, 0, 0, 1, -1, 0);
        var point = makePoint(0, 0);
        RotateAroundPoint(tri, point, Math.PI / 4);
        expect(tri.x1).not.toBeCloseTo(1);
        expect(tri.y1).not.toBeCloseTo(0);
    });

    it('should handle floating point pivot coordinates', function ()
    {
        var tri = makeTriangle(1.5, 0.5, 2.5, 0.5, 2.0, 1.5);
        var point = makePoint(2.0, 0.5);
        RotateAroundPoint(tri, point, Math.PI);
        // (1.5,0.5) relative to (2.0,0.5) is (-0.5,0) -> rotated 180 -> (0.5,0) -> (2.5,0.5)
        expect(tri.x1).toBeCloseTo(2.5);
        expect(tri.y1).toBeCloseTo(0.5);
        // (2.5,0.5) relative to (2.0,0.5) is (0.5,0) -> rotated 180 -> (-0.5,0) -> (1.5,0.5)
        expect(tri.x2).toBeCloseTo(1.5);
        expect(tri.y2).toBeCloseTo(0.5);
    });
});
