var SetOrigin = require('../../src/actions/SetOrigin');

describe('Phaser.Actions.SetOrigin', function ()
{
    function makeItem (originX, originY)
    {
        return {
            originX: originX || 0,
            originY: originY || 0,
            updateDisplayOriginCalled: false,
            updateDisplayOrigin: function ()
            {
                this.updateDisplayOriginCalled = true;
            }
        };
    }

    function makeItems (count)
    {
        var items = [];
        for (var i = 0; i < count; i++)
        {
            items.push(makeItem(0, 0));
        }
        return items;
    }

    it('should return the items array', function ()
    {
        var items = makeItems(3);
        var result = SetOrigin(items, 0.5, 0.5);
        expect(result).toBe(items);
    });

    it('should set originX and originY on all items', function ()
    {
        var items = makeItems(3);
        SetOrigin(items, 0.5, 0.5);
        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].originX).toBe(0.5);
            expect(items[i].originY).toBe(0.5);
        }
    });

    it('should use originX for originY when originY is undefined', function ()
    {
        var items = makeItems(3);
        SetOrigin(items, 0.7, undefined);
        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].originX).toBe(0.7);
            expect(items[i].originY).toBe(0.7);
        }
    });

    it('should use originX for originY when originY is null', function ()
    {
        var items = makeItems(3);
        SetOrigin(items, 0.3, null);
        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].originX).toBe(0.3);
            expect(items[i].originY).toBe(0.3);
        }
    });

    it('should set different originX and originY values', function ()
    {
        var items = makeItems(2);
        SetOrigin(items, 0.2, 0.8);
        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].originX).toBe(0.2);
            expect(items[i].originY).toBe(0.8);
        }
    });

    it('should apply stepX incrementally to originX', function ()
    {
        var items = makeItems(4);
        SetOrigin(items, 0, undefined, 0.1, 0);
        expect(items[0].originX).toBeCloseTo(0.0);
        expect(items[1].originX).toBeCloseTo(0.1);
        expect(items[2].originX).toBeCloseTo(0.2);
        expect(items[3].originX).toBeCloseTo(0.3);
    });

    it('should apply stepY incrementally to originY', function ()
    {
        var items = makeItems(4);
        SetOrigin(items, 0, 0, 0, 0.1);
        expect(items[0].originY).toBeCloseTo(0.0);
        expect(items[1].originY).toBeCloseTo(0.1);
        expect(items[2].originY).toBeCloseTo(0.2);
        expect(items[3].originY).toBeCloseTo(0.3);
    });

    it('should apply both stepX and stepY incrementally', function ()
    {
        var items = makeItems(3);
        SetOrigin(items, 0.5, 0.5, 0.1, 0.2);
        expect(items[0].originX).toBeCloseTo(0.5);
        expect(items[0].originY).toBeCloseTo(0.5);
        expect(items[1].originX).toBeCloseTo(0.6);
        expect(items[1].originY).toBeCloseTo(0.7);
        expect(items[2].originX).toBeCloseTo(0.7);
        expect(items[2].originY).toBeCloseTo(0.9);
    });

    it('should call updateDisplayOrigin on every item', function ()
    {
        var items = makeItems(4);
        SetOrigin(items, 0.5, 0.5);
        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].updateDisplayOriginCalled).toBe(true);
        }
    });

    it('should respect the index offset parameter', function ()
    {
        var items = makeItems(4);
        SetOrigin(items, 1, 1, 0, 0, 2);
        expect(items[0].originX).toBe(0);
        expect(items[0].originY).toBe(0);
        expect(items[1].originX).toBe(0);
        expect(items[1].originY).toBe(0);
        expect(items[2].originX).toBe(1);
        expect(items[2].originY).toBe(1);
        expect(items[3].originX).toBe(1);
        expect(items[3].originY).toBe(1);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        var items = makeItems(3);
        SetOrigin(items, 0, 0, 0.1, 0.1, 2, -1);
        // direction=-1, index=2: iterates i=2,1,0 (t=0,1,2)
        expect(items[2].originX).toBeCloseTo(0.0);
        expect(items[1].originX).toBeCloseTo(0.1);
        expect(items[0].originX).toBeCloseTo(0.2);
    });

    it('should handle an empty array', function ()
    {
        var items = [];
        var result = SetOrigin(items, 0.5, 0.5);
        expect(result).toBe(items);
        expect(result.length).toBe(0);
    });

    it('should handle a single item', function ()
    {
        var items = [makeItem(0, 0)];
        SetOrigin(items, 0.5, 0.5);
        expect(items[0].originX).toBe(0.5);
        expect(items[0].originY).toBe(0.5);
    });

    it('should handle zero as a valid origin value', function ()
    {
        var items = makeItems(2);
        items[0].originX = 0.9;
        items[0].originY = 0.9;
        SetOrigin(items, 0, 0);
        expect(items[0].originX).toBe(0);
        expect(items[0].originY).toBe(0);
    });

    it('should handle negative origin values', function ()
    {
        var items = makeItems(2);
        SetOrigin(items, -0.5, -0.5);
        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].originX).toBe(-0.5);
            expect(items[i].originY).toBe(-0.5);
        }
    });

    it('should handle values greater than 1', function ()
    {
        var items = makeItems(2);
        SetOrigin(items, 1.5, 2.0);
        expect(items[0].originX).toBe(1.5);
        expect(items[0].originY).toBe(2.0);
    });
});
