var LineToRectangle = require('../../../src/geom/intersects/LineToRectangle');

describe('Phaser.Geom.Intersects.LineToRectangle', function ()
{
    var rect;

    beforeEach(function ()
    {
        // Rectangle from (10,10) to (50,50)
        rect = { x: 10, y: 10, right: 50, bottom: 50 };
    });

    // --- Start or end point inside the rectangle ---

    it('should return true when the line start point is inside the rectangle', function ()
    {
        var line = { x1: 20, y1: 20, x2: 80, y2: 80 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when the line end point is inside the rectangle', function ()
    {
        var line = { x1: 80, y1: 80, x2: 20, y2: 20 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when both endpoints are inside the rectangle', function ()
    {
        var line = { x1: 15, y1: 15, x2: 45, y2: 45 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when start point is on the left edge of the rectangle', function ()
    {
        var line = { x1: 10, y1: 30, x2: 80, y2: 30 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when start point is on the right edge of the rectangle', function ()
    {
        var line = { x1: 50, y1: 30, x2: 80, y2: 30 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when start point is on the top edge of the rectangle', function ()
    {
        var line = { x1: 30, y1: 10, x2: 30, y2: 80 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when start point is on the bottom edge of the rectangle', function ()
    {
        var line = { x1: 30, y1: 50, x2: 80, y2: 80 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when end point is on a rectangle corner', function ()
    {
        var line = { x1: 80, y1: 80, x2: 10, y2: 10 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    // --- Line completely outside the rectangle ---

    it('should return false when the line is entirely to the left of the rectangle', function ()
    {
        var line = { x1: 0, y1: 20, x2: 5, y2: 40 };
        expect(LineToRectangle(line, rect)).toBe(false);
    });

    it('should return false when the line is entirely to the right of the rectangle', function ()
    {
        var line = { x1: 60, y1: 20, x2: 80, y2: 40 };
        expect(LineToRectangle(line, rect)).toBe(false);
    });

    it('should return false when the line is entirely above the rectangle', function ()
    {
        var line = { x1: 20, y1: 0, x2: 40, y2: 5 };
        expect(LineToRectangle(line, rect)).toBe(false);
    });

    it('should return false when the line is entirely below the rectangle', function ()
    {
        var line = { x1: 20, y1: 60, x2: 40, y2: 80 };
        expect(LineToRectangle(line, rect)).toBe(false);
    });

    it('should return false when the line passes above the rectangle diagonally', function ()
    {
        var line = { x1: 0, y1: 0, x2: 100, y2: 5 };
        expect(LineToRectangle(line, rect)).toBe(false);
    });

    it('should return false when the line passes below the rectangle diagonally', function ()
    {
        var line = { x1: 0, y1: 60, x2: 100, y2: 80 };
        expect(LineToRectangle(line, rect)).toBe(false);
    });

    // --- Line crossing individual edges ---

    it('should return true when the line crosses the left edge', function ()
    {
        var line = { x1: 0, y1: 30, x2: 30, y2: 30 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when the line crosses the right edge', function ()
    {
        var line = { x1: 80, y1: 30, x2: 30, y2: 30 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when the line crosses the top edge', function ()
    {
        var line = { x1: 30, y1: 0, x2: 30, y2: 30 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when the line crosses the bottom edge', function ()
    {
        var line = { x1: 30, y1: 80, x2: 30, y2: 30 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    // --- Line passing completely through the rectangle ---

    it('should return true when the line passes through horizontally', function ()
    {
        var line = { x1: 0, y1: 30, x2: 80, y2: 30 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when the line passes through vertically', function ()
    {
        var line = { x1: 30, y1: 0, x2: 30, y2: 80 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when the line passes through diagonally', function ()
    {
        var line = { x1: 0, y1: 0, x2: 80, y2: 80 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when the line passes through at a steep angle from top-left to bottom-right', function ()
    {
        var line = { x1: 5, y1: 0, x2: 15, y2: 80 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    // --- Line approaches but does not reach the rectangle ---

    it('should return false when the line points toward the rectangle but ends before it', function ()
    {
        var line = { x1: 0, y1: 30, x2: 8, y2: 30 };
        expect(LineToRectangle(line, rect)).toBe(false);
    });

    it('should return false when the line points toward the rectangle from above but ends before it', function ()
    {
        var line = { x1: 30, y1: 0, x2: 30, y2: 8 };
        expect(LineToRectangle(line, rect)).toBe(false);
    });

    // --- Zero-length line (point) ---

    it('should return true when a zero-length line is inside the rectangle', function ()
    {
        var line = { x1: 30, y1: 30, x2: 30, y2: 30 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return false when a zero-length line is outside the rectangle', function ()
    {
        var line = { x1: 5, y1: 5, x2: 5, y2: 5 };
        expect(LineToRectangle(line, rect)).toBe(false);
    });

    // --- Rectangle-like plain objects ---

    it('should work with a plain rect-like object', function ()
    {
        var rectLike = { x: 0, y: 0, right: 100, bottom: 100 };
        var line = { x1: 50, y1: 50, x2: 200, y2: 200 };
        expect(LineToRectangle(line, rectLike)).toBe(true);
    });

    it('should return false for a line that misses a plain rect-like object', function ()
    {
        var rectLike = { x: 0, y: 0, right: 100, bottom: 100 };
        var line = { x1: 150, y1: 0, x2: 150, y2: 200 };
        expect(LineToRectangle(line, rectLike)).toBe(false);
    });

    // --- Large rectangle (full coverage) ---

    it('should return true when the line is entirely inside a large rectangle', function ()
    {
        var bigRect = { x: -1000, y: -1000, right: 1000, bottom: 1000 };
        var line = { x1: -500, y1: -500, x2: 500, y2: 500 };
        expect(LineToRectangle(line, bigRect)).toBe(true);
    });

    // --- Negative coordinates ---

    it('should handle rectangles and lines with negative coordinates', function ()
    {
        var negRect = { x: -50, y: -50, right: -10, bottom: -10 };
        var line = { x1: -30, y1: -30, x2: 0, y2: 0 };
        expect(LineToRectangle(line, negRect)).toBe(true);
    });

    it('should return false when line misses a rectangle with negative coordinates', function ()
    {
        var negRect = { x: -50, y: -50, right: -10, bottom: -10 };
        var line = { x1: 0, y1: 0, x2: 50, y2: 50 };
        expect(LineToRectangle(line, negRect)).toBe(false);
    });

    // --- Crossing from right to left / bottom to top ---

    it('should return true when the line crosses the right edge going left to right (x1 > bx2, x2 <= bx2)', function ()
    {
        var line = { x1: 60, y1: 30, x2: 40, y2: 30 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    it('should return true when the line crosses the bottom edge going bottom to top (y1 > bottom, y2 <= bottom)', function ()
    {
        var line = { x1: 30, y1: 60, x2: 30, y2: 40 };
        expect(LineToRectangle(line, rect)).toBe(true);
    });

    // --- Line exactly aligned with edges (outside the rectangle) ---

    it('should return false for a horizontal line passing exactly above the rectangle', function ()
    {
        var line = { x1: 0, y1: 9, x2: 100, y2: 9 };
        expect(LineToRectangle(line, rect)).toBe(false);
    });

    it('should return false for a vertical line passing exactly to the left of the rectangle', function ()
    {
        var line = { x1: 9, y1: 0, x2: 9, y2: 100 };
        expect(LineToRectangle(line, rect)).toBe(false);
    });
});
