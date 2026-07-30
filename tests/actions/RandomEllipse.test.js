var RandomEllipse = require('../../src/actions/RandomEllipse');

describe('Phaser.Actions.RandomEllipse', function ()
{
    var ellipse;
    var items;

    beforeEach(function ()
    {
        ellipse = { x: 0, y: 0, width: 200, height: 100 };
        items = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = RandomEllipse(items, ellipse);

        expect(result).toBe(items);
    });

    it('should return an empty array unchanged', function ()
    {
        var result = RandomEllipse([], ellipse);

        expect(result).toEqual([]);
    });

    it('should set x and y on each item', function ()
    {
        RandomEllipse(items, ellipse);

        for (var i = 0; i < items.length; i++)
        {
            expect(typeof items[i].x).toBe('number');
            expect(typeof items[i].y).toBe('number');
        }
    });

    it('should position items within the ellipse bounds', function ()
    {
        var halfW = ellipse.width / 2;
        var halfH = ellipse.height / 2;

        for (var run = 0; run < 50; run++)
        {
            RandomEllipse(items, ellipse);

            for (var i = 0; i < items.length; i++)
            {
                var dx = (items[i].x - ellipse.x) / halfW;
                var dy = (items[i].y - ellipse.y) / halfH;

                expect(dx * dx + dy * dy).toBeLessThanOrEqual(1 + 1e-10);
            }
        }
    });

    it('should respect a non-zero ellipse center', function ()
    {
        var offsetEllipse = { x: 100, y: 200, width: 50, height: 50 };
        var halfW = offsetEllipse.width / 2;
        var halfH = offsetEllipse.height / 2;

        for (var run = 0; run < 50; run++)
        {
            RandomEllipse(items, offsetEllipse);

            for (var i = 0; i < items.length; i++)
            {
                var dx = (items[i].x - offsetEllipse.x) / halfW;
                var dy = (items[i].y - offsetEllipse.y) / halfH;

                expect(dx * dx + dy * dy).toBeLessThanOrEqual(1 + 1e-10);
            }
        }
    });

    it('should handle a single item array', function ()
    {
        var single = [{ x: 0, y: 0 }];
        var result = RandomEllipse(single, ellipse);

        expect(result).toBe(single);
        expect(typeof single[0].x).toBe('number');
        expect(typeof single[0].y).toBe('number');
    });

    it('should mutate each item in place', function ()
    {
        var item = { x: 999, y: 999 };
        RandomEllipse([item], ellipse);

        expect(item.x).not.toBe(999);
        expect(item.y).not.toBe(999);
    });

    it('should spread points across both halves of the ellipse over many iterations', function ()
    {
        var single = [{ x: 0, y: 0 }];
        var leftCount = 0;
        var rightCount = 0;
        var iterations = 200;

        for (var i = 0; i < iterations; i++)
        {
            RandomEllipse(single, ellipse);
            if (single[0].x < ellipse.x)
            {
                leftCount++;
            }
            else
            {
                rightCount++;
            }
        }

        expect(leftCount).toBeGreaterThan(0);
        expect(rightCount).toBeGreaterThan(0);
    });
});
