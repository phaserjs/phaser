var RectangleToValues = require('../../../src/geom/intersects/RectangleToValues');

describe('Phaser.Geom.Intersects.RectangleToValues', function ()
{
    // rect with left=10, right=20, top=10, bottom=20
    var rect;

    beforeEach(function ()
    {
        rect = { left: 10, right: 20, top: 10, bottom: 20 };
    });

    it('should return true when the region fully contains the rectangle', function ()
    {
        expect(RectangleToValues(rect, 0, 30, 0, 30)).toBe(true);
    });

    it('should return true when the rectangle fully contains the region', function ()
    {
        expect(RectangleToValues(rect, 12, 18, 12, 18)).toBe(true);
    });

    it('should return true when the region overlaps on the left side', function ()
    {
        expect(RectangleToValues(rect, 0, 15, 0, 30)).toBe(true);
    });

    it('should return true when the region overlaps on the right side', function ()
    {
        expect(RectangleToValues(rect, 15, 30, 0, 30)).toBe(true);
    });

    it('should return true when the region overlaps on the top side', function ()
    {
        expect(RectangleToValues(rect, 0, 30, 0, 15)).toBe(true);
    });

    it('should return true when the region overlaps on the bottom side', function ()
    {
        expect(RectangleToValues(rect, 0, 30, 15, 30)).toBe(true);
    });

    it('should return true when the region exactly matches the rectangle bounds', function ()
    {
        expect(RectangleToValues(rect, 10, 20, 10, 20)).toBe(true);
    });

    it('should return true when the region touches the right edge of the rectangle', function ()
    {
        expect(RectangleToValues(rect, 20, 30, 10, 20)).toBe(true);
    });

    it('should return true when the region touches the left edge of the rectangle', function ()
    {
        expect(RectangleToValues(rect, 0, 10, 10, 20)).toBe(true);
    });

    it('should return true when the region touches the bottom edge of the rectangle', function ()
    {
        expect(RectangleToValues(rect, 10, 20, 20, 30)).toBe(true);
    });

    it('should return true when the region touches the top edge of the rectangle', function ()
    {
        expect(RectangleToValues(rect, 10, 20, 0, 10)).toBe(true);
    });

    it('should return false when the region is entirely to the left of the rectangle', function ()
    {
        expect(RectangleToValues(rect, 0, 5, 0, 30)).toBe(false);
    });

    it('should return false when the region is entirely to the right of the rectangle', function ()
    {
        expect(RectangleToValues(rect, 25, 35, 0, 30)).toBe(false);
    });

    it('should return false when the region is entirely above the rectangle', function ()
    {
        expect(RectangleToValues(rect, 0, 30, 0, 5)).toBe(false);
    });

    it('should return false when the region is entirely below the rectangle', function ()
    {
        expect(RectangleToValues(rect, 0, 30, 25, 35)).toBe(false);
    });

    it('should default tolerance to zero when not provided', function ()
    {
        // just outside to the right — no tolerance so should be false
        expect(RectangleToValues(rect, 21, 30, 10, 20)).toBe(false);
    });

    it('should return true when region is just outside but within positive tolerance', function ()
    {
        // region right edge is 9, rect left is 10 — gap of 1, tolerance 2 bridges it
        expect(RectangleToValues(rect, 0, 9, 10, 20, 2)).toBe(true);
    });

    it('should return false when region is just outside and tolerance is insufficient', function ()
    {
        // region right edge is 7, rect left is 10 — gap of 3, tolerance 2 not enough
        expect(RectangleToValues(rect, 0, 7, 10, 20, 2)).toBe(false);
    });

    it('should return true when region is just above but within tolerance', function ()
    {
        // region bottom is 8, rect top is 10 — gap of 2, tolerance 3 bridges it
        expect(RectangleToValues(rect, 10, 20, 0, 8, 3)).toBe(true);
    });

    it('should return false when region is just above and tolerance is insufficient', function ()
    {
        // region bottom is 6, rect top is 10 — gap of 4, tolerance 3 not enough
        expect(RectangleToValues(rect, 10, 20, 0, 6, 3)).toBe(false);
    });

    it('should return true when region is just beyond right edge but within tolerance', function ()
    {
        // region left is 22, rect right is 20 — gap of 2, tolerance 3 bridges it
        expect(RectangleToValues(rect, 22, 30, 10, 20, 3)).toBe(true);
    });

    it('should return false when region is beyond right edge and tolerance is insufficient', function ()
    {
        // region left is 24, rect right is 20 — gap of 4, tolerance 3 not enough
        expect(RectangleToValues(rect, 24, 30, 10, 20, 3)).toBe(false);
    });

    it('should return true when region is just below but within tolerance', function ()
    {
        // region top is 23, rect bottom is 20 — gap of 3, tolerance 4 bridges it
        expect(RectangleToValues(rect, 10, 20, 23, 30, 4)).toBe(true);
    });

    it('should return false when region is just below and tolerance is insufficient', function ()
    {
        // region top is 25, rect bottom is 20 — gap of 5, tolerance 4 not enough
        expect(RectangleToValues(rect, 10, 20, 25, 30, 4)).toBe(false);
    });

    it('should work with zero-size rectangle', function ()
    {
        var zeroRect = { left: 5, right: 5, top: 5, bottom: 5 };
        expect(RectangleToValues(zeroRect, 0, 10, 0, 10)).toBe(true);
        expect(RectangleToValues(zeroRect, 6, 10, 0, 10)).toBe(false);
    });

    it('should work with negative coordinates', function ()
    {
        var negRect = { left: -20, right: -10, top: -20, bottom: -10 };
        expect(RectangleToValues(negRect, -25, -15, -25, -15)).toBe(true);
        expect(RectangleToValues(negRect, -5, 5, -5, 5)).toBe(false);
    });

    it('should work with floating point coordinates', function ()
    {
        var floatRect = { left: 0.5, right: 1.5, top: 0.5, bottom: 1.5 };
        expect(RectangleToValues(floatRect, 0, 2, 0, 2)).toBe(true);
        expect(RectangleToValues(floatRect, 1.6, 3, 0, 2)).toBe(false);
    });

    it('should return a boolean value', function ()
    {
        var result = RectangleToValues(rect, 0, 30, 0, 30);
        expect(typeof result).toBe('boolean');
    });
});
