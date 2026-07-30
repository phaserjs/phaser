var ContainsPoint = require('../../../src/geom/circle/ContainsPoint');

describe('Phaser.Geom.Circle.ContainsPoint', function ()
{
    var circle;

    beforeEach(function ()
    {
        circle = { x: 0, y: 0, radius: 10, left: -10, right: 10, top: -10, bottom: 10 };
    });

    it('should return true when the point is at the center of the circle', function ()
    {
        var vec = { x: 0, y: 0 };
        expect(ContainsPoint(circle, vec)).toBe(true);
    });

    it('should return true when the point is inside the circle', function ()
    {
        var vec = { x: 5, y: 5 };
        expect(ContainsPoint(circle, vec)).toBe(true);
    });

    it('should return false when the point is outside the circle', function ()
    {
        var vec = { x: 20, y: 20 };
        expect(ContainsPoint(circle, vec)).toBe(false);
    });

    it('should return true when the point is exactly on the circumference', function ()
    {
        var vec = { x: 10, y: 0 };
        expect(ContainsPoint(circle, vec)).toBe(true);
    });

    it('should return true for a point just inside the circumference', function ()
    {
        var vec = { x: 9, y: 0 };
        expect(ContainsPoint(circle, vec)).toBe(true);
    });

    it('should return false for a point just outside the circumference', function ()
    {
        var vec = { x: 11, y: 0 };
        expect(ContainsPoint(circle, vec)).toBe(false);
    });

    it('should work with negative coordinates', function ()
    {
        var vec = { x: -5, y: -5 };
        expect(ContainsPoint(circle, vec)).toBe(true);
    });

    it('should work with a non-origin circle center', function ()
    {
        var offsetCircle = { x: 100, y: 100, radius: 10, left: 90, right: 110, top: 90, bottom: 110 };
        var inside = { x: 105, y: 105 };
        var outside = { x: 0, y: 0 };
        expect(ContainsPoint(offsetCircle, inside)).toBe(true);
        expect(ContainsPoint(offsetCircle, outside)).toBe(false);
    });

    it('should return false when the circle has zero radius', function ()
    {
        var zeroCircle = { x: 0, y: 0, radius: 0, left: 0, right: 0, top: 0, bottom: 0 };
        var vec = { x: 0, y: 0 };
        expect(ContainsPoint(zeroCircle, vec)).toBe(false);
    });

    it('should work with floating point coordinates', function ()
    {
        var vec = { x: 3.5, y: 4.5 };
        expect(ContainsPoint(circle, vec)).toBe(true);
    });

    it('should return false for a point far outside the circle', function ()
    {
        var vec = { x: 1000, y: 1000 };
        expect(ContainsPoint(circle, vec)).toBe(false);
    });
});
