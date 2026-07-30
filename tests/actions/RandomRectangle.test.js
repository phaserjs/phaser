var RandomRectangle = require('../../src/actions/RandomRectangle');

describe('Phaser.Actions.RandomRectangle', function ()
{
    var rect;

    beforeEach(function ()
    {
        rect = { x: 10, y: 20, width: 100, height: 50 };
    });

    it('should return the items array', function ()
    {
        var items = [{ x: 0, y: 0 }];

        var result = RandomRectangle(items, rect);

        expect(result).toBe(items);
    });

    it('should return an empty array unchanged when given no items', function ()
    {
        var items = [];

        var result = RandomRectangle(items, rect);

        expect(result).toBe(items);
        expect(result.length).toBe(0);
    });

    it('should set x and y on each item', function ()
    {
        var items = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];

        RandomRectangle(items, rect);

        for (var i = 0; i < items.length; i++)
        {
            expect(typeof items[i].x).toBe('number');
            expect(typeof items[i].y).toBe('number');
        }
    });

    it('should position items within the rectangle x bounds', function ()
    {
        var items = [];

        for (var i = 0; i < 100; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomRectangle(items, rect);

        for (var j = 0; j < items.length; j++)
        {
            expect(items[j].x).toBeGreaterThanOrEqual(rect.x);
            expect(items[j].x).toBeLessThan(rect.x + rect.width);
        }
    });

    it('should position items within the rectangle y bounds', function ()
    {
        var items = [];

        for (var i = 0; i < 100; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomRectangle(items, rect);

        for (var j = 0; j < items.length; j++)
        {
            expect(items[j].y).toBeGreaterThanOrEqual(rect.y);
            expect(items[j].y).toBeLessThan(rect.y + rect.height);
        }
    });

    it('should handle a rectangle with zero width and height', function ()
    {
        var zeroRect = { x: 5, y: 7, width: 0, height: 0 };
        var items = [{ x: 0, y: 0 }, { x: 0, y: 0 }];

        RandomRectangle(items, zeroRect);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBe(5);
            expect(items[i].y).toBe(7);
        }
    });

    it('should handle a rectangle at the origin', function ()
    {
        var originRect = { x: 0, y: 0, width: 50, height: 50 };
        var items = [];

        for (var i = 0; i < 50; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomRectangle(items, originRect);

        for (var j = 0; j < items.length; j++)
        {
            expect(items[j].x).toBeGreaterThanOrEqual(0);
            expect(items[j].x).toBeLessThan(50);
            expect(items[j].y).toBeGreaterThanOrEqual(0);
            expect(items[j].y).toBeLessThan(50);
        }
    });

    it('should handle a rectangle with negative coordinates', function ()
    {
        var negRect = { x: -100, y: -50, width: 80, height: 40 };
        var items = [];

        for (var i = 0; i < 50; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomRectangle(items, negRect);

        for (var j = 0; j < items.length; j++)
        {
            expect(items[j].x).toBeGreaterThanOrEqual(-100);
            expect(items[j].x).toBeLessThan(-20);
            expect(items[j].y).toBeGreaterThanOrEqual(-50);
            expect(items[j].y).toBeLessThan(-10);
        }
    });

    it('should mutate items in place rather than creating new objects', function ()
    {
        var item = { x: 0, y: 0 };
        var items = [item];

        RandomRectangle(items, rect);

        expect(items[0]).toBe(item);
    });

    it('should produce varied positions across multiple items', function ()
    {
        var items = [];

        for (var i = 0; i < 20; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomRectangle(items, rect);

        var allSameX = true;
        var allSameY = true;

        for (var j = 1; j < items.length; j++)
        {
            if (items[j].x !== items[0].x)
            {
                allSameX = false;
            }

            if (items[j].y !== items[0].y)
            {
                allSameY = false;
            }
        }

        expect(allSameX).toBe(false);
        expect(allSameY).toBe(false);
    });
});
