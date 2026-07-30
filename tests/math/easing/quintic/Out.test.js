var Out = require('../../../../src/math/easing/quintic/Out');

describe('Phaser.Math.Easing.Quintic.Out', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(Out(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(Out(1)).toBe(1);
    });

    it('should return 0.96875 when v is 0.5', function ()
    {
        expect(Out(0.5)).toBeCloseTo(0.96875, 10);
    });

    it('should return correct value when v is 0.25', function ()
    {
        // (0.25 - 1)^5 + 1 = (-0.75)^5 + 1 = -0.2373046875 + 1
        expect(Out(0.25)).toBeCloseTo(0.7626953125, 10);
    });

    it('should return correct value when v is 0.75', function ()
    {
        // (0.75 - 1)^5 + 1 = (-0.25)^5 + 1 = -0.0009765625 + 1
        expect(Out(0.75)).toBeCloseTo(0.9990234375, 10);
    });

    it('should return correct value when v is 0.1', function ()
    {
        // (0.1 - 1)^5 + 1 = (-0.9)^5 + 1 = -0.59049 + 1
        expect(Out(0.1)).toBeCloseTo(0.40951, 5);
    });

    it('should return correct value when v is 0.9', function ()
    {
        // (0.9 - 1)^5 + 1 = (-0.1)^5 + 1 = -0.00001 + 1
        expect(Out(0.9)).toBeCloseTo(0.99999, 5);
    });

    it('should be greater than 0.5 for v values in the mid range', function ()
    {
        expect(Out(0.5)).toBeGreaterThan(0.5);
        expect(Out(0.6)).toBeGreaterThan(0.5);
        expect(Out(0.4)).toBeGreaterThan(0.5);
    });

    it('should produce values between 0 and 1 for v in [0, 1]', function ()
    {
        var steps = 20;
        for (var i = 0; i <= steps; i++)
        {
            var v = i / steps;
            var result = Out(v);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should be monotonically increasing for v in [0, 1]', function ()
    {
        var steps = 100;
        var prev = Out(0);
        for (var i = 1; i <= steps; i++)
        {
            var v = i / steps;
            var result = Out(v);
            expect(result).toBeGreaterThanOrEqual(prev);
            prev = result;
        }
    });

    it('should handle values outside the normal [0, 1] range', function ()
    {
        // v = 2: (2-1)^5 + 1 = 1 + 1 = 2
        expect(Out(2)).toBeCloseTo(2, 10);
        // v = -1: (-1-1)^5 + 1 = -32 + 1 = -31
        expect(Out(-1)).toBeCloseTo(-31, 10);
    });

    it('should return a number', function ()
    {
        expect(typeof Out(0.5)).toBe('number');
        expect(typeof Out(0)).toBe('number');
        expect(typeof Out(1)).toBe('number');
    });
});
