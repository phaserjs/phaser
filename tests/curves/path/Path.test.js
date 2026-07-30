var Path = require('../../../src/curves/path/Path');
var Vector2 = require('../../../src/math/Vector2');
var Rectangle = require('../../../src/geom/rectangle/Rectangle');

describe('Path', function ()
{
    describe('constructor', function ()
    {
        it('should create a path with default values', function ()
        {
            var path = new Path();
            expect(path.name).toBe('');
            expect(path.defaultDivisions).toBe(12);
            expect(path.curves).toEqual([]);
            expect(path.cacheLengths).toEqual([]);
            expect(path.autoClose).toBe(false);
            expect(path.startPoint.x).toBe(0);
            expect(path.startPoint.y).toBe(0);
        });

        it('should create a path with given x and y', function ()
        {
            var path = new Path(100, 200);
            expect(path.startPoint.x).toBe(100);
            expect(path.startPoint.y).toBe(200);
        });

        it('should create a path from a JSON object', function ()
        {
            var json = {
                type: 'Path',
                x: 50,
                y: 75,
                autoClose: true,
                curves: [
                    {
                        type: 'LineCurve',
                        points: [ 50, 75, 150, 175 ]
                    }
                ]
            };
            var path = new Path(json);
            expect(path.startPoint.x).toBe(50);
            expect(path.startPoint.y).toBe(75);
            expect(path.autoClose).toBe(true);
            expect(path.curves.length).toBe(1);
        });

        it('should default x and y to 0 when undefined', function ()
        {
            var path = new Path(undefined, undefined);
            expect(path.startPoint.x).toBe(0);
            expect(path.startPoint.y).toBe(0);
        });
    });

    describe('add', function ()
    {
        it('should append a curve and return the path', function ()
        {
            var path = new Path();
            var mockCurve = { active: true, getPoint: function () { return new Vector2(); } };
            var result = path.add(mockCurve);
            expect(path.curves.length).toBe(1);
            expect(path.curves[0]).toBe(mockCurve);
            expect(result).toBe(path);
        });

        it('should append multiple curves in order', function ()
        {
            var path = new Path();
            var curveA = { id: 'a' };
            var curveB = { id: 'b' };
            path.add(curveA);
            path.add(curveB);
            expect(path.curves[0]).toBe(curveA);
            expect(path.curves[1]).toBe(curveB);
        });
    });

    describe('lineTo', function ()
    {
        it('should add a LineCurve from the start point to x/y', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 50);
            expect(path.curves.length).toBe(1);
        });

        it('should return the path', function ()
        {
            var path = new Path(0, 0);
            var result = path.lineTo(100, 50);
            expect(result).toBe(path);
        });

        it('should accept a Vector2 as first argument', function ()
        {
            var path = new Path(0, 0);
            var v = new Vector2(200, 300);
            path.lineTo(v);
            expect(path.curves.length).toBe(1);
        });

        it('should accept a Vector2Like object as first argument', function ()
        {
            var path = new Path(0, 0);
            path.lineTo({ x: 100, y: 200 });
            expect(path.curves.length).toBe(1);
        });

        it('should chain multiple lineTo calls', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0).lineTo(100, 100).lineTo(0, 100);
            expect(path.curves.length).toBe(3);
        });
    });

    describe('moveTo', function ()
    {
        it('should add a MovePathTo curve', function ()
        {
            var path = new Path(0, 0);
            path.moveTo(50, 50);
            expect(path.curves.length).toBe(1);
        });

        it('should return the path', function ()
        {
            var path = new Path(0, 0);
            var result = path.moveTo(50, 50);
            expect(result).toBe(path);
        });

        it('should accept a Vector2 as first argument', function ()
        {
            var path = new Path(0, 0);
            var v = new Vector2(50, 50);
            path.moveTo(v);
            expect(path.curves.length).toBe(1);
        });
    });

    describe('getEndPoint', function ()
    {
        it('should return the start point when path has no curves', function ()
        {
            var path = new Path(10, 20);
            var end = path.getEndPoint();
            expect(end.x).toBe(10);
            expect(end.y).toBe(20);
        });

        it('should return the end of the last curve', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var end = path.getEndPoint();
            expect(end.x).toBeCloseTo(100);
            expect(end.y).toBeCloseTo(0);
        });

        it('should write into an existing out Vector2', function ()
        {
            var path = new Path(5, 10);
            var out = new Vector2();
            var result = path.getEndPoint(out);
            expect(result).toBe(out);
            expect(out.x).toBe(5);
            expect(out.y).toBe(10);
        });
    });

    describe('getStartPoint', function ()
    {
        it('should return the defined start point', function ()
        {
            var path = new Path(30, 40);
            var start = path.getStartPoint();
            expect(start.x).toBe(30);
            expect(start.y).toBe(40);
        });

        it('should write into an existing out Vector2', function ()
        {
            var path = new Path(5, 10);
            var out = new Vector2();
            var result = path.getStartPoint(out);
            expect(result).toBe(out);
            expect(out.x).toBe(5);
            expect(out.y).toBe(10);
        });
    });

    describe('getLength', function ()
    {
        it('should return the total length of a single line segment', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            expect(path.getLength()).toBeCloseTo(100);
        });

        it('should return the total length of multiple line segments', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.lineTo(100, 100);
            expect(path.getLength()).toBeCloseTo(200);
        });
    });

    describe('getCurveLengths', function ()
    {
        it('should return an empty array for an empty path', function ()
        {
            var path = new Path();
            var lengths = path.getCurveLengths();
            expect(lengths).toEqual([]);
        });

        it('should return cumulative lengths for multiple curves', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.lineTo(100, 50);
            var lengths = path.getCurveLengths();
            expect(lengths.length).toBe(2);
            expect(lengths[0]).toBeCloseTo(100);
            expect(lengths[1]).toBeCloseTo(150);
        });

        it('should cache results and return the same array on subsequent calls', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var first = path.getCurveLengths();
            var second = path.getCurveLengths();
            expect(first).toBe(second);
        });
    });

    describe('getCurveAt', function ()
    {
        it('should return the first curve at t=0', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.lineTo(100, 100);
            var curve = path.getCurveAt(0);
            expect(curve).toBe(path.curves[0]);
        });

        it('should return the last curve at t=1', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.lineTo(100, 100);
            var curve = path.getCurveAt(1);
            expect(curve).toBe(path.curves[path.curves.length - 1]);
        });

        it('should return the correct curve at t=0.5 for equal-length segments', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.lineTo(200, 0);
            var curve = path.getCurveAt(0.5);
            expect(curve).not.toBeNull();
        });
    });

    describe('getPoint', function ()
    {
        it('should return the start point at t=0', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var pt = path.getPoint(0);
            expect(pt.x).toBeCloseTo(0);
            expect(pt.y).toBeCloseTo(0);
        });

        it('should return the end point at t=1', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var pt = path.getPoint(1);
            expect(pt.x).toBeCloseTo(100);
            expect(pt.y).toBeCloseTo(0);
        });

        it('should return the midpoint at t=0.5 on a single line', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var pt = path.getPoint(0.5);
            expect(pt.x).toBeCloseTo(50);
            expect(pt.y).toBeCloseTo(0);
        });

        it('should write into an existing out Vector2', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var out = new Vector2();
            var result = path.getPoint(0.5, out);
            expect(result).toBe(out);
        });

        it('should return null for an empty path', function ()
        {
            var path = new Path(0, 0);
            var pt = path.getPoint(0.5);
            expect(pt).toBeNull();
        });
    });

    describe('getPoints', function ()
    {
        it('should return an array of Vector2 points', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var pts = path.getPoints(10);
            expect(Array.isArray(pts)).toBe(true);
            expect(pts.length).toBeGreaterThan(0);
        });

        it('should use defaultDivisions when no arguments are given', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var pts = path.getPoints();
            expect(pts.length).toBeGreaterThan(0);
        });

        it('should not contain consecutive duplicate points', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.lineTo(200, 0);
            var pts = path.getPoints(10);
            for (var i = 1; i < pts.length; i++)
            {
                var prev = pts[i - 1];
                var curr = pts[i];
                expect(prev.equals(curr)).toBe(false);
            }
        });

        it('should append the first point when autoClose is true', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.lineTo(100, 100);
            path.autoClose = true;
            var pts = path.getPoints(4);
            var first = pts[0];
            var last = pts[pts.length - 1];
            expect(last.x).toBeCloseTo(first.x);
            expect(last.y).toBeCloseTo(first.y);
        });
    });

    describe('getSpacedPoints', function ()
    {
        it('should return divisions+1 points by default', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var pts = path.getSpacedPoints(10);
            expect(pts.length).toBe(11);
        });

        it('should use 40 divisions when no argument is given', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var pts = path.getSpacedPoints();
            expect(pts.length).toBe(41);
        });

        it('should append a duplicate closing point when autoClose is true', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.autoClose = true;
            var pts = path.getSpacedPoints(4);
            expect(pts.length).toBe(6);
            expect(pts[pts.length - 1]).toBe(pts[0]);
        });
    });

    describe('getRandomPoint', function ()
    {
        it('should return a Vector2', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var pt = path.getRandomPoint();
            expect(pt).toBeInstanceOf(Vector2);
        });

        it('should write into an existing out Vector2', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var out = new Vector2();
            var result = path.getRandomPoint(out);
            expect(result).toBe(out);
        });

        it('should return points within the line bounds over many iterations', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            for (var i = 0; i < 20; i++)
            {
                var pt = path.getRandomPoint();
                expect(pt.x).toBeGreaterThanOrEqual(0);
                expect(pt.x).toBeLessThanOrEqual(100);
            }
        });
    });

    describe('closePath', function ()
    {
        it('should add a line curve to close an open path', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.lineTo(100, 100);
            var countBefore = path.curves.length;
            path.closePath();
            expect(path.curves.length).toBe(countBefore + 1);
        });

        it('should return the path', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.lineTo(100, 100);
            var result = path.closePath();
            expect(result).toBe(path);
        });

        it('should not add an extra curve if path is already closed', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.lineTo(100, 100);
            path.lineTo(0, 0);
            var countBefore = path.curves.length;
            path.closePath();
            expect(path.curves.length).toBe(countBefore);
        });
    });

    describe('cubicBezierTo', function ()
    {
        it('should add a CubicBezierCurve using numeric arguments', function ()
        {
            var path = new Path(0, 0);
            path.cubicBezierTo(100, 0, 25, -50, 75, -50);
            expect(path.curves.length).toBe(1);
        });

        it('should add a CubicBezierCurve using Vector2 arguments', function ()
        {
            var path = new Path(0, 0);
            var p1 = new Vector2(25, -50);
            var p2 = new Vector2(75, -50);
            var p3 = new Vector2(100, 0);
            path.cubicBezierTo(p1, p2, p3);
            expect(path.curves.length).toBe(1);
        });

        it('should return the path', function ()
        {
            var path = new Path(0, 0);
            var result = path.cubicBezierTo(100, 0, 25, -50, 75, -50);
            expect(result).toBe(path);
        });
    });

    describe('quadraticBezierTo', function ()
    {
        it('should add a QuadraticBezierCurve using numeric arguments', function ()
        {
            var path = new Path(0, 0);
            path.quadraticBezierTo(100, 0, 50, -50);
            expect(path.curves.length).toBe(1);
        });

        it('should add a QuadraticBezierCurve using Vector2 arguments', function ()
        {
            var path = new Path(0, 0);
            var p1 = new Vector2(50, -50);
            var p2 = new Vector2(100, 0);
            path.quadraticBezierTo(p1, p2);
            expect(path.curves.length).toBe(1);
        });

        it('should return the path', function ()
        {
            var path = new Path(0, 0);
            var result = path.quadraticBezierTo(100, 0, 50, -50);
            expect(result).toBe(path);
        });
    });

    describe('ellipseTo', function ()
    {
        it('should add an EllipseCurve', function ()
        {
            var path = new Path(0, 0);
            path.ellipseTo(50, 30, 0, 360, false, 0);
            expect(path.curves.length).toBe(1);
        });

        it('should return the path', function ()
        {
            var path = new Path(0, 0);
            var result = path.ellipseTo(50, 30, 0, 360, false, 0);
            expect(result).toBe(path);
        });
    });

    describe('circleTo', function ()
    {
        it('should add an EllipseCurve (circle)', function ()
        {
            var path = new Path(0, 0);
            path.circleTo(50);
            expect(path.curves.length).toBe(1);
        });

        it('should return the path', function ()
        {
            var path = new Path(0, 0);
            var result = path.circleTo(50);
            expect(result).toBe(path);
        });
    });

    describe('splineTo', function ()
    {
        it('should add a SplineCurve', function ()
        {
            var path = new Path(0, 0);
            path.splineTo([ new Vector2(50, 50), new Vector2(100, 0) ]);
            expect(path.curves.length).toBe(1);
        });

        it('should return the path', function ()
        {
            var path = new Path(0, 0);
            var result = path.splineTo([ new Vector2(50, 50), new Vector2(100, 0) ]);
            expect(result).toBe(path);
        });
    });

    describe('getTangent', function ()
    {
        it('should return a Vector2 tangent for a horizontal line at t=0.5', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var tangent = path.getTangent(0.5);
            expect(tangent).not.toBeNull();
            expect(tangent.x).toBeCloseTo(1);
            expect(tangent.y).toBeCloseTo(0);
        });

        it('should write into an existing out Vector2', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var out = new Vector2();
            var result = path.getTangent(0.5, out);
            expect(result).toBe(out);
        });

        it('should return null for an empty path', function ()
        {
            var path = new Path(0, 0);
            var tangent = path.getTangent(0.5);
            expect(tangent).toBeNull();
        });
    });

    describe('getBounds', function ()
    {
        it('should return a Rectangle', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 50);
            var bounds = path.getBounds();
            expect(bounds).toBeInstanceOf(Rectangle);
        });

        it('should write into an existing Rectangle', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 50);
            var out = new Rectangle();
            var result = path.getBounds(out);
            expect(result).toBe(out);
        });

        it('should return correct bounds for a horizontal line', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var bounds = path.getBounds();
            expect(bounds.x).toBeCloseTo(0);
            expect(bounds.y).toBeCloseTo(0);
            expect(bounds.width).toBeCloseTo(100);
            expect(bounds.height).toBeCloseTo(0);
        });

        it('should return correct bounds for a diagonal line', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 50);
            var bounds = path.getBounds();
            expect(bounds.x).toBeCloseTo(0);
            expect(bounds.y).toBeCloseTo(0);
            expect(bounds.right).toBeCloseTo(100);
            expect(bounds.bottom).toBeCloseTo(50);
        });
    });

    describe('toJSON', function ()
    {
        it('should return an object with type Path', function ()
        {
            var path = new Path(10, 20);
            var json = path.toJSON();
            expect(json.type).toBe('Path');
        });

        it('should include the start point coordinates', function ()
        {
            var path = new Path(10, 20);
            var json = path.toJSON();
            expect(json.x).toBe(10);
            expect(json.y).toBe(20);
        });

        it('should include the autoClose flag', function ()
        {
            var path = new Path();
            path.autoClose = true;
            var json = path.toJSON();
            expect(json.autoClose).toBe(true);
        });

        it('should include serialized curves', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var json = path.toJSON();
            expect(Array.isArray(json.curves)).toBe(true);
            expect(json.curves.length).toBe(1);
        });

        it('should produce JSON that can be round-tripped via fromJSON', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.lineTo(100, 100);
            var json = path.toJSON();
            var path2 = new Path(json);
            expect(path2.curves.length).toBe(path.curves.length);
            expect(path2.startPoint.x).toBe(path.startPoint.x);
            expect(path2.startPoint.y).toBe(path.startPoint.y);
        });
    });

    describe('fromJSON', function ()
    {
        it('should clear existing curves when loading JSON', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(50, 0);
            var json = {
                type: 'Path',
                x: 0,
                y: 0,
                autoClose: false,
                curves: []
            };
            path.fromJSON(json);
            expect(path.curves.length).toBe(0);
        });

        it('should set autoClose from JSON', function ()
        {
            var path = new Path();
            var json = {
                type: 'Path',
                x: 0,
                y: 0,
                autoClose: true,
                curves: []
            };
            path.fromJSON(json);
            expect(path.autoClose).toBe(true);
        });

        it('should reconstruct LineCurve from JSON', function ()
        {
            var json = {
                type: 'Path',
                x: 0,
                y: 0,
                autoClose: false,
                curves: [ { type: 'LineCurve', points: [ 0, 0, 100, 0 ] } ]
            };
            var path = new Path(json);
            expect(path.curves.length).toBe(1);
        });

        it('should return the path', function ()
        {
            var path = new Path();
            var json = {
                type: 'Path',
                x: 0,
                y: 0,
                autoClose: false,
                curves: []
            };
            var result = path.fromJSON(json);
            expect(result).toBe(path);
        });
    });

    describe('updateArcLengths', function ()
    {
        it('should clear the cache', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.getCurveLengths();
            expect(path.cacheLengths.length).toBe(1);
            path.updateArcLengths();
            // After calling, getCurveLengths is called again internally which repopulates
            expect(path.cacheLengths.length).toBe(1);
        });

        it('should force recalculation on next getCurveLengths call', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            var first = path.getCurveLengths();
            path.updateArcLengths();
            var second = path.getCurveLengths();
            // Both should have same values
            expect(second[0]).toBeCloseTo(first[0]);
        });
    });

    describe('destroy', function ()
    {
        it('should empty the curves array', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.destroy();
            expect(path.curves.length).toBe(0);
        });

        it('should empty the cacheLengths array', function ()
        {
            var path = new Path(0, 0);
            path.lineTo(100, 0);
            path.getCurveLengths();
            path.destroy();
            expect(path.cacheLengths.length).toBe(0);
        });

        it('should set startPoint to undefined', function ()
        {
            var path = new Path(0, 0);
            path.destroy();
            expect(path.startPoint).toBeUndefined();
        });
    });
});
