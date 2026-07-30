var Reverse = require('../../../src/geom/polygon/Reverse');

describe('Phaser.Geom.Polygon.Reverse', function ()
{
    it('should return the polygon', function ()
    {
        var polygon = { points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] };

        var result = Reverse(polygon);

        expect(result).toBe(polygon);
    });

    it('should reverse the order of points', function ()
    {
        var polygon = {
            points: [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 2 }
            ]
        };

        Reverse(polygon);

        expect(polygon.points[0].x).toBe(2);
        expect(polygon.points[0].y).toBe(2);
        expect(polygon.points[1].x).toBe(1);
        expect(polygon.points[1].y).toBe(1);
        expect(polygon.points[2].x).toBe(0);
        expect(polygon.points[2].y).toBe(0);
    });

    it('should handle a polygon with a single point', function ()
    {
        var polygon = { points: [{ x: 5, y: 10 }] };

        Reverse(polygon);

        expect(polygon.points.length).toBe(1);
        expect(polygon.points[0].x).toBe(5);
        expect(polygon.points[0].y).toBe(10);
    });

    it('should handle a polygon with an empty points array', function ()
    {
        var polygon = { points: [] };

        Reverse(polygon);

        expect(polygon.points.length).toBe(0);
    });

    it('should handle a polygon with two points', function ()
    {
        var polygon = {
            points: [
                { x: 10, y: 20 },
                { x: 30, y: 40 }
            ]
        };

        Reverse(polygon);

        expect(polygon.points[0].x).toBe(30);
        expect(polygon.points[0].y).toBe(40);
        expect(polygon.points[1].x).toBe(10);
        expect(polygon.points[1].y).toBe(20);
    });

    it('should reverse in place and modify the original polygon', function ()
    {
        var p0 = { x: 0, y: 0 };
        var p1 = { x: 1, y: 0 };
        var p2 = { x: 1, y: 1 };
        var p3 = { x: 0, y: 1 };
        var polygon = { points: [p0, p1, p2, p3] };

        Reverse(polygon);

        expect(polygon.points[0]).toBe(p3);
        expect(polygon.points[1]).toBe(p2);
        expect(polygon.points[2]).toBe(p1);
        expect(polygon.points[3]).toBe(p0);
    });

    it('should reverse back to original order when called twice', function ()
    {
        var polygon = {
            points: [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 2 }
            ]
        };

        Reverse(polygon);
        Reverse(polygon);

        expect(polygon.points[0].x).toBe(0);
        expect(polygon.points[1].x).toBe(1);
        expect(polygon.points[2].x).toBe(2);
    });

    it('should preserve the point count after reversal', function ()
    {
        var polygon = {
            points: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 1 },
                { x: 1, y: 2 },
                { x: 0, y: 1 }
            ]
        };

        Reverse(polygon);

        expect(polygon.points.length).toBe(5);
    });
});
