var MatrixToString = require('../../../../src/utils/array/matrix/MatrixToString');

describe('Phaser.Utils.Array.Matrix.MatrixToString', function ()
{
    it('should return an empty string for an invalid matrix', function ()
    {
        expect(MatrixToString(null)).toBe('');
        expect(MatrixToString(undefined)).toBe('');
        expect(MatrixToString([])).toBe('');
        expect(MatrixToString([[1, 2], [3]])).toBe('');
    });

    it('should return an empty string when called with no arguments', function ()
    {
        expect(MatrixToString()).toBe('');
    });

    it('should return a string for a valid 2x2 matrix', function ()
    {
        var matrix = [
            [1, 2],
            [3, 4]
        ];

        var result = MatrixToString(matrix);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('should separate columns with \" |\"', function ()
    {
        var matrix = [
            [1, 2],
            [3, 4]
        ];

        var result = MatrixToString(matrix);

        expect(result).toContain(' |');
    });

    it('should separate rows with \"---\" divider lines', function ()
    {
        var matrix = [
            [1, 2],
            [3, 4]
        ];

        var result = MatrixToString(matrix);

        expect(result).toContain('---');
    });

    it('should not add a divider line after the last row', function ()
    {
        var matrix = [
            [1, 2],
            [3, 4]
        ];

        var result = MatrixToString(matrix);
        var lines = result.split('\n');
        var lastLine = lines[lines.length - 1];

        expect(lastLine).not.toContain('---');
    });

    it('should not add a column separator after the last column', function ()
    {
        var matrix = [
            [1, 2],
            [3, 4]
        ];

        var result = MatrixToString(matrix);
        var lines = result.split('\n');
        var firstLine = lines[0];

        expect(firstLine[firstLine.length - 1]).not.toBe('|');
    });

    it('should produce correct row count with newlines for a 3x3 matrix', function ()
    {
        var matrix = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ];

        var result = MatrixToString(matrix);
        var lines = result.split('\n');

        // 3 data rows + 2 divider lines = 5 lines total
        expect(lines.length).toBe(5);
    });

    it('should pad single-digit numbers to width 2', function ()
    {
        var matrix = [
            [1, 2],
            [3, 4]
        ];

        var result = MatrixToString(matrix);

        // Pad right-pads to width 2, so '1' becomes '1 '
        expect(result).toContain('1 ');
        expect(result).toContain('2 ');
        expect(result).toContain('3 ');
        expect(result).toContain('4 ');
    });

    it('should handle a larger matrix correctly', function ()
    {
        var matrix = [
            [1, 1, 1, 1, 1, 1],
            [2, 0, 0, 0, 0, 4],
            [2, 0, 1, 2, 0, 4],
            [2, 0, 3, 4, 0, 4],
            [2, 0, 0, 0, 0, 4],
            [3, 3, 3, 3, 3, 3]
        ];

        var result = MatrixToString(matrix);
        var lines = result.split('\n');

        // 6 data rows + 5 divider lines = 11 lines total
        expect(lines.length).toBe(11);
    });

    it('should handle string values in the matrix', function ()
    {
        var matrix = [
            ['a', 'b'],
            ['c', 'd']
        ];

        var result = MatrixToString(matrix);

        expect(typeof result).toBe('string');
        expect(result).toContain('a');
        expect(result).toContain('b');
        expect(result).toContain('c');
        expect(result).toContain('d');
    });

    it('should handle zero values in the matrix', function ()
    {
        var matrix = [
            [0, 0],
            [0, 0]
        ];

        var result = MatrixToString(matrix);

        expect(typeof result).toBe('string');
        // Pad right-pads to width 2, so '0' becomes '0 '
        expect(result).toContain('0 ');
    });

    it('should handle negative values in the matrix', function ()
    {
        var matrix = [
            [-1, -2],
            [-3, -4]
        ];

        var result = MatrixToString(matrix);

        expect(typeof result).toBe('string');
        expect(result).toContain('-1');
    });

    it('should produce divider rows with \"+\" between column separators', function ()
    {
        var matrix = [
            [1, 2, 3],
            [4, 5, 6]
        ];

        var result = MatrixToString(matrix);
        var lines = result.split('\n');

        // The divider line is lines[1]
        expect(lines[1]).toContain('+');
    });

    it('should not add \"+\" at the end of a divider row', function ()
    {
        var matrix = [
            [1, 2, 3],
            [4, 5, 6]
        ];

        var result = MatrixToString(matrix);
        var lines = result.split('\n');
        var dividerLine = lines[1];

        expect(dividerLine[dividerLine.length - 1]).not.toBe('+');
    });

    it('should handle a 2-row matrix with a single divider line', function ()
    {
        var matrix = [
            [5, 10],
            [15, 20]
        ];

        var result = MatrixToString(matrix);
        var lines = result.split('\n');

        // 2 data rows + 1 divider = 3 lines
        expect(lines.length).toBe(3);
        expect(lines[1]).toMatch(/^---/);
    });

    it('should return a string type for a valid matrix', function ()
    {
        var matrix = [
            [1, 2],
            [3, 4]
        ];

        expect(typeof MatrixToString(matrix)).toBe('string');
    });
});
