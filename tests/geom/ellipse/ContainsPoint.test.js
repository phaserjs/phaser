var ContainsPoint = require('../../../src/geom/ellipse/ContainsPoint');

describe('Phaser.Geom.Ellipse.ContainsPoint', function ()
{
    var ellipse;

    beforeEach(function ()
    {
        ellipse = { x: 0, y: 0, width: 100, height: 100 };
    });

    it('should return true when the point is at the center of the ellipse', function ()
    {
        var vec = { x: 0, y: 0 };
        expect(ContainsPoint(ellipse, vec)).toBe(true);
    });

    it('should return true when the point is clearly inside the ellipse', function ()
    {
        var vec = { x: 10, y: 10 };
        expect(ContainsPoint(ellipse, vec)).toBe(true);
    });

    it('should return false when the point is outside the ellipse', function ()
    {
        var vec = { x: 100, y: 100 };
        expect(ContainsPoint(ellipse, vec)).toBe(false);
    });

    it('should return false when the point is on the boundary of the ellipse', function ()
    {
        // Exactly on the boundary: normx + normy = 0.25, which is NOT < 0.25
        var vec = { x: 50, y: 0 };
        expect(ContainsPoint(ellipse, vec)).toBe(false);
    });

    it('should return false when the ellipse has zero width', function ()
    {
        ellipse.width = 0;
        var vec = { x: 0, y: 0 };
        expect(ContainsPoint(ellipse, vec)).toBe(false);
    });

    it('should return false when the ellipse has zero height', function ()
    {
        ellipse.height = 0;
        var vec = { x: 0, y: 0 };
        expect(ContainsPoint(ellipse, vec)).toBe(false);
    });

    it('should return false when the ellipse has negative width', function ()
    {
        ellipse.width = -100;
        var vec = { x: 0, y: 0 };
        expect(ContainsPoint(ellipse, vec)).toBe(false);
    });

    it('should return false when the ellipse has negative height', function ()
    {
        ellipse.height = -100;
        var vec = { x: 0, y: 0 };
        expect(ContainsPoint(ellipse, vec)).toBe(false);
    });

    it('should work with a non-origin ellipse center', function ()
    {
        ellipse.x = 200;
        ellipse.y = 200;
        var inside = { x: 200, y: 200 };
        var outside = { x: 0, y: 0 };
        expect(ContainsPoint(ellipse, inside)).toBe(true);
        expect(ContainsPoint(ellipse, outside)).toBe(false);
    });

    it('should work with a non-circular ellipse', function ()
    {
        ellipse.width = 200;
        ellipse.height = 100;
        var insideWide = { x: 80, y: 0 };
        var outsideTall = { x: 0, y: 60 };
        expect(ContainsPoint(ellipse, insideWide)).toBe(true);
        expect(ContainsPoint(ellipse, outsideTall)).toBe(false);
    });

    it('should return true for a point just inside the boundary', function ()
    {
        // Just inside along x-axis: x slightly less than half-width from center
        var vec = { x: 49, y: 0 };
        expect(ContainsPoint(ellipse, vec)).toBe(true);
    });

    it('should return false for a point just outside the boundary', function ()
    {
        var vec = { x: 51, y: 0 };
        expect(ContainsPoint(ellipse, vec)).toBe(false);
    });

    it('should use vec.x and vec.y coordinates from the vector object', function ()
    {
        var vec = { x: 0, y: 0, z: 999 };
        expect(ContainsPoint(ellipse, vec)).toBe(true);
    });

    it('should return false for a point far outside the ellipse', function ()
    {
        var vec = { x: 1000, y: 1000 };
        expect(ContainsPoint(ellipse, vec)).toBe(false);
    });

    it('should handle negative point coordinates', function ()
    {
        var inside = { x: -10, y: -10 };
        var outside = { x: -100, y: -100 };
        expect(ContainsPoint(ellipse, inside)).toBe(true);
        expect(ContainsPoint(ellipse, outside)).toBe(false);
    });

    it('should handle floating point vector coordinates', function ()
    {
        var vec = { x: 0.5, y: 0.5 };
        expect(ContainsPoint(ellipse, vec)).toBe(true);
    });
});
