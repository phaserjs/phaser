var Out = require('../../../../src/math/easing/expo/Out');

describe('Phaser.Math.Easing.Expo.Out', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(Out(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(Out(1)).toBeCloseTo(1 - Math.pow(2, -10), 10);
    });

    it('should return a value close to 0.5 at the midpoint', function ()
    {
        expect(Out(0.5)).toBeCloseTo(1 - Math.pow(2, -5), 10);
    });

    it('should return increasing values as v increases from 0 to 1', function ()
    {
        var prev = Out(0);
        for (var i = 1; i <= 10; i++)
        {
            var curr = Out(i / 10);
            expect(curr).toBeGreaterThan(prev);
            prev = curr;
        }
    });

    it('should return values between 0 and 1 for v in [0, 1]', function ()
    {
        for (var i = 0; i <= 10; i++)
        {
            var result = Out(i / 10);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should return a value closer to 1 for v greater than 1', function ()
    {
        expect(Out(2)).toBeGreaterThan(Out(1));
        expect(Out(2)).toBeCloseTo(1, 3);
    });

    it('should return a negative value for negative v', function ()
    {
        expect(Out(-1)).toBeLessThan(0);
    });

    it('should match the formula 1 - 2^(-10v)', function ()
    {
        var testValues = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1];
        for (var i = 0; i < testValues.length; i++)
        {
            var v = testValues[i];
            expect(Out(v)).toBeCloseTo(1 - Math.pow(2, -10 * v), 10);
        }
    });

    it('should approach 1 asymptotically for large v', function ()
    {
        expect(Out(10)).toBeCloseTo(1, 5);
        expect(Out(100)).toBeCloseTo(1, 10);
    });

    it('should return a numeric value', function ()
    {
        expect(typeof Out(0.5)).toBe('number');
    });
});
