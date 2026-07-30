var RotateAroundDistance = require('../../src/actions/RotateAroundDistance');

describe('Phaser.Actions.RotateAroundDistance', function ()
{
    it('should return the items array', function ()
    {
        var items = [{ x: 10, y: 0 }];
        var point = { x: 0, y: 0 };
        var result = RotateAroundDistance(items, point, 0, 10);

        expect(result).toBe(items);
    });

    it('should return the items array unchanged when distance is zero', function ()
    {
        var items = [{ x: 10, y: 0 }, { x: 20, y: 0 }];
        var point = { x: 0, y: 0 };
        var result = RotateAroundDistance(items, point, Math.PI / 2, 0);

        expect(result).toBe(items);
        expect(items[0].x).toBe(10);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(20);
        expect(items[1].y).toBe(0);
    });

    it('should return an empty array unchanged', function ()
    {
        var items = [];
        var point = { x: 0, y: 0 };
        var result = RotateAroundDistance(items, point, Math.PI, 10);

        expect(result).toBe(items);
        expect(result.length).toBe(0);
    });

    it('should place each item at the given distance from the point', function ()
    {
        var items = [{ x: 10, y: 0 }];
        var point = { x: 0, y: 0 };
        var distance = 5;

        RotateAroundDistance(items, point, 0, distance);

        var dx = items[0].x - point.x;
        var dy = items[0].y - point.y;
        var actualDistance = Math.sqrt(dx * dx + dy * dy);

        expect(actualDistance).toBeCloseTo(distance, 5);
    });

    it('should place multiple items at the given distance from the point', function ()
    {
        var items = [
            { x: 10, y: 0 },
            { x: 0, y: 20 },
            { x: -5, y: 5 }
        ];
        var point = { x: 0, y: 0 };
        var distance = 8;

        RotateAroundDistance(items, point, Math.PI / 4, distance);

        for (var i = 0; i < items.length; i++)
        {
            var dx = items[i].x - point.x;
            var dy = items[i].y - point.y;
            var actualDistance = Math.sqrt(dx * dx + dy * dy);

            expect(actualDistance).toBeCloseTo(distance, 5);
        }
    });

    it('should rotate a point 90 degrees around the origin', function ()
    {
        var items = [{ x: 10, y: 0 }];
        var point = { x: 0, y: 0 };

        RotateAroundDistance(items, point, Math.PI / 2, 10);

        expect(items[0].x).toBeCloseTo(0, 5);
        expect(items[0].y).toBeCloseTo(10, 5);
    });

    it('should rotate a point 180 degrees around the origin', function ()
    {
        var items = [{ x: 10, y: 0 }];
        var point = { x: 0, y: 0 };

        RotateAroundDistance(items, point, Math.PI, 10);

        expect(items[0].x).toBeCloseTo(-10, 5);
        expect(items[0].y).toBeCloseTo(0, 5);
    });

    it('should rotate a point 360 degrees back to its original position', function ()
    {
        var items = [{ x: 10, y: 0 }];
        var point = { x: 0, y: 0 };

        RotateAroundDistance(items, point, Math.PI * 2, 10);

        expect(items[0].x).toBeCloseTo(10, 5);
        expect(items[0].y).toBeCloseTo(0, 5);
    });

    it('should rotate around a non-origin point', function ()
    {
        var items = [{ x: 15, y: 5 }];
        var point = { x: 5, y: 5 };

        RotateAroundDistance(items, point, Math.PI / 2, 10);

        expect(items[0].x).toBeCloseTo(5, 5);
        expect(items[0].y).toBeCloseTo(15, 5);
    });

    it('should use distance rather than original item distance from point', function ()
    {
        // item is 5 units away, but we specify distance 10
        var items = [{ x: 5, y: 0 }];
        var point = { x: 0, y: 0 };

        RotateAroundDistance(items, point, 0, 10);

        var dx = items[0].x - point.x;
        var dy = items[0].y - point.y;
        var actualDistance = Math.sqrt(dx * dx + dy * dy);

        expect(actualDistance).toBeCloseTo(10, 5);
    });

    it('should handle negative angles', function ()
    {
        var items = [{ x: 10, y: 0 }];
        var point = { x: 0, y: 0 };

        RotateAroundDistance(items, point, -Math.PI / 2, 10);

        expect(items[0].x).toBeCloseTo(0, 5);
        expect(items[0].y).toBeCloseTo(-10, 5);
    });

    it('should handle floating point distance values', function ()
    {
        var items = [{ x: 3.5, y: 2.5 }];
        var point = { x: 1, y: 1 };
        var distance = 7.5;

        RotateAroundDistance(items, point, Math.PI / 6, distance);

        var dx = items[0].x - point.x;
        var dy = items[0].y - point.y;
        var actualDistance = Math.sqrt(dx * dx + dy * dy);

        expect(actualDistance).toBeCloseTo(distance, 5);
    });

    it('should mutate items in place', function ()
    {
        var item = { x: 10, y: 0 };
        var items = [item];
        var point = { x: 0, y: 0 };

        RotateAroundDistance(items, point, Math.PI / 2, 10);

        expect(item.x).toBeCloseTo(0, 5);
        expect(item.y).toBeCloseTo(10, 5);
    });

    it('should handle zero angle (no rotation) but enforce distance', function ()
    {
        // angle=0 means no rotation but distance is still enforced
        var items = [{ x: 5, y: 0 }];
        var point = { x: 0, y: 0 };

        RotateAroundDistance(items, point, 0, 10);

        expect(items[0].x).toBeCloseTo(10, 5);
        expect(items[0].y).toBeCloseTo(0, 5);
    });
});
