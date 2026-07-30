var Height = require('../../../src/geom/line/Height');

describe('Phaser.Geom.Line.Height', function ()
{
    it('should return zero when y1 and y2 are equal', function ()
    {
        var line = { x1: 0, y1: 5, x2: 10, y2: 5 };
        expect(Height(line)).toBe(0);
    });

    it('should return the absolute difference when y2 is greater than y1', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 10 };
        expect(Height(line)).toBe(10);
    });

    it('should return the absolute difference when y1 is greater than y2', function ()
    {
        var line = { x1: 0, y1: 10, x2: 0, y2: 0 };
        expect(Height(line)).toBe(10);
    });

    it('should return a positive value for negative y coordinates', function ()
    {
        var line = { x1: 0, y1: -10, x2: 0, y2: -3 };
        expect(Height(line)).toBe(7);
    });

    it('should return correct height when y values span negative to positive', function ()
    {
        var line = { x1: 0, y1: -5, x2: 0, y2: 5 };
        expect(Height(line)).toBe(10);
    });

    it('should work with floating point y values', function ()
    {
        var line = { x1: 0, y1: 1.5, x2: 0, y2: 4.75 };
        expect(Height(line)).toBeCloseTo(3.25);
    });

    it('should ignore x values entirely', function ()
    {
        var line = { x1: 100, y1: 3, x2: 200, y2: 8 };
        expect(Height(line)).toBe(5);
    });

    it('should return zero for a point-like line at origin', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 0 };
        expect(Height(line)).toBe(0);
    });

    it('should handle large y values', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 1000000 };
        expect(Height(line)).toBe(1000000);
    });
});
