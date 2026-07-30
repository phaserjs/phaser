var In = require('../../../../src/math/easing/back/In');

describe('Phaser.Math.Easing.Back.In', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(In(0)).toBeCloseTo(0, 10);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(In(1)).toBeCloseTo(1, 10);
    });

    it('should return a negative value for small positive v due to pullback effect', function ()
    {
        expect(In(0.1)).toBeLessThan(0);
    });

    it('should use default overshoot of 1.70158 when not provided', function ()
    {
        var v = 0.5;
        var overshoot = 1.70158;
        var expected = v * v * ((overshoot + 1) * v - overshoot);
        expect(In(v)).toBeCloseTo(expected, 10);
    });

    it('should use custom overshoot when provided', function ()
    {
        var v = 0.5;
        var overshoot = 3;
        var expected = v * v * ((overshoot + 1) * v - overshoot);
        expect(In(v, overshoot)).toBeCloseTo(expected, 10);
    });

    it('should return 0 when v is 0 regardless of overshoot', function ()
    {
        expect(In(0, 0)).toBeCloseTo(0, 10);
        expect(In(0, 5)).toBeCloseTo(0, 10);
        expect(In(0, 1.70158)).toBeCloseTo(0, 10);
    });

    it('should return 1 when v is 1 regardless of overshoot', function ()
    {
        expect(In(1, 0)).toBeCloseTo(1, 10);
        expect(In(1, 5)).toBeCloseTo(1, 10);
        expect(In(1, 10)).toBeCloseTo(1, 10);
    });

    it('should produce a more pronounced pullback with higher overshoot', function ()
    {
        var v = 0.2;
        var low = In(v, 1.70158);
        var high = In(v, 5);
        expect(high).toBeLessThan(low);
    });

    it('should produce no pullback when overshoot is 0', function ()
    {
        var v = 0.5;
        var expected = v * v * (1 * v - 0);
        expect(In(v, 0)).toBeCloseTo(expected, 10);
    });

    it('should be monotonically increasing in the second half of the range', function ()
    {
        var prev = In(0.5);
        for (var i = 6; i <= 10; i++)
        {
            var curr = In(i / 10);
            expect(curr).toBeGreaterThan(prev);
            prev = curr;
        }
    });

    it('should handle v greater than 1', function ()
    {
        var v = 1.5;
        var overshoot = 1.70158;
        var expected = v * v * ((overshoot + 1) * v - overshoot);
        expect(In(v)).toBeCloseTo(expected, 10);
    });

    it('should handle negative v values', function ()
    {
        var v = -0.5;
        var overshoot = 1.70158;
        var expected = v * v * ((overshoot + 1) * v - overshoot);
        expect(In(v)).toBeCloseTo(expected, 10);
    });

    it('should return the correct value at v = 0.5 with default overshoot', function ()
    {
        var v = 0.5;
        var overshoot = 1.70158;
        var expected = v * v * ((overshoot + 1) * v - overshoot);
        expect(In(0.5)).toBeCloseTo(expected, 10);
    });

    it('should return the correct value at v = 0.25', function ()
    {
        var v = 0.25;
        var overshoot = 1.70158;
        var expected = v * v * ((overshoot + 1) * v - overshoot);
        expect(In(0.25)).toBeCloseTo(expected, 10);
    });

    it('should return the correct value at v = 0.75', function ()
    {
        var v = 0.75;
        var overshoot = 1.70158;
        var expected = v * v * ((overshoot + 1) * v - overshoot);
        expect(In(0.75)).toBeCloseTo(expected, 10);
    });
});
