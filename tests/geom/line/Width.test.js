var Width = require('../../../src/geom/line/Width');

describe('Phaser.Geom.Line.Width', function ()
{
    it('should return zero when x1 and x2 are equal', function ()
    {
        var line = { x1: 5, y1: 0, x2: 5, y2: 10 };
        expect(Width(line)).toBe(0);
    });

    it('should return the difference when x2 is greater than x1', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        expect(Width(line)).toBe(10);
    });

    it('should return the absolute difference when x1 is greater than x2', function ()
    {
        var line = { x1: 10, y1: 0, x2: 0, y2: 0 };
        expect(Width(line)).toBe(10);
    });

    it('should return the absolute difference for negative x values', function ()
    {
        var line = { x1: -10, y1: 0, x2: -5, y2: 0 };
        expect(Width(line)).toBe(5);
    });

    it('should return the correct width when x values span negative to positive', function ()
    {
        var line = { x1: -5, y1: 0, x2: 5, y2: 0 };
        expect(Width(line)).toBe(10);
    });

    it('should ignore y coordinates entirely', function ()
    {
        var line = { x1: 3, y1: 100, x2: 8, y2: 200 };
        expect(Width(line)).toBe(5);
    });

    it('should return zero when both x1 and x2 are zero', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 0 };
        expect(Width(line)).toBe(0);
    });

    it('should work with floating point x values', function ()
    {
        var line = { x1: 1.5, y1: 0, x2: 4.5, y2: 0 };
        expect(Width(line)).toBeCloseTo(3.0);
    });

    it('should work with large x values', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1000000, y2: 0 };
        expect(Width(line)).toBe(1000000);
    });

    it('should return a non-negative number regardless of point order', function ()
    {
        var line1 = { x1: 10, y1: 0, x2: 3, y2: 0 };
        var line2 = { x1: 3, y1: 0, x2: 10, y2: 0 };
        expect(Width(line1)).toBe(Width(line2));
        expect(Width(line1)).toBeGreaterThanOrEqual(0);
    });
});
