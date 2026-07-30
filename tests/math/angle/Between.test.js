var Between = require('../../../src/math/angle/Between');

describe('Phaser.Math.Angle.Between', function ()
{
    it('should return zero when both points are the same', function ()
    {
        expect(Between(0, 0, 0, 0)).toBe(0);
        expect(Between(5, 5, 5, 5)).toBe(0);
    });

    it('should return zero when pointing right along x-axis', function ()
    {
        expect(Between(0, 0, 1, 0)).toBe(0);
        expect(Between(0, 0, 100, 0)).toBe(0);
    });

    it('should return PI/2 when pointing down along y-axis', function ()
    {
        expect(Between(0, 0, 0, 1)).toBeCloseTo(Math.PI / 2);
    });

    it('should return -PI/2 when pointing up along y-axis', function ()
    {
        expect(Between(0, 0, 0, -1)).toBeCloseTo(-Math.PI / 2);
    });

    it('should return PI when pointing left along x-axis', function ()
    {
        expect(Between(0, 0, -1, 0)).toBeCloseTo(Math.PI);
    });

    it('should return PI/4 when pointing diagonally down-right', function ()
    {
        expect(Between(0, 0, 1, 1)).toBeCloseTo(Math.PI / 4);
    });

    it('should return -PI/4 when pointing diagonally up-right', function ()
    {
        expect(Between(0, 0, 1, -1)).toBeCloseTo(-Math.PI / 4);
    });

    it('should return 3*PI/4 when pointing diagonally down-left', function ()
    {
        expect(Between(0, 0, -1, 1)).toBeCloseTo(3 * Math.PI / 4);
    });

    it('should return -3*PI/4 when pointing diagonally up-left', function ()
    {
        expect(Between(0, 0, -1, -1)).toBeCloseTo(-3 * Math.PI / 4);
    });

    it('should work with non-origin start points', function ()
    {
        expect(Between(5, 5, 10, 5)).toBeCloseTo(0);
        expect(Between(5, 5, 5, 10)).toBeCloseTo(Math.PI / 2);
        expect(Between(5, 5, 0, 5)).toBeCloseTo(Math.PI);
    });

    it('should work with negative coordinates', function ()
    {
        expect(Between(-10, -10, -5, -10)).toBeCloseTo(0);
        expect(Between(-10, -10, -10, -5)).toBeCloseTo(Math.PI / 2);
    });

    it('should work with floating point coordinates', function ()
    {
        expect(Between(0.5, 0.5, 1.5, 0.5)).toBeCloseTo(0);
        expect(Between(0.5, 0.5, 0.5, 1.5)).toBeCloseTo(Math.PI / 2);
    });

    it('should return a value in the range -PI to PI', function ()
    {
        var points = [
            [0, 0, 1, 0],
            [0, 0, -1, 0],
            [0, 0, 0, 1],
            [0, 0, 0, -1],
            [0, 0, 1, 1],
            [0, 0, -1, -1],
            [3, 4, 7, 2],
            [-5, 8, 2, -3]
        ];

        for (var i = 0; i < points.length; i++)
        {
            var p = points[i];
            var angle = Between(p[0], p[1], p[2], p[3]);
            expect(angle).toBeGreaterThanOrEqual(-Math.PI);
            expect(angle).toBeLessThanOrEqual(Math.PI);
        }
    });

    it('should return a number', function ()
    {
        expect(typeof Between(0, 0, 1, 1)).toBe('number');
    });
});
