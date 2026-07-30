var Clone = require('../../../src/geom/polygon/Clone');
var Polygon = require('../../../src/geom/polygon/Polygon');

describe('Phaser.Geom.Polygon.Clone', function ()
{
    it('should return a Polygon instance', function ()
    {
        var polygon = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 } ]);
        var clone = Clone(polygon);

        expect(clone).toBeInstanceOf(Polygon);
    });

    it('should return a different object reference than the original', function ()
    {
        var polygon = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 } ]);
        var clone = Clone(polygon);

        expect(clone).not.toBe(polygon);
    });

    it('should clone the points from the original polygon', function ()
    {
        var polygon = new Polygon([ { x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50, y: 60 } ]);
        var clone = Clone(polygon);

        expect(clone.points.length).toBe(3);
        expect(clone.points[0].x).toBe(10);
        expect(clone.points[0].y).toBe(20);
        expect(clone.points[1].x).toBe(30);
        expect(clone.points[1].y).toBe(40);
        expect(clone.points[2].x).toBe(50);
        expect(clone.points[2].y).toBe(60);
    });

    it('should not share the same points array reference as the original', function ()
    {
        var polygon = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 } ]);
        var clone = Clone(polygon);

        expect(clone.points).not.toBe(polygon.points);
    });

    it('should clone a polygon with two points', function ()
    {
        var polygon = new Polygon([ { x: 5, y: 10 }, { x: 15, y: 25 } ]);
        var clone = Clone(polygon);

        expect(clone.points.length).toBe(2);
        expect(clone.points[0].x).toBe(5);
        expect(clone.points[0].y).toBe(10);
        expect(clone.points[1].x).toBe(15);
        expect(clone.points[1].y).toBe(25);
    });

    it('should clone a polygon with many points', function ()
    {
        var pts = [];
        for (var i = 0; i < 10; i++)
        {
            pts.push({ x: i * 10, y: i * 5 });
        }

        var polygon = new Polygon(pts);
        var clone = Clone(polygon);

        expect(clone.points.length).toBe(10);
        for (var j = 0; j < 10; j++)
        {
            expect(clone.points[j].x).toBe(j * 10);
            expect(clone.points[j].y).toBe(j * 5);
        }
    });

    it('should clone a polygon with an empty points array', function ()
    {
        var polygon = new Polygon([]);
        var clone = Clone(polygon);

        expect(clone.points.length).toBe(0);
    });

    it('should have the same area as the original polygon', function ()
    {
        var polygon = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 } ]);
        var clone = Clone(polygon);

        expect(clone.area).toBeCloseTo(polygon.area);
    });

    it('should produce a clone that is independent from the original', function ()
    {
        var polygon = new Polygon([ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 50, y: 100 } ]);
        var clone = Clone(polygon);

        clone.points[0].x = 999;

        expect(polygon.points[0].x).toBe(0);
    });

    it('should clone negative coordinate points correctly', function ()
    {
        var polygon = new Polygon([ { x: -50, y: -100 }, { x: -10, y: 0 }, { x: 0, y: -50 } ]);
        var clone = Clone(polygon);

        expect(clone.points[0].x).toBe(-50);
        expect(clone.points[0].y).toBe(-100);
        expect(clone.points[1].x).toBe(-10);
        expect(clone.points[1].y).toBe(0);
    });

    it('should clone floating point coordinates correctly', function ()
    {
        var polygon = new Polygon([ { x: 1.5, y: 2.7 }, { x: 3.14, y: 9.99 }, { x: 0.001, y: 100.5 } ]);
        var clone = Clone(polygon);

        expect(clone.points[0].x).toBeCloseTo(1.5);
        expect(clone.points[0].y).toBeCloseTo(2.7);
        expect(clone.points[1].x).toBeCloseTo(3.14);
        expect(clone.points[1].y).toBeCloseTo(9.99);
    });
});
