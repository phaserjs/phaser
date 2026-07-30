var SnapFloor = require('../../../src/math/snap/SnapFloor');

describe('Phaser.Math.Snap.Floor', function ()
{
    it('should snap to the nearest lower grid slice', function ()
    {
        expect(SnapFloor(12, 5)).toBe(10);
        expect(SnapFloor(14, 5)).toBe(10);
        expect(SnapFloor(16, 5)).toBe(15);
    });

    it('should return the value unchanged when gap is zero', function ()
    {
        expect(SnapFloor(12, 0)).toBe(12);
        expect(SnapFloor(0, 0)).toBe(0);
        expect(SnapFloor(-7, 0)).toBe(-7);
    });

    it('should snap to zero when value is exactly on a grid line', function ()
    {
        expect(SnapFloor(10, 5)).toBe(10);
        expect(SnapFloor(15, 5)).toBe(15);
        expect(SnapFloor(0, 5)).toBe(0);
    });

    it('should use default start of 0 when not provided', function ()
    {
        expect(SnapFloor(9, 5)).toBe(5);
        expect(SnapFloor(4, 5)).toBe(0);
    });

    it('should apply the start offset correctly', function ()
    {
        expect(SnapFloor(12, 5, 2)).toBe(12);
        expect(SnapFloor(13, 5, 2)).toBe(12);
        expect(SnapFloor(16, 5, 2)).toBe(12);
        expect(SnapFloor(17, 5, 2)).toBe(17);
    });

    it('should divide the snapped value by gap when divide is true', function ()
    {
        expect(SnapFloor(12, 5, 0, true)).toBe(2);
        expect(SnapFloor(14, 5, 0, true)).toBe(2);
        expect(SnapFloor(16, 5, 0, true)).toBe(3);
    });

    it('should divide with start offset when divide is true', function ()
    {
        expect(SnapFloor(12, 5, 2, true)).toBe(12 / 5);
        expect(SnapFloor(17, 5, 2, true)).toBe(17 / 5);
    });

    it('should work with negative values', function ()
    {
        expect(SnapFloor(-3, 5)).toBe(-5);
        expect(SnapFloor(-5, 5)).toBe(-5);
        expect(SnapFloor(-6, 5)).toBe(-10);
    });

    it('should work with floating point gap values', function ()
    {
        expect(SnapFloor(1.4, 0.5)).toBeCloseTo(1.0);
        expect(SnapFloor(1.6, 0.5)).toBeCloseTo(1.5);
        expect(SnapFloor(1.9, 0.5)).toBeCloseTo(1.5);
    });

    it('should work with floating point values', function ()
    {
        expect(SnapFloor(12.9, 5)).toBe(10);
        expect(SnapFloor(14.99, 5)).toBe(10);
        expect(SnapFloor(15.0, 5)).toBe(15);
    });

    it('should return zero when value is zero and gap is positive', function ()
    {
        expect(SnapFloor(0, 10)).toBe(0);
    });

    it('should work with large values', function ()
    {
        expect(SnapFloor(999, 100)).toBe(900);
        expect(SnapFloor(1000, 100)).toBe(1000);
        expect(SnapFloor(1050, 100)).toBe(1000);
    });

    it('should work with gap of 1', function ()
    {
        expect(SnapFloor(3.7, 1)).toBe(3);
        expect(SnapFloor(3.0, 1)).toBe(3);
        expect(SnapFloor(-1.2, 1)).toBe(-2);
    });

    it('should not divide when divide is false', function ()
    {
        expect(SnapFloor(12, 5, 0, false)).toBe(10);
    });
});
