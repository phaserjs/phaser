var LinearXY = require('../../src/math/LinearXY');
var Vector2 = require('../../src/math/Vector2');

describe('Phaser.Math.LinearXY', function ()
{
    it('should return a new Vector2 at the start when t is 0', function ()
    {
        var v1 = new Vector2(0, 0);
        var v2 = new Vector2(10, 20);
        var result = LinearXY(v1, v2, 0);

        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(0);
    });

    it('should return a new Vector2 at the end when t is 1', function ()
    {
        var v1 = new Vector2(0, 0);
        var v2 = new Vector2(10, 20);
        var result = LinearXY(v1, v2, 1);

        expect(result.x).toBeCloseTo(10);
        expect(result.y).toBeCloseTo(20);
    });

    it('should return the midpoint when t is 0.5', function ()
    {
        var v1 = new Vector2(0, 0);
        var v2 = new Vector2(10, 20);
        var result = LinearXY(v1, v2, 0.5);

        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(10);
    });

    it('should default t to 0 when not provided', function ()
    {
        var v1 = new Vector2(5, 10);
        var v2 = new Vector2(100, 200);
        var result = LinearXY(v1, v2);

        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(10);
    });

    it('should not modify the input vectors', function ()
    {
        var v1 = new Vector2(1, 2);
        var v2 = new Vector2(9, 18);
        LinearXY(v1, v2, 0.5);

        expect(v1.x).toBe(1);
        expect(v1.y).toBe(2);
        expect(v2.x).toBe(9);
        expect(v2.y).toBe(18);
    });

    it('should return a new Vector2 instance, not the original', function ()
    {
        var v1 = new Vector2(0, 0);
        var v2 = new Vector2(10, 20);
        var result = LinearXY(v1, v2, 0.5);

        expect(result).not.toBe(v1);
        expect(result).not.toBe(v2);
    });

    it('should interpolate with negative coordinates', function ()
    {
        var v1 = new Vector2(-10, -20);
        var v2 = new Vector2(10, 20);
        var result = LinearXY(v1, v2, 0.5);

        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(0);
    });

    it('should interpolate from negative to positive at t=0.25', function ()
    {
        var v1 = new Vector2(-8, -4);
        var v2 = new Vector2(8, 4);
        var result = LinearXY(v1, v2, 0.25);

        expect(result.x).toBeCloseTo(-4);
        expect(result.y).toBeCloseTo(-2);
    });

    it('should return start vector values when both vectors are equal', function ()
    {
        var v1 = new Vector2(5, 7);
        var v2 = new Vector2(5, 7);
        var result = LinearXY(v1, v2, 0.5);

        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(7);
    });

    it('should handle floating point input values', function ()
    {
        var v1 = new Vector2(0.1, 0.2);
        var v2 = new Vector2(0.9, 0.8);
        var result = LinearXY(v1, v2, 0.5);

        expect(result.x).toBeCloseTo(0.5);
        expect(result.y).toBeCloseTo(0.5);
    });

    it('should handle t=0 with non-zero start vector', function ()
    {
        var v1 = new Vector2(3, 7);
        var v2 = new Vector2(30, 70);
        var result = LinearXY(v1, v2, 0);

        expect(result.x).toBeCloseTo(3);
        expect(result.y).toBeCloseTo(7);
    });

    it('should interpolate at t=0.75', function ()
    {
        var v1 = new Vector2(0, 0);
        var v2 = new Vector2(100, 200);
        var result = LinearXY(v1, v2, 0.75);

        expect(result.x).toBeCloseTo(75);
        expect(result.y).toBeCloseTo(150);
    });
});
