var GetAll = require('../../../src/utils/array/GetAll');

describe('Phaser.Utils.Array.GetAll', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { id: 1, visible: true, type: 'a' },
            { id: 2, visible: false, type: 'b' },
            { id: 3, visible: true, type: 'a' },
            { id: 4, visible: false, type: 'b' },
            { id: 5, visible: true, type: 'a' }
        ];
    });

    it('should return all elements when no property or value is specified', function ()
    {
        var result = GetAll(items);
        expect(result.length).toBe(5);
        expect(result[0]).toBe(items[0]);
        expect(result[4]).toBe(items[4]);
    });

    it('should return an empty array for an empty input array', function ()
    {
        var result = GetAll([]);
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });

    it('should return elements that have a matching property value', function ()
    {
        var result = GetAll(items, 'visible', true);
        expect(result.length).toBe(3);
        expect(result[0]).toBe(items[0]);
        expect(result[1]).toBe(items[2]);
        expect(result[2]).toBe(items[4]);
    });

    it('should return elements matching a false property value', function ()
    {
        var result = GetAll(items, 'visible', false);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(items[1]);
        expect(result[1]).toBe(items[3]);
    });

    it('should return elements matching a string property value', function ()
    {
        var result = GetAll(items, 'type', 'a');
        expect(result.length).toBe(3);
        expect(result[0]).toBe(items[0]);
    });

    it('should return an empty array when no elements match the property value', function ()
    {
        var result = GetAll(items, 'type', 'z');
        expect(result.length).toBe(0);
        expect(result).toEqual([]);
    });

    it('should return elements that have the property when value is not specified', function ()
    {
        var mixed = [
            { id: 1, visible: true },
            { id: 2 },
            { id: 3, visible: false }
        ];
        var result = GetAll(mixed, 'visible');
        expect(result.length).toBe(2);
        expect(result[0]).toBe(mixed[0]);
        expect(result[1]).toBe(mixed[2]);
    });

    it('should not return elements that lack the property when value is not specified', function ()
    {
        var mixed = [
            { id: 1 },
            { id: 2 },
            { id: 3, extra: true }
        ];
        var result = GetAll(mixed, 'visible');
        expect(result.length).toBe(0);
    });

    it('should respect startIndex and endIndex', function ()
    {
        var result = GetAll(items, 'visible', true, 0, 3);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(items[0]);
        expect(result[1]).toBe(items[2]);
    });

    it('should respect startIndex when provided', function ()
    {
        var result = GetAll(items, 'visible', true, 2);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(items[2]);
        expect(result[1]).toBe(items[4]);
    });

    it('should return an empty array when startIndex equals endIndex', function ()
    {
        var result = GetAll(items, undefined, undefined, 2, 2);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when startIndex is out of range', function ()
    {
        var result = GetAll(items, undefined, undefined, 10, 20);
        expect(result.length).toBe(0);
    });

    it('should return an empty array for invalid range (startIndex > endIndex)', function ()
    {
        var result = GetAll(items, undefined, undefined, 3, 1);
        expect(result.length).toBe(0);
    });

    it('should use strict equality for value matching', function ()
    {
        var mixed = [
            { id: 1, count: 1 },
            { id: 2, count: '1' },
            { id: 3, count: true }
        ];
        var result = GetAll(mixed, 'count', 1);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(mixed[0]);
    });

    it('should return a new array, not the original', function ()
    {
        var result = GetAll(items);
        expect(result).not.toBe(items);
    });

    it('should work with a single element array', function ()
    {
        var single = [{ visible: true }];
        var result = GetAll(single, 'visible', true);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(single[0]);
    });

    it('should handle endIndex equal to array length', function ()
    {
        var result = GetAll(items, 'visible', true, 0, items.length);
        expect(result.length).toBe(3);
    });

    it('should handle a subset range with no property filter', function ()
    {
        var result = GetAll(items, undefined, undefined, 1, 4);
        expect(result.length).toBe(3);
        expect(result[0]).toBe(items[1]);
        expect(result[1]).toBe(items[2]);
        expect(result[2]).toBe(items[3]);
    });
});
