var SetScrollFactor = require('../../src/actions/SetScrollFactor');

describe('Phaser.Actions.SetScrollFactor', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { scrollFactorX: 0, scrollFactorY: 0 },
            { scrollFactorX: 0, scrollFactorY: 0 },
            { scrollFactorX: 0, scrollFactorY: 0 }
        ];
    });

    it('should set scrollFactorX and scrollFactorY on all items', function ()
    {
        SetScrollFactor(items, 0.5, 0.5);

        expect(items[0].scrollFactorX).toBe(0.5);
        expect(items[0].scrollFactorY).toBe(0.5);
        expect(items[1].scrollFactorX).toBe(0.5);
        expect(items[1].scrollFactorY).toBe(0.5);
        expect(items[2].scrollFactorX).toBe(0.5);
        expect(items[2].scrollFactorY).toBe(0.5);
    });

    it('should use scrollFactorX for scrollFactorY when scrollFactorY is undefined', function ()
    {
        SetScrollFactor(items, 0.75);

        expect(items[0].scrollFactorX).toBe(0.75);
        expect(items[0].scrollFactorY).toBe(0.75);
        expect(items[1].scrollFactorX).toBe(0.75);
        expect(items[1].scrollFactorY).toBe(0.75);
    });

    it('should use scrollFactorX for scrollFactorY when scrollFactorY is null', function ()
    {
        SetScrollFactor(items, 0.5, null);

        expect(items[0].scrollFactorX).toBe(0.5);
        expect(items[0].scrollFactorY).toBe(0.5);
        expect(items[1].scrollFactorX).toBe(0.5);
        expect(items[1].scrollFactorY).toBe(0.5);
    });

    it('should allow different values for scrollFactorX and scrollFactorY', function ()
    {
        SetScrollFactor(items, 0.25, 0.75);

        expect(items[0].scrollFactorX).toBe(0.25);
        expect(items[0].scrollFactorY).toBe(0.75);
        expect(items[1].scrollFactorX).toBe(0.25);
        expect(items[1].scrollFactorY).toBe(0.75);
    });

    it('should apply stepX incrementally to scrollFactorX', function ()
    {
        SetScrollFactor(items, 1, 1, 0.1, 0);

        expect(items[0].scrollFactorX).toBeCloseTo(1.0);
        expect(items[1].scrollFactorX).toBeCloseTo(1.1);
        expect(items[2].scrollFactorX).toBeCloseTo(1.2);
    });

    it('should apply stepY incrementally to scrollFactorY', function ()
    {
        SetScrollFactor(items, 1, 1, 0, 0.2);

        expect(items[0].scrollFactorY).toBeCloseTo(1.0);
        expect(items[1].scrollFactorY).toBeCloseTo(1.2);
        expect(items[2].scrollFactorY).toBeCloseTo(1.4);
    });

    it('should apply both stepX and stepY incrementally', function ()
    {
        SetScrollFactor(items, 0, 0, 0.5, 0.5);

        expect(items[0].scrollFactorX).toBeCloseTo(0.0);
        expect(items[0].scrollFactorY).toBeCloseTo(0.0);
        expect(items[1].scrollFactorX).toBeCloseTo(0.5);
        expect(items[1].scrollFactorY).toBeCloseTo(0.5);
        expect(items[2].scrollFactorX).toBeCloseTo(1.0);
        expect(items[2].scrollFactorY).toBeCloseTo(1.0);
    });

    it('should return the items array', function ()
    {
        var result = SetScrollFactor(items, 1, 1);

        expect(result).toBe(items);
    });

    it('should handle an empty array', function ()
    {
        var result = SetScrollFactor([], 1, 1);

        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ scrollFactorX: 0, scrollFactorY: 0 }];

        SetScrollFactor(single, 2, 3);

        expect(single[0].scrollFactorX).toBe(2);
        expect(single[0].scrollFactorY).toBe(3);
    });

    it('should set scroll factor to zero', function ()
    {
        items[0].scrollFactorX = 5;
        items[0].scrollFactorY = 5;

        SetScrollFactor(items, 0, 0);

        expect(items[0].scrollFactorX).toBe(0);
        expect(items[0].scrollFactorY).toBe(0);
    });

    it('should set scroll factor to negative values', function ()
    {
        SetScrollFactor(items, -1, -0.5);

        expect(items[0].scrollFactorX).toBe(-1);
        expect(items[0].scrollFactorY).toBe(-0.5);
    });

    it('should respect the index offset parameter', function ()
    {
        SetScrollFactor(items, 9, 9, 0, 0, 1);

        expect(items[0].scrollFactorX).toBe(0);
        expect(items[0].scrollFactorY).toBe(0);
        expect(items[1].scrollFactorX).toBe(9);
        expect(items[1].scrollFactorY).toBe(9);
        expect(items[2].scrollFactorX).toBe(9);
        expect(items[2].scrollFactorY).toBe(9);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        SetScrollFactor(items, 1, 1, 1, 1, 2, -1);

        expect(items[2].scrollFactorX).toBeCloseTo(1);
        expect(items[1].scrollFactorX).toBeCloseTo(2);
        expect(items[0].scrollFactorX).toBeCloseTo(3);
    });
});
