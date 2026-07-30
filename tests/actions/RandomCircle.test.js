var RandomCircle = require('../../src/actions/RandomCircle');

describe('Phaser.Actions.RandomCircle', function ()
{
    var circle;
    var items;

    beforeEach(function ()
    {
        circle = { x: 0, y: 0, radius: 100 };
        items = [];
    });

    it('should return the items array', function ()
    {
        var result = RandomCircle(items, circle);

        expect(result).toBe(items);
    });

    it('should return an empty array when given an empty array', function ()
    {
        var result = RandomCircle([], circle);

        expect(result).toEqual([]);
    });

    it('should set x and y on each item', function ()
    {
        var item = { x: 0, y: 0 };
        items.push(item);

        RandomCircle(items, circle);

        expect(typeof item.x).toBe('number');
        expect(typeof item.y).toBe('number');
    });

    it('should position items within the circle radius', function ()
    {
        for (var i = 0; i < 20; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomCircle(items, circle);

        for (var j = 0; j < items.length; j++)
        {
            var dx = items[j].x - circle.x;
            var dy = items[j].y - circle.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            expect(dist).toBeLessThanOrEqual(circle.radius + 0.0001);
        }
    });

    it('should position items relative to circle center', function ()
    {
        circle = { x: 200, y: 300, radius: 50 };

        for (var i = 0; i < 20; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomCircle(items, circle);

        for (var j = 0; j < items.length; j++)
        {
            var dx = items[j].x - circle.x;
            var dy = items[j].y - circle.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            expect(dist).toBeLessThanOrEqual(circle.radius + 0.0001);
        }
    });

    it('should set all items within a zero-radius circle to the circle center', function ()
    {
        circle = { x: 50, y: 75, radius: 0 };
        items = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];

        RandomCircle(items, circle);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeCloseTo(circle.x, 5);
            expect(items[i].y).toBeCloseTo(circle.y, 5);
        }
    });

    it('should process multiple items', function ()
    {
        var count = 10;

        for (var i = 0; i < count; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomCircle(items, circle);

        expect(items.length).toBe(count);

        for (var j = 0; j < items.length; j++)
        {
            expect(typeof items[j].x).toBe('number');
            expect(typeof items[j].y).toBe('number');
        }
    });

    it('should not produce all identical positions across many items', function ()
    {
        circle = { x: 0, y: 0, radius: 100 };

        for (var i = 0; i < 50; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomCircle(items, circle);

        var allSame = true;
        var firstX = items[0].x;
        var firstY = items[0].y;

        for (var j = 1; j < items.length; j++)
        {
            if (items[j].x !== firstX || items[j].y !== firstY)
            {
                allSame = false;
                break;
            }
        }

        expect(allSame).toBe(false);
    });

    it('should work with a large radius', function ()
    {
        circle = { x: 0, y: 0, radius: 10000 };

        for (var i = 0; i < 10; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomCircle(items, circle);

        for (var j = 0; j < items.length; j++)
        {
            var dx = items[j].x - circle.x;
            var dy = items[j].y - circle.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            expect(dist).toBeLessThanOrEqual(circle.radius + 0.0001);
        }
    });

    it('should work with negative circle center coordinates', function ()
    {
        circle = { x: -500, y: -300, radius: 100 };

        for (var i = 0; i < 10; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomCircle(items, circle);

        for (var j = 0; j < items.length; j++)
        {
            var dx = items[j].x - circle.x;
            var dy = items[j].y - circle.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            expect(dist).toBeLessThanOrEqual(circle.radius + 0.0001);
        }
    });
});
