var TriangleToCircle = require('../../../src/geom/intersects/TriangleToCircle');

function makeTriangle (x1, y1, x2, y2, x3, y3)
{
    return {
        x1: x1, y1: y1,
        x2: x2, y2: y2,
        x3: x3, y3: y3,
        left: Math.min(x1, x2, x3),
        right: Math.max(x1, x2, x3),
        top: Math.min(y1, y2, y3),
        bottom: Math.max(y1, y2, y3),
        getLineA: function () { return { x1: x1, y1: y1, x2: x2, y2: y2 }; },
        getLineB: function () { return { x1: x2, y1: y2, x2: x3, y2: y3 }; },
        getLineC: function () { return { x1: x3, y1: y3, x2: x1, y2: y1 }; }
    };
}

function makeCircle (x, y, radius)
{
    return {
        x: x, y: y, radius: radius,
        left: x - radius,
        right: x + radius,
        top: y - radius,
        bottom: y + radius
    };
}

// Triangle with vertices at (0,0), (200,0), (100,200)
// Bounding box: left=0, right=200, top=0, bottom=200
// Line A: (0,0) -> (200,0)   (top edge)
// Line B: (200,0) -> (100,200) (right edge, equation: x = 200 - 0.5*y)
// Line C: (100,200) -> (0,0)  (left edge, equation: x = 0.5*y)

