var GetCircleToRectangle = require('../../../src/geom/intersects/GetCircleToRectangle');

describe('Phaser.Geom.Intersects.GetCircleToRectangle', function ()
{
    // circle needs left/right/top/bottom for the Contains check inside LineToCircle
    function makeCircle(x, y, radius)
    {
        return {
            x: x,
            y: y,
            radius: radius,
            left: x - radius,
            right: x + radius,
            top: y - radius,
            bottom: y + radius
        };
    }

    // rect needs width/height/x/y for CircleToRectangle and getLineA-D for edge checks
    function makeRect(x, y, width, height)
    {
        var right = x + width;
        var bottom = y + height;
        return {
            x: x,
            y: y,
            width: width,
            height: height,
            right: right,
            bottom: bottom,
            getLineA: function () { return { x1: x, y1: y, x2: right, y2: y }; },
            getLineB: function () { return { x1: right, y1: y, x2: right, y2: bottom }; },
            getLineC: function () { return { x1: right, y1: bottom, x2: x, y2: bottom }; },
            getLineD: function () { return { x1: x, y1: bottom, x2: x, y2: y }; }
        };
    }

    it('should return an empty array when circle does not intersect rectangle', function ()
    {
        var circle = makeCircle(200, 200, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when circle is completely inside the rectangle', function ()
    {
        // Circle fully contained — CircleToRectangle is true but no edges are crossed
        var circle = makeCircle(50, 50, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        expect(result.length).toBe(0);
    });

    it('should return a new array when no out parameter is provided', function ()
    {
        var circle = makeCircle(200, 200, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        expect(Array.isArray(result)).toBe(true);
    });

    it('should return the provided out array', function ()
    {
        var circle = makeCircle(200, 200, 10);
        var rect = makeRect(0, 0, 100, 100);
        var out = [];
        var result = GetCircleToRectangle(circle, rect, out);
        expect(result).toBe(out);
    });

    it('should return the provided out array when intersection occurs', function ()
    {
        // Circle crossing the top edge
        var circle = makeCircle(50, -5, 10);
        var rect = makeRect(0, 0, 100, 100);
        var out = [];
        var result = GetCircleToRectangle(circle, rect, out);
        expect(result).toBe(out);
    });

    it('should return two points when circle crosses the top edge', function ()
    {
        // Circle centered just above rect, crossing the top edge at two points
        var circle = makeCircle(50, -5, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        expect(result.length).toBe(2);
    });

    it('should return intersection points on the top edge with correct y coordinate', function ()
    {
        var circle = makeCircle(50, -5, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        // Both points should lie on the top edge (y = 0)
        result.forEach(function (pt)
        {
            expect(pt.y).toBeCloseTo(0, 5);
        });
    });

    it('should return intersection points at radius distance from circle center', function ()
    {
        var circle = makeCircle(50, -5, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        result.forEach(function (pt)
        {
            var dx = pt.x - circle.x;
            var dy = pt.y - circle.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            expect(dist).toBeCloseTo(circle.radius, 4);
        });
    });

    it('should return two points when circle crosses the left edge', function ()
    {
        // Circle centered to the left of rect, crossing the left edge
        var circle = makeCircle(-5, 50, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        expect(result.length).toBe(2);
    });

    it('should return intersection points on the left edge with correct x coordinate', function ()
    {
        var circle = makeCircle(-5, 50, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        result.forEach(function (pt)
        {
            expect(pt.x).toBeCloseTo(0, 5);
        });
    });

    it('should return two points when circle crosses the right edge', function ()
    {
        // Circle centered to the right of rect, crossing the right edge
        var circle = makeCircle(105, 50, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        expect(result.length).toBe(2);
    });

    it('should return two points when circle crosses the bottom edge', function ()
    {
        // Circle centered below rect, crossing the bottom edge
        var circle = makeCircle(50, 105, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        expect(result.length).toBe(2);
    });

    it('should return intersection points on the bottom edge with correct y coordinate', function ()
    {
        var circle = makeCircle(50, 105, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        result.forEach(function (pt)
        {
            expect(pt.y).toBeCloseTo(100, 5);
        });
    });

    it('should return Vector2 objects with numeric x and y properties', function ()
    {
        var circle = makeCircle(50, -5, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(function (pt)
        {
            expect(typeof pt.x).toBe('number');
            expect(typeof pt.y).toBe('number');
        });
    });

    it('should return two points when circle is at top-left corner area', function ()
    {
        // Circle centered at origin, crossing top and left edges
        var circle = makeCircle(0, 0, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        // Crosses top edge at (10, 0) and left edge at (0, 10)
        expect(result.length).toBe(2);
    });

    it('should return points at correct positions for corner intersection', function ()
    {
        var circle = makeCircle(0, 0, 10);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        // Points should be at (10, 0) and (0, 10)
        var xs = result.map(function (pt) { return pt.x; }).sort(function (a, b) { return a - b; });
        var ys = result.map(function (pt) { return pt.y; }).sort(function (a, b) { return a - b; });
        expect(xs[0]).toBeCloseTo(0, 5);
        expect(xs[1]).toBeCloseTo(10, 5);
        expect(ys[0]).toBeCloseTo(0, 5);
        expect(ys[1]).toBeCloseTo(10, 5);
    });

    it('should append intersection points to an existing out array', function ()
    {
        var circle = makeCircle(50, -5, 10);
        var rect = makeRect(0, 0, 100, 100);
        var out = [];
        GetCircleToRectangle(circle, rect, out);
        var firstCount = out.length;
        GetCircleToRectangle(circle, rect, out);
        expect(out.length).toBe(firstCount * 2);
    });

    it('should return an empty array when circle is far to the left', function ()
    {
        var circle = makeCircle(-100, 50, 5);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when circle is far above', function ()
    {
        var circle = makeCircle(50, -100, 5);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        expect(result.length).toBe(0);
    });

    it('should work correctly with a non-origin rectangle', function ()
    {
        // Rect at (100, 100), circle crossing its top edge
        var circle = makeCircle(150, 95, 10);
        var rect = makeRect(100, 100, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        expect(result.length).toBe(2);
        result.forEach(function (pt)
        {
            expect(pt.y).toBeCloseTo(100, 5);
        });
    });

    it('should handle floating point circle positions and radii', function ()
    {
        var circle = makeCircle(50.5, -4.5, 10.0);
        var rect = makeRect(0, 0, 100, 100);
        var result = GetCircleToRectangle(circle, rect);
        expect(Array.isArray(result)).toBe(true);
        result.forEach(function (pt)
        {
            expect(typeof pt.x).toBe('number');
            expect(typeof pt.y).toBe('number');
        });
    });

    it('should not throw when circle does not intersect rectangle', function ()
    {
        var circle = makeCircle(500, 500, 1);
        var rect = makeRect(0, 0, 100, 100);
        expect(function () { GetCircleToRectangle(circle, rect); }).not.toThrow();
    });

    it('should not throw when circle intersects rectangle', function ()
    {
        var circle = makeCircle(50, -5, 10);
        var rect = makeRect(0, 0, 100, 100);
        expect(function () { GetCircleToRectangle(circle, rect); }).not.toThrow();
    });
});
