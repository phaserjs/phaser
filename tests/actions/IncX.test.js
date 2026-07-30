var IncX = require('../../src/actions/IncX');

describe('Phaser.Actions.IncX', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { x: 0 },
            { x: 10 },
            { x: 20 },
            { x: 30 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = IncX(items, 5);
        expect(result).toBe(items);
    });

    it('should add value to x property of each item', function ()
    {
        IncX(items, 5);
        expect(items[0].x).toBe(5);
        expect(items[1].x).toBe(15);
        expect(items[2].x).toBe(25);
        expect(items[3].x).toBe(35);
    });

    it('should add zero value without changing x properties', function ()
    {
        IncX(items, 0);
        expect(items[0].x).toBe(0);
        expect(items[1].x).toBe(10);
        expect(items[2].x).toBe(20);
        expect(items[3].x).toBe(30);
    });

    it('should add a negative value to x properties', function ()
    {
        IncX(items, -5);
        expect(items[0].x).toBe(-5);
        expect(items[1].x).toBe(5);
        expect(items[2].x).toBe(15);
        expect(items[3].x).toBe(25);
    });

    it('should apply step incrementally across items', function ()
    {
        IncX(items, 10, 5);
        expect(items[0].x).toBe(10);
        expect(items[1].x).toBe(25);
        expect(items[2].x).toBe(40);
        expect(items[3].x).toBe(55);
    });

    it('should apply negative step incrementally across items', function ()
    {
        IncX(items, 10, -2);
        expect(items[0].x).toBe(10);
        expect(items[1].x).toBe(18);
        expect(items[2].x).toBe(26);
        expect(items[3].x).toBe(34);
    });

    it('should default step to 0 when not provided', function ()
    {
        IncX(items, 7);
        expect(items[0].x).toBe(7);
        expect(items[1].x).toBe(17);
        expect(items[2].x).toBe(27);
        expect(items[3].x).toBe(37);
    });

    it('should respect the index offset parameter', function ()
    {
        IncX(items, 10, 0, 2);
        expect(items[0].x).toBe(0);
        expect(items[1].x).toBe(10);
        expect(items[2].x).toBe(30);
        expect(items[3].x).toBe(40);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        IncX(items, 10, 0, 3, -1);
        expect(items[0].x).toBe(10);
        expect(items[1].x).toBe(20);
        expect(items[2].x).toBe(30);
        expect(items[3].x).toBe(40);
    });

    it('should apply step in reverse direction', function ()
    {
        IncX(items, 10, 5, 3, -1);
        expect(items[3].x).toBe(40);
        expect(items[2].x).toBe(35);
        expect(items[1].x).toBe(30);
        expect(items[0].x).toBe(25);
    });

    it('should handle an empty array without error', function ()
    {
        var result = IncX([], 10);
        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ x: 5 }];
        IncX(single, 3);
        expect(single[0].x).toBe(8);
    });

    it('should work with floating point values', function ()
    {
        IncX(items, 1.5);
        expect(items[0].x).toBeCloseTo(1.5);
        expect(items[1].x).toBeCloseTo(11.5);
        expect(items[2].x).toBeCloseTo(21.5);
        expect(items[3].x).toBeCloseTo(31.5);
    });

    it('should work with floating point step values', function ()
    {
        IncX(items, 1, 0.5);
        expect(items[0].x).toBeCloseTo(1);
        expect(items[1].x).toBeCloseTo(11.5);
        expect(items[2].x).toBeCloseTo(22);
        expect(items[3].x).toBeCloseTo(32.5);
    });

    it('should not modify y or other properties', function ()
    {
        var objs = [
            { x: 0, y: 100 },
            { x: 10, y: 200 }
        ];
        IncX(objs, 5);
        expect(objs[0].y).toBe(100);
        expect(objs[1].y).toBe(200);
    });
});
