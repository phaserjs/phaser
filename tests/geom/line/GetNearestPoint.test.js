var GetNearestPoint = require('../../../src/geom/line/GetNearestPoint');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Line.GetNearestPoint', function ()
{
    it('should return a Vector2 when no out parameter is provided', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var vec = new Vector2(5, 5);
        var result = GetNearestPoint(line, vec);
        expect(result).toBeInstanceOf(Vector2);
    });

    it('should use the provided out Vector2', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var vec = new Vector2(5, 5);
        var out = new Vector2();
        var result = GetNearestPoint(line, vec, out);
        expect(result).toBe(out);
    });

    it('should return the nearest point on a horizontal line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var vec = new Vector2(5, 5);
        var result = GetNearestPoint(line, vec);
        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(0);
    });

    it('should return the nearest point on a vertical line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 10 };
        var vec = new Vector2(5, 5);
        var result = GetNearestPoint(line, vec);
        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(5);
    });

    it('should return the nearest point on a diagonal line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        var vec = new Vector2(0, 10);
        var result = GetNearestPoint(line, vec);
        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(5);
    });

    it('should project beyond segment endpoints when the point is past the end', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var vec = new Vector2(20, 5);
        var result = GetNearestPoint(line, vec);
        expect(result.x).toBeCloseTo(20);
        expect(result.y).toBeCloseTo(0);
    });

    it('should project behind the start point when the point is before the start', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var vec = new Vector2(-5, 5);
        var result = GetNearestPoint(line, vec);
        expect(result.x).toBeCloseTo(-5);
        expect(result.y).toBeCloseTo(0);
    });

    it('should return the out vector unchanged when the line has zero length', function ()
    {
        var line = { x1: 5, y1: 5, x2: 5, y2: 5 };
        var vec = new Vector2(10, 10);
        var out = new Vector2(99, 99);
        var result = GetNearestPoint(line, vec, out);
        expect(result).toBe(out);
        expect(result.x).toBe(99);
        expect(result.y).toBe(99);
    });

    it('should return the exact point when the vec lies on the line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var vec = new Vector2(7, 0);
        var result = GetNearestPoint(line, vec);
        expect(result.x).toBeCloseTo(7);
        expect(result.y).toBeCloseTo(0);
    });

    it('should handle negative line coordinates', function ()
    {
        var line = { x1: -10, y1: 0, x2: 10, y2: 0 };
        var vec = new Vector2(0, 5);
        var result = GetNearestPoint(line, vec);
        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(0);
    });

    it('should handle floating point line and point coordinates', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 0 };
        var vec = new Vector2(0.5, 0.5);
        var result = GetNearestPoint(line, vec);
        expect(result.x).toBeCloseTo(0.5);
        expect(result.y).toBeCloseTo(0);
    });

    it('should work when the vec is at the start of the line', function ()
    {
        var line = { x1: 2, y1: 3, x2: 8, y2: 3 };
        var vec = new Vector2(2, 3);
        var result = GetNearestPoint(line, vec);
        expect(result.x).toBeCloseTo(2);
        expect(result.y).toBeCloseTo(3);
    });

    it('should work when the vec is at the end of the line', function ()
    {
        var line = { x1: 2, y1: 3, x2: 8, y2: 3 };
        var vec = new Vector2(8, 3);
        var result = GetNearestPoint(line, vec);
        expect(result.x).toBeCloseTo(8);
        expect(result.y).toBeCloseTo(3);
    });

    it('should return correct nearest point on an angled line with an offset point', function ()
    {
        var line = { x1: 0, y1: 0, x2: 4, y2: 4 };
        var vec = new Vector2(4, 0);
        var result = GetNearestPoint(line, vec);
        expect(result.x).toBeCloseTo(2);
        expect(result.y).toBeCloseTo(2);
    });
});
