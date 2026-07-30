var RotateMatrix = require('../../../../src/utils/array/matrix/RotateMatrix');

describe('Phaser.Utils.Array.Matrix.RotateMatrix', function ()
{
    var matrix2x2;
    var matrix3x3;
    var matrix2x3;

    beforeEach(function ()
    {
        matrix2x2 = [
            [ 1, 2 ],
            [ 3, 4 ]
        ];

        matrix3x3 = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        matrix2x3 = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ]
        ];
    });

    // --- Invalid / null cases ---

    it('should return null when matrix is undefined', function ()
    {
        expect(RotateMatrix(undefined)).toBeNull();
    });

    it('should return null when matrix is null', function ()
    {
        expect(RotateMatrix(null)).toBeNull();
    });

    it('should return null when matrix is not an array', function ()
    {
        expect(RotateMatrix('not a matrix')).toBeNull();
    });

    it('should return null when matrix has rows of unequal length', function ()
    {
        var bad = [ [ 1, 2 ], [ 3 ] ];
        expect(RotateMatrix(bad)).toBeNull();
    });

    it('should not return null for a single-row matrix (CheckMatrix allows it)', function ()
    {
        // CheckMatrix does not require at least two rows
        var result = RotateMatrix([ [ 1, 2, 3 ] ]);
        expect(result).not.toBeNull();
    });

    it('should return null when matrix is an empty array', function ()
    {
        expect(RotateMatrix([])).toBeNull();
    });

    // --- Default direction (90 / rotateLeft) ---

    it('should default to 90 degrees when no direction is given', function ()
    {
        var result = RotateMatrix(matrix2x2);

        expect(result[0]).toEqual([ 2, 4 ]);
        expect(result[1]).toEqual([ 1, 3 ]);
    });

    it('should rotate a 3x3 matrix 90 degrees (rotateLeft)', function ()
    {
        var result = RotateMatrix(matrix3x3, 90);

        expect(result[0]).toEqual([ 3, 6, 9 ]);
        expect(result[1]).toEqual([ 2, 5, 8 ]);
        expect(result[2]).toEqual([ 1, 4, 7 ]);
    });

    it('should rotate using string "rotateLeft" the same as 90 degrees', function ()
    {
        var r1 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], 90);
        var r2 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], 'rotateLeft');

        expect(r1).toEqual(r2);
    });

    it('should rotate using -270 the same as 90 degrees', function ()
    {
        var r1 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], 90);
        var r2 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], -270);

        expect(r1).toEqual(r2);
    });

    // --- 270 degrees / rotateRight ---

    it('should rotate a 2x2 matrix 270 degrees (rotateRight)', function ()
    {
        var result = RotateMatrix(matrix2x2, 270);

        expect(result[0]).toEqual([ 3, 1 ]);
        expect(result[1]).toEqual([ 4, 2 ]);
    });

    it('should rotate a 3x3 matrix 270 degrees (rotateRight)', function ()
    {
        var result = RotateMatrix(matrix3x3, 270);

        expect(result[0]).toEqual([ 7, 4, 1 ]);
        expect(result[1]).toEqual([ 8, 5, 2 ]);
        expect(result[2]).toEqual([ 9, 6, 3 ]);
    });

    it('should rotate using string "rotateRight" the same as 270 degrees', function ()
    {
        var r1 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], 270);
        var r2 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], 'rotateRight');

        expect(r1).toEqual(r2);
    });

    it('should rotate using -90 the same as 270 degrees', function ()
    {
        var r1 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], 270);
        var r2 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], -90);

        expect(r1).toEqual(r2);
    });

    // --- 180 degrees / rotate180 ---

    it('should rotate a 2x2 matrix 180 degrees', function ()
    {
        var result = RotateMatrix(matrix2x2, 180);

        expect(result[0]).toEqual([ 4, 3 ]);
        expect(result[1]).toEqual([ 2, 1 ]);
    });

    it('should rotate a 3x3 matrix 180 degrees', function ()
    {
        var result = RotateMatrix(matrix3x3, 180);

        expect(result[0]).toEqual([ 9, 8, 7 ]);
        expect(result[1]).toEqual([ 6, 5, 4 ]);
        expect(result[2]).toEqual([ 3, 2, 1 ]);
    });

    it('should rotate using string "rotate180" the same as 180 degrees', function ()
    {
        var r1 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], 180);
        var r2 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], 'rotate180');

        expect(r1).toEqual(r2);
    });

    it('should rotate using -180 the same as 180 degrees', function ()
    {
        var r1 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], 180);
        var r2 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], -180);

        expect(r1).toEqual(r2);
    });

    // --- Non-square matrices ---

    it('should rotate a 2x3 matrix 90 degrees to produce a 3x2 matrix', function ()
    {
        var result = RotateMatrix(matrix2x3, 90);

        expect(result.length).toBe(3);
        expect(result[0].length).toBe(2);
        expect(result[0]).toEqual([ 3, 6 ]);
        expect(result[1]).toEqual([ 2, 5 ]);
        expect(result[2]).toEqual([ 1, 4 ]);
    });

    it('should rotate a 2x3 matrix 270 degrees to produce a 3x2 matrix', function ()
    {
        var result = RotateMatrix(matrix2x3, 270);

        expect(result.length).toBe(3);
        expect(result[0].length).toBe(2);
        expect(result[0]).toEqual([ 4, 1 ]);
        expect(result[1]).toEqual([ 5, 2 ]);
        expect(result[2]).toEqual([ 6, 3 ]);
    });

    it('should rotate a 2x3 matrix 180 degrees and keep the same dimensions', function ()
    {
        var result = RotateMatrix(matrix2x3, 180);

        expect(result.length).toBe(2);
        expect(result[0].length).toBe(3);
        expect(result[0]).toEqual([ 6, 5, 4 ]);
        expect(result[1]).toEqual([ 3, 2, 1 ]);
    });

    // --- Return value ---

    it('should return an array', function ()
    {
        var result = RotateMatrix(matrix3x3, 90);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return a matrix (array of arrays)', function ()
    {
        var result = RotateMatrix(matrix3x3, 90);

        expect(Array.isArray(result[0])).toBe(true);
    });

    // --- Unrecognized direction ---

    it('should return the matrix unmodified for an unrecognized numeric direction', function ()
    {
        var input = [ [ 1, 2 ], [ 3, 4 ] ];
        var result = RotateMatrix(input, 45);

        // After normalisation 45 % 360 = 45, which matches no branch
        expect(result).not.toBeNull();
        // The matrix is returned (possibly mutated in place), but values unchanged
        expect(result[0]).toEqual([ 1, 2 ]);
        expect(result[1]).toEqual([ 3, 4 ]);
    });

    it('should return the matrix unmodified for an unrecognized string direction', function ()
    {
        var input = [ [ 1, 2 ], [ 3, 4 ] ];
        var result = RotateMatrix(input, 'unknown');

        expect(result).not.toBeNull();
        expect(result[0]).toEqual([ 1, 2 ]);
        expect(result[1]).toEqual([ 3, 4 ]);
    });

    // --- Invertibility ---

    it('should return to the original matrix after four 90-degree rotations', function ()
    {
        var original = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ];
        var m = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ];

        m = RotateMatrix(m, 90);
        m = RotateMatrix(m, 90);
        m = RotateMatrix(m, 90);
        m = RotateMatrix(m, 90);

        expect(m).toEqual(original);
    });

    it('should return to the original matrix after two 180-degree rotations', function ()
    {
        var original = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ];
        var m = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ];

        m = RotateMatrix(m, 180);
        m = RotateMatrix(m, 180);

        expect(m).toEqual(original);
    });

    it('should return to the original matrix after a 90 and a 270 rotation', function ()
    {
        var original = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ];
        var m = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ];

        m = RotateMatrix(m, 90);
        m = RotateMatrix(m, 270);

        expect(m).toEqual(original);
    });

    // --- Large numeric direction (wrapping) ---

    it('should treat 450 degrees the same as 90 degrees', function ()
    {
        var r1 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], 90);
        var r2 = RotateMatrix([ [ 1, 2 ], [ 3, 4 ] ], 450);

        expect(r1).toEqual(r2);
    });
});
