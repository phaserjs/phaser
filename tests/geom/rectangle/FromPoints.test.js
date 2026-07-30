var FromPoints = require('../../../src/geom/rectangle/FromPoints');
var Rectangle = require('../../../src/geom/rectangle/Rectangle');

describe('Phaser.Geom.Rectangle.FromPoints', function ()
{
    it('should return a new Rectangle when no out parameter is provided', function ()
    {
        var result = FromPoints([[0, 0], [100, 100]]);

        expect(result).toBeInstanceOf(Rectangle);
    });

    it('should use the provided out Rectangle', function ()
    {
        var out = new Rectangle();
        var result = FromPoints([[0, 0], [100, 100]], out);

        expect(result).toBe(out);
    });

    it('should return an empty Rectangle when given an empty points array', function ()
    {
        var out = new Rectangle(5, 5, 50, 50);
        var result = FromPoints([], out);

        expect(result).toBe(out);
        expect(result.x).toBe(5);
        expect(result.y).toBe(5);
        expect(result.width).toBe(50);
        expect(result.height).toBe(50);
    });

    it('should return a new Rectangle unchanged when given an empty points array and no out', function ()
    {
        var result = FromPoints([]);

        expect(result).toBeInstanceOf(Rectangle);
    });

    it('should handle array-style points', function ()
    {
        var result = FromPoints([[10, 20], [50, 80]]);

        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(40);
        expect(result.height).toBe(60);
    });

    it('should handle object-style points with x and y properties', function ()
    {
        var result = FromPoints([{ x: 10, y: 20 }, { x: 50, y: 80 }]);

        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(40);
        expect(result.height).toBe(60);
    });

    it('should handle mixed array and object points', function ()
    {
        var result = FromPoints([[10, 20], { x: 50, y: 80 }]);

        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(40);
        expect(result.height).toBe(60);
    });

    it('should produce a zero-size Rectangle for a single point', function ()
    {
        var result = FromPoints([[30, 40]]);

        expect(result.x).toBe(30);
        expect(result.y).toBe(40);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should produce a zero-size Rectangle for a single object point', function ()
    {
        var result = FromPoints([{ x: 30, y: 40 }]);

        expect(result.x).toBe(30);
        expect(result.y).toBe(40);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should correctly bound multiple points', function ()
    {
        var result = FromPoints([[100, 200], [200, 400], { x: 30, y: 60 }]);

        expect(result.x).toBe(30);
        expect(result.y).toBe(60);
        expect(result.width).toBe(170);
        expect(result.height).toBe(340);
    });

    it('should handle negative coordinates', function ()
    {
        var result = FromPoints([[-50, -100], [50, 100]]);

        expect(result.x).toBe(-50);
        expect(result.y).toBe(-100);
        expect(result.width).toBe(100);
        expect(result.height).toBe(200);
    });

    it('should handle all negative coordinates', function ()
    {
        var result = FromPoints([[-200, -300], [-100, -150]]);

        expect(result.x).toBe(-200);
        expect(result.y).toBe(-300);
        expect(result.width).toBe(100);
        expect(result.height).toBe(150);
    });

    it('should handle floating point coordinates', function ()
    {
        var result = FromPoints([[1.5, 2.5], [3.5, 4.5]]);

        expect(result.x).toBeCloseTo(1.5);
        expect(result.y).toBeCloseTo(2.5);
        expect(result.width).toBeCloseTo(2.0);
        expect(result.height).toBeCloseTo(2.0);
    });

    it('should handle points all on the same horizontal line', function ()
    {
        var result = FromPoints([[0, 10], [50, 10], [100, 10]]);

        expect(result.x).toBe(0);
        expect(result.y).toBe(10);
        expect(result.width).toBe(100);
        expect(result.height).toBe(0);
    });

    it('should handle points all on the same vertical line', function ()
    {
        var result = FromPoints([[10, 0], [10, 50], [10, 100]]);

        expect(result.x).toBe(10);
        expect(result.y).toBe(0);
        expect(result.width).toBe(0);
        expect(result.height).toBe(100);
    });

    it('should update an existing out Rectangle with new bounds', function ()
    {
        var out = new Rectangle(0, 0, 0, 0);

        FromPoints([[20, 30], [80, 90]], out);

        expect(out.x).toBe(20);
        expect(out.y).toBe(30);
        expect(out.width).toBe(60);
        expect(out.height).toBe(60);
    });

    it('should handle large numbers of points', function ()
    {
        var points = [];

        for (var i = 0; i < 1000; i++)
        {
            points.push([i, i * 2]);
        }

        var result = FromPoints(points);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(999);
        expect(result.height).toBe(1998);
    });

    it('should handle points where min and max are the same on one axis', function ()
    {
        var result = FromPoints([[5, 0], [5, 100]]);

        expect(result.x).toBe(5);
        expect(result.y).toBe(0);
        expect(result.width).toBe(0);
        expect(result.height).toBe(100);
    });

    it('should correctly find min x and min y from unsorted points', function ()
    {
        var result = FromPoints([[300, 400], [100, 200], [500, 50], [10, 600]]);

        expect(result.x).toBe(10);
        expect(result.y).toBe(50);
        expect(result.width).toBe(490);
        expect(result.height).toBe(550);
    });
});
