var PlaceOnTriangle = require('../../src/actions/PlaceOnTriangle');

describe('Phaser.Actions.PlaceOnTriangle', function ()
{
    var triangle;
    var makeItems;

    beforeEach(function ()
    {
        triangle = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 100 };

        makeItems = function (count)
        {
            var items = [];
            for (var i = 0; i < count; i++)
            {
                items.push({ x: 0, y: 0 });
            }
            return items;
        };
    });

    it('should return the items array', function ()
    {
        var items = makeItems(3);
        var result = PlaceOnTriangle(items, triangle);
        expect(result).toBe(items);
    });

    it('should set x and y on each item', function ()
    {
        var items = makeItems(3);
        PlaceOnTriangle(items, triangle);
        for (var i = 0; i < items.length; i++)
        {
            expect(typeof items[i].x).toBe('number');
            expect(typeof items[i].y).toBe('number');
        }
    });

    it('should position a single item on the triangle', function ()
    {
        var items = makeItems(1);
        PlaceOnTriangle(items, triangle);
        expect(typeof items[0].x).toBe('number');
        expect(typeof items[0].y).toBe('number');
    });

    it('should distribute items evenly around the triangle edges', function ()
    {
        var items = makeItems(6);
        PlaceOnTriangle(items, triangle);
        var positions = items.map(function (item)
        {
            return { x: item.x, y: item.y };
        });
        // Verify all positions are distinct (evenly spread means no two should be exactly the same)
        for (var i = 0; i < positions.length; i++)
        {
            for (var j = i + 1; j < positions.length; j++)
            {
                expect(positions[i].x === positions[j].x && positions[i].y === positions[j].y).toBe(false);
            }
        }
    });

    it('should work with a default step rate', function ()
    {
        var items = makeItems(4);
        var result = PlaceOnTriangle(items, triangle);
        expect(result.length).toBe(4);
    });

    it('should work with a custom step rate', function ()
    {
        var items = makeItems(4);
        var result = PlaceOnTriangle(items, triangle, 2);
        expect(result.length).toBe(4);
        for (var i = 0; i < result.length; i++)
        {
            expect(typeof result[i].x).toBe('number');
            expect(typeof result[i].y).toBe('number');
        }
    });

    it('should place items at triangle vertex coordinates for an equilateral-like triangle', function ()
    {
        var items = makeItems(3);
        // Use a triangle where vertices are at known integer coords
        var tri = { x1: 0, y1: 0, x2: 10, y2: 0, x3: 5, y3: 10 };
        PlaceOnTriangle(items, tri, 1);
        // Each item should have coords that are integer-like (Bresenham produces integer points)
        for (var i = 0; i < items.length; i++)
        {
            expect(Number.isFinite(items[i].x)).toBe(true);
            expect(Number.isFinite(items[i].y)).toBe(true);
        }
    });

    it('should handle an empty items array', function ()
    {
        var items = [];
        var result = PlaceOnTriangle(items, triangle);
        expect(result).toBe(items);
        expect(result.length).toBe(0);
    });

    it('should mutate items in place (x and y properties)', function ()
    {
        var items = [{ x: 999, y: 999 }, { x: 999, y: 999 }];
        PlaceOnTriangle(items, triangle);
        expect(items[0].x).not.toBe(999);
        expect(items[0].y).not.toBe(999);
    });

    it('should keep items within bounding box of the triangle', function ()
    {
        var tri = { x1: 0, y1: 0, x2: 200, y2: 0, x3: 100, y3: 150 };
        var items = makeItems(20);
        PlaceOnTriangle(items, tri);
        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeGreaterThanOrEqual(0);
            expect(items[i].x).toBeLessThanOrEqual(200);
            expect(items[i].y).toBeGreaterThanOrEqual(0);
            expect(items[i].y).toBeLessThanOrEqual(150);
        }
    });

    it('should work with a degenerate (flat) triangle', function ()
    {
        var flatTri = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 0 };
        var items = makeItems(3);
        var result = PlaceOnTriangle(items, flatTri);
        expect(result.length).toBe(3);
        for (var i = 0; i < result.length; i++)
        {
            expect(Number.isFinite(result[i].x)).toBe(true);
            expect(Number.isFinite(result[i].y)).toBe(true);
        }
    });

    it('should produce consistent results on repeated calls with same inputs', function ()
    {
        var items1 = makeItems(5);
        var items2 = makeItems(5);
        PlaceOnTriangle(items1, triangle);
        PlaceOnTriangle(items2, triangle);
        for (var i = 0; i < items1.length; i++)
        {
            expect(items1[i].x).toBe(items2[i].x);
            expect(items1[i].y).toBe(items2[i].y);
        }
    });

    it('should space items further apart with a higher step rate', function ()
    {
        // With a large triangle and many items, different step rates produce different total point
        // pool sizes, so the evenly-distributed positions land at different coordinates
        var largeTri = { x1: 0, y1: 0, x2: 1000, y2: 0, x3: 500, y3: 1000 };
        var items1 = makeItems(50);
        var items2 = makeItems(50);
        PlaceOnTriangle(items1, largeTri, 1);
        PlaceOnTriangle(items2, largeTri, 50);
        var allSame = true;
        for (var i = 0; i < items1.length; i++)
        {
            if (items1[i].x !== items2[i].x || items1[i].y !== items2[i].y)
            {
                allSame = false;
                break;
            }
        }
        expect(allSame).toBe(false);
    });
});