describe('Phaser.Geom.Intersects.TriangleToCircle', function ()
{
    var triangle;

    beforeEach(function ()
    {
        triangle = makeTriangle(0, 0, 200, 0, 100, 200);
    });

    describe('bounding box rejection', function ()
    {
        it('should return false when circle is entirely to the right of the triangle', function ()
        {
            var circle = makeCircle(350, 100, 10);

            expect(TriangleToCircle(triangle, circle)).toBe(false);
        });

        it('should return false when circle is entirely to the left of the triangle', function ()
        {
            var circle = makeCircle(-50, 100, 10);

            expect(TriangleToCircle(triangle, circle)).toBe(false);
        });

        it('should return false when circle is entirely above the triangle', function ()
        {
            var circle = makeCircle(100, -50, 10);

            expect(TriangleToCircle(triangle, circle)).toBe(false);
        });

        it('should return false when circle is entirely below the triangle', function ()
        {
            var circle = makeCircle(100, 350, 10);

            expect(TriangleToCircle(triangle, circle)).toBe(false);
        });

        it('should return false when circle just misses to the right (edge case)', function ()
        {
            // circle.left == triangle.right + 1
            var circle = makeCircle(210, 0, 9);

            expect(TriangleToCircle(triangle, circle)).toBe(false);
        });
    });

    describe('circle center inside triangle', function ()
    {
        it('should return true when circle center is inside the triangle', function ()
        {
            // (100, 80) is well inside the triangle
            var circle = makeCircle(100, 80, 5);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });

        it('should return true when circle center is near the centroid', function ()
        {
            // Centroid of (0,0),(200,0),(100,200) is (100, 66.7)
            var circle = makeCircle(100, 66, 3);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });

        it('should return true when large circle center is inside the triangle', function ()
        {
            var circle = makeCircle(100, 80, 200);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });
    });

    describe('line A intersection (top edge, y=0 from x=0 to x=200)', function ()
    {
        it('should return true when circle overlaps line A from above', function ()
        {
            // Circle centered just above the midpoint of line A
            var circle = makeCircle(100, -5, 10);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });

        it('should return true when circle straddles line A near the left vertex', function ()
        {
            var circle = makeCircle(20, -3, 8);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });

        it('should return true when circle straddles line A near the right vertex', function ()
        {
            var circle = makeCircle(180, -3, 8);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });
    });

    describe('line B intersection (right edge, from (200,0) to (100,200))', function ()
    {
        it('should return true when circle overlaps line B from the right side', function ()
        {
            // At y=20 on line B: x = 200 - 100*(20/200) = 190
            // Circle at (198, 20) with r=12 is outside triangle but intersects line B
            var circle = makeCircle(198, 20, 12);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });

        it('should return true when circle overlaps the midpoint of line B', function ()
        {
            // Midpoint of line B is (150, 100). Circle just outside that edge.
            // Normal to line B points right: direction (100, 200), normal outward = (200, 100) normalized
            // A point 10 units outside: approx (150 + 8.9, 100 + 4.5) = (159, 105)
            var circle = makeCircle(165, 105, 20);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });
    });

    describe('line C intersection (left edge, from (100,200) to (0,0))', function ()
    {
        it('should return true when circle overlaps line C from the left side', function ()
        {
            // Line C: y = 2x, so at y=40: x=20. Circle at (10, 40) with r=15.
            // Distance from (10,40) to line 2x-y=0: |2*10-40|/sqrt(5) = 20/sqrt(5) ≈ 8.94 < 15
            var circle = makeCircle(10, 40, 15);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });

        it('should return true when circle overlaps the midpoint of line C', function ()
        {
            // Midpoint of line C is (50, 100). Move slightly left.
            var circle = makeCircle(35, 100, 15);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });
    });

    describe('no intersection despite bounding box overlap', function ()
    {
        it('should return false when circle is in a corner of the bounding box outside the triangle', function ()
        {
            // At y=190 on the triangle, the valid x range is very narrow (95 to 105).
            // A circle at (190, 190) with r=5 is inside the bounding box but far from all edges.
            var circle = makeCircle(190, 190, 5);

            expect(TriangleToCircle(triangle, circle)).toBe(false);
        });

        it('should return false when circle is in the top-right area outside the triangle', function ()
        {
            // At y=10 line B is at x=195. Circle at (198, 10) r=2 is outside and too small to reach.
            var circle = makeCircle(198, 10, 2);

            expect(TriangleToCircle(triangle, circle)).toBe(false);
        });
    });

    describe('circle touching a triangle vertex', function ()
    {
        it('should return true when circle contains the top-left vertex (0,0)', function ()
        {
            var circle = makeCircle(-3, -3, 8);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });

        it('should return true when circle contains the top-right vertex (200,0)', function ()
        {
            var circle = makeCircle(203, -3, 8);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });

        it('should return true when circle contains the bottom vertex (100,200)', function ()
        {
            var circle = makeCircle(100, 206, 10);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });
    });

    describe('degenerate and edge cases', function ()
    {
        it('should return true when degenerate zero-area triangle and circle share the same point', function ()
        {
            // Contains() returns true for a degenerate triangle when the test point
            // matches the degenerate vertex, so the result is true
            var t = makeTriangle(0, 0, 0, 0, 0, 0);
            var circle = makeCircle(0, 0, 0);

            expect(TriangleToCircle(t, circle)).toBe(true);
        });

        it('should return true when circle completely contains the triangle', function ()
        {
            // Circle at centroid with huge radius
            var circle = makeCircle(100, 66, 500);

            expect(TriangleToCircle(triangle, circle)).toBe(true);
        });

        it('should return true when triangle completely contains the circle', function ()
        {
            var bigTriangle = makeTriangle(0, 0, 1000, 0, 500, 1000);
            var circle = makeCircle(500, 200, 10);

            expect(TriangleToCircle(bigTriangle, circle)).toBe(true);
        });

        it('should handle a right-angle triangle correctly', function ()
        {
            var rightTriangle = makeTriangle(0, 0, 100, 0, 0, 100);
            // Circle center inside right triangle
            var circle = makeCircle(20, 20, 5);

            expect(TriangleToCircle(rightTriangle, circle)).toBe(true);
        });

        it('should return false for circle clearly outside a right-angle triangle', function ()
        {
            var rightTriangle = makeTriangle(0, 0, 100, 0, 0, 100);
            var circle = makeCircle(90, 90, 5);

            expect(TriangleToCircle(rightTriangle, circle)).toBe(false);
        });
    });
});
