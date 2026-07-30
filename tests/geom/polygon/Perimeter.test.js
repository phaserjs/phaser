var Perimeter = require('../../../src/geom/polygon/Perimeter');

describe('Phaser.Geom.Polygon.Perimeter', function ()
{
    it('should return zero for a polygon with no points', function ()
    {
        var polygon = { points: [] };

        expect(Perimeter(polygon)).toBe(0);
    });

    it('should return zero for a polygon with a single point', function ()
    {
        var polygon = { points: [{ x: 5, y: 5 }] };

        expect(Perimeter(polygon)).toBe(0);
    });

    it('should return zero for a polygon where all points are identical', function ()
    {
        var polygon = { points: [{ x: 3, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 3 }] };

        expect(Perimeter(polygon)).toBe(0);
    });

    it('should return the perimeter of a unit square', function ()
    {
        var polygon = {
            points: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 0, y: 1 }
            ]
        };

        expect(Perimeter(polygon)).toBeCloseTo(4, 10);
    });

    it('should return the perimeter of a 3x4 rectangle', function ()
    {
        var polygon = {
            points: [
                { x: 0, y: 0 },
                { x: 3, y: 0 },
                { x: 3, y: 4 },
                { x: 0, y: 4 }
            ]
        };

        expect(Perimeter(polygon)).toBeCloseTo(14, 10);
    });

    it('should return the perimeter of an equilateral triangle', function ()
    {
        var side = 10;
        var polygon = {
            points: [
                { x: 0, y: 0 },
                { x: side, y: 0 },
                { x: side / 2, y: side * Math.sqrt(3) / 2 }
            ]
        };

        expect(Perimeter(polygon)).toBeCloseTo(30, 5);
    });

    it('should include the closing edge between last and first point', function ()
    {
        // A line segment (two points) forms a degenerate polygon — the closing edge
        // doubles back, so total perimeter = 2 * segment length
        var polygon = {
            points: [
                { x: 0, y: 0 },
                { x: 5, y: 0 }
            ]
        };

        expect(Perimeter(polygon)).toBeCloseTo(10, 10);
    });

    it('should return a positive value for a polygon with negative coordinates', function ()
    {
        var polygon = {
            points: [
                { x: -2, y: -2 },
                { x:  2, y: -2 },
                { x:  2, y:  2 },
                { x: -2, y:  2 }
            ]
        };

        expect(Perimeter(polygon)).toBeCloseTo(16, 10);
    });

    it('should handle floating point coordinates', function ()
    {
        var polygon = {
            points: [
                { x: 0.5, y: 0.5 },
                { x: 1.5, y: 0.5 },
                { x: 1.5, y: 1.5 },
                { x: 0.5, y: 1.5 }
            ]
        };

        expect(Perimeter(polygon)).toBeCloseTo(4, 10);
    });

    it('should return the correct perimeter of a right triangle with sides 3-4-5', function ()
    {
        var polygon = {
            points: [
                { x: 0, y: 0 },
                { x: 3, y: 0 },
                { x: 0, y: 4 }
            ]
        };

        // sides: 3, 4, 5 — perimeter = 12
        expect(Perimeter(polygon)).toBeCloseTo(12, 10);
    });

    it('should return a number', function ()
    {
        var polygon = {
            points: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 }
            ]
        };

        expect(typeof Perimeter(polygon)).toBe('number');
    });
});
