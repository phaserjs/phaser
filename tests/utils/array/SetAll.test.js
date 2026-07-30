var SetAll = require('../../../src/utils/array/SetAll');

describe('Phaser.Utils.Array.SetAll', function ()
{
    it('should return the input array', function ()
    {
        var arr = [ { visible: true } ];
        var result = SetAll(arr, 'visible', false);
        expect(result).toBe(arr);
    });

    it('should set a property on all elements that have it', function ()
    {
        var arr = [
            { visible: true },
            { visible: true },
            { visible: true }
        ];
        SetAll(arr, 'visible', false);
        expect(arr[0].visible).toBe(false);
        expect(arr[1].visible).toBe(false);
        expect(arr[2].visible).toBe(false);
    });

    it('should only set the property on elements that own it', function ()
    {
        var arr = [
            { visible: true },
            { name: 'no-visible' },
            { visible: false }
        ];
        SetAll(arr, 'visible', true);
        expect(arr[0].visible).toBe(true);
        expect(arr[1].visible).toBe(undefined);
        expect(arr[2].visible).toBe(true);
    });

    it('should set a property to a string value', function ()
    {
        var arr = [
            { name: 'a' },
            { name: 'b' },
            { name: 'c' }
        ];
        SetAll(arr, 'name', 'updated');
        expect(arr[0].name).toBe('updated');
        expect(arr[1].name).toBe('updated');
        expect(arr[2].name).toBe('updated');
    });

    it('should set a property to a numeric value', function ()
    {
        var arr = [
            { alpha: 1 },
            { alpha: 0.5 },
            { alpha: 0 }
        ];
        SetAll(arr, 'alpha', 0.75);
        expect(arr[0].alpha).toBe(0.75);
        expect(arr[1].alpha).toBe(0.75);
        expect(arr[2].alpha).toBe(0.75);
    });

    it('should set a property to null', function ()
    {
        var arr = [
            { target: 'something' },
            { target: 'other' }
        ];
        SetAll(arr, 'target', null);
        expect(arr[0].target).toBeNull();
        expect(arr[1].target).toBeNull();
    });

    it('should respect startIndex and only update elements from that index', function ()
    {
        var arr = [
            { active: false },
            { active: false },
            { active: false },
            { active: false }
        ];
        SetAll(arr, 'active', true, 2);
        expect(arr[0].active).toBe(false);
        expect(arr[1].active).toBe(false);
        expect(arr[2].active).toBe(true);
        expect(arr[3].active).toBe(true);
    });

    it('should respect endIndex and only update elements up to that index', function ()
    {
        var arr = [
            { active: false },
            { active: false },
            { active: false },
            { active: false }
        ];
        SetAll(arr, 'active', true, 0, 2);
        expect(arr[0].active).toBe(true);
        expect(arr[1].active).toBe(true);
        expect(arr[2].active).toBe(false);
        expect(arr[3].active).toBe(false);
    });

    it('should respect both startIndex and endIndex', function ()
    {
        var arr = [
            { x: 0 },
            { x: 0 },
            { x: 0 },
            { x: 0 },
            { x: 0 }
        ];
        SetAll(arr, 'x', 99, 1, 4);
        expect(arr[0].x).toBe(0);
        expect(arr[1].x).toBe(99);
        expect(arr[2].x).toBe(99);
        expect(arr[3].x).toBe(99);
        expect(arr[4].x).toBe(0);
    });

    it('should return the array unchanged when startIndex equals endIndex', function ()
    {
        var arr = [
            { x: 0 },
            { x: 0 },
            { x: 0 }
        ];
        SetAll(arr, 'x', 99, 1, 1);
        expect(arr[0].x).toBe(0);
        expect(arr[1].x).toBe(0);
        expect(arr[2].x).toBe(0);
    });

    it('should return the array unchanged when given an out-of-bounds startIndex', function ()
    {
        var arr = [
            { x: 0 },
            { x: 0 }
        ];
        SetAll(arr, 'x', 99, -1, 2);
        expect(arr[0].x).toBe(0);
        expect(arr[1].x).toBe(0);
    });

    it('should return the array unchanged when given an out-of-bounds endIndex', function ()
    {
        var arr = [
            { x: 0 },
            { x: 0 }
        ];
        SetAll(arr, 'x', 99, 0, 10);
        expect(arr[0].x).toBe(0);
        expect(arr[1].x).toBe(0);
    });

    it('should return an empty array unchanged', function ()
    {
        var arr = [];
        var result = SetAll(arr, 'visible', true);
        expect(result).toBe(arr);
        expect(result.length).toBe(0);
    });

    it('should not set inherited properties that are not own properties', function ()
    {
        var proto = { visible: false };
        var child = Object.create(proto);
        var arr = [ child ];
        SetAll(arr, 'visible', true);
        expect(child.hasOwnProperty('visible')).toBe(false);
        expect(child.visible).toBe(false);
    });

    it('should set a property to a boolean true value', function ()
    {
        var arr = [
            { active: false },
            { active: false }
        ];
        SetAll(arr, 'active', true);
        expect(arr[0].active).toBe(true);
        expect(arr[1].active).toBe(true);
    });

    it('should set a property to a boolean false value', function ()
    {
        var arr = [
            { active: true },
            { active: true }
        ];
        SetAll(arr, 'active', false);
        expect(arr[0].active).toBe(false);
        expect(arr[1].active).toBe(false);
    });
});
