var Curve = require('../../src/curves/Curve');
var Vector2 = require('../../src/math/Vector2');
var Rectangle = require('../../src/geom/rectangle/Rectangle');

// A simple concrete curve: straight horizontal line from (0,0) to (100,0)
function createLineCurve ()
{
    var curve = new Curve('LineCurve');

    curve.getPoint = function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }
        out.x = t * 100;
        out.y = 0;
        return out;
    };

    return curve;
}

// A diagonal line from (0,0) to (100,100)
function createDiagonalCurve ()
{
    var curve = new Curve('DiagonalCurve');

    curve.getPoint = function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }
        out.x = t * 100;
        out.y = t * 100;
        return out;
    };

    return curve;
}

describe('Phaser.Curves.Curve', function ()
{
    describe('constructor', function ()
    {
        it('should set the curve type', function ()
        {
            var curve = new Curve('TestCurve');
            expect(curve.type).toBe('TestCurve');
        });

        it('should set defaultDivisions to 5', function ()
        {
            var curve = new Curve('TestCurve');
            expect(curve.defaultDivisions).toBe(5);
        });

        it('should set arcLengthDivisions to 100', function ()
        {
            var curve = new Curve('TestCurve');
            expect(curve.arcLengthDivisions).toBe(100);
        });

        it('should set needsUpdate to true', function ()
        {
            var curve = new Curve('TestCurve');
            expect(curve.needsUpdate).toBe(true);
        });

        it('should set active to true', function ()
        {
            var curve = new Curve('TestCurve');
            expect(curve.active).toBe(true);
        });

        it('should initialize cacheArcLengths as an empty array', function ()
        {
            var curve = new Curve('TestCurve');
            expect(Array.isArray(curve.cacheArcLengths)).toBe(true);
            expect(curve.cacheArcLengths.length).toBe(0);
        });
    });

    describe('getLengths', function ()
    {
        it('should return an array with length divisions + 1', function ()
        {
            var curve = createLineCurve();
            var lengths = curve.getLengths(10);
            expect(Array.isArray(lengths)).toBe(true);
            expect(lengths.length).toBe(11);
        });

        it('should always start at 0', function ()
        {
            var curve = createLineCurve();
            var lengths = curve.getLengths(10);
            expect(lengths[0]).toBe(0);
        });

        it('should end at the total arc length', function ()
        {
            var curve = createLineCurve();
            var lengths = curve.getLengths(100);
            expect(lengths[lengths.length - 1]).toBeCloseTo(100, 1);
        });

        it('should be monotonically non-decreasing', function ()
        {
            var curve = createLineCurve();
            var lengths = curve.getLengths(20);
            for (var i = 1; i < lengths.length; i++)
            {
                expect(lengths[i]).toBeGreaterThanOrEqual(lengths[i - 1]);
            }
        });

        it('should cache the result and return the same array reference on subsequent calls', function ()
        {
            var curve = createLineCurve();
            var lengths1 = curve.getLengths(10);
            var lengths2 = curve.getLengths(10);
            expect(lengths1).toBe(lengths2);
        });

        it('should set needsUpdate to false after calculating', function ()
        {
            var curve = createLineCurve();
            curve.getLengths(10);
            expect(curve.needsUpdate).toBe(false);
        });

        it('should recalculate when needsUpdate is true', function ()
        {
            var curve = createLineCurve();
            var lengths1 = curve.getLengths(10);
            curve.needsUpdate = true;
            var lengths2 = curve.getLengths(10);
            // After recalculation a new array is created
            expect(lengths2).not.toBe(lengths1);
            expect(lengths2[lengths2.length - 1]).toBeCloseTo(100, 1);
        });

        it('should use arcLengthDivisions when no divisions argument given', function ()
        {
            var curve = createLineCurve();
            curve.arcLengthDivisions = 50;
            var lengths = curve.getLengths();
            expect(lengths.length).toBe(51);
        });

        it('should correctly compute lengths for a diagonal curve', function ()
        {
            var curve = createDiagonalCurve();
            var lengths = curve.getLengths(100);
            // Diagonal of a 100x100 square is ~141.42
            expect(lengths[lengths.length - 1]).toBeCloseTo(141.42, 0);
        });
    });

    describe('getLength', function ()
    {
        it('should return the total arc length of the curve', function ()
        {
            var curve = createLineCurve();
            expect(curve.getLength()).toBeCloseTo(100, 1);
        });

        it('should return the correct length for a diagonal curve', function ()
        {
            var curve = createDiagonalCurve();
            expect(curve.getLength()).toBeCloseTo(141.42, 0);
        });
    });

    describe('getUtoTmapping', function ()
    {
        it('should return 0 for u=0', function ()
        {
            var curve = createLineCurve();
            expect(curve.getUtoTmapping(0)).toBeCloseTo(0, 5);
        });

        it('should return 1 for u=1', function ()
        {
            var curve = createLineCurve();
            expect(curve.getUtoTmapping(1)).toBeCloseTo(1, 5);
        });

        it('should return 0.5 for u=0.5 on a uniform curve', function ()
        {
            var curve = createLineCurve();
            expect(curve.getUtoTmapping(0.5)).toBeCloseTo(0.5, 2);
        });

        it('should use the distance argument when provided instead of u', function ()
        {
            var curve = createLineCurve();
            // distance=50 on a 100px line maps to t≈0.5
            var t = curve.getUtoTmapping(0, 50);
            expect(t).toBeCloseTo(0.5, 2);
        });

        it('should cap distance to the maximum arc length', function ()
        {
            var curve = createLineCurve();
            var t = curve.getUtoTmapping(0, 9999);
            expect(t).toBeCloseTo(1, 5);
        });

        it('should return 0 when distance is 0', function ()
        {
            var curve = createLineCurve();
            var t = curve.getUtoTmapping(0, 0);
            // distance=0 treated as falsy, uses u=0
            expect(t).toBeCloseTo(0, 5);
        });
    });

    describe('getTFromDistance', function ()
    {
        it('should return 0 for distance of 0', function ()
        {
            var curve = createLineCurve();
            expect(curve.getTFromDistance(0)).toBe(0);
        });

        it('should return 0 for negative distance', function ()
        {
            var curve = createLineCurve();
            expect(curve.getTFromDistance(-50)).toBe(0);
        });

        it('should return the correct t for a mid-curve distance', function ()
        {
            var curve = createLineCurve();
            var t = curve.getTFromDistance(50);
            expect(t).toBeCloseTo(0.5, 2);
        });

        it('should return close to 1 for the full curve distance', function ()
        {
            var curve = createLineCurve();
            var t = curve.getTFromDistance(100);
            expect(t).toBeCloseTo(1, 2);
        });

        it('should return a value between 0 and 1 for valid distances', function ()
        {
            var curve = createLineCurve();
            var t = curve.getTFromDistance(25);
            expect(t).toBeGreaterThanOrEqual(0);
            expect(t).toBeLessThanOrEqual(1);
        });
    });

    describe('getPointAt', function ()
    {
        it('should return a Vector2', function ()
        {
            var curve = createLineCurve();
            var point = curve.getPointAt(0.5);
            expect(typeof point.x).toBe('number');
            expect(typeof point.y).toBe('number');
        });

        it('should return the start point for u=0', function ()
        {
            var curve = createLineCurve();
            var point = curve.getPointAt(0);
            expect(point.x).toBeCloseTo(0, 1);
            expect(point.y).toBeCloseTo(0, 1);
        });

        it('should return the end point for u=1', function ()
        {
            var curve = createLineCurve();
            var point = curve.getPointAt(1);
            expect(point.x).toBeCloseTo(100, 1);
            expect(point.y).toBeCloseTo(0, 1);
        });

        it('should return the midpoint for u=0.5 on a uniform curve', function ()
        {
            var curve = createLineCurve();
            var point = curve.getPointAt(0.5);
            expect(point.x).toBeCloseTo(50, 1);
            expect(point.y).toBeCloseTo(0, 1);
        });

        it('should store the result in the provided out vector', function ()
        {
            var curve = createLineCurve();
            var out = new Vector2();
            var result = curve.getPointAt(0.5, out);
            expect(result).toBe(out);
        });
    });

    describe('getStartPoint', function ()
    {
        it('should return the start point of the curve', function ()
        {
            var curve = createLineCurve();
            var point = curve.getStartPoint();
            expect(point.x).toBeCloseTo(0, 1);
            expect(point.y).toBeCloseTo(0, 1);
        });

        it('should create and return a new Vector2 when no out is provided', function ()
        {
            var curve = createLineCurve();
            var point = curve.getStartPoint();
            expect(point).toBeDefined();
            expect(typeof point.x).toBe('number');
        });

        it('should store the result in the provided out vector', function ()
        {
            var curve = createLineCurve();
            var out = new Vector2();
            var result = curve.getStartPoint(out);
            expect(result).toBe(out);
        });
    });

    describe('getEndPoint', function ()
    {
        it('should return the end point of the curve', function ()
        {
            var curve = createLineCurve();
            var point = curve.getEndPoint();
            expect(point.x).toBeCloseTo(100, 1);
            expect(point.y).toBeCloseTo(0, 1);
        });

        it('should create and return a new Vector2 when no out is provided', function ()
        {
            var curve = createLineCurve();
            var point = curve.getEndPoint();
            expect(point).toBeDefined();
            expect(typeof point.x).toBe('number');
        });

        it('should store the result in the provided out vector', function ()
        {
            var curve = createLineCurve();
            var out = new Vector2();
            var result = curve.getEndPoint(out);
            expect(result).toBe(out);
        });
    });

    describe('getPoints', function ()
    {
        it('should return divisions + 1 points', function ()
        {
            var curve = createLineCurve();
            var points = curve.getPoints(10);
            expect(points.length).toBe(11);
        });

        it('should use defaultDivisions when called with no arguments', function ()
        {
            var curve = createLineCurve();
            var points = curve.getPoints();
            expect(points.length).toBe(curve.defaultDivisions + 1);
        });

        it('should use stepRate to calculate divisions when divisions is falsy', function ()
        {
            var curve = createLineCurve();
            // length=100, stepRate=10 => divisions=10 => 11 points
            var points = curve.getPoints(0, 10);
            expect(points.length).toBe(11);
        });

        it('should append to an existing out array', function ()
        {
            var curve = createLineCurve();
            var out = [];
            var result = curve.getPoints(5, undefined, out);
            expect(result).toBe(out);
            expect(out.length).toBe(6);
        });

        it('should return points spanning the full curve', function ()
        {
            var curve = createLineCurve();
            var points = curve.getPoints(4);
            expect(points[0].x).toBeCloseTo(0, 5);
            expect(points[2].x).toBeCloseTo(50, 5);
            expect(points[4].x).toBeCloseTo(100, 5);
        });

        it('should return an array of Vector2-like objects', function ()
        {
            var curve = createLineCurve();
            var points = curve.getPoints(5);
            for (var i = 0; i < points.length; i++)
            {
                expect(typeof points[i].x).toBe('number');
                expect(typeof points[i].y).toBe('number');
            }
        });
    });

    describe('getSpacedPoints', function ()
    {
        it('should return divisions + 1 points', function ()
        {
            var curve = createLineCurve();
            var points = curve.getSpacedPoints(10);
            expect(points.length).toBe(11);
        });

        it('should use defaultDivisions when called with no arguments', function ()
        {
            var curve = createLineCurve();
            var points = curve.getSpacedPoints();
            expect(points.length).toBe(curve.defaultDivisions + 1);
        });

        it('should use stepRate to calculate divisions when divisions is falsy', function ()
        {
            var curve = createLineCurve();
            // length=100, stepRate=10 => divisions=10 => 11 points
            var points = curve.getSpacedPoints(0, 10);
            expect(points.length).toBe(11);
        });

        it('should append to an existing out array', function ()
        {
            var curve = createLineCurve();
            var out = [];
            var result = curve.getSpacedPoints(5, undefined, out);
            expect(result).toBe(out);
            expect(out.length).toBe(6);
        });

        it('should return evenly spaced points from start to end', function ()
        {
            var curve = createLineCurve();
            var points = curve.getSpacedPoints(4);
            expect(points[0].x).toBeCloseTo(0, 1);
            expect(points[4].x).toBeCloseTo(100, 1);
        });

        it('should return an array of Vector2-like objects', function ()
        {
            var curve = createLineCurve();
            var points = curve.getSpacedPoints(5);
            for (var i = 0; i < points.length; i++)
            {
                expect(typeof points[i].x).toBe('number');
                expect(typeof points[i].y).toBe('number');
            }
        });
    });

    describe('getRandomPoint', function ()
    {
        it('should return a point with numeric x and y', function ()
        {
            var curve = createLineCurve();
            var point = curve.getRandomPoint();
            expect(typeof point.x).toBe('number');
            expect(typeof point.y).toBe('number');
        });

        it('should return a point lying on the curve', function ()
        {
            var curve = createLineCurve();
            for (var i = 0; i < 20; i++)
            {
                var point = curve.getRandomPoint();
                expect(point.x).toBeGreaterThanOrEqual(0);
                expect(point.x).toBeLessThanOrEqual(100);
                expect(point.y).toBeCloseTo(0, 5);
            }
        });

        it('should create a new Vector2 when no out is provided', function ()
        {
            var curve = createLineCurve();
            var point = curve.getRandomPoint();
            expect(point).toBeDefined();
        });

        it('should store the result in the provided out vector', function ()
        {
            var curve = createLineCurve();
            var out = new Vector2();
            var result = curve.getRandomPoint(out);
            expect(result).toBe(out);
        });
    });

    describe('getTangent', function ()
    {
        it('should return a unit vector for a mid-curve horizontal line', function ()
        {
            var curve = createLineCurve();
            var tangent = curve.getTangent(0.5);
            expect(tangent.x).toBeCloseTo(1, 3);
            expect(tangent.y).toBeCloseTo(0, 3);
        });

        it('should return a unit vector at t=0 (clamped start)', function ()
        {
            var curve = createLineCurve();
            var tangent = curve.getTangent(0);
            expect(tangent.x).toBeCloseTo(1, 3);
            expect(tangent.y).toBeCloseTo(0, 3);
        });

        it('should return a unit vector at t=1 (clamped end)', function ()
        {
            var curve = createLineCurve();
            var tangent = curve.getTangent(1);
            expect(tangent.x).toBeCloseTo(1, 3);
            expect(tangent.y).toBeCloseTo(0, 3);
        });

        it('should return a normalized vector with magnitude close to 1', function ()
        {
            var curve = createLineCurve();
            var tangent = curve.getTangent(0.5);
            var length = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y);
            expect(length).toBeCloseTo(1, 5);
        });

        it('should return the correct tangent direction for a diagonal curve', function ()
        {
            var curve = createDiagonalCurve();
            var tangent = curve.getTangent(0.5);
            // Diagonal direction normalized: (1/sqrt(2), 1/sqrt(2))
            expect(tangent.x).toBeCloseTo(0.7071, 3);
            expect(tangent.y).toBeCloseTo(0.7071, 3);
        });

        it('should store the result in the provided out vector', function ()
        {
            var curve = createLineCurve();
            var out = new Vector2();
            var result = curve.getTangent(0.5, out);
            expect(result).toBe(out);
        });
    });

    describe('getTangentAt', function ()
    {
        it('should return the tangent at a given arc-length position', function ()
        {
            var curve = createLineCurve();
            var tangent = curve.getTangentAt(0.5);
            expect(tangent.x).toBeCloseTo(1, 3);
            expect(tangent.y).toBeCloseTo(0, 3);
        });

        it('should return a normalized vector', function ()
        {
            var curve = createLineCurve();
            var tangent = curve.getTangentAt(0.5);
            var length = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y);
            expect(length).toBeCloseTo(1, 5);
        });

        it('should store the result in the provided out vector', function ()
        {
            var curve = createLineCurve();
            var out = new Vector2();
            var result = curve.getTangentAt(0.5, out);
            expect(result).toBe(out);
        });
    });

    describe('getBounds', function ()
    {
        it('should return an object with x, y, width, and height', function ()
        {
            var curve = createLineCurve();
            var bounds = curve.getBounds();
            expect(typeof bounds.x).toBe('number');
            expect(typeof bounds.y).toBe('number');
            expect(typeof bounds.width).toBe('number');
            expect(typeof bounds.height).toBe('number');
        });

        it('should store the result in the provided out Rectangle', function ()
        {
            var curve = createLineCurve();
            var out = new Rectangle();
            var result = curve.getBounds(out);
            expect(result).toBe(out);
        });

        it('should create a new Rectangle when out is not provided', function ()
        {
            var curve = createLineCurve();
            var bounds = curve.getBounds();
            expect(bounds).toBeDefined();
        });

        it('should return bounds that encompass the full horizontal line', function ()
        {
            var curve = createLineCurve();
            var bounds = curve.getBounds(undefined, 1);
            expect(bounds.x).toBeCloseTo(0, 0);
            expect(bounds.x + bounds.width).toBeCloseTo(100, 0);
        });

        it('should use accuracy=16 by default', function ()
        {
            var curve = createLineCurve();
            // Just verifying it runs without error with the default accuracy
            var bounds = curve.getBounds();
            expect(bounds).toBeDefined();
        });
    });

    describe('getDistancePoints', function ()
    {
        it('should return an array', function ()
        {
            var curve = createLineCurve();
            var points = curve.getDistancePoints(10);
            expect(Array.isArray(points)).toBe(true);
        });

        it('should return at least one point', function ()
        {
            var curve = createLineCurve();
            var points = curve.getDistancePoints(10);
            expect(points.length).toBeGreaterThan(0);
        });

        it('should return more points for a smaller distance', function ()
        {
            var curve = createLineCurve();
            var points5 = curve.getDistancePoints(5);
            var points25 = curve.getDistancePoints(25);
            expect(points5.length).toBeGreaterThan(points25.length);
        });

        it('should return approximately length/distance points', function ()
        {
            var curve = createLineCurve();
            // length=100, distance=10 => spaced=10 => getSpacedPoints(10) => 11 points
            var points = curve.getDistancePoints(10);
            expect(points.length).toBe(11);
        });
    });

    describe('draw', function ()
    {
        it('should call strokePoints on the graphics object', function ()
        {
            var curve = createLineCurve();
            var called = false;
            var mockGraphics = {
                strokePoints: function (points)
                {
                    called = true;
                    return mockGraphics;
                }
            };
            curve.draw(mockGraphics, 16);
            expect(called).toBe(true);
        });

        it('should return the graphics object', function ()
        {
            var curve = createLineCurve();
            var mockGraphics = {
                strokePoints: function (points) { return mockGraphics; }
            };
            var result = curve.draw(mockGraphics, 16);
            expect(result).toBe(mockGraphics);
        });

        it('should pass 32 + 1 points by default when pointsTotal is not specified', function ()
        {
            var curve = createLineCurve();
            var capturedPoints;
            var mockGraphics = {
                strokePoints: function (points)
                {
                    capturedPoints = points;
                    return mockGraphics;
                }
            };
            curve.draw(mockGraphics);
            expect(capturedPoints.length).toBe(33);
        });

        it('should pass the correct number of points for a custom pointsTotal', function ()
        {
            var curve = createLineCurve();
            var capturedPoints;
            var mockGraphics = {
                strokePoints: function (points)
                {
                    capturedPoints = points;
                    return mockGraphics;
                }
            };
            curve.draw(mockGraphics, 10);
            expect(capturedPoints.length).toBe(11);
        });
    });

    describe('updateArcLengths', function ()
    {
        it('should trigger recalculation of arc lengths', function ()
        {
            var curve = createLineCurve();
            curve.getLengths(10);
            expect(curve.needsUpdate).toBe(false);

            // Spy to confirm getLengths runs a fresh calculation
            var oldCache = curve.cacheArcLengths;
            curve.updateArcLengths();

            // A new array should have been computed
            expect(curve.cacheArcLengths).not.toBe(oldCache);
        });

        it('should result in a valid cacheArcLengths after update', function ()
        {
            var curve = createLineCurve();
            curve.updateArcLengths();
            expect(curve.cacheArcLengths.length).toBeGreaterThan(0);
            expect(curve.cacheArcLengths[0]).toBe(0);
        });

        it('should not leave needsUpdate as true after completing', function ()
        {
            var curve = createLineCurve();
            curve.updateArcLengths();
            // updateArcLengths sets needsUpdate=true then calls getLengths which sets it false
            expect(curve.needsUpdate).toBe(false);
        });
    });
});
