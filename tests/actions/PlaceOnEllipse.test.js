var PlaceOnEllipse = require('../../src/actions/PlaceOnEllipse');

describe('Phaser.Actions.PlaceOnEllipse', function ()
{
    var ellipse;
    var items;

    beforeEach(function ()
    {
        ellipse = { x: 0, y: 0, width: 200, height: 100 };
        items = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = PlaceOnEllipse(items, ellipse);
        expect(result).toBe(items);
    });

    it('should position items using default startAngle of 0 and endAngle of 6.28', function ()
    {
        var single = [{ x: 0, y: 0 }];
        PlaceOnEllipse(single, ellipse);
        expect(single[0].x).toBeCloseTo(ellipse.x + (ellipse.width / 2) * Math.cos(0), 5);
        expect(single[0].y).toBeCloseTo(ellipse.y + (ellipse.height / 2) * Math.sin(0), 5);
    });

    it('should evenly space items around the ellipse perimeter', function ()
    {
        PlaceOnEllipse(items, ellipse);
        var a = ellipse.width / 2;
        var b = ellipse.height / 2;
        var angleStep = 6.28 / items.length;

        for (var i = 0; i < items.length; i++)
        {
            var angle = i * angleStep;
            expect(items[i].x).toBeCloseTo(ellipse.x + a * Math.cos(angle), 5);
            expect(items[i].y).toBeCloseTo(ellipse.y + b * Math.sin(angle), 5);
        }
    });

    it('should respect a custom startAngle', function ()
    {
        var startAngle = Math.PI / 2;
        PlaceOnEllipse(items, ellipse, startAngle);
        var a = ellipse.width / 2;
        var b = ellipse.height / 2;
        expect(items[0].x).toBeCloseTo(ellipse.x + a * Math.cos(startAngle), 5);
        expect(items[0].y).toBeCloseTo(ellipse.y + b * Math.sin(startAngle), 5);
    });

    it('should respect a custom endAngle', function ()
    {
        var startAngle = 0;
        var endAngle = Math.PI;
        PlaceOnEllipse(items, ellipse, startAngle, endAngle);
        var a = ellipse.width / 2;
        var b = ellipse.height / 2;
        var angleStep = (endAngle - startAngle) / items.length;

        for (var i = 0; i < items.length; i++)
        {
            var angle = startAngle + i * angleStep;
            expect(items[i].x).toBeCloseTo(ellipse.x + a * Math.cos(angle), 5);
            expect(items[i].y).toBeCloseTo(ellipse.y + b * Math.sin(angle), 5);
        }
    });

    it('should respect both custom startAngle and endAngle', function ()
    {
        var startAngle = Math.PI / 4;
        var endAngle = Math.PI * 1.5;
        PlaceOnEllipse(items, ellipse, startAngle, endAngle);
        var a = ellipse.width / 2;
        var b = ellipse.height / 2;
        var angleStep = (endAngle - startAngle) / items.length;

        for (var i = 0; i < items.length; i++)
        {
            var angle = startAngle + i * angleStep;
            expect(items[i].x).toBeCloseTo(ellipse.x + a * Math.cos(angle), 5);
            expect(items[i].y).toBeCloseTo(ellipse.y + b * Math.sin(angle), 5);
        }
    });

    it('should use ellipse x and y as the center offset', function ()
    {
        ellipse.x = 100;
        ellipse.y = 200;
        var single = [{ x: 0, y: 0 }];
        PlaceOnEllipse(single, ellipse, 0, 6.28);
        var a = ellipse.width / 2;
        expect(single[0].x).toBeCloseTo(100 + a * Math.cos(0), 5);
        expect(single[0].y).toBeCloseTo(200, 5);
    });

    it('should scale positions by ellipse width and height', function ()
    {
        var wideEllipse = { x: 0, y: 0, width: 400, height: 200 };
        var tallEllipse = { x: 0, y: 0, width: 100, height: 600 };
        var single1 = [{ x: 0, y: 0 }];
        var single2 = [{ x: 0, y: 0 }];

        PlaceOnEllipse(single1, wideEllipse, 0, 6.28);
        PlaceOnEllipse(single2, tallEllipse, 0, 6.28);

        expect(single1[0].x).toBeCloseTo(200, 5);
        expect(single2[0].x).toBeCloseTo(50, 5);
    });

    it('should handle a single item', function ()
    {
        var single = [{ x: 0, y: 0 }];
        var result = PlaceOnEllipse(single, ellipse);
        expect(result).toBe(single);
        expect(single[0].x).toBeCloseTo(ellipse.x + (ellipse.width / 2) * Math.cos(0), 5);
        expect(single[0].y).toBeCloseTo(ellipse.y + (ellipse.height / 2) * Math.sin(0), 5);
    });

    it('should handle a large number of items', function ()
    {
        var manyItems = [];
        for (var i = 0; i < 100; i++)
        {
            manyItems.push({ x: 0, y: 0 });
        }
        var result = PlaceOnEllipse(manyItems, ellipse);
        expect(result).toBe(manyItems);
        expect(result.length).toBe(100);

        var a = ellipse.width / 2;
        var b = ellipse.height / 2;
        var angleStep = 6.28 / manyItems.length;
        for (var j = 0; j < manyItems.length; j++)
        {
            var angle = j * angleStep;
            expect(manyItems[j].x).toBeCloseTo(ellipse.x + a * Math.cos(angle), 5);
            expect(manyItems[j].y).toBeCloseTo(ellipse.y + b * Math.sin(angle), 5);
        }
    });

    it('should handle a circular ellipse (equal width and height)', function ()
    {
        var circle = { x: 0, y: 0, width: 100, height: 100 };
        var two = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
        PlaceOnEllipse(two, circle, 0, Math.PI * 2);
        expect(two[0].x).toBeCloseTo(50, 5);
        expect(two[0].y).toBeCloseTo(0, 5);
        expect(two[1].x).toBeCloseTo(-50, 5);
        expect(two[1].y).toBeCloseTo(0, 5);
    });

    it('should mutate items in place', function ()
    {
        var item = { x: 999, y: 999 };
        PlaceOnEllipse([item], ellipse);
        expect(item.x).not.toBe(999);
        expect(item.y).not.toBe(999);
    });

    it('should place first item at startAngle and not at endAngle', function ()
    {
        var startAngle = 1;
        var endAngle = 3;
        var single = [{ x: 0, y: 0 }];
        PlaceOnEllipse(single, ellipse, startAngle, endAngle);
        var a = ellipse.width / 2;
        var b = ellipse.height / 2;
        expect(single[0].x).toBeCloseTo(ellipse.x + a * Math.cos(startAngle), 5);
        expect(single[0].y).toBeCloseTo(ellipse.y + b * Math.sin(startAngle), 5);
    });

    it('should handle negative x and y ellipse center', function ()
    {
        var negEllipse = { x: -50, y: -100, width: 200, height: 100 };
        var single = [{ x: 0, y: 0 }];
        PlaceOnEllipse(single, negEllipse, 0, 6.28);
        expect(single[0].x).toBeCloseTo(-50 + 100 * Math.cos(0), 5);
        expect(single[0].y).toBeCloseTo(-100 + 50 * Math.sin(0), 5);
    });
});
