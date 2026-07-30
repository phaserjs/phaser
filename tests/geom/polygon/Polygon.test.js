var Polygon = require('../../../src/geom/polygon/Polygon');

describe('Phaser.Geom.Polygon', function ()
{
    it('should create a polygon with default values when no points given', function ()
    {
        var poly = new Polygon();
        expect(poly.points).toEqual([]);
        expect(poly.area).toBe(0);
        expect(poly.type).toBe(4);
    });

    it('should create a polygon with points passed to the constructor', function ()
    {
        var poly = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 } ]);
        expect(poly.points.length).toBe(3);
        expect(poly.area).not.toBe(0);
    });

    describe('setTo', function ()
    {
        it('should return this for chaining', function ()
        {
            var poly = new Polygon();
            var result = poly.setTo([ { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 } ]);
            expect(result).toBe(poly);
        });

        it('should reset points and area when called without arguments', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 } ]);
            poly.setTo();
            expect(poly.points).toEqual([]);
            expect(poly.area).toBe(0);
        });

        it('should set points from an array of objects with x/y properties', function ()
        {
            var poly = new Polygon();
            poly.setTo([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 } ]);
            expect(poly.points.length).toBe(3);
            expect(poly.points[0].x).toBe(0);
            expect(poly.points[0].y).toBe(0);
            expect(poly.points[1].x).toBe(100);
            expect(poly.points[1].y).toBe(0);
            expect(poly.points[2].x).toBe(100);
            expect(poly.points[2].y).toBe(100);
        });

        it('should set points from an array of paired numbers', function ()
        {
            var poly = new Polygon();
            poly.setTo([ 0, 0, 100, 0, 100, 100 ]);
            expect(poly.points.length).toBe(3);
            expect(poly.points[0].x).toBe(0);
            expect(poly.points[0].y).toBe(0);
            expect(poly.points[1].x).toBe(100);
            expect(poly.points[1].y).toBe(0);
            expect(poly.points[2].x).toBe(100);
            expect(poly.points[2].y).toBe(100);
        });

        it('should set points from an array of arrays', function ()
        {
            var poly = new Polygon();
            poly.setTo([ [ 0, 0 ], [ 100, 0 ], [ 100, 100 ] ]);
            expect(poly.points.length).toBe(3);
            expect(poly.points[0].x).toBe(0);
            expect(poly.points[0].y).toBe(0);
            expect(poly.points[1].x).toBe(100);
            expect(poly.points[1].y).toBe(0);
            expect(poly.points[2].x).toBe(100);
            expect(poly.points[2].y).toBe(100);
        });

        it('should set points from a space-separated string', function ()
        {
            var poly = new Polygon();
            poly.setTo('0 0 100 0 100 100');
            expect(poly.points.length).toBe(3);
            expect(poly.points[0].x).toBeCloseTo(0);
            expect(poly.points[0].y).toBeCloseTo(0);
            expect(poly.points[1].x).toBeCloseTo(100);
            expect(poly.points[1].y).toBeCloseTo(0);
            expect(poly.points[2].x).toBeCloseTo(100);
            expect(poly.points[2].y).toBeCloseTo(100);
        });

        it('should return this without modifying points when passed a non-array non-string', function ()
        {
            var poly = new Polygon();
            var result = poly.setTo(12345);
            expect(result).toBe(poly);
            expect(poly.points).toEqual([]);
        });

        it('should overwrite existing points when called again', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 50, y: 0 }, { x: 50, y: 50 } ]);
            poly.setTo([ { x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 } ]);
            expect(poly.points.length).toBe(3);
            expect(poly.points[0].x).toBe(1);
            expect(poly.points[0].y).toBe(2);
        });

        it('should calculate area after setting points', function ()
        {
            var poly = new Polygon();
            poly.setTo([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 } ]);
            expect(poly.area).toBeCloseTo(10000);
        });
    });

    describe('calculateArea', function ()
    {
        it('should return 0 when there are fewer than 3 points', function ()
        {
            var poly = new Polygon();
            poly.points = [ { x: 0, y: 0 }, { x: 10, y: 0 } ];
            var area = poly.calculateArea();
            expect(area).toBe(0);
            expect(poly.area).toBe(0);
        });

        it('should return 0 for an empty polygon', function ()
        {
            var poly = new Polygon();
            var area = poly.calculateArea();
            expect(area).toBe(0);
        });

        it('should calculate the area of an axis-aligned square', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 } ]);
            expect(poly.area).toBeCloseTo(10000);
        });

        it('should calculate the area of a right triangle', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 100 } ]);
            expect(poly.area).toBeCloseTo(5000);
        });

        it('should update the area property', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 200, y: 0 }, { x: 200, y: 200 }, { x: 0, y: 200 } ]);
            expect(poly.area).toBeCloseTo(40000);
        });

        it('should return the calculated area value', function ()
        {
            var poly = new Polygon();
            poly.points = [ { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 } ];
            var result = poly.calculateArea();
            expect(result).toBeCloseTo(100);
        });

        it('should handle floating point coordinates', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 1.5, y: 0 }, { x: 1.5, y: 2.5 }, { x: 0, y: 2.5 } ]);
            expect(poly.area).toBeCloseTo(3.75);
        });
    });

    describe('contains', function ()
    {
        it('should return true for a point inside a square polygon', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 } ]);
            expect(poly.contains(50, 50)).toBe(true);
        });

        it('should return false for a point outside the polygon', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 } ]);
            expect(poly.contains(200, 200)).toBe(false);
        });

        it('should return false for a point with negative coordinates outside the polygon', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 } ]);
            expect(poly.contains(-10, 50)).toBe(false);
        });

        it('should return false for an empty polygon', function ()
        {
            var poly = new Polygon();
            expect(poly.contains(0, 0)).toBe(false);
        });

        it('should return true for a point inside a triangular polygon', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 200, y: 0 }, { x: 100, y: 200 } ]);
            expect(poly.contains(100, 50)).toBe(true);
        });

        it('should return false for a point outside a triangular polygon', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 200, y: 0 }, { x: 100, y: 200 } ]);
            expect(poly.contains(0, 200)).toBe(false);
        });
    });

    describe('getPoints', function ()
    {
        it('should return an array', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 } ]);
            var result = poly.getPoints(4);
            expect(Array.isArray(result)).toBe(true);
        });

        it('should return the requested number of points', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 } ]);
            var result = poly.getPoints(8);
            expect(result.length).toBe(8);
        });

        it('should populate a provided output array', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 } ]);
            var output = [];
            var result = poly.getPoints(4, null, output);
            expect(result).toBe(output);
            expect(output.length).toBe(4);
        });

        it('should return points with x and y properties', function ()
        {
            var poly = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 } ]);
            var result = poly.getPoints(4);
            expect(typeof result[0].x).toBe('number');
            expect(typeof result[0].y).toBe('number');
        });
    });
});
