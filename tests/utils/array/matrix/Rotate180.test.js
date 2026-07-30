var Rotate180 = require('../../../../src/utils/array/matrix/Rotate180');

describe('Phaser.Utils.Array.Matrix.Rotate180', function ()
{
    it('should return null for an invalid matrix', function ()
    {
        expect(Rotate180(null)).toBeNull();
        expect(Rotate180(undefined)).toBeNull();
        expect(Rotate180([])).toBeNull();
    });

    it('should rotate a 2x2 matrix 180 degrees', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ]
        ];

        var result = Rotate180(matrix);

        expect(result[0][0]).toBe(4);
        expect(result[0][1]).toBe(3);
        expect(result[1][0]).toBe(2);
        expect(result[1][1]).toBe(1);
    });

    it('should rotate a 3x3 matrix 180 degrees', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = Rotate180(matrix);

        expect(result[0]).toEqual([ 9, 8, 7 ]);
        expect(result[1]).toEqual([ 6, 5, 4 ]);
        expect(result[2]).toEqual([ 3, 2, 1 ]);
    });

    it('should rotate a 6x6 matrix 180 degrees', function ()
    {
        var matrix = [
            [ 1, 1, 1, 1, 1, 1 ],
            [ 2, 0, 0, 0, 0, 4 ],
            [ 2, 0, 1, 2, 0, 4 ],
            [ 2, 0, 3, 4, 0, 4 ],
            [ 2, 0, 0, 0, 0, 4 ],
            [ 3, 3, 3, 3, 3, 3 ]
        ];

        var result = Rotate180(matrix);

        expect(result[0]).toEqual([ 3, 3, 3, 3, 3, 3 ]);
        expect(result[1]).toEqual([ 4, 0, 0, 0, 0, 2 ]);
        expect(result[2]).toEqual([ 4, 0, 4, 3, 0, 2 ]);
        expect(result[3]).toEqual([ 4, 0, 2, 1, 0, 2 ]);
        expect(result[4]).toEqual([ 4, 0, 0, 0, 0, 2 ]);
        expect(result[5]).toEqual([ 1, 1, 1, 1, 1, 1 ]);
    });

    it('should rotate a rectangular matrix (more rows than columns) 180 degrees', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ],
            [ 5, 6 ]
        ];

        var result = Rotate180(matrix);

        expect(result[0]).toEqual([ 6, 5 ]);
        expect(result[1]).toEqual([ 4, 3 ]);
        expect(result[2]).toEqual([ 2, 1 ]);
    });

    it('should rotate a rectangular matrix (more columns than rows) 180 degrees', function ()
    {
        var matrix = [
            [ 1, 2, 3, 4 ],
            [ 5, 6, 7, 8 ]
        ];

        var result = Rotate180(matrix);

        expect(result[0]).toEqual([ 8, 7, 6, 5 ]);
        expect(result[1]).toEqual([ 4, 3, 2, 1 ]);
    });

    it('should apply double rotation returning to original orientation', function ()
    {
        var original = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var copy = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var once = Rotate180(original);
        var twice = Rotate180(once);

        expect(twice[0]).toEqual(copy[0]);
        expect(twice[1]).toEqual(copy[1]);
        expect(twice[2]).toEqual(copy[2]);
    });

    it('should return the matrix array', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ]
        ];

        var result = Rotate180(matrix);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
    });

    it('should handle a matrix with identical values', function ()
    {
        var matrix = [
            [ 0, 0, 0 ],
            [ 0, 0, 0 ],
            [ 0, 0, 0 ]
        ];

        var result = Rotate180(matrix);

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

        var result = Rotate180(matrix);

        expect(result[0][0]).toBe(-4);
        expect(result[0][1]).toBe(-3);
        expect(result[1][0]).toBe(-2);
        expect(result[1][1]).toBe(-1);
    });

    it('should handle a matrix with string values', function ()
    {
        var matrix = [
            [ 'a', 'b', 'c' ],
            [ 'd', 'e', 'f' ]
        ];

        var result = Rotate180(matrix);

        expect(result[0]).toEqual([ 'f', 'e', 'd' ]);
        expect(result[1]).toEqual([ 'c', 'b', 'a' ]);
    });
});
