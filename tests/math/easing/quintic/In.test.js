var In = require('../../../../src/math/easing/quintic/In');

describe('Phaser.Math.Easing.Quintic.In', function ()
{
    it('should return 0 when given 0', function ()
    {
        expect(In(0)).toBe(0);
    });

    it('should return 1 when given 1', function ()
    {
        expect(In(1)).toBe(1);
    });

    it('should return v^5 for a mid-range value', function ()
    {
        expect(In(0.5)).toBeCloseTo(0.03125, 10);
    });

    it('should return v^5 for 0.25', function ()
    {
        expect(In(0.25)).toBeCloseTo(0.0009765625, 10);
    });

    it('should return v^5 for 0.75', function ()
    {
        expect(In(0.75)).toBeCloseTo(0.2373046875, 10);
    });

    it('should return negative values for negative input', function ()
    {
        expect(In(-1)).toBe(-1);
        expect(In(-0.5)).toBeCloseTo(-0.03125, 10);
    });

    it('should return values greater than 1 for input greater than 1', function ()
    {
        expect(In(2)).toBe(32);
    });

    it('should produce a strongly accelerating curve between 0 and 1', function ()
    {
        var v1 = In(0.2);
        var v2 = In(0.5);
        var v3 = In(0.8);

        expect(v1).toBeLessThan(v2);
        expect(v2).toBeLessThan(v3);
    });

    it('should be monotonically increasing between 0 and 1', function ()
    {
        var prev = In(0);

        for (var i = 1; i <= 10; i++)
        {
            var curr = In(i / 10);
            expect(curr).toBeGreaterThan(prev);
            prev = curr;
        }
    });

    it('should stay below 0.5 for the first ~87% of the range', function ()
    {
        expect(In(0.87)).toBeLessThan(0.5);
        expect(In(0.88)).toBeGreaterThan(0.5);
    });

    it('should return exact fifth power for integer inputs', function ()
    {
        expect(In(3)).toBe(243);
        expect(In(4)).toBe(1024);
    });
});
