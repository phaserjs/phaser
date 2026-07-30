var Triangle = require('../../../src/geom/triangle/Triangle');

describe('Phaser.Geom.Triangle', function ()
{
    describe('constructor', function ()
    {
        it('should create a triangle with default values', function ()
        {
            var tri = new Triangle();
            expect(tri.x1).toBe(0);
            expect(tri.y1).toBe(0);
            expect(tri.x2).toBe(0);
            expect(tri.y2).toBe(0);
            expect(tri.x3).toBe(0);
            expect(tri.y3).toBe(0);
        });

        it('should create a triangle with given values', function ()
        {
            var tri = new Triangle(10, 20, 30, 40, 50, 60);
            expect(tri.x1).toBe(10);
            expect(tri.y1).toBe(20);
            expect(tri.x2).toBe(30);
            expect(tri.y2).toBe(40);
            expect(tri.x3).toBe(50);
            expect(tri.y3).toBe(60);
        });

        it('should set type to TRIANGLE constant', function ()
        {
            var tri = new Triangle();
            expect(tri.type).toBe(6);
        });

        it('should handle negative coordinates', function ()
        {
            var tri = new Triangle(-10, -20, -30, -40, -50, -60);
            expect(tri.x1).toBe(-10);
            expect(tri.y1).toBe(-20);
            expect(tri.x2).toBe(-30);
            expect(tri.y2).toBe(-40);
            expect(tri.x3).toBe(-50);
            expect(tri.y3).toBe(-60);
        });

        it('should handle floating point coordinates', function ()
        {
            var tri = new Triangle(1.5, 2.5, 3.5, 4.5, 5.5, 6.5);
            expect(tri.x1).toBeCloseTo(1.5);
            expect(tri.y1).toBeCloseTo(2.5);
            expect(tri.x2).toBeCloseTo(3.5);
            expect(tri.y2).toBeCloseTo(4.5);
            expect(tri.x3).toBeCloseTo(5.5);
            expect(tri.y3).toBeCloseTo(6.5);
        });
    });

    describe('contains', function ()
    {
        it('should return true for a point inside the triangle', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            expect(tri.contains(50, 50)).toBe(true);
        });

        it('should return false for a point outside the triangle', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            expect(tri.contains(200, 200)).toBe(false);
        });

        it('should return false for a point at the origin when triangle does not contain it', function ()
        {
            var tri = new Triangle(10, 10, 100, 10, 50, 100);
            expect(tri.contains(0, 0)).toBe(false);
        });

        it('should return true for the centroid of the triangle', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var cx = (0 + 100 + 50) / 3;
            var cy = (0 + 0 + 100) / 3;
            expect(tri.contains(cx, cy)).toBe(true);
        });

        it('should return true for a degenerate (zero area) triangle queried at its vertex', function ()
        {
            var tri = new Triangle(0, 0, 0, 0, 0, 0);
            // Contains uses barycentric coords; when all vertices collapse to one point,
            // u=0, v=0, u+v=0 < 1, so the check passes and returns true.
            expect(tri.contains(0, 0)).toBe(true);
        });

        it('should return false for a point far from the triangle', function ()
        {
            var tri = new Triangle(0, 0, 10, 0, 5, 10);
            expect(tri.contains(1000, 1000)).toBe(false);
        });
    });

    describe('getPoint', function ()
    {
        it('should return an object with x and y properties', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var point = tri.getPoint(0);
            expect(point).toHaveProperty('x');
            expect(point).toHaveProperty('y');
        });

        it('should return the first vertex at position 0', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var point = tri.getPoint(0);
            expect(point.x).toBeCloseTo(0);
            expect(point.y).toBeCloseTo(0);
        });

        it('should write result into provided output object', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var out = { x: 0, y: 0 };
            var result = tri.getPoint(0, out);
            expect(result).toBe(out);
        });

        it('should return a point at position 0.5 on the perimeter', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var point = tri.getPoint(0.5);
            expect(point.x).toBeDefined();
            expect(point.y).toBeDefined();
        });

        it('should return a point at position 1 near the first vertex', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var p0 = tri.getPoint(0);
            var p1 = tri.getPoint(1);
            expect(p0.x).toBeCloseTo(p1.x, 1);
            expect(p0.y).toBeCloseTo(p1.y, 1);
        });
    });

    describe('getPoints', function ()
    {
        it('should return an array', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var points = tri.getPoints(5);
            expect(Array.isArray(points)).toBe(true);
        });

        it('should return the correct number of points', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var points = tri.getPoints(5);
            expect(points.length).toBe(5);
        });

        it('should fill a provided output array', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var out = [];
            var result = tri.getPoints(3, null, out);
            expect(result).toBe(out);
            expect(out.length).toBe(3);
        });

        it('should return points with x and y properties', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var points = tri.getPoints(4);
            for (var i = 0; i < points.length; i++)
            {
                expect(points[i]).toHaveProperty('x');
                expect(points[i]).toHaveProperty('y');
            }
        });

        it('should return a single point when quantity is 1', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var points = tri.getPoints(1);
            expect(points.length).toBe(1);
        });
    });

    describe('getRandomPoint', function ()
    {
        it('should return an object with x and y properties', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var point = tri.getRandomPoint();
            expect(point).toHaveProperty('x');
            expect(point).toHaveProperty('y');
        });

        it('should write result into provided output object', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var out = { x: 0, y: 0 };
            var result = tri.getRandomPoint(out);
            expect(result).toBe(out);
        });

        it('should return a point inside or on the triangle over many iterations', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            for (var i = 0; i < 50; i++)
            {
                var point = tri.getRandomPoint();
                expect(tri.contains(point.x, point.y)).toBe(true);
            }
        });

        it('should return varying points (non-deterministic)', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var first = tri.getRandomPoint();
            var allSame = true;
            for (var i = 0; i < 10; i++)
            {
                var pt = tri.getRandomPoint();
                if (pt.x !== first.x || pt.y !== first.y)
                {
                    allSame = false;
                    break;
                }
            }
            expect(allSame).toBe(false);
        });
    });

    describe('setTo', function ()
    {
        it('should set all six coordinates', function ()
        {
            var tri = new Triangle();
            tri.setTo(10, 20, 30, 40, 50, 60);
            expect(tri.x1).toBe(10);
            expect(tri.y1).toBe(20);
            expect(tri.x2).toBe(30);
            expect(tri.y2).toBe(40);
            expect(tri.x3).toBe(50);
            expect(tri.y3).toBe(60);
        });

        it('should default missing coordinates to 0', function ()
        {
            var tri = new Triangle(10, 20, 30, 40, 50, 60);
            tri.setTo();
            expect(tri.x1).toBe(0);
            expect(tri.y1).toBe(0);
            expect(tri.x2).toBe(0);
            expect(tri.y2).toBe(0);
            expect(tri.x3).toBe(0);
            expect(tri.y3).toBe(0);
        });

        it('should return the triangle instance for chaining', function ()
        {
            var tri = new Triangle();
            var result = tri.setTo(1, 2, 3, 4, 5, 6);
            expect(result).toBe(tri);
        });

        it('should overwrite existing coordinates', function ()
        {
            var tri = new Triangle(1, 2, 3, 4, 5, 6);
            tri.setTo(10, 20, 30, 40, 50, 60);
            expect(tri.x1).toBe(10);
            expect(tri.x2).toBe(30);
            expect(tri.x3).toBe(50);
        });

        it('should handle negative values', function ()
        {
            var tri = new Triangle();
            tri.setTo(-10, -20, -30, -40, -50, -60);
            expect(tri.x1).toBe(-10);
            expect(tri.y3).toBe(-60);
        });
    });

    describe('getLineA', function ()
    {
        it('should return a line from vertex 1 to vertex 2', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var line = tri.getLineA();
            expect(line.x1).toBe(0);
            expect(line.y1).toBe(0);
            expect(line.x2).toBe(100);
            expect(line.y2).toBe(0);
        });

        it('should return a Line object', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var line = tri.getLineA();
            expect(typeof line.setTo).toBe('function');
        });

        it('should use a provided line object', function ()
        {
            var tri = new Triangle(10, 20, 30, 40, 50, 60);
            var Line = require('../../../src/geom/line/Line');
            var providedLine = new Line();
            var result = tri.getLineA(providedLine);
            expect(result).toBe(providedLine);
            expect(providedLine.x1).toBe(10);
            expect(providedLine.y1).toBe(20);
            expect(providedLine.x2).toBe(30);
            expect(providedLine.y2).toBe(40);
        });

        it('should reflect updated vertex positions', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            tri.x1 = 5;
            tri.y1 = 10;
            var line = tri.getLineA();
            expect(line.x1).toBe(5);
            expect(line.y1).toBe(10);
        });
    });

    describe('getLineB', function ()
    {
        it('should return a line from vertex 2 to vertex 3', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var line = tri.getLineB();
            expect(line.x1).toBe(100);
            expect(line.y1).toBe(0);
            expect(line.x2).toBe(50);
            expect(line.y2).toBe(100);
        });

        it('should return a Line object', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var line = tri.getLineB();
            expect(typeof line.setTo).toBe('function');
        });

        it('should use a provided line object', function ()
        {
            var tri = new Triangle(10, 20, 30, 40, 50, 60);
            var Line = require('../../../src/geom/line/Line');
            var providedLine = new Line();
            var result = tri.getLineB(providedLine);
            expect(result).toBe(providedLine);
            expect(providedLine.x1).toBe(30);
            expect(providedLine.y1).toBe(40);
            expect(providedLine.x2).toBe(50);
            expect(providedLine.y2).toBe(60);
        });
    });

    describe('getLineC', function ()
    {
        it('should return a line from vertex 3 back to vertex 1', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var line = tri.getLineC();
            expect(line.x1).toBe(50);
            expect(line.y1).toBe(100);
            expect(line.x2).toBe(0);
            expect(line.y2).toBe(0);
        });

        it('should return a Line object', function ()
        {
            var tri = new Triangle(0, 0, 100, 0, 50, 100);
            var line = tri.getLineC();
            expect(typeof line.setTo).toBe('function');
        });

        it('should use a provided line object', function ()
        {
            var tri = new Triangle(10, 20, 30, 40, 50, 60);
            var Line = require('../../../src/geom/line/Line');
            var providedLine = new Line();
            var result = tri.getLineC(providedLine);
            expect(result).toBe(providedLine);
            expect(providedLine.x1).toBe(50);
            expect(providedLine.y1).toBe(60);
            expect(providedLine.x2).toBe(10);
            expect(providedLine.y2).toBe(20);
        });
    });

    describe('bounds properties', function ()
    {
        it('should return the correct left value', function ()
        {
            var tri = new Triangle(10, 0, 50, 0, 30, 100);
            expect(tri.left).toBe(10);
        });

        it('should return the correct right value', function ()
        {
            var tri = new Triangle(10, 0, 50, 0, 30, 100);
            expect(tri.right).toBe(50);
        });

        it('should return the correct top value', function ()
        {
            var tri = new Triangle(0, 5, 100, 5, 50, 80);
            expect(tri.top).toBe(5);
        });

        it('should return the correct bottom value', function ()
        {
            var tri = new Triangle(0, 5, 100, 5, 50, 80);
            expect(tri.bottom).toBe(80);
        });
    });
});
