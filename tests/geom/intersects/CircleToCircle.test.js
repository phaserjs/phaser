var CircleToCircle = require('../../../src/geom/intersects/CircleToCircle');

describe('Phaser.Geom.Intersects.CircleToCircle', function ()
{
    it('should return true when two circles overlap', function ()
    {
        var circleA = { x: 0, y: 0, radius: 10 };
        var circleB = { x: 5, y: 0, radius: 10 };

        expect(CircleToCircle(circleA, circleB)).toBe(true);
    });

    it('should return true when two circles are tangent (touching at exactly one point)', function ()
    {
        var circleA = { x: 0, y: 0, radius: 10 };
        var circleB = { x: 20, y: 0, radius: 10 };

        expect(CircleToCircle(circleA, circleB)).toBe(true);
    });

    it('should return false when two circles do not intersect', function ()
    {
        var circleA = { x: 0, y: 0, radius: 10 };
        var circleB = { x: 100, y: 0, radius: 10 };

        expect(CircleToCircle(circleA, circleB)).toBe(false);
    });

    it('should return true when circles are concentric (same center)', function ()
    {
        var circleA = { x: 0, y: 0, radius: 5 };
        var circleB = { x: 0, y: 0, radius: 10 };

        expect(CircleToCircle(circleA, circleB)).toBe(true);
    });

    it('should return true when one circle is inside the other', function ()
    {
        var circleA = { x: 0, y: 0, radius: 20 };
        var circleB = { x: 5, y: 5, radius: 5 };

        expect(CircleToCircle(circleA, circleB)).toBe(true);
    });

    it('should return false when circles are just beyond touching distance', function ()
    {
        var circleA = { x: 0, y: 0, radius: 10 };
        var circleB = { x: 20.001, y: 0, radius: 10 };

        expect(CircleToCircle(circleA, circleB)).toBe(false);
    });

    it('should return true when both circles have zero radius and share the same center', function ()
    {
        var circleA = { x: 5, y: 5, radius: 0 };
        var circleB = { x: 5, y: 5, radius: 0 };

        expect(CircleToCircle(circleA, circleB)).toBe(true);
    });

    it('should return false when both circles have zero radius and different centers', function ()
    {
        var circleA = { x: 0, y: 0, radius: 0 };
        var circleB = { x: 1, y: 0, radius: 0 };

        expect(CircleToCircle(circleA, circleB)).toBe(false);
    });

    it('should work with circles in negative coordinate space', function ()
    {
        var circleA = { x: -50, y: -50, radius: 10 };
        var circleB = { x: -45, y: -50, radius: 10 };

        expect(CircleToCircle(circleA, circleB)).toBe(true);
    });

    it('should return false with circles far apart in negative coordinate space', function ()
    {
        var circleA = { x: -100, y: -100, radius: 10 };
        var circleB = { x: 100, y: 100, radius: 10 };

        expect(CircleToCircle(circleA, circleB)).toBe(false);
    });

    it('should work with circles on a diagonal', function ()
    {
        var circleA = { x: 0, y: 0, radius: 10 };
        var circleB = { x: 10, y: 10, radius: 10 };

        // distance = sqrt(200) ≈ 14.14, sum of radii = 20, so they intersect
        expect(CircleToCircle(circleA, circleB)).toBe(true);
    });

    it('should return false for circles separated on a diagonal', function ()
    {
        var circleA = { x: 0, y: 0, radius: 5 };
        var circleB = { x: 100, y: 100, radius: 5 };

        // distance ≈ 141.4, sum of radii = 10
        expect(CircleToCircle(circleA, circleB)).toBe(false);
    });

    it('should return true for circles with large radii that overlap', function ()
    {
        var circleA = { x: 0, y: 0, radius: 1000 };
        var circleB = { x: 500, y: 0, radius: 1000 };

        expect(CircleToCircle(circleA, circleB)).toBe(true);
    });

    it('should handle floating point radii and positions', function ()
    {
        var circleA = { x: 0.5, y: 0.5, radius: 2.5 };
        var circleB = { x: 3.0, y: 0.5, radius: 2.5 };

        // distance = 2.5, sum of radii = 5.0, so they are tangent
        expect(CircleToCircle(circleA, circleB)).toBe(true);
    });
});
