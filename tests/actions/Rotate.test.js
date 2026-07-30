var Rotate = require('../../src/actions/Rotate');

describe('Phaser.Actions.Rotate', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { rotation: 0 },
            { rotation: 0 },
            { rotation: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = Rotate(items, 1);

        expect(result).toBe(items);
    });

    it('should add the value to each item rotation', function ()
    {
        Rotate(items, 1);

        expect(items[0].rotation).toBe(1);
        expect(items[1].rotation).toBe(1);
        expect(items[2].rotation).toBe(1);
    });

    it('should add a negative value to each item rotation', function ()
    {
        Rotate(items, -0.5);

        expect(items[0].rotation).toBeCloseTo(-0.5);
        expect(items[1].rotation).toBeCloseTo(-0.5);
        expect(items[2].rotation).toBeCloseTo(-0.5);
    });

    it('should add zero value leaving rotations unchanged', function ()
    {
        items[0].rotation = 1.5;
        items[1].rotation = 2.5;
        items[2].rotation = 3.5;

        Rotate(items, 0);

        expect(items[0].rotation).toBeCloseTo(1.5);
        expect(items[1].rotation).toBeCloseTo(2.5);
        expect(items[2].rotation).toBeCloseTo(3.5);
    });

    it('should accumulate rotation from existing values', function ()
    {
        items[0].rotation = Math.PI;
        items[1].rotation = Math.PI;
        items[2].rotation = Math.PI;

        Rotate(items, Math.PI);

        expect(items[0].rotation).toBeCloseTo(Math.PI * 2);
        expect(items[1].rotation).toBeCloseTo(Math.PI * 2);
        expect(items[2].rotation).toBeCloseTo(Math.PI * 2);
    });

    it('should apply step incrementally across items', function ()
    {
        Rotate(items, 1, 0.5);

        expect(items[0].rotation).toBeCloseTo(1);
        expect(items[1].rotation).toBeCloseTo(1.5);
        expect(items[2].rotation).toBeCloseTo(2);
    });

    it('should apply a negative step incrementally across items', function ()
    {
        Rotate(items, 2, -0.5);

        expect(items[0].rotation).toBeCloseTo(2);
        expect(items[1].rotation).toBeCloseTo(1.5);
        expect(items[2].rotation).toBeCloseTo(1);
    });

    it('should default step to zero when not provided', function ()
    {
        Rotate(items, 1);

        expect(items[0].rotation).toBe(1);
        expect(items[1].rotation).toBe(1);
        expect(items[2].rotation).toBe(1);
    });

    it('should start from the given index offset', function ()
    {
        Rotate(items, 1, 0, 1);

        expect(items[0].rotation).toBe(0);
        expect(items[1].rotation).toBe(1);
        expect(items[2].rotation).toBe(1);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        Rotate(items, 1, 0.5, items.length - 1, -1);

        expect(items[2].rotation).toBeCloseTo(1);
        expect(items[1].rotation).toBeCloseTo(1.5);
        expect(items[0].rotation).toBeCloseTo(2);
    });

    it('should handle an empty array without error', function ()
    {
        var result = Rotate([], 1);

        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ rotation: 0 }];

        Rotate(single, Math.PI / 2);

        expect(single[0].rotation).toBeCloseTo(Math.PI / 2);
    });

    it('should work with floating point values', function ()
    {
        Rotate(items, 0.1);

        expect(items[0].rotation).toBeCloseTo(0.1);
        expect(items[1].rotation).toBeCloseTo(0.1);
        expect(items[2].rotation).toBeCloseTo(0.1);
    });

    it('should work with items that have pre-existing non-zero rotation', function ()
    {
        items[0].rotation = 1;
        items[1].rotation = 2;
        items[2].rotation = 3;

        Rotate(items, 1, 1);

        expect(items[0].rotation).toBeCloseTo(2);
        expect(items[1].rotation).toBeCloseTo(4);
        expect(items[2].rotation).toBeCloseTo(6);
    });
});
