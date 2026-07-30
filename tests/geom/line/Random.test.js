var Random = require('../../../src/geom/line/Random');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Line.Random', function ()
{
    var line;

    beforeEach(function ()
    {
        line = { x1: 0, y1: 0, x2: 100, y2: 100 };
    });

    it('should return a Vector2 instance when no out parameter is provided', function ()
    {
        var result = Random(line);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return the out object when one is provided', function ()
    {
        var out = new Vector2();
        var result = Random(line, out);

        expect(result).toBe(out);
    });

    it('should return a point on a horizontal line within the correct x range', function ()
    {
        var hLine = { x1: 10, y1: 5, x2: 90, y2: 5 };

        for (var i = 0; i < 100; i++)
        {
            var result = Random(hLine);

            expect(result.x).toBeGreaterThanOrEqual(10);
            expect(result.x).toBeLessThanOrEqual(90);
            expect(result.y).toBeCloseTo(5);
        }
    });

    it('should return a point on a vertical line within the correct y range', function ()
    {
        var vLine = { x1: 5, y1: 10, x2: 5, y2: 90 };

        for (var i = 0; i < 100; i++)
        {
            var result = Random(vLine);

            expect(result.x).toBeCloseTo(5);
            expect(result.y).toBeGreaterThanOrEqual(10);
            expect(result.y).toBeLessThanOrEqual(90);
        }
    });

    it('should return a point whose coordinates are within the line endpoints', function ()
    {
        for (var i = 0; i < 100; i++)
        {
            var result = Random(line);

            expect(result.x).toBeGreaterThanOrEqual(0);
            expect(result.x).toBeLessThanOrEqual(100);
            expect(result.y).toBeGreaterThanOrEqual(0);
            expect(result.y).toBeLessThanOrEqual(100);
        }
    });

    it('should return the endpoint when the line has zero length', function ()
    {
        var zeroLine = { x1: 42, y1: 17, x2: 42, y2: 17 };
        var result = Random(zeroLine);

        expect(result.x).toBeCloseTo(42);
        expect(result.y).toBeCloseTo(17);
    });

    it('should work with negative coordinates', function ()
    {
        var negLine = { x1: -100, y1: -100, x2: -10, y2: -10 };

        for (var i = 0; i < 50; i++)
        {
            var result = Random(negLine);

            expect(result.x).toBeGreaterThanOrEqual(-100);
            expect(result.x).toBeLessThanOrEqual(-10);
            expect(result.y).toBeGreaterThanOrEqual(-100);
            expect(result.y).toBeLessThanOrEqual(-10);
        }
    });

    it('should work with a line that crosses axis boundaries', function ()
    {
        var crossLine = { x1: -50, y1: -50, x2: 50, y2: 50 };

        for (var i = 0; i < 50; i++)
        {
            var result = Random(crossLine);

            expect(result.x).toBeGreaterThanOrEqual(-50);
            expect(result.x).toBeLessThanOrEqual(50);
            expect(result.y).toBeGreaterThanOrEqual(-50);
            expect(result.y).toBeLessThanOrEqual(50);
        }
    });

    it('should modify the provided out object x and y properties', function ()
    {
        var out = { x: 999, y: 999 };
        Random(line, out);

        expect(out.x).not.toBe(999);
        expect(out.y).not.toBe(999);
    });

    it('should produce varied results over multiple calls', function ()
    {
        var wideLine = { x1: 0, y1: 0, x2: 10000, y2: 10000 };
        var results = [];

        for (var i = 0; i < 10; i++)
        {
            results.push(Random(wideLine).x);
        }

        var allSame = results.every(function (v) { return v === results[0]; });

        expect(allSame).toBe(false);
    });

    it('should keep x and y proportional (point lies on the line)', function ()
    {
        var diagLine = { x1: 0, y1: 0, x2: 100, y2: 50 };

        for (var i = 0; i < 50; i++)
        {
            var result = Random(diagLine);

            expect(result.y).toBeCloseTo(result.x * 0.5);
        }
    });

    it('should work with floating point line endpoints', function ()
    {
        var floatLine = { x1: 0.5, y1: 1.5, x2: 10.5, y2: 5.5 };

        for (var i = 0; i < 50; i++)
        {
            var result = Random(floatLine);

            expect(result.x).toBeGreaterThanOrEqual(0.5);
            expect(result.x).toBeLessThanOrEqual(10.5);
            expect(result.y).toBeGreaterThanOrEqual(1.5);
            expect(result.y).toBeLessThanOrEqual(5.5);
        }
    });
});
