var Translate = require('../../../src/geom/polygon/Translate');

describe('Phaser.Geom.Polygon.Translate', function ()
{
    function makePolygon(points)
    {
        return { points: points };
    }

    function makePoint(x, y)
    {
        return { x: x, y: y };
    }

    it('should return the polygon', function ()
    {
        var polygon = makePolygon([makePoint(0, 0)]);
        var result = Translate(polygon, 1, 1);

        expect(result).toBe(polygon);
    });

    it('should translate all points by the given x and y values', function ()
    {
        var polygon = makePolygon([
            makePoint(0, 0),
            makePoint(10, 5),
            makePoint(20, 10)
        ]);

        Translate(polygon, 5, 3);

        expect(polygon.points[0].x).toBe(5);
        expect(polygon.points[0].y).toBe(3);
        expect(polygon.points[1].x).toBe(15);
        expect(polygon.points[1].y).toBe(8);
        expect(polygon.points[2].x).toBe(25);
        expect(polygon.points[2].y).toBe(13);
    });

    it('should translate by zero leaving points unchanged', function ()
    {
        var polygon = makePolygon([
            makePoint(10, 20),
            makePoint(30, 40)
        ]);

        Translate(polygon, 0, 0);

        expect(polygon.points[0].x).toBe(10);
        expect(polygon.points[0].y).toBe(20);
        expect(polygon.points[1].x).toBe(30);
        expect(polygon.points[1].y).toBe(40);
    });

    it('should translate by negative values', function ()
    {
        var polygon = makePolygon([
            makePoint(10, 20),
            makePoint(30, 40)
        ]);

        Translate(polygon, -5, -10);

        expect(polygon.points[0].x).toBe(5);
        expect(polygon.points[0].y).toBe(10);
        expect(polygon.points[1].x).toBe(25);
        expect(polygon.points[1].y).toBe(30);
    });

    it('should translate by floating point values', function ()
    {
        var polygon = makePolygon([
            makePoint(1.5, 2.5)
        ]);

        Translate(polygon, 0.25, 0.75);

        expect(polygon.points[0].x).toBeCloseTo(1.75);
        expect(polygon.points[0].y).toBeCloseTo(3.25);
    });

    it('should handle a polygon with no points', function ()
    {
        var polygon = makePolygon([]);
        var result = Translate(polygon, 10, 10);

        expect(result).toBe(polygon);
        expect(polygon.points.length).toBe(0);
    });

    it('should handle a single point polygon', function ()
    {
        var polygon = makePolygon([makePoint(5, 5)]);

        Translate(polygon, 10, -3);

        expect(polygon.points[0].x).toBe(15);
        expect(polygon.points[0].y).toBe(2);
    });

    it('should mutate points in place', function ()
    {
        var point = makePoint(0, 0);
        var polygon = makePolygon([point]);

        Translate(polygon, 7, 9);

        expect(point.x).toBe(7);
        expect(point.y).toBe(9);
    });

    it('should handle large translation values', function ()
    {
        var polygon = makePolygon([makePoint(0, 0)]);

        Translate(polygon, 1000000, -1000000);

        expect(polygon.points[0].x).toBe(1000000);
        expect(polygon.points[0].y).toBe(-1000000);
    });
});
