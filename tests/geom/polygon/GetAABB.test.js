var GetAABB = require('../../../src/geom/polygon/GetAABB');

describe('Phaser.Geom.Polygon.GetAABB', function ()
{
    it('should return a Rectangle when no out parameter is provided', function ()
    {
        var polygon = { points: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }] };
        var result = GetAABB(polygon);

        expect(result).toBeDefined();
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
        expect(typeof result.width).toBe('number');
        expect(typeof result.height).toBe('number');
    });

    it('should calculate correct AABB for a simple square polygon', function ()
    {
        var polygon = { points: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }] };
        var result = GetAABB(polygon);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(10);
        expect(result.height).toBe(10);
    });

    it('should calculate correct AABB for a polygon with negative coordinates', function ()
    {
        var polygon = { points: [{ x: -10, y: -10 }, { x: 10, y: -10 }, { x: 10, y: 10 }, { x: -10, y: 10 }] };
        var result = GetAABB(polygon);

        expect(result.x).toBe(-10);
        expect(result.y).toBe(-10);
        expect(result.width).toBe(20);
        expect(result.height).toBe(20);
    });

    it('should calculate correct AABB for a non-axis-aligned polygon', function ()
    {
        var polygon = { points: [{ x: 2, y: 5 }, { x: 8, y: 1 }, { x: 12, y: 9 }, { x: 4, y: 13 }] };
        var result = GetAABB(polygon);

        expect(result.x).toBe(2);
        expect(result.y).toBe(1);
        expect(result.width).toBe(10);
        expect(result.height).toBe(12);
    });

    it('should use the provided out object when supplied', function ()
    {
        var polygon = { points: [{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 5, y: 5 }, { x: 0, y: 5 }] };
        var out = { x: 0, y: 0, width: 0, height: 0 };
        var result = GetAABB(polygon, out);

        expect(result).toBe(out);
        expect(out.x).toBe(0);
        expect(out.y).toBe(0);
        expect(out.width).toBe(5);
        expect(out.height).toBe(5);
    });

    it('should return the out object by reference', function ()
    {
        var polygon = { points: [{ x: 1, y: 2 }, { x: 3, y: 4 }] };
        var out = { x: 0, y: 0, width: 0, height: 0 };
        var result = GetAABB(polygon, out);

        expect(result).toBe(out);
    });

    it('should handle a single point polygon', function ()
    {
        var polygon = { points: [{ x: 7, y: 3 }] };
        var result = GetAABB(polygon);

        expect(result.x).toBe(7);
        expect(result.y).toBe(3);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should handle a two-point polygon', function ()
    {
        var polygon = { points: [{ x: 1, y: 2 }, { x: 9, y: 8 }] };
        var result = GetAABB(polygon);

        expect(result.x).toBe(1);
        expect(result.y).toBe(2);
        expect(result.width).toBe(8);
        expect(result.height).toBe(6);
    });

    it('should handle floating point coordinates', function ()
    {
        var polygon = { points: [{ x: 1.5, y: 2.5 }, { x: 4.5, y: 6.5 }] };
        var result = GetAABB(polygon);

        expect(result.x).toBeCloseTo(1.5);
        expect(result.y).toBeCloseTo(2.5);
        expect(result.width).toBeCloseTo(3.0);
        expect(result.height).toBeCloseTo(4.0);
    });

    it('should handle a polygon where all points share the same x coordinate', function ()
    {
        var polygon = { points: [{ x: 5, y: 0 }, { x: 5, y: 10 }, { x: 5, y: 20 }] };
        var result = GetAABB(polygon);

        expect(result.x).toBe(5);
        expect(result.y).toBe(0);
        expect(result.width).toBe(0);
        expect(result.height).toBe(20);
    });

    it('should handle a polygon where all points share the same y coordinate', function ()
    {
        var polygon = { points: [{ x: 0, y: 7 }, { x: 10, y: 7 }, { x: 20, y: 7 }] };
        var result = GetAABB(polygon);

        expect(result.x).toBe(0);
        expect(result.y).toBe(7);
        expect(result.width).toBe(20);
        expect(result.height).toBe(0);
    });

    it('should handle a polygon offset from the origin', function ()
    {
        var polygon = { points: [{ x: 100, y: 200 }, { x: 150, y: 200 }, { x: 150, y: 250 }, { x: 100, y: 250 }] };
        var result = GetAABB(polygon);

        expect(result.x).toBe(100);
        expect(result.y).toBe(200);
        expect(result.width).toBe(50);
        expect(result.height).toBe(50);
    });

    it('should correctly find min and max across many points', function ()
    {
        var polygon = {
            points: [
                { x: 3, y: 7 },
                { x: -2, y: 5 },
                { x: 8, y: -1 },
                { x: 1, y: 12 },
                { x: 6, y: 3 }
            ]
        };
        var result = GetAABB(polygon);

        expect(result.x).toBe(-2);
        expect(result.y).toBe(-1);
        expect(result.width).toBe(10);
        expect(result.height).toBe(13);
    });
});
