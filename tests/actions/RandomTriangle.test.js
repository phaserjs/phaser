var RandomTriangle = require('../../src/actions/RandomTriangle');

describe('Phaser.Actions.RandomTriangle', function ()
{
    var triangle;
    var items;

    beforeEach(function ()
    {
        // A simple right triangle with vertices at (0,0), (100,0), (0,100)
        triangle = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 0, y3: 100 };

        items = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = RandomTriangle(items, triangle);

        expect(result).toBe(items);
    });

    it('should return an empty array unchanged when items is empty', function ()
    {
        var result = RandomTriangle([], triangle);

        expect(result).toEqual([]);
    });

    it('should set x and y on each item', function ()
    {
        RandomTriangle(items, triangle);

        for (var i = 0; i < items.length; i++)
        {
            expect(typeof items[i].x).toBe('number');
            expect(typeof items[i].y).toBe('number');
        }
    });

    it('should position items within the bounding box of the triangle', function ()
    {
        var largeItems = [];

        for (var i = 0; i < 100; i++)
        {
            largeItems.push({ x: 0, y: 0 });
        }

        RandomTriangle(largeItems, triangle);

        for (var j = 0; j < largeItems.length; j++)
        {
            expect(largeItems[j].x).toBeGreaterThanOrEqual(0);
            expect(largeItems[j].x).toBeLessThanOrEqual(100);
            expect(largeItems[j].y).toBeGreaterThanOrEqual(0);
            expect(largeItems[j].y).toBeLessThanOrEqual(100);
        }
    });

    it('should position items within the triangle (x + y <= 100 for right triangle at origin)', function ()
    {
        var largeItems = [];

        for (var i = 0; i < 200; i++)
        {
            largeItems.push({ x: 0, y: 0 });
        }

        RandomTriangle(largeItems, triangle);

        for (var j = 0; j < largeItems.length; j++)
        {
            expect(largeItems[j].x + largeItems[j].y).toBeLessThanOrEqual(100 + 1e-9);
        }
    });

    it('should work with a single item', function ()
    {
        var singleItem = [{ x: 0, y: 0 }];

        var result = RandomTriangle(singleItem, triangle);

        expect(result).toBe(singleItem);
        expect(typeof singleItem[0].x).toBe('number');
        expect(typeof singleItem[0].y).toBe('number');
    });

    it('should mutate x and y on items that start at non-zero positions', function ()
    {
        var item = { x: 500, y: 500 };

        RandomTriangle([item], triangle);

        expect(item.x).toBeGreaterThanOrEqual(0);
        expect(item.x).toBeLessThanOrEqual(100);
        expect(item.y).toBeGreaterThanOrEqual(0);
        expect(item.y).toBeLessThanOrEqual(100);
    });

    it('should work with a degenerate (zero-area) triangle where all vertices are the same point', function ()
    {
        var pointTriangle = { x1: 50, y1: 50, x2: 50, y2: 50, x3: 50, y3: 50 };
        var item = { x: 0, y: 0 };

        RandomTriangle([item], pointTriangle);

        expect(item.x).toBeCloseTo(50);
        expect(item.y).toBeCloseTo(50);
    });

    it('should work with a triangle using negative coordinates', function ()
    {
        var negTriangle = { x1: -100, y1: -100, x2: 0, y2: -100, x3: -100, y3: 0 };
        var largeItems = [];

        for (var i = 0; i < 100; i++)
        {
            largeItems.push({ x: 0, y: 0 });
        }

        RandomTriangle(largeItems, negTriangle);

        for (var j = 0; j < largeItems.length; j++)
        {
            expect(largeItems[j].x).toBeGreaterThanOrEqual(-100);
            expect(largeItems[j].x).toBeLessThanOrEqual(0);
            expect(largeItems[j].y).toBeGreaterThanOrEqual(-100);
            expect(largeItems[j].y).toBeLessThanOrEqual(0);
        }
    });

    it('should produce varied positions across multiple items (not all identical)', function ()
    {
        var manyItems = [];

        for (var i = 0; i < 50; i++)
        {
            manyItems.push({ x: 0, y: 0 });
        }

        RandomTriangle(manyItems, triangle);

        var allSame = true;
        var firstX = manyItems[0].x;
        var firstY = manyItems[0].y;

        for (var j = 1; j < manyItems.length; j++)
        {
            if (manyItems[j].x !== firstX || manyItems[j].y !== firstY)
            {
                allSame = false;
                break;
            }
        }

        expect(allSame).toBe(false);
    });
});
