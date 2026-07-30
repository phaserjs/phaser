var CopyFrom = require('../../../src/geom/line/CopyFrom');

describe('Phaser.Geom.Line.CopyFrom', function ()
{
    function makeLine(x1, y1, x2, y2)
    {
        return {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            setTo: function (ax1, ay1, ax2, ay2)
            {
                this.x1 = ax1;
                this.y1 = ay1;
                this.x2 = ax2;
                this.y2 = ay2;
                return this;
            }
        };
    }

    it('should copy all values from source to dest', function ()
    {
        var source = makeLine(1, 2, 3, 4);
        var dest = makeLine(0, 0, 0, 0);

        CopyFrom(source, dest);

        expect(dest.x1).toBe(1);
        expect(dest.y1).toBe(2);
        expect(dest.x2).toBe(3);
        expect(dest.y2).toBe(4);
    });

    it('should return the destination line', function ()
    {
        var source = makeLine(1, 2, 3, 4);
        var dest = makeLine(0, 0, 0, 0);

        var result = CopyFrom(source, dest);

        expect(result).toBe(dest);
    });

    it('should not modify the source line', function ()
    {
        var source = makeLine(10, 20, 30, 40);
        var dest = makeLine(0, 0, 0, 0);

        CopyFrom(source, dest);

        expect(source.x1).toBe(10);
        expect(source.y1).toBe(20);
        expect(source.x2).toBe(30);
        expect(source.y2).toBe(40);
    });

    it('should overwrite existing dest values', function ()
    {
        var source = makeLine(5, 6, 7, 8);
        var dest = makeLine(100, 200, 300, 400);

        CopyFrom(source, dest);

        expect(dest.x1).toBe(5);
        expect(dest.y1).toBe(6);
        expect(dest.x2).toBe(7);
        expect(dest.y2).toBe(8);
    });

    it('should work with negative values', function ()
    {
        var source = makeLine(-10, -20, -30, -40);
        var dest = makeLine(0, 0, 0, 0);

        CopyFrom(source, dest);

        expect(dest.x1).toBe(-10);
        expect(dest.y1).toBe(-20);
        expect(dest.x2).toBe(-30);
        expect(dest.y2).toBe(-40);
    });

    it('should work with floating point values', function ()
    {
        var source = makeLine(1.5, 2.75, 3.333, 4.999);
        var dest = makeLine(0, 0, 0, 0);

        CopyFrom(source, dest);

        expect(dest.x1).toBeCloseTo(1.5);
        expect(dest.y1).toBeCloseTo(2.75);
        expect(dest.x2).toBeCloseTo(3.333);
        expect(dest.y2).toBeCloseTo(4.999);
    });

    it('should work with zero values', function ()
    {
        var source = makeLine(0, 0, 0, 0);
        var dest = makeLine(99, 99, 99, 99);

        CopyFrom(source, dest);

        expect(dest.x1).toBe(0);
        expect(dest.y1).toBe(0);
        expect(dest.x2).toBe(0);
        expect(dest.y2).toBe(0);
    });

    it('should work when source and dest share the same coordinates', function ()
    {
        var source = makeLine(7, 8, 9, 10);
        var dest = makeLine(7, 8, 9, 10);

        CopyFrom(source, dest);

        expect(dest.x1).toBe(7);
        expect(dest.y1).toBe(8);
        expect(dest.x2).toBe(9);
        expect(dest.y2).toBe(10);
    });
});
