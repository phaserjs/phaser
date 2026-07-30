var Vector3 = require('../../src/math/Vector3');

describe('Vector3', function ()
{
    describe('constructor', function ()
    {
        it('should create a vector with default values of zero', function ()
        {
            var v = new Vector3();
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
        });

        it('should create a vector with given x, y, z values', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
            expect(v.z).toBe(3);
        });

        it('should create a vector from an object with x, y, z properties', function ()
        {
            var v = new Vector3({ x: 4, y: 5, z: 6 });
            expect(v.x).toBe(4);
            expect(v.y).toBe(5);
            expect(v.z).toBe(6);
        });

        it('should default missing object properties to zero', function ()
        {
            var v = new Vector3({ x: 1 });
            expect(v.x).toBe(1);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
        });

        it('should handle negative values', function ()
        {
            var v = new Vector3(-1, -2, -3);
            expect(v.x).toBe(-1);
            expect(v.y).toBe(-2);
            expect(v.z).toBe(-3);
        });

        it('should handle floating point values', function ()
        {
            var v = new Vector3(1.5, 2.7, 3.14);
            expect(v.x).toBe(1.5);
            expect(v.y).toBe(2.7);
            expect(v.z).toBe(3.14);
        });
    });

    describe('static constants', function ()
    {
        it('should have ZERO constant at (0, 0, 0)', function ()
        {
            expect(Vector3.ZERO.x).toBe(0);
            expect(Vector3.ZERO.y).toBe(0);
            expect(Vector3.ZERO.z).toBe(0);
        });

        it('should have RIGHT constant at (1, 0, 0)', function ()
        {
            expect(Vector3.RIGHT.x).toBe(1);
            expect(Vector3.RIGHT.y).toBe(0);
            expect(Vector3.RIGHT.z).toBe(0);
        });

        it('should have LEFT constant at (-1, 0, 0)', function ()
        {
            expect(Vector3.LEFT.x).toBe(-1);
            expect(Vector3.LEFT.y).toBe(0);
            expect(Vector3.LEFT.z).toBe(0);
        });

        it('should have UP constant at (0, -1, 0)', function ()
        {
            expect(Vector3.UP.x).toBe(0);
            expect(Vector3.UP.y).toBe(-1);
            expect(Vector3.UP.z).toBe(0);
        });

        it('should have DOWN constant at (0, 1, 0)', function ()
        {
            expect(Vector3.DOWN.x).toBe(0);
            expect(Vector3.DOWN.y).toBe(1);
            expect(Vector3.DOWN.z).toBe(0);
        });

        it('should have FORWARD constant at (0, 0, 1)', function ()
        {
            expect(Vector3.FORWARD.x).toBe(0);
            expect(Vector3.FORWARD.y).toBe(0);
            expect(Vector3.FORWARD.z).toBe(1);
        });

        it('should have BACK constant at (0, 0, -1)', function ()
        {
            expect(Vector3.BACK.x).toBe(0);
            expect(Vector3.BACK.y).toBe(0);
            expect(Vector3.BACK.z).toBe(-1);
        });

        it('should have ONE constant at (1, 1, 1)', function ()
        {
            expect(Vector3.ONE.x).toBe(1);
            expect(Vector3.ONE.y).toBe(1);
            expect(Vector3.ONE.z).toBe(1);
        });
    });

    describe('up', function ()
    {
        it('should set vector to (0, 1, 0)', function ()
        {
            var v = new Vector3(5, 5, 5);
            v.up();
            expect(v.x).toBe(0);
            expect(v.y).toBe(1);
            expect(v.z).toBe(0);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3();
            expect(v.up()).toBe(v);
        });
    });

    describe('min', function ()
    {
        it('should set components to minimum of this and given vector', function ()
        {
            var v = new Vector3(5, 3, 8);
            v.min({ x: 3, y: 6, z: 2 });
            expect(v.x).toBe(3);
            expect(v.y).toBe(3);
            expect(v.z).toBe(2);
        });

        it('should not change components already at minimum', function ()
        {
            var v = new Vector3(1, 2, 3);
            v.min({ x: 5, y: 5, z: 5 });
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
            expect(v.z).toBe(3);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.min({ x: 0, y: 0, z: 0 })).toBe(v);
        });
    });

    describe('max', function ()
    {
        it('should set components to maximum of this and given vector', function ()
        {
            var v = new Vector3(5, 3, 8);
            v.max({ x: 3, y: 6, z: 2 });
            expect(v.x).toBe(5);
            expect(v.y).toBe(6);
            expect(v.z).toBe(8);
        });

        it('should not change components already at maximum', function ()
        {
            var v = new Vector3(5, 5, 5);
            v.max({ x: 1, y: 2, z: 3 });
            expect(v.x).toBe(5);
            expect(v.y).toBe(5);
            expect(v.z).toBe(5);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.max({ x: 5, y: 5, z: 5 })).toBe(v);
        });
    });

    describe('clone', function ()
    {
        it('should return a new Vector3 with the same values', function ()
        {
            var v = new Vector3(1, 2, 3);
            var clone = v.clone();
            expect(clone.x).toBe(1);
            expect(clone.y).toBe(2);
            expect(clone.z).toBe(3);
        });

        it('should return a different object instance', function ()
        {
            var v = new Vector3(1, 2, 3);
            var clone = v.clone();
            expect(clone).not.toBe(v);
        });

        it('should not be affected by changes to the original', function ()
        {
            var v = new Vector3(1, 2, 3);
            var clone = v.clone();
            v.x = 99;
            expect(clone.x).toBe(1);
        });
    });

    describe('addVectors', function ()
    {
        it('should set this vector to the sum of two vectors', function ()
        {
            var v = new Vector3();
            v.addVectors({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 });
            expect(v.x).toBe(5);
            expect(v.y).toBe(7);
            expect(v.z).toBe(9);
        });

        it('should work with negative values', function ()
        {
            var v = new Vector3();
            v.addVectors({ x: -1, y: -2, z: -3 }, { x: 1, y: 2, z: 3 });
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3();
            expect(v.addVectors({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 })).toBe(v);
        });
    });

    describe('subVectors', function ()
    {
        it('should set this vector to the difference of two vectors', function ()
        {
            var v = new Vector3();
            v.subVectors({ x: 5, y: 7, z: 9 }, { x: 1, y: 2, z: 3 });
            expect(v.x).toBe(4);
            expect(v.y).toBe(5);
            expect(v.z).toBe(6);
        });

        it('should work when result is negative', function ()
        {
            var v = new Vector3();
            v.subVectors({ x: 1, y: 2, z: 3 }, { x: 5, y: 7, z: 9 });
            expect(v.x).toBe(-4);
            expect(v.y).toBe(-5);
            expect(v.z).toBe(-6);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3();
            expect(v.subVectors({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 })).toBe(v);
        });
    });

    describe('crossVectors', function ()
    {
        it('should compute the cross product of two vectors', function ()
        {
            var v = new Vector3();
            v.crossVectors({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 });
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(1);
        });

        it('should return zero vector for parallel vectors', function ()
        {
            var v = new Vector3();
            v.crossVectors({ x: 1, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
        });

        it('should be anti-commutative', function ()
        {
            var v1 = new Vector3();
            var v2 = new Vector3();
            var a = { x: 1, y: 2, z: 3 };
            var b = { x: 4, y: 5, z: 6 };
            v1.crossVectors(a, b);
            v2.crossVectors(b, a);
            expect(v1.x).toBeCloseTo(-v2.x);
            expect(v1.y).toBeCloseTo(-v2.y);
            expect(v1.z).toBeCloseTo(-v2.z);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3();
            expect(v.crossVectors({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toBe(v);
        });
    });

    describe('equals', function ()
    {
        it('should return true for equal vectors', function ()
        {
            var v1 = new Vector3(1, 2, 3);
            var v2 = new Vector3(1, 2, 3);
            expect(v1.equals(v2)).toBe(true);
        });

        it('should return false when x differs', function ()
        {
            var v1 = new Vector3(1, 2, 3);
            expect(v1.equals({ x: 2, y: 2, z: 3 })).toBe(false);
        });

        it('should return false when y differs', function ()
        {
            var v1 = new Vector3(1, 2, 3);
            expect(v1.equals({ x: 1, y: 3, z: 3 })).toBe(false);
        });

        it('should return false when z differs', function ()
        {
            var v1 = new Vector3(1, 2, 3);
            expect(v1.equals({ x: 1, y: 2, z: 4 })).toBe(false);
        });

        it('should return true when compared to itself', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.equals(v)).toBe(true);
        });
    });

    describe('copy', function ()
    {
        it('should copy x, y, z from source vector', function ()
        {
            var v = new Vector3();
            v.copy({ x: 4, y: 5, z: 6 });
            expect(v.x).toBe(4);
            expect(v.y).toBe(5);
            expect(v.z).toBe(6);
        });

        it('should default z to 0 when source has no z', function ()
        {
            var v = new Vector3(1, 2, 3);
            v.copy({ x: 4, y: 5 });
            expect(v.z).toBe(0);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3();
            expect(v.copy({ x: 1, y: 1, z: 1 })).toBe(v);
        });
    });

    describe('set', function ()
    {
        it('should set x, y, z from numeric arguments', function ()
        {
            var v = new Vector3();
            v.set(1, 2, 3);
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
            expect(v.z).toBe(3);
        });

        it('should set x, y, z from an object', function ()
        {
            var v = new Vector3();
            v.set({ x: 4, y: 5, z: 6 });
            expect(v.x).toBe(4);
            expect(v.y).toBe(5);
            expect(v.z).toBe(6);
        });

        it('should default missing object properties to 0', function ()
        {
            var v = new Vector3(9, 9, 9);
            v.set({ x: 1 });
            expect(v.x).toBe(1);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3();
            expect(v.set(1, 2, 3)).toBe(v);
        });
    });

    describe('setFromMatrixPosition', function ()
    {
        it('should extract position (column 3) from a Matrix4', function ()
        {
            var mat = {
                val: new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    7, 8, 9, 1
                ])
            };
            var v = new Vector3();
            v.setFromMatrixPosition(mat);
            expect(v.x).toBe(7);
            expect(v.y).toBe(8);
            expect(v.z).toBe(9);
        });

        it('should return this vector for chaining', function ()
        {
            var mat = { val: new Float32Array(16) };
            var v = new Vector3();
            expect(v.setFromMatrixPosition(mat)).toBe(v);
        });
    });

    describe('setFromMatrixColumn', function ()
    {
        it('should extract column 0 from a Matrix4', function ()
        {
            var mat = {
                val: new Float32Array([
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                ])
            };
            var v = new Vector3();
            v.setFromMatrixColumn(mat, 0);
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
            expect(v.z).toBe(3);
        });

        it('should extract column 1 from a Matrix4', function ()
        {
            var mat = {
                val: new Float32Array([
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                ])
            };
            var v = new Vector3();
            v.setFromMatrixColumn(mat, 1);
            expect(v.x).toBe(5);
            expect(v.y).toBe(6);
            expect(v.z).toBe(7);
        });

        it('should return this vector for chaining', function ()
        {
            var mat = { val: new Float32Array(16) };
            var v = new Vector3();
            expect(v.setFromMatrixColumn(mat, 0)).toBe(v);
        });
    });

    describe('fromArray', function ()
    {
        it('should set components from array at offset 0 by default', function ()
        {
            var v = new Vector3();
            v.fromArray([10, 20, 30]);
            expect(v.x).toBe(10);
            expect(v.y).toBe(20);
            expect(v.z).toBe(30);
        });

        it('should set components from array at given offset', function ()
        {
            var v = new Vector3();
            v.fromArray([0, 0, 10, 20, 30], 2);
            expect(v.x).toBe(10);
            expect(v.y).toBe(20);
            expect(v.z).toBe(30);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3();
            expect(v.fromArray([1, 2, 3])).toBe(v);
        });
    });

    describe('add', function ()
    {
        it('should add another vector to this vector', function ()
        {
            var v = new Vector3(1, 2, 3);
            v.add({ x: 4, y: 5, z: 6 });
            expect(v.x).toBe(5);
            expect(v.y).toBe(7);
            expect(v.z).toBe(9);
        });

        it('should treat missing z as 0', function ()
        {
            var v = new Vector3(1, 2, 3);
            v.add({ x: 1, y: 1 });
            expect(v.z).toBe(3);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.add({ x: 0, y: 0, z: 0 })).toBe(v);
        });
    });

    describe('addScalar', function ()
    {
        it('should add a scalar to all components', function ()
        {
            var v = new Vector3(1, 2, 3);
            v.addScalar(5);
            expect(v.x).toBe(6);
            expect(v.y).toBe(7);
            expect(v.z).toBe(8);
        });

        it('should work with negative scalars', function ()
        {
            var v = new Vector3(5, 5, 5);
            v.addScalar(-3);
            expect(v.x).toBe(2);
            expect(v.y).toBe(2);
            expect(v.z).toBe(2);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.addScalar(1)).toBe(v);
        });
    });

    describe('addScale', function ()
    {
        it('should add a scaled vector to this vector', function ()
        {
            var v = new Vector3(1, 2, 3);
            v.addScale({ x: 1, y: 1, z: 1 }, 2);
            expect(v.x).toBe(3);
            expect(v.y).toBe(4);
            expect(v.z).toBe(5);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.addScale({ x: 1, y: 1, z: 1 }, 1)).toBe(v);
        });
    });

    describe('subtract', function ()
    {
        it('should subtract another vector from this vector', function ()
        {
            var v = new Vector3(5, 7, 9);
            v.subtract({ x: 1, y: 2, z: 3 });
            expect(v.x).toBe(4);
            expect(v.y).toBe(5);
            expect(v.z).toBe(6);
        });

        it('should treat missing z as 0', function ()
        {
            var v = new Vector3(1, 2, 3);
            v.subtract({ x: 1, y: 1 });
            expect(v.z).toBe(3);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(5, 7, 9);
            expect(v.subtract({ x: 1, y: 2, z: 3 })).toBe(v);
        });
    });

    describe('multiply', function ()
    {
        it('should multiply components by another vector', function ()
        {
            var v = new Vector3(2, 3, 4);
            v.multiply({ x: 2, y: 3, z: 4 });
            expect(v.x).toBe(4);
            expect(v.y).toBe(9);
            expect(v.z).toBe(16);
        });

        it('should treat missing z as 1', function ()
        {
            var v = new Vector3(2, 3, 4);
            v.multiply({ x: 2, y: 3 });
            expect(v.z).toBe(4);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.multiply({ x: 1, y: 1, z: 1 })).toBe(v);
        });
    });

    describe('scale', function ()
    {
        it('should scale all components by the given value', function ()
        {
            var v = new Vector3(2, 3, 4);
            v.scale(3);
            expect(v.x).toBe(6);
            expect(v.y).toBe(9);
            expect(v.z).toBe(12);
        });

        it('should zero all components when given Infinity', function ()
        {
            var v = new Vector3(2, 3, 4);
            v.scale(Infinity);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
        });

        it('should zero all components when given NaN', function ()
        {
            var v = new Vector3(2, 3, 4);
            v.scale(NaN);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
        });

        it('should work with zero scale', function ()
        {
            var v = new Vector3(2, 3, 4);
            v.scale(0);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.scale(2)).toBe(v);
        });
    });

    describe('divide', function ()
    {
        it('should divide components by another vector', function ()
        {
            var v = new Vector3(4, 9, 16);
            v.divide({ x: 2, y: 3, z: 4 });
            expect(v.x).toBe(2);
            expect(v.y).toBe(3);
            expect(v.z).toBe(4);
        });

        it('should treat missing z as 1', function ()
        {
            var v = new Vector3(4, 9, 16);
            v.divide({ x: 2, y: 3 });
            expect(v.z).toBe(16);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(4, 9, 16);
            expect(v.divide({ x: 2, y: 3, z: 4 })).toBe(v);
        });
    });

    describe('negate', function ()
    {
        it('should negate all components', function ()
        {
            var v = new Vector3(1, 2, 3);
            v.negate();
            expect(v.x).toBe(-1);
            expect(v.y).toBe(-2);
            expect(v.z).toBe(-3);
        });

        it('should negate negative values back to positive', function ()
        {
            var v = new Vector3(-1, -2, -3);
            v.negate();
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
            expect(v.z).toBe(3);
        });

        it('should leave zero unchanged', function ()
        {
            var v = new Vector3(0, 0, 0);
            v.negate();
            expect(v.x).toBe(-0);
            expect(v.y).toBe(-0);
            expect(v.z).toBe(-0);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.negate()).toBe(v);
        });
    });

    describe('distance', function ()
    {
        it('should return the distance between two vectors', function ()
        {
            var v = new Vector3(0, 0, 0);
            var dist = v.distance({ x: 3, y: 4, z: 0 });
            expect(dist).toBe(5);
        });

        it('should return 0 for identical vectors', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.distance({ x: 1, y: 2, z: 3 })).toBe(0);
        });

        it('should handle 3D distance', function ()
        {
            var v = new Vector3(1, 2, 3);
            var dist = v.distance({ x: 4, y: 6, z: 3 });
            expect(dist).toBe(5);
        });

        it('should return a positive value regardless of direction', function ()
        {
            var v = new Vector3(3, 4, 0);
            expect(v.distance({ x: 0, y: 0, z: 0 })).toBe(5);
        });
    });

    describe('distanceSq', function ()
    {
        it('should return the squared distance between two vectors', function ()
        {
            var v = new Vector3(0, 0, 0);
            expect(v.distanceSq({ x: 3, y: 4, z: 0 })).toBe(25);
        });

        it('should return 0 for identical vectors', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.distanceSq({ x: 1, y: 2, z: 3 })).toBe(0);
        });

        it('should equal distance squared', function ()
        {
            var v = new Vector3(1, 2, 3);
            var target = { x: 4, y: 6, z: 3 };
            var d = v.distance(target);
            expect(v.distanceSq(target)).toBeCloseTo(d * d);
        });
    });

    describe('length', function ()
    {
        it('should return the length of the vector', function ()
        {
            var v = new Vector3(3, 4, 0);
            expect(v.length()).toBe(5);
        });

        it('should return 0 for a zero vector', function ()
        {
            var v = new Vector3(0, 0, 0);
            expect(v.length()).toBe(0);
        });

        it('should return 1 for a unit vector', function ()
        {
            var v = new Vector3(1, 0, 0);
            expect(v.length()).toBe(1);
        });

        it('should work in 3D', function ()
        {
            var v = new Vector3(1, 2, 2);
            expect(v.length()).toBe(3);
        });
    });

    describe('lengthSq', function ()
    {
        it('should return the squared length of the vector', function ()
        {
            var v = new Vector3(3, 4, 0);
            expect(v.lengthSq()).toBe(25);
        });

        it('should return 0 for a zero vector', function ()
        {
            var v = new Vector3(0, 0, 0);
            expect(v.lengthSq()).toBe(0);
        });

        it('should equal length squared', function ()
        {
            var v = new Vector3(1, 2, 3);
            var l = v.length();
            expect(v.lengthSq()).toBeCloseTo(l * l);
        });
    });

    describe('normalize', function ()
    {
        it('should produce a unit vector', function ()
        {
            var v = new Vector3(3, 4, 0);
            v.normalize();
            expect(v.length()).toBeCloseTo(1);
        });

        it('should not modify a zero vector', function ()
        {
            var v = new Vector3(0, 0, 0);
            v.normalize();
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
        });

        it('should preserve direction', function ()
        {
            var v = new Vector3(2, 0, 0);
            v.normalize();
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(0);
            expect(v.z).toBeCloseTo(0);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.normalize()).toBe(v);
        });
    });

    describe('dot', function ()
    {
        it('should return the dot product of two vectors', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.dot({ x: 4, y: 5, z: 6 })).toBe(32);
        });

        it('should return 0 for perpendicular vectors', function ()
        {
            var v = new Vector3(1, 0, 0);
            expect(v.dot({ x: 0, y: 1, z: 0 })).toBe(0);
        });

        it('should return length squared when dotted with itself', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.dot(v)).toBeCloseTo(v.lengthSq());
        });
    });

    describe('cross', function ()
    {
        it('should compute the cross product', function ()
        {
            var v = new Vector3(1, 0, 0);
            v.cross({ x: 0, y: 1, z: 0 });
            expect(v.x).toBeCloseTo(0);
            expect(v.y).toBeCloseTo(0);
            expect(v.z).toBeCloseTo(1);
        });

        it('should return zero vector for parallel vectors', function ()
        {
            var v = new Vector3(1, 0, 0);
            v.cross({ x: 2, y: 0, z: 0 });
            expect(v.x).toBeCloseTo(0);
            expect(v.y).toBeCloseTo(0);
            expect(v.z).toBeCloseTo(0);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 0, 0);
            expect(v.cross({ x: 0, y: 1, z: 0 })).toBe(v);
        });
    });

    describe('lerp', function ()
    {
        it('should return start vector when t=0', function ()
        {
            var v = new Vector3(0, 0, 0);
            v.lerp({ x: 10, y: 10, z: 10 }, 0);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
        });

        it('should return end vector when t=1', function ()
        {
            var v = new Vector3(0, 0, 0);
            v.lerp({ x: 10, y: 10, z: 10 }, 1);
            expect(v.x).toBe(10);
            expect(v.y).toBe(10);
            expect(v.z).toBe(10);
        });

        it('should return midpoint when t=0.5', function ()
        {
            var v = new Vector3(0, 0, 0);
            v.lerp({ x: 10, y: 20, z: 30 }, 0.5);
            expect(v.x).toBeCloseTo(5);
            expect(v.y).toBeCloseTo(10);
            expect(v.z).toBeCloseTo(15);
        });

        it('should default t to 0 when not provided', function ()
        {
            var v = new Vector3(1, 2, 3);
            v.lerp({ x: 10, y: 10, z: 10 });
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
            expect(v.z).toBe(3);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(0, 0, 0);
            expect(v.lerp({ x: 1, y: 1, z: 1 }, 0.5)).toBe(v);
        });
    });

    describe('applyMatrix3', function ()
    {
        it('should transform vector by a 3x3 identity matrix', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat3 = {
                val: new Float32Array([
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1
                ])
            };
            v.applyMatrix3(mat3);
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(2);
            expect(v.z).toBeCloseTo(3);
        });

        it('should correctly transform by a scale matrix', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat3 = {
                val: new Float32Array([
                    2, 0, 0,
                    0, 2, 0,
                    0, 0, 2
                ])
            };
            v.applyMatrix3(mat3);
            expect(v.x).toBeCloseTo(2);
            expect(v.y).toBeCloseTo(4);
            expect(v.z).toBeCloseTo(6);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat3 = { val: new Float32Array([1,0,0, 0,1,0, 0,0,1]) };
            expect(v.applyMatrix3(mat3)).toBe(v);
        });
    });

    describe('applyMatrix4', function ()
    {
        it('should transform vector by a 4x4 identity matrix', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat4 = {
                val: new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ])
            };
            v.applyMatrix4(mat4);
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(2);
            expect(v.z).toBeCloseTo(3);
        });

        it('should apply translation from matrix', function ()
        {
            var v = new Vector3(0, 0, 0);
            var mat4 = {
                val: new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    5, 6, 7, 1
                ])
            };
            v.applyMatrix4(mat4);
            expect(v.x).toBeCloseTo(5);
            expect(v.y).toBeCloseTo(6);
            expect(v.z).toBeCloseTo(7);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat4 = { val: new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]) };
            expect(v.applyMatrix4(mat4)).toBe(v);
        });
    });

    describe('transformMat3', function ()
    {
        it('should transform vector by identity matrix leaving it unchanged', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat = {
                val: new Float32Array([
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1
                ])
            };
            v.transformMat3(mat);
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(2);
            expect(v.z).toBeCloseTo(3);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat = { val: new Float32Array([1,0,0, 0,1,0, 0,0,1]) };
            expect(v.transformMat3(mat)).toBe(v);
        });
    });

    describe('transformMat4', function ()
    {
        it('should transform vector by identity matrix leaving it unchanged', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat = {
                val: new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ])
            };
            v.transformMat4(mat);
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(2);
            expect(v.z).toBeCloseTo(3);
        });

        it('should apply translation', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat = {
                val: new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    10, 20, 30, 1
                ])
            };
            v.transformMat4(mat);
            expect(v.x).toBeCloseTo(11);
            expect(v.y).toBeCloseTo(22);
            expect(v.z).toBeCloseTo(33);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat = { val: new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]) };
            expect(v.transformMat4(mat)).toBe(v);
        });
    });

    describe('transformCoordinates', function ()
    {
        it('should transform vector by identity matrix leaving it unchanged', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat = {
                val: new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ])
            };
            v.transformCoordinates(mat);
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(2);
            expect(v.z).toBeCloseTo(3);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat = { val: new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]) };
            expect(v.transformCoordinates(mat)).toBe(v);
        });
    });

    describe('transformQuat', function ()
    {
        it('should not change vector when transformed by identity quaternion', function ()
        {
            var v = new Vector3(1, 0, 0);
            v.transformQuat({ x: 0, y: 0, z: 0, w: 1 });
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(0);
            expect(v.z).toBeCloseTo(0);
        });

        it('should rotate x-axis to y-axis with 90 degree rotation around z', function ()
        {
            var v = new Vector3(1, 0, 0);
            // 90 degree rotation around z-axis
            var sin90 = Math.sin(Math.PI / 4);
            var cos90 = Math.cos(Math.PI / 4);
            v.transformQuat({ x: 0, y: 0, z: sin90, w: cos90 });
            expect(v.x).toBeCloseTo(0);
            expect(v.y).toBeCloseTo(1);
            expect(v.z).toBeCloseTo(0);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 0, 0);
            expect(v.transformQuat({ x: 0, y: 0, z: 0, w: 1 })).toBe(v);
        });
    });

    describe('project', function ()
    {
        it('should project vector by identity matrix leaving it unchanged', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat = {
                val: new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ])
            };
            v.project(mat);
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(2);
            expect(v.z).toBeCloseTo(3);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            var mat = { val: new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]) };
            expect(v.project(mat)).toBe(v);
        });
    });

    describe('projectViewMatrix', function ()
    {
        it('should apply view then projection matrix', function ()
        {
            var v = new Vector3(1, 2, 3);
            var identity = {
                val: new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ])
            };
            v.projectViewMatrix(identity, identity);
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(2);
            expect(v.z).toBeCloseTo(3);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            var identity = { val: new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]) };
            expect(v.projectViewMatrix(identity, identity)).toBe(v);
        });
    });

    describe('unprojectViewMatrix', function ()
    {
        it('should apply projection then world matrix', function ()
        {
            var v = new Vector3(1, 2, 3);
            var identity = {
                val: new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ])
            };
            v.unprojectViewMatrix(identity, identity);
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(2);
            expect(v.z).toBeCloseTo(3);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            var identity = { val: new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]) };
            expect(v.unprojectViewMatrix(identity, identity)).toBe(v);
        });
    });

    describe('unproject', function ()
    {
        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(400, 300, 0);
            var viewport = { x: 0, y: 0, z: 800, w: 600 };
            var identity = { val: new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]) };
            expect(v.unproject(viewport, identity)).toBe(v);
        });

        it('should normalize screen coordinates before projecting', function ()
        {
            var v = new Vector3(400, 300, 0.5);
            var viewport = { x: 0, y: 0, z: 800, w: 600 };
            var identity = { val: new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]) };
            v.unproject(viewport, identity);
            // With identity matrix, result goes through project which divides by w=1
            // Just verify it ran without error and returned a finite result
            expect(isFinite(v.x)).toBe(true);
            expect(isFinite(v.y)).toBe(true);
            expect(isFinite(v.z)).toBe(true);
        });
    });

    describe('reset', function ()
    {
        it('should set all components to zero', function ()
        {
            var v = new Vector3(1, 2, 3);
            v.reset();
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector3(1, 2, 3);
            expect(v.reset()).toBe(v);
        });
    });
});
