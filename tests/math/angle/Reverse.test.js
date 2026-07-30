var Reverse = require('../../../src/math/angle/Reverse');

describe('Phaser.Math.Angle.Reverse', function ()
{
    it('should reverse zero to π', function ()
    {
        expect(Reverse(0)).toBeCloseTo(Math.PI, 10);
    });

    it('should reverse π to 0 (normalized)', function ()
    {
        expect(Reverse(Math.PI)).toBeCloseTo(0, 10);
    });

    it('should reverse π/2 to 3π/2', function ()
    {
        expect(Reverse(Math.PI / 2)).toBeCloseTo(3 * Math.PI / 2, 10);
    });

    it('should reverse 3π/2 to π/2', function ()
    {
        expect(Reverse(3 * Math.PI / 2)).toBeCloseTo(Math.PI / 2, 10);
    });

    it('should reverse π/4 to 5π/4', function ()
    {
        expect(Reverse(Math.PI / 4)).toBeCloseTo(5 * Math.PI / 4, 10);
    });

    it('should return a value in the range [0, 2π)', function ()
    {
        var angles = [ 0, 0.5, 1, Math.PI / 4, Math.PI / 2, Math.PI, 3 * Math.PI / 2, 2 * Math.PI - 0.001 ];

        for (var i = 0; i < angles.length; i++)
        {
            var result = Reverse(angles[i]);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(2 * Math.PI);
        }
    });

    it('should handle negative angles by normalizing the result', function ()
    {
        var result = Reverse(-Math.PI);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(2 * Math.PI);
        expect(result).toBeCloseTo(0, 10);
    });

    it('should handle angles greater than 2π', function ()
    {
        var result = Reverse(3 * Math.PI);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(2 * Math.PI);
        expect(result).toBeCloseTo(0, 10);
    });

    it('should handle negative angle -π/2 reversing to π/2', function ()
    {
        var result = Reverse(-Math.PI / 2);
        expect(result).toBeCloseTo(Math.PI / 2, 10);
    });

    it('should return a number', function ()
    {
        expect(typeof Reverse(0)).toBe('number');
        expect(typeof Reverse(Math.PI)).toBe('number');
    });

    it('should produce the opposite direction when reversed twice (back to original, normalized)', function ()
    {
        var angle = Math.PI / 3;
        var normalized = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        var doubleReversed = Reverse(Reverse(angle));
        expect(doubleReversed).toBeCloseTo(normalized, 10);
    });
});
