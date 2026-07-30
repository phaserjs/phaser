var MergeXY = require('../../../src/geom/rectangle/MergeXY');

function makeRect(x, y, width, height)
{
    return {
        x: x,
        y: y,
        width: width,
        height: height,
        get right() { return this.x + this.width; },
        get bottom() { return this.y + this.height; }
    };
}

describe('Phaser.Geom.Rectangle.MergeXY', function ()
{
    it('should return the target rectangle', function ()
    {
        var rect = makeRect(0, 0, 100, 100);
        var result = MergeXY(rect, 50, 50);
        expect(result).toBe(rect);
    });

    it('should not change rectangle when point is already inside', function ()
    {
        var rect = makeRect(0, 0, 100, 100);
        MergeXY(rect, 50, 50);
        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(100);
    });

    it('should expand left when point x is less than rect x', function ()
    {
        var rect = makeRect(10, 0, 100, 100);
        MergeXY(rect, 0, 50);
        expect(rect.x).toBe(0);
        expect(rect.width).toBe(110);
        expect(rect.y).toBe(0);
        expect(rect.height).toBe(100);
    });

    it('should expand right when point x is greater than rect right', function ()
    {
        var rect = makeRect(0, 0, 100, 100);
        MergeXY(rect, 150, 50);
        expect(rect.x).toBe(0);
        expect(rect.width).toBe(150);
    });

    it('should expand upward when point y is less than rect y', function ()
    {
        var rect = makeRect(0, 10, 100, 100);
        MergeXY(rect, 50, 0);
        expect(rect.y).toBe(0);
        expect(rect.height).toBe(110);
        expect(rect.x).toBe(0);
        expect(rect.width).toBe(100);
    });

    it('should expand downward when point y is greater than rect bottom', function ()
    {
        var rect = makeRect(0, 0, 100, 100);
        MergeXY(rect, 50, 150);
        expect(rect.y).toBe(0);
        expect(rect.height).toBe(150);
    });

    it('should expand in all directions when point is outside on both axes', function ()
    {
        var rect = makeRect(10, 10, 80, 80);
        MergeXY(rect, 0, 0);
        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(90);
        expect(rect.height).toBe(90);
    });

    it('should handle point at exact rect origin', function ()
    {
        var rect = makeRect(0, 0, 100, 100);
        MergeXY(rect, 0, 0);
        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(100);
    });

    it('should handle point at exact rect right/bottom corner', function ()
    {
        var rect = makeRect(0, 0, 100, 100);
        MergeXY(rect, 100, 100);
        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(100);
    });

    it('should handle negative coordinates', function ()
    {
        var rect = makeRect(-50, -50, 100, 100);
        MergeXY(rect, -100, -100);
        expect(rect.x).toBe(-100);
        expect(rect.y).toBe(-100);
        expect(rect.width).toBe(150);
        expect(rect.height).toBe(150);
    });

    it('should handle negative point with positive rectangle', function ()
    {
        var rect = makeRect(0, 0, 100, 100);
        MergeXY(rect, -50, -50);
        expect(rect.x).toBe(-50);
        expect(rect.y).toBe(-50);
        expect(rect.width).toBe(150);
        expect(rect.height).toBe(150);
    });

    it('should handle floating point coordinates', function ()
    {
        var rect = makeRect(0, 0, 10, 10);
        MergeXY(rect, 15.5, 12.3);
        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBeCloseTo(15.5);
        expect(rect.height).toBeCloseTo(12.3);
    });

    it('should handle a zero-size rectangle', function ()
    {
        var rect = makeRect(5, 5, 0, 0);
        MergeXY(rect, 10, 10);
        expect(rect.x).toBe(5);
        expect(rect.y).toBe(5);
        expect(rect.width).toBe(5);
        expect(rect.height).toBe(5);
    });

    it('should handle a zero-size rectangle merged with a point to the left/above', function ()
    {
        var rect = makeRect(5, 5, 0, 0);
        MergeXY(rect, 0, 0);
        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(5);
        expect(rect.height).toBe(5);
    });

    it('should correctly set width as maxX minus minX', function ()
    {
        var rect = makeRect(20, 20, 60, 60);
        MergeXY(rect, 5, 50);
        expect(rect.x).toBe(5);
        expect(rect.width).toBe(75);
    });

    it('should correctly set height as maxY minus minY', function ()
    {
        var rect = makeRect(20, 20, 60, 60);
        MergeXY(rect, 50, 5);
        expect(rect.y).toBe(5);
        expect(rect.height).toBe(75);
    });
});
