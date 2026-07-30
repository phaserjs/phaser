var Out = require('../../../../src/math/easing/circular/Out');

describe('Phaser.Math.Easing.Circular.Out', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(Out(0)).toBeCloseTo(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(Out(1)).toBeCloseTo(1);
    });

    it('should return 0.5 when v is approximately 0.134', function ()
    {
        // sqrt(1 - (0.134 - 1)^2) = sqrt(1 - 0.75) = 0.5
        expect(Out(1 - Math.sqrt(0.75))).toBeCloseTo(0.5);
    });

    it('should return a value close to 1 for v near 1', function ()
    {
        var result = Out(0.99);
        expect(result).toBeGreaterThan(0.99);
        expect(result).toBeLessThanOrEqual(1);
    });

    it('should return a value close to 0 for v near 0', function ()
    {
        var result = Out(0.01);
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(0.2);
    });

    it('should produce monotonically increasing values across the range', function ()
    {
        var prev = Out(0);
        for (var i = 1; i <= 10; i++)
        {
            var v = i / 10;
            var curr = Out(v);
            expect(curr).toBeGreaterThan(prev);
            prev = curr;
        }
    });

    it('should return values in the range 0 to 1 for inputs in 0 to 1', function ()
    {
        for (var i = 0; i <= 20; i++)
        {
            var v = i / 20;
            var result = Out(v);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should match the circular ease-out formula sqrt(1 - (v-1)^2)', function ()
    {
        var testValues = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1];
        for (var i = 0; i < testValues.length; i++)
        {
            var v = testValues[i];
            var expected = Math.sqrt(1 - ((v - 1) * (v - 1)));
            expect(Out(v)).toBeCloseTo(expected);
        }
    });

    it('should return 0.5 at approximately v = 0.134', function ()
    {
        // At v = 1 - sqrt(3)/2, result should be 0.5
        var v = 1 - Math.sqrt(3) / 2;
        expect(Out(v)).toBeCloseTo(0.5);
    });

    it('should ease quickly at the start and slow at the end', function ()
    {
        var earlyGain = Out(0.1) - Out(0);
        var lateGain = Out(1) - Out(0.9);
        expect(earlyGain).toBeGreaterThan(lateGain);
    });
});
