var CubicBezierCurve = require('../../src/curves/CubicBezierCurve');
var Vector2 = require('../../src/math/Vector2');

describe('CubicBezier', function ()
{
    var p0, p1, p2, p3;

    beforeEach(function ()
    {
        p0 = new Vector2(0, 0);
        p1 = new Vector2(33, 100);
        p2 = new Vector2(66, 100);
        p3 = new Vector2(100, 0);
    });

    describe('constructor', function ()
    {
        it('should create a curve with four Vector2 points', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);

            expect(curve.p0).toBe(p0);
            expect(curve.p1).toBe(p1);
            expect(curve.p2).toBe(p2);
            expect(curve.p3).toBe(p3);
        });

        it('should set the correct type', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);

            expect(curve.type).toBe('CubicBezierCurve');
        });

        it('should accept an array of 8 values as the first argument', function ()
        {
            var curve = new CubicBezierCurve([ 0, 0, 33, 100, 66, 100, 100, 0 ]);

            expect(curve.p0.x).toBe(0);
            expect(curve.p0.y).toBe(0);
            expect(curve.p1.x).toBe(33);
            expect(curve.p1.y).toBe(100);
            expect(curve.p2.x).toBe(66);
            expect(curve.p2.y).toBe(100);
            expect(curve.p3.x).toBe(100);
            expect(curve.p3.y).toBe(0);
        });

        it('should create Vector2 instances when constructed from an array', function ()
        {
            var curve = new CubicBezierCurve([ 0, 0, 33, 100, 66, 100, 100, 0 ]);

            expect(curve.p0).toBeInstanceOf(Vector2);
            expect(curve.p1).toBeInstanceOf(Vector2);
            expect(curve.p2).toBeInstanceOf(Vector2);
            expect(curve.p3).toBeInstanceOf(Vector2);
        });

        it('should handle a straight line (all points collinear)', function ()
        {
            var curve = new CubicBezierCurve(
                new Vector2(0, 0),
                new Vector2(33, 0),
                new Vector2(66, 0),
                new Vector2(100, 0)
            );

            expect(curve.p0.y).toBe(0);
            expect(curve.p3.x).toBe(100);
        });

        it('should handle negative coordinate values', function ()
        {
            var curve = new CubicBezierCurve(
                new Vector2(-100, -100),
                new Vector2(-50, 50),
                new Vector2(50, -50),
                new Vector2(100, 100)
            );

            expect(curve.p0.x).toBe(-100);
            expect(curve.p0.y).toBe(-100);
            expect(curve.p3.x).toBe(100);
            expect(curve.p3.y).toBe(100);
        });
    });

    describe('getStartPoint', function ()
    {
        it('should return a Vector2 matching p0', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);
            var result = curve.getStartPoint();

            expect(result.x).toBe(p0.x);
            expect(result.y).toBe(p0.y);
        });

        it('should create a new Vector2 when no out argument is provided', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);
            var result = curve.getStartPoint();

            expect(result).toBeInstanceOf(Vector2);
        });

        it('should populate and return the provided out Vector2', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);
            var out = new Vector2();
            var result = curve.getStartPoint(out);

            expect(result).toBe(out);
            expect(out.x).toBe(p0.x);
            expect(out.y).toBe(p0.y);
        });

        it('should return start point with negative coordinates', function ()
        {
            var start = new Vector2(-50, -75);
            var curve = new CubicBezierCurve(start, p1, p2, p3);
            var result = curve.getStartPoint();

            expect(result.x).toBe(-50);
            expect(result.y).toBe(-75);
        });
    });

    describe('getResolution', function ()
    {
        it('should return the divisions value unchanged', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);

            expect(curve.getResolution(10)).toBe(10);
        });

        it('should return 1 when passed 1', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);

            expect(curve.getResolution(1)).toBe(1);
        });

        it('should return 0 when passed 0', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);

            expect(curve.getResolution(0)).toBe(0);
        });

        it('should return large values unchanged', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);

            expect(curve.getResolution(1000)).toBe(1000);
        });
    });

    describe('getPoint', function ()
    {
        it('should return p0 at t=0', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);
            var result = curve.getPoint(0);

            expect(result.x).toBeCloseTo(p0.x);
            expect(result.y).toBeCloseTo(p0.y);
        });

        it('should return p3 at t=1', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);
            var result = curve.getPoint(1);

            expect(result.x).toBeCloseTo(p3.x);
            expect(result.y).toBeCloseTo(p3.y);
        });

        it('should return a point between p0 and p3 at t=0.5', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);
            var result = curve.getPoint(0.5);

            expect(result.x).toBeGreaterThan(p0.x);
            expect(result.x).toBeLessThan(p3.x);
        });

        it('should return a new Vector2 when no out is provided', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);
            var result = curve.getPoint(0.5);

            expect(result).toBeInstanceOf(Vector2);
        });

        it('should populate and return the provided out Vector2', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);
            var out = new Vector2();
            var result = curve.getPoint(0.5, out);

            expect(result).toBe(out);
        });

        it('should compute the correct midpoint for a symmetric arch curve', function ()
        {
            // Symmetric arch: p0=(0,0), p1=(0,100), p2=(100,100), p3=(100,0)
            var curve = new CubicBezierCurve(
                new Vector2(0, 0),
                new Vector2(0, 100),
                new Vector2(100, 100),
                new Vector2(100, 0)
            );
            var result = curve.getPoint(0.5);

            // By symmetry, midpoint x should be 50
            expect(result.x).toBeCloseTo(50);
        });

        it('should return a straight-line midpoint for collinear control points', function ()
        {
            // p1x + p2x must equal 100 for the midpoint to land exactly at x=50
            // B(0.5) = (1/8)*0 + (3/8)*25 + (3/8)*75 + (1/8)*100 = 50
            var curve = new CubicBezierCurve(
                new Vector2(0, 0),
                new Vector2(25, 0),
                new Vector2(75, 0),
                new Vector2(100, 0)
            );
            var result = curve.getPoint(0.5);

            expect(result.x).toBeCloseTo(50);
            expect(result.y).toBeCloseTo(0);
        });

        it('should handle t values near boundaries without error', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);
            var nearStart = curve.getPoint(0.0001);
            var nearEnd = curve.getPoint(0.9999);

            expect(nearStart.x).toBeGreaterThanOrEqual(0);
            expect(nearEnd.x).toBeLessThanOrEqual(100);
        });
    });

    describe('draw', function ()
    {
        it('should call graphics methods and return the graphics object', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);

            var graphics = {
                beginPath: vi.fn(),
                moveTo: vi.fn(),
                lineTo: vi.fn(),
                strokePath: vi.fn()
            };

            var result = curve.draw(graphics);

            expect(result).toBe(graphics);
        });

        it('should call beginPath once', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);

            var graphics = {
                beginPath: vi.fn(),
                moveTo: vi.fn(),
                lineTo: vi.fn(),
                strokePath: vi.fn()
            };

            curve.draw(graphics);

            expect(graphics.beginPath).toHaveBeenCalledTimes(1);
        });

        it('should call moveTo with p0 coordinates', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);

            var graphics = {
                beginPath: vi.fn(),
                moveTo: vi.fn(),
                lineTo: vi.fn(),
                strokePath: vi.fn()
            };

            curve.draw(graphics);

            expect(graphics.moveTo).toHaveBeenCalledWith(p0.x, p0.y);
        });

        it('should call strokePath once', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);

            var graphics = {
                beginPath: vi.fn(),
                moveTo: vi.fn(),
                lineTo: vi.fn(),
                strokePath: vi.fn()
            };

            curve.draw(graphics);

            expect(graphics.strokePath).toHaveBeenCalledTimes(1);
        });

        it('should use 32 points by default', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);

            var graphics = {
                beginPath: vi.fn(),
                moveTo: vi.fn(),
                lineTo: vi.fn(),
                strokePath: vi.fn()
            };

            curve.draw(graphics);

            // getPoints(32) returns 33 points (0..32), moveTo handles index 0,
            // so lineTo is called for indices 1..32 = 32 times
            expect(graphics.lineTo).toHaveBeenCalledTimes(32);
        });

        it('should use the provided pointsTotal argument', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);

            var graphics = {
                beginPath: vi.fn(),
                moveTo: vi.fn(),
                lineTo: vi.fn(),
                strokePath: vi.fn()
            };

            curve.draw(graphics, 10);

            // getPoints(10) returns 11 points, lineTo called 10 times
            expect(graphics.lineTo).toHaveBeenCalledTimes(10);
        });
    });

    describe('toJSON', function ()
    {
        it('should return an object with a type property', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);
            var json = curve.toJSON();

            expect(json.type).toBe('CubicBezierCurve');
        });

        it('should return an object with a points array of length 8', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);
            var json = curve.toJSON();

            expect(Array.isArray(json.points)).toBe(true);
            expect(json.points.length).toBe(8);
        });

        it('should encode points in correct order: p0, p1, p2, p3', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);
            var json = curve.toJSON();

            expect(json.points[0]).toBe(p0.x);
            expect(json.points[1]).toBe(p0.y);
            expect(json.points[2]).toBe(p1.x);
            expect(json.points[3]).toBe(p1.y);
            expect(json.points[4]).toBe(p2.x);
            expect(json.points[5]).toBe(p2.y);
            expect(json.points[6]).toBe(p3.x);
            expect(json.points[7]).toBe(p3.y);
        });

        it('should round-trip via fromJSON', function ()
        {
            var curve = new CubicBezierCurve(p0, p1, p2, p3);
            var json = curve.toJSON();
            var restored = CubicBezierCurve.fromJSON(json);

            expect(restored.p0.x).toBe(p0.x);
            expect(restored.p0.y).toBe(p0.y);
            expect(restored.p1.x).toBe(p1.x);
            expect(restored.p1.y).toBe(p1.y);
            expect(restored.p2.x).toBe(p2.x);
            expect(restored.p2.y).toBe(p2.y);
            expect(restored.p3.x).toBe(p3.x);
            expect(restored.p3.y).toBe(p3.y);
        });

        it('should preserve negative coordinates in JSON output', function ()
        {
            var curve = new CubicBezierCurve(
                new Vector2(-10, -20),
                new Vector2(-5, 30),
                new Vector2(5, -30),
                new Vector2(10, 20)
            );
            var json = curve.toJSON();

            expect(json.points[0]).toBe(-10);
            expect(json.points[1]).toBe(-20);
            expect(json.points[6]).toBe(10);
            expect(json.points[7]).toBe(20);
        });
    });

    describe('fromJSON', function ()
    {
        it('should create a CubicBezierCurve from a JSON object', function ()
        {
            var data = {
                type: 'CubicBezierCurve',
                points: [ 0, 0, 33, 100, 66, 100, 100, 0 ]
            };

            var curve = CubicBezierCurve.fromJSON(data);

            expect(curve).toBeInstanceOf(CubicBezierCurve);
        });

        it('should correctly assign all four points from JSON', function ()
        {
            var data = {
                type: 'CubicBezierCurve',
                points: [ 1, 2, 3, 4, 5, 6, 7, 8 ]
            };

            var curve = CubicBezierCurve.fromJSON(data);

            expect(curve.p0.x).toBe(1);
            expect(curve.p0.y).toBe(2);
            expect(curve.p1.x).toBe(3);
            expect(curve.p1.y).toBe(4);
            expect(curve.p2.x).toBe(5);
            expect(curve.p2.y).toBe(6);
            expect(curve.p3.x).toBe(7);
            expect(curve.p3.y).toBe(8);
        });
    });
});
