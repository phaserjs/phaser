var ToXY = require('../../src/math/ToXY');
var Vector2 = require('../../src/math/Vector2');

describe('Phaser.Math.ToXY', function ()
{
    it('should return x:4 y:2 for index 16 in a 6x4 grid (documented example)', function ()
    {
        var result = ToXY(16, 6, 4);

        expect(result.x).toBe(4);
        expect(result.y).toBe(2);
    });

    it('should return x:0 y:0 for index 0 (out of range)', function ()
    {
        var result = ToXY(0, 6, 4);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should return x:0 y:0 for a negative index', function ()
    {
        var result = ToXY(-1, 6, 4);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should return x:0 y:0 when index exceeds total cells', function ()
    {
        var result = ToXY(25, 6, 4);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should return x:0 y:0 when index equals total cells plus one', function ()
    {
        var result = ToXY(26, 5, 5);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should return x:index y:0 when index is in the first row', function ()
    {
        var result = ToXY(3, 6, 4);

        expect(result.x).toBe(3);
        expect(result.y).toBe(0);
    });

    it('should return x:1 y:0 for index 1 (first cell after origin)', function ()
    {
        var result = ToXY(1, 6, 4);

        expect(result.x).toBe(1);
        expect(result.y).toBe(0);
    });

    it('should return x:5 y:0 for the last cell in the first row of a 6x4 grid', function ()
    {
        var result = ToXY(5, 6, 4);

        expect(result.x).toBe(5);
        expect(result.y).toBe(0);
    });

    it('should return x:0 y:1 for the first cell in the second row of a 6x4 grid', function ()
    {
        var result = ToXY(6, 6, 4);

        expect(result.x).toBe(0);
        expect(result.y).toBe(1);
    });

    it('should return correct position for the last valid index in a grid', function ()
    {
        var result = ToXY(24, 6, 4);

        expect(result.x).toBe(0);
        expect(result.y).toBe(4);
    });

    it('should return correct position for index equal to total (last cell)', function ()
    {
        var result = ToXY(24, 6, 4);

        expect(result.x).toBe(0);
        expect(result.y).toBe(4);
    });

    it('should use the provided out Vector2 if given', function ()
    {
        var out = new Vector2();
        var result = ToXY(16, 6, 4, out);

        expect(result).toBe(out);
        expect(out.x).toBe(4);
        expect(out.y).toBe(2);
    });

    it('should create a new Vector2 if no out parameter is provided', function ()
    {
        var result = ToXY(16, 6, 4);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return a Vector2 instance for out-of-range index', function ()
    {
        var result = ToXY(0, 6, 4);

        expect(result).toBeInstanceOf(Vector2);
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should work correctly with a 1x1 grid', function ()
    {
        var result = ToXY(1, 1, 1);

        expect(result.x).toBe(0);
        expect(result.y).toBe(1);
    });

    it('should work correctly with a single-row grid', function ()
    {
        var result = ToXY(3, 10, 1);

        expect(result.x).toBe(3);
        expect(result.y).toBe(0);
    });

    it('should work correctly with a single-column grid', function ()
    {
        var result = ToXY(3, 1, 10);

        expect(result.x).toBe(0);
        expect(result.y).toBe(3);
    });

    it('should return correct position for a square grid', function ()
    {
        var result = ToXY(7, 5, 5);

        expect(result.x).toBe(2);
        expect(result.y).toBe(1);
    });

    it('should return x:0 y:0 when index equals total + 1', function ()
    {
        var result = ToXY(21, 5, 4);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should set out vector to x:0 y:0 for out-of-range index when out is provided', function ()
    {
        var out = new Vector2(99, 99);
        var result = ToXY(0, 6, 4, out);

        expect(result).toBe(out);
        expect(out.x).toBe(0);
        expect(out.y).toBe(0);
    });
});
