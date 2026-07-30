var OffsetPoint = require('../../../src/geom/rectangle/OffsetPoint');

describe('Phaser.Geom.Rectangle.OffsetPoint', function ()
{
    it('should offset the rectangle x and y by the vector coordinates', function ()
    {
        var rect = { x: 10, y: 20, width: 100, height: 50 };
        var vec = { x: 5, y: 15 };

        OffsetPoint(rect, vec);

        expect(rect.x).toBe(15);
        expect(rect.y).toBe(35);
    });

    it('should return the modified rectangle', function ()
    {
        var rect = { x: 0, y: 0, width: 100, height: 50 };
        var vec = { x: 10, y: 20 };

        var result = OffsetPoint(rect, vec);

        expect(result).toBe(rect);
    });

    it('should not modify width or height', function ()
    {
        var rect = { x: 0, y: 0, width: 200, height: 80 };
        var vec = { x: 10, y: 20 };

        OffsetPoint(rect, vec);

        expect(rect.width).toBe(200);
        expect(rect.height).toBe(80);
    });

    it('should work with zero vector', function ()
    {
        var rect = { x: 10, y: 20, width: 100, height: 50 };
        var vec = { x: 0, y: 0 };

        OffsetPoint(rect, vec);

        expect(rect.x).toBe(10);
        expect(rect.y).toBe(20);
    });

    it('should work with negative vector values', function ()
    {
        var rect = { x: 10, y: 20, width: 100, height: 50 };
        var vec = { x: -5, y: -10 };

        OffsetPoint(rect, vec);

        expect(rect.x).toBe(5);
        expect(rect.y).toBe(10);
    });

    it('should work when offset results in negative position', function ()
    {
        var rect = { x: 5, y: 5, width: 100, height: 50 };
        var vec = { x: -20, y: -30 };

        OffsetPoint(rect, vec);

        expect(rect.x).toBe(-15);
        expect(rect.y).toBe(-25);
    });

    it('should work with floating point vector values', function ()
    {
        var rect = { x: 1.5, y: 2.5, width: 100, height: 50 };
        var vec = { x: 0.5, y: 1.5 };

        OffsetPoint(rect, vec);

        expect(rect.x).toBeCloseTo(2.0);
        expect(rect.y).toBeCloseTo(4.0);
    });

    it('should work with large values', function ()
    {
        var rect = { x: 1000000, y: 2000000, width: 100, height: 50 };
        var vec = { x: 500000, y: 750000 };

        OffsetPoint(rect, vec);

        expect(rect.x).toBe(1500000);
        expect(rect.y).toBe(2750000);
    });

    it('should accumulate offsets on successive calls', function ()
    {
        var rect = { x: 0, y: 0, width: 100, height: 50 };
        var vec = { x: 5, y: 10 };

        OffsetPoint(rect, vec);
        OffsetPoint(rect, vec);
        OffsetPoint(rect, vec);

        expect(rect.x).toBe(15);
        expect(rect.y).toBe(30);
    });

    it('should work when rect starts at origin', function ()
    {
        var rect = { x: 0, y: 0, width: 100, height: 50 };
        var vec = { x: 7, y: 3 };

        OffsetPoint(rect, vec);

        expect(rect.x).toBe(7);
        expect(rect.y).toBe(3);
    });
});
