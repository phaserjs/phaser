var Contains = require('../../../src/geom/rectangle/Contains');

describe('Phaser.Geom.Rectangle.Contains', function ()
{
    var rect;

    beforeEach(function ()
    {
        rect = { x: 0, y: 0, width: 100, height: 100 };
    });

    it('should return true when point is inside the rectangle', function ()
    {
        expect(Contains(rect, 50, 50)).toBe(true);
    });

    it('should return true when point is on the left edge', function ()
    {
        expect(Contains(rect, 0, 50)).toBe(true);
    });

    it('should return true when point is on the right edge', function ()
    {
        expect(Contains(rect, 100, 50)).toBe(true);
    });

    it('should return true when point is on the top edge', function ()
    {
        expect(Contains(rect, 50, 0)).toBe(true);
    });

    it('should return true when point is on the bottom edge', function ()
    {
        expect(Contains(rect, 50, 100)).toBe(true);
    });

    it('should return true when point is on the top-left corner', function ()
    {
        expect(Contains(rect, 0, 0)).toBe(true);
    });

    it('should return true when point is on the top-right corner', function ()
    {
        expect(Contains(rect, 100, 0)).toBe(true);
    });

    it('should return true when point is on the bottom-left corner', function ()
    {
        expect(Contains(rect, 0, 100)).toBe(true);
    });

    it('should return true when point is on the bottom-right corner', function ()
    {
        expect(Contains(rect, 100, 100)).toBe(true);
    });

    it('should return false when point is to the left of the rectangle', function ()
    {
        expect(Contains(rect, -1, 50)).toBe(false);
    });

    it('should return false when point is to the right of the rectangle', function ()
    {
        expect(Contains(rect, 101, 50)).toBe(false);
    });

    it('should return false when point is above the rectangle', function ()
    {
        expect(Contains(rect, 50, -1)).toBe(false);
    });

    it('should return false when point is below the rectangle', function ()
    {
        expect(Contains(rect, 50, 101)).toBe(false);
    });

    it('should return false when rectangle has zero width', function ()
    {
        rect.width = 0;
        expect(Contains(rect, 50, 50)).toBe(false);
    });

    it('should return false when rectangle has zero height', function ()
    {
        rect.height = 0;
        expect(Contains(rect, 50, 50)).toBe(false);
    });

    it('should return false when rectangle has negative width', function ()
    {
        rect.width = -10;
        expect(Contains(rect, 50, 50)).toBe(false);
    });

    it('should return false when rectangle has negative height', function ()
    {
        rect.height = -10;
        expect(Contains(rect, 50, 50)).toBe(false);
    });

    it('should work with a rectangle that has non-zero origin', function ()
    {
        var r = { x: 50, y: 50, width: 100, height: 100 };
        expect(Contains(r, 100, 100)).toBe(true);
        expect(Contains(r, 50, 50)).toBe(true);
        expect(Contains(r, 150, 150)).toBe(true);
        expect(Contains(r, 49, 100)).toBe(false);
        expect(Contains(r, 100, 49)).toBe(false);
        expect(Contains(r, 151, 100)).toBe(false);
        expect(Contains(r, 100, 151)).toBe(false);
    });

    it('should work with negative rectangle coordinates', function ()
    {
        var r = { x: -50, y: -50, width: 100, height: 100 };
        expect(Contains(r, 0, 0)).toBe(true);
        expect(Contains(r, -50, -50)).toBe(true);
        expect(Contains(r, 50, 50)).toBe(true);
        expect(Contains(r, -51, 0)).toBe(false);
        expect(Contains(r, 51, 0)).toBe(false);
    });

    it('should work with floating point coordinates', function ()
    {
        expect(Contains(rect, 50.5, 50.5)).toBe(true);
        expect(Contains(rect, 0.1, 0.1)).toBe(true);
        expect(Contains(rect, 99.9, 99.9)).toBe(true);
        expect(Contains(rect, -0.1, 50)).toBe(false);
        expect(Contains(rect, 100.1, 50)).toBe(false);
    });

    it('should work with a 1x1 rectangle', function ()
    {
        var r = { x: 5, y: 5, width: 1, height: 1 };
        expect(Contains(r, 5, 5)).toBe(true);
        expect(Contains(r, 6, 5)).toBe(true);
        expect(Contains(r, 5, 6)).toBe(true);
        expect(Contains(r, 6, 6)).toBe(true);
        expect(Contains(r, 4, 5)).toBe(false);
        expect(Contains(r, 7, 5)).toBe(false);
    });
});
