var GetLast = require('../../src/actions/GetLast');

describe('Phaser.Actions.GetLast', function ()
{
    it('should return the last matching item in the array', function ()
    {
        var items = [
            { alpha: 1, scaleX: 0.5 },
            { alpha: 1, scaleX: 0.5 },
            { alpha: 0.5, scaleX: 1 }
        ];

        expect(GetLast(items, { alpha: 1, scaleX: 0.5 })).toBe(items[1]);
    });

    it('should return null when no items match', function ()
    {
        var items = [
            { alpha: 1 },
            { alpha: 0.5 }
        ];

        expect(GetLast(items, { alpha: 0 })).toBeNull();
    });

    it('should return null for an empty array', function ()
    {
        expect(GetLast([], { alpha: 1 })).toBeNull();
    });

    it('should default index to 0 when not provided', function ()
    {
        var items = [
            { active: true },
            { active: false },
            { active: true }
        ];

        expect(GetLast(items, { active: true })).toBe(items[2]);
    });

    it('should respect the index offset and not search before it', function ()
    {
        var items = [
            { alpha: 1 },
            { alpha: 1 },
            { alpha: 0 }
        ];

        expect(GetLast(items, { alpha: 1 }, 2)).toBeNull();
    });

    it('should include the item at the index offset in the search', function ()
    {
        var items = [
            { alpha: 0 },
            { alpha: 1 },
            { alpha: 1 }
        ];

        expect(GetLast(items, { alpha: 1 }, 1)).toBe(items[2]);
    });

    it('should match against multiple properties', function ()
    {
        var items = [
            { x: 10, y: 20 },
            { x: 10, y: 30 },
            { x: 10, y: 20 }
        ];

        expect(GetLast(items, { x: 10, y: 20 })).toBe(items[2]);
    });

    it('should not match when only some properties match', function ()
    {
        var items = [
            { x: 10, y: 20 },
            { x: 10, y: 30 }
        ];

        expect(GetLast(items, { x: 10, y: 99 })).toBeNull();
    });

    it('should return the single item if it matches', function ()
    {
        var item = { visible: true };

        expect(GetLast([ item ], { visible: true })).toBe(item);
    });

    it('should return null if the single item does not match', function ()
    {
        expect(GetLast([ { visible: false } ], { visible: true })).toBeNull();
    });

    it('should match using strict equality', function ()
    {
        var items = [
            { value: 0 },
            { value: '' },
            { value: false },
            { value: null }
        ];

        expect(GetLast(items, { value: 0 })).toBe(items[0]);
        expect(GetLast(items, { value: '' })).toBe(items[1]);
        expect(GetLast(items, { value: false })).toBe(items[2]);
        expect(GetLast(items, { value: null })).toBe(items[3]);
    });

    it('should return the last match when multiple items match', function ()
    {
        var items = [
            { type: 'enemy' },
            { type: 'enemy' },
            { type: 'enemy' }
        ];

        expect(GetLast(items, { type: 'enemy' })).toBe(items[2]);
    });

    it('should work with index equal to items.length - 1', function ()
    {
        var items = [
            { active: true },
            { active: true },
            { active: true }
        ];

        expect(GetLast(items, { active: true }, 2)).toBe(items[2]);
    });

    it('should return null when index is beyond array bounds', function ()
    {
        var items = [ { active: true } ];

        expect(GetLast(items, { active: true }, 5)).toBeNull();
    });

    it('should not return an item from before the index', function ()
    {
        var items = [
            { active: true },
            { active: false },
            { active: false }
        ];

        expect(GetLast(items, { active: true }, 1)).toBeNull();
    });

    it('should return null when compare object has a property the item lacks', function ()
    {
        var items = [
            { x: 10 }
        ];

        expect(GetLast(items, { x: 10, y: 20 })).toBeNull();
    });
});
