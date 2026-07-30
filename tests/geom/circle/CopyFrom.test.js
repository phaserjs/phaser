var CopyFrom = require('../../../src/geom/circle/CopyFrom');

describe('Phaser.Geom.Circle.CopyFrom', function ()
{
    function makeCircle(x, y, radius)
    {
        var circle = { x: x, y: y, radius: radius };

        circle.setTo = function (x, y, radius)
        {
            this.x = x;
            this.y = y;
            this.radius = radius;

            return this;
        };

        return circle;
    }

    it('should copy x, y and radius from source to dest', function ()
    {
        var source = makeCircle(10, 20, 30);
        var dest = makeCircle(0, 0, 0);

        CopyFrom(source, dest);

        expect(dest.x).toBe(10);
        expect(dest.y).toBe(20);
        expect(dest.radius).toBe(30);
    });

    it('should return the dest circle', function ()
    {
        var source = makeCircle(10, 20, 30);
        var dest = makeCircle(0, 0, 0);

        var result = CopyFrom(source, dest);

        expect(result).toBe(dest);
    });

    it('should not modify the source circle', function ()
    {
        var source = makeCircle(10, 20, 30);
        var dest = makeCircle(0, 0, 0);

        CopyFrom(source, dest);

        expect(source.x).toBe(10);
        expect(source.y).toBe(20);
        expect(source.radius).toBe(30);
    });

    it('should overwrite existing dest values', function ()
    {
        var source = makeCircle(5, 15, 25);
        var dest = makeCircle(100, 200, 300);

        CopyFrom(source, dest);

        expect(dest.x).toBe(5);
        expect(dest.y).toBe(15);
        expect(dest.radius).toBe(25);
    });

    it('should copy negative x and y values', function ()
    {
        var source = makeCircle(-50, -75, 40);
        var dest = makeCircle(0, 0, 0);

        CopyFrom(source, dest);

        expect(dest.x).toBe(-50);
        expect(dest.y).toBe(-75);
        expect(dest.radius).toBe(40);
    });

    it('should copy zero values', function ()
    {
        var source = makeCircle(0, 0, 0);
        var dest = makeCircle(100, 200, 300);

        CopyFrom(source, dest);

        expect(dest.x).toBe(0);
        expect(dest.y).toBe(0);
        expect(dest.radius).toBe(0);
    });

    it('should copy floating point values', function ()
    {
        var source = makeCircle(1.5, 2.75, 3.14159);
        var dest = makeCircle(0, 0, 0);

        CopyFrom(source, dest);

        expect(dest.x).toBeCloseTo(1.5);
        expect(dest.y).toBeCloseTo(2.75);
        expect(dest.radius).toBeCloseTo(3.14159);
    });

    it('should copy when source and dest have the same initial values', function ()
    {
        var source = makeCircle(10, 20, 30);
        var dest = makeCircle(10, 20, 30);

        var result = CopyFrom(source, dest);

        expect(dest.x).toBe(10);
        expect(dest.y).toBe(20);
        expect(dest.radius).toBe(30);
        expect(result).toBe(dest);
    });
});
