var TriangleToLine = require('../../../src/geom/intersects/TriangleToLine');

describe('Phaser.Geom.Intersects.TriangleToLine', function ()
{
    // Helper: create a mock line with x1,y1,x2,y2
    function makeLine(x1, y1, x2, y2)
    {
        return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }

    // Helper: create a mock triangle with an axis-aligned right triangle
    // vertices: (0,0), (100,0), (0,100)
    function makeTriangle()
    {
        return {
            contains: function (x, y)
            {
                // Inside if x>=0, y>=0, x+y<=100
                return x >= 0 && y >= 0 && (x + y) <= 100;
            },
            getLineA: function () { return makeLine(0, 0, 100, 0); },   // bottom edge
            getLineB: function () { return makeLine(100, 0, 0, 100); }, // hypotenuse
            getLineC: function () { return makeLine(0, 100, 0, 0); }    // left edge
        };
    }

    it('should return true when the line starts inside the triangle', function ()
    {
        var triangle = makeTriangle();
        var line = makeLine(10, 10, 200, 200); // starts inside, ends outside
        expect(TriangleToLine(triangle, line)).toBe(true);
    });

    it('should return true when the line ends inside the triangle', function ()
    {
        var triangle = makeTriangle();
        var line = makeLine(200, 200, 10, 10); // starts outside, ends inside
        expect(TriangleToLine(triangle, line)).toBe(true);
    });

    it('should return true when both endpoints are inside the triangle', function ()
    {
        var triangle = makeTriangle();
        var line = makeLine(10, 10, 20, 20);
        expect(TriangleToLine(triangle, line)).toBe(true);
    });

    it('should return true when the line crosses the triangle completely', function ()
    {
        var triangle = makeTriangle();
        // A horizontal line at y=10 from x=-50 to x=150 crosses two sides
        var line = makeLine(-50, 10, 150, 10);
        expect(TriangleToLine(triangle, line)).toBe(true);
    });

    it('should return false when the line is completely outside the triangle', function ()
    {
        var triangle = makeTriangle();
        // Far away, no intersection
        var line = makeLine(200, 200, 300, 300);
        expect(TriangleToLine(triangle, line)).toBe(false);
    });

    it('should return false when the line is parallel to and outside a triangle side', function ()
    {
        var triangle = makeTriangle();
        // Parallel to bottom edge (y=0) but below it
        var line = makeLine(-50, -10, 150, -10);
        expect(TriangleToLine(triangle, line)).toBe(false);
    });

    it('should return true when the line lies exactly on a triangle edge', function ()
    {
        var triangle = makeTriangle();
        // Line along the bottom edge of the triangle
        var line = makeLine(0, 0, 100, 0);
        expect(TriangleToLine(triangle, line)).toBe(true);
    });

    it('should return true when the line passes through a vertex', function ()
    {
        var triangle = makeTriangle();
        // Line passing through vertex (0,0)
        var line = makeLine(-10, -10, 10, 10);
        expect(TriangleToLine(triangle, line)).toBe(true);
    });

    it('should check all three sides of the triangle', function ()
    {
        var callLog = [];
        var triangle = {
            contains: function (x, y) { return false; },
            getLineA: function () { callLog.push('A'); return makeLine(0, 0, 100, 0); },
            getLineB: function () { callLog.push('B'); return makeLine(100, 0, 0, 100); },
            getLineC: function () { callLog.push('C'); return makeLine(0, 100, 0, 0); }
        };
        var line = makeLine(200, 200, 300, 300); // no intersection

        TriangleToLine(triangle, line);

        expect(callLog).toContain('A');
        expect(callLog).toContain('B');
        expect(callLog).toContain('C');
    });

    it('should short-circuit and return true on first side intersection without checking remaining sides', function ()
    {
        var callLog = [];
        var triangle = {
            contains: function (x, y) { return false; },
            getLineA: function () { callLog.push('A'); return makeLine(0, 0, 100, 0); },
            getLineB: function () { callLog.push('B'); return makeLine(100, 0, 0, 100); },
            getLineC: function () { callLog.push('C'); return makeLine(0, 100, 0, 0); }
        };
        // Vertical line that crosses only the bottom edge (side A) at x=50, y=0
        var line = makeLine(50, -10, 50, 5);

        var result = TriangleToLine(triangle, line);

        expect(result).toBe(true);
        expect(callLog).toContain('A');
        expect(callLog).not.toContain('B');
        expect(callLog).not.toContain('C');
    });

    it('should return false for a line far to the left of the triangle', function ()
    {
        var triangle = makeTriangle();
        var line = makeLine(-200, 0, -100, 100);
        expect(TriangleToLine(triangle, line)).toBe(false);
    });

    it('should return false for a line far above the triangle', function ()
    {
        var triangle = makeTriangle();
        var line = makeLine(0, -200, 100, -100);
        expect(TriangleToLine(triangle, line)).toBe(false);
    });

    it('should handle a degenerate line (zero length) inside the triangle', function ()
    {
        var triangle = makeTriangle();
        var line = makeLine(10, 10, 10, 10);
        expect(TriangleToLine(triangle, line)).toBe(true);
    });

    it('should handle a degenerate line (zero length) outside the triangle', function ()
    {
        var triangle = makeTriangle();
        var line = makeLine(200, 200, 200, 200);
        expect(TriangleToLine(triangle, line)).toBe(false);
    });
});
