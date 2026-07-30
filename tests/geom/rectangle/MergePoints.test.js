var MergePoints = require('../../../src/geom/rectangle/MergePoints');

describe('Phaser.Geom.Rectangle.MergePoints', function ()
{
    function makeRect (x, y, width, height)
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

    function makePoint (x, y)
    {
        return { x: x, y: y };
    }

    it('should return the target rectangle', function ()
    {
        var rect = makeRect(0, 0, 100, 100);
        var result = MergePoints(rect, []);

        expect(result).toBe(rect);
    });

    it('should not modify the rectangle when given an empty points array', function ()
    {
        var rect = makeRect(10, 20, 100, 50);
        MergePoints(rect, []);

        expect(rect.x).toBe(10);
        expect(rect.y).toBe(20);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(50);
    });

    it('should not modify the rectangle when all points are inside it', function ()
    {
        var rect = makeRect(0, 0, 100, 100);
        MergePoints(rect, [makePoint(25, 25), makePoint(50, 50), makePoint(75, 75)]);

        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(100);
    });

    it('should expand the rectangle to include a point to the left', function ()
    {
        var rect = makeRect(10, 0, 90, 100);
        MergePoints(rect, [makePoint(0, 50)]);

        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(100);
    });

    it('should expand the rectangle to include a point to the right', function ()
    {
        var rect = makeRect(0, 0, 90, 100);
        MergePoints(rect, [makePoint(100, 50)]);

        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(100);
    });

    it('should expand the rectangle to include a point above', function ()
    {
        var rect = makeRect(0, 10, 100, 90);
        MergePoints(rect, [makePoint(50, 0)]);

        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(100);
    });

    it('should expand the rectangle to include a point below', function ()
    {
        var rect = makeRect(0, 0, 100, 90);
        MergePoints(rect, [makePoint(50, 100)]);

        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(100);
    });

    it('should expand the rectangle in all directions simultaneously', function ()
    {
        var rect = makeRect(10, 10, 80, 80);
        MergePoints(rect, [makePoint(0, 0), makePoint(100, 100)]);

        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(100);
    });

    it('should handle multiple points and use the extreme values', function ()
    {
        var rect = makeRect(0, 0, 10, 10);
        MergePoints(rect, [makePoint(5, 5), makePoint(-20, 30), makePoint(50, -10), makePoint(100, 100)]);

        expect(rect.x).toBe(-20);
        expect(rect.y).toBe(-10);
        expect(rect.width).toBe(120);
        expect(rect.height).toBe(110);
    });

    it('should handle negative coordinate points', function ()
    {
        var rect = makeRect(-50, -50, 100, 100);
        MergePoints(rect, [makePoint(-100, -100), makePoint(100, 100)]);

        expect(rect.x).toBe(-100);
        expect(rect.y).toBe(-100);
        expect(rect.width).toBe(200);
        expect(rect.height).toBe(200);
    });

    it('should handle a single point outside the rectangle', function ()
    {
        var rect = makeRect(0, 0, 50, 50);
        MergePoints(rect, [makePoint(200, 300)]);

        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(200);
        expect(rect.height).toBe(300);
    });

    it('should handle floating point coordinates', function ()
    {
        var rect = makeRect(0, 0, 10, 10);
        MergePoints(rect, [makePoint(-0.5, -0.5), makePoint(10.5, 10.5)]);

        expect(rect.x).toBeCloseTo(-0.5);
        expect(rect.y).toBeCloseTo(-0.5);
        expect(rect.width).toBeCloseTo(11);
        expect(rect.height).toBeCloseTo(11);
    });

    it('should handle a point exactly on the rectangle border without changing bounds', function ()
    {
        var rect = makeRect(0, 0, 100, 100);
        MergePoints(rect, [makePoint(0, 0), makePoint(100, 100)]);

        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(100);
    });

    it('should handle a zero-size rectangle and expand it to fit all points', function ()
    {
        var rect = makeRect(50, 50, 0, 0);
        MergePoints(rect, [makePoint(0, 0), makePoint(100, 100)]);

        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(100);
    });

    it('should correctly set width and height based on merged bounds', function ()
    {
        var rect = makeRect(20, 30, 40, 50);
        MergePoints(rect, [makePoint(10, 20), makePoint(80, 100)]);

        expect(rect.x).toBe(10);
        expect(rect.y).toBe(20);
        expect(rect.width).toBe(70);
        expect(rect.height).toBe(80);
    });
});
