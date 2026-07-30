var TranslateMatrix = require('../../../../src/utils/array/matrix/TranslateMatrix');

describe('Phaser.Utils.Array.Matrix.Translate', function ()
{
    var matrix;

    beforeEach(function ()
    {
        matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];
    });

    it('should return the matrix unchanged when x and y are zero', function ()
    {
        var result = TranslateMatrix(matrix, 0, 0);

        expect(result[0]).toEqual([ 1, 2, 3 ]);
        expect(result[1]).toEqual([ 4, 5, 6 ]);
        expect(result[2]).toEqual([ 7, 8, 9 ]);
    });

    it('should return the matrix unchanged when x and y are omitted', function ()
    {
        var result = TranslateMatrix(matrix);

        expect(result[0]).toEqual([ 1, 2, 3 ]);
        expect(result[1]).toEqual([ 4, 5, 6 ]);
        expect(result[2]).toEqual([ 7, 8, 9 ]);
    });

    it('should return the same matrix reference', function ()
    {
        var result = TranslateMatrix(matrix, 1, 1);

        expect(result).toBe(matrix);
    });

    it('should shift rows down by 1 when y is positive 1', function ()
    {
        var result = TranslateMatrix(matrix, 0, 1);

        expect(result[0]).toEqual([ 7, 8, 9 ]);
        expect(result[1]).toEqual([ 1, 2, 3 ]);
        expect(result[2]).toEqual([ 4, 5, 6 ]);
    });

    it('should shift rows down by 2 when y is positive 2', function ()
    {
        var result = TranslateMatrix(matrix, 0, 2);

        expect(result[0]).toEqual([ 4, 5, 6 ]);
        expect(result[1]).toEqual([ 7, 8, 9 ]);
        expect(result[2]).toEqual([ 1, 2, 3 ]);
    });

    it('should shift rows up by 1 when y is negative 1', function ()
    {
        var result = TranslateMatrix(matrix, 0, -1);

        expect(result[0]).toEqual([ 4, 5, 6 ]);
        expect(result[1]).toEqual([ 7, 8, 9 ]);
        expect(result[2]).toEqual([ 1, 2, 3 ]);
    });

    it('should shift rows up by 2 when y is negative 2', function ()
    {
        var result = TranslateMatrix(matrix, 0, -2);

        expect(result[0]).toEqual([ 7, 8, 9 ]);
        expect(result[1]).toEqual([ 1, 2, 3 ]);
        expect(result[2]).toEqual([ 4, 5, 6 ]);
    });

    it('should shift elements right by 1 within each row when x is positive 1', function ()
    {
        var result = TranslateMatrix(matrix, 1, 0);

        expect(result[0]).toEqual([ 3, 1, 2 ]);
        expect(result[1]).toEqual([ 6, 4, 5 ]);
        expect(result[2]).toEqual([ 9, 7, 8 ]);
    });

    it('should shift elements right by 2 within each row when x is positive 2', function ()
    {
        var result = TranslateMatrix(matrix, 2, 0);

        expect(result[0]).toEqual([ 2, 3, 1 ]);
        expect(result[1]).toEqual([ 5, 6, 4 ]);
        expect(result[2]).toEqual([ 8, 9, 7 ]);
    });

    it('should shift elements left by 1 within each row when x is negative 1', function ()
    {
        var result = TranslateMatrix(matrix, -1, 0);

        expect(result[0]).toEqual([ 2, 3, 1 ]);
        expect(result[1]).toEqual([ 5, 6, 4 ]);
        expect(result[2]).toEqual([ 8, 9, 7 ]);
    });

    it('should shift elements left by 2 within each row when x is negative 2', function ()
    {
        var result = TranslateMatrix(matrix, -2, 0);

        expect(result[0]).toEqual([ 3, 1, 2 ]);
        expect(result[1]).toEqual([ 6, 4, 5 ]);
        expect(result[2]).toEqual([ 9, 7, 8 ]);
    });

    it('should apply both horizontal and vertical translation together', function ()
    {
        var result = TranslateMatrix(matrix, 1, 1);

        // y=1 shifts rows down: [7,8,9], [1,2,3], [4,5,6]
        // x=1 shifts each row right by 1: [9,7,8], [3,1,2], [6,4,5]
        expect(result[0]).toEqual([ 9, 7, 8 ]);
        expect(result[1]).toEqual([ 3, 1, 2 ]);
        expect(result[2]).toEqual([ 6, 4, 5 ]);
    });

    it('should apply negative x and positive y together', function ()
    {
        var result = TranslateMatrix(matrix, -1, 1);

        // y=1 shifts rows down: [7,8,9], [1,2,3], [4,5,6]
        // x=-1 shifts each row left by 1: [8,9,7], [2,3,1], [5,6,4]
        expect(result[0]).toEqual([ 8, 9, 7 ]);
        expect(result[1]).toEqual([ 2, 3, 1 ]);
        expect(result[2]).toEqual([ 5, 6, 4 ]);
    });

    it('should apply positive x and negative y together', function ()
    {
        var result = TranslateMatrix(matrix, 1, -1);

        // y=-1 shifts rows up: [4,5,6], [7,8,9], [1,2,3]
        // x=1 shifts each row right by 1: [6,4,5], [9,7,8], [3,1,2]
        expect(result[0]).toEqual([ 6, 4, 5 ]);
        expect(result[1]).toEqual([ 9, 7, 8 ]);
        expect(result[2]).toEqual([ 3, 1, 2 ]);
    });

    it('should wrap cyclically when y equals the number of rows', function ()
    {
        var result = TranslateMatrix(matrix, 0, 3);

        expect(result[0]).toEqual([ 1, 2, 3 ]);
        expect(result[1]).toEqual([ 4, 5, 6 ]);
        expect(result[2]).toEqual([ 7, 8, 9 ]);
    });

    it('should wrap cyclically when x equals the row length', function ()
    {
        var result = TranslateMatrix(matrix, 3, 0);

        expect(result[0]).toEqual([ 1, 2, 3 ]);
        expect(result[1]).toEqual([ 4, 5, 6 ]);
        expect(result[2]).toEqual([ 7, 8, 9 ]);
    });

    it('should handle a larger matrix correctly', function ()
    {
        var big = [
            [ 1, 1, 1, 1, 1, 1 ],
            [ 2, 0, 0, 0, 0, 4 ],
            [ 2, 0, 1, 2, 0, 4 ],
            [ 2, 0, 3, 4, 0, 4 ],
            [ 2, 0, 0, 0, 0, 4 ],
            [ 3, 3, 3, 3, 3, 3 ]
        ];

        var result = TranslateMatrix(big, 0, 1);

        expect(result[0]).toEqual([ 3, 3, 3, 3, 3, 3 ]);
        expect(result[1]).toEqual([ 1, 1, 1, 1, 1, 1 ]);
        expect(result[5]).toEqual([ 2, 0, 0, 0, 0, 4 ]);
    });

    it('should handle a non-square matrix with horizontal translation', function ()
    {
        var wide = [
            [ 1, 2, 3, 4 ],
            [ 5, 6, 7, 8 ]
        ];

        var result = TranslateMatrix(wide, 1, 0);

        expect(result[0]).toEqual([ 4, 1, 2, 3 ]);
        expect(result[1]).toEqual([ 8, 5, 6, 7 ]);
    });

    it('should handle a non-square matrix with vertical translation', function ()
    {
        var tall = [
            [ 1, 2 ],
            [ 3, 4 ],
            [ 5, 6 ],
            [ 7, 8 ]
        ];

        var result = TranslateMatrix(tall, 0, 1);

        expect(result[0]).toEqual([ 7, 8 ]);
        expect(result[1]).toEqual([ 1, 2 ]);
        expect(result[2]).toEqual([ 3, 4 ]);
        expect(result[3]).toEqual([ 5, 6 ]);
    });

    it('should mutate the original matrix in place', function ()
    {
        TranslateMatrix(matrix, 1, 0);

        expect(matrix[0]).toEqual([ 3, 1, 2 ]);
        expect(matrix[1]).toEqual([ 6, 4, 5 ]);
        expect(matrix[2]).toEqual([ 9, 7, 8 ]);
    });
});
