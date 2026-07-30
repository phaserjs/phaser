var PlaceOnCircle = require('../../src/actions/PlaceOnCircle');

describe('Phaser.Actions.PlaceOnCircle', function ()
{
    var circle;
    var items;

    beforeEach(function ()
    {
        circle = { x: 0, y: 0, radius: 100 };
        items = [];
        for (var i = 0; i < 4; i++)
        {
            items.push({ x: 0, y: 0 });
        }
    });

    it('should return the items array', function ()
    {
        var result = PlaceOnCircle(items, circle);
        expect(result).toBe(items);
    });

    it('should position items evenly around the circle with default angles', function ()
    {
        PlaceOnCircle(items, circle);
        var angleStep = 6.28 / items.length;

        for (var i = 0; i < items.length; i++)
        {
            var angle = i * angleStep;
            expect(items[i].x).toBeCloseTo(circle.radius * Math.cos(angle), 5);
            expect(items[i].y).toBeCloseTo(circle.radius * Math.sin(angle), 5);
        }
    });

    it('should use the circle center as the origin', function ()
    {
        circle.x = 200;
        circle.y = 300;
        PlaceOnCircle(items, circle);

        for (var i = 0; i < items.length; i++)
        {
            var dx = items[i].x - circle.x;
            var dy = items[i].y - circle.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            expect(dist).toBeCloseTo(circle.radius, 5);
        }
    });

    it('should use the circle radius', function ()
    {
        circle.radius = 50;
        PlaceOnCircle(items, circle);

        for (var i = 0; i < items.length; i++)
        {
            var dx = items[i].x - circle.x;
            var dy = items[i].y - circle.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            expect(dist).toBeCloseTo(50, 5);
        }
    });

    it('should respect a custom startAngle', function ()
    {
        var startAngle = Math.PI / 2;
        PlaceOnCircle(items, circle, startAngle);

        expect(items[0].x).toBeCloseTo(circle.radius * Math.cos(startAngle), 5);
        expect(items[0].y).toBeCloseTo(circle.radius * Math.sin(startAngle), 5);
    });

    it('should respect a custom endAngle', function ()
    {
        var startAngle = 0;
        var endAngle = Math.PI;
        PlaceOnCircle(items, circle, startAngle, endAngle);

        var angleStep = (endAngle - startAngle) / items.length;

        for (var i = 0; i < items.length; i++)
        {
            var angle = startAngle + i * angleStep;
            expect(items[i].x).toBeCloseTo(circle.radius * Math.cos(angle), 5);
            expect(items[i].y).toBeCloseTo(circle.radius * Math.sin(angle), 5);
        }
    });

    it('should place a single item at the startAngle', function ()
    {
        var single = [{ x: 0, y: 0 }];
        PlaceOnCircle(single, circle, 0, 6.28);

        expect(single[0].x).toBeCloseTo(circle.radius * Math.cos(0), 5);
        expect(single[0].y).toBeCloseTo(circle.radius * Math.sin(0), 5);
    });

    it('should handle a circle with zero radius', function ()
    {
        circle.radius = 0;
        PlaceOnCircle(items, circle);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeCloseTo(circle.x, 5);
            expect(items[i].y).toBeCloseTo(circle.y, 5);
        }
    });

    it('should handle startAngle equal to endAngle', function ()
    {
        var angle = Math.PI / 4;
        PlaceOnCircle(items, circle, angle, angle);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeCloseTo(circle.radius * Math.cos(angle), 5);
            expect(items[i].y).toBeCloseTo(circle.radius * Math.sin(angle), 5);
        }
    });

    it('should handle negative startAngle', function ()
    {
        var startAngle = -Math.PI;
        PlaceOnCircle(items, circle, startAngle, 0);

        var angleStep = (0 - startAngle) / items.length;

        for (var i = 0; i < items.length; i++)
        {
            var angle = startAngle + i * angleStep;
            expect(items[i].x).toBeCloseTo(circle.radius * Math.cos(angle), 5);
            expect(items[i].y).toBeCloseTo(circle.radius * Math.sin(angle), 5);
        }
    });

    it('should distribute items across a partial arc', function ()
    {
        var startAngle = 0;
        var endAngle = Math.PI / 2;
        PlaceOnCircle(items, circle, startAngle, endAngle);

        var angleStep = (endAngle - startAngle) / items.length;

        expect(items[0].x).toBeCloseTo(circle.radius * Math.cos(0), 5);
        expect(items[0].y).toBeCloseTo(circle.radius * Math.sin(0), 5);

        expect(items[items.length - 1].x).toBeCloseTo(circle.radius * Math.cos((items.length - 1) * angleStep), 5);
        expect(items[items.length - 1].y).toBeCloseTo(circle.radius * Math.sin((items.length - 1) * angleStep), 5);
    });

    it('should not modify items beyond x and y', function ()
    {
        var itemsWithExtra = [
            { x: 0, y: 0, name: 'a' },
            { x: 0, y: 0, name: 'b' }
        ];
        PlaceOnCircle(itemsWithExtra, circle);

        expect(itemsWithExtra[0].name).toBe('a');
        expect(itemsWithExtra[1].name).toBe('b');
    });

    it('should return an empty array when given an empty array', function ()
    {
        var result = PlaceOnCircle([], circle);
        expect(result).toEqual([]);
    });
});
