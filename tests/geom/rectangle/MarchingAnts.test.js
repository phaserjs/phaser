var MarchingAnts = require('../../../src/geom/rectangle/MarchingAnts');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Rectangle.MarchingAnts', function ()
{
    // Helper: create a plain rectangle mock with all required properties
    function makeRect (x, y, width, height)
    {
        return {
            x: x,
            y: y,
            width: width,
            height: height,
            left: x,
            top: y,
            right: x + width,
            bottom: y + height
        };
    }

    describe('return value', function ()
    {
        it('should return an array', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 10);
            expect(Array.isArray(result)).toBe(true);
        });

        it('should return an empty array when step and quantity are both omitted', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect);
            expect(result).toEqual([]);
        });

        it('should return an empty array when step is 0 and quantity is 0', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 0, 0);
            expect(result).toEqual([]);
        });

        it('should return an empty array when step is null and quantity is null', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, null, null);
            expect(result).toEqual([]);
        });

        it('should use the provided out array rather than creating a new one', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var out = [];
            var result = MarchingAnts(rect, 100, null, out);
            expect(result).toBe(out);
        });

        it('should append to an existing out array', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var existing = new Vector2(999, 999);
            var out = [ existing ];
            MarchingAnts(rect, 100, null, out);
            expect(out[0]).toBe(existing);
            expect(out.length).toBeGreaterThan(1);
        });
    });

    describe('quantity derived from step', function ()
    {
        it('should return quantity = perimeter / step points when step is provided', function ()
        {
            // perimeter of 100x100 = 400, step=10 => 40 points
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 10);
            expect(result.length).toBe(40);
        });

        it('should return 4 points for step equal to one quarter of the perimeter', function ()
        {
            // perimeter = 400, step=100 => 4 points
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 100);
            expect(result.length).toBe(4);
        });

        it('should round the derived quantity', function ()
        {
            // perimeter of 10x10 = 40, step=3 => 40/3 = 13.33 => rounds to 13
            var rect = makeRect(0, 0, 10, 10);
            var result = MarchingAnts(rect, 3);
            expect(result.length).toBe(Math.round(40 / 3));
        });
    });

    describe('step derived from quantity', function ()
    {
        it('should return exactly `quantity` points when step is omitted', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, null, 8);
            expect(result.length).toBe(8);
        });

        it('should return exactly `quantity` points when step is 0', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 0, 16);
            expect(result.length).toBe(16);
        });

        it('should return 1 point when quantity is 1', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, null, 1);
            expect(result.length).toBe(1);
        });
    });

    describe('point types', function ()
    {
        it('should return Vector2 instances', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 100);
            for (var i = 0; i < result.length; i++)
            {
                expect(result[i] instanceof Vector2).toBe(true);
            }
        });

        it('should return points with numeric x and y properties', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 50);
            for (var i = 0; i < result.length; i++)
            {
                expect(typeof result[i].x).toBe('number');
                expect(typeof result[i].y).toBe('number');
            }
        });
    });

    describe('point positions on perimeter', function ()
    {
        it('should start at the top-left corner of the rectangle', function ()
        {
            var rect = makeRect(10, 20, 100, 50);
            var result = MarchingAnts(rect, 10);
            expect(result[0].x).toBe(10);
            expect(result[0].y).toBe(20);
        });

        it('should start at the top-left corner for a zero-origin rectangle', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 100);
            expect(result[0].x).toBe(0);
            expect(result[0].y).toBe(0);
        });

        it('should place the second point (step=side length) at the top-right corner', function ()
        {
            // step=100 on a 100x100 rect => corners at indices 0,1,2,3
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 100);
            expect(result[1].x).toBeCloseTo(100);
            expect(result[1].y).toBeCloseTo(0);
        });

        it('should place the third point (step=side length) at the bottom-right corner', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 100);
            expect(result[2].x).toBeCloseTo(100);
            expect(result[2].y).toBeCloseTo(100);
        });

        it('should place the fourth point (step=side length) at the bottom-left corner', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 100);
            expect(result[3].x).toBeCloseTo(0);
            expect(result[3].y).toBeCloseTo(100);
        });

        it('should keep all points within the bounding box of the rectangle', function ()
        {
            var rect = makeRect(5, 10, 80, 60);
            var result = MarchingAnts(rect, 5);
            for (var i = 0; i < result.length; i++)
            {
                expect(result[i].x).toBeGreaterThanOrEqual(rect.left);
                expect(result[i].x).toBeLessThanOrEqual(rect.right);
                expect(result[i].y).toBeGreaterThanOrEqual(rect.top);
                expect(result[i].y).toBeLessThanOrEqual(rect.bottom);
            }
        });

        it('should place midpoint of top edge correctly', function ()
        {
            // step=50 on 100x100: first point at (0,0), second at (50,0)
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 50);
            expect(result[1].x).toBeCloseTo(50);
            expect(result[1].y).toBeCloseTo(0);
        });
    });

    describe('non-square rectangles', function ()
    {
        it('should handle wide rectangles correctly', function ()
        {
            // 200x50 rect, perimeter=500, step=50 => 10 points
            var rect = makeRect(0, 0, 200, 50);
            var result = MarchingAnts(rect, 50);
            expect(result.length).toBe(10);
        });

        it('should handle tall rectangles correctly', function ()
        {
            // 50x200 rect, perimeter=500, step=50 => 10 points
            var rect = makeRect(0, 0, 50, 200);
            var result = MarchingAnts(rect, 50);
            expect(result.length).toBe(10);
        });

        it('should start at the rect origin for an offset rectangle', function ()
        {
            var rect = makeRect(50, 75, 200, 100);
            var result = MarchingAnts(rect, 25);
            expect(result[0].x).toBe(50);
            expect(result[0].y).toBe(75);
        });

        it('should confine all points to the offset rectangle bounds', function ()
        {
            var rect = makeRect(50, 75, 200, 100);
            var result = MarchingAnts(rect, 25);
            for (var i = 0; i < result.length; i++)
            {
                expect(result[i].x).toBeGreaterThanOrEqual(rect.left);
                expect(result[i].x).toBeLessThanOrEqual(rect.right);
                expect(result[i].y).toBeGreaterThanOrEqual(rect.top);
                expect(result[i].y).toBeLessThanOrEqual(rect.bottom);
            }
        });
    });

    describe('edge cases', function ()
    {
        it('should handle a very small step producing many points', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 1);
            expect(result.length).toBe(400);
        });

        it('should handle a step larger than the perimeter', function ()
        {
            // perimeter=40, step=50 => quantity = round(40/50) = round(0.8) = 1
            var rect = makeRect(0, 0, 10, 10);
            var result = MarchingAnts(rect, 50);
            expect(result.length).toBe(1);
            expect(result[0].x).toBe(0);
            expect(result[0].y).toBe(0);
        });

        it('should handle a 1x1 rectangle', function ()
        {
            var rect = makeRect(0, 0, 1, 1);
            var result = MarchingAnts(rect, null, 4);
            expect(result.length).toBe(4);
            for (var i = 0; i < result.length; i++)
            {
                expect(result[i].x).toBeGreaterThanOrEqual(0);
                expect(result[i].x).toBeLessThanOrEqual(1);
                expect(result[i].y).toBeGreaterThanOrEqual(0);
                expect(result[i].y).toBeLessThanOrEqual(1);
            }
        });

        it('should handle floating point step values', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 7.5);
            // perimeter=400, 400/7.5 = 53.33 => 53 points
            expect(result.length).toBe(Math.round(400 / 7.5));
        });

        it('should return empty array when quantity is 0 and step is 0', function ()
        {
            var rect = makeRect(0, 0, 100, 100);
            var result = MarchingAnts(rect, 0, 0);
            expect(result.length).toBe(0);
        });

        it('should not mutate the rectangle', function ()
        {
            var rect = makeRect(10, 20, 100, 50);
            var origX = rect.x;
            var origY = rect.y;
            var origWidth = rect.width;
            var origHeight = rect.height;
            MarchingAnts(rect, 10);
            expect(rect.x).toBe(origX);
            expect(rect.y).toBe(origY);
            expect(rect.width).toBe(origWidth);
            expect(rect.height).toBe(origHeight);
        });
    });
});
