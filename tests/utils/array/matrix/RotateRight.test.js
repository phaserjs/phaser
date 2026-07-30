var RotateRight = require('../../../../src/utils/array/matrix/RotateRight');

describe('Phaser.Utils.Array.Matrix.RotateRight', function ()
{
    it('should rotate a square matrix 90 degrees clockwise once', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = RotateRight(matrix);

        expect(result[0]).toEqual([ 7, 4, 1 ]);
        expect(result[1]).toEqual([ 8, 5, 2 ]);
        expect(result[2]).toEqual([ 9, 6, 3 ]);
    });

    it('should default amount to 1 when not specified', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ]
        ];

        var result = RotateRight(matrix);

        expect(result[0]).toEqual([ 3, 1 ]);
        expect(result[1]).toEqual([ 4, 2 ]);
    });

    it('should rotate a matrix 90 degrees clockwise twice when amount is 2', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = RotateRight(matrix, 2);

        expect(result[0]).toEqual([ 9, 8, 7 ]);
        expect(result[1]).toEqual([ 6, 5, 4 ]);
        expect(result[2]).toEqual([ 3, 2, 1 ]);
    });

    it('should rotate a matrix 90 degrees clockwise three times when amount is 3', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = RotateRight(matrix, 3);

        expect(result[0]).toEqual([ 3, 6, 9 ]);
        expect(result[1]).toEqual([ 2, 5, 8 ]);
        expect(result[2]).toEqual([ 1, 4, 7 ]);
    });

    it('should return an equivalent matrix when rotating 4 times', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = RotateRight(matrix, 4);

        expect(result[0]).toEqual([ 1, 2, 3 ]);
        expect(result[1]).toEqual([ 4, 5, 6 ]);
        expect(result[2]).toEqual([ 7, 8, 9 ]);
    });

    it('should rotate a rectangular matrix (more rows than columns)', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ],
            [ 5, 6 ]
        ];

        var result = RotateRight(matrix);

        expect(result[0]).toEqual([ 5, 3, 1 ]);
        expect(result[1]).toEqual([ 6, 4, 2 ]);
    });

    it('should rotate a rectangular matrix (more columns than rows)', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ]
        ];

        var result = RotateRight(matrix);

        expect(result[0]).toEqual([ 4, 1 ]);
        expect(result[1]).toEqual([ 5, 2 ]);
        expect(result[2]).toEqual([ 6, 3 ]);
    });

    it('should return the matrix unchanged when amount is 0', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = RotateRight(matrix, 0);

        expect(result[0]).toEqual([ 1, 2, 3 ]);
        expect(result[1]).toEqual([ 4, 5, 6 ]);
        expect(result[2]).toEqual([ 7, 8, 9 ]);
    });

    it('should return a new matrix array', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ]
        ];

        var result = RotateRight(matrix, 1);

        expect(result).not.toBe(matrix);
    });

    it('should work with a 2x2 matrix', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ]
        ];

        var result = RotateRight(matrix);

        expect(result[0]).toEqual([ 3, 1 ]);
        expect(result[1]).toEqual([ 4, 2 ]);
    });

    it('should work with non-numeric values', function ()
    {
        var matrix = [
            [ 'a', 'b' ],
            [ 'c', 'd' ]
        ];

        var result = RotateRight(matrix);

        expect(result[0]).toEqual([ 'c', 'a' ]);
        expect(result[1]).toEqual([ 'd', 'b' ]);
    });

    it('should preserve the number of rows and columns when square', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = RotateRight(matrix);

        expect(result.length).toBe(3);
        expect(result[0].length).toBe(3);
    });

    it('should swap dimensions when rotating a rectangular matrix', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ]
        ];

        var result = RotateRight(matrix);

        expect(result.length).toBe(3);
        expect(result[0].length).toBe(2);
    });
});
