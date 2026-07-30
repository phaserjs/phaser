var CopyFrom = require('../../../src/geom/triangle/CopyFrom');

describe('Phaser.Geom.Triangle.CopyFrom', function ()
{
    function makeDest ()
    {
        var dest = { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };
        dest.setTo = function (x1, y1, x2, y2, x3, y3)
        {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.x3 = x3;
            this.y3 = y3;
            return this;
        };
        return dest;
    }

    it('should copy all six vertex values from source to dest', function ()
    {
        var source = { x1: 1, y1: 2, x2: 3, y2: 4, x3: 5, y3: 6 };
        var dest = makeDest();

        CopyFrom(source, dest);

        expect(dest.x1).toBe(1);
        expect(dest.y1).toBe(2);
        expect(dest.x2).toBe(3);
        expect(dest.y2).toBe(4);
        expect(dest.x3).toBe(5);
        expect(dest.y3).toBe(6);
    });

    it('should return the destination Triangle', function ()
    {
        var source = { x1: 1, y1: 2, x2: 3, y2: 4, x3: 5, y3: 6 };
        var dest = makeDest();

        var result = CopyFrom(source, dest);

        expect(result).toBe(dest);
    });

    it('should overwrite existing dest values with source values', function ()
    {
        var source = { x1: 10, y1: 20, x2: 30, y2: 40, x3: 50, y3: 60 };
        var dest = makeDest();
        dest.x1 = 99; dest.y1 = 99; dest.x2 = 99; dest.y2 = 99; dest.x3 = 99; dest.y3 = 99;

        CopyFrom(source, dest);

        expect(dest.x1).toBe(10);
        expect(dest.y1).toBe(20);
        expect(dest.x2).toBe(30);
        expect(dest.y2).toBe(40);
        expect(dest.x3).toBe(50);
        expect(dest.y3).toBe(60);
    });

    it('should handle zero values', function ()
    {
        var source = { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };
        var dest = makeDest();
        dest.x1 = 5; dest.y1 = 5; dest.x2 = 5; dest.y2 = 5; dest.x3 = 5; dest.y3 = 5;

        CopyFrom(source, dest);

        expect(dest.x1).toBe(0);
        expect(dest.y1).toBe(0);
        expect(dest.x2).toBe(0);
        expect(dest.y2).toBe(0);
        expect(dest.x3).toBe(0);
        expect(dest.y3).toBe(0);
    });

    it('should handle negative values', function ()
    {
        var source = { x1: -1, y1: -2, x2: -3, y2: -4, x3: -5, y3: -6 };
        var dest = makeDest();

        CopyFrom(source, dest);

        expect(dest.x1).toBe(-1);
        expect(dest.y1).toBe(-2);
        expect(dest.x2).toBe(-3);
        expect(dest.y2).toBe(-4);
        expect(dest.x3).toBe(-5);
        expect(dest.y3).toBe(-6);
    });

    it('should handle floating point values', function ()
    {
        var source = { x1: 1.5, y1: 2.7, x2: 3.14, y2: 4.99, x3: 5.001, y3: 6.123 };
        var dest = makeDest();

        CopyFrom(source, dest);

        expect(dest.x1).toBeCloseTo(1.5);
        expect(dest.y1).toBeCloseTo(2.7);
        expect(dest.x2).toBeCloseTo(3.14);
        expect(dest.y2).toBeCloseTo(4.99);
        expect(dest.x3).toBeCloseTo(5.001);
        expect(dest.y3).toBeCloseTo(6.123);
    });

    it('should not mutate the source Triangle', function ()
    {
        var source = { x1: 1, y1: 2, x2: 3, y2: 4, x3: 5, y3: 6 };
        var dest = makeDest();

        CopyFrom(source, dest);

        expect(source.x1).toBe(1);
        expect(source.y1).toBe(2);
        expect(source.x2).toBe(3);
        expect(source.y2).toBe(4);
        expect(source.x3).toBe(5);
        expect(source.y3).toBe(6);
    });
});
