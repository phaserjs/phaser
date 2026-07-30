var TransposeMatrix = require('../../../../src/utils/array/matrix/TransposeMatrix');

describe('Phaser.Utils.Array.Matrix.TransposeMatrix', function ()
{
    it('should transpose a square matrix', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = TransposeMatrix(matrix);

        expect(result[0]).toEqual([ 1, 4, 7 ]);
        expect(result[1]).toEqual([ 2, 5, 8 ]);
        expect(result[2]).toEqual([ 3, 6, 9 ]);
    });

    it('should transpose a rectangular matrix with more columns than rows', function ()
    {
        var matrix = [
            [ 1, 2, 3, 4 ],
            [ 5, 6, 7, 8 ]
        ];

        var result = TransposeMatrix(matrix);

        expect(result.length).toBe(4);
        expect(result[0]).toEqual([ 1, 5 ]);
        expect(result[1]).toEqual([ 2, 6 ]);
        expect(result[2]).toEqual([ 3, 7 ]);
        expect(result[3]).toEqual([ 4, 8 ]);
    });

    it('should transpose a rectangular matrix with more rows than columns', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ],
            [ 5, 6 ],
            [ 7, 8 ]
        ];

        var result = TransposeMatrix(matrix);

        expect(result.length).toBe(2);
        expect(result[0]).toEqual([ 1, 3, 5, 7 ]);
        expect(result[1]).toEqual([ 2, 4, 6, 8 ]);
    });

    it('should return a new array and not modify the original', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ]
        ];

        var result = TransposeMatrix(matrix);

        expect(result).not.toBe(matrix);
        expect(matrix[0]).toEqual([ 1, 2 ]);
        expect(matrix[1]).toEqual([ 3, 4 ]);
    });

    it('should transpose a 1x1 matrix', function ()
    {
        var matrix = [ [ 42 ] ];

        var result = TransposeMatrix(matrix);

        expect(result.length).toBe(1);
        expect(result[0].length).toBe(1);
        expect(result[0][0]).toBe(42);
    });

    it('should transpose a single-row matrix into a single-column matrix', function ()
    {
        var matrix = [ [ 1, 2, 3, 4 ] ];

        var result = TransposeMatrix(matrix);

        expect(result.length).toBe(4);
        expect(result[0]).toEqual([ 1 ]);
        expect(result[1]).toEqual([ 2 ]);
        expect(result[2]).toEqual([ 3 ]);
        expect(result[3]).toEqual([ 4 ]);
    });

    it('should transpose a single-column matrix into a single-row matrix', function ()
    {
        var matrix = [ [ 1 ], [ 2 ], [ 3 ], [ 4 ] ];

        var result = TransposeMatrix(matrix);

        expect(result.length).toBe(1);
        expect(result[0]).toEqual([ 1, 2, 3, 4 ]);
    });

    it('should produce a result with correct dimensions', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ]
        ];

        var result = TransposeMatrix(matrix);

        expect(result.length).toBe(3);
        expect(result[0].length).toBe(2);
    });

    it('should handle a matrix with string values', function ()
    {
        var matrix = [
            [ 'a', 'b', 'c' ],
            [ 'd', 'e', 'f' ]
        ];

        var result = TransposeMatrix(matrix);

        expect(result[0]).toEqual([ 'a', 'd' ]);
        expect(result[1]).toEqual([ 'b', 'e' ]);
        expect(result[2]).toEqual([ 'c', 'f' ]);
    });

    it('should handle a matrix with mixed values including zero and negative numbers', function ()
    {
        var matrix = [
            [  0, -1,  2 ],
            [ -3,  4, -5 ]
        ];

        var result = TransposeMatrix(matrix);

        expect(result[0]).toEqual([  0, -3 ]);
        expect(result[1]).toEqual([ -1,  4 ]);
        expect(result[2]).toEqual([  2, -5 ]);
    });

    it('should double-transpose back to the original matrix', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = TransposeMatrix(TransposeMatrix(matrix));

        expect(result[0]).toEqual(matrix[0]);
        expect(result[1]).toEqual(matrix[1]);
        expect(result[2]).toEqual(matrix[2]);
    });

    it('should transpose the example matrix from the documentation', function ()
    {
        var matrix = [
            [ 1, 1, 1, 1, 1, 1 ],
            [ 2, 0, 0, 0, 0, 4 ],
            [ 2, 0, 1, 2, 0, 4 ],
            [ 2, 0, 3, 4, 0, 4 ],
            [ 2, 0, 0, 0, 0, 4 ],
            [ 3, 3, 3, 3, 3, 3 ]
        ];

        var result = TransposeMatrix(matrix);

        expect(result.length).toBe(6);
        expect(result[0].length).toBe(6);
        expect(result[0]).toEqual([ 1, 2, 2, 2, 2, 3 ]);
        expect(result[1]).toEqual([ 1, 0, 0, 0, 0, 3 ]);
        expect(result[5]).toEqual([ 1, 4, 4, 4, 4, 3 ]);
    });
});
