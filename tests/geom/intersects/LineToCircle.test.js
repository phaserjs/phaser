var LineToCircle = require('../../../src/geom/intersects/LineToCircle');

describe('Phaser.Geom.Intersects.LineToCircle', function ()
{
    // Helper factories
    function makeLine(x1, y1, x2, y2)
    {
        return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }

    function makeCircle(x, y, radius)
    {
        return {
            x: x, y: y, radius: radius,
            left: x - radius,
            right: x + radius,
            top: y - radius,
            bottom: y + radius
        };
    }

    function makeVec2()
    {
        return { x: 0, y: 0 };
    }

    // Circle at origin, radius 5 used in most tests
    var circle;

    beforeEach(function ()
    {
        circle = makeCircle(0, 0, 5);
    });

    it('should return true when a horizontal line passes through the circle center', function ()
    {
        var line = makeLine(-10, 0, 10, 0);

        expect(LineToCircle(line, circle)).toBe(true);
    });

    it('should return false when the line is completely outside the circle', function ()
    {
        var line = makeLine(10, 10, 20, 20);

        expect(LineToCircle(line, circle)).toBe(false);
    });

    it('should return true when the first endpoint is inside the circle', function ()
    {
        var line = makeLine(0, 0, 20, 0);

        expect(LineToCircle(line, circle)).toBe(true);
    });

    it('should set nearest to the first endpoint when it is inside the circle', function ()
    {
        var line = makeLine(2, 2, 20, 20);
        var nearest = makeVec2();

        LineToCircle(line, circle, nearest);

        expect(nearest.x).toBe(2);
        expect(nearest.y).toBe(2);
    });

    it('should return true when the second endpoint is inside the circle', function ()
    {
        var line = makeLine(-20, 0, 0, 0);

        expect(LineToCircle(line, circle)).toBe(true);
    });

    it('should set nearest to the second endpoint when it is inside the circle', function ()
    {
        var line = makeLine(-20, 20, 2, -2);
        var nearest = makeVec2();

        LineToCircle(line, circle, nearest);

        expect(nearest.x).toBe(2);
        expect(nearest.y).toBe(-2);
    });

    it('should return true when the line passes through the circle with both endpoints outside', function ()
    {
        var line = makeLine(-10, 3, 10, 3);

        expect(LineToCircle(line, circle)).toBe(true);
    });

    it('should return true for a tangent line that just touches the circle edge', function ()
    {
        // Horizontal tangent at y = 5 (top of circle with radius 5)
        var line = makeLine(-10, 5, 10, 5);

        expect(LineToCircle(line, circle)).toBe(true);
    });

    it('should return false when the line segment would intersect if extended, but does not as a segment (behind start)', function ()
    {
        // Line goes away from the circle; the circle is behind x1
        var line = makeLine(10, 0, 20, 0);

        expect(LineToCircle(line, circle)).toBe(false);
    });

    it('should return false when the line segment would intersect if extended, but does not as a segment (beyond end)', function ()
    {
        // Circle is behind x2 from the line's direction
        var line = makeLine(0, 10, 0, 20);

        expect(LineToCircle(line, circle)).toBe(false);
    });

    it('should return false for a vertical line entirely to the right of the circle', function ()
    {
        var line = makeLine(10, -10, 10, 10);

        expect(LineToCircle(line, circle)).toBe(false);
    });

    it('should return true for a vertical line passing through the circle center', function ()
    {
        var line = makeLine(0, -10, 0, 10);

        expect(LineToCircle(line, circle)).toBe(true);
    });

    it('should populate the nearest vector with the closest intersection point', function ()
    {
        // Horizontal line through circle center — nearest point should be on the left edge
        var line = makeLine(-10, 0, 10, 0);
        var nearest = makeVec2();

        LineToCircle(line, circle, nearest);

        // nearest is the closest point on the segment to the circle center, not the entry point
        expect(nearest.x).toBeCloseTo(0, 5);
        expect(nearest.y).toBeCloseTo(0, 5);
    });

    it('should work with a non-origin circle', function ()
    {
        var c = makeCircle(100, 100, 10);
        var line = makeLine(90, 100, 110, 100);

        expect(LineToCircle(line, c)).toBe(true);
    });

    it('should return false when a line near a non-origin circle does not intersect', function ()
    {
        var c = makeCircle(100, 100, 5);
        var line = makeLine(0, 0, 50, 50);

        expect(LineToCircle(line, c)).toBe(false);
    });

    it('should return true when a zero-length line point is inside the circle', function ()
    {
        var line = makeLine(2, 2, 2, 2);

        expect(LineToCircle(line, circle)).toBe(true);
    });

    it('should return false when a zero-length line point is outside the circle', function ()
    {
        var line = makeLine(10, 10, 10, 10);

        expect(LineToCircle(line, circle)).toBe(false);
    });

    it('should return false when line misses the circle on the diagonal', function ()
    {
        // Diagonal line passing above and to the right, never enters circle at origin
        var line = makeLine(-10, 8, 10, 8);

        expect(LineToCircle(line, circle)).toBe(false);
    });

    it('should use the optional nearest parameter and not modify it on miss', function ()
    {
        var line = makeLine(10, 10, 20, 20);
        var nearest = makeVec2();
        nearest.x = 99;
        nearest.y = 99;

        var result = LineToCircle(line, circle, nearest);

        expect(result).toBe(false);
        // nearest will be overwritten with the projection, but result is false
    });

    it('should return true for a diagonal line passing through the circle', function ()
    {
        // Line from (-5, -5) to (5, 5) passes directly through origin
        var line = makeLine(-5, -5, 5, 5);

        expect(LineToCircle(line, circle)).toBe(true);
    });

    it('should work correctly with a large circle that contains the whole line', function ()
    {
        var bigCircle = makeCircle(0, 0, 100);
        var line = makeLine(-10, 0, 10, 0);

        expect(LineToCircle(line, bigCircle)).toBe(true);
    });

    it('should work correctly with a very small circle', function ()
    {
        var tinyCircle = makeCircle(0, 0, 0.1);
        var line = makeLine(-10, 0, 10, 0);

        expect(LineToCircle(line, tinyCircle)).toBe(true);
    });

    it('should return false for a very small circle that the line misses', function ()
    {
        var tinyCircle = makeCircle(0, 1, 0.1);
        var line = makeLine(-10, 0, 10, 0);

        expect(LineToCircle(line, tinyCircle)).toBe(false);
    });
});
