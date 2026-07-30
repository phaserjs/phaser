var SetBlendMode = require('../../src/actions/SetBlendMode');

describe('Phaser.Actions.SetBlendMode', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { blendMode: 0 },
            { blendMode: 0 },
            { blendMode: 0 }
        ];
    });

    it('should set blendMode on all items', function ()
    {
        SetBlendMode(items, 1);

        expect(items[0].blendMode).toBe(1);
        expect(items[1].blendMode).toBe(1);
        expect(items[2].blendMode).toBe(1);
    });

    it('should return the items array', function ()
    {
        var result = SetBlendMode(items, 2);

        expect(result).toBe(items);
    });

    it('should set blendMode to a numeric value', function ()
    {
        SetBlendMode(items, 5);

        expect(items[0].blendMode).toBe(5);
        expect(items[1].blendMode).toBe(5);
        expect(items[2].blendMode).toBe(5);
    });

    it('should set blendMode to a string value', function ()
    {
        // PropertyValueSet computes value + (step * index); with step=0, 'ADD' + 0 = 'ADD0'
        SetBlendMode(items, 'ADD');

        expect(items[0].blendMode).toBe('ADD0');
        expect(items[1].blendMode).toBe('ADD0');
        expect(items[2].blendMode).toBe('ADD0');
    });

    it('should set blendMode to zero', function ()
    {
        items[0].blendMode = 3;
        items[1].blendMode = 3;
        items[2].blendMode = 3;

        SetBlendMode(items, 0);

        expect(items[0].blendMode).toBe(0);
        expect(items[1].blendMode).toBe(0);
        expect(items[2].blendMode).toBe(0);
    });

    it('should respect the index offset', function ()
    {
        SetBlendMode(items, 2, 1);

        expect(items[0].blendMode).toBe(0);
        expect(items[1].blendMode).toBe(2);
        expect(items[2].blendMode).toBe(2);
    });

    it('should respect the index offset of 2', function ()
    {
        SetBlendMode(items, 3, 2);

        expect(items[0].blendMode).toBe(0);
        expect(items[1].blendMode).toBe(0);
        expect(items[2].blendMode).toBe(3);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        SetBlendMode(items, 4, 1, -1);

        expect(items[0].blendMode).toBe(4);
        expect(items[1].blendMode).toBe(4);
        expect(items[2].blendMode).toBe(0);
    });

    it('should only set the item at index 0 when direction is -1 and index is 0', function ()
    {
        SetBlendMode(items, 7, 0, -1);

        expect(items[0].blendMode).toBe(7);
        expect(items[1].blendMode).toBe(0);
        expect(items[2].blendMode).toBe(0);
    });

    it('should handle an empty array', function ()
    {
        var result = SetBlendMode([], 1);

        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ blendMode: 0 }];

        SetBlendMode(single, 6);

        expect(single[0].blendMode).toBe(6);
    });

    it('should not modify items when index equals array length', function ()
    {
        SetBlendMode(items, 9, 3);

        expect(items[0].blendMode).toBe(0);
        expect(items[1].blendMode).toBe(0);
        expect(items[2].blendMode).toBe(0);
    });

    it('should set blendMode to a negative value', function ()
    {
        SetBlendMode(items, -1);

        expect(items[0].blendMode).toBe(-1);
        expect(items[1].blendMode).toBe(-1);
        expect(items[2].blendMode).toBe(-1);
    });
});
