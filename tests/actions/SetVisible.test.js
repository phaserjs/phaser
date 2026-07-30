var SetVisible = require('../../src/actions/SetVisible');

describe('Phaser.Actions.SetVisible', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { visible: true },
            { visible: true },
            { visible: true },
            { visible: true },
            { visible: true }
        ];
    });

    it('should return the items array', function ()
    {
        var result = SetVisible(items, false);

        expect(result).toBe(items);
    });

    it('should set visible to false on all items', function ()
    {
        SetVisible(items, false);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].visible).toBeFalsy();
        }
    });

    it('should set visible to true on all items', function ()
    {
        items[0].visible = false;
        items[2].visible = false;
        items[4].visible = false;

        SetVisible(items, true);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].visible).toBeTruthy();
        }
    });

    it('should work with an empty array', function ()
    {
        var result = SetVisible([], false);

        expect(result).toEqual([]);
    });

    it('should work with a single item', function ()
    {
        var single = [{ visible: true }];

        SetVisible(single, false);

        expect(single[0].visible).toBeFalsy();
    });

    it('should only update items from index onwards when index is provided', function ()
    {
        SetVisible(items, false, 2);

        expect(items[0].visible).toBe(true);
        expect(items[1].visible).toBe(true);
        expect(items[2].visible).toBeFalsy();
        expect(items[3].visible).toBeFalsy();
        expect(items[4].visible).toBeFalsy();
    });

    it('should default index to 0 when not provided', function ()
    {
        SetVisible(items, false);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].visible).toBeFalsy();
        }
    });

    it('should iterate from end to start when direction is -1', function ()
    {
        SetVisible(items, false, 2, -1);

        expect(items[0].visible).toBeFalsy();
        expect(items[1].visible).toBeFalsy();
        expect(items[2].visible).toBeFalsy();
        expect(items[3].visible).toBe(true);
        expect(items[4].visible).toBe(true);
    });

    it('should iterate from beginning to end when direction is 1', function ()
    {
        SetVisible(items, false, 0, 1);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].visible).toBeFalsy();
        }
    });

    it('should only update a single item when index equals last index and direction is -1', function ()
    {
        SetVisible(items, false, 0, -1);

        expect(items[0].visible).toBeFalsy();
        expect(items[1].visible).toBe(true);
        expect(items[2].visible).toBe(true);
        expect(items[3].visible).toBe(true);
        expect(items[4].visible).toBe(true);
    });

    it('should not mutate items before the start index', function ()
    {
        SetVisible(items, false, 3);

        expect(items[0].visible).toBe(true);
        expect(items[1].visible).toBe(true);
        expect(items[2].visible).toBe(true);
        expect(items[3].visible).toBeFalsy();
        expect(items[4].visible).toBeFalsy();
    });

    it('should handle index equal to items length gracefully', function ()
    {
        SetVisible(items, false, items.length);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].visible).toBe(true);
        }
    });

    it('should set visible on objects that start with visible as false', function ()
    {
        var hidden = [
            { visible: false },
            { visible: false },
            { visible: false }
        ];

        SetVisible(hidden, true);

        for (var i = 0; i < hidden.length; i++)
        {
            expect(hidden[i].visible).toBeTruthy();
        }
    });
});
