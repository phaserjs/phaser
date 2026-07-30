var OffsetPoint = require('../../../src/geom/circle/OffsetPoint');

describe('Phaser.Geom.Circle.OffsetPoint', function ()
{
    it('should offset the circle x and y by the vector values', function ()
    {
        var circle = { x: 10, y: 20, radius: 5 };
        var vec = { x: 3, y: 7 };

        OffsetPoint(circle, vec);

        expect(circle.x).toBe(13);
        expect(circle.y).toBe(27);
    });

    it('should return the modified circle', function ()
    {
        var circle = { x: 0, y: 0, radius: 10 };
        var vec = { x: 1, y: 1 };

        var result = OffsetPoint(circle, vec);

        expect(result).toBe(circle);
    });

    it('should work with zero vector values', function ()
    {
        var circle = { x: 5, y: 5, radius: 5 };
        var vec = { x: 0, y: 0 };

        OffsetPoint(circle, vec);

        expect(circle.x).toBe(5);
        expect(circle.y).toBe(5);
    });

    it('should work with negative vector values', function ()
    {
        var circle = { x: 10, y: 10, radius: 5 };
        var vec = { x: -3, y: -7 };

        OffsetPoint(circle, vec);

        expect(circle.x).toBe(7);
        expect(circle.y).toBe(3);
    });

    it('should work with floating point vector values', function ()
    {
        var circle = { x: 1.5, y: 2.5, radius: 5 };
        var vec = { x: 0.5, y: 1.5 };

        OffsetPoint(circle, vec);

        expect(circle.x).toBeCloseTo(2.0);
        expect(circle.y).toBeCloseTo(4.0);
    });

    it('should not modify the radius', function ()
    {
        var circle = { x: 0, y: 0, radius: 42 };
        var vec = { x: 10, y: 10 };

        OffsetPoint(circle, vec);

        expect(circle.radius).toBe(42);
    });

    it('should work when circle is at origin', function ()
    {
        var circle = { x: 0, y: 0, radius: 1 };
        var vec = { x: 100, y: -50 };

        OffsetPoint(circle, vec);

        expect(circle.x).toBe(100);
        expect(circle.y).toBe(-50);
    });

    it('should accumulate offsets across multiple calls', function ()
    {
        var circle = { x: 0, y: 0, radius: 5 };
        var vec = { x: 5, y: 5 };

        OffsetPoint(circle, vec);
        OffsetPoint(circle, vec);
        OffsetPoint(circle, vec);

        expect(circle.x).toBe(15);
        expect(circle.y).toBe(15);
    });
});
