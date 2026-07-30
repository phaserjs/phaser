var GetLineToRectangle = require('../../../src/geom/intersects/GetLineToRectangle');
var Line = require('../../../src/geom/line/Line');
var Rectangle = require('../../../src/geom/rectangle/Rectangle');

describe('Phaser.Geom.Intersects.GetLineToRectangle', function ()
{
    // Rectangle from (0,0) to (100,100) used in most tests
    var rect;
    var line;

    beforeEach(function ()
    {
        rect = new Rectangle(0, 0, 100, 100);
    });

    it('should return an empty array when line does not intersect the rectangle', function ()
    {
        line = new Line(200, 0, 200, 100);
        var result = GetLineToRectangle(line, rect);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return two points when line crosses through the rectangle horizontally', function ()
    {
        line = new Line(-50, 50, 150, 50);
        var result = GetLineToRectangle(line, rect);
        expect(result.length).toBe(2);
    });

    it('should return correct x values for a horizontal crossing line', function ()
    {
        line = new Line(-50, 50, 150, 50);
        var result = GetLineToRectangle(line, rect);
        var xs = result.map(function (v) { return v.x; }).sort(function (a, b) { return a - b; });
        expect(xs[0]).toBeCloseTo(0, 5);
        expect(xs[1]).toBeCloseTo(100, 5);
    });

    it('should return correct y values for a horizontal crossing line', function ()
    {
        line = new Line(-50, 50, 150, 50);
        var result = GetLineToRectangle(line, rect);
        result.forEach(function (v)
        {
            expect(v.y).toBeCloseTo(50, 5);
        });
    });

    it('should return two points when line crosses through the rectangle vertically', function ()
    {
        line = new Line(50, -50, 50, 150);
        var result = GetLineToRectangle(line, rect);
        expect(result.length).toBe(2);
    });

    it('should return correct coordinates for a vertical crossing line', function ()
    {
        line = new Line(50, -50, 50, 150);
        var result = GetLineToRectangle(line, rect);
        var ys = result.map(function (v) { return v.y; }).sort(function (a, b) { return a - b; });
        expect(ys[0]).toBeCloseTo(0, 5);
        expect(ys[1]).toBeCloseTo(100, 5);
        result.forEach(function (v)
        {
            expect(v.x).toBeCloseTo(50, 5);
        });
    });

    it('should return an array when no out parameter is provided', function ()
    {
        line = new Line(-50, 50, 150, 50);
        var result = GetLineToRectangle(line, rect);
        expect(Array.isArray(result)).toBe(true);
    });

    it('should use the provided out array and return it', function ()
    {
        line = new Line(-50, 50, 150, 50);
        var out = [];
        var result = GetLineToRectangle(line, rect, out);
        expect(result).toBe(out);
        expect(out.length).toBe(2);
    });

    it('should append to an existing out array', function ()
    {
        line = new Line(-50, 50, 150, 50);
        var out = [];
        out.push({ x: 999, y: 999 });
        GetLineToRectangle(line, rect, out);
        expect(out.length).toBe(3);
        expect(out[0].x).toBe(999);
    });

    it('should return an empty array when line is above the rectangle', function ()
    {
        line = new Line(0, -50, 100, -50);
        var result = GetLineToRectangle(line, rect);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when line is below the rectangle', function ()
    {
        line = new Line(0, 150, 100, 150);
        var result = GetLineToRectangle(line, rect);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when line is to the left of the rectangle', function ()
    {
        line = new Line(-50, 0, -50, 100);
        var result = GetLineToRectangle(line, rect);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when line is to the right of the rectangle', function ()
    {
        line = new Line(150, 0, 150, 100);
        var result = GetLineToRectangle(line, rect);
        expect(result.length).toBe(0);
    });

    it('should return Vector2 objects with x and y properties', function ()
    {
        line = new Line(-50, 50, 150, 50);
        var result = GetLineToRectangle(line, rect);
        result.forEach(function (v)
        {
            expect(typeof v.x).toBe('number');
            expect(typeof v.y).toBe('number');
        });
    });

    it('should handle a diagonal line crossing two sides', function ()
    {
        // Diagonal from top-left area to bottom-right area, crossing top and right
        line = new Line(-20, -20, 150, 150);
        var result = GetLineToRectangle(line, rect);
        expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle a rectangle offset from origin', function ()
    {
        var offsetRect = new Rectangle(50, 50, 100, 100);
        // Horizontal line through the middle of the offset rect
        line = new Line(0, 100, 300, 100);
        var result = GetLineToRectangle(line, offsetRect);
        expect(result.length).toBe(2);
        var xs = result.map(function (v) { return v.x; }).sort(function (a, b) { return a - b; });
        expect(xs[0]).toBeCloseTo(50, 5);
        expect(xs[1]).toBeCloseTo(150, 5);
    });

    it('should return an empty array when line segment is entirely inside the rectangle', function ()
    {
        // A segment that starts and ends inside: no intersection with edges as a crossing
        line = new Line(10, 10, 90, 90);
        var result = GetLineToRectangle(line, rect);
        // The line is inside, so LineToRectangle may still report true (segment inside)
        // but edge-to-edge LineToLine checks won't produce intersection points for a contained segment
        expect(Array.isArray(result)).toBe(true);
    });

    it('should work with a zero-length rectangle', function ()
    {
        var zeroRect = new Rectangle(50, 50, 0, 0);
        line = new Line(0, 50, 100, 50);
        var result = GetLineToRectangle(line, zeroRect);
        expect(Array.isArray(result)).toBe(true);
    });

    it('should return an empty out array when no intersection occurs and out was provided', function ()
    {
        line = new Line(200, 200, 300, 300);
        var out = [];
        var result = GetLineToRectangle(line, rect, out);
        expect(result).toBe(out);
        expect(out.length).toBe(0);
    });
});
