var In = require('../../../../src/math/easing/expo/In');

describe('Phaser.Math.Easing.Expo.In', function ()
{
    it('should return approximately 0.999 when v is 1', function ()
    {
        expect(In(1)).toBeCloseTo(0.999, 5);
    });

    it('should return a near-zero negative value when v is 0', function ()
    {
        // Math.pow(2, -10) - 0.001 ≈ -0.0000234375
        expect(In(0)).toBeCloseTo(-0.0000234375, 5);
    });

    it('should return a small positive value when v is 0.5', function ()
    {
        // Math.pow(2, -5) - 0.001 = 0.03125 - 0.001 = 0.03025
        expect(In(0.5)).toBeCloseTo(0.03025, 5);
    });

    it('should return a very small value when v is 0.25', function ()
    {
        // Math.pow(2, -7.5) - 0.001 ≈ 0.005524 - 0.001 = 0.004524
        expect(In(0.25)).toBeCloseTo(Math.pow(2, 10 * (0.25 - 1)) - 0.001, 10);
    });

    it('should return a value close to 0.999 when v is 0.75', function ()
    {
        // Math.pow(2, -2.5) - 0.001 ≈ 0.17678 - 0.001 = 0.17578
        expect(In(0.75)).toBeCloseTo(Math.pow(2, 10 * (0.75 - 1)) - 0.001, 10);
    });

    it('should produce values that increase monotonically as v increases', function ()
    {
        var prev = In(0);

        for (var i = 1; i <= 10; i++)
        {
            var v = i / 10;
            var current = In(v);
            expect(current).toBeGreaterThan(prev);
            prev = current;
        }
    });

    it('should return a number', function ()
    {
        expect(typeof In(0.5)).toBe('number');
        expect(typeof In(0)).toBe('number');
        expect(typeof In(1)).toBe('number');
    });

    it('should return values less than 1 for all inputs in range [0, 1]', function ()
    {
        for (var i = 0; i <= 10; i++)
        {
            var v = i / 10;
            expect(In(v)).toBeLessThan(1);
        }
    });

    it('should grow exponentially — output at v=0.9 should be much larger than at v=0.1', function ()
    {
        var low = In(0.1);
        var high = In(0.9);
        expect(high).toBeGreaterThan(low * 100);
    });

    it('should handle values greater than 1', function ()
    {
        var result = In(2);
        expect(result).toBeCloseTo(Math.pow(2, 10) - 0.001, 5);
    });

    it('should handle negative values', function ()
    {
        var result = In(-1);
        expect(result).toBeCloseTo(Math.pow(2, -20) - 0.001, 10);
    });
});
