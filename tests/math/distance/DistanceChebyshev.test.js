var DistanceChebyshev = require('../../../src/math/distance/DistanceChebyshev');

describe('Phaser.Math.Distance.Chebyshev', function ()
{
    it('should return zero when both points are the same', function ()
    {
        expect(DistanceChebyshev(0, 0, 0, 0)).toBe(0);
        expect(DistanceChebyshev(5, 5, 5, 5)).toBe(0);
    });

    it('should return the horizontal distance when it is greater', function ()
    {
        expect(DistanceChebyshev(0, 0, 10, 3)).toBe(10);
    });

    it('should return the vertical distance when it is greater', function ()
    {
        expect(DistanceChebyshev(0, 0, 3, 10)).toBe(10);
    });

    it('should return equal distance when horizontal and vertical are the same', function ()
    {
        expect(DistanceChebyshev(0, 0, 5, 5)).toBe(5);
    });

    it('should work with negative coordinates', function ()
    {
        expect(DistanceChebyshev(-5, -5, 5, 5)).toBe(10);
        expect(DistanceChebyshev(-10, 0, 0, 3)).toBe(10);
    });

    it('should be symmetric (order of points does not matter)', function ()
    {
        expect(DistanceChebyshev(1, 2, 7, 5)).toBe(DistanceChebyshev(7, 5, 1, 2));
    });

    it('should return the absolute distance regardless of direction', function ()
    {
        expect(DistanceChebyshev(10, 0, 0, 0)).toBe(10);
        expect(DistanceChebyshev(0, 0, -10, 0)).toBe(10);
    });

    it('should work with floating point coordinates', function ()
    {
        expect(DistanceChebyshev(0, 0, 1.5, 0.5)).toBeCloseTo(1.5);
        expect(DistanceChebyshev(0, 0, 0.5, 1.5)).toBeCloseTo(1.5);
    });

    it('should return zero for a purely horizontal movement of zero', function ()
    {
        expect(DistanceChebyshev(3, 7, 3, 7)).toBe(0);
    });

    it('should handle large coordinate values', function ()
    {
        expect(DistanceChebyshev(0, 0, 1000000, 500000)).toBe(1000000);
    });
});
