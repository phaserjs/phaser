var CopyFrom = require('../../../src/geom/rectangle/CopyFrom');

describe('Phaser.Geom.Rectangle.CopyFrom', function ()
{
    var source;
    var dest;

    beforeEach(function ()
    {
        source = { x: 0, y: 0, width: 0, height: 0 };
        dest = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            setTo: function (x, y, width, height)
            {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                return this;
            }
        };
    });

    it('should copy x, y, width, and height from source to dest', function ()
    {
        source.x = 10;
        source.y = 20;
        source.width = 100;
        source.height = 200;

        CopyFrom(source, dest);

        expect(dest.x).toBe(10);
        expect(dest.y).toBe(20);
        expect(dest.width).toBe(100);
        expect(dest.height).toBe(200);
    });

    it('should return the destination rectangle', function ()
    {
        source.x = 5;
        source.y = 5;
        source.width = 50;
        source.height = 50;

        var result = CopyFrom(source, dest);

        expect(result).toBe(dest);
    });

    it('should copy zero values correctly', function ()
    {
        source.x = 0;
        source.y = 0;
        source.width = 0;
        source.height = 0;

        dest.x = 99;
        dest.y = 99;
        dest.width = 99;
        dest.height = 99;

        CopyFrom(source, dest);

        expect(dest.x).toBe(0);
        expect(dest.y).toBe(0);
        expect(dest.width).toBe(0);
        expect(dest.height).toBe(0);
    });

    it('should copy negative values correctly', function ()
    {
        source.x = -10;
        source.y = -20;
        source.width = -50;
        source.height = -100;

        CopyFrom(source, dest);

        expect(dest.x).toBe(-10);
        expect(dest.y).toBe(-20);
        expect(dest.width).toBe(-50);
        expect(dest.height).toBe(-100);
    });

    it('should copy floating point values correctly', function ()
    {
        source.x = 1.5;
        source.y = 2.75;
        source.width = 10.25;
        source.height = 20.5;

        CopyFrom(source, dest);

        expect(dest.x).toBeCloseTo(1.5);
        expect(dest.y).toBeCloseTo(2.75);
        expect(dest.width).toBeCloseTo(10.25);
        expect(dest.height).toBeCloseTo(20.5);
    });

    it('should overwrite existing dest values', function ()
    {
        dest.x = 999;
        dest.y = 888;
        dest.width = 777;
        dest.height = 666;

        source.x = 1;
        source.y = 2;
        source.width = 3;
        source.height = 4;

        CopyFrom(source, dest);

        expect(dest.x).toBe(1);
        expect(dest.y).toBe(2);
        expect(dest.width).toBe(3);
        expect(dest.height).toBe(4);
    });

    it('should not modify the source rectangle', function ()
    {
        source.x = 10;
        source.y = 20;
        source.width = 30;
        source.height = 40;

        CopyFrom(source, dest);

        expect(source.x).toBe(10);
        expect(source.y).toBe(20);
        expect(source.width).toBe(30);
        expect(source.height).toBe(40);
    });

    it('should copy large values correctly', function ()
    {
        source.x = 100000;
        source.y = 200000;
        source.width = 999999;
        source.height = 888888;

        CopyFrom(source, dest);

        expect(dest.x).toBe(100000);
        expect(dest.y).toBe(200000);
        expect(dest.width).toBe(999999);
        expect(dest.height).toBe(888888);
    });
});
