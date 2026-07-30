var Smooth = require('../../../src/geom/polygon/Smooth');

describe('Phaser.Geom.Polygon.Smooth', function ()
{
    function makePolygon (pts)
    {
        var polygon = {
            points: pts.map(function (p)
            {
                return { x: p[0], y: p[1] };
            }),
            setTo: function (output)
            {
                this.points = output.map(function (p)
                {
                    return { x: p[0], y: p[1] };
                });

                return this;
            }
        };

        return polygon;
    }

    it('should return the polygon object', function ()
    {
        var polygon = makePolygon([ [ 0, 0 ], [ 100, 0 ], [ 100, 100 ] ]);
        var result = Smooth(polygon);

        expect(result).toBe(polygon);
    });

    it('should handle an empty polygon without throwing', function ()
    {
        var polygon = makePolygon([]);

        expect(function () { Smooth(polygon); }).not.toThrow();
    });

    it('should leave an empty polygon with no points', function ()
    {
        var polygon = makePolygon([]);
        Smooth(polygon);

        expect(polygon.points.length).toBe(0);
    });

    it('should handle a single point polygon', function ()
    {
        var polygon = makePolygon([ [ 10, 20 ] ]);
        Smooth(polygon);

        expect(polygon.points.length).toBe(1);
        expect(polygon.points[0].x).toBe(10);
        expect(polygon.points[0].y).toBe(20);
    });

    it('should handle a two-point polygon correctly', function ()
    {
        var polygon = makePolygon([ [ 0, 0 ], [ 100, 100 ] ]);
        Smooth(polygon);

        // first point preserved, two new points, last point preserved = 4
        expect(polygon.points.length).toBe(4);
    });

    it('should preserve the first point exactly', function ()
    {
        var polygon = makePolygon([ [ 10, 20 ], [ 100, 200 ], [ 50, 80 ] ]);
        Smooth(polygon);

        expect(polygon.points[0].x).toBe(10);
        expect(polygon.points[0].y).toBe(20);
    });

    it('should preserve the last point exactly', function ()
    {
        var polygon = makePolygon([ [ 10, 20 ], [ 100, 200 ], [ 50, 80 ] ]);
        Smooth(polygon);

        var last = polygon.points[polygon.points.length - 1];

        expect(last.x).toBe(50);
        expect(last.y).toBe(80);
    });

    it('should produce the correct number of output points for a triangle', function ()
    {
        // 3 input points → 1 + (2*2) + 1 = 6
        var polygon = makePolygon([ [ 0, 0 ], [ 100, 0 ], [ 50, 100 ] ]);
        Smooth(polygon);

        expect(polygon.points.length).toBe(6);
    });

    it('should produce the correct number of output points for a quad', function ()
    {
        // 4 input points → 1 + (2*3) + 1 = 8
        var polygon = makePolygon([ [ 0, 0 ], [ 100, 0 ], [ 100, 100 ], [ 0, 100 ] ]);
        Smooth(polygon);

        expect(polygon.points.length).toBe(8);
    });

    it('should produce 2*(n-1)+2 points for n input points', function ()
    {
        var pts = [ [ 0, 0 ], [ 10, 0 ], [ 10, 10 ], [ 0, 10 ], [ 5, 5 ] ];
        var polygon = makePolygon(pts);
        var n = pts.length;
        Smooth(polygon);

        expect(polygon.points.length).toBe(2 * (n - 1) + 2);
    });

    it('should place the 85% point correctly after the first point', function ()
    {
        var polygon = makePolygon([ [ 0, 0 ], [ 100, 100 ], [ 200, 0 ] ]);
        Smooth(polygon);

        // Second output point should be 85% of p0 + 15% of p1
        expect(polygon.points[1].x).toBeCloseTo(0.85 * 0 + 0.15 * 100, 5);
        expect(polygon.points[1].y).toBeCloseTo(0.85 * 0 + 0.15 * 100, 5);
    });

    it('should place the 15% point correctly after the 85% point', function ()
    {
        var polygon = makePolygon([ [ 0, 0 ], [ 100, 100 ], [ 200, 0 ] ]);
        Smooth(polygon);

        // Third output point should be 15% of p0 + 85% of p1
        expect(polygon.points[2].x).toBeCloseTo(0.15 * 0 + 0.85 * 100, 5);
        expect(polygon.points[2].y).toBeCloseTo(0.15 * 0 + 0.85 * 100, 5);
    });

    it('should compute intermediate points correctly for a horizontal edge', function ()
    {
        var polygon = makePolygon([ [ 0, 0 ], [ 200, 0 ], [ 200, 100 ] ]);
        Smooth(polygon);

        // Between (0,0) and (200,0):
        expect(polygon.points[1].x).toBeCloseTo(0.85 * 0 + 0.15 * 200, 5);
        expect(polygon.points[1].y).toBeCloseTo(0, 5);
        expect(polygon.points[2].x).toBeCloseTo(0.15 * 0 + 0.85 * 200, 5);
        expect(polygon.points[2].y).toBeCloseTo(0, 5);
    });

    it('should compute intermediate points correctly for a vertical edge', function ()
    {
        var polygon = makePolygon([ [ 0, 0 ], [ 0, 100 ], [ 50, 100 ] ]);
        Smooth(polygon);

        // Between (0,0) and (0,100):
        expect(polygon.points[1].x).toBeCloseTo(0, 5);
        expect(polygon.points[1].y).toBeCloseTo(0.85 * 0 + 0.15 * 100, 5);
        expect(polygon.points[2].x).toBeCloseTo(0, 5);
        expect(polygon.points[2].y).toBeCloseTo(0.15 * 0 + 0.85 * 100, 5);
    });

    it('should work with negative coordinates', function ()
    {
        var polygon = makePolygon([ [ -100, -100 ], [ 100, 100 ], [ -100, 100 ] ]);
        Smooth(polygon);

        expect(polygon.points[0].x).toBe(-100);
        expect(polygon.points[0].y).toBe(-100);
        expect(polygon.points[1].x).toBeCloseTo(0.85 * -100 + 0.15 * 100, 5);
        expect(polygon.points[1].y).toBeCloseTo(0.85 * -100 + 0.15 * 100, 5);
    });

    it('should work with floating point coordinates', function ()
    {
        var polygon = makePolygon([ [ 0.5, 1.5 ], [ 10.25, 20.75 ], [ 5.0, 0.0 ] ]);
        Smooth(polygon);

        expect(polygon.points[0].x).toBeCloseTo(0.5, 5);
        expect(polygon.points[0].y).toBeCloseTo(1.5, 5);

        var last = polygon.points[polygon.points.length - 1];

        expect(last.x).toBeCloseTo(5.0, 5);
        expect(last.y).toBeCloseTo(0.0, 5);
    });

    it('should handle coincident points without throwing', function ()
    {
        var polygon = makePolygon([ [ 50, 50 ], [ 50, 50 ], [ 50, 50 ] ]);

        expect(function () { Smooth(polygon); }).not.toThrow();
        expect(polygon.points[0].x).toBe(50);
        expect(polygon.points[0].y).toBe(50);
    });

    it('should leave all output points at the same location when all input points are identical', function ()
    {
        var polygon = makePolygon([ [ 7, 3 ], [ 7, 3 ], [ 7, 3 ] ]);
        Smooth(polygon);

        for (var i = 0; i < polygon.points.length; i++)
        {
            expect(polygon.points[i].x).toBeCloseTo(7, 5);
            expect(polygon.points[i].y).toBeCloseTo(3, 5);
        }
    });

    it('should modify the polygon in-place', function ()
    {
        var polygon = makePolygon([ [ 0, 0 ], [ 100, 0 ], [ 100, 100 ] ]);
        var before = polygon.points.length;
        Smooth(polygon);

        expect(polygon.points.length).not.toBe(before);
    });

    it('should correctly smooth a two-point polygon edge', function ()
    {
        var polygon = makePolygon([ [ 0, 0 ], [ 100, 0 ] ]);
        Smooth(polygon);

        // Expected: [ (0,0), (15,0), (85,0), (100,0) ]
        expect(polygon.points.length).toBe(4);
        expect(polygon.points[0].x).toBeCloseTo(0, 5);
        expect(polygon.points[0].y).toBeCloseTo(0, 5);
        expect(polygon.points[1].x).toBeCloseTo(15, 5);
        expect(polygon.points[1].y).toBeCloseTo(0, 5);
        expect(polygon.points[2].x).toBeCloseTo(85, 5);
        expect(polygon.points[2].y).toBeCloseTo(0, 5);
        expect(polygon.points[3].x).toBeCloseTo(100, 5);
        expect(polygon.points[3].y).toBeCloseTo(0, 5);
    });
});
