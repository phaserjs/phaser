var Contains = require('../../../src/geom/circle/Contains');

describe('Phaser.Geom.Circle.Contains', function ()
{
    var circle;

    beforeEach(function ()
    {
        circle = { x: 0, y: 0, radius: 10, left: -10, right: 10, top: -10, bottom: 10 };
    });

    it('should return true for the center point', function ()
    {
        expect(Contains(circle, 0, 0)).toBe(true);
    });

    it('should return true for a point inside the circle', function ()
    {
        expect(Contains(circle, 5, 5)).toBe(true);
    });

    it('should return true for a point on the circumference', function ()
    {
        expect(Contains(circle, 10, 0)).toBe(true);
        expect(Contains(circle, -10, 0)).toBe(true);
        expect(Contains(circle, 0, 10)).toBe(true);
        expect(Contains(circle, 0, -10)).toBe(true);
    });

    it('should return false for a point outside the circle', function ()
    {
        expect(Contains(circle, 20, 0)).toBe(false);
        expect(Contains(circle, 0, 20)).toBe(false);
        expect(Contains(circle, -20, 0)).toBe(false);
        expect(Contains(circle, 0, -20)).toBe(false);
    });

    it('should return false for a point outside the bounding box', function ()
    {
        expect(Contains(circle, 11, 0)).toBe(false);
        expect(Contains(circle, -11, 0)).toBe(false);
        expect(Contains(circle, 0, 11)).toBe(false);
        expect(Contains(circle, 0, -11)).toBe(false);
    });

    it('should return false for a point in the bounding box corners but outside the circle', function ()
    {
        expect(Contains(circle, 8, 8)).toBe(false);
        expect(Contains(circle, -8, 8)).toBe(false);
        expect(Contains(circle, 8, -8)).toBe(false);
        expect(Contains(circle, -8, -8)).toBe(false);
    });

    it('should return false when radius is zero', function ()
    {
        circle.radius = 0;
        expect(Contains(circle, 0, 0)).toBe(false);
    });

    it('should return false when radius is negative', function ()
    {
        circle.radius = -5;
        expect(Contains(circle, 0, 0)).toBe(false);
    });

    it('should work with a non-origin center', function ()
    {
        var c = { x: 50, y: 50, radius: 10, left: 40, right: 60, top: 40, bottom: 60 };
        expect(Contains(c, 50, 50)).toBe(true);
        expect(Contains(c, 55, 50)).toBe(true);
        expect(Contains(c, 60, 50)).toBe(true);
        expect(Contains(c, 61, 50)).toBe(false);
        expect(Contains(c, 50, 61)).toBe(false);
    });

    it('should return false for a point exactly on the bounding box edge that is outside the circle', function ()
    {
        expect(Contains(circle, 10, 10)).toBe(false);
        expect(Contains(circle, -10, -10)).toBe(false);
    });

    it('should work with floating point coordinates', function ()
    {
        expect(Contains(circle, 7.07, 7.07)).toBe(true);
        expect(Contains(circle, 5.5, 5.5)).toBe(true);
    });

    it('should work with a large radius', function ()
    {
        var c = { x: 0, y: 0, radius: 1000, left: -1000, right: 1000, top: -1000, bottom: 1000 };
        expect(Contains(c, 500, 500)).toBe(true);
        expect(Contains(c, 999, 0)).toBe(true);
        expect(Contains(c, 1001, 0)).toBe(false);
    });

    it('should work with a fractional radius', function ()
    {
        var c = { x: 0, y: 0, radius: 0.5, left: -0.5, right: 0.5, top: -0.5, bottom: 0.5 };
        expect(Contains(c, 0, 0)).toBe(true);
        expect(Contains(c, 0.4, 0)).toBe(true);
        expect(Contains(c, 0.6, 0)).toBe(false);
    });
});
