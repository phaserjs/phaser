var CopyFrom = require('../../../src/geom/ellipse/CopyFrom');

describe('Phaser.Geom.Ellipse.CopyFrom', function ()
{
    function makeEllipse(x, y, width, height)
    {
        var e = { x: x, y: y, width: width, height: height };
        e.setTo = function (x, y, width, height)
        {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        };
        return e;
    }

    it('should copy x, y, width and height from source to dest', function ()
    {
        var source = makeEllipse(10, 20, 100, 200);
        var dest = makeEllipse(0, 0, 0, 0);

        CopyFrom(source, dest);

        expect(dest.x).toBe(10);
        expect(dest.y).toBe(20);
        expect(dest.width).toBe(100);
        expect(dest.height).toBe(200);
    });

    it('should return the dest Ellipse', function ()
    {
        var source = makeEllipse(1, 2, 3, 4);
        var dest = makeEllipse(0, 0, 0, 0);

        var result = CopyFrom(source, dest);

        expect(result).toBe(dest);
    });

    it('should not modify the source Ellipse', function ()
    {
        var source = makeEllipse(5, 10, 50, 100);
        var dest = makeEllipse(0, 0, 0, 0);

        CopyFrom(source, dest);

        expect(source.x).toBe(5);
        expect(source.y).toBe(10);
        expect(source.width).toBe(50);
        expect(source.height).toBe(100);
    });

    it('should overwrite existing dest values', function ()
    {
        var source = makeEllipse(7, 8, 90, 120);
        var dest = makeEllipse(999, 888, 777, 666);

        CopyFrom(source, dest);

        expect(dest.x).toBe(7);
        expect(dest.y).toBe(8);
        expect(dest.width).toBe(90);
        expect(dest.height).toBe(120);
    });

    it('should work with zero values', function ()
    {
        var source = makeEllipse(0, 0, 0, 0);
        var dest = makeEllipse(10, 20, 30, 40);

        CopyFrom(source, dest);

        expect(dest.x).toBe(0);
        expect(dest.y).toBe(0);
        expect(dest.width).toBe(0);
        expect(dest.height).toBe(0);
    });

    it('should work with negative values', function ()
    {
        var source = makeEllipse(-5, -10, -50, -100);
        var dest = makeEllipse(0, 0, 0, 0);

        CopyFrom(source, dest);

        expect(dest.x).toBe(-5);
        expect(dest.y).toBe(-10);
        expect(dest.width).toBe(-50);
        expect(dest.height).toBe(-100);
    });

    it('should work with floating point values', function ()
    {
        var source = makeEllipse(1.5, 2.7, 10.25, 20.75);
        var dest = makeEllipse(0, 0, 0, 0);

        CopyFrom(source, dest);

        expect(dest.x).toBeCloseTo(1.5);
        expect(dest.y).toBeCloseTo(2.7);
        expect(dest.width).toBeCloseTo(10.25);
        expect(dest.height).toBeCloseTo(20.75);
    });

    it('should work when source and dest have the same values', function ()
    {
        var source = makeEllipse(3, 6, 30, 60);
        var dest = makeEllipse(3, 6, 30, 60);

        var result = CopyFrom(source, dest);

        expect(result).toBe(dest);
        expect(dest.x).toBe(3);
        expect(dest.y).toBe(6);
        expect(dest.width).toBe(30);
        expect(dest.height).toBe(60);
    });
});
