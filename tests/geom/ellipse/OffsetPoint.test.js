var OffsetPoint = require('../../../src/geom/ellipse/OffsetPoint');

describe('Phaser.Geom.Ellipse.OffsetPoint', function ()
{
    it('should offset the ellipse by the vector x and y values', function ()
    {
        var ellipse = { x: 10, y: 20 };
        var vec = { x: 5, y: 8 };

        OffsetPoint(ellipse, vec);

        expect(ellipse.x).toBe(15);
        expect(ellipse.y).toBe(28);
    });

    it('should return the ellipse object', function ()
    {
        var ellipse = { x: 0, y: 0 };
        var vec = { x: 1, y: 1 };
        var result = OffsetPoint(ellipse, vec);

        expect(result).toBe(ellipse);
    });

    it('should offset by zero when vector is zero', function ()
    {
        var ellipse = { x: 50, y: 75 };
        var vec = { x: 0, y: 0 };

        OffsetPoint(ellipse, vec);

        expect(ellipse.x).toBe(50);
        expect(ellipse.y).toBe(75);
    });

    it('should offset by negative values', function ()
    {
        var ellipse = { x: 100, y: 200 };
        var vec = { x: -30, y: -50 };

        OffsetPoint(ellipse, vec);

        expect(ellipse.x).toBe(70);
        expect(ellipse.y).toBe(150);
    });

    it('should offset an ellipse at the origin', function ()
    {
        var ellipse = { x: 0, y: 0 };
        var vec = { x: 10, y: 20 };

        OffsetPoint(ellipse, vec);

        expect(ellipse.x).toBe(10);
        expect(ellipse.y).toBe(20);
    });

    it('should handle floating point vector values', function ()
    {
        var ellipse = { x: 1.5, y: 2.5 };
        var vec = { x: 0.25, y: 0.75 };

        OffsetPoint(ellipse, vec);

        expect(ellipse.x).toBeCloseTo(1.75);
        expect(ellipse.y).toBeCloseTo(3.25);
    });

    it('should handle large offset values', function ()
    {
        var ellipse = { x: 0, y: 0 };
        var vec = { x: 1000000, y: 9999999 };

        OffsetPoint(ellipse, vec);

        expect(ellipse.x).toBe(1000000);
        expect(ellipse.y).toBe(9999999);
    });

    it('should accumulate offsets over multiple calls', function ()
    {
        var ellipse = { x: 0, y: 0 };
        var vec = { x: 5, y: 10 };

        OffsetPoint(ellipse, vec);
        OffsetPoint(ellipse, vec);
        OffsetPoint(ellipse, vec);

        expect(ellipse.x).toBe(15);
        expect(ellipse.y).toBe(30);
    });

    it('should only modify x and y properties of the ellipse', function ()
    {
        var ellipse = { x: 10, y: 20, width: 100, height: 50 };
        var vec = { x: 5, y: 5 };

        OffsetPoint(ellipse, vec);

        expect(ellipse.width).toBe(100);
        expect(ellipse.height).toBe(50);
    });
});
