var Random = require('../../../src/geom/triangle/Random');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Triangle.Random', function ()
{
    var triangle;

    beforeEach(function ()
    {
        //  A simple right triangle with vertices at (0,0), (100,0), (0,100)
        triangle = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 0, y3: 100 };
    });

    it('should return a Vector2 instance when no out parameter is provided', function ()
    {
        var result = Random(triangle);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return the out object when one is provided', function ()
    {
        var out = new Vector2();
        var result = Random(triangle, out);

        expect(result).toBe(out);
    });

    it('should return a plain object with x and y when a plain object is used as out', function ()
    {
        var out = { x: 0, y: 0 };
        var result = Random(triangle, out);

        expect(result).toBe(out);
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
    });

    it('should place the result within the bounding box of the triangle over many iterations', function ()
    {
        for (var i = 0; i < 500; i++)
        {
            var point = Random(triangle);

            expect(point.x).toBeGreaterThanOrEqual(0);
            expect(point.y).toBeGreaterThanOrEqual(0);
            expect(point.x).toBeLessThanOrEqual(100);
            expect(point.y).toBeLessThanOrEqual(100);
        }
    });

    it('should place the result inside the right triangle (x + y <= hypotenuse) over many iterations', function ()
    {
        //  For a right triangle with legs of 100, any point inside satisfies x + y <= 100
        for (var i = 0; i < 500; i++)
        {
            var point = Random(triangle);

            expect(point.x + point.y).toBeLessThanOrEqual(100 + 1e-9);
        }
    });

    it('should use the triangle origin as a base and offset correctly', function ()
    {
        //  Degenerate triangle collapsed to a single point
        var degenerate = { x1: 50, y1: 75, x2: 50, y2: 75, x3: 50, y3: 75 };
        var point = Random(degenerate);

        expect(point.x).toBeCloseTo(50, 10);
        expect(point.y).toBeCloseTo(75, 10);
    });

    it('should work with a triangle offset from the origin', function ()
    {
        //  Right triangle shifted to (200, 300)
        var shifted = { x1: 200, y1: 300, x2: 300, y2: 300, x3: 200, y3: 400 };

        for (var i = 0; i < 200; i++)
        {
            var point = Random(shifted);

            expect(point.x).toBeGreaterThanOrEqual(200);
            expect(point.y).toBeGreaterThanOrEqual(300);
            expect(point.x).toBeLessThanOrEqual(300);
            expect(point.y).toBeLessThanOrEqual(400);
            //  For this right triangle: (x - 200) + (y - 300) <= 100
            expect((point.x - 200) + (point.y - 300)).toBeLessThanOrEqual(100 + 1e-9);
        }
    });

    it('should work with negative coordinates', function ()
    {
        var neg = { x1: -100, y1: -100, x2: 0, y2: -100, x3: -100, y3: 0 };

        for (var i = 0; i < 200; i++)
        {
            var point = Random(neg);

            expect(point.x).toBeGreaterThanOrEqual(-100);
            expect(point.y).toBeGreaterThanOrEqual(-100);
            expect(point.x).toBeLessThanOrEqual(0);
            expect(point.y).toBeLessThanOrEqual(0);
        }
    });

    it('should work with floating point triangle vertices', function ()
    {
        var floatTri = { x1: 0.5, y1: 0.5, x2: 1.5, y2: 0.5, x3: 0.5, y3: 1.5 };

        for (var i = 0; i < 100; i++)
        {
            var point = Random(floatTri);

            expect(point.x).toBeGreaterThanOrEqual(0.5);
            expect(point.y).toBeGreaterThanOrEqual(0.5);
            expect(point.x).toBeLessThanOrEqual(1.5);
            expect(point.y).toBeLessThanOrEqual(1.5);
        }
    });

    it('should produce varied results over multiple calls (non-constant output)', function ()
    {
        var results = [];

        for (var i = 0; i < 20; i++)
        {
            var point = Random(triangle);
            results.push(point.x + ',' + point.y);
        }

        var unique = results.filter(function (v, i, a) { return a.indexOf(v) === i; });

        expect(unique.length).toBeGreaterThan(1);
    });

    it('should populate the out parameter x and y properties', function ()
    {
        var out = new Vector2(999, 999);
        Random(triangle, out);

        //  The values should have been overwritten
        expect(out.x).not.toBe(999);
        expect(out.y).not.toBe(999);
    });

    it('should handle a horizontal line triangle (zero height)', function ()
    {
        var flat = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 0 };
        var point = Random(flat);

        expect(point.y).toBeCloseTo(0, 10);
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(100);
    });
});
