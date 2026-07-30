var ReverseRows = require('../../../../src/utils/array/matrix/ReverseRows');

describe('Phaser.Utils.Array.Matrix.ReverseRows', function ()
{
    it('should reverse the elements of each row in a matrix', function ()
    {
        var matrix = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ];

        ReverseRows(matrix);

        expect(matrix[0]).toEqual([3, 2, 1]);
        expect(matrix[1]).toEqual([6, 5, 4]);
        expect(matrix[2]).toEqual([9, 8, 7]);
    });

    it('should return the same matrix reference', function ()
    {
        var matrix = [
            [1, 2, 3],
            [4, 5, 6]
        ];

        var result = ReverseRows(matrix);

        expect(result).toBe(matrix);
    });

    it('should mutate the matrix in place', function ()
    {
        var row0 = [1, 2, 3];
        var row1 = [4, 5, 6];
        var matrix = [row0, row1];

        ReverseRows(matrix);

        expect(matrix[0]).toBe(row0);
        expect(matrix[1]).toBe(row1);
        expect(row0).toEqual([3, 2, 1]);
        expect(row1).toEqual([6, 5, 4]);
    });

    it('should work with a single-element row', function ()
    {
        var matrix = [
            [1],
            [2],
            [3]
        ];

        ReverseRows(matrix);

        expect(matrix[0]).toEqual([1]);
        expect(matrix[1]).toEqual([2]);
        expect(matrix[2]).toEqual([3]);
    });

    it('should work with a single row', function ()
    {
        var matrix = [
            [1, 2, 3, 4]
        ];

        ReverseRows(matrix);

        expect(matrix[0]).toEqual([4, 3, 2, 1]);
    });

    it('should work with a larger matrix', function ()
    {
        var matrix = [
            [1, 1, 1, 1, 1, 1],
            [2, 0, 0, 0, 0, 4],
            [2, 0, 1, 2, 0, 4],
            [2, 0, 3, 4, 0, 4],
            [2, 0, 0, 0, 0, 4],
            [3, 3, 3, 3, 3, 3]
        ];

        ReverseRows(matrix);

        expect(matrix[0]).toEqual([1, 1, 1, 1, 1, 1]);
        expect(matrix[1]).toEqual([4, 0, 0, 0, 0, 2]);
        expect(matrix[2]).toEqual([4, 0, 2, 1, 0, 2]);
        expect(matrix[3]).toEqual([4, 0, 4, 3, 0, 2]);
        expect(matrix[4]).toEqual([4, 0, 0, 0, 0, 2]);
        expect(matrix[5]).toEqual([3, 3, 3, 3, 3, 3]);
    });

    it('should work with string elements', function ()
    {
        var matrix = [
            ['a', 'b', 'c'],
            ['d', 'e', 'f']
        ];

        ReverseRows(matrix);

        expect(matrix[0]).toEqual(['c', 'b', 'a']);
        expect(matrix[1]).toEqual(['f', 'e', 'd']);
    });

    it('should work with mixed-type elements', function ()
    {
        var matrix = [
            [1, 'two', true],
            [null, 0, 'end']
        ];

        ReverseRows(matrix);

        expect(matrix[0]).toEqual([true, 'two', 1]);
        expect(matrix[1]).toEqual(['end', 0, null]);
    });

    it('should handle a two-element row correctly', function ()
    {
        var matrix = [
            [1, 2],
            [3, 4]
        ];

        ReverseRows(matrix);

        expect(matrix[0]).toEqual([2, 1]);
        expect(matrix[1]).toEqual([4, 3]);
    });

    it('should return an empty matrix unchanged', function ()
    {
        var matrix = [];

        var result = ReverseRows(matrix);

        expect(result).toEqual([]);
        expect(result).toBe(matrix);
    });
});
