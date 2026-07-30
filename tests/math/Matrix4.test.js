var Matrix4 = require('../../src/math/Matrix4');

describe('Phaser.Math.Matrix4', function ()
{
    it('should create a matrix with identity values by default', function ()
    {
        var m = new Matrix4();
        var v = m.val;

        expect(v[0]).toBe(1);
        expect(v[5]).toBe(1);
        expect(v[10]).toBe(1);
        expect(v[15]).toBe(1);
        expect(v[1]).toBe(0);
        expect(v[2]).toBe(0);
        expect(v[3]).toBe(0);
        expect(v[4]).toBe(0);
        expect(v[6]).toBe(0);
        expect(v[7]).toBe(0);
        expect(v[8]).toBe(0);
        expect(v[9]).toBe(0);
        expect(v[11]).toBe(0);
        expect(v[12]).toBe(0);
        expect(v[13]).toBe(0);
        expect(v[14]).toBe(0);
    });

    it('should copy values from another matrix when passed to constructor', function ()
    {
        var a = new Matrix4();
        a.val[0] = 2;
        a.val[5] = 3;
        a.val[10] = 4;
        a.val[15] = 5;

        var b = new Matrix4(a);

        expect(b.val[0]).toBe(2);
        expect(b.val[5]).toBe(3);
        expect(b.val[10]).toBe(4);
        expect(b.val[15]).toBe(5);
    });

    it('should have a Float32Array as the val property', function ()
    {
        var m = new Matrix4();
        expect(m.val).toBeInstanceOf(Float32Array);
        expect(m.val.length).toBe(16);
    });

    describe('clone', function ()
    {
        it('should return a new Matrix4 with the same values', function ()
        {
            var m = new Matrix4();
            m.val[0] = 7;
            m.val[5] = 8;

            var c = m.clone();

            expect(c).not.toBe(m);
            expect(c.val[0]).toBe(7);
            expect(c.val[5]).toBe(8);
        });
    });

    describe('setValues', function ()
    {
        it('should set all 16 values correctly', function ()
        {
            var m = new Matrix4();
            m.setValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            var v = m.val;

            for (var i = 0; i < 16; i++)
            {
                expect(v[i]).toBe(i + 1);
            }
        });

        it('should return this', function ()
        {
            var m = new Matrix4();
            var result = m.setValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            expect(result).toBe(m);
        });
    });

    describe('copy', function ()
    {
        it('should copy values from source matrix', function ()
        {
            var src = new Matrix4();
            src.setValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

            var dst = new Matrix4();
            dst.copy(src);

            for (var i = 0; i < 16; i++)
            {
                expect(dst.val[i]).toBe(src.val[i]);
            }
        });
    });

    describe('fromArray', function ()
    {
        it('should set values from an array', function ()
        {
            var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            var m = new Matrix4();
            m.fromArray(arr);

            for (var i = 0; i < 16; i++)
            {
                expect(m.val[i]).toBe(arr[i]);
            }
        });
    });

    describe('zero', function ()
    {
        it('should set all values to zero', function ()
        {
            var m = new Matrix4();
            m.zero();

            for (var i = 0; i < 16; i++)
            {
                expect(m.val[i]).toBe(0);
            }
        });
    });

    describe('identity', function ()
    {
        it('should reset matrix to identity', function ()
        {
            var m = new Matrix4();
            m.zero();
            m.identity();
            var v = m.val;

            expect(v[0]).toBe(1);
            expect(v[5]).toBe(1);
            expect(v[10]).toBe(1);
            expect(v[15]).toBe(1);
            expect(v[1]).toBe(0);
            expect(v[4]).toBe(0);
            expect(v[14]).toBe(0);
        });
    });

    describe('xyz', function ()
    {
        it('should set translation values with identity rotation', function ()
        {
            var m = new Matrix4();
            m.xyz(3, 5, 7);
            var v = m.val;

            expect(v[12]).toBe(3);
            expect(v[13]).toBe(5);
            expect(v[14]).toBe(7);
            expect(v[0]).toBe(1);
            expect(v[5]).toBe(1);
            expect(v[10]).toBe(1);
            expect(v[15]).toBe(1);
        });
    });

    describe('scaling', function ()
    {
        it('should set scaling values', function ()
        {
            var m = new Matrix4();
            m.scaling(2, 3, 4);
            var v = m.val;

            expect(v[0]).toBe(2);
            expect(v[5]).toBe(3);
            expect(v[10]).toBe(4);
            expect(v[15]).toBe(1);
            expect(v[1]).toBe(0);
            expect(v[4]).toBe(0);
        });
    });

    describe('transpose', function ()
    {
        it('should transpose the matrix', function ()
        {
            var m = new Matrix4();
            m.setValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            m.transpose();
            var v = m.val;

            expect(v[0]).toBe(1);
            expect(v[1]).toBe(5);
            expect(v[2]).toBe(9);
            expect(v[3]).toBe(13);
            expect(v[4]).toBe(2);
            expect(v[5]).toBe(6);
            expect(v[6]).toBe(10);
            expect(v[7]).toBe(14);
        });

        it('should leave identity matrix unchanged', function ()
        {
            var m = new Matrix4();
            m.transpose();
            var v = m.val;

            expect(v[0]).toBe(1);
            expect(v[5]).toBe(1);
            expect(v[10]).toBe(1);
            expect(v[15]).toBe(1);
            expect(v[1]).toBe(0);
        });
    });

    describe('determinant', function ()
    {
        it('should return 1 for the identity matrix', function ()
        {
            var m = new Matrix4();
            expect(m.determinant()).toBeCloseTo(1, 5);
        });

        it('should return 0 for the zero matrix', function ()
        {
            var m = new Matrix4();
            m.zero();
            expect(m.determinant()).toBe(0);
        });

        it('should return correct determinant for a known matrix', function ()
        {
            var m = new Matrix4();
            m.scaling(2, 3, 4);
            expect(m.determinant()).toBeCloseTo(24, 5);
        });
    });

    describe('invert', function ()
    {
        it('should invert the identity matrix to identity', function ()
        {
            var m = new Matrix4();
            m.invert();
            var v = m.val;

            expect(v[0]).toBeCloseTo(1, 5);
            expect(v[5]).toBeCloseTo(1, 5);
            expect(v[10]).toBeCloseTo(1, 5);
            expect(v[15]).toBeCloseTo(1, 5);
        });

        it('should produce a matrix that when multiplied gives identity', function ()
        {
            var m = new Matrix4();
            m.setValues(1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1);

            var inv = m.clone();
            inv.invert();

            m.multiply(inv);
            var v = m.val;

            expect(v[0]).toBeCloseTo(1, 4);
            expect(v[5]).toBeCloseTo(1, 4);
            expect(v[10]).toBeCloseTo(1, 4);
            expect(v[15]).toBeCloseTo(1, 4);
            expect(v[1]).toBeCloseTo(0, 4);
            expect(v[4]).toBeCloseTo(0, 4);
        });

        it('should return this without change for a singular matrix', function ()
        {
            var m = new Matrix4();
            m.zero();
            var original = Array.from(m.val);
            m.invert();

            for (var i = 0; i < 16; i++)
            {
                expect(m.val[i]).toBe(original[i]);
            }
        });
    });

    describe('getInverse', function ()
    {
        it('should copy and invert the given matrix', function ()
        {
            var src = new Matrix4();
            src.scaling(2, 2, 2);

            var dst = new Matrix4();
            dst.getInverse(src);

            expect(dst.val[0]).toBeCloseTo(0.5, 5);
            expect(dst.val[5]).toBeCloseTo(0.5, 5);
            expect(dst.val[10]).toBeCloseTo(0.5, 5);
        });
    });

    describe('multiply', function ()
    {
        it('should multiply by identity and return same values', function ()
        {
            var m = new Matrix4();
            m.setValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            var original = Array.from(m.val);

            var identity = new Matrix4();
            m.multiply(identity);

            for (var i = 0; i < 16; i++)
            {
                expect(m.val[i]).toBeCloseTo(original[i], 4);
            }
        });

        it('should return this', function ()
        {
            var m = new Matrix4();
            var other = new Matrix4();
            expect(m.multiply(other)).toBe(m);
        });
    });

    describe('translateXYZ', function ()
    {
        it('should translate on an identity matrix', function ()
        {
            var m = new Matrix4();
            m.translateXYZ(5, 10, 15);
            var v = m.val;

            expect(v[12]).toBeCloseTo(5, 5);
            expect(v[13]).toBeCloseTo(10, 5);
            expect(v[14]).toBeCloseTo(15, 5);
        });

        it('should accumulate translations', function ()
        {
            var m = new Matrix4();
            m.translateXYZ(1, 2, 3);
            m.translateXYZ(4, 5, 6);
            var v = m.val;

            expect(v[12]).toBeCloseTo(5, 5);
            expect(v[13]).toBeCloseTo(7, 5);
            expect(v[14]).toBeCloseTo(9, 5);
        });
    });

    describe('scaleXYZ', function ()
    {
        it('should scale the matrix components', function ()
        {
            var m = new Matrix4();
            m.scaleXYZ(2, 3, 4);
            var v = m.val;

            expect(v[0]).toBeCloseTo(2, 5);
            expect(v[5]).toBeCloseTo(3, 5);
            expect(v[10]).toBeCloseTo(4, 5);
        });
    });

    describe('rotateX', function ()
    {
        it('should rotate 90 degrees around X axis', function ()
        {
            var m = new Matrix4();
            m.rotateX(Math.PI / 2);
            var v = m.val;

            expect(v[0]).toBeCloseTo(1, 5);
            expect(v[5]).toBeCloseTo(0, 5);
            expect(v[6]).toBeCloseTo(1, 5);
            expect(v[9]).toBeCloseTo(-1, 5);
            expect(v[10]).toBeCloseTo(0, 5);
        });

        it('should return this', function ()
        {
            var m = new Matrix4();
            expect(m.rotateX(0.5)).toBe(m);
        });
    });

    describe('rotateY', function ()
    {
        it('should rotate 90 degrees around Y axis', function ()
        {
            var m = new Matrix4();
            m.rotateY(Math.PI / 2);
            var v = m.val;

            expect(v[0]).toBeCloseTo(0, 5);
            expect(v[2]).toBeCloseTo(-1, 5);
            expect(v[8]).toBeCloseTo(1, 5);
            expect(v[10]).toBeCloseTo(0, 5);
        });
    });

    describe('rotateZ', function ()
    {
        it('should rotate 90 degrees around Z axis', function ()
        {
            var m = new Matrix4();
            m.rotateZ(Math.PI / 2);
            var v = m.val;

            expect(v[0]).toBeCloseTo(0, 5);
            expect(v[1]).toBeCloseTo(1, 5);
            expect(v[4]).toBeCloseTo(-1, 5);
            expect(v[5]).toBeCloseTo(0, 5);
        });
    });

    describe('fromQuat', function ()
    {
        it('should produce identity matrix from identity quaternion', function ()
        {
            var q = { x: 0, y: 0, z: 0, w: 1 };
            var m = new Matrix4();
            m.fromQuat(q);
            var v = m.val;

            expect(v[0]).toBeCloseTo(1, 5);
            expect(v[5]).toBeCloseTo(1, 5);
            expect(v[10]).toBeCloseTo(1, 5);
            expect(v[15]).toBeCloseTo(1, 5);
            expect(v[1]).toBeCloseTo(0, 5);
            expect(v[4]).toBeCloseTo(0, 5);
        });
    });

    describe('perspective', function ()
    {
        it('should generate a perspective matrix', function ()
        {
            var m = new Matrix4();
            m.perspective(Math.PI / 4, 16 / 9, 0.1, 100);
            var v = m.val;

            expect(v[3]).toBe(0);
            expect(v[7]).toBe(0);
            expect(v[11]).toBe(-1);
            expect(v[15]).toBe(0);
            expect(v[0]).toBeGreaterThan(0);
            expect(v[5]).toBeGreaterThan(0);
        });
    });

    describe('ortho', function ()
    {
        it('should generate an orthographic projection matrix', function ()
        {
            var m = new Matrix4();
            m.ortho(-1, 1, -1, 1, 0.1, 100);
            var v = m.val;

            expect(v[0]).toBeCloseTo(1, 5);
            expect(v[5]).toBeCloseTo(1, 5);
            expect(v[15]).toBeCloseTo(1, 5);
            expect(v[3]).toBe(0);
            expect(v[7]).toBe(0);
        });
    });

    describe('lookAt', function ()
    {
        it('should return identity when eye equals center', function ()
        {
            var eye = { x: 0, y: 0, z: 0 };
            var center = { x: 0, y: 0, z: 0 };
            var up = { x: 0, y: 1, z: 0 };

            var m = new Matrix4();
            m.lookAt(eye, center, up);
            var v = m.val;

            expect(v[0]).toBe(1);
            expect(v[5]).toBe(1);
            expect(v[10]).toBe(1);
            expect(v[15]).toBe(1);
        });

        it('should generate a valid view matrix for standard camera setup', function ()
        {
            var eye = { x: 0, y: 0, z: 5 };
            var center = { x: 0, y: 0, z: 0 };
            var up = { x: 0, y: 1, z: 0 };

            var m = new Matrix4();
            m.lookAt(eye, center, up);
            var v = m.val;

            expect(v[15]).toBeCloseTo(1, 5);
            expect(v[14]).toBeCloseTo(-5, 5);
        });
    });

    describe('getMaxScaleOnAxis', function ()
    {
        it('should return 1 for the identity matrix', function ()
        {
            var m = new Matrix4();
            expect(m.getMaxScaleOnAxis()).toBeCloseTo(1, 5);
        });

        it('should return the largest scale value', function ()
        {
            var m = new Matrix4();
            m.scaling(2, 5, 3);
            expect(m.getMaxScaleOnAxis()).toBeCloseTo(5, 5);
        });

        it('should handle uniform scaling', function ()
        {
            var m = new Matrix4();
            m.scaling(4, 4, 4);
            expect(m.getMaxScaleOnAxis()).toBeCloseTo(4, 5);
        });
    });

    describe('fromRotationTranslation', function ()
    {
        it('should set translation from vector', function ()
        {
            var q = { x: 0, y: 0, z: 0, w: 1 };
            var v = { x: 3, y: 4, z: 5 };

            var m = new Matrix4();
            m.fromRotationTranslation(q, v);
            var vals = m.val;

            expect(vals[12]).toBeCloseTo(3, 5);
            expect(vals[13]).toBeCloseTo(4, 5);
            expect(vals[14]).toBeCloseTo(5, 5);
            expect(vals[15]).toBe(1);
        });

        it('should set rotation from identity quaternion', function ()
        {
            var q = { x: 0, y: 0, z: 0, w: 1 };
            var v = { x: 0, y: 0, z: 0 };

            var m = new Matrix4();
            m.fromRotationTranslation(q, v);
            var vals = m.val;

            expect(vals[0]).toBeCloseTo(1, 5);
            expect(vals[5]).toBeCloseTo(1, 5);
            expect(vals[10]).toBeCloseTo(1, 5);
        });
    });

    describe('multiplyMatrices', function ()
    {
        it('should multiply two identity matrices to produce identity', function ()
        {
            var a = new Matrix4();
            var b = new Matrix4();
            var out = new Matrix4();
            out.zero();

            out.multiplyMatrices(a, b);
            var v = out.val;

            expect(v[0]).toBeCloseTo(1, 4);
            expect(v[5]).toBeCloseTo(1, 4);
            expect(v[10]).toBeCloseTo(1, 4);
            expect(v[15]).toBeCloseTo(1, 4);
        });
    });

    describe('adjoint', function ()
    {
        it('should return the identity for the identity matrix (scaled by det=1)', function ()
        {
            var m = new Matrix4();
            m.adjoint();
            var v = m.val;

            expect(v[0]).toBeCloseTo(1, 5);
            expect(v[5]).toBeCloseTo(1, 5);
            expect(v[10]).toBeCloseTo(1, 5);
            expect(v[15]).toBeCloseTo(1, 5);
        });
    });

    describe('makeRotationAxis', function ()
    {
        it('should produce identity for zero angle', function ()
        {
            var axis = { x: 0, y: 1, z: 0 };
            var m = new Matrix4();
            m.makeRotationAxis(axis, 0);
            var v = m.val;

            expect(v[0]).toBeCloseTo(1, 5);
            expect(v[5]).toBeCloseTo(1, 5);
            expect(v[10]).toBeCloseTo(1, 5);
            expect(v[15]).toBeCloseTo(1, 5);
        });

        it('should rotate 180 degrees around Y axis', function ()
        {
            var axis = { x: 0, y: 1, z: 0 };
            var m = new Matrix4();
            m.makeRotationAxis(axis, Math.PI);
            var v = m.val;

            expect(v[0]).toBeCloseTo(-1, 5);
            expect(v[5]).toBeCloseTo(1, 5);
            expect(v[10]).toBeCloseTo(-1, 5);
        });
    });

    describe('fromRotationXYTranslation', function ()
    {
        it('should use position directly when translateFirst is true', function ()
        {
            var rotation = { x: 0, y: 0, z: 0 };
            var position = { x: 5, y: 6, z: 7 };

            var m = new Matrix4();
            m.fromRotationXYTranslation(rotation, position, true);
            var v = m.val;

            expect(v[12]).toBeCloseTo(5, 5);
            expect(v[13]).toBeCloseTo(6, 5);
            expect(v[14]).toBeCloseTo(7, 5);
        });

        it('should transform position when translateFirst is false', function ()
        {
            var rotation = { x: 0, y: 0, z: 0 };
            var position = { x: 5, y: 6, z: 7 };

            var m = new Matrix4();
            m.fromRotationXYTranslation(rotation, position, false);
            var v = m.val;

            expect(v[12]).toBeCloseTo(5, 5);
            expect(v[13]).toBeCloseTo(6, 5);
            expect(v[14]).toBeCloseTo(7, 5);
        });
    });
});
