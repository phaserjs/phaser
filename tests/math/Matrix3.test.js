var Matrix3 = require('../../src/math/Matrix3');

describe('Matrix3', function ()
{
    describe('constructor', function ()
    {
        it('should create an identity matrix by default', function ()
        {
            var m = new Matrix3();
            var v = m.val;

            expect(v[0]).toBe(1);
            expect(v[1]).toBe(0);
            expect(v[2]).toBe(0);
            expect(v[3]).toBe(0);
            expect(v[4]).toBe(1);
            expect(v[5]).toBe(0);
            expect(v[6]).toBe(0);
            expect(v[7]).toBe(0);
            expect(v[8]).toBe(1);
        });

        it('should create a Float32Array of length 9', function ()
        {
            var m = new Matrix3();
            expect(m.val).toBeInstanceOf(Float32Array);
            expect(m.val.length).toBe(9);
        });

        it('should copy values from a given Matrix3', function ()
        {
            var src = new Matrix3();
            src.val[0] = 2;
            src.val[4] = 5;
            src.val[8] = 9;

            var m = new Matrix3(src);
            expect(m.val[0]).toBe(2);
            expect(m.val[4]).toBe(5);
            expect(m.val[8]).toBe(9);
        });

        it('should create an independent copy when passed a Matrix3', function ()
        {
            var src = new Matrix3();
            var m = new Matrix3(src);
            m.val[0] = 99;
            expect(src.val[0]).toBe(1);
        });
    });

    describe('clone', function ()
    {
        it('should return a new Matrix3 instance', function ()
        {
            var m = new Matrix3();
            var clone = m.clone();
            expect(clone).not.toBe(m);
            expect(clone).toBeInstanceOf(Matrix3);
        });

        it('should copy all values to the clone', function ()
        {
            var m = new Matrix3();
            m.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            var clone = m.clone();

            for (var i = 0; i < 9; i++)
            {
                expect(clone.val[i]).toBe(m.val[i]);
            }
        });

        it('should be independent from the original', function ()
        {
            var m = new Matrix3();
            var clone = m.clone();
            clone.val[0] = 99;
            expect(m.val[0]).toBe(1);
        });
    });

    describe('set', function ()
    {
        it('should copy values from the source Matrix3', function ()
        {
            var src = new Matrix3();
            src.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

            var m = new Matrix3();
            m.set(src);

            for (var i = 0; i < 9; i++)
            {
                expect(m.val[i]).toBe(src.val[i]);
            }
        });

        it('should return this Matrix3', function ()
        {
            var m = new Matrix3();
            var result = m.set(new Matrix3());
            expect(result).toBe(m);
        });
    });

    describe('copy', function ()
    {
        it('should copy all 9 values from the source', function ()
        {
            var src = new Matrix3();
            src.fromArray([9, 8, 7, 6, 5, 4, 3, 2, 1]);

            var m = new Matrix3();
            m.copy(src);

            expect(m.val[0]).toBe(9);
            expect(m.val[1]).toBe(8);
            expect(m.val[2]).toBe(7);
            expect(m.val[3]).toBe(6);
            expect(m.val[4]).toBe(5);
            expect(m.val[5]).toBe(4);
            expect(m.val[6]).toBe(3);
            expect(m.val[7]).toBe(2);
            expect(m.val[8]).toBe(1);
        });

        it('should return this Matrix3', function ()
        {
            var m = new Matrix3();
            var result = m.copy(new Matrix3());
            expect(result).toBe(m);
        });

        it('should not affect the source matrix', function ()
        {
            var src = new Matrix3();
            src.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

            var m = new Matrix3();
            m.copy(src);
            m.val[0] = 99;

            expect(src.val[0]).toBe(1);
        });
    });

    describe('fromMat4', function ()
    {
        it('should extract the upper-left 3x3 from a Matrix4', function ()
        {
            var mat4 = {
                val: new Float32Array([
                    1,  2,  3,  4,
                    5,  6,  7,  8,
                    9,  10, 11, 12,
                    13, 14, 15, 16
                ])
            };

            var m = new Matrix3();
            m.fromMat4(mat4);

            expect(m.val[0]).toBe(1);
            expect(m.val[1]).toBe(2);
            expect(m.val[2]).toBe(3);
            expect(m.val[3]).toBe(5);
            expect(m.val[4]).toBe(6);
            expect(m.val[5]).toBe(7);
            expect(m.val[6]).toBe(9);
            expect(m.val[7]).toBe(10);
            expect(m.val[8]).toBe(11);
        });

        it('should return this Matrix3', function ()
        {
            var mat4 = { val: new Float32Array(16) };
            mat4.val[0] = 1; mat4.val[5] = 1; mat4.val[10] = 1; mat4.val[15] = 1;

            var m = new Matrix3();
            var result = m.fromMat4(mat4);
            expect(result).toBe(m);
        });
    });

    describe('fromArray', function ()
    {
        it('should set all 9 values from the array', function ()
        {
            var m = new Matrix3();
            m.fromArray([10, 20, 30, 40, 50, 60, 70, 80, 90]);

            expect(m.val[0]).toBe(10);
            expect(m.val[1]).toBe(20);
            expect(m.val[2]).toBe(30);
            expect(m.val[3]).toBe(40);
            expect(m.val[4]).toBe(50);
            expect(m.val[5]).toBe(60);
            expect(m.val[6]).toBe(70);
            expect(m.val[7]).toBe(80);
            expect(m.val[8]).toBe(90);
        });

        it('should return this Matrix3', function ()
        {
            var m = new Matrix3();
            var result = m.fromArray([1, 0, 0, 0, 1, 0, 0, 0, 1]);
            expect(result).toBe(m);
        });

        it('should work with floating point values', function ()
        {
            var m = new Matrix3();
            m.fromArray([1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5]);
            expect(m.val[0]).toBeCloseTo(1.5);
            expect(m.val[4]).toBeCloseTo(5.5);
            expect(m.val[8]).toBeCloseTo(9.5);
        });
    });

    describe('identity', function ()
    {
        it('should reset to the identity matrix', function ()
        {
            var m = new Matrix3();
            m.fromArray([9, 8, 7, 6, 5, 4, 3, 2, 1]);
            m.identity();

            expect(m.val[0]).toBe(1);
            expect(m.val[1]).toBe(0);
            expect(m.val[2]).toBe(0);
            expect(m.val[3]).toBe(0);
            expect(m.val[4]).toBe(1);
            expect(m.val[5]).toBe(0);
            expect(m.val[6]).toBe(0);
            expect(m.val[7]).toBe(0);
            expect(m.val[8]).toBe(1);
        });

        it('should return this Matrix3', function ()
        {
            var m = new Matrix3();
            var result = m.identity();
            expect(result).toBe(m);
        });
    });

    describe('transpose', function ()
    {
        it('should transpose the matrix values', function ()
        {
            var m = new Matrix3();
            m.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            m.transpose();

            // column-major: original col1=[1,2,3], col2=[4,5,6], col3=[7,8,9]
            // after transpose: row becomes column
            expect(m.val[0]).toBe(1);
            expect(m.val[1]).toBe(4);
            expect(m.val[2]).toBe(7);
            expect(m.val[3]).toBe(2);
            expect(m.val[4]).toBe(5);
            expect(m.val[5]).toBe(8);
            expect(m.val[6]).toBe(3);
            expect(m.val[7]).toBe(6);
            expect(m.val[8]).toBe(9);
        });

        it('should return this Matrix3', function ()
        {
            var m = new Matrix3();
            var result = m.transpose();
            expect(result).toBe(m);
        });

        it('should leave the identity matrix unchanged', function ()
        {
            var m = new Matrix3();
            m.transpose();

            expect(m.val[0]).toBe(1);
            expect(m.val[4]).toBe(1);
            expect(m.val[8]).toBe(1);
            expect(m.val[1]).toBe(0);
            expect(m.val[3]).toBe(0);
        });

        it('should be its own inverse: transposing twice returns original', function ()
        {
            var m = new Matrix3();
            m.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            m.transpose().transpose();

            expect(m.val[0]).toBe(1);
            expect(m.val[1]).toBe(2);
            expect(m.val[2]).toBe(3);
            expect(m.val[3]).toBe(4);
            expect(m.val[4]).toBe(5);
            expect(m.val[5]).toBe(6);
            expect(m.val[6]).toBe(7);
            expect(m.val[7]).toBe(8);
            expect(m.val[8]).toBe(9);
        });
    });

    describe('invert', function ()
    {
        it('should invert the identity matrix to itself', function ()
        {
            var m = new Matrix3();
            var result = m.invert();

            expect(result).toBe(m);
            expect(m.val[0]).toBeCloseTo(1);
            expect(m.val[4]).toBeCloseTo(1);
            expect(m.val[8]).toBeCloseTo(1);
            expect(m.val[1]).toBeCloseTo(0);
            expect(m.val[3]).toBeCloseTo(0);
        });

        it('should return null if determinant is zero', function ()
        {
            var m = new Matrix3();
            // All-zero matrix has det=0
            m.fromArray([0, 0, 0, 0, 0, 0, 0, 0, 0]);
            var result = m.invert();
            expect(result).toBeNull();
        });

        it('should correctly invert a known matrix', function ()
        {
            var m = new Matrix3();
            // A simple scaling matrix: scale by 2 on x, 3 on y
            m.fromArray([2, 0, 0, 0, 3, 0, 0, 0, 1]);
            m.invert();

            expect(m.val[0]).toBeCloseTo(0.5);
            expect(m.val[4]).toBeCloseTo(1 / 3);
            expect(m.val[8]).toBeCloseTo(1);
        });

        it('should produce identity when multiplied with its inverse', function ()
        {
            var m = new Matrix3();
            m.fromArray([1, 2, 0, 0, 1, 0, 3, 4, 1]);

            var inv = m.clone();
            inv.invert();

            m.multiply(inv);

            expect(m.val[0]).toBeCloseTo(1);
            expect(m.val[4]).toBeCloseTo(1);
            expect(m.val[8]).toBeCloseTo(1);
            expect(m.val[1]).toBeCloseTo(0);
            expect(m.val[2]).toBeCloseTo(0);
            expect(m.val[3]).toBeCloseTo(0);
            expect(m.val[5]).toBeCloseTo(0);
            expect(m.val[6]).toBeCloseTo(0);
            expect(m.val[7]).toBeCloseTo(0);
        });
    });

    describe('adjoint', function ()
    {
        it('should return this Matrix3', function ()
        {
            var m = new Matrix3();
            var result = m.adjoint();
            expect(result).toBe(m);
        });

        it('should compute the adjoint of the identity matrix as identity', function ()
        {
            var m = new Matrix3();
            m.adjoint();

            expect(m.val[0]).toBe(1);
            expect(m.val[4]).toBe(1);
            expect(m.val[8]).toBe(1);
            expect(m.val[1]).toBe(0);
            expect(m.val[3]).toBe(0);
        });

        it('should compute the correct adjoint of a known matrix', function ()
        {
            var m = new Matrix3();
            m.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            m.adjoint();

            // adjoint = transpose of cofactor matrix
            // For this singular matrix (det=0), values are well-defined
            expect(m.val[0]).toBeCloseTo(-3);
            expect(m.val[1]).toBeCloseTo(6);
            expect(m.val[2]).toBeCloseTo(-3);
            expect(m.val[3]).toBeCloseTo(6);
            expect(m.val[4]).toBeCloseTo(-12);
            expect(m.val[5]).toBeCloseTo(6);
            expect(m.val[6]).toBeCloseTo(-3);
            expect(m.val[7]).toBeCloseTo(6);
            expect(m.val[8]).toBeCloseTo(-3);
        });
    });

    describe('determinant', function ()
    {
        it('should return 1 for the identity matrix', function ()
        {
            var m = new Matrix3();
            expect(m.determinant()).toBeCloseTo(1);
        });

        it('should return 0 for a zero matrix', function ()
        {
            var m = new Matrix3();
            m.fromArray([0, 0, 0, 0, 0, 0, 0, 0, 0]);
            expect(m.determinant()).toBe(0);
        });

        it('should return 0 for a singular matrix', function ()
        {
            var m = new Matrix3();
            m.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(m.determinant()).toBeCloseTo(0);
        });

        it('should return the correct determinant for a known matrix', function ()
        {
            var m = new Matrix3();
            // det = 2*3*1 = 6 for diagonal [2,0,0, 0,3,0, 0,0,1]
            m.fromArray([2, 0, 0, 0, 3, 0, 0, 0, 1]);
            expect(m.determinant()).toBeCloseTo(6);
        });

        it('should return a negative determinant for orientation-reversing matrices', function ()
        {
            var m = new Matrix3();
            m.fromArray([-1, 0, 0, 0, 1, 0, 0, 0, 1]);
            expect(m.determinant()).toBeCloseTo(-1);
        });
    });

    describe('multiply', function ()
    {
        it('should return this Matrix3', function ()
        {
            var m = new Matrix3();
            var result = m.multiply(new Matrix3());
            expect(result).toBe(m);
        });

        it('should leave the identity matrix unchanged when multiplied by identity', function ()
        {
            var m = new Matrix3();
            m.multiply(new Matrix3());

            expect(m.val[0]).toBeCloseTo(1);
            expect(m.val[4]).toBeCloseTo(1);
            expect(m.val[8]).toBeCloseTo(1);
            expect(m.val[1]).toBeCloseTo(0);
            expect(m.val[3]).toBeCloseTo(0);
        });

        it('should correctly multiply two known matrices', function ()
        {
            var a = new Matrix3();
            a.fromArray([1, 0, 0, 0, 1, 0, 2, 3, 1]); // 2D translation matrix in col-major

            var b = new Matrix3();
            b.fromArray([1, 0, 0, 0, 1, 0, 4, 5, 1]);

            a.multiply(b);

            // Combined translation should be (2+4, 3+5) = (6, 8)
            expect(a.val[6]).toBeCloseTo(6);
            expect(a.val[7]).toBeCloseTo(8);
            expect(a.val[8]).toBeCloseTo(1);
        });

        it('should not be commutative in general', function ()
        {
            var a = new Matrix3();
            a.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

            var b = new Matrix3();
            b.fromArray([9, 8, 7, 6, 5, 4, 3, 2, 1]);

            var ab = a.clone();
            ab.multiply(b);

            var ba = b.clone();
            ba.multiply(a);

            // At least one value should differ
            var allSame = true;
            for (var i = 0; i < 9; i++)
            {
                if (Math.abs(ab.val[i] - ba.val[i]) > 0.001)
                {
                    allSame = false;
                    break;
                }
            }
            expect(allSame).toBe(false);
        });
    });

    describe('translate', function ()
    {
        it('should return this Matrix3', function ()
        {
            var m = new Matrix3();
            var result = m.translate({ x: 0, y: 0 });
            expect(result).toBe(m);
        });

        it('should translate the identity matrix by (tx, ty)', function ()
        {
            var m = new Matrix3();
            m.translate({ x: 5, y: 3 });

            // For identity matrix, translate just sets col 2 = [tx, ty, 1]
            expect(m.val[6]).toBeCloseTo(5);
            expect(m.val[7]).toBeCloseTo(3);
            expect(m.val[8]).toBeCloseTo(1);
        });

        it('should leave the rest of the identity matrix unchanged', function ()
        {
            var m = new Matrix3();
            m.translate({ x: 10, y: 20 });

            expect(m.val[0]).toBe(1);
            expect(m.val[1]).toBe(0);
            expect(m.val[2]).toBe(0);
            expect(m.val[3]).toBe(0);
            expect(m.val[4]).toBe(1);
            expect(m.val[5]).toBe(0);
        });

        it('should accumulate translations when called twice', function ()
        {
            var m = new Matrix3();
            m.translate({ x: 3, y: 4 });
            m.translate({ x: 1, y: 2 });

            expect(m.val[6]).toBeCloseTo(4);
            expect(m.val[7]).toBeCloseTo(6);
        });

        it('should handle negative translation values', function ()
        {
            var m = new Matrix3();
            m.translate({ x: -5, y: -10 });

            expect(m.val[6]).toBeCloseTo(-5);
            expect(m.val[7]).toBeCloseTo(-10);
        });
    });

    describe('rotate', function ()
    {
        it('should return this Matrix3', function ()
        {
            var m = new Matrix3();
            var result = m.rotate(0);
            expect(result).toBe(m);
        });

        it('should leave the identity matrix unchanged when rotating by 0', function ()
        {
            var m = new Matrix3();
            m.rotate(0);

            expect(m.val[0]).toBeCloseTo(1);
            expect(m.val[1]).toBeCloseTo(0);
            expect(m.val[3]).toBeCloseTo(0);
            expect(m.val[4]).toBeCloseTo(1);
        });

        it('should rotate 90 degrees correctly', function ()
        {
            var m = new Matrix3();
            m.rotate(Math.PI / 2);

            expect(m.val[0]).toBeCloseTo(0);
            expect(m.val[1]).toBeCloseTo(1);
            expect(m.val[3]).toBeCloseTo(-1);
            expect(m.val[4]).toBeCloseTo(0);
        });

        it('should rotate 180 degrees correctly', function ()
        {
            var m = new Matrix3();
            m.rotate(Math.PI);

            expect(m.val[0]).toBeCloseTo(-1);
            expect(m.val[1]).toBeCloseTo(0);
            expect(m.val[3]).toBeCloseTo(0);
            expect(m.val[4]).toBeCloseTo(-1);
        });

        it('should rotate by negative angles', function ()
        {
            var m = new Matrix3();
            m.rotate(-Math.PI / 2);

            expect(m.val[0]).toBeCloseTo(0);
            expect(m.val[1]).toBeCloseTo(-1);
            expect(m.val[3]).toBeCloseTo(1);
            expect(m.val[4]).toBeCloseTo(0);
        });

        it('should preserve the third column (z axis unchanged)', function ()
        {
            var m = new Matrix3();
            m.rotate(Math.PI / 4);

            expect(m.val[2]).toBeCloseTo(0);
            expect(m.val[5]).toBeCloseTo(0);
            expect(m.val[8]).toBeCloseTo(1);
        });
    });

    describe('scale', function ()
    {
        it('should return this Matrix3', function ()
        {
            var m = new Matrix3();
            var result = m.scale({ x: 1, y: 1 });
            expect(result).toBe(m);
        });

        it('should scale the identity matrix by (sx, sy)', function ()
        {
            var m = new Matrix3();
            m.scale({ x: 2, y: 3 });

            expect(m.val[0]).toBeCloseTo(2);
            expect(m.val[4]).toBeCloseTo(3);
            expect(m.val[8]).toBeCloseTo(1);
        });

        it('should leave the identity unchanged when scaled by (1, 1)', function ()
        {
            var m = new Matrix3();
            m.scale({ x: 1, y: 1 });

            expect(m.val[0]).toBeCloseTo(1);
            expect(m.val[4]).toBeCloseTo(1);
            expect(m.val[8]).toBeCloseTo(1);
        });

        it('should zero out columns when scaled by 0', function ()
        {
            var m = new Matrix3();
            m.scale({ x: 0, y: 0 });

            expect(m.val[0]).toBeCloseTo(0);
            expect(m.val[1]).toBeCloseTo(0);
            expect(m.val[2]).toBeCloseTo(0);
            expect(m.val[3]).toBeCloseTo(0);
            expect(m.val[4]).toBeCloseTo(0);
            expect(m.val[5]).toBeCloseTo(0);
        });

        it('should handle negative scale values', function ()
        {
            var m = new Matrix3();
            m.scale({ x: -1, y: -2 });

            expect(m.val[0]).toBeCloseTo(-1);
            expect(m.val[4]).toBeCloseTo(-2);
        });
    });

    describe('fromQuat', function ()
    {
        it('should return this Matrix3', function ()
        {
            var m = new Matrix3();
            var result = m.fromQuat({ x: 0, y: 0, z: 0, w: 1 });
            expect(result).toBe(m);
        });

        it('should produce the identity matrix from the identity quaternion', function ()
        {
            var m = new Matrix3();
            m.fromQuat({ x: 0, y: 0, z: 0, w: 1 });

            expect(m.val[0]).toBeCloseTo(1);
            expect(m.val[1]).toBeCloseTo(0);
            expect(m.val[2]).toBeCloseTo(0);
            expect(m.val[3]).toBeCloseTo(0);
            expect(m.val[4]).toBeCloseTo(1);
            expect(m.val[5]).toBeCloseTo(0);
            expect(m.val[6]).toBeCloseTo(0);
            expect(m.val[7]).toBeCloseTo(0);
            expect(m.val[8]).toBeCloseTo(1);
        });

        it('should produce a 180 degree rotation around Z from quaternion (0, 0, 1, 0)', function ()
        {
            var m = new Matrix3();
            m.fromQuat({ x: 0, y: 0, z: 1, w: 0 });

            // 180 deg around Z: x -> -x, y -> -y, z -> z
            expect(m.val[0]).toBeCloseTo(-1);
            expect(m.val[4]).toBeCloseTo(-1);
            expect(m.val[8]).toBeCloseTo(1);
        });

        it('should produce a 90 degree rotation around Z from quaternion', function ()
        {
            var half = Math.sqrt(2) / 2;
            var m = new Matrix3();
            m.fromQuat({ x: 0, y: 0, z: half, w: half });

            // fromQuat stores column-major: out[1]=xy-wz=-1, out[3]=xy+wz=1
            expect(m.val[0]).toBeCloseTo(0);
            expect(m.val[1]).toBeCloseTo(-1);
            expect(m.val[3]).toBeCloseTo(1);
            expect(m.val[4]).toBeCloseTo(0);
            expect(m.val[8]).toBeCloseTo(1);
        });
    });

    describe('normalFromMat4', function ()
    {
        it('should return this Matrix3 for an invertible Matrix4', function ()
        {
            var mat4 = {
                val: new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ])
            };

            var m = new Matrix3();
            var result = m.normalFromMat4(mat4);
            expect(result).toBe(m);
        });

        it('should return null when Matrix4 determinant is zero', function ()
        {
            var mat4 = { val: new Float32Array(16) }; // all zeros, det = 0

            var m = new Matrix3();
            var result = m.normalFromMat4(mat4);
            expect(result).toBeNull();
        });

        it('should produce the identity matrix from an identity Matrix4', function ()
        {
            var mat4 = {
                val: new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ])
            };

            var m = new Matrix3();
            m.normalFromMat4(mat4);

            expect(m.val[0]).toBeCloseTo(1);
            expect(m.val[4]).toBeCloseTo(1);
            expect(m.val[8]).toBeCloseTo(1);
            expect(m.val[1]).toBeCloseTo(0);
            expect(m.val[2]).toBeCloseTo(0);
            expect(m.val[3]).toBeCloseTo(0);
            expect(m.val[5]).toBeCloseTo(0);
            expect(m.val[6]).toBeCloseTo(0);
            expect(m.val[7]).toBeCloseTo(0);
        });

        it('should produce inverse-transpose of upper-left 3x3 for a uniform scale Matrix4', function ()
        {
            // Uniform scale by 2: normal matrix should be identity (scale cancels in normalize)
            var mat4 = {
                val: new Float32Array([
                    2, 0, 0, 0,
                    0, 2, 0, 0,
                    0, 0, 2, 0,
                    0, 0, 0, 1
                ])
            };

            var m = new Matrix3();
            m.normalFromMat4(mat4);

            // Normal matrix = transpose(inverse) of upper-left 3x3 = scale by 0.5
            expect(m.val[0]).toBeCloseTo(0.5);
            expect(m.val[4]).toBeCloseTo(0.5);
            expect(m.val[8]).toBeCloseTo(0.5);
        });
    });
});
