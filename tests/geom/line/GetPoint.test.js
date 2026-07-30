var GetPoint = require('../../../src/geom/line/GetPoint');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Line.GetPoint', function ()
{
    var line;

    beforeEach(function ()
    {
        line = { x1: 0, y1: 0, x2: 100, y2: 100 };
    });

    it('should return a Vector2 when no out parameter is provided', function ()
    {
        var result = GetPoint(line, 0.5);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return the start point when position is 0', function ()
    {
        var result = GetPoint(line, 0);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should return the end point when position is 1', function ()
    {
        var result = GetPoint(line, 1);

        expect(result.x).toBe(100);
        expect(result.y).toBe(100);
    });

    it('should return the midpoint when position is 0.5', function ()
    {
        var result = GetPoint(line, 0.5);

        expect(result.x).toBe(50);
        expect(result.y).toBe(50);
    });

    it('should return the correct point at position 0.25', function ()
    {
        var result = GetPoint(line, 0.25);

        expect(result.x).toBe(25);
        expect(result.y).toBe(25);
    });

    it('should return the correct point at position 0.75', function ()
    {
        var result = GetPoint(line, 0.75);

        expect(result.x).toBe(75);
        expect(result.y).toBe(75);
    });

    it('should use the provided out object instead of creating a new one', function ()
    {
        var out = new Vector2();
        var result = GetPoint(line, 0.5, out);

        expect(result).toBe(out);
        expect(result.x).toBe(50);
        expect(result.y).toBe(50);
    });

    it('should work with a non-axis-aligned line', function ()
    {
        var diagLine = { x1: 0, y1: 0, x2: 200, y2: 100 };
        var result = GetPoint(diagLine, 0.5);

        expect(result.x).toBe(100);
        expect(result.y).toBe(50);
    });

    it('should work with negative coordinates', function ()
    {
        var negLine = { x1: -100, y1: -100, x2: 100, y2: 100 };
        var result = GetPoint(negLine, 0.5);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should work with a horizontal line', function ()
    {
        var hLine = { x1: 0, y1: 50, x2: 100, y2: 50 };
        var result = GetPoint(hLine, 0.5);

        expect(result.x).toBe(50);
        expect(result.y).toBe(50);
    });

    it('should work with a vertical line', function ()
    {
        var vLine = { x1: 50, y1: 0, x2: 50, y2: 100 };
        var result = GetPoint(vLine, 0.5);

        expect(result.x).toBe(50);
        expect(result.y).toBe(50);
    });

    it('should work with a zero-length line', function ()
    {
        var zeroLine = { x1: 5, y1: 5, x2: 5, y2: 5 };
        var result = GetPoint(zeroLine, 0.5);

        expect(result.x).toBe(5);
        expect(result.y).toBe(5);
    });

    it('should extrapolate beyond the line when position is greater than 1', function ()
    {
        var result = GetPoint(line, 2);

        expect(result.x).toBe(200);
        expect(result.y).toBe(200);
    });

    it('should extrapolate beyond the start when position is negative', function ()
    {
        var result = GetPoint(line, -1);

        expect(result.x).toBe(-100);
        expect(result.y).toBe(-100);
    });

    it('should work with floating point positions', function ()
    {
        var result = GetPoint(line, 0.1);

        expect(result.x).toBeCloseTo(10);
        expect(result.y).toBeCloseTo(10);
    });

    it('should work with floating point line coordinates', function ()
    {
        var floatLine = { x1: 0.5, y1: 1.5, x2: 10.5, y2: 5.5 };
        var result = GetPoint(floatLine, 0.5);

        expect(result.x).toBeCloseTo(5.5);
        expect(result.y).toBeCloseTo(3.5);
    });

    it('should update an existing out object with new values', function ()
    {
        var out = new Vector2(999, 999);
        GetPoint(line, 0.5, out);

        expect(out.x).toBe(50);
        expect(out.y).toBe(50);
    });
});
