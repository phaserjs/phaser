var CheckMatrix = require('../../../../src/utils/array/matrix/CheckMatrix');

describe('Phaser.Utils.Array.Matrix.CheckMatrix', function ()
{
    it('should return true for a valid square matrix', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        expect(CheckMatrix(matrix)).toBe(true);
    });

    it('should return true for a valid rectangular matrix', function ()
    {
        var matrix = [
            [ 1, 1, 1, 1, 1, 1 ],
            [ 2, 0, 0, 0, 0, 4 ],
            [ 2, 0, 1, 2, 0, 4 ],
            [ 2, 0, 3, 4, 0, 4 ],
            [ 2, 0, 0, 0, 0, 4 ],
            [ 3, 3, 3, 3, 3, 3 ]
        ];

        expect(CheckMatrix(matrix)).toBe(true);
    });

    it('should return true for a single-row matrix', function ()
    {
        expect(CheckMatrix([ [ 1, 2, 3 ] ])).toBe(true);
    });

    it('should return true for a single-element matrix', function ()
    {
        expect(CheckMatrix([ [ 42 ] ])).toBe(true);
    });

    it('should return true for a single-column matrix', function ()
    {
        var matrix = [ [ 1 ], [ 2 ], [ 3 ] ];

        expect(CheckMatrix(matrix)).toBe(true);
    });

    it('should return false when rows have different lengths', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5 ],
            [ 7, 8, 9 ]
        ];

        expect(CheckMatrix(matrix)).toBe(false);
    });

    it('should return false when the last row has a different length', function ()
    {
        var matrix = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8 ]
        ];

        expect(CheckMatrix(matrix)).toBe(false);
    });

    it('should return false when passed a flat array', function ()
    {
        expect(CheckMatrix([ 1, 2, 3 ])).toBe(false);
    });

    it('should return false when passed null', function ()
    {
        expect(CheckMatrix(null)).toBe(false);
    });

    it('should return false when passed undefined', function ()
    {
        expect(CheckMatrix(undefined)).toBe(false);
    });

    it('should return false when passed no arguments', function ()
    {
        expect(CheckMatrix()).toBe(false);
    });

    it('should return false when passed a string', function ()
    {
        expect(CheckMatrix('hello')).toBe(false);
    });

    it('should return false when passed a number', function ()
    {
        expect(CheckMatrix(42)).toBe(false);
    });

    it('should return false when passed an empty array', function ()
    {
        expect(CheckMatrix([])).toBe(false);
    });

    it('should return false when passed an array of empty arrays', function ()
    {
        expect(CheckMatrix([ [], [] ])).toBe(true);
    });

    it('should return true for a matrix containing mixed types', function ()
    {
        var matrix = [
            [ 1, 'a', true ],
            [ null, 2, 'b' ]
        ];

        expect(CheckMatrix(matrix)).toBe(true);
    });

    it('should return true for a large valid matrix', function ()
    {
        var matrix = [];

        for (var i = 0; i < 100; i++)
        {
            var row = [];

            for (var j = 0; j < 100; j++)
            {
                row.push(i * 100 + j);
            }

            matrix.push(row);
        }

        expect(CheckMatrix(matrix)).toBe(true);
    });

    it('should return false when one row in a large matrix has a different length', function ()
    {
        var matrix = [];

        for (var i = 0; i < 10; i++)
        {
            matrix.push([ 1, 2, 3 ]);
        }

        matrix[5] = [ 1, 2 ];

        expect(CheckMatrix(matrix)).toBe(false);
    });
});
