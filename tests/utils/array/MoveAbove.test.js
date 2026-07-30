var MoveAbove = require('../../../src/utils/array/MoveAbove');

describe('Phaser.Utils.Array.MoveAbove', function ()
{
    var arr;

    beforeEach(function ()
    {
        arr = [ 'a', 'b', 'c', 'd', 'e' ];
    });

    it('should return the array', function ()
    {
        var result = MoveAbove(arr, 'a', 'b');

        expect(result).toBe(arr);
    });

    it('should move item1 immediately above item2 when item1 is below item2', function ()
    {
        MoveAbove(arr, 'a', 'c');

        expect(arr).toEqual([ 'b', 'c', 'a', 'd', 'e' ]);
    });

    it('should not move item1 when it is already above item2', function ()
    {
        MoveAbove(arr, 'c', 'a');

        expect(arr).toEqual([ 'a', 'b', 'c', 'd', 'e' ]);
    });

    it('should not move item1 when it is immediately above item2', function ()
    {
        MoveAbove(arr, 'b', 'a');

        expect(arr).toEqual([ 'a', 'b', 'c', 'd', 'e' ]);
    });

    it('should return the array unchanged when item1 equals item2', function ()
    {
        MoveAbove(arr, 'b', 'b');

        expect(arr).toEqual([ 'a', 'b', 'c', 'd', 'e' ]);
    });

    it('should throw when item1 is not in the array', function ()
    {
        expect(function ()
        {
            MoveAbove(arr, 'z', 'a');
        }).toThrow('Supplied items must be elements of the same array');
    });

    it('should throw when item2 is not in the array', function ()
    {
        expect(function ()
        {
            MoveAbove(arr, 'a', 'z');
        }).toThrow('Supplied items must be elements of the same array');
    });

    it('should throw when neither item is in the array', function ()
    {
        expect(function ()
        {
            MoveAbove(arr, 'x', 'z');
        }).toThrow('Supplied items must be elements of the same array');
    });

    it('should move the first element above the last element', function ()
    {
        MoveAbove(arr, 'a', 'e');

        expect(arr).toEqual([ 'b', 'c', 'd', 'e', 'a' ]);
    });

    it('should move item1 above the last element', function ()
    {
        MoveAbove(arr, 'b', 'e');

        expect(arr).toEqual([ 'a', 'c', 'd', 'e', 'b' ]);
    });

    it('should work with object references', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var obj3 = { id: 3 };
        var objArr = [ obj1, obj2, obj3 ];

        MoveAbove(objArr, obj1, obj3);

        expect(objArr[0]).toBe(obj2);
        expect(objArr[1]).toBe(obj3);
        expect(objArr[2]).toBe(obj1);
    });

    it('should work with numeric values', function ()
    {
        var numArr = [ 10, 20, 30, 40, 50 ];

        MoveAbove(numArr, 10, 40);

        expect(numArr).toEqual([ 20, 30, 40, 10, 50 ]);
    });

    it('should not alter array length after move', function ()
    {
        var original = arr.length;

        MoveAbove(arr, 'a', 'd');

        expect(arr.length).toBe(original);
    });

    it('should move item1 immediately after item2, not to the end', function ()
    {
        MoveAbove(arr, 'a', 'c');

        expect(arr.indexOf('a')).toBe(arr.indexOf('c') + 1);
    });

    it('should handle a two-element array where item1 is below item2', function ()
    {
        var twoArr = [ 'x', 'y' ];

        MoveAbove(twoArr, 'x', 'y');

        expect(twoArr).toEqual([ 'y', 'x' ]);
    });

    it('should handle a two-element array where item1 is already above item2', function ()
    {
        var twoArr = [ 'x', 'y' ];

        MoveAbove(twoArr, 'y', 'x');

        expect(twoArr).toEqual([ 'x', 'y' ]);
    });
});
