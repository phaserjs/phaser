var SetRotation = require('../../src/actions/SetRotation');

describe('Phaser.Actions.SetRotation', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { rotation: 0 },
            { rotation: 0 },
            { rotation: 0 },
            { rotation: 0 },
            { rotation: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = SetRotation(items, 1);

        expect(result).toBe(items);
    });

    it('should set rotation on all items to the given value', function ()
    {
        SetRotation(items, 1.5);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].rotation).toBe(1.5);
        }
    });

    it('should set rotation to zero', function ()
    {
        items[0].rotation = 3.14;
        items[1].rotation = 1.57;

        SetRotation(items, 0);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].rotation).toBe(0);
        }
    });

    it('should set rotation to a negative value', function ()
    {
        SetRotation(items, -Math.PI);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].rotation).toBeCloseTo(-Math.PI);
        }
    });

    it('should apply step incrementally across items', function ()
    {
        SetRotation(items, 0, 0.1);

        expect(items[0].rotation).toBeCloseTo(0);
        expect(items[1].rotation).toBeCloseTo(0.1);
        expect(items[2].rotation).toBeCloseTo(0.2);
        expect(items[3].rotation).toBeCloseTo(0.3);
        expect(items[4].rotation).toBeCloseTo(0.4);
    });

    it('should apply a negative step', function ()
    {
        SetRotation(items, Math.PI, -0.1);

        expect(items[0].rotation).toBeCloseTo(Math.PI);
        expect(items[1].rotation).toBeCloseTo(Math.PI - 0.1);
        expect(items[2].rotation).toBeCloseTo(Math.PI - 0.2);
        expect(items[3].rotation).toBeCloseTo(Math.PI - 0.3);
        expect(items[4].rotation).toBeCloseTo(Math.PI - 0.4);
    });

    it('should default step to zero when not provided', function ()
    {
        SetRotation(items, 2);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].rotation).toBe(2);
        }
    });

    it('should respect index offset and skip earlier items', function ()
    {
        SetRotation(items, 1, 0, 2);

        expect(items[0].rotation).toBe(0);
        expect(items[1].rotation).toBe(0);
        expect(items[2].rotation).toBe(1);
        expect(items[3].rotation).toBe(1);
        expect(items[4].rotation).toBe(1);
    });

    it('should apply step correctly when index offset is used', function ()
    {
        SetRotation(items, 0, 0.5, 2);

        expect(items[0].rotation).toBe(0);
        expect(items[1].rotation).toBe(0);
        expect(items[2].rotation).toBeCloseTo(0);
        expect(items[3].rotation).toBeCloseTo(0.5);
        expect(items[4].rotation).toBeCloseTo(1.0);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        SetRotation(items, 1, 0, 4, -1);

        expect(items[4].rotation).toBe(1);
        expect(items[3].rotation).toBe(1);
        expect(items[2].rotation).toBe(1);
        expect(items[1].rotation).toBe(1);
        expect(items[0].rotation).toBe(1);
    });

    it('should apply step in reverse direction', function ()
    {
        SetRotation(items, 0, 0.1, 4, -1);

        expect(items[4].rotation).toBeCloseTo(0);
        expect(items[3].rotation).toBeCloseTo(0.1);
        expect(items[2].rotation).toBeCloseTo(0.2);
        expect(items[1].rotation).toBeCloseTo(0.3);
        expect(items[0].rotation).toBeCloseTo(0.4);
    });

    it('should not modify items before the index when direction is -1', function ()
    {
        // direction=-1 with index=2 iterates from index 2 down to 0 (inclusive)
        // so items[0], [1], [2] all get set; items[3] and [4] are untouched
        SetRotation(items, 1, 0, 2, -1);

        expect(items[0].rotation).toBe(1);
        expect(items[1].rotation).toBe(1);
        expect(items[2].rotation).toBe(1);
        expect(items[3].rotation).toBe(0);
        expect(items[4].rotation).toBe(0);
    });

    it('should handle an empty array', function ()
    {
        var result = SetRotation([], 1);

        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ rotation: 0 }];

        SetRotation(single, Math.PI / 2);

        expect(single[0].rotation).toBeCloseTo(Math.PI / 2);
    });

    it('should work with full rotation values (2 * PI)', function ()
    {
        SetRotation(items, Math.PI * 2);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].rotation).toBeCloseTo(Math.PI * 2);
        }
    });

    it('should overwrite existing rotation values', function ()
    {
        items[0].rotation = 1.0;
        items[1].rotation = 2.0;
        items[2].rotation = 3.0;

        SetRotation(items, 0.5);

        expect(items[0].rotation).toBe(0.5);
        expect(items[1].rotation).toBe(0.5);
        expect(items[2].rotation).toBe(0.5);
    });
});
