var SetHitArea = require('../../src/actions/SetHitArea');

describe('Phaser.Actions.SetHitArea', function ()
{
    function makeItem()
    {
        return {
            hitArea: null,
            hitAreaCallback: null,
            setInteractive: function (hitArea, hitAreaCallback)
            {
                this.hitArea = hitArea;
                this.hitAreaCallback = hitAreaCallback;
            }
        };
    }

    it('should return the items array', function ()
    {
        var items = [ makeItem() ];

        var result = SetHitArea(items);

        expect(result).toBe(items);
    });

    it('should call setInteractive on each item', function ()
    {
        var item1 = makeItem();
        var item2 = makeItem();
        var item3 = makeItem();
        var items = [ item1, item2, item3 ];

        vi.spyOn(item1, 'setInteractive');
        vi.spyOn(item2, 'setInteractive');
        vi.spyOn(item3, 'setInteractive');

        SetHitArea(items);

        expect(item1.setInteractive).toHaveBeenCalledTimes(1);
        expect(item2.setInteractive).toHaveBeenCalledTimes(1);
        expect(item3.setInteractive).toHaveBeenCalledTimes(1);
    });

    it('should pass hitArea to setInteractive on each item', function ()
    {
        var item1 = makeItem();
        var item2 = makeItem();
        var items = [ item1, item2 ];
        var hitArea = { width: 100, height: 100 };

        SetHitArea(items, hitArea);

        expect(item1.hitArea).toBe(hitArea);
        expect(item2.hitArea).toBe(hitArea);
    });

    it('should pass hitAreaCallback to setInteractive on each item', function ()
    {
        var item1 = makeItem();
        var item2 = makeItem();
        var items = [ item1, item2 ];
        var hitArea = { width: 50, height: 50 };
        var callback = function () { return true; };

        SetHitArea(items, hitArea, callback);

        expect(item1.hitAreaCallback).toBe(callback);
        expect(item2.hitAreaCallback).toBe(callback);
    });

    it('should call setInteractive with undefined when no hitArea is provided', function ()
    {
        var item = makeItem();
        var items = [ item ];

        SetHitArea(items);

        expect(item.hitArea).toBeUndefined();
        expect(item.hitAreaCallback).toBeUndefined();
    });

    it('should handle an empty array without error', function ()
    {
        var items = [];

        var result = SetHitArea(items);

        expect(result).toBe(items);
    });

    it('should return the same array reference when given a single item', function ()
    {
        var items = [ makeItem() ];

        var result = SetHitArea(items, null, null);

        expect(result).toBe(items);
    });

    it('should apply the same hitArea to all items', function ()
    {
        var items = [ makeItem(), makeItem(), makeItem() ];
        var hitArea = { radius: 32 };

        SetHitArea(items, hitArea);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].hitArea).toBe(hitArea);
        }
    });

    it('should apply the same callback to all items', function ()
    {
        var items = [ makeItem(), makeItem(), makeItem() ];
        var hitArea = { radius: 32 };
        var callback = function (shape, x, y) { return true; };

        SetHitArea(items, hitArea, callback);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].hitAreaCallback).toBe(callback);
        }
    });
});
