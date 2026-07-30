var GetVec2Bounds = require('../../src/math/GetVec2Bounds');

describe('Phaser.Math.GetVec2Bounds', function ()
{
    it('should return a Rectangle with correct bounds for a simple set of points', function ()
    {
        var points = [
            { x: 0, y: 0 },
            { x: 10, y: 20 },
            { x: 5, y: 15 }
        ];
        var result = GetVec2Bounds(points);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(10);
        expect(result.height).toBe(20);
    });

    it('should return a new Rectangle when no out parameter is provided', function ()
    {
        var points = [ { x: 1, y: 2 }, { x: 3, y: 4 } ];
        var result = GetVec2Bounds(points);

        expect(result).toBeDefined();
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
        expect(typeof result.width).toBe('number');
        expect(typeof result.height).toBe('number');
    });

    it('should populate the provided out Rectangle', function ()
    {
        var points = [ { x: 2, y: 3 }, { x: 8, y: 9 } ];
        var out = { x: 0, y: 0, width: 0, height: 0 };
        var result = GetVec2Bounds(points, out);

        expect(result).toBe(out);
        expect(out.x).toBe(2);
        expect(out.y).toBe(3);
        expect(out.width).toBe(6);
        expect(out.height).toBe(6);
    });

    it('should handle negative coordinates', function ()
    {
        var points = [
            { x: -10, y: -20 },
            { x: -5, y: -1 },
            { x: -8, y: -15 }
        ];
        var result = GetVec2Bounds(points);

        expect(result.x).toBe(-10);
        expect(result.y).toBe(-20);
        expect(result.width).toBe(5);
        expect(result.height).toBe(19);
    });

    it('should handle mixed positive and negative coordinates', function ()
    {
        var points = [
            { x: -5, y: -10 },
            { x: 5, y: 10 }
        ];
        var result = GetVec2Bounds(points);

        expect(result.x).toBe(-5);
        expect(result.y).toBe(-10);
        expect(result.width).toBe(10);
        expect(result.height).toBe(20);
    });

    it('should handle a single point producing zero width and height', function ()
    {
        var points = [ { x: 7, y: 3 } ];
        var result = GetVec2Bounds(points);

        expect(result.x).toBe(7);
        expect(result.y).toBe(3);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should handle all points being identical', function ()
    {
        var points = [
            { x: 4, y: 4 },
            { x: 4, y: 4 },
            { x: 4, y: 4 }
        ];
        var result = GetVec2Bounds(points);

        expect(result.x).toBe(4);
        expect(result.y).toBe(4);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should handle floating point coordinates', function ()
    {
        var points = [
            { x: 1.5, y: 2.5 },
            { x: 3.75, y: 0.25 }
        ];
        var result = GetVec2Bounds(points);

        expect(result.x).toBeCloseTo(1.5);
        expect(result.y).toBeCloseTo(0.25);
        expect(result.width).toBeCloseTo(2.25);
        expect(result.height).toBeCloseTo(2.25);
    });

    it('should correctly identify the minimum x and y values', function ()
    {
        var points = [
            { x: 100, y: 200 },
            { x: 50, y: 150 },
            { x: 75, y: 175 },
            { x: 25, y: 300 }
        ];
        var result = GetVec2Bounds(points);

        expect(result.x).toBe(25);
        expect(result.y).toBe(150);
        expect(result.width).toBe(75);
        expect(result.height).toBe(150);
    });

    it('should correctly identify the maximum x and y values', function ()
    {
        var points = [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 0, y: 200 },
            { x: 50, y: 50 }
        ];
        var result = GetVec2Bounds(points);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(100);
        expect(result.height).toBe(200);
    });

    it('should return the same out object reference', function ()
    {
        var points = [ { x: 1, y: 1 }, { x: 2, y: 2 } ];
        var out = { x: 0, y: 0, width: 0, height: 0 };
        var result = GetVec2Bounds(points, out);

        expect(result).toBe(out);
    });

    it('should handle points with zero coordinates', function ()
    {
        var points = [
            { x: 0, y: 0 },
            { x: 0, y: 0 }
        ];
        var result = GetVec2Bounds(points);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should handle large coordinate values', function ()
    {
        var points = [
            { x: 1000000, y: 2000000 },
            { x: -1000000, y: -2000000 }
        ];
        var result = GetVec2Bounds(points);

        expect(result.x).toBe(-1000000);
        expect(result.y).toBe(-2000000);
        expect(result.width).toBe(2000000);
        expect(result.height).toBe(4000000);
    });
});
