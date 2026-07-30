var MergeRect = require('../../../src/geom/rectangle/MergeRect');

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

describe('Phaser.Geom.Rectangle.MergeRect', function ()
{
    it('should return the target rectangle', function ()
    {
        var target = makeRect(0, 0, 100, 100);
        var source = makeRect(50, 50, 100, 100);
        var result = MergeRect(target, source);

        expect(result).toBe(target);
    });

    it('should expand target to include source when source extends right and down', function ()
    {
        var target = makeRect(0, 0, 100, 100);
        var source = makeRect(50, 50, 100, 100);
        MergeRect(target, source);

        expect(target.x).toBe(0);
        expect(target.y).toBe(0);
        expect(target.width).toBe(150);
        expect(target.height).toBe(150);
    });

    it('should expand target to include source when source extends left and up', function ()
    {
        var target = makeRect(50, 50, 100, 100);
        var source = makeRect(0, 0, 60, 60);
        MergeRect(target, source);

        expect(target.x).toBe(0);
        expect(target.y).toBe(0);
        expect(target.width).toBe(150);
        expect(target.height).toBe(150);
    });

    it('should not modify target when source is fully inside target', function ()
    {
        var target = makeRect(0, 0, 200, 200);
        var source = makeRect(50, 50, 50, 50);
        MergeRect(target, source);

        expect(target.x).toBe(0);
        expect(target.y).toBe(0);
        expect(target.width).toBe(200);
        expect(target.height).toBe(200);
    });

    it('should expand target to fully contain source when source is larger', function ()
    {
        var target = makeRect(50, 50, 50, 50);
        var source = makeRect(0, 0, 200, 200);
        MergeRect(target, source);

        expect(target.x).toBe(0);
        expect(target.y).toBe(0);
        expect(target.width).toBe(200);
        expect(target.height).toBe(200);
    });

    it('should handle source extending only to the right', function ()
    {
        var target = makeRect(0, 0, 100, 100);
        var source = makeRect(0, 0, 200, 100);
        MergeRect(target, source);

        expect(target.x).toBe(0);
        expect(target.y).toBe(0);
        expect(target.width).toBe(200);
        expect(target.height).toBe(100);
    });

    it('should handle source extending only downward', function ()
    {
        var target = makeRect(0, 0, 100, 100);
        var source = makeRect(0, 0, 100, 200);
        MergeRect(target, source);

        expect(target.x).toBe(0);
        expect(target.y).toBe(0);
        expect(target.width).toBe(100);
        expect(target.height).toBe(200);
    });

    it('should handle two identical rectangles', function ()
    {
        var target = makeRect(10, 20, 100, 80);
        var source = makeRect(10, 20, 100, 80);
        MergeRect(target, source);

        expect(target.x).toBe(10);
        expect(target.y).toBe(20);
        expect(target.width).toBe(100);
        expect(target.height).toBe(80);
    });

    it('should handle non-overlapping rectangles separated horizontally', function ()
    {
        var target = makeRect(0, 0, 50, 50);
        var source = makeRect(100, 0, 50, 50);
        MergeRect(target, source);

        expect(target.x).toBe(0);
        expect(target.y).toBe(0);
        expect(target.width).toBe(150);
        expect(target.height).toBe(50);
    });

    it('should handle non-overlapping rectangles separated vertically', function ()
    {
        var target = makeRect(0, 0, 50, 50);
        var source = makeRect(0, 100, 50, 50);
        MergeRect(target, source);

        expect(target.x).toBe(0);
        expect(target.y).toBe(0);
        expect(target.width).toBe(50);
        expect(target.height).toBe(150);
    });

    it('should handle rectangles with negative coordinates', function ()
    {
        var target = makeRect(-50, -50, 100, 100);
        var source = makeRect(-100, -100, 80, 80);
        MergeRect(target, source);

        expect(target.x).toBe(-100);
        expect(target.y).toBe(-100);
        expect(target.width).toBe(150);
        expect(target.height).toBe(150);
    });

    it('should handle zero-size source rectangle', function ()
    {
        var target = makeRect(0, 0, 100, 100);
        var source = makeRect(50, 50, 0, 0);
        MergeRect(target, source);

        expect(target.x).toBe(0);
        expect(target.y).toBe(0);
        expect(target.width).toBe(100);
        expect(target.height).toBe(100);
    });

    it('should handle zero-size target rectangle being expanded by source', function ()
    {
        var target = makeRect(0, 0, 0, 0);
        var source = makeRect(10, 20, 100, 80);
        MergeRect(target, source);

        expect(target.x).toBe(0);
        expect(target.y).toBe(0);
        expect(target.width).toBe(110);
        expect(target.height).toBe(100);
    });

    it('should handle floating point coordinates', function ()
    {
        var target = makeRect(0.5, 0.5, 10.5, 10.5);
        var source = makeRect(5.5, 5.5, 10.5, 10.5);
        MergeRect(target, source);

        expect(target.x).toBeCloseTo(0.5);
        expect(target.y).toBeCloseTo(0.5);
        expect(target.width).toBeCloseTo(15.5);
        expect(target.height).toBeCloseTo(15.5);
    });

    it('should modify only target x and width when source is adjacent to the right', function ()
    {
        var target = makeRect(0, 0, 100, 100);
        var source = makeRect(100, 0, 100, 100);
        MergeRect(target, source);

        expect(target.x).toBe(0);
        expect(target.y).toBe(0);
        expect(target.width).toBe(200);
        expect(target.height).toBe(100);
    });

    it('should correctly set x when source starts further left than target', function ()
    {
        var target = makeRect(100, 100, 50, 50);
        var source = makeRect(10, 100, 50, 50);
        MergeRect(target, source);

        expect(target.x).toBe(10);
        expect(target.width).toBe(140);
    });

    it('should correctly set y when source starts higher than target', function ()
    {
        var target = makeRect(100, 100, 50, 50);
        var source = makeRect(100, 10, 50, 50);
        MergeRect(target, source);

        expect(target.y).toBe(10);
        expect(target.height).toBe(140);
    });
});
