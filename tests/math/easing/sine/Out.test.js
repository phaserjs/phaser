var Out = require('../../../../src/math/easing/sine/Out');

describe('Phaser.Math.Easing.Sine.Out', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(Out(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(Out(1)).toBe(1);
    });

    it('should return 0.5 when v is approximately 0.5', function ()
    {
        expect(Out(0.5)).toBeCloseTo(Math.sin(0.5 * Math.PI / 2), 10);
    });

    it('should return a value close to 1 for values near 1', function ()
    {
        expect(Out(0.99)).toBeCloseTo(Math.sin(0.99 * Math.PI / 2), 10);
    });

    it('should return a value close to 0 for values near 0', function ()
    {
        expect(Out(0.01)).toBeCloseTo(Math.sin(0.01 * Math.PI / 2), 10);
    });

    it('should return a value in the range [0, 1] for any input in [0, 1]', function ()
    {
        var steps = 100;

        for (var i = 0; i <= steps; i++)
        {
            var v = i / steps;
            var result = Out(v);

            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should be monotonically increasing across the range [0, 1]', function ()
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

    it('should return the sine calculation for midpoint value 0.5', function ()
    {
        expect(Out(0.5)).toBeCloseTo(Math.sin(Math.PI / 4), 10);
    });

    it('should produce values that decelerate (increase faster at start than end)', function ()
    {
        var delta1 = Out(0.1) - Out(0.0);
        var delta2 = Out(1.0) - Out(0.9);

        expect(delta1).toBeGreaterThan(delta2);
    });
});
