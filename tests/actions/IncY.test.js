var IncY = require('../../src/actions/IncY');

describe('Phaser.Actions.IncY', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { y: 0 },
            { y: 10 },
            { y: 20 },
            { y: 30 }
        ];
    });

    it('should return the same array that was passed in', function ()
    {
        var result = IncY(items, 5);

        expect(result).toBe(items);
    });

    it('should add value to the y property of each item', function ()
    {
        IncY(items, 5);

        expect(items[0].y).toBe(5);
        expect(items[1].y).toBe(15);
        expect(items[2].y).toBe(25);
        expect(items[3].y).toBe(35);
    });

    it('should add zero when value is 0', function ()
    {
        IncY(items, 0);

        expect(items[0].y).toBe(0);
        expect(items[1].y).toBe(10);
        expect(items[2].y).toBe(20);
        expect(items[3].y).toBe(30);
    });

    it('should subtract when value is negative', function ()
    {
        IncY(items, -5);

        expect(items[0].y).toBe(-5);
        expect(items[1].y).toBe(5);
        expect(items[2].y).toBe(15);
        expect(items[3].y).toBe(25);
    });

    it('should apply step incrementally multiplied by iteration counter', function ()
    {
        IncY(items, 10, 5);

        // t=0: 0  + 10 + (0*5) = 10
        // t=1: 10 + 10 + (1*5) = 25
        // t=2: 20 + 10 + (2*5) = 40
        // t=3: 30 + 10 + (3*5) = 55
        expect(items[0].y).toBe(10);
        expect(items[1].y).toBe(25);
        expect(items[2].y).toBe(40);
        expect(items[3].y).toBe(55);
    });

    it('should default step to 0 when not provided', function ()
    {
        IncY(items, 7);

        expect(items[0].y).toBe(7);
        expect(items[1].y).toBe(17);
        expect(items[2].y).toBe(27);
        expect(items[3].y).toBe(37);
    });

    it('should start from the given index when index is provided', function ()
    {
        IncY(items, 10, 0, 2);

        expect(items[0].y).toBe(0);
        expect(items[1].y).toBe(10);
        expect(items[2].y).toBe(30);
        expect(items[3].y).toBe(40);
    });

    it('should iterate from end to start when direction is -1', function ()
    {
        // direction=-1 iterates from index down to 0
        // Starting at index=3 (default end-to-start uses index param as start)
        IncY(items, 10, 0, 3, -1);

        // t=0: items[3].y = 30 + 10 + (0*0) = 40
        // t=1: items[2].y = 20 + 10 + (1*0) = 30
        // t=2: items[1].y = 10 + 10 + (2*0) = 20
        // t=3: items[0].y =  0 + 10 + (3*0) = 10
        expect(items[0].y).toBe(10);
        expect(items[1].y).toBe(20);
        expect(items[2].y).toBe(30);
        expect(items[3].y).toBe(40);
    });

    it('should apply step correctly when iterating in reverse', function ()
    {
        IncY(items, 10, 5, 3, -1);

        // t=0: items[3].y = 30 + 10 + (0*5) = 40
        // t=1: items[2].y = 20 + 10 + (1*5) = 35
        // t=2: items[1].y = 10 + 10 + (2*5) = 30
        // t=3: items[0].y =  0 + 10 + (3*5) = 25
        expect(items[3].y).toBe(40);
        expect(items[2].y).toBe(35);
        expect(items[1].y).toBe(30);
        expect(items[0].y).toBe(25);
    });

    it('should work with floating point values', function ()
    {
        IncY(items, 1.5);

        expect(items[0].y).toBeCloseTo(1.5);
        expect(items[1].y).toBeCloseTo(11.5);
        expect(items[2].y).toBeCloseTo(21.5);
        expect(items[3].y).toBeCloseTo(31.5);
    });

    it('should work with floating point step values', function ()
    {
        IncY(items, 1, 0.5);

        // t=0: 0  + 1 + (0*0.5) = 1.0
        // t=1: 10 + 1 + (1*0.5) = 11.5
        // t=2: 20 + 1 + (2*0.5) = 22.0
        // t=3: 30 + 1 + (3*0.5) = 32.5
        expect(items[0].y).toBeCloseTo(1.0);
        expect(items[1].y).toBeCloseTo(11.5);
        expect(items[2].y).toBeCloseTo(22.0);
        expect(items[3].y).toBeCloseTo(32.5);
    });

    it('should handle an empty array without error', function ()
    {
        var result = IncY([], 10);

        expect(result).toEqual([]);
    });

    it('should handle a single-item array', function ()
    {
        var single = [{ y: 5 }];

        IncY(single, 3);

        expect(single[0].y).toBe(8);
    });

    it('should not modify items before the given index', function ()
    {
        IncY(items, 100, 0, 2);

        expect(items[0].y).toBe(0);
        expect(items[1].y).toBe(10);
    });

    it('should handle large values correctly', function ()
    {
        IncY(items, 1000000);

        expect(items[0].y).toBe(1000000);
        expect(items[1].y).toBe(1000010);
    });
});
