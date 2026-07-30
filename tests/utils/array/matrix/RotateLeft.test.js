var RotateLeft = require('../../../../src/utils/array/matrix/RotateLeft');

describe('Phaser.Utils.Array.Matrix.RotateLeft', function ()
{
    it('should rotate a square matrix 90 degrees counter-clockwise once by default', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = RotateLeft(matrix);

        expect(result[0]).toEqual([ 3, 6, 9 ]);
        expect(result[1]).toEqual([ 2, 5, 8 ]);
        expect(result[2]).toEqual([ 1, 4, 7 ]);
    });

    it('should default amount to 1 when not provided', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ]
        ];

        var once = RotateLeft(matrix, 1);
        var matrix2 = [
            [ 1, 2 ],
            [ 3, 4 ]
        ];
        var defaultAmount = RotateLeft(matrix2);

        expect(defaultAmount).toEqual(once);
    });

    it('should rotate twice when amount is 2', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = RotateLeft(matrix, 2);

        expect(result[0]).toEqual([ 9, 8, 7 ]);
        expect(result[1]).toEqual([ 6, 5, 4 ]);
        expect(result[2]).toEqual([ 3, 2, 1 ]);
    });

    it('should rotate three times when amount is 3', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = RotateLeft(matrix, 3);

        expect(result[0]).toEqual([ 7, 4, 1 ]);
        expect(result[1]).toEqual([ 8, 5, 2 ]);
        expect(result[2]).toEqual([ 9, 6, 3 ]);
    });

    it('should return original orientation when rotated 4 times', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = RotateLeft(matrix, 4);

        expect(result[0]).toEqual([ 1, 2, 3 ]);
        expect(result[1]).toEqual([ 4, 5, 6 ]);
        expect(result[2]).toEqual([ 7, 8, 9 ]);
    });

    it('should rotate a non-square (rectangular) matrix', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ]
        ];

        var result = RotateLeft(matrix);

        expect(result[0]).toEqual([ 3, 6 ]);
        expect(result[1]).toEqual([ 2, 5 ]);
        expect(result[2]).toEqual([ 1, 4 ]);
    });

    it('should return a matrix with correct dimensions after rotating a non-square matrix', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ]
        ];

        var result = RotateLeft(matrix);

        expect(result.length).toBe(3);
        expect(result[0].length).toBe(2);
    });

    it('should return the matrix array', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ]
        ];

        var result = RotateLeft(matrix);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should handle a 2x2 matrix', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ]
        ];

        var result = RotateLeft(matrix);

        expect(result[0]).toEqual([ 2, 4 ]);
        expect(result[1]).toEqual([ 1, 3 ]);
    });

    it('should handle a 1x2 matrix (single row, two columns)', function ()
    {
        var matrix = [
            [ 1, 2 ]
        ];

        var result = RotateLeft(matrix);

        expect(result.length).toBe(2);
        expect(result[0]).toEqual([ 2 ]);
        expect(result[1]).toEqual([ 1 ]);
    });

    it('should handle a matrix with identical values', function ()
    {
        var matrix = [
            [ 0, 0, 0 ],
            [ 0, 0, 0 ],
            [ 0, 0, 0 ]
        ];

        var result = RotateLeft(matrix);

        expect(result[0]).toEqual([ 0, 0, 0 ]);
        expect(result[1]).toEqual([ 0, 0, 0 ]);
        expect(result[2]).toEqual([ 0, 0, 0 ]);
    });

    it('should handle a matrix with negative values', function ()
    {
        var matrix = [
            [ -1, -2 ],
            [ -3, -4 ]
        ];

        var result = RotateLeft(matrix);

        expect(result[0]).toEqual([ -2, -4 ]);
        expect(result[1]).toEqual([ -1, -3 ]);
    });

    it('should handle a matrix with mixed positive and negative values', function ()
    {
        var matrix = [
            [  1, -2 ],
            [ -3,  4 ]
        ];

        var result = RotateLeft(matrix);

        expect(result[0]).toEqual([ -2, 4 ]);
        expect(result[1]).toEqual([ 1, -3 ]);
    });

    it('should rotate 0 times and return original matrix when amount is 0', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = RotateLeft(matrix, 0);

        expect(result[0]).toEqual([ 1, 2, 3 ]);
        expect(result[1]).toEqual([ 4, 5, 6 ]);
        expect(result[2]).toEqual([ 7, 8, 9 ]);
    });

    it('should produce equivalent result to three left rotations when rotating right once', function ()
    {
        var matrixLeft3 = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];
        var matrixLeft1 = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var left3 = RotateLeft(matrixLeft3, 3);
        var left1 = RotateLeft(matrixLeft1, 1);

        expect(left3).not.toEqual(left1);
    });
});
