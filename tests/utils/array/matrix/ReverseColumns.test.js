var ReverseColumns = require('../../../../src/utils/array/matrix/ReverseColumns');

describe('Phaser.Utils.Array.Matrix.ReverseColumns', function ()
{
    it('should reverse the row order of a matrix', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var result = ReverseColumns(matrix);

        expect(result[0]).toEqual([ 7, 8, 9 ]);
        expect(result[1]).toEqual([ 4, 5, 6 ]);
        expect(result[2]).toEqual([ 1, 2, 3 ]);
    });

    it('should return the same matrix reference', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ]
        ];

        var result = ReverseColumns(matrix);

        expect(result).toBe(matrix);
    });

    it('should reverse a two-row matrix', function ()
    {
        var matrix = [
            [ 1, 1, 1 ],
            [ 2, 2, 2 ]
        ];

        var result = ReverseColumns(matrix);

        expect(result[0]).toEqual([ 2, 2, 2 ]);
        expect(result[1]).toEqual([ 1, 1, 1 ]);
    });

    it('should handle a single-row matrix', function ()
    {
        var matrix = [
            [ 1, 2, 3 ]
        ];

        var result = ReverseColumns(matrix);

        expect(result[0]).toEqual([ 1, 2, 3 ]);
    });

    it('should handle a matrix with a single element', function ()
    {
        var matrix = [
            [ 42 ]
        ];

        var result = ReverseColumns(matrix);

        expect(result[0]).toEqual([ 42 ]);
    });

    it('should reverse six rows correctly', function ()
    {
        var matrix = [
            [ 1, 1, 1, 1, 1, 1 ],
            [ 2, 0, 0, 0, 0, 4 ],
            [ 2, 0, 1, 2, 0, 4 ],
            [ 2, 0, 3, 4, 0, 4 ],
            [ 2, 0, 0, 0, 0, 4 ],
            [ 3, 3, 3, 3, 3, 3 ]
        ];

        var result = ReverseColumns(matrix);

        expect(result[0]).toEqual([ 3, 3, 3, 3, 3, 3 ]);
        expect(result[1]).toEqual([ 2, 0, 0, 0, 0, 4 ]);
        expect(result[2]).toEqual([ 2, 0, 3, 4, 0, 4 ]);
        expect(result[3]).toEqual([ 2, 0, 1, 2, 0, 4 ]);
        expect(result[4]).toEqual([ 2, 0, 0, 0, 0, 4 ]);
        expect(result[5]).toEqual([ 1, 1, 1, 1, 1, 1 ]);
    });

    it('should mutate the original matrix in place', function ()
    {
        var matrix = [
            [ 1, 2 ],
            [ 3, 4 ],
            [ 5, 6 ]
        ];

        ReverseColumns(matrix);

        expect(matrix[0]).toEqual([ 5, 6 ]);
        expect(matrix[1]).toEqual([ 3, 4 ]);
        expect(matrix[2]).toEqual([ 1, 2 ]);
    });

    it('should handle a matrix with string values', function ()
    {
        var matrix = [
            [ 'a', 'b' ],
            [ 'c', 'd' ],
            [ 'e', 'f' ]
        ];

        var result = ReverseColumns(matrix);

        expect(result[0]).toEqual([ 'e', 'f' ]);
        expect(result[1]).toEqual([ 'c', 'd' ]);
        expect(result[2]).toEqual([ 'a', 'b' ]);
    });

    it('should handle a matrix with mixed value types', function ()
    {
        var matrix = [
            [ 1, 'a', true ],
            [ 2, 'b', false ]
        ];

        var result = ReverseColumns(matrix);

        expect(result[0]).toEqual([ 2, 'b', false ]);
        expect(result[1]).toEqual([ 1, 'a', true ]);
    });

    it('should return the correct number of rows after reversing', function ()
    {
        var matrix = [
            [ 1 ],
            [ 2 ],
            [ 3 ],
            [ 4 ]
        ];

        var result = ReverseColumns(matrix);

        expect(result.length).toBe(4);
    });
});
