var DistanceBetweenPoints = require('../../../src/math/distance/DistanceBetweenPoints');

describe('Phaser.Math.Distance.BetweenPoints', function ()
{
    it('should return zero when both points are the same', function ()
    {
        expect(DistanceBetweenPoints({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
        expect(DistanceBetweenPoints({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
    });

    it('should return the correct distance for a 3-4-5 right triangle', function ()
    {
        expect(DistanceBetweenPoints({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    });

    it('should return the correct distance along the x-axis', function ()
    {
        expect(DistanceBetweenPoints({ x: 0, y: 0 }, { x: 10, y: 0 })).toBe(10);
        expect(DistanceBetweenPoints({ x: -5, y: 0 }, { x: 5, y: 0 })).toBe(10);
    });

    it('should return the correct distance along the y-axis', function ()
    {
        expect(DistanceBetweenPoints({ x: 0, y: 0 }, { x: 0, y: 10 })).toBe(10);
        expect(DistanceBetweenPoints({ x: 0, y: -5 }, { x: 0, y: 5 })).toBe(10);
    });

    it('should return the same distance regardless of direction', function ()
    {
        var a = { x: 1, y: 2 };
        var b = { x: 4, y: 6 };

        expect(DistanceBetweenPoints(a, b)).toBe(DistanceBetweenPoints(b, a));
    });

    it('should work with negative coordinates', function ()
    {
        expect(DistanceBetweenPoints({ x: -3, y: -4 }, { x: 0, y: 0 })).toBe(5);
        expect(DistanceBetweenPoints({ x: -3, y: 0 }, { x: 0, y: -4 })).toBe(5);
    });

    it('should work with floating point coordinates', function ()
    {
        expect(DistanceBetweenPoints({ x: 0, y: 0 }, { x: 1, y: 1 })).toBeCloseTo(Math.SQRT2);
        expect(DistanceBetweenPoints({ x: 0.5, y: 0.5 }, { x: 1.5, y: 1.5 })).toBeCloseTo(Math.SQRT2);
    });

    it('should return a non-negative number', function ()
    {
        expect(DistanceBetweenPoints({ x: -10, y: -10 }, { x: 10, y: 10 })).toBeGreaterThan(0);
    });

    it('should work with large coordinate values', function ()
    {
        expect(DistanceBetweenPoints({ x: 0, y: 0 }, { x: 3000, y: 4000 })).toBe(5000);
    });

    it('should work when points differ only in x', function ()
    {
        expect(DistanceBetweenPoints({ x: 2, y: 5 }, { x: 7, y: 5 })).toBe(5);
    });

    it('should work when points differ only in y', function ()
    {
        expect(DistanceBetweenPoints({ x: 3, y: 1 }, { x: 3, y: 9 })).toBe(8);
    });
});
