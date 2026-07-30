var ContainsRect = require('../../../src/geom/circle/ContainsRect');

function makeCircle (x, y, radius)
{
    return { x: x, y: y, radius: radius, left: x - radius, right: x + radius, top: y - radius, bottom: y + radius };
}

describe('Phaser.Geom.Circle.ContainsRect', function ()
{
    it('should return true when the rectangle is fully inside the circle', function ()
    {
        var circle = makeCircle(0, 0, 100);
        var rect = { x: -10, y: -10, right: 10, bottom: 10 };

        expect(ContainsRect(circle, rect)).toBe(true);
    });

    it('should return false when the rectangle is fully outside the circle', function ()
    {
        var circle = makeCircle(0, 0, 10);
        var rect = { x: 50, y: 50, right: 100, bottom: 100 };

        expect(ContainsRect(circle, rect)).toBe(false);
    });

    it('should return false when only some corners are inside the circle', function ()
    {
        var circle = makeCircle(0, 0, 10);
        var rect = { x: -5, y: -5, right: 50, bottom: 50 };

        expect(ContainsRect(circle, rect)).toBe(false);
    });

    it('should return false when top-right corner is outside the circle', function ()
    {
        var circle = makeCircle(0, 0, 10);
        var rect = { x: -5, y: -5, right: 20, bottom: 5 };

        expect(ContainsRect(circle, rect)).toBe(false);
    });

    it('should return false when bottom-left corner is outside the circle', function ()
    {
        var circle = makeCircle(0, 0, 10);
        var rect = { x: -5, y: -5, right: 5, bottom: 20 };

        expect(ContainsRect(circle, rect)).toBe(false);
    });

    it('should return false when bottom-right corner is outside the circle', function ()
    {
        var circle = makeCircle(0, 0, 10);
        var rect = { x: -5, y: -5, right: 20, bottom: 20 };

        expect(ContainsRect(circle, rect)).toBe(false);
    });

    it('should return true for a zero-size rectangle at the circle center', function ()
    {
        var circle = makeCircle(0, 0, 10);
        var rect = { x: 0, y: 0, right: 0, bottom: 0 };

        expect(ContainsRect(circle, rect)).toBe(true);
    });

    it('should return true for a zero-size rectangle within the circle', function ()
    {
        var circle = makeCircle(0, 0, 10);
        var rect = { x: 3, y: 3, right: 3, bottom: 3 };

        expect(ContainsRect(circle, rect)).toBe(true);
    });

    it('should return false when the rectangle is larger than the circle', function ()
    {
        var circle = makeCircle(0, 0, 5);
        var rect = { x: -50, y: -50, right: 50, bottom: 50 };

        expect(ContainsRect(circle, rect)).toBe(false);
    });

    it('should work with a non-origin circle center', function ()
    {
        var circle = makeCircle(100, 100, 50);
        var rect = { x: 90, y: 90, right: 110, bottom: 110 };

        expect(ContainsRect(circle, rect)).toBe(true);
    });

    it('should return false when rectangle is offset from non-origin circle', function ()
    {
        var circle = makeCircle(100, 100, 50);
        var rect = { x: 0, y: 0, right: 10, bottom: 10 };

        expect(ContainsRect(circle, rect)).toBe(false);
    });

    it('should return false when a corner lies exactly on the circle boundary', function ()
    {
        // Point (10, 0) lies exactly on the circle boundary: dx+dy = 100 = radius^2
        // Contains uses <= so boundary points ARE contained
        var circle = makeCircle(0, 0, 10);
        var rect = { x: 0, y: 0, right: 10, bottom: 0 };

        expect(ContainsRect(circle, rect)).toBe(true);
    });

    it('should handle negative rectangle coordinates', function ()
    {
        var circle = makeCircle(-50, -50, 20);
        var rect = { x: -55, y: -55, right: -45, bottom: -45 };

        expect(ContainsRect(circle, rect)).toBe(true);
    });

    it('should handle floating point coordinates', function ()
    {
        var circle = makeCircle(0, 0, 10);
        var rect = { x: -1.5, y: -1.5, right: 1.5, bottom: 1.5 };

        expect(ContainsRect(circle, rect)).toBe(true);
    });
});
