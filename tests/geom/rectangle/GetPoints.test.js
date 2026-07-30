var GetPoints = require('../../../src/geom/rectangle/GetPoints');

describe('Phaser.Geom.Rectangle.GetPoints', function ()
{
    var rect;

    beforeEach(function ()
    {
        rect = { x: 0, y: 0, width: 100, height: 100, left: 0, right: 100, top: 0, bottom: 100 };
    });

    it('should return an empty array when quantity is zero and no stepRate given', function ()
    {
        var result = GetPoints(rect, 0);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return the correct number of points for a given quantity', function ()
    {
        var result = GetPoints(rect, 4);

        expect(result.length).toBe(4);
    });

    it('should return an array of objects with x and y properties', function ()
    {
        var result = GetPoints(rect, 4);

        for (var i = 0; i < result.length; i++)
        {
            expect(typeof result[i].x).toBe('number');
            expect(typeof result[i].y).toBe('number');
        }
    });

    it('should use stepRate to calculate quantity when quantity is falsey', function ()
    {
        // Perimeter of 100x100 rect = 400; stepRate = 100 => 4 points
        var result = GetPoints(rect, 0, 100);

        expect(result.length).toBe(4);
    });

    it('should use stepRate when quantity is null', function ()
    {
        // Perimeter = 400; stepRate = 50 => 8 points
        var result = GetPoints(rect, null, 50);

        expect(result.length).toBe(8);
    });

    it('should use stepRate when quantity is undefined', function ()
    {
        var result = GetPoints(rect, undefined, 200);

        // Perimeter = 400; stepRate = 200 => 2 points
        expect(result.length).toBe(2);
    });

    it('should ignore stepRate when quantity is positive', function ()
    {
        var result = GetPoints(rect, 10, 1);

        expect(result.length).toBe(10);
    });

    it('should push points into the provided out array', function ()
    {
        var out = [];
        var result = GetPoints(rect, 4, 0, out);

        expect(result).toBe(out);
        expect(out.length).toBe(4);
    });

    it('should append to an existing out array', function ()
    {
        var existing = [{ x: 0, y: 0 }];
        var result = GetPoints(rect, 4, 0, existing);

        expect(result.length).toBe(5);
        expect(result).toBe(existing);
    });

    it('should return a new array when out is not provided', function ()
    {
        var result = GetPoints(rect, 4);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return points evenly distributed around the perimeter', function ()
    {
        // For a 100x100 rect: perimeter = 400
        // 4 points at positions 0, 0.25, 0.5, 0.75
        // position 0 = top-left corner (0, 0)
        // position 0.25 = top-right corner (100, 0)
        // position 0.5 = bottom-right corner (100, 100)
        // position 0.75 = bottom-left corner (0, 100)
        var result = GetPoints(rect, 4);

        expect(result[0].x).toBeCloseTo(0);
        expect(result[0].y).toBeCloseTo(0);

        expect(result[1].x).toBeCloseTo(100);
        expect(result[1].y).toBeCloseTo(0);

        expect(result[2].x).toBeCloseTo(100);
        expect(result[2].y).toBeCloseTo(100);

        expect(result[3].x).toBeCloseTo(0);
        expect(result[3].y).toBeCloseTo(100);
    });

    it('should work with a non-square rectangle', function ()
    {
        var wideRect = { x: 0, y: 0, width: 200, height: 50, left: 0, right: 200, top: 0, bottom: 50 };
        // Perimeter = 500; stepRate = 125 => 4 points
        var result = GetPoints(wideRect, 0, 125);

        expect(result.length).toBe(4);
    });

    it('should work with a rectangle offset from origin', function ()
    {
        var offsetRect = { x: 50, y: 50, width: 100, height: 100, left: 50, right: 150, top: 50, bottom: 150 };
        var result = GetPoints(offsetRect, 4);

        expect(result.length).toBe(4);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].x).toBeGreaterThanOrEqual(50);
            expect(result[i].x).toBeLessThanOrEqual(150);
            expect(result[i].y).toBeGreaterThanOrEqual(50);
            expect(result[i].y).toBeLessThanOrEqual(150);
        }
    });

    it('should return 1 point when quantity is 1', function ()
    {
        var result = GetPoints(rect, 1);

        expect(result.length).toBe(1);
        // position 0/1 = 0, which is top-left corner
        expect(result[0].x).toBeCloseTo(0);
        expect(result[0].y).toBeCloseTo(0);
    });

    it('should not add points when stepRate is zero and quantity is falsey', function ()
    {
        var result = GetPoints(rect, 0, 0);

        expect(result.length).toBe(0);
    });

    it('should not add points when stepRate is negative and quantity is falsey', function ()
    {
        var result = GetPoints(rect, 0, -10);

        expect(result.length).toBe(0);
    });
});
