var Contains = require('../../../src/geom/ellipse/Contains');

describe('Phaser.Geom.Ellipse.Contains', function ()
{
    var ellipse;

    beforeEach(function ()
    {
        ellipse = { x: 0, y: 0, width: 100, height: 50 };
    });

    it('should return false when ellipse width is zero', function ()
    {
        ellipse.width = 0;
        expect(Contains(ellipse, 0, 0)).toBe(false);
    });

    it('should return false when ellipse height is zero', function ()
    {
        ellipse.height = 0;
        expect(Contains(ellipse, 0, 0)).toBe(false);
    });

    it('should return false when ellipse width is negative', function ()
    {
        ellipse.width = -10;
        expect(Contains(ellipse, 0, 0)).toBe(false);
    });

    it('should return false when ellipse height is negative', function ()
    {
        ellipse.height = -10;
        expect(Contains(ellipse, 0, 0)).toBe(false);
    });

    it('should return true for the center point of the ellipse', function ()
    {
        expect(Contains(ellipse, 0, 0)).toBe(true);
    });

    it('should return true for a point clearly inside the ellipse', function ()
    {
        expect(Contains(ellipse, 10, 5)).toBe(true);
    });

    it('should return false for a point clearly outside the ellipse', function ()
    {
        expect(Contains(ellipse, 200, 200)).toBe(false);
    });

    it('should return false for a point on the ellipse boundary', function ()
    {
        // At the edge: normx = 0.5, normy = 0, normx^2 + normy^2 = 0.25, not < 0.25
        expect(Contains(ellipse, 50, 0)).toBe(false);
    });

    it('should return false for a point just outside the ellipse', function ()
    {
        expect(Contains(ellipse, 51, 0)).toBe(false);
    });

    it('should return true for a point just inside the ellipse', function ()
    {
        expect(Contains(ellipse, 49, 0)).toBe(true);
    });

    it('should work with a non-origin ellipse center', function ()
    {
        ellipse.x = 100;
        ellipse.y = 100;
        expect(Contains(ellipse, 100, 100)).toBe(true);
        expect(Contains(ellipse, 0, 0)).toBe(false);
    });

    it('should return true for center of non-origin ellipse', function ()
    {
        ellipse.x = 50;
        ellipse.y = 50;
        expect(Contains(ellipse, 50, 50)).toBe(true);
    });

    it('should handle a circular ellipse (equal width and height)', function ()
    {
        ellipse.width = 100;
        ellipse.height = 100;
        expect(Contains(ellipse, 0, 0)).toBe(true);
        expect(Contains(ellipse, 49, 0)).toBe(true);
        expect(Contains(ellipse, 50, 0)).toBe(false);
        expect(Contains(ellipse, 0, 49)).toBe(true);
        expect(Contains(ellipse, 0, 50)).toBe(false);
    });

    it('should handle floating point coordinates inside the ellipse', function ()
    {
        expect(Contains(ellipse, 10.5, 5.5)).toBe(true);
    });

    it('should handle floating point coordinates outside the ellipse', function ()
    {
        expect(Contains(ellipse, 50.1, 0)).toBe(false);
    });

    it('should return true for negative coordinates inside the ellipse', function ()
    {
        expect(Contains(ellipse, -10, -5)).toBe(true);
    });

    it('should return false for negative coordinates outside the ellipse', function ()
    {
        expect(Contains(ellipse, -51, 0)).toBe(false);
    });

    it('should correctly handle a very small ellipse', function ()
    {
        ellipse.width = 2;
        ellipse.height = 2;
        expect(Contains(ellipse, 0, 0)).toBe(true);
        expect(Contains(ellipse, 1, 0)).toBe(false);
    });

    it('should correctly handle a very large ellipse', function ()
    {
        ellipse.width = 10000;
        ellipse.height = 10000;
        expect(Contains(ellipse, 4999, 0)).toBe(true);
        expect(Contains(ellipse, 5001, 0)).toBe(false);
    });

    it('should return false for points on the x-axis boundary of a tall narrow ellipse', function ()
    {
        ellipse.width = 10;
        ellipse.height = 200;
        expect(Contains(ellipse, 5, 0)).toBe(false);
        expect(Contains(ellipse, 4, 0)).toBe(true);
    });

    it('should return false for points on the y-axis boundary of a wide flat ellipse', function ()
    {
        ellipse.width = 200;
        ellipse.height = 10;
        expect(Contains(ellipse, 0, 5)).toBe(false);
        expect(Contains(ellipse, 0, 4)).toBe(true);
    });
});
