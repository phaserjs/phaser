var CountAllMatching = require('../../../src/utils/array/CountAllMatching');

describe('Phaser.Utils.Array.CountAllMatching', function ()
{
    it('should return zero for an empty array', function ()
    {
        expect(CountAllMatching([], 'active', true)).toBe(0);
    });

    it('should count all matching elements when all match', function ()
    {
        var arr = [
            { active: true },
            { active: true },
            { active: true }
        ];

        expect(CountAllMatching(arr, 'active', true)).toBe(3);
    });

    it('should count only matching elements when some match', function ()
    {
        var arr = [
            { active: true },
            { active: false },
            { active: true },
            { active: false },
            { active: true }
        ];

        expect(CountAllMatching(arr, 'active', true)).toBe(3);
    });

    it('should return zero when no elements match', function ()
    {
        var arr = [
            { active: false },
            { active: false },
            { active: false }
        ];

        expect(CountAllMatching(arr, 'active', true)).toBe(0);
    });

    it('should use strict equality and not match loosely equal values', function ()
    {
        var arr = [
            { value: 1 },
            { value: '1' },
            { value: true },
            { value: 1 }
        ];

        expect(CountAllMatching(arr, 'value', 1)).toBe(2);
    });

    it('should match string values', function ()
    {
        var arr = [
            { type: 'enemy' },
            { type: 'player' },
            { type: 'enemy' },
            { type: 'npc' }
        ];

        expect(CountAllMatching(arr, 'type', 'enemy')).toBe(2);
    });

    it('should match numeric values', function ()
    {
        var arr = [
            { health: 100 },
            { health: 50 },
            { health: 100 },
            { health: 0 }
        ];

        expect(CountAllMatching(arr, 'health', 100)).toBe(2);
    });

    it('should match null values', function ()
    {
        var arr = [
            { parent: null },
            { parent: 'something' },
            { parent: null }
        ];

        expect(CountAllMatching(arr, 'parent', null)).toBe(2);
    });

    it('should respect startIndex', function ()
    {
        var arr = [
            { active: true },
            { active: true },
            { active: true },
            { active: true }
        ];

        expect(CountAllMatching(arr, 'active', true, 2)).toBe(2);
    });

    it('should respect endIndex', function ()
    {
        var arr = [
            { active: true },
            { active: true },
            { active: true },
            { active: true }
        ];

        expect(CountAllMatching(arr, 'active', true, 0, 2)).toBe(2);
    });

    it('should respect both startIndex and endIndex', function ()
    {
        var arr = [
            { active: false },
            { active: true },
            { active: true },
            { active: false }
        ];

        expect(CountAllMatching(arr, 'active', true, 1, 3)).toBe(2);
    });

    it('should return zero when startIndex equals endIndex', function ()
    {
        var arr = [
            { active: true },
            { active: true }
        ];

        expect(CountAllMatching(arr, 'active', true, 1, 1)).toBe(0);
    });

    it('should return zero for invalid startIndex greater than array length', function ()
    {
        var arr = [
            { active: true },
            { active: true }
        ];

        expect(CountAllMatching(arr, 'active', true, 10)).toBe(0);
    });

    it('should return zero for negative startIndex', function ()
    {
        var arr = [
            { active: true },
            { active: true }
        ];

        expect(CountAllMatching(arr, 'active', true, -1)).toBe(0);
    });

    it('should return zero for endIndex greater than array length', function ()
    {
        var arr = [
            { active: true },
            { active: true }
        ];

        expect(CountAllMatching(arr, 'active', true, 0, 10)).toBe(0);
    });

    it('should handle a single element array that matches', function ()
    {
        var arr = [{ active: true }];

        expect(CountAllMatching(arr, 'active', true)).toBe(1);
    });

    it('should handle a single element array that does not match', function ()
    {
        var arr = [{ active: false }];

        expect(CountAllMatching(arr, 'active', true)).toBe(0);
    });

    it('should match false as a value', function ()
    {
        var arr = [
            { visible: false },
            { visible: true },
            { visible: false }
        ];

        expect(CountAllMatching(arr, 'visible', false)).toBe(2);
    });

    it('should match zero as a value', function ()
    {
        var arr = [
            { score: 0 },
            { score: 1 },
            { score: 0 }
        ];

        expect(CountAllMatching(arr, 'score', 0)).toBe(2);
    });

    it('should count only elements within range when mixed matching', function ()
    {
        var arr = [
            { active: true },
            { active: false },
            { active: true },
            { active: true },
            { active: false }
        ];

        expect(CountAllMatching(arr, 'active', true, 1, 4)).toBe(2);
    });
});
