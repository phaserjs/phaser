var Out = require('../../../../src/math/easing/quartic/Out');

describe('Phaser.Math.Easing.Quartic.Out', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(Out(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(Out(1)).toBe(1);
    });

    it('should return 0.9375 when v is 0.5', function ()
    {
        expect(Out(0.5)).toBeCloseTo(0.9375, 10);
    });

    it('should return correct value at v = 0.25', function ()
    {
        // --v = -0.75, result = 1 - (0.75^4) = 1 - 0.31640625 = 0.68359375
        expect(Out(0.25)).toBeCloseTo(0.68359375, 10);
    });

    it('should return correct value at v = 0.75', function ()
    {
        // --v = -0.25, result = 1 - (0.25^4) = 1 - 0.00390625 = 0.99609375
        expect(Out(0.75)).toBeCloseTo(0.99609375, 10);
    });

    it('should return values between 0 and 1 for inputs in range [0, 1]', function ()
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

    it('should be monotonically increasing for inputs in range [0, 1]', function ()
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

    it('should accelerate quickly near v = 0', function ()
    {
        // Quartic out rises quickly at the start
        expect(Out(0.1)).toBeGreaterThan(Out(0));
        expect(Out(0.1)).toBeGreaterThan(0.3);
    });

    it('should approach 1 slowly near v = 1', function ()
    {
        // Quartic out flattens out near the end
        var nearEnd = Out(0.9);
        var atEnd = Out(1);

        expect(atEnd - nearEnd).toBeLessThan(0.01);
    });

    it('should return a number type', function ()
    {
        expect(typeof Out(0)).toBe('number');
        expect(typeof Out(0.5)).toBe('number');
        expect(typeof Out(1)).toBe('number');
    });

    it('should handle values slightly outside [0, 1]', function ()
    {
        // v = -0.1: --v = -1.1, result = 1 - (1.1^4) = 1 - 1.4641 = -0.4641
        expect(Out(-0.1)).toBeCloseTo(1 - Math.pow(-1.1, 4), 10);

        // v = 1.1: --v = 0.1, result = 1 - (0.1^4) = 1 - 0.0001 = 0.9999
        expect(Out(1.1)).toBeCloseTo(1 - Math.pow(0.1, 4), 10);
    });
});
