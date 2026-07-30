var Line = require('../../../src/geom/line/Line');

describe('Phaser.Geom.Line', function ()
{
    describe('constructor', function ()
    {
        it('should create a line with default values', function ()
        {
            var line = new Line();
            expect(line.x1).toBe(0);
            expect(line.y1).toBe(0);
            expect(line.x2).toBe(0);
            expect(line.y2).toBe(0);
        });

        it('should create a line with given values', function ()
        {
            var line = new Line(10, 20, 30, 40);
            expect(line.x1).toBe(10);
            expect(line.y1).toBe(20);
            expect(line.x2).toBe(30);
            expect(line.y2).toBe(40);
        });

        it('should create a line with negative values', function ()
        {
            var line = new Line(-5, -10, -15, -20);
            expect(line.x1).toBe(-5);
            expect(line.y1).toBe(-10);
            expect(line.x2).toBe(-15);
            expect(line.y2).toBe(-20);
        });

        it('should create a line with floating point values', function ()
        {
            var line = new Line(1.5, 2.5, 3.5, 4.5);
            expect(line.x1).toBe(1.5);
            expect(line.y1).toBe(2.5);
            expect(line.x2).toBe(3.5);
            expect(line.y2).toBe(4.5);
        });

        it('should have the correct type constant', function ()
        {
            var line = new Line();
            expect(line.type).toBe(2);
        });
    });

    describe('getPoint', function ()
    {
        it('should return the start point at position 0', function ()
        {
            var line = new Line(0, 0, 100, 0);
            var point = line.getPoint(0);
            expect(point.x).toBe(0);
            expect(point.y).toBe(0);
        });

        it('should return the end point at position 1', function ()
        {
            var line = new Line(0, 0, 100, 0);
            var point = line.getPoint(1);
            expect(point.x).toBe(100);
            expect(point.y).toBe(0);
        });

        it('should return the midpoint at position 0.5', function ()
        {
            var line = new Line(0, 0, 100, 100);
            var point = line.getPoint(0.5);
            expect(point.x).toBe(50);
            expect(point.y).toBe(50);
        });

        it('should populate an existing output object', function ()
        {
            var line = new Line(0, 0, 100, 0);
            var output = { x: 0, y: 0 };
            var result = line.getPoint(0.5, output);
            expect(result.x).toBe(50);
            expect(result.y).toBe(0);
        });

        it('should return a point at 0.25 along the line', function ()
        {
            var line = new Line(0, 0, 200, 200);
            var point = line.getPoint(0.25);
            expect(point.x).toBeCloseTo(50);
            expect(point.y).toBeCloseTo(50);
        });

        it('should work with a diagonal line', function ()
        {
            var line = new Line(10, 20, 30, 40);
            var point = line.getPoint(0.5);
            expect(point.x).toBeCloseTo(20);
            expect(point.y).toBeCloseTo(30);
        });
    });

    describe('getPoints', function ()
    {
        it('should return the correct number of points', function ()
        {
            var line = new Line(0, 0, 100, 0);
            var points = line.getPoints(5);
            expect(points.length).toBe(5);
        });

        it('should return points at evenly spaced positions', function ()
        {
            var line = new Line(0, 0, 100, 0);
            var points = line.getPoints(3);
            expect(points[0].x).toBeCloseTo(0);
            expect(points[1].x).toBeCloseTo(33.33);
            expect(points[2].x).toBeCloseTo(66.67);
        });

        it('should populate an existing output array', function ()
        {
            var line = new Line(0, 0, 100, 0);
            var output = [];
            var result = line.getPoints(3, null, output);
            expect(result).toBe(output);
            expect(output.length).toBe(3);
        });

        it('should use stepRate when quantity is 0', function ()
        {
            var line = new Line(0, 0, 100, 0);
            var points = line.getPoints(0, 25);
            expect(points.length).toBeGreaterThan(0);
        });

        it('should return an array', function ()
        {
            var line = new Line(0, 0, 100, 0);
            var points = line.getPoints(4);
            expect(Array.isArray(points)).toBe(true);
        });

        it('should return all y values as zero for a horizontal line', function ()
        {
            var line = new Line(0, 0, 100, 0);
            var points = line.getPoints(5);
            for (var i = 0; i < points.length; i++)
            {
                expect(points[i].y).toBe(0);
            }
        });
    });

    describe('getRandomPoint', function ()
    {
        it('should return a point on the line', function ()
        {
            var line = new Line(0, 0, 100, 0);
            var point = line.getRandomPoint();
            expect(point.x).toBeGreaterThanOrEqual(0);
            expect(point.x).toBeLessThanOrEqual(100);
            expect(point.y).toBe(0);
        });

        it('should populate an existing Vector2-like object', function ()
        {
            var line = new Line(0, 0, 100, 0);
            var output = { x: -1, y: -1 };
            line.getRandomPoint(output);
            expect(output.x).toBeGreaterThanOrEqual(0);
            expect(output.x).toBeLessThanOrEqual(100);
        });

        it('should return values within the line bounds over many iterations', function ()
        {
            var line = new Line(10, 20, 110, 20);
            for (var i = 0; i < 50; i++)
            {
                var point = line.getRandomPoint();
                expect(point.x).toBeGreaterThanOrEqual(10);
                expect(point.x).toBeLessThanOrEqual(110);
                expect(point.y).toBe(20);
            }
        });

        it('should work with a diagonal line', function ()
        {
            var line = new Line(0, 0, 100, 100);
            var point = line.getRandomPoint();
            expect(point.x).toBeGreaterThanOrEqual(0);
            expect(point.x).toBeLessThanOrEqual(100);
            expect(point.y).toBeGreaterThanOrEqual(0);
            expect(point.y).toBeLessThanOrEqual(100);
        });
    });

    describe('setTo', function ()
    {
        it('should set all four coordinates', function ()
        {
            var line = new Line();
            line.setTo(10, 20, 30, 40);
            expect(line.x1).toBe(10);
            expect(line.y1).toBe(20);
            expect(line.x2).toBe(30);
            expect(line.y2).toBe(40);
        });

        it('should return the line instance for chaining', function ()
        {
            var line = new Line();
            var result = line.setTo(1, 2, 3, 4);
            expect(result).toBe(line);
        });

        it('should default to zero when called with no arguments', function ()
        {
            var line = new Line(10, 20, 30, 40);
            line.setTo();
            expect(line.x1).toBe(0);
            expect(line.y1).toBe(0);
            expect(line.x2).toBe(0);
            expect(line.y2).toBe(0);
        });

        it('should accept negative values', function ()
        {
            var line = new Line();
            line.setTo(-10, -20, -30, -40);
            expect(line.x1).toBe(-10);
            expect(line.y1).toBe(-20);
            expect(line.x2).toBe(-30);
            expect(line.y2).toBe(-40);
        });

        it('should accept floating point values', function ()
        {
            var line = new Line();
            line.setTo(1.1, 2.2, 3.3, 4.4);
            expect(line.x1).toBeCloseTo(1.1);
            expect(line.y1).toBeCloseTo(2.2);
            expect(line.x2).toBeCloseTo(3.3);
            expect(line.y2).toBeCloseTo(4.4);
        });

        it('should overwrite existing values', function ()
        {
            var line = new Line(1, 2, 3, 4);
            line.setTo(10, 20, 30, 40);
            expect(line.x1).toBe(10);
            expect(line.y1).toBe(20);
            expect(line.x2).toBe(30);
            expect(line.y2).toBe(40);
        });
    });

    describe('setFromObjects', function ()
    {
        it('should set coordinates from two objects', function ()
        {
            var line = new Line();
            var start = { x: 5, y: 10 };
            var end = { x: 50, y: 100 };
            line.setFromObjects(start, end);
            expect(line.x1).toBe(5);
            expect(line.y1).toBe(10);
            expect(line.x2).toBe(50);
            expect(line.y2).toBe(100);
        });

        it('should return the line instance for chaining', function ()
        {
            var line = new Line();
            var result = line.setFromObjects({ x: 0, y: 0 }, { x: 1, y: 1 });
            expect(result).toBe(line);
        });

        it('should work with negative coordinates', function ()
        {
            var line = new Line();
            line.setFromObjects({ x: -10, y: -20 }, { x: -30, y: -40 });
            expect(line.x1).toBe(-10);
            expect(line.y1).toBe(-20);
            expect(line.x2).toBe(-30);
            expect(line.y2).toBe(-40);
        });

        it('should work with floating point values', function ()
        {
            var line = new Line();
            line.setFromObjects({ x: 1.5, y: 2.5 }, { x: 3.5, y: 4.5 });
            expect(line.x1).toBe(1.5);
            expect(line.y1).toBe(2.5);
            expect(line.x2).toBe(3.5);
            expect(line.y2).toBe(4.5);
        });

        it('should overwrite existing values', function ()
        {
            var line = new Line(1, 2, 3, 4);
            line.setFromObjects({ x: 99, y: 88 }, { x: 77, y: 66 });
            expect(line.x1).toBe(99);
            expect(line.y1).toBe(88);
            expect(line.x2).toBe(77);
            expect(line.y2).toBe(66);
        });
    });

    describe('getPointA', function ()
    {
        it('should return the start point as a Vector2', function ()
        {
            var line = new Line(10, 20, 30, 40);
            var vec = line.getPointA();
            expect(vec.x).toBe(10);
            expect(vec.y).toBe(20);
        });

        it('should populate an existing Vector2 if provided', function ()
        {
            var line = new Line(10, 20, 30, 40);
            var vec = { x: 0, y: 0, set: function (x, y) { this.x = x; this.y = y; } };
            var result = line.getPointA(vec);
            expect(result).toBe(vec);
            expect(vec.x).toBe(10);
            expect(vec.y).toBe(20);
        });

        it('should return a new object when no argument is passed', function ()
        {
            var line = new Line(5, 15, 25, 35);
            var vec = line.getPointA();
            expect(vec).toBeDefined();
            expect(vec.x).toBe(5);
            expect(vec.y).toBe(15);
        });

        it('should reflect changes to x1/y1', function ()
        {
            var line = new Line(0, 0, 100, 100);
            line.x1 = 50;
            line.y1 = 75;
            var vec = line.getPointA();
            expect(vec.x).toBe(50);
            expect(vec.y).toBe(75);
        });
    });

    describe('getPointB', function ()
    {
        it('should return the end point as a Vector2', function ()
        {
            var line = new Line(10, 20, 30, 40);
            var vec = line.getPointB();
            expect(vec.x).toBe(30);
            expect(vec.y).toBe(40);
        });

        it('should populate an existing Vector2 if provided', function ()
        {
            var line = new Line(10, 20, 30, 40);
            var vec = { x: 0, y: 0, set: function (x, y) { this.x = x; this.y = y; } };
            var result = line.getPointB(vec);
            expect(result).toBe(vec);
            expect(vec.x).toBe(30);
            expect(vec.y).toBe(40);
        });

        it('should return a new object when no argument is passed', function ()
        {
            var line = new Line(5, 15, 25, 35);
            var vec = line.getPointB();
            expect(vec).toBeDefined();
            expect(vec.x).toBe(25);
            expect(vec.y).toBe(35);
        });

        it('should reflect changes to x2/y2', function ()
        {
            var line = new Line(0, 0, 100, 100);
            line.x2 = 200;
            line.y2 = 300;
            var vec = line.getPointB();
            expect(vec.x).toBe(200);
            expect(vec.y).toBe(300);
        });
    });

    describe('left accessor', function ()
    {
        it('should return the smaller x value', function ()
        {
            var line = new Line(10, 0, 50, 0);
            expect(line.left).toBe(10);
        });

        it('should return x2 when it is smaller', function ()
        {
            var line = new Line(50, 0, 10, 0);
            expect(line.left).toBe(10);
        });

        it('should set x1 when x1 is the left-most', function ()
        {
            var line = new Line(10, 0, 50, 0);
            line.left = 5;
            expect(line.x1).toBe(5);
        });

        it('should set x2 when x2 is the left-most', function ()
        {
            var line = new Line(50, 0, 10, 0);
            line.left = 5;
            expect(line.x2).toBe(5);
        });
    });

    describe('right accessor', function ()
    {
        it('should return the larger x value', function ()
        {
            var line = new Line(10, 0, 50, 0);
            expect(line.right).toBe(50);
        });

        it('should return x1 when it is larger', function ()
        {
            var line = new Line(50, 0, 10, 0);
            expect(line.right).toBe(50);
        });

        it('should set x1 when x1 is the right-most', function ()
        {
            var line = new Line(50, 0, 10, 0);
            line.right = 100;
            expect(line.x1).toBe(100);
        });

        it('should set x2 when x2 is the right-most', function ()
        {
            var line = new Line(10, 0, 50, 0);
            line.right = 100;
            expect(line.x2).toBe(100);
        });
    });

    describe('top accessor', function ()
    {
        it('should return the smaller y value', function ()
        {
            var line = new Line(0, 10, 0, 50);
            expect(line.top).toBe(10);
        });

        it('should return y2 when it is smaller', function ()
        {
            var line = new Line(0, 50, 0, 10);
            expect(line.top).toBe(10);
        });

        it('should set y1 when y1 is the top-most', function ()
        {
            var line = new Line(0, 10, 0, 50);
            line.top = 5;
            expect(line.y1).toBe(5);
        });

        it('should set y2 when y2 is the top-most', function ()
        {
            var line = new Line(0, 50, 0, 10);
            line.top = 5;
            expect(line.y2).toBe(5);
        });
    });

    describe('bottom accessor', function ()
    {
        it('should return the larger y value', function ()
        {
            var line = new Line(0, 10, 0, 50);
            expect(line.bottom).toBe(50);
        });

        it('should return y1 when it is larger', function ()
        {
            var line = new Line(0, 50, 0, 10);
            expect(line.bottom).toBe(50);
        });

        it('should set y1 when y1 is the bottom-most', function ()
        {
            var line = new Line(0, 50, 0, 10);
            line.bottom = 100;
            expect(line.y1).toBe(100);
        });

        it('should set y2 when y2 is the bottom-most', function ()
        {
            var line = new Line(0, 10, 0, 50);
            line.bottom = 100;
            expect(line.y2).toBe(100);
        });
    });
});
