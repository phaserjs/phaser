var Angle = require('../../src/actions/Angle');

describe('Phaser.Actions.Angle', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { angle: 0 },
            { angle: 0 },
            { angle: 0 },
            { angle: 0 },
            { angle: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = Angle(items, 10);

        expect(result).toBe(items);
    });

    it('should add the value to each item angle', function ()
    {
        Angle(items, 45);

        expect(items[0].angle).toBe(45);
        expect(items[1].angle).toBe(45);
        expect(items[2].angle).toBe(45);
        expect(items[3].angle).toBe(45);
        expect(items[4].angle).toBe(45);
    });

    it('should add a negative value to each item angle', function ()
    {
        Angle(items, -90);

        expect(items[0].angle).toBe(-90);
        expect(items[1].angle).toBe(-90);
        expect(items[2].angle).toBe(-90);
        expect(items[3].angle).toBe(-90);
        expect(items[4].angle).toBe(-90);
    });

    it('should add zero to each item angle when value is 0', function ()
    {
        items[0].angle = 30;
        items[1].angle = 60;

        Angle(items, 0);

        expect(items[0].angle).toBe(30);
        expect(items[1].angle).toBe(60);
    });

    it('should accumulate step across items', function ()
    {
        Angle(items, 10, 5);

        expect(items[0].angle).toBe(10);
        expect(items[1].angle).toBe(15);
        expect(items[2].angle).toBe(20);
        expect(items[3].angle).toBe(25);
        expect(items[4].angle).toBe(30);
    });

    it('should apply step of zero the same as no step', function ()
    {
        Angle(items, 20, 0);

        expect(items[0].angle).toBe(20);
        expect(items[1].angle).toBe(20);
        expect(items[2].angle).toBe(20);
        expect(items[3].angle).toBe(20);
        expect(items[4].angle).toBe(20);
    });

    it('should apply a negative step', function ()
    {
        Angle(items, 40, -5);

        expect(items[0].angle).toBe(40);
        expect(items[1].angle).toBe(35);
        expect(items[2].angle).toBe(30);
        expect(items[3].angle).toBe(25);
        expect(items[4].angle).toBe(20);
    });

    it('should start from the given index', function ()
    {
        Angle(items, 10, 0, 2);

        expect(items[0].angle).toBe(0);
        expect(items[1].angle).toBe(0);
        expect(items[2].angle).toBe(10);
        expect(items[3].angle).toBe(10);
        expect(items[4].angle).toBe(10);
    });

    it('should iterate end to start when direction is -1', function ()
    {
        Angle(items, 10, 0, 4, -1);

        expect(items[0].angle).toBe(10);
        expect(items[1].angle).toBe(10);
        expect(items[2].angle).toBe(10);
        expect(items[3].angle).toBe(10);
        expect(items[4].angle).toBe(10);
    });

    it('should apply step in reverse direction', function ()
    {
        Angle(items, 10, 5, 4, -1);

        expect(items[4].angle).toBe(10);
        expect(items[3].angle).toBe(15);
        expect(items[2].angle).toBe(20);
        expect(items[1].angle).toBe(25);
        expect(items[0].angle).toBe(30);
    });

    it('should add to existing non-zero angle values', function ()
    {
        items[0].angle = 90;
        items[1].angle = 180;
        items[2].angle = -45;

        Angle(items, 10);

        expect(items[0].angle).toBe(100);
        expect(items[1].angle).toBe(190);
        expect(items[2].angle).toBe(-35);
    });

    it('should work with floating point values', function ()
    {
        Angle(items, 1.5);

        expect(items[0].angle).toBeCloseTo(1.5);
        expect(items[1].angle).toBeCloseTo(1.5);
    });

    it('should work with floating point step', function ()
    {
        Angle(items, 1.0, 0.5);

        expect(items[0].angle).toBeCloseTo(1.0);
        expect(items[1].angle).toBeCloseTo(1.5);
        expect(items[2].angle).toBeCloseTo(2.0);
        expect(items[3].angle).toBeCloseTo(2.5);
        expect(items[4].angle).toBeCloseTo(3.0);
    });

    it('should handle an empty array', function ()
    {
        var result = Angle([], 45);

        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ angle: 0 }];

        Angle(single, 180);

        expect(single[0].angle).toBe(180);
    });

    it('should only affect items from index onward when using index and step', function ()
    {
        Angle(items, 10, 5, 1);

        expect(items[0].angle).toBe(0);
        expect(items[1].angle).toBe(10);
        expect(items[2].angle).toBe(15);
        expect(items[3].angle).toBe(20);
        expect(items[4].angle).toBe(25);
    });
});
