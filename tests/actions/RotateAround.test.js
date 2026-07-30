var RotateAround = require('../../src/actions/RotateAround');

describe('Phaser.Actions.RotateAround', function ()
{
    var point;
    var items;

    beforeEach(function ()
    {
        point = { x: 0, y: 0 };
    });

    it('should return the items array', function ()
    {
        var items = [{ x: 1, y: 0 }];

        var result = RotateAround(items, point, 0);

        expect(result).toBe(items);
    });

    it('should return an empty array unchanged', function ()
    {
        var result = RotateAround([], point, Math.PI);

        expect(result).toEqual([]);
    });

    it('should not move an item when angle is zero', function ()
    {
        items = [{ x: 5, y: 0 }];

        RotateAround(items, point, 0);

        expect(items[0].x).toBeCloseTo(5, 5);
        expect(items[0].y).toBeCloseTo(0, 5);
    });

    it('should rotate an item 90 degrees around the origin', function ()
    {
        items = [{ x: 5, y: 0 }];

        RotateAround(items, point, Math.PI / 2);

        expect(items[0].x).toBeCloseTo(0, 5);
        expect(items[0].y).toBeCloseTo(5, 5);
    });

    it('should rotate an item 180 degrees around the origin', function ()
    {
        items = [{ x: 5, y: 0 }];

        RotateAround(items, point, Math.PI);

        expect(items[0].x).toBeCloseTo(-5, 5);
        expect(items[0].y).toBeCloseTo(0, 5);
    });

    it('should rotate an item 360 degrees back to its original position', function ()
    {
        items = [{ x: 5, y: 3 }];

        RotateAround(items, point, Math.PI * 2);

        expect(items[0].x).toBeCloseTo(5, 5);
        expect(items[0].y).toBeCloseTo(3, 5);
    });

    it('should rotate around a non-origin pivot point', function ()
    {
        point = { x: 10, y: 10 };
        items = [{ x: 15, y: 10 }];

        RotateAround(items, point, Math.PI / 2);

        expect(items[0].x).toBeCloseTo(10, 5);
        expect(items[0].y).toBeCloseTo(15, 5);
    });

    it('should rotate all items in the array', function ()
    {
        items = [
            { x: 5, y: 0 },
            { x: -5, y: 0 },
            { x: 0, y: 5 }
        ];

        RotateAround(items, point, Math.PI / 2);

        expect(items[0].x).toBeCloseTo(0, 5);
        expect(items[0].y).toBeCloseTo(5, 5);

        expect(items[1].x).toBeCloseTo(0, 5);
        expect(items[1].y).toBeCloseTo(-5, 5);

        expect(items[2].x).toBeCloseTo(-5, 5);
        expect(items[2].y).toBeCloseTo(0, 5);
    });

    it('should preserve the distance of each item from the pivot point', function ()
    {
        items = [
            { x: 3, y: 4 },
            { x: 0, y: 5 },
            { x: -3, y: -4 }
        ];

        var distanceBefore = items.map(function (item)
        {
            var dx = item.x - point.x;
            var dy = item.y - point.y;
            return Math.sqrt(dx * dx + dy * dy);
        });

        RotateAround(items, point, Math.PI / 3);

        var distanceAfter = items.map(function (item)
        {
            var dx = item.x - point.x;
            var dy = item.y - point.y;
            return Math.sqrt(dx * dx + dy * dy);
        });

        for (var i = 0; i < items.length; i++)
        {
            expect(distanceAfter[i]).toBeCloseTo(distanceBefore[i], 5);
        }
    });

    it('should clamp distance to at least 1 when item is at the pivot point', function ()
    {
        items = [{ x: 0, y: 0 }];

        RotateAround(items, point, Math.PI / 2);

        var dx = items[0].x - point.x;
        var dy = items[0].y - point.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        expect(dist).toBeCloseTo(1, 5);
    });

    it('should rotate with negative angles', function ()
    {
        items = [{ x: 5, y: 0 }];

        RotateAround(items, point, -Math.PI / 2);

        expect(items[0].x).toBeCloseTo(0, 5);
        expect(items[0].y).toBeCloseTo(-5, 5);
    });

    it('should handle items with negative coordinates', function ()
    {
        items = [{ x: -5, y: 0 }];

        RotateAround(items, point, Math.PI / 2);

        expect(items[0].x).toBeCloseTo(0, 5);
        expect(items[0].y).toBeCloseTo(-5, 5);
    });

    it('should handle a pivot point with negative coordinates', function ()
    {
        point = { x: -10, y: -10 };
        items = [{ x: -5, y: -10 }];

        RotateAround(items, point, Math.PI);

        expect(items[0].x).toBeCloseTo(-15, 5);
        expect(items[0].y).toBeCloseTo(-10, 5);
    });

    it('should rotate a single item by a fractional angle', function ()
    {
        items = [{ x: 10, y: 0 }];

        RotateAround(items, point, 0.1);

        expect(items[0].x).toBeCloseTo(10 * Math.cos(0.1), 5);
        expect(items[0].y).toBeCloseTo(10 * Math.sin(0.1), 5);
    });
});
