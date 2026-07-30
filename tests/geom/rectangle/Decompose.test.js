var Decompose = require('../../../src/geom/rectangle/Decompose');

describe('Phaser.Geom.Rectangle.Decompose', function ()
{
    var rect;

    beforeEach(function ()
    {
        rect = { x: 10, y: 20, right: 110, bottom: 120 };
    });

    it('should return an array', function ()
    {
        var result = Decompose(rect);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return exactly four points', function ()
    {
        var result = Decompose(rect);

        expect(result.length).toBe(4);
    });

    it('should return the top-left point as the first element', function ()
    {
        var result = Decompose(rect);

        expect(result[0].x).toBe(10);
        expect(result[0].y).toBe(20);
    });

    it('should return the top-right point as the second element', function ()
    {
        var result = Decompose(rect);

        expect(result[1].x).toBe(110);
        expect(result[1].y).toBe(20);
    });

    it('should return the bottom-right point as the third element', function ()
    {
        var result = Decompose(rect);

        expect(result[2].x).toBe(110);
        expect(result[2].y).toBe(120);
    });

    it('should return the bottom-left point as the fourth element', function ()
    {
        var result = Decompose(rect);

        expect(result[3].x).toBe(10);
        expect(result[3].y).toBe(120);
    });

    it('should create a new array when no output array is provided', function ()
    {
        var result = Decompose(rect);

        expect(result).toBeDefined();
        expect(result.length).toBe(4);
    });

    it('should push points to the provided output array', function ()
    {
        var out = [];
        var result = Decompose(rect, out);

        expect(result).toBe(out);
        expect(out.length).toBe(4);
    });

    it('should append points to an existing output array', function ()
    {
        var out = [{ x: 0, y: 0 }];
        var result = Decompose(rect, out);

        expect(result.length).toBe(5);
        expect(result[0].x).toBe(0);
        expect(result[1].x).toBe(10);
    });

    it('should return the same array reference passed as out', function ()
    {
        var out = [];
        var result = Decompose(rect, out);

        expect(result).toBe(out);
    });

    it('should work with a zero-sized rectangle', function ()
    {
        var zeroRect = { x: 0, y: 0, right: 0, bottom: 0 };
        var result = Decompose(zeroRect);

        expect(result.length).toBe(4);
        expect(result[0].x).toBe(0);
        expect(result[0].y).toBe(0);
        expect(result[1].x).toBe(0);
        expect(result[1].y).toBe(0);
        expect(result[2].x).toBe(0);
        expect(result[2].y).toBe(0);
        expect(result[3].x).toBe(0);
        expect(result[3].y).toBe(0);
    });

    it('should work with negative coordinates', function ()
    {
        var negRect = { x: -50, y: -40, right: -10, bottom: -5 };
        var result = Decompose(negRect);

        expect(result[0].x).toBe(-50);
        expect(result[0].y).toBe(-40);
        expect(result[1].x).toBe(-10);
        expect(result[1].y).toBe(-40);
        expect(result[2].x).toBe(-10);
        expect(result[2].y).toBe(-5);
        expect(result[3].x).toBe(-50);
        expect(result[3].y).toBe(-5);
    });

    it('should work with floating point values', function ()
    {
        var floatRect = { x: 1.5, y: 2.5, right: 10.5, bottom: 20.5 };
        var result = Decompose(floatRect);

        expect(result[0].x).toBeCloseTo(1.5);
        expect(result[0].y).toBeCloseTo(2.5);
        expect(result[1].x).toBeCloseTo(10.5);
        expect(result[2].y).toBeCloseTo(20.5);
    });

    it('should return plain objects with x and y properties', function ()
    {
        var result = Decompose(rect);

        result.forEach(function (point)
        {
            expect(typeof point).toBe('object');
            expect(point).toHaveProperty('x');
            expect(point).toHaveProperty('y');
        });
    });
});
