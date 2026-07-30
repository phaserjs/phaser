var Decompose = require('../../../src/geom/triangle/Decompose');

describe('Phaser.Geom.Triangle.Decompose', function ()
{
    it('should return an array', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 1, y2: 0, x3: 0, y3: 1 };
        var result = Decompose(triangle);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return an array with three elements', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 1, y2: 0, x3: 0, y3: 1 };
        var result = Decompose(triangle);

        expect(result.length).toBe(3);
    });

    it('should return the correct x and y values for each point', function ()
    {
        var triangle = { x1: 10, y1: 20, x2: 30, y2: 40, x3: 50, y3: 60 };
        var result = Decompose(triangle);

        expect(result[0].x).toBe(10);
        expect(result[0].y).toBe(20);
        expect(result[1].x).toBe(30);
        expect(result[1].y).toBe(40);
        expect(result[2].x).toBe(50);
        expect(result[2].y).toBe(60);
    });

    it('should create a new array if no out array is provided', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 1, y2: 0, x3: 0, y3: 1 };
        var result = Decompose(triangle);

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });

    it('should append to the provided out array', function ()
    {
        var triangle = { x1: 1, y1: 2, x2: 3, y2: 4, x3: 5, y3: 6 };
        var out = [];
        var result = Decompose(triangle, out);

        expect(result).toBe(out);
        expect(out.length).toBe(3);
    });

    it('should append points to an existing out array without clearing it', function ()
    {
        var triangle = { x1: 1, y1: 2, x2: 3, y2: 4, x3: 5, y3: 6 };
        var out = [{ x: 99, y: 99 }];
        Decompose(triangle, out);

        expect(out.length).toBe(4);
        expect(out[0].x).toBe(99);
        expect(out[0].y).toBe(99);
    });

    it('should return the same out array reference', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 1, y2: 0, x3: 0, y3: 1 };
        var out = [];
        var result = Decompose(triangle, out);

        expect(result).toBe(out);
    });

    it('should handle negative coordinate values', function ()
    {
        var triangle = { x1: -10, y1: -20, x2: -30, y2: -40, x3: -50, y3: -60 };
        var result = Decompose(triangle);

        expect(result[0].x).toBe(-10);
        expect(result[0].y).toBe(-20);
        expect(result[1].x).toBe(-30);
        expect(result[1].y).toBe(-40);
        expect(result[2].x).toBe(-50);
        expect(result[2].y).toBe(-60);
    });

    it('should handle floating point coordinate values', function ()
    {
        var triangle = { x1: 1.5, y1: 2.5, x2: 3.7, y2: 4.2, x3: 5.1, y3: 6.9 };
        var result = Decompose(triangle);

        expect(result[0].x).toBeCloseTo(1.5);
        expect(result[0].y).toBeCloseTo(2.5);
        expect(result[1].x).toBeCloseTo(3.7);
        expect(result[1].y).toBeCloseTo(4.2);
        expect(result[2].x).toBeCloseTo(5.1);
        expect(result[2].y).toBeCloseTo(6.9);
    });

    it('should handle a degenerate triangle where all points are the same', function ()
    {
        var triangle = { x1: 5, y1: 5, x2: 5, y2: 5, x3: 5, y3: 5 };
        var result = Decompose(triangle);

        expect(result.length).toBe(3);
        expect(result[0].x).toBe(5);
        expect(result[0].y).toBe(5);
        expect(result[1].x).toBe(5);
        expect(result[1].y).toBe(5);
        expect(result[2].x).toBe(5);
        expect(result[2].y).toBe(5);
    });

    it('should handle zero coordinate values', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };
        var result = Decompose(triangle);

        expect(result[0].x).toBe(0);
        expect(result[0].y).toBe(0);
        expect(result[1].x).toBe(0);
        expect(result[1].y).toBe(0);
        expect(result[2].x).toBe(0);
        expect(result[2].y).toBe(0);
    });

    it('should produce point objects with only x and y properties from the triangle vertices', function ()
    {
        var triangle = { x1: 7, y1: 8, x2: 9, y2: 10, x3: 11, y3: 12 };
        var result = Decompose(triangle);

        expect(result[0]).toEqual({ x: 7, y: 8 });
        expect(result[1]).toEqual({ x: 9, y: 10 });
        expect(result[2]).toEqual({ x: 11, y: 12 });
    });
});
