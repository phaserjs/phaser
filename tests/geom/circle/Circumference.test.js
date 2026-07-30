var Circumference = require('../../../src/geom/circle/Circumference');

describe('Phaser.Geom.Circle.Circumference', function ()
{
    it('should return the correct circumference for a unit circle', function ()
    {
        var circle = { radius: 1 };

        expect(Circumference(circle)).toBeCloseTo(2 * Math.PI);
    });

    it('should return zero when radius is zero', function ()
    {
        var circle = { radius: 0 };

        expect(Circumference(circle)).toBe(0);
    });

    it('should return the correct circumference for a radius of 5', function ()
    {
        var circle = { radius: 5 };

        expect(Circumference(circle)).toBeCloseTo(2 * Math.PI * 5);
    });

    it('should return the correct circumference for a radius of 100', function ()
    {
        var circle = { radius: 100 };

        expect(Circumference(circle)).toBeCloseTo(2 * Math.PI * 100);
    });

    it('should handle floating point radius values', function ()
    {
        var circle = { radius: 3.5 };

        expect(Circumference(circle)).toBeCloseTo(2 * Math.PI * 3.5);
    });

    it('should handle negative radius values', function ()
    {
        var circle = { radius: -5 };

        expect(Circumference(circle)).toBeCloseTo(2 * Math.PI * -5);
    });

    it('should return a number', function ()
    {
        var circle = { radius: 10 };

        expect(typeof Circumference(circle)).toBe('number');
    });

    it('should scale linearly with radius', function ()
    {
        var small = { radius: 5 };
        var large = { radius: 10 };

        expect(Circumference(large)).toBeCloseTo(Circumference(small) * 2);
    });
});
