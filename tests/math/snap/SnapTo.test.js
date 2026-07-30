var SnapTo = require('../../../src/math/snap/SnapTo');

describe('Phaser.Math.Snap.To', function ()
{
    it('should snap down to nearest interval', function ()
    {
        expect(SnapTo(12, 5)).toBe(10);
    });

    it('should snap up to nearest interval', function ()
    {
        expect(SnapTo(14, 5)).toBe(15);
    });

    it('should snap exactly halfway values up to the higher slice', function ()
    {
        expect(SnapTo(12.5, 5)).toBe(15);
    });

    it('should return the value unchanged when gap is zero', function ()
    {
        expect(SnapTo(12, 0)).toBe(12);
        expect(SnapTo(0, 0)).toBe(0);
        expect(SnapTo(-7, 0)).toBe(-7);
    });

    it('should snap to zero when value is zero', function ()
    {
        expect(SnapTo(0, 5)).toBe(0);
    });

    it('should snap negative values correctly', function ()
    {
        expect(SnapTo(-12, 5)).toBe(-10);
        expect(SnapTo(-14, 5)).toBe(-15);
    });

    it('should use start offset when provided', function ()
    {
        expect(SnapTo(12, 5, 2)).toBe(12);
        expect(SnapTo(13, 5, 2)).toBe(12);
        expect(SnapTo(15, 5, 2)).toBe(17);
    });

    it('should default start to zero when not provided', function ()
    {
        expect(SnapTo(10, 5)).toBe(SnapTo(10, 5, 0));
        expect(SnapTo(7, 5)).toBe(SnapTo(7, 5, 0));
    });

    it('should divide the result by gap when divide is true', function ()
    {
        expect(SnapTo(12, 5, 0, true)).toBe(2);
        expect(SnapTo(14, 5, 0, true)).toBe(3);
    });

    it('should divide with start offset when divide is true', function ()
    {
        expect(SnapTo(12, 5, 2, true)).toBeCloseTo(2.4);
        expect(SnapTo(17, 5, 2, true)).toBeCloseTo(3.4);
    });

    it('should snap values exactly on an interval boundary', function ()
    {
        expect(SnapTo(10, 5)).toBe(10);
        expect(SnapTo(15, 5)).toBe(15);
        expect(SnapTo(20, 5)).toBe(20);
    });

    it('should work with an interval of 1', function ()
    {
        expect(SnapTo(3.2, 1)).toBe(3);
        expect(SnapTo(3.7, 1)).toBe(4);
        expect(SnapTo(3.5, 1)).toBe(4);
    });

    it('should work with floating point gaps', function ()
    {
        expect(SnapTo(1.1, 0.5)).toBeCloseTo(1.0);
        expect(SnapTo(1.3, 0.5)).toBeCloseTo(1.5);
    });

    it('should work with large values', function ()
    {
        expect(SnapTo(997, 100)).toBe(1000);
        expect(SnapTo(949, 100)).toBe(900);
    });

    it('should work with large negative values', function ()
    {
        expect(SnapTo(-997, 100)).toBe(-1000);
        expect(SnapTo(-949, 100)).toBe(-900);
    });

    it('should not divide when divide is false', function ()
    {
        expect(SnapTo(12, 5, 0, false)).toBe(10);
    });

    it('should not divide when divide is undefined', function ()
    {
        expect(SnapTo(12, 5, 0, undefined)).toBe(10);
    });
});
