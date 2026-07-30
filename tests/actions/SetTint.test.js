var SetTint = require('../../src/actions/SetTint');

describe('Phaser.Actions.SetTint', function ()
{
    function makeItem ()
    {
        return {
            tintTopLeft: 0,
            tintTopRight: 0,
            tintBottomLeft: 0,
            tintBottomRight: 0,
            setTint: function (topLeft, topRight, bottomLeft, bottomRight)
            {
                this.tintTopLeft = topLeft;
                this.tintTopRight = topRight;
                this.tintBottomLeft = bottomLeft;
                this.tintBottomRight = bottomRight;
            }
        };
    }

    it('should return the items array', function ()
    {
        var items = [makeItem()];
        var result = SetTint(items, 0xff0000);
        expect(result).toBe(items);
    });

    it('should return an empty array unchanged', function ()
    {
        var items = [];
        var result = SetTint(items, 0xff0000);
        expect(result).toBe(items);
        expect(result.length).toBe(0);
    });

    it('should call setTint on each item with topLeft only', function ()
    {
        var item1 = makeItem();
        var item2 = makeItem();
        SetTint([item1, item2], 0xff0000);
        expect(item1.tintTopLeft).toBe(0xff0000);
        expect(item2.tintTopLeft).toBe(0xff0000);
    });

    it('should pass all four tint values to each item', function ()
    {
        var item = makeItem();
        SetTint([item], 0xff0000, 0x00ff00, 0x0000ff, 0xffff00);
        expect(item.tintTopLeft).toBe(0xff0000);
        expect(item.tintTopRight).toBe(0x00ff00);
        expect(item.tintBottomLeft).toBe(0x0000ff);
        expect(item.tintBottomRight).toBe(0xffff00);
    });

    it('should pass topLeft and topRight when only two values given', function ()
    {
        var item = makeItem();
        SetTint([item], 0xff0000, 0x00ff00);
        expect(item.tintTopLeft).toBe(0xff0000);
        expect(item.tintTopRight).toBe(0x00ff00);
        expect(item.tintBottomLeft).toBe(undefined);
        expect(item.tintBottomRight).toBe(undefined);
    });

    it('should apply tint to all items in a larger array', function ()
    {
        var items = [makeItem(), makeItem(), makeItem(), makeItem()];
        SetTint(items, 0xaabbcc);
        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].tintTopLeft).toBe(0xaabbcc);
        }
    });

    it('should pass undefined for omitted corner values', function ()
    {
        var item = makeItem();
        SetTint([item], 0xffffff);
        expect(item.tintTopRight).toBe(undefined);
        expect(item.tintBottomLeft).toBe(undefined);
        expect(item.tintBottomRight).toBe(undefined);
    });

    it('should work with a tint value of zero', function ()
    {
        var item = makeItem();
        item.tintTopLeft = 0xff0000;
        SetTint([item], 0x000000);
        expect(item.tintTopLeft).toBe(0x000000);
    });

    it('should work with white tint (0xffffff)', function ()
    {
        var item = makeItem();
        SetTint([item], 0xffffff, 0xffffff, 0xffffff, 0xffffff);
        expect(item.tintTopLeft).toBe(0xffffff);
        expect(item.tintTopRight).toBe(0xffffff);
        expect(item.tintBottomLeft).toBe(0xffffff);
        expect(item.tintBottomRight).toBe(0xffffff);
    });

    it('should call setTint the correct number of times', function ()
    {
        var callCount = 0;
        var items = [];
        for (var i = 0; i < 5; i++)
        {
            var item = makeItem();
            item.setTint = function ()
            {
                callCount++;
            };
            items.push(item);
        }
        SetTint(items, 0xff0000);
        expect(callCount).toBe(5);
    });
});
