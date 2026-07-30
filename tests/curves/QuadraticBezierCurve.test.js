var QuadraticBezier = require('../../src/curves/QuadraticBezierCurve');
var Vector2 = require('../../src/math/Vector2');

describe('QuadraticBezier', function ()
{
    describe('constructor', function ()
    {
        it('should create a curve with Vector2 points', function ()
        {
            var p0 = new Vector2(0, 0);
            var p1 = new Vector2(50, 100);
            var p2 = new Vector2(100, 0);
            var curve = new QuadraticBezier(p0, p1, p2);

            expect(curve.p0).toBe(p0);
            expect(curve.p1).toBe(p1);
            expect(curve.p2).toBe(p2);
        });

        it('should create a curve from an array of point pairs', function ()
        {
            var curve = new QuadraticBezier([ 0, 0, 50, 100, 100, 0 ]);

            expect(curve.p0.x).toBe(0);
            expect(curve.p0.y).toBe(0);
            expect(curve.p1.x).toBe(50);
            expect(curve.p1.y).toBe(100);
            expect(curve.p2.x).toBe(100);
            expect(curve.p2.y).toBe(0);
        });

        it('should set the curve type to QuadraticBezierCurve', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 50), new Vector2(100, 0));

            expect(curve.type).toBe('QuadraticBezierCurve');
        });

        it('should create a curve with negative coordinates', function ()
        {
            var p0 = new Vector2(-100, -100);
            var p1 = new Vector2(0, 0);
            var p2 = new Vector2(100, 100);
            var curve = new QuadraticBezier(p0, p1, p2);

            expect(curve.p0.x).toBe(-100);
            expect(curve.p0.y).toBe(-100);
            expect(curve.p2.x).toBe(100);
            expect(curve.p2.y).toBe(100);
        });

        it('should create a curve with floating point coordinates', function ()
        {
            var p0 = new Vector2(0.5, 1.5);
            var p1 = new Vector2(25.75, 50.25);
            var p2 = new Vector2(99.9, 0.1);
            var curve = new QuadraticBezier(p0, p1, p2);

            expect(curve.p0.x).toBeCloseTo(0.5);
            expect(curve.p1.x).toBeCloseTo(25.75);
            expect(curve.p2.x).toBeCloseTo(99.9);
        });
    });

    describe('getStartPoint', function ()
    {
        it('should return the start point p0', function ()
        {
            var p0 = new Vector2(10, 20);
            var curve = new QuadraticBezier(p0, new Vector2(50, 100), new Vector2(100, 0));
            var result = curve.getStartPoint();

            expect(result.x).toBe(10);
            expect(result.y).toBe(20);
        });

        it('should create a new Vector2 if no out parameter is given', function ()
        {
            var curve = new QuadraticBezier(new Vector2(5, 15), new Vector2(50, 50), new Vector2(100, 0));
            var result = curve.getStartPoint();

            expect(result).toBeInstanceOf(Vector2);
            expect(result.x).toBe(5);
            expect(result.y).toBe(15);
        });

        it('should store result in provided out object', function ()
        {
            var curve = new QuadraticBezier(new Vector2(7, 3), new Vector2(50, 50), new Vector2(100, 0));
            var out = new Vector2();
            var result = curve.getStartPoint(out);

            expect(result).toBe(out);
            expect(out.x).toBe(7);
            expect(out.y).toBe(3);
        });

        it('should return zero coordinates when p0 is at origin', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 50), new Vector2(100, 0));
            var result = curve.getStartPoint();

            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });
    });

    describe('getResolution', function ()
    {
        it('should return the divisions value unchanged', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));

            expect(curve.getResolution(10)).toBe(10);
        });

        it('should return 32 when passed 32', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));

            expect(curve.getResolution(32)).toBe(32);
        });

        it('should return 1 when passed 1', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));

            expect(curve.getResolution(1)).toBe(1);
        });

        it('should return 0 when passed 0', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));

            expect(curve.getResolution(0)).toBe(0);
        });
    });

    describe('getPoint', function ()
    {
        it('should return the start point at t=0', function ()
        {
            var p0 = new Vector2(0, 0);
            var p1 = new Vector2(50, 100);
            var p2 = new Vector2(100, 0);
            var curve = new QuadraticBezier(p0, p1, p2);
            var result = curve.getPoint(0);

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
        });

        it('should return the end point at t=1', function ()
        {
            var p0 = new Vector2(0, 0);
            var p1 = new Vector2(50, 100);
            var p2 = new Vector2(100, 0);
            var curve = new QuadraticBezier(p0, p1, p2);
            var result = curve.getPoint(1);

            expect(result.x).toBeCloseTo(100);
            expect(result.y).toBeCloseTo(0);
        });

        it('should return the midpoint at t=0.5 for a symmetric curve', function ()
        {
            var p0 = new Vector2(0, 0);
            var p1 = new Vector2(50, 100);
            var p2 = new Vector2(100, 0);
            var curve = new QuadraticBezier(p0, p1, p2);
            var result = curve.getPoint(0.5);

            expect(result.x).toBeCloseTo(50);
            expect(result.y).toBeCloseTo(50);
        });

        it('should create a new Vector2 if no out parameter is given', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));
            var result = curve.getPoint(0.5);

            expect(result).toBeInstanceOf(Vector2);
        });

        it('should store result in provided out object', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));
            var out = new Vector2();
            var result = curve.getPoint(0.5, out);

            expect(result).toBe(out);
        });

        it('should return a point between start and end for t between 0 and 1', function ()
        {
            var p0 = new Vector2(0, 0);
            var p1 = new Vector2(50, 100);
            var p2 = new Vector2(100, 0);
            var curve = new QuadraticBezier(p0, p1, p2);
            var result = curve.getPoint(0.25);

            expect(result.x).toBeGreaterThan(0);
            expect(result.x).toBeLessThan(100);
        });

        it('should work with a straight line (collinear points)', function ()
        {
            var p0 = new Vector2(0, 0);
            var p1 = new Vector2(50, 0);
            var p2 = new Vector2(100, 0);
            var curve = new QuadraticBezier(p0, p1, p2);
            var result = curve.getPoint(0.5);

            expect(result.x).toBeCloseTo(50);
            expect(result.y).toBeCloseTo(0);
        });

        it('should work with negative coordinates', function ()
        {
            var p0 = new Vector2(-100, -100);
            var p1 = new Vector2(0, 0);
            var p2 = new Vector2(100, 100);
            var curve = new QuadraticBezier(p0, p1, p2);
            var result = curve.getPoint(0.5);

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
        });
    });

    describe('draw', function ()
    {
        it('should call graphics methods and return the graphics object', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));

            var graphics = {
                beginPath: function () {},
                moveTo: function () {},
                lineTo: function () {},
                strokePath: function () {}
            };

            var result = curve.draw(graphics);

            expect(result).toBe(graphics);
        });

        it('should use 32 points by default', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));
            var lineToCount = 0;

            var graphics = {
                beginPath: function () {},
                moveTo: function () {},
                lineTo: function () { lineToCount++; },
                strokePath: function () {}
            };

            curve.draw(graphics);

            expect(lineToCount).toBe(32);
        });

        it('should use the specified number of points', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));
            var lineToCount = 0;

            var graphics = {
                beginPath: function () {},
                moveTo: function () {},
                lineTo: function () { lineToCount++; },
                strokePath: function () {}
            };

            curve.draw(graphics, 16);

            expect(lineToCount).toBe(16);
        });

        it('should call beginPath once', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));
            var beginPathCount = 0;

            var graphics = {
                beginPath: function () { beginPathCount++; },
                moveTo: function () {},
                lineTo: function () {},
                strokePath: function () {}
            };

            curve.draw(graphics);

            expect(beginPathCount).toBe(1);
        });

        it('should call strokePath once', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));
            var strokePathCount = 0;

            var graphics = {
                beginPath: function () {},
                moveTo: function () {},
                lineTo: function () {},
                strokePath: function () { strokePathCount++; }
            };

            curve.draw(graphics);

            expect(strokePathCount).toBe(1);
        });
    });

    describe('toJSON', function ()
    {
        it('should return an object with type and points', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));
            var json = curve.toJSON();

            expect(json).toHaveProperty('type');
            expect(json).toHaveProperty('points');
        });

        it('should return the correct type string', function ()
        {
            var curve = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));
            var json = curve.toJSON();

            expect(json.type).toBe('QuadraticBezierCurve');
        });

        it('should return correct points array with 6 values', function ()
        {
            var curve = new QuadraticBezier(new Vector2(10, 20), new Vector2(50, 100), new Vector2(90, 30));
            var json = curve.toJSON();

            expect(json.points.length).toBe(6);
            expect(json.points[0]).toBe(10);
            expect(json.points[1]).toBe(20);
            expect(json.points[2]).toBe(50);
            expect(json.points[3]).toBe(100);
            expect(json.points[4]).toBe(90);
            expect(json.points[5]).toBe(30);
        });

        it('should preserve negative coordinate values', function ()
        {
            var curve = new QuadraticBezier(new Vector2(-10, -20), new Vector2(0, 0), new Vector2(10, 20));
            var json = curve.toJSON();

            expect(json.points[0]).toBe(-10);
            expect(json.points[1]).toBe(-20);
        });
    });

    describe('fromJSON', function ()
    {
        it('should create a curve from a JSON object', function ()
        {
            var json = {
                type: 'QuadraticBezierCurve',
                points: [ 0, 0, 50, 100, 100, 0 ]
            };
            var curve = QuadraticBezier.fromJSON(json);

            expect(curve).toBeInstanceOf(QuadraticBezier);
            expect(curve.p0.x).toBe(0);
            expect(curve.p0.y).toBe(0);
            expect(curve.p1.x).toBe(50);
            expect(curve.p1.y).toBe(100);
            expect(curve.p2.x).toBe(100);
            expect(curve.p2.y).toBe(0);
        });

        it('should round-trip through toJSON and fromJSON', function ()
        {
            var original = new QuadraticBezier(new Vector2(10, 20), new Vector2(55, 80), new Vector2(90, 15));
            var json = original.toJSON();
            var restored = QuadraticBezier.fromJSON(json);

            expect(restored.p0.x).toBe(original.p0.x);
            expect(restored.p0.y).toBe(original.p0.y);
            expect(restored.p1.x).toBe(original.p1.x);
            expect(restored.p1.y).toBe(original.p1.y);
            expect(restored.p2.x).toBe(original.p2.x);
            expect(restored.p2.y).toBe(original.p2.y);
        });

        it('should produce a curve that returns the same points as the original', function ()
        {
            var original = new QuadraticBezier(new Vector2(0, 0), new Vector2(50, 100), new Vector2(100, 0));
            var json = original.toJSON();
            var restored = QuadraticBezier.fromJSON(json);

            var origPoint = original.getPoint(0.5);
            var restPoint = restored.getPoint(0.5);

            expect(restPoint.x).toBeCloseTo(origPoint.x);
            expect(restPoint.y).toBeCloseTo(origPoint.y);
        });
    });
});
