var Area = require('../../../src/geom/rectangle/Area');

describe('Phaser.Geom.Rectangle.Area', function ()
{
    it('should return the correct area for a standard rectangle', function ()
    {
        expect(Area({ width: 10, height: 5 })).toBe(50);
    });

    it('should return zero when width is zero', function ()
    {
        expect(Area({ width: 0, height: 10 })).toBe(0);
    });

    it('should return zero when height is zero', function ()
    {
        expect(Area({ width: 10, height: 0 })).toBe(0);
    });

    it('should return zero when both width and height are zero', function ()
    {
        expect(Area({ width: 0, height: 0 })).toBe(0);
    });

    it('should return correct area for a square', function ()
    {
        expect(Area({ width: 7, height: 7 })).toBe(49);
    });

    it('should work with floating point values', function ()
    {
        expect(Area({ width: 2.5, height: 4.0 })).toBeCloseTo(10.0);
    });

    it('should work with negative width', function ()
    {
        expect(Area({ width: -5, height: 10 })).toBe(-50);
    });

    it('should work with negative height', function ()
    {
        expect(Area({ width: 5, height: -10 })).toBe(-50);
    });

    it('should work with both negative width and height', function ()
    {
        expect(Area({ width: -5, height: -10 })).toBe(50);
    });

    it('should work with large values', function ()
    {
        expect(Area({ width: 10000, height: 10000 })).toBe(100000000);
    });

    it('should work with fractional floating point values', function ()
    {
        expect(Area({ width: 1.5, height: 2.5 })).toBeCloseTo(3.75);
    });

    it('should return a number type', function ()
    {
        expect(typeof Area({ width: 4, height: 6 })).toBe('number');
    });
});
