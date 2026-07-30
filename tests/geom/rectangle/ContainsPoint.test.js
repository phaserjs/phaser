var ContainsPoint = require('../../../src/geom/rectangle/ContainsPoint');

describe('Phaser.Geom.Rectangle.ContainsPoint', function ()
{
    var rect;

    beforeEach(function ()
    {
        rect = { x: 10, y: 10, width: 100, height: 100 };
    });

    it('should return true when the point is inside the rectangle', function ()
    {
        var vec = { x: 50, y: 50 };
        expect(ContainsPoint(rect, vec)).toBe(true);
    });

    it('should return false when the point is to the left of the rectangle', function ()
    {
        var vec = { x: 5, y: 50 };
        expect(ContainsPoint(rect, vec)).toBe(false);
    });

    it('should return false when the point is to the right of the rectangle', function ()
    {
        var vec = { x: 115, y: 50 };
        expect(ContainsPoint(rect, vec)).toBe(false);
    });

    it('should return false when the point is above the rectangle', function ()
    {
        var vec = { x: 50, y: 5 };
        expect(ContainsPoint(rect, vec)).toBe(false);
    });

    it('should return false when the point is below the rectangle', function ()
    {
        var vec = { x: 50, y: 115 };
        expect(ContainsPoint(rect, vec)).toBe(false);
    });

    it('should return true when the point is on the left edge', function ()
    {
        var vec = { x: 10, y: 50 };
        expect(ContainsPoint(rect, vec)).toBe(true);
    });

    it('should return true when the point is on the top edge', function ()
    {
        var vec = { x: 50, y: 10 };
        expect(ContainsPoint(rect, vec)).toBe(true);
    });

    it('should return true when the point is on the right edge', function ()
    {
        var vec = { x: 110, y: 50 };
        expect(ContainsPoint(rect, vec)).toBe(true);
    });

    it('should return true when the point is on the bottom edge', function ()
    {
        var vec = { x: 50, y: 110 };
        expect(ContainsPoint(rect, vec)).toBe(true);
    });

    it('should return true when the point is at the top-left corner', function ()
    {
        var vec = { x: 10, y: 10 };
        expect(ContainsPoint(rect, vec)).toBe(true);
    });

    it('should return true when the point is at the bottom-right corner', function ()
    {
        var vec = { x: 110, y: 110 };
        expect(ContainsPoint(rect, vec)).toBe(true);
    });

    it('should return false when the point is at the origin and rectangle does not contain it', function ()
    {
        var vec = { x: 0, y: 0 };
        expect(ContainsPoint(rect, vec)).toBe(false);
    });

    it('should work with a rectangle at the origin', function ()
    {
        var originRect = { x: 0, y: 0, width: 50, height: 50 };
        var vec = { x: 25, y: 25 };
        expect(ContainsPoint(originRect, vec)).toBe(true);
    });

    it('should return false for a zero-size rectangle', function ()
    {
        var zeroRect = { x: 10, y: 10, width: 0, height: 0 };
        var vec = { x: 10, y: 10 };
        expect(ContainsPoint(zeroRect, vec)).toBe(false);
    });

    it('should work with floating point coordinates', function ()
    {
        var vec = { x: 10.5, y: 10.5 };
        expect(ContainsPoint(rect, vec)).toBe(true);
    });

    it('should return false when point uses floating point coordinates outside the rectangle', function ()
    {
        var vec = { x: 9.9, y: 50 };
        expect(ContainsPoint(rect, vec)).toBe(false);
    });

    it('should work with negative rectangle coordinates', function ()
    {
        var negRect = { x: -50, y: -50, width: 100, height: 100 };
        var vec = { x: -25, y: -25 };
        expect(ContainsPoint(negRect, vec)).toBe(true);
    });

    it('should return false for a point outside a negative rectangle', function ()
    {
        var negRect = { x: -50, y: -50, width: 100, height: 100 };
        var vec = { x: 60, y: 60 };
        expect(ContainsPoint(negRect, vec)).toBe(false);
    });
});
