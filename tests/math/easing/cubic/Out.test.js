var Out = require('../../../../src/math/easing/cubic/Out');

describe('Phaser.Math.Easing.Cubic.Out', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(Out(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(Out(1)).toBe(1);
    });

    it('should return 0.875 when v is 0.5', function ()
    {
        expect(Out(0.5)).toBeCloseTo(0.875);
    });

    it('should return 0.578125 when v is 0.25', function ()
    {
        expect(Out(0.25)).toBeCloseTo(0.578125);
    });

    it('should return 0.984375 when v is 0.75', function ()
    {
        expect(Out(0.75)).toBeCloseTo(0.984375);
    });

    it('should produce values greater than 0.5 for inputs greater than 0.5', function ()
    {
        expect(Out(0.6)).toBeGreaterThan(0.5);
        expect(Out(0.7)).toBeGreaterThan(0.5);
        expect(Out(0.8)).toBeGreaterThan(0.5);
    });

    it('should produce values greater than the linear equivalent (ease-out starts fast)', function ()
    {
        expect(Out(0.3)).toBeGreaterThan(0.3);
        expect(Out(0.4)).toBeGreaterThan(0.4);
        expect(Out(0.5)).toBeGreaterThan(0.5);
    });

    it('should be monotonically increasing across the range 0 to 1', function ()
    {
        var prev = Out(0);
        var steps = 10;

        for (var i = 1; i <= steps; i++)
        {
            var current = Out(i / steps);
            expect(current).toBeGreaterThanOrEqual(prev);
            prev = current;
        }
    });

    it('should produce a number for negative input', function ()
    {
        var result = Out(-1);
        expect(typeof result).toBe('number');
        expect(result).toBeCloseTo(-7);
    });

    it('should produce a number for input greater than 1', function ()
    {
        var result = Out(2);
        expect(typeof result).toBe('number');
        expect(result).toBeCloseTo(2);
    });

    it('should ease out quickly - output should be high for mid-range inputs', function ()
    {
        expect(Out(0.5)).toBeGreaterThan(0.5);
    });

    it('should return a number type', function ()
    {
        expect(typeof Out(0)).toBe('number');
        expect(typeof Out(0.5)).toBe('number');
        expect(typeof Out(1)).toBe('number');
    });
});
