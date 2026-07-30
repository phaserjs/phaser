var Shuffle = require('../../src/actions/Shuffle');

describe('Phaser.Actions.Shuffle', function ()
{
    it('should return the same array reference that was passed in', function ()
    {
        var items = [ 1, 2, 3, 4, 5 ];
        var result = Shuffle(items);

        expect(result).toBe(items);
    });

    it('should return an array with the same length', function ()
    {
        var items = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
        var result = Shuffle(items);

        expect(result.length).toBe(8);
    });

    it('should contain all original elements after shuffling', function ()
    {
        var items = [ 1, 2, 3, 4, 5 ];
        var copy = items.slice();
        Shuffle(items);

        copy.forEach(function (val)
        {
            expect(items.indexOf(val)).not.toBe(-1);
        });
    });

    it('should modify the array in place', function ()
    {
        var items = [ 1, 2, 3, 4, 5 ];
        var ref = items;
        Shuffle(items);

        expect(items).toBe(ref);
    });

    it('should handle an empty array', function ()
    {
        var items = [];
        var result = Shuffle(items);

        expect(result).toBe(items);
        expect(result.length).toBe(0);
    });

    it('should handle a single-element array', function ()
    {
        var items = [ 42 ];
        var result = Shuffle(items);

        expect(result).toBe(items);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(42);
    });

    it('should handle a two-element array', function ()
    {
        var items = [ 'a', 'b' ];
        var result = Shuffle(items);

        expect(result.length).toBe(2);
        expect(result.indexOf('a')).not.toBe(-1);
        expect(result.indexOf('b')).not.toBe(-1);
    });

    it('should handle an array of plain objects', function ()
    {
        var a = { id: 1 };
        var b = { id: 2 };
        var c = { id: 3 };
        var items = [ a, b, c ];
        var result = Shuffle(items);

        expect(result.length).toBe(3);
        expect(result.indexOf(a)).not.toBe(-1);
        expect(result.indexOf(b)).not.toBe(-1);
        expect(result.indexOf(c)).not.toBe(-1);
    });

    it('should produce at least one different ordering over many iterations', function ()
    {
        var original = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
        var originalStr = original.join(',');
        var foundDifferent = false;

        for (var i = 0; i < 100; i++)
        {
            var items = original.slice();
            Shuffle(items);

            if (items.join(',') !== originalStr)
            {
                foundDifferent = true;
                break;
            }
        }

        expect(foundDifferent).toBe(true);
    });

    it('should not add or remove elements during shuffling', function ()
    {
        var items = [ 10, 20, 30, 40, 50 ];
        var sum = items.reduce(function (acc, val) { return acc + val; }, 0);
        Shuffle(items);
        var shuffledSum = items.reduce(function (acc, val) { return acc + val; }, 0);

        expect(shuffledSum).toBe(sum);
    });
});
