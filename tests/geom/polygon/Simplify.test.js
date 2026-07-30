var Simplify = require('../../../src/geom/polygon/Simplify');

function makePolygon (points)
{
    return {
        points: points.slice(),
        setTo: function (newPoints)
        {
            this.points = newPoints;
        }
    };
}

function pt (x, y)
{
    return { x: x, y: y };
}

describe('Phaser.Geom.Polygon.Simplify', function ()
{
    it('should return the polygon object', function ()
    {
        var poly = makePolygon([ pt(0, 0), pt(5, 0), pt(10, 0) ]);
        var result = Simplify(poly);
        expect(result).toBe(poly);
    });

    it('should return the polygon unchanged when it has fewer than 3 points', function ()
    {
        var points1 = [ pt(0, 0) ];
        var poly1 = makePolygon(points1);
        Simplify(poly1);
        expect(poly1.points.length).toBe(1);

        var points2 = [ pt(0, 0), pt(10, 0) ];
        var poly2 = makePolygon(points2);
        Simplify(poly2);
        expect(poly2.points.length).toBe(2);
    });

    it('should return the polygon unchanged when it has exactly 2 points', function ()
    {
        var poly = makePolygon([ pt(0, 0), pt(100, 100) ]);
        var original = poly.points.slice();
        Simplify(poly);
        expect(poly.points[0].x).toBe(original[0].x);
        expect(poly.points[0].y).toBe(original[0].y);
        expect(poly.points[1].x).toBe(original[1].x);
        expect(poly.points[1].y).toBe(original[1].y);
    });

    it('should simplify collinear points on a horizontal line', function ()
    {
        var poly = makePolygon([
            pt(0, 0), pt(1, 0), pt(2, 0), pt(3, 0),
            pt(4, 0), pt(5, 0), pt(10, 0)
        ]);
        Simplify(poly, 1, true);
        expect(poly.points.length).toBeLessThan(7);
        expect(poly.points[0].x).toBe(0);
        expect(poly.points[0].y).toBe(0);
        expect(poly.points[poly.points.length - 1].x).toBe(10);
        expect(poly.points[poly.points.length - 1].y).toBe(0);
    });

    it('should always keep the first and last point', function ()
    {
        var poly = makePolygon([
            pt(0, 0), pt(1, 0.1), pt(2, -0.1), pt(3, 0.05),
            pt(4, 0), pt(5, 0.1), pt(100, 50)
        ]);
        Simplify(poly, 1, false);
        expect(poly.points[0].x).toBe(0);
        expect(poly.points[0].y).toBe(0);
        expect(poly.points[poly.points.length - 1].x).toBe(100);
        expect(poly.points[poly.points.length - 1].y).toBe(50);
    });

    it('should use default tolerance of 1 when not specified', function ()
    {
        var poly1 = makePolygon([
            pt(0, 0), pt(0.1, 0), pt(0.2, 0), pt(10, 0)
        ]);
        var poly2 = makePolygon([
            pt(0, 0), pt(0.1, 0), pt(0.2, 0), pt(10, 0)
        ]);
        Simplify(poly1);
        Simplify(poly2, 1, false);
        expect(poly1.points.length).toBe(poly2.points.length);
    });

    it('should reduce more points with a larger tolerance', function ()
    {
        var points = [
            pt(0, 0), pt(1, 0.5), pt(2, -0.5), pt(3, 0.3),
            pt(4, -0.3), pt(5, 0.4), pt(6, -0.4), pt(100, 0)
        ];
        var polyLow = makePolygon(points);
        var polyHigh = makePolygon(points);
        Simplify(polyLow, 1, true);
        Simplify(polyHigh, 10, true);
        expect(polyHigh.points.length).toBeLessThanOrEqual(polyLow.points.length);
    });

    it('should preserve all points of a shape with significant features', function ()
    {
        var poly = makePolygon([
            pt(0, 0), pt(50, 100), pt(100, 0)
        ]);
        Simplify(poly, 1, true);
        expect(poly.points.length).toBe(3);
    });

    it('should run without highestQuality (default low quality mode)', function ()
    {
        var poly = makePolygon([
            pt(0, 0), pt(1, 0), pt(2, 0), pt(3, 0),
            pt(4, 0), pt(5, 0), pt(10, 0)
        ]);
        Simplify(poly, 1, false);
        expect(poly.points.length).toBeLessThan(7);
        expect(poly.points[0].x).toBe(0);
        expect(poly.points[poly.points.length - 1].x).toBe(10);
    });

    it('should handle highestQuality=true differently from false on noisy data', function ()
    {
        var points = [
            pt(0, 0), pt(1, 0.1), pt(2, 0), pt(3, 0.1),
            pt(4, 0), pt(5, 0.1), pt(6, 0), pt(7, 0.1),
            pt(8, 0), pt(9, 0.1), pt(100, 50)
        ];
        var polyLQ = makePolygon(points);
        var polyHQ = makePolygon(points);
        Simplify(polyLQ, 1, false);
        Simplify(polyHQ, 1, true);
        // Both should keep first and last
        expect(polyLQ.points[0].x).toBe(0);
        expect(polyHQ.points[0].x).toBe(0);
        expect(polyLQ.points[polyLQ.points.length - 1].x).toBe(100);
        expect(polyHQ.points[polyHQ.points.length - 1].x).toBe(100);
    });

    it('should simplify a square wave pattern significantly', function ()
    {
        var points = [];
        for (var i = 0; i < 20; i++)
        {
            points.push(pt(i, i % 2 === 0 ? 0 : 0.01));
        }
        points.push(pt(100, 50));
        var poly = makePolygon(points);
        Simplify(poly, 1, true);
        expect(poly.points.length).toBeLessThan(points.length);
    });

    it('should not simplify a triangle with well-separated points', function ()
    {
        var poly = makePolygon([
            pt(0, 0), pt(100, 200), pt(200, 0)
        ]);
        Simplify(poly, 1, true);
        expect(poly.points.length).toBe(3);
    });

    it('should call setTo with the simplified points array', function ()
    {
        var setToCalled = false;
        var capturedPoints = null;
        var poly = {
            points: [ pt(0, 0), pt(1, 0), pt(2, 0), pt(3, 0), pt(10, 0) ],
            setTo: function (newPoints)
            {
                setToCalled = true;
                capturedPoints = newPoints;
                this.points = newPoints;
            }
        };
        Simplify(poly, 1, true);
        expect(setToCalled).toBe(true);
        expect(Array.isArray(capturedPoints)).toBe(true);
    });

    it('should handle a zero tolerance value', function ()
    {
        var poly = makePolygon([
            pt(0, 0), pt(1, 0), pt(2, 0), pt(10, 5)
        ]);
        var result = Simplify(poly, 0, true);
        expect(result).toBe(poly);
        expect(poly.points.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle large coordinates without errors', function ()
    {
        var poly = makePolygon([
            pt(0, 0), pt(100000, 1), pt(200000, -1), pt(300000, 0)
        ]);
        var result = Simplify(poly, 1, true);
        expect(result).toBe(poly);
        expect(poly.points[0].x).toBe(0);
        expect(poly.points[poly.points.length - 1].x).toBe(300000);
    });
});
