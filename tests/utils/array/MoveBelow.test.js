var MoveBelow = require('../../../src/utils/array/MoveBelow');

describe('Phaser.Utils.Array.MoveBelow', function ()
{
    var arr;

    beforeEach(function ()
    {
        arr = [ 'a', 'b', 'c', 'd', 'e' ];
    });

    it('should return the array', function ()
    {
        var result = MoveBelow(arr, 'c', 'd');

        expect(result).toBe(arr);
    });

    it('should move item1 below item2 when item1 is above item2', function ()
    {
        MoveBelow(arr, 'd', 'b');

        expect(arr).toEqual([ 'a', 'd', 'b', 'c', 'e' ]);
    });

    it('should not move item1 when it is already below item2', function ()
    {
        MoveBelow(arr, 'b', 'd');

        expect(arr).toEqual([ 'a', 'b', 'c', 'd', 'e' ]);
    });

    it('should not move item1 when it is the same as item2', function ()
    {
        MoveBelow(arr, 'c', 'c');

        expect(arr).toEqual([ 'a', 'b', 'c', 'd', 'e' ]);
    });

    it('should move item1 to the start of the array when item2 is at index 0', function ()
    {
        MoveBelow(arr, 'c', 'a');

        expect(arr).toEqual([ 'c', 'a', 'b', 'd', 'e' ]);
    });

    it('should move the last element below item2', function ()
    {
        MoveBelow(arr, 'e', 'b');

        expect(arr).toEqual([ 'a', 'e', 'b', 'c', 'd' ]);
    });

    it('should move item1 to just before item2 when they are adjacent', function ()
    {
        MoveBelow(arr, 'd', 'c');

        expect(arr).toEqual([ 'a', 'b', 'd', 'c', 'e' ]);
    });

    it('should move item1 below item2 when item2 is the last element', function ()
    {
        // item1 is already below item2 in this case, so no change expected
        MoveBelow(arr, 'b', 'e');

        expect(arr).toEqual([ 'a', 'b', 'c', 'd', 'e' ]);
    });

    it('should throw an error when item1 is not in the array', function ()
    {
        expect(function ()
        {
            MoveBelow(arr, 'z', 'b');
        }).toThrow('Supplied items must be elements of the same array');
    });

    it('should throw an error when item2 is not in the array', function ()
    {
        expect(function ()
        {
            MoveBelow(arr, 'b', 'z');
        }).toThrow('Supplied items must be elements of the same array');
    });

    it('should throw an error when neither item is in the array', function ()
    {
        expect(function ()
        {
            MoveBelow(arr, 'x', 'z');
        }).toThrow('Supplied items must be elements of the same array');
    });

    it('should work with object references', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var obj3 = { id: 3 };
        var objArr = [ obj1, obj2, obj3 ];

        MoveBelow(objArr, obj3, obj1);

        expect(objArr[0]).toBe(obj3);
        expect(objArr[1]).toBe(obj1);
        expect(objArr[2]).toBe(obj2);
    });

    it('should work with numeric values', function ()
    {
        var numArr = [ 1, 2, 3, 4, 5 ];

        MoveBelow(numArr, 4, 2);

        expect(numArr).toEqual([ 1, 4, 2, 3, 5 ]);
    });

    it('should preserve array length after moving', function ()
    {
        var originalLength = arr.length;

        MoveBelow(arr, 'd', 'b');

        expect(arr.length).toBe(originalLength);
    });

    it('should modify the array in-place', function ()
    {
        var ref = arr;

        MoveBelow(arr, 'd', 'b');

        expect(arr).toBe(ref);
    });

    it('should handle a two-element array', function ()
    {
        var twoArr = [ 'x', 'y' ];

        MoveBelow(twoArr, 'y', 'x');

        expect(twoArr).toEqual([ 'y', 'x' ]);
    });

    it('should not change a two-element array when item1 is already below item2', function ()
    {
        var twoArr = [ 'x', 'y' ];

        MoveBelow(twoArr, 'x', 'y');

        expect(twoArr).toEqual([ 'x', 'y' ]);
    });
});
