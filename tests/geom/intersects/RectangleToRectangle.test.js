var RectangleToRectangle = require('../../../src/geom/intersects/RectangleToRectangle');

describe('Phaser.Geom.Intersects.RectangleToRectangle', function ()
{
    function makeRect(x, y, width, height)
    {
        return {
            x: x,
            y: y,
            width: width,
            height: height,
            right: x + width,
            bottom: y + height
        };
    }

    it('should return true when two rectangles overlap', function ()
    {
        var a = makeRect(0, 0, 100, 100);
        var b = makeRect(50, 50, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(true);
    });

    it('should return true when one rectangle is fully inside the other', function ()
    {
        var a = makeRect(0, 0, 200, 200);
        var b = makeRect(50, 50, 50, 50);
        expect(RectangleToRectangle(a, b)).toBe(true);
    });

    it('should return true when rectangles share only an edge (right meets left)', function ()
    {
        var a = makeRect(0, 0, 100, 100);
        var b = makeRect(100, 0, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(true);
    });

    it('should return true when rectangles share only an edge (bottom meets top)', function ()
    {
        var a = makeRect(0, 0, 100, 100);
        var b = makeRect(0, 100, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(true);
    });

    it('should return true when rectangles share a single corner point', function ()
    {
        var a = makeRect(0, 0, 100, 100);
        var b = makeRect(100, 100, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(true);
    });

    it('should return false when rectangles do not overlap horizontally', function ()
    {
        var a = makeRect(0, 0, 100, 100);
        var b = makeRect(200, 0, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(false);
    });

    it('should return false when rectangles do not overlap vertically', function ()
    {
        var a = makeRect(0, 0, 100, 100);
        var b = makeRect(0, 200, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(false);
    });

    it('should return false when rectA is to the right of rectB', function ()
    {
        var a = makeRect(300, 0, 100, 100);
        var b = makeRect(0, 0, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(false);
    });

    it('should return false when rectA is above rectB', function ()
    {
        var a = makeRect(0, 0, 100, 100);
        var b = makeRect(0, 200, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(false);
    });

    it('should return false when rectA has zero width', function ()
    {
        var a = makeRect(0, 0, 0, 100);
        var b = makeRect(0, 0, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(false);
    });

    it('should return false when rectA has zero height', function ()
    {
        var a = makeRect(0, 0, 100, 0);
        var b = makeRect(0, 0, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(false);
    });

    it('should return false when rectB has zero width', function ()
    {
        var a = makeRect(0, 0, 100, 100);
        var b = makeRect(0, 0, 0, 100);
        expect(RectangleToRectangle(a, b)).toBe(false);
    });

    it('should return false when rectB has zero height', function ()
    {
        var a = makeRect(0, 0, 100, 100);
        var b = makeRect(0, 0, 100, 0);
        expect(RectangleToRectangle(a, b)).toBe(false);
    });

    it('should return false when rectA has negative width', function ()
    {
        var a = makeRect(0, 0, -10, 100);
        var b = makeRect(0, 0, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(false);
    });

    it('should return false when rectA has negative height', function ()
    {
        var a = makeRect(0, 0, 100, -10);
        var b = makeRect(0, 0, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(false);
    });

    it('should return true when both rectangles are identical', function ()
    {
        var a = makeRect(10, 10, 50, 50);
        var b = makeRect(10, 10, 50, 50);
        expect(RectangleToRectangle(a, b)).toBe(true);
    });

    it('should return true when rectangles partially overlap with negative coordinates', function ()
    {
        var a = makeRect(-100, -100, 150, 150);
        var b = makeRect(-50, -50, 150, 150);
        expect(RectangleToRectangle(a, b)).toBe(true);
    });

    it('should return false when rectangles are separated with negative coordinates', function ()
    {
        var a = makeRect(-200, -200, 50, 50);
        var b = makeRect(0, 0, 50, 50);
        expect(RectangleToRectangle(a, b)).toBe(false);
    });

    it('should return a boolean value', function ()
    {
        var a = makeRect(0, 0, 100, 100);
        var b = makeRect(50, 50, 100, 100);
        expect(typeof RectangleToRectangle(a, b)).toBe('boolean');
    });

    it('should return true when one rectangle slightly overlaps the other', function ()
    {
        var a = makeRect(0, 0, 100, 100);
        var b = makeRect(99, 99, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(true);
    });

    it('should return false when gap is exactly 1 pixel', function ()
    {
        var a = makeRect(0, 0, 100, 100);
        var b = makeRect(101, 0, 100, 100);
        expect(RectangleToRectangle(a, b)).toBe(false);
    });
});
