var LineCurve = require('../../src/curves/LineCurve');
var Vector2 = require('../../src/math/Vector2');

describe('Line', function ()
{
    describe('constructor', function ()
    {
        it('should create a LineCurve from two Vector2 points', function ()
        {
            var p0 = new Vector2(0, 0);
            var p1 = new Vector2(100, 200);
            var curve = new LineCurve(p0, p1);

            expect(curve.p0).toBe(p0);
            expect(curve.p1).toBe(p1);
        });

        it('should create a LineCurve from a flat array', function ()
        {
            var curve = new LineCurve([ 10, 20, 30, 40 ]);

            expect(curve.p0.x).toBe(10);
            expect(curve.p0.y).toBe(20);
            expect(curve.p1.x).toBe(30);
            expect(curve.p1.y).toBe(40);
        });

        it('should set type to LineCurve', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(1, 1));

            expect(curve.type).toBe('LineCurve');
        });

        it('should set arcLengthDivisions to 1', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(1, 1));

            expect(curve.arcLengthDivisions).toBe(1);
        });

        it('should handle negative coordinates', function ()
        {
            var curve = new LineCurve([ -50, -100, -10, -20 ]);

            expect(curve.p0.x).toBe(-50);
            expect(curve.p0.y).toBe(-100);
            expect(curve.p1.x).toBe(-10);
            expect(curve.p1.y).toBe(-20);
        });

        it('should handle a zero-length line', function ()
        {
            var p = new Vector2(5, 5);
            var curve = new LineCurve(p, new Vector2(5, 5));

            expect(curve.p0.x).toBe(5);
            expect(curve.p0.y).toBe(5);
            expect(curve.p1.x).toBe(5);
            expect(curve.p1.y).toBe(5);
        });
    });

    describe('getBounds', function ()
    {
        it('should return a Rectangle covering both endpoints', function ()
        {
            var curve = new LineCurve(new Vector2(10, 20), new Vector2(110, 70));
            var bounds = curve.getBounds();

            expect(bounds.x).toBe(10);
            expect(bounds.y).toBe(20);
            expect(bounds.width).toBe(100);
            expect(bounds.height).toBe(50);
        });

        it('should store result in the provided out object', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(50, 50));
            var out = { x: 0, y: 0, width: 0, height: 0 };
            var result = curve.getBounds(out);

            expect(result).toBe(out);
        });

        it('should create a new Rectangle if no out is given', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 100));
            var bounds = curve.getBounds();

            expect(bounds).not.toBeNull();
            expect(typeof bounds.x).toBe('number');
        });

        it('should handle reversed coordinates', function ()
        {
            var curve = new LineCurve(new Vector2(100, 80), new Vector2(10, 20));
            var bounds = curve.getBounds();

            expect(bounds.x).toBe(10);
            expect(bounds.y).toBe(20);
            expect(bounds.width).toBe(90);
            expect(bounds.height).toBe(60);
        });
    });

    describe('getStartPoint', function ()
    {
        it('should return the start point coordinates', function ()
        {
            var curve = new LineCurve(new Vector2(5, 10), new Vector2(50, 100));
            var start = curve.getStartPoint();

            expect(start.x).toBe(5);
            expect(start.y).toBe(10);
        });

        it('should store result in the provided out object', function ()
        {
            var curve = new LineCurve(new Vector2(5, 10), new Vector2(50, 100));
            var out = new Vector2();
            var result = curve.getStartPoint(out);

            expect(result).toBe(out);
            expect(out.x).toBe(5);
            expect(out.y).toBe(10);
        });

        it('should create a new Vector2 if no out is given', function ()
        {
            var curve = new LineCurve(new Vector2(3, 7), new Vector2(30, 70));
            var result = curve.getStartPoint();

            expect(result.x).toBe(3);
            expect(result.y).toBe(7);
        });
    });

    describe('getResolution', function ()
    {
        it('should return 1 by default', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(10, 10));

            expect(curve.getResolution()).toBe(1);
        });

        it('should return the given divisions value', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(10, 10));

            expect(curve.getResolution(5)).toBe(5);
            expect(curve.getResolution(100)).toBe(100);
        });

        it('should return the divisions when explicitly set to 1', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(10, 10));

            expect(curve.getResolution(1)).toBe(1);
        });
    });

    describe('getPoint', function ()
    {
        it('should return the start point at t=0', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 200));
            var point = curve.getPoint(0);

            expect(point.x).toBeCloseTo(0);
            expect(point.y).toBeCloseTo(0);
        });

        it('should return the end point at t=1', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 200));
            var point = curve.getPoint(1);

            expect(point.x).toBe(100);
            expect(point.y).toBe(200);
        });

        it('should return the midpoint at t=0.5', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 200));
            var point = curve.getPoint(0.5);

            expect(point.x).toBeCloseTo(50);
            expect(point.y).toBeCloseTo(100);
        });

        it('should interpolate correctly at t=0.25', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 100));
            var point = curve.getPoint(0.25);

            expect(point.x).toBeCloseTo(25);
            expect(point.y).toBeCloseTo(25);
        });

        it('should store result in the provided out object', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 100));
            var out = new Vector2();
            var result = curve.getPoint(0.5, out);

            expect(result).toBe(out);
        });

        it('should create a new Vector2 if no out is given', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 100));
            var result = curve.getPoint(0.5);

            expect(result).not.toBeNull();
            expect(typeof result.x).toBe('number');
        });

        it('should work with non-origin start points', function ()
        {
            var curve = new LineCurve(new Vector2(10, 20), new Vector2(30, 40));
            var point = curve.getPoint(0.5);

            expect(point.x).toBeCloseTo(20);
            expect(point.y).toBeCloseTo(30);
        });

        it('should work with negative coordinates', function ()
        {
            var curve = new LineCurve(new Vector2(-100, -100), new Vector2(100, 100));
            var point = curve.getPoint(0.5);

            expect(point.x).toBeCloseTo(0);
            expect(point.y).toBeCloseTo(0);
        });
    });

    describe('getPointAt', function ()
    {
        it('should return the same result as getPoint for a straight line', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 200));
            var pt = curve.getPoint(0.5);
            var pAt = curve.getPointAt(0.5);

            expect(pAt.x).toBeCloseTo(pt.x);
            expect(pAt.y).toBeCloseTo(pt.y);
        });

        it('should return start at u=0', function ()
        {
            var curve = new LineCurve(new Vector2(5, 10), new Vector2(50, 100));
            var point = curve.getPointAt(0);

            expect(point.x).toBeCloseTo(5);
            expect(point.y).toBeCloseTo(10);
        });

        it('should return end at u=1', function ()
        {
            var curve = new LineCurve(new Vector2(5, 10), new Vector2(50, 100));
            var point = curve.getPointAt(1);

            expect(point.x).toBe(50);
            expect(point.y).toBe(100);
        });
    });

    describe('getTangent', function ()
    {
        it('should return a normalized direction vector', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(1, 0));
            var tangent = curve.getTangent();

            expect(tangent.x).toBeCloseTo(1);
            expect(tangent.y).toBeCloseTo(0);
        });

        it('should return a unit vector regardless of line length', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 0));
            var tangent = curve.getTangent();

            expect(tangent.x).toBeCloseTo(1);
            expect(tangent.y).toBeCloseTo(0);
        });

        it('should return the same tangent at any t value', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(3, 4));
            var t0 = curve.getTangent(0);
            var t5 = curve.getTangent(0.5);
            var t1 = curve.getTangent(1);

            expect(t0.x).toBeCloseTo(t5.x);
            expect(t0.y).toBeCloseTo(t5.y);
            expect(t0.x).toBeCloseTo(t1.x);
            expect(t0.y).toBeCloseTo(t1.y);
        });

        it('should return a unit vector for a diagonal line', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(3, 4));
            var tangent = curve.getTangent();
            var length = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y);

            expect(length).toBeCloseTo(1);
        });

        it('should store result in the provided out object', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(10, 0));
            var out = new Vector2();
            var result = curve.getTangent(0, out);

            expect(result).toBe(out);
        });

        it('should create a new Vector2 if no out is given', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(10, 0));
            var result = curve.getTangent();

            expect(result).not.toBeNull();
        });

        it('should handle a vertical line', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(0, 50));
            var tangent = curve.getTangent();

            expect(tangent.x).toBeCloseTo(0);
            expect(tangent.y).toBeCloseTo(1);
        });
    });

    describe('getUtoTmapping', function ()
    {
        it('should return u directly when no distance is given', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 0));

            expect(curve.getUtoTmapping(0.5, 0)).toBeCloseTo(0.5);
        });

        it('should return u=0 when u is 0 and no distance given', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 0));

            expect(curve.getUtoTmapping(0, 0)).toBeCloseTo(0);
        });

        it('should return t based on distance when distance is provided', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 0));
            var t = curve.getUtoTmapping(0, 50);

            expect(t).toBeCloseTo(0.5);
        });

        it('should clamp t to 1 when distance exceeds line length', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 0));
            var t = curve.getUtoTmapping(0, 9999);

            expect(t).toBeCloseTo(1);
        });

        it('should return 0 when distance is 0', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 0));
            var t = curve.getUtoTmapping(0, 0);

            expect(t).toBeCloseTo(0);
        });
    });

    describe('draw', function ()
    {
        it('should call lineBetween on the graphics object', function ()
        {
            var curve = new LineCurve(new Vector2(10, 20), new Vector2(30, 40));
            var graphics = {
                lineBetween: vi.fn()
            };

            curve.draw(graphics);

            expect(graphics.lineBetween).toHaveBeenCalledWith(10, 20, 30, 40);
        });

        it('should return the graphics object', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 100));
            var graphics = {
                lineBetween: vi.fn()
            };

            var result = curve.draw(graphics);

            expect(result).toBe(graphics);
        });
    });

    describe('toJSON', function ()
    {
        it('should return an object with the correct type', function ()
        {
            var curve = new LineCurve(new Vector2(0, 0), new Vector2(100, 200));
            var json = curve.toJSON();

            expect(json.type).toBe('LineCurve');
        });

        it('should return an object with the correct points array', function ()
        {
            var curve = new LineCurve(new Vector2(10, 20), new Vector2(30, 40));
            var json = curve.toJSON();

            expect(json.points).toEqual([ 10, 20, 30, 40 ]);
        });

        it('should encode negative coordinates correctly', function ()
        {
            var curve = new LineCurve(new Vector2(-5, -15), new Vector2(25, 35));
            var json = curve.toJSON();

            expect(json.points[0]).toBe(-5);
            expect(json.points[1]).toBe(-15);
            expect(json.points[2]).toBe(25);
            expect(json.points[3]).toBe(35);
        });
    });

    describe('fromJSON', function ()
    {
        it('should create a LineCurve from a JSON object', function ()
        {
            var json = {
                type: 'LineCurve',
                points: [ 10, 20, 30, 40 ]
            };

            var curve = LineCurve.fromJSON(json);

            expect(curve.p0.x).toBe(10);
            expect(curve.p0.y).toBe(20);
            expect(curve.p1.x).toBe(30);
            expect(curve.p1.y).toBe(40);
        });

        it('should produce a curve that round-trips through toJSON', function ()
        {
            var original = new LineCurve(new Vector2(5, 15), new Vector2(25, 35));
            var json = original.toJSON();
            var restored = LineCurve.fromJSON(json);

            expect(restored.p0.x).toBe(original.p0.x);
            expect(restored.p0.y).toBe(original.p0.y);
            expect(restored.p1.x).toBe(original.p1.x);
            expect(restored.p1.y).toBe(original.p1.y);
        });
    });
});
