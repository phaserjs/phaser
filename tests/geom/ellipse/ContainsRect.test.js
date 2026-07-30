var ContainsRect = require('../../../src/geom/ellipse/ContainsRect');

describe('Phaser.Geom.Ellipse.ContainsRect', function ()
{
    // Ellipse centered at (100, 100) with width=200, height=100
    // so semi-axes a=100, b=50
    var ellipse;

    beforeEach(function ()
    {
        ellipse = { x: 100, y: 100, width: 200, height: 100 };
    });

    it('should return true when the rectangle is fully inside the ellipse', function ()
    {
        // Small rect near center — all four corners well within the ellipse
        var rect = { x: 80, y: 90, right: 120, bottom: 110 };

        expect(ContainsRect(ellipse, rect)).toBe(true);
    });

    it('should return false when the rectangle extends outside the ellipse', function ()
    {
        // Rect that spans beyond the right edge of the ellipse
        var rect = { x: 0, y: 90, right: 200, bottom: 110 };

        expect(ContainsRect(ellipse, rect)).toBe(false);
    });

    it('should return false when only some corners are inside the ellipse', function ()
    {
        // Top-left corner inside, others outside
        var rect = { x: 90, y: 95, right: 195, bottom: 148 };

        expect(ContainsRect(ellipse, rect)).toBe(false);
    });

    it('should return false when the rectangle is entirely outside the ellipse', function ()
    {
        var rect = { x: 300, y: 300, right: 400, bottom: 400 };

        expect(ContainsRect(ellipse, rect)).toBe(false);
    });

    it('should return false when the ellipse has zero width', function ()
    {
        var zeroWidthEllipse = { x: 100, y: 100, width: 0, height: 100 };
        var rect = { x: 99, y: 99, right: 101, bottom: 101 };

        expect(ContainsRect(zeroWidthEllipse, rect)).toBe(false);
    });

    it('should return false when the ellipse has zero height', function ()
    {
        var zeroHeightEllipse = { x: 100, y: 100, width: 200, height: 0 };
        var rect = { x: 99, y: 99, right: 101, bottom: 101 };

        expect(ContainsRect(zeroHeightEllipse, rect)).toBe(false);
    });

    it('should return false when the ellipse has negative width', function ()
    {
        var negEllipse = { x: 100, y: 100, width: -200, height: 100 };
        var rect = { x: 99, y: 99, right: 101, bottom: 101 };

        expect(ContainsRect(negEllipse, rect)).toBe(false);
    });

    it('should return false when the ellipse has negative height', function ()
    {
        var negEllipse = { x: 100, y: 100, width: 200, height: -100 };
        var rect = { x: 99, y: 99, right: 101, bottom: 101 };

        expect(ContainsRect(negEllipse, rect)).toBe(false);
    });

    it('should return true when the rectangle is a single point at the ellipse center', function ()
    {
        // Degenerate rect: all four corners at the center
        var rect = { x: 100, y: 100, right: 100, bottom: 100 };

        expect(ContainsRect(ellipse, rect)).toBe(true);
    });

    it('should return false when a corner lies exactly on the ellipse boundary', function ()
    {
        // On the boundary, normx+normy === 0.25, which is NOT < 0.25
        // Right edge of ellipse: x=200, y=100 (center) → normx=(200-100)/200=0.5, normy=0 → 0.25+0=0.25
        var rect = { x: 100, y: 100, right: 200, bottom: 100 };

        expect(ContainsRect(ellipse, rect)).toBe(false);
    });

    it('should work with a rectangle provided as a plain object with required properties', function ()
    {
        var plainRect = { x: 95, y: 97, right: 105, bottom: 103 };

        expect(ContainsRect(ellipse, plainRect)).toBe(true);
    });

    it('should return false when rectangle bottom-right corner is outside the ellipse', function ()
    {
        // Top-left is fine but bottom-right escapes
        var rect = { x: 98, y: 98, right: 180, bottom: 148 };

        expect(ContainsRect(ellipse, rect)).toBe(false);
    });
});
