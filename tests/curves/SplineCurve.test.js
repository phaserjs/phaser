var SplineCurve = require('../../src/curves/SplineCurve');
var Vector2 = require('../../src/math/Vector2');

describe('Spline', function ()
{
    describe('Constructor', function ()
    {
        it('should create a spline with an empty points array by default', function ()
        {
            var curve = new SplineCurve();
            expect(curve.points).toEqual([]);
            expect(curve.points.length).toBe(0);
        });

        it('should set the curve type to SplineCurve', function ()
        {
            var curve = new SplineCurve();
            expect(curve.type).toBe('SplineCurve');
        });

        it('should accept an array of Vector2 objects', function ()
        {
            var points = [new Vector2(0, 0), new Vector2(100, 200), new Vector2(300, 400)];
            var curve = new SplineCurve(points);
            expect(curve.points.length).toBe(3);
            expect(curve.points[0].x).toBe(0);
            expect(curve.points[0].y).toBe(0);
            expect(curve.points[1].x).toBe(100);
            expect(curve.points[1].y).toBe(200);
            expect(curve.points[2].x).toBe(300);
            expect(curve.points[2].y).toBe(400);
        });

        it('should accept a flat array of number pairs', function ()
        {
            var curve = new SplineCurve([10, 20, 30, 40, 50, 60]);
            expect(curve.points.length).toBe(3);
            expect(curve.points[0].x).toBe(10);
            expect(curve.points[0].y).toBe(20);
            expect(curve.points[1].x).toBe(30);
            expect(curve.points[1].y).toBe(40);
            expect(curve.points[2].x).toBe(50);
            expect(curve.points[2].y).toBe(60);
        });

        it('should accept an array of [x, y] arrays', function ()
        {
            var curve = new SplineCurve([[10, 20], [30, 40], [50, 60]]);
            expect(curve.points.length).toBe(3);
            expect(curve.points[0].x).toBe(10);
            expect(curve.points[0].y).toBe(20);
            expect(curve.points[1].x).toBe(30);
            expect(curve.points[1].y).toBe(40);
            expect(curve.points[2].x).toBe(50);
            expect(curve.points[2].y).toBe(60);
        });

        it('should accept plain objects with x and y properties', function ()
        {
            var curve = new SplineCurve([{ x: 5, y: 10 }, { x: 15, y: 25 }]);
            expect(curve.points.length).toBe(2);
            expect(curve.points[0].x).toBe(5);
            expect(curve.points[0].y).toBe(10);
        });
    });

    describe('addPoints', function ()
    {
        it('should add Vector2 objects to the points array', function ()
        {
            var curve = new SplineCurve();
            curve.addPoints([new Vector2(1, 2), new Vector2(3, 4)]);
            expect(curve.points.length).toBe(2);
            expect(curve.points[0].x).toBe(1);
            expect(curve.points[0].y).toBe(2);
        });

        it('should add points from a flat number array', function ()
        {
            var curve = new SplineCurve();
            curve.addPoints([100, 200, 300, 400]);
            expect(curve.points.length).toBe(2);
            expect(curve.points[0].x).toBe(100);
            expect(curve.points[0].y).toBe(200);
            expect(curve.points[1].x).toBe(300);
            expect(curve.points[1].y).toBe(400);
        });

        it('should add points from an array of arrays', function ()
        {
            var curve = new SplineCurve();
            curve.addPoints([[7, 8], [9, 10]]);
            expect(curve.points.length).toBe(2);
            expect(curve.points[0].x).toBe(7);
            expect(curve.points[0].y).toBe(8);
            expect(curve.points[1].x).toBe(9);
            expect(curve.points[1].y).toBe(10);
        });

        it('should append to existing points', function ()
        {
            var curve = new SplineCurve([new Vector2(0, 0)]);
            curve.addPoints([new Vector2(1, 1), new Vector2(2, 2)]);
            expect(curve.points.length).toBe(3);
        });

        it('should return the curve instance for chaining', function ()
        {
            var curve = new SplineCurve();
            var result = curve.addPoints([new Vector2(0, 0)]);
            expect(result).toBe(curve);
        });

        it('should do nothing when passed an empty array', function ()
        {
            var curve = new SplineCurve();
            curve.addPoints([]);
            expect(curve.points.length).toBe(0);
        });
    });

    describe('addPoint', function ()
    {
        it('should add a single point with x and y', function ()
        {
            var curve = new SplineCurve();
            curve.addPoint(10, 20);
            expect(curve.points.length).toBe(1);
            expect(curve.points[0].x).toBe(10);
            expect(curve.points[0].y).toBe(20);
        });

        it('should return the new Vector2 added', function ()
        {
            var curve = new SplineCurve();
            var vec = curve.addPoint(5, 15);
            expect(vec).toBeInstanceOf(Vector2);
            expect(vec.x).toBe(5);
            expect(vec.y).toBe(15);
        });

        it('should append to existing points', function ()
        {
            var curve = new SplineCurve([new Vector2(0, 0)]);
            curve.addPoint(100, 200);
            expect(curve.points.length).toBe(2);
            expect(curve.points[1].x).toBe(100);
            expect(curve.points[1].y).toBe(200);
        });

        it('should handle zero coordinates', function ()
        {
            var curve = new SplineCurve();
            var vec = curve.addPoint(0, 0);
            expect(vec.x).toBe(0);
            expect(vec.y).toBe(0);
        });

        it('should handle negative coordinates', function ()
        {
            var curve = new SplineCurve();
            var vec = curve.addPoint(-50, -100);
            expect(vec.x).toBe(-50);
            expect(vec.y).toBe(-100);
        });

        it('should handle floating point coordinates', function ()
        {
            var curve = new SplineCurve();
            var vec = curve.addPoint(1.5, 2.75);
            expect(vec.x).toBeCloseTo(1.5);
            expect(vec.y).toBeCloseTo(2.75);
        });
    });

    describe('getStartPoint', function ()
    {
        it('should return the first point of the curve', function ()
        {
            var curve = new SplineCurve([new Vector2(10, 20), new Vector2(30, 40)]);
            var start = curve.getStartPoint();
            expect(start.x).toBe(10);
            expect(start.y).toBe(20);
        });

        it('should create a new Vector2 when no out parameter is provided', function ()
        {
            var curve = new SplineCurve([new Vector2(5, 15)]);
            var start = curve.getStartPoint();
            expect(start).toBeInstanceOf(Vector2);
        });

        it('should use the provided out Vector2 object', function ()
        {
            var curve = new SplineCurve([new Vector2(7, 9)]);
            var out = new Vector2();
            var result = curve.getStartPoint(out);
            expect(result).toBe(out);
            expect(out.x).toBe(7);
            expect(out.y).toBe(9);
        });
    });

    describe('getResolution', function ()
    {
        it('should return divisions multiplied by number of points', function ()
        {
            var curve = new SplineCurve([new Vector2(0, 0), new Vector2(100, 100), new Vector2(200, 200)]);
            expect(curve.getResolution(10)).toBe(30);
        });

        it('should return zero when there are no points', function ()
        {
            var curve = new SplineCurve();
            expect(curve.getResolution(10)).toBe(0);
        });

        it('should scale linearly with divisions', function ()
        {
            var curve = new SplineCurve([new Vector2(0, 0), new Vector2(100, 100)]);
            expect(curve.getResolution(5)).toBe(10);
            expect(curve.getResolution(20)).toBe(40);
        });

        it('should return divisions when there is one point', function ()
        {
            var curve = new SplineCurve([new Vector2(0, 0)]);
            expect(curve.getResolution(12)).toBe(12);
        });
    });

    describe('getPoint', function ()
    {
        it('should return a Vector2 when no out is provided', function ()
        {
            var curve = new SplineCurve([
                new Vector2(0, 0),
                new Vector2(100, 0),
                new Vector2(200, 0),
                new Vector2(300, 0)
            ]);
            var pt = curve.getPoint(0);
            expect(pt).toBeInstanceOf(Vector2);
        });

        it('should use the provided out Vector2 object', function ()
        {
            var curve = new SplineCurve([
                new Vector2(0, 0),
                new Vector2(100, 0),
                new Vector2(200, 0),
                new Vector2(300, 0)
            ]);
            var out = new Vector2();
            var result = curve.getPoint(0, out);
            expect(result).toBe(out);
        });

        it('should return the start point at t=0', function ()
        {
            var curve = new SplineCurve([
                new Vector2(0, 0),
                new Vector2(100, 0),
                new Vector2(200, 0),
                new Vector2(300, 0)
            ]);
            var pt = curve.getPoint(0);
            expect(pt.x).toBeCloseTo(0);
            expect(pt.y).toBeCloseTo(0);
        });

        it('should return the end point at t=1', function ()
        {
            var curve = new SplineCurve([
                new Vector2(0, 0),
                new Vector2(100, 0),
                new Vector2(200, 0),
                new Vector2(300, 0)
            ]);
            var pt = curve.getPoint(1);
            expect(pt.x).toBeCloseTo(300);
            expect(pt.y).toBeCloseTo(0);
        });

        it('should return an intermediate point at t=0.5', function ()
        {
            var curve = new SplineCurve([
                new Vector2(0, 0),
                new Vector2(100, 0),
                new Vector2(200, 0),
                new Vector2(300, 0)
            ]);
            var pt = curve.getPoint(0.5);
            expect(pt.x).toBeCloseTo(150);
            expect(pt.y).toBeCloseTo(0);
        });

        it('should interpolate y values correctly on a curved path', function ()
        {
            var curve = new SplineCurve([
                new Vector2(0, 0),
                new Vector2(100, 100),
                new Vector2(200, 0),
                new Vector2(300, 100)
            ]);
            var pt = curve.getPoint(0);
            expect(pt.x).toBeCloseTo(0);
            var ptEnd = curve.getPoint(1);
            expect(ptEnd.x).toBeCloseTo(300);
        });

        it('should work with two points', function ()
        {
            var curve = new SplineCurve([
                new Vector2(0, 0),
                new Vector2(200, 200)
            ]);
            var pt = curve.getPoint(0.5);
            expect(pt.x).toBeCloseTo(100);
            expect(pt.y).toBeCloseTo(100);
        });
    });

    describe('toJSON', function ()
    {
        it('should return an object with type and points properties', function ()
        {
            var curve = new SplineCurve();
            var json = curve.toJSON();
            expect(json).toHaveProperty('type');
            expect(json).toHaveProperty('points');
        });

        it('should set the type to SplineCurve', function ()
        {
            var curve = new SplineCurve();
            var json = curve.toJSON();
            expect(json.type).toBe('SplineCurve');
        });

        it('should export points as a flat array of interleaved x, y values', function ()
        {
            var curve = new SplineCurve([new Vector2(10, 20), new Vector2(30, 40)]);
            var json = curve.toJSON();
            expect(json.points).toEqual([10, 20, 30, 40]);
        });

        it('should export an empty points array when no points exist', function ()
        {
            var curve = new SplineCurve();
            var json = curve.toJSON();
            expect(json.points).toEqual([]);
        });

        it('should export all points in order', function ()
        {
            var curve = new SplineCurve([
                new Vector2(1, 2),
                new Vector2(3, 4),
                new Vector2(5, 6)
            ]);
            var json = curve.toJSON();
            expect(json.points).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });

    describe('fromJSON', function ()
    {
        it('should create a SplineCurve from a JSON object', function ()
        {
            var json = { type: 'SplineCurve', points: [10, 20, 30, 40, 50, 60] };
            var curve = SplineCurve.fromJSON(json);
            expect(curve).toBeInstanceOf(SplineCurve);
            expect(curve.points.length).toBe(3);
            expect(curve.points[0].x).toBe(10);
            expect(curve.points[0].y).toBe(20);
            expect(curve.points[2].x).toBe(50);
            expect(curve.points[2].y).toBe(60);
        });

        it('should round-trip through toJSON and fromJSON', function ()
        {
            var original = new SplineCurve([
                new Vector2(5, 10),
                new Vector2(15, 25),
                new Vector2(35, 50)
            ]);
            var json = original.toJSON();
            var restored = SplineCurve.fromJSON(json);
            expect(restored.points.length).toBe(original.points.length);
            for (var i = 0; i < original.points.length; i++)
            {
                expect(restored.points[i].x).toBe(original.points[i].x);
                expect(restored.points[i].y).toBe(original.points[i].y);
            }
        });
    });
});
