var Area = require('../../../src/geom/circle/Area');

describe('Phaser.Geom.Circle.Area', function ()
{
    it('should return the correct area for a circle with a positive radius', function ()
    {
        var circle = { radius: 1 };
        expect(Area(circle)).toBeCloseTo(Math.PI, 10);
    });

    it('should return zero when the radius is zero', function ()
    {
        var circle = { radius: 0 };
        expect(Area(circle)).toBe(0);
    });

    it('should return zero when the radius is negative', function ()
    {
        var circle = { radius: -5 };
        expect(Area(circle)).toBe(0);
    });

    it('should return the correct area for a radius of 5', function ()
    {
        var circle = { radius: 5 };
        expect(Area(circle)).toBeCloseTo(Math.PI * 25, 10);
    });

    it('should return the correct area for a radius of 10', function ()
    {
        var circle = { radius: 10 };
        expect(Area(circle)).toBeCloseTo(Math.PI * 100, 10);
    });

    it('should return the correct area for a floating point radius', function ()
    {
        var circle = { radius: 2.5 };
        expect(Area(circle)).toBeCloseTo(Math.PI * 6.25, 10);
    });

    it('should return the correct area for a very large radius', function ()
    {
        var circle = { radius: 1000 };
        expect(Area(circle)).toBeCloseTo(Math.PI * 1000000, 5);
    });

    it('should return the correct area for a very small positive radius', function ()
    {
        var circle = { radius: 0.0001 };
        expect(Area(circle)).toBeCloseTo(Math.PI * 0.0001 * 0.0001, 20);
    });

    it('should return zero for a radius of -1', function ()
    {
        var circle = { radius: -1 };
        expect(Area(circle)).toBe(0);
    });

    it('should use only the radius property of the circle object', function ()
    {
        var circle = { radius: 3, x: 100, y: 200, diameter: 6 };
        expect(Area(circle)).toBeCloseTo(Math.PI * 9, 10);
    });
});
