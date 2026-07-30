var EllipseCurve = require('../../src/curves/EllipseCurve');

describe('Ellipse', function ()
{
    describe('Constructor', function ()
    {
        it('should create an ellipse curve with default values', function ()
        {
            var curve = new EllipseCurve(0, 0, 0);
            expect(curve.x).toBe(0);
            expect(curve.y).toBe(0);
            expect(curve.xRadius).toBe(0);
            expect(curve.yRadius).toBe(0);
            expect(curve.startAngle).toBe(0);
            expect(curve.endAngle).toBe(360);
            expect(curve.clockwise).toBe(false);
            expect(curve.rotation).toBe(0);
        });

        it('should create an ellipse curve with given positional arguments', function ()
        {
            var curve = new EllipseCurve(100, 200, 50, 30, 0, 360, false, 0);
            expect(curve.x).toBe(100);
            expect(curve.y).toBe(200);
            expect(curve.xRadius).toBe(50);
            expect(curve.yRadius).toBe(30);
            expect(curve.startAngle).toBe(0);
            expect(curve.endAngle).toBe(360);
            expect(curve.clockwise).toBe(false);
        });

        it('should default yRadius to xRadius when not provided', function ()
        {
            var curve = new EllipseCurve(0, 0, 40);
            expect(curve.xRadius).toBe(40);
            expect(curve.yRadius).toBe(40);
        });

        it('should create an ellipse curve from a config object', function ()
        {
            var curve = new EllipseCurve({
                x: 10,
                y: 20,
                xRadius: 100,
                yRadius: 50,
                startAngle: 45,
                endAngle: 270,
                clockwise: true,
                rotation: 90
            });
            expect(curve.x).toBe(10);
            expect(curve.y).toBe(20);
            expect(curve.xRadius).toBe(100);
            expect(curve.yRadius).toBe(50);
            expect(curve.startAngle).toBeCloseTo(45);
            expect(curve.endAngle).toBeCloseTo(270);
            expect(curve.clockwise).toBe(true);
            expect(curve.angle).toBeCloseTo(90);
        });

        it('should default yRadius to xRadius when config object omits yRadius', function ()
        {
            var curve = new EllipseCurve({ xRadius: 75 });
            expect(curve.xRadius).toBe(75);
            expect(curve.yRadius).toBe(75);
        });

        it('should have the correct curve type', function ()
        {
            var curve = new EllipseCurve();
            expect(curve.type).toBe('EllipseCurve');
        });

        it('should store startAngle and endAngle as radians internally', function ()
        {
            var curve = new EllipseCurve(0, 0, 50, 50, 90, 180);
            expect(curve._startAngle).toBeCloseTo(Math.PI / 2);
            expect(curve._endAngle).toBeCloseTo(Math.PI);
        });
    });

    describe('getStartPoint', function ()
    {
        it('should return a Vector2 at t=0', function ()
        {
            var curve = new EllipseCurve(0, 0, 100, 100, 0, 360, false, 0);
            var point = curve.getStartPoint();
            expect(point.x).toBeCloseTo(100);
            expect(point.y).toBeCloseTo(0);
        });

        it('should write into the provided out vector', function ()
        {
            var curve = new EllipseCurve(0, 0, 50, 50, 0, 360, false, 0);
            var out = { x: 0, y: 0, set: function (x, y) { this.x = x; this.y = y; return this; } };
            var result = curve.getStartPoint(out);
            expect(result).toBe(out);
            expect(out.x).toBeCloseTo(50);
            expect(out.y).toBeCloseTo(0);
        });

        it('should respect a non-zero start angle', function ()
        {
            var curve = new EllipseCurve(0, 0, 100, 100, 90, 360, false, 0);
            var point = curve.getStartPoint();
            expect(point.x).toBeCloseTo(0);
            expect(point.y).toBeCloseTo(100);
        });
    });

    describe('getResolution', function ()
    {
        it('should return double the divisions value', function ()
        {
            var curve = new EllipseCurve();
            expect(curve.getResolution(10)).toBe(20);
        });

        it('should return zero for zero divisions', function ()
        {
            var curve = new EllipseCurve();
            expect(curve.getResolution(0)).toBe(0);
        });

        it('should return double the value for any input', function ()
        {
            var curve = new EllipseCurve();
            expect(curve.getResolution(1)).toBe(2);
            expect(curve.getResolution(5)).toBe(10);
            expect(curve.getResolution(100)).toBe(200);
        });
    });

    describe('getPoint', function ()
    {
        it('should return t=0 at the start angle', function ()
        {
            var curve = new EllipseCurve(0, 0, 100, 100, 0, 360, false, 0);
            var point = curve.getPoint(0);
            expect(point.x).toBeCloseTo(100);
            expect(point.y).toBeCloseTo(0);
        });

        it('should return t=1 at the end angle for a full circle', function ()
        {
            var curve = new EllipseCurve(0, 0, 100, 100, 0, 360, false, 0);
            var point = curve.getPoint(1);
            expect(point.x).toBeCloseTo(100);
            expect(point.y).toBeCloseTo(0);
        });

        it('should return t=0.5 at the opposite side of a full circle', function ()
        {
            var curve = new EllipseCurve(0, 0, 100, 100, 0, 360, false, 0);
            var point = curve.getPoint(0.5);
            expect(point.x).toBeCloseTo(-100);
            expect(point.y).toBeCloseTo(0);
        });

        it('should offset by center position', function ()
        {
            var curve = new EllipseCurve(50, 50, 100, 100, 0, 360, false, 0);
            var point = curve.getPoint(0);
            expect(point.x).toBeCloseTo(150);
            expect(point.y).toBeCloseTo(50);
        });

        it('should respect different x and y radii', function ()
        {
            var curve = new EllipseCurve(0, 0, 100, 50, 0, 360, false, 0);
            var point = curve.getPoint(0);
            expect(point.x).toBeCloseTo(100);
            expect(point.y).toBeCloseTo(0);

            var point2 = curve.getPoint(0.25);
            expect(point2.x).toBeCloseTo(0);
            expect(point2.y).toBeCloseTo(50);
        });

        it('should create a new Vector2 when out is not provided', function ()
        {
            var curve = new EllipseCurve(0, 0, 100, 100);
            var point = curve.getPoint(0);
            expect(point).toBeDefined();
            expect(typeof point.x).toBe('number');
            expect(typeof point.y).toBe('number');
        });

        it('should write into the provided out vector', function ()
        {
            var curve = new EllipseCurve(0, 0, 100, 100, 0, 360, false, 0);
            var out = { x: 0, y: 0, set: function (x, y) { this.x = x; this.y = y; return this; } };
            var result = curve.getPoint(0, out);
            expect(result).toBe(out);
        });

        it('should handle clockwise direction', function ()
        {
            var ccw = new EllipseCurve(0, 0, 100, 100, 0, 360, false, 0);
            var cw = new EllipseCurve(0, 0, 100, 100, 0, 360, true, 0);

            var ccwPoint = ccw.getPoint(0.25);
            var cwPoint = cw.getPoint(0.25);

            // CCW at 0.25 of 360 deg => 90 deg => (0, 100)
            expect(ccwPoint.x).toBeCloseTo(0);
            expect(ccwPoint.y).toBeCloseTo(100);

            // CW at 0.25 of 360 deg => -90 deg => (0, -100)
            expect(cwPoint.x).toBeCloseTo(0);
            expect(cwPoint.y).toBeCloseTo(-100);
        });

        it('should apply rotation', function ()
        {
            var curve = new EllipseCurve(0, 0, 100, 100, 0, 360, false, 90);
            var point = curve.getPoint(0);
            // start point at angle 0 rotated by 90 degrees
            // original: (100, 0), after 90deg rotation: (0, 100) -- but rotation is in degrees here via setter
            // Actually setRotation takes radians, but constructor takes degrees converted via DegToRad
            // After 90 deg rotation: x=0, y=100
            expect(point.x).toBeCloseTo(0);
            expect(point.y).toBeCloseTo(100);
        });

        it('should handle a partial arc at t=0.5 for a 180-degree arc', function ()
        {
            var curve = new EllipseCurve(0, 0, 100, 100, 0, 180, false, 0);
            var point = curve.getPoint(0.5);
            // midpoint of 0..180 => 90 deg => (0, 100)
            expect(point.x).toBeCloseTo(0);
            expect(point.y).toBeCloseTo(100);
        });
    });

    describe('setXRadius', function ()
    {
        it('should set the horizontal radius and return the curve', function ()
        {
            var curve = new EllipseCurve(0, 0, 10, 10);
            var result = curve.setXRadius(200);
            expect(curve.xRadius).toBe(200);
            expect(result).toBe(curve);
        });

        it('should accept zero', function ()
        {
            var curve = new EllipseCurve(0, 0, 50, 50);
            curve.setXRadius(0);
            expect(curve.xRadius).toBe(0);
        });

        it('should accept negative values', function ()
        {
            var curve = new EllipseCurve(0, 0, 50, 50);
            curve.setXRadius(-10);
            expect(curve.xRadius).toBe(-10);
        });
    });

    describe('setYRadius', function ()
    {
        it('should set the vertical radius and return the curve', function ()
        {
            var curve = new EllipseCurve(0, 0, 10, 10);
            var result = curve.setYRadius(300);
            expect(curve.yRadius).toBe(300);
            expect(result).toBe(curve);
        });

        it('should accept zero', function ()
        {
            var curve = new EllipseCurve(0, 0, 50, 50);
            curve.setYRadius(0);
            expect(curve.yRadius).toBe(0);
        });
    });

    describe('setWidth', function ()
    {
        it('should set xRadius to half the given width and return the curve', function ()
        {
            var curve = new EllipseCurve();
            var result = curve.setWidth(200);
            expect(curve.xRadius).toBe(100);
            expect(result).toBe(curve);
        });

        it('should work with odd values', function ()
        {
            var curve = new EllipseCurve();
            curve.setWidth(100);
            expect(curve.xRadius).toBe(50);
        });

        it('should work with zero', function ()
        {
            var curve = new EllipseCurve(0, 0, 50, 50);
            curve.setWidth(0);
            expect(curve.xRadius).toBe(0);
        });
    });

    describe('setHeight', function ()
    {
        it('should set yRadius to half the given height and return the curve', function ()
        {
            var curve = new EllipseCurve();
            var result = curve.setHeight(400);
            expect(curve.yRadius).toBe(200);
            expect(result).toBe(curve);
        });

        it('should work with zero', function ()
        {
            var curve = new EllipseCurve(0, 0, 50, 50);
            curve.setHeight(0);
            expect(curve.yRadius).toBe(0);
        });
    });

    describe('setStartAngle', function ()
    {
        it('should set the start angle in degrees and return the curve', function ()
        {
            var curve = new EllipseCurve();
            var result = curve.setStartAngle(90);
            expect(curve.startAngle).toBeCloseTo(90);
            expect(result).toBe(curve);
        });

        it('should store the value internally as radians', function ()
        {
            var curve = new EllipseCurve();
            curve.setStartAngle(180);
            expect(curve._startAngle).toBeCloseTo(Math.PI);
        });

        it('should accept zero', function ()
        {
            var curve = new EllipseCurve(0, 0, 50, 50, 90);
            curve.setStartAngle(0);
            expect(curve.startAngle).toBeCloseTo(0);
        });
    });

    describe('setEndAngle', function ()
    {
        it('should set the end angle in degrees and return the curve', function ()
        {
            var curve = new EllipseCurve();
            var result = curve.setEndAngle(180);
            expect(curve.endAngle).toBeCloseTo(180);
            expect(result).toBe(curve);
        });

        it('should store the value internally as radians', function ()
        {
            var curve = new EllipseCurve();
            curve.setEndAngle(270);
            expect(curve._endAngle).toBeCloseTo(3 * Math.PI / 2);
        });
    });

    describe('setClockwise', function ()
    {
        it('should set clockwise to true and return the curve', function ()
        {
            var curve = new EllipseCurve();
            var result = curve.setClockwise(true);
            expect(curve.clockwise).toBe(true);
            expect(result).toBe(curve);
        });

        it('should set clockwise to false', function ()
        {
            var curve = new EllipseCurve(0, 0, 50, 50, 0, 360, true);
            curve.setClockwise(false);
            expect(curve.clockwise).toBe(false);
        });
    });

    describe('setRotation', function ()
    {
        it('should set rotation in radians and return the curve', function ()
        {
            var curve = new EllipseCurve();
            var result = curve.setRotation(Math.PI / 2);
            expect(curve.rotation).toBeCloseTo(Math.PI / 2);
            expect(result).toBe(curve);
        });

        it('should accept zero', function ()
        {
            var curve = new EllipseCurve(0, 0, 50, 50, 0, 360, false, 45);
            curve.setRotation(0);
            expect(curve.rotation).toBeCloseTo(0);
        });

        it('should accept negative values', function ()
        {
            var curve = new EllipseCurve();
            curve.setRotation(-Math.PI);
            expect(curve.rotation).toBeCloseTo(-Math.PI);
        });
    });

    describe('toJSON', function ()
    {
        it('should return an object with the correct type', function ()
        {
            var curve = new EllipseCurve();
            var json = curve.toJSON();
            expect(json.type).toBe('EllipseCurve');
        });

        it('should serialize all properties correctly', function ()
        {
            var curve = new EllipseCurve(10, 20, 50, 30, 45, 270, true, 90);
            var json = curve.toJSON();
            expect(json.x).toBe(10);
            expect(json.y).toBe(20);
            expect(json.xRadius).toBe(50);
            expect(json.yRadius).toBe(30);
            expect(json.startAngle).toBeCloseTo(45);
            expect(json.endAngle).toBeCloseTo(270);
            expect(json.clockwise).toBe(true);
            expect(json.rotation).toBeCloseTo(90);
        });

        it('should serialize default values', function ()
        {
            var curve = new EllipseCurve(0, 0, 0, 0);
            var json = curve.toJSON();
            expect(json.x).toBe(0);
            expect(json.y).toBe(0);
            expect(json.xRadius).toBe(0);
            expect(json.yRadius).toBe(0);
            expect(json.startAngle).toBeCloseTo(0);
            expect(json.endAngle).toBeCloseTo(360);
            expect(json.clockwise).toBe(false);
            expect(json.rotation).toBeCloseTo(0);
        });

        it('should be usable with fromJSON to reconstruct the curve', function ()
        {
            var original = new EllipseCurve(5, 15, 80, 40, 30, 300, false, 45);
            var json = original.toJSON();
            var restored = EllipseCurve.fromJSON(json);

            expect(restored.x).toBe(original.x);
            expect(restored.y).toBe(original.y);
            expect(restored.xRadius).toBe(original.xRadius);
            expect(restored.yRadius).toBe(original.yRadius);
            expect(restored.startAngle).toBeCloseTo(original.startAngle);
            expect(restored.endAngle).toBeCloseTo(original.endAngle);
            expect(restored.clockwise).toBe(original.clockwise);
            expect(restored.angle).toBeCloseTo(original.angle);
        });
    });

    describe('fromJSON', function ()
    {
        it('should create a curve from a JSON object', function ()
        {
            var json = {
                type: 'EllipseCurve',
                x: 0,
                y: 0,
                xRadius: 100,
                yRadius: 50,
                startAngle: 0,
                endAngle: 360,
                clockwise: false,
                rotation: 0
            };
            var curve = EllipseCurve.fromJSON(json);
            expect(curve.xRadius).toBe(100);
            expect(curve.yRadius).toBe(50);
        });
    });

    describe('property accessors', function ()
    {
        it('should get and set x via the accessor', function ()
        {
            var curve = new EllipseCurve(10, 20, 50);
            expect(curve.x).toBe(10);
            curve.x = 99;
            expect(curve.x).toBe(99);
            expect(curve.p0.x).toBe(99);
        });

        it('should get and set y via the accessor', function ()
        {
            var curve = new EllipseCurve(10, 20, 50);
            expect(curve.y).toBe(20);
            curve.y = 77;
            expect(curve.y).toBe(77);
            expect(curve.p0.y).toBe(77);
        });

        it('should get and set xRadius via the accessor', function ()
        {
            var curve = new EllipseCurve(0, 0, 50, 50);
            expect(curve.xRadius).toBe(50);
            curve.xRadius = 120;
            expect(curve.xRadius).toBe(120);
        });

        it('should get and set yRadius via the accessor', function ()
        {
            var curve = new EllipseCurve(0, 0, 50, 50);
            expect(curve.yRadius).toBe(50);
            curve.yRadius = 80;
            expect(curve.yRadius).toBe(80);
        });

        it('should get and set startAngle in degrees via the accessor', function ()
        {
            var curve = new EllipseCurve(0, 0, 50, 50, 0);
            curve.startAngle = 45;
            expect(curve.startAngle).toBeCloseTo(45);
            expect(curve._startAngle).toBeCloseTo(Math.PI / 4);
        });

        it('should get and set endAngle in degrees via the accessor', function ()
        {
            var curve = new EllipseCurve();
            curve.endAngle = 180;
            expect(curve.endAngle).toBeCloseTo(180);
            expect(curve._endAngle).toBeCloseTo(Math.PI);
        });

        it('should get and set clockwise via the accessor', function ()
        {
            var curve = new EllipseCurve();
            expect(curve.clockwise).toBe(false);
            curve.clockwise = true;
            expect(curve.clockwise).toBe(true);
        });

        it('should get and set rotation in radians via the accessor', function ()
        {
            var curve = new EllipseCurve();
            curve.rotation = Math.PI;
            expect(curve.rotation).toBeCloseTo(Math.PI);
        });

        it('should get and set angle in degrees via the angle accessor', function ()
        {
            var curve = new EllipseCurve();
            curve.angle = 90;
            expect(curve.angle).toBeCloseTo(90);
            expect(curve._rotation).toBeCloseTo(Math.PI / 2);
        });
    });
});
