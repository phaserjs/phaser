var SnapCeil = require('../../../src/math/snap/SnapCeil');

describe('Phaser.Math.Snap.Ceil', function ()
{
    it('should snap value up to the nearest interval', function ()
    {
        expect(SnapCeil(12, 5)).toBe(15);
    });

    it('should snap value exactly on interval to that interval', function ()
    {
        expect(SnapCeil(15, 5)).toBe(15);
    });

    it('should snap value just above interval to the next interval', function ()
    {
        expect(SnapCeil(16, 5)).toBe(20);
    });

    it('should snap value just below interval up to that interval', function ()
    {
        expect(SnapCeil(14, 5)).toBe(15);
    });

    it('should return value unchanged when gap is zero', function ()
    {
        expect(SnapCeil(12, 0)).toBe(12);
        expect(SnapCeil(0, 0)).toBe(0);
        expect(SnapCeil(-7, 0)).toBe(-7);
    });

    it('should default start to 0', function ()
    {
        expect(SnapCeil(12, 5)).toBe(15);
        expect(SnapCeil(12, 5, 0)).toBe(15);
    });

    it('should apply a start offset', function ()
    {
        expect(SnapCeil(12, 5, 2)).toBe(12);
        expect(SnapCeil(7, 5, 2)).toBe(7);
    });

    it('should snap zero to zero with no offset', function ()
    {
        expect(SnapCeil(0, 5)).toBe(0);
    });

    it('should handle negative values', function ()
    {
        expect(SnapCeil(-12, 5)).toBe(-10);
        expect(SnapCeil(-15, 5)).toBe(-15);
        expect(SnapCeil(-16, 5)).toBe(-15);
    });

    it('should divide the result by gap when divide is true', function ()
    {
        expect(SnapCeil(12, 5, 0, true)).toBe(3);
        expect(SnapCeil(15, 5, 0, true)).toBe(3);
        expect(SnapCeil(16, 5, 0, true)).toBe(4);
    });

    it('should divide with a start offset when divide is true', function ()
    {
        expect(SnapCeil(12, 5, 2, true)).toBe(12 / 5);
    });

    it('should not divide when divide is false', function ()
    {
        expect(SnapCeil(12, 5, 0, false)).toBe(15);
    });

    it('should handle floating point gap values', function ()
    {
        expect(SnapCeil(0.3, 0.1)).toBeCloseTo(0.3, 5);
        expect(SnapCeil(0.25, 0.1)).toBeCloseTo(0.3, 5);
    });

    it('should handle large values', function ()
    {
        expect(SnapCeil(997, 100)).toBe(1000);
        expect(SnapCeil(1000, 100)).toBe(1000);
        expect(SnapCeil(1001, 100)).toBe(1100);
    });

    it('should handle gap of 1', function ()
    {
        expect(SnapCeil(3.2, 1)).toBe(4);
        expect(SnapCeil(3.0, 1)).toBe(3);
        expect(SnapCeil(-3.2, 1)).toBe(-3);
    });
});
