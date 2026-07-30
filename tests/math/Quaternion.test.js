var Quaternion = require('../../src/math/Quaternion');
var Vector3 = require('../../src/math/Vector3');
var Matrix3 = require('../../src/math/Matrix3');

describe('Quaternion', function ()
{
    describe('constructor', function ()
    {
        it('should create a quaternion with default values', function ()
        {
            var q = new Quaternion();
            expect(q.x).toBe(0);
            expect(q.y).toBe(0);
            expect(q.z).toBe(0);
            expect(q.w).toBe(0);
        });

        it('should create a quaternion with given values', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            expect(q.x).toBe(1);
            expect(q.y).toBe(2);
            expect(q.z).toBe(3);
            expect(q.w).toBe(4);
        });

        it('should have an onChangeCallback function', function ()
        {
            var q = new Quaternion();
            expect(typeof q.onChangeCallback).toBe('function');
        });
    });

    describe('copy', function ()
    {
        it('should copy components from another quaternion', function ()
        {
            var src = new Quaternion(1, 2, 3, 4);
            var q = new Quaternion();
            q.copy(src);
            expect(q.x).toBe(1);
            expect(q.y).toBe(2);
            expect(q.z).toBe(3);
            expect(q.w).toBe(4);
        });

        it('should return itself', function ()
        {
            var src = new Quaternion(1, 2, 3, 4);
            var q = new Quaternion();
            expect(q.copy(src)).toBe(q);
        });

        it('should copy from a plain object with x, y, z, w', function ()
        {
            var src = { x: 5, y: 6, z: 7, w: 8 };
            var q = new Quaternion();
            q.copy(src);
            expect(q.x).toBe(5);
            expect(q.y).toBe(6);
            expect(q.z).toBe(7);
            expect(q.w).toBe(8);
        });
    });

    describe('set', function ()
    {
        it('should set components from numbers', function ()
        {
            var q = new Quaternion();
            q.set(1, 2, 3, 4);
            expect(q.x).toBe(1);
            expect(q.y).toBe(2);
            expect(q.z).toBe(3);
            expect(q.w).toBe(4);
        });

        it('should set components from an object', function ()
        {
            var q = new Quaternion();
            q.set({ x: 5, y: 6, z: 7, w: 8 });
            expect(q.x).toBe(5);
            expect(q.y).toBe(6);
            expect(q.z).toBe(7);
            expect(q.w).toBe(8);
        });

        it('should default missing object properties to zero', function ()
        {
            var q = new Quaternion();
            q.set({ x: 1 });
            expect(q.x).toBe(1);
            expect(q.y).toBe(0);
            expect(q.z).toBe(0);
            expect(q.w).toBe(0);
        });

        it('should return itself', function ()
        {
            var q = new Quaternion();
            expect(q.set(1, 2, 3, 4)).toBe(q);
        });

        it('should invoke onChangeCallback when update is true', function ()
        {
            var q = new Quaternion();
            var called = false;
            q.onChangeCallback = function () { called = true; };
            q.set(1, 2, 3, 4, true);
            expect(called).toBe(true);
        });

        it('should not invoke onChangeCallback when update is false', function ()
        {
            var q = new Quaternion();
            var called = false;
            q.onChangeCallback = function () { called = true; };
            q.set(1, 2, 3, 4, false);
            expect(called).toBe(false);
        });
    });

    describe('add', function ()
    {
        it('should add components from another quaternion', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            var v = { x: 10, y: 20, z: 30, w: 40 };
            q.add(v);
            expect(q.x).toBe(11);
            expect(q.y).toBe(22);
            expect(q.z).toBe(33);
            expect(q.w).toBe(44);
        });

        it('should return itself', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            expect(q.add({ x: 1, y: 1, z: 1, w: 1 })).toBe(q);
        });

        it('should add zero without changing values', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            q.add({ x: 0, y: 0, z: 0, w: 0 });
            expect(q.x).toBe(1);
            expect(q.y).toBe(2);
            expect(q.z).toBe(3);
            expect(q.w).toBe(4);
        });

        it('should add negative values', function ()
        {
            var q = new Quaternion(5, 5, 5, 5);
            q.add({ x: -3, y: -3, z: -3, w: -3 });
            expect(q.x).toBe(2);
            expect(q.y).toBe(2);
            expect(q.z).toBe(2);
            expect(q.w).toBe(2);
        });
    });

    describe('subtract', function ()
    {
        it('should subtract components from another quaternion', function ()
        {
            var q = new Quaternion(10, 20, 30, 40);
            var v = { x: 1, y: 2, z: 3, w: 4 };
            q.subtract(v);
            expect(q.x).toBe(9);
            expect(q.y).toBe(18);
            expect(q.z).toBe(27);
            expect(q.w).toBe(36);
        });

        it('should return itself', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            expect(q.subtract({ x: 1, y: 1, z: 1, w: 1 })).toBe(q);
        });

        it('should subtract zero without changing values', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            q.subtract({ x: 0, y: 0, z: 0, w: 0 });
            expect(q.x).toBe(1);
            expect(q.y).toBe(2);
            expect(q.z).toBe(3);
            expect(q.w).toBe(4);
        });
    });

    describe('scale', function ()
    {
        it('should scale all components by a factor', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            q.scale(2);
            expect(q.x).toBe(2);
            expect(q.y).toBe(4);
            expect(q.z).toBe(6);
            expect(q.w).toBe(8);
        });

        it('should return itself', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            expect(q.scale(2)).toBe(q);
        });

        it('should scale by zero resulting in all zeros', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            q.scale(0);
            expect(q.x).toBe(0);
            expect(q.y).toBe(0);
            expect(q.z).toBe(0);
            expect(q.w).toBe(0);
        });

        it('should scale by negative factor', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            q.scale(-1);
            expect(q.x).toBe(-1);
            expect(q.y).toBe(-2);
            expect(q.z).toBe(-3);
            expect(q.w).toBe(-4);
        });
    });

    describe('length', function ()
    {
        it('should return the length of the quaternion', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should return zero for a zero quaternion', function ()
        {
            var q = new Quaternion(0, 0, 0, 0);
            expect(q.length()).toBe(0);
        });

        it('should return correct length for general quaternion', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            expect(q.length()).toBeCloseTo(Math.sqrt(30), 5);
        });

        it('should return 1 for a normalized quaternion', function ()
        {
            var q = new Quaternion(1, 0, 0, 0);
            expect(q.length()).toBeCloseTo(1, 5);
        });
    });

    describe('lengthSq', function ()
    {
        it('should return the squared length of the quaternion', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            expect(q.lengthSq()).toBeCloseTo(1, 5);
        });

        it('should return zero for a zero quaternion', function ()
        {
            var q = new Quaternion(0, 0, 0, 0);
            expect(q.lengthSq()).toBe(0);
        });

        it('should return correct squared length for general quaternion', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            expect(q.lengthSq()).toBeCloseTo(30, 5);
        });

        it('should equal length squared', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            expect(q.lengthSq()).toBeCloseTo(q.length() * q.length(), 5);
        });
    });

    describe('normalize', function ()
    {
        it('should normalize to unit length', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            q.normalize();
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should return itself', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            expect(q.normalize()).toBe(q);
        });

        it('should not change a zero-length quaternion', function ()
        {
            var q = new Quaternion(0, 0, 0, 0);
            q.normalize();
            expect(q.x).toBe(0);
            expect(q.y).toBe(0);
            expect(q.z).toBe(0);
            expect(q.w).toBe(0);
        });

        it('should not change an already-normalized quaternion', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            q.normalize();
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(0, 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(1, 5);
        });
    });

    describe('dot', function ()
    {
        it('should return the dot product of two quaternions', function ()
        {
            var q1 = new Quaternion(1, 2, 3, 4);
            var q2 = { x: 1, y: 2, z: 3, w: 4 };
            expect(q1.dot(q2)).toBeCloseTo(30, 5);
        });

        it('should return zero for perpendicular quaternions', function ()
        {
            var q1 = new Quaternion(1, 0, 0, 0);
            var q2 = { x: 0, y: 1, z: 0, w: 0 };
            expect(q1.dot(q2)).toBe(0);
        });

        it('should return 1 for identical unit quaternions', function ()
        {
            var q1 = new Quaternion(0, 0, 0, 1);
            var q2 = { x: 0, y: 0, z: 0, w: 1 };
            expect(q1.dot(q2)).toBeCloseTo(1, 5);
        });
    });

    describe('lerp', function ()
    {
        it('should return the starting quaternion when t=0', function ()
        {
            var q = new Quaternion(1, 0, 0, 0);
            var target = { x: 0, y: 1, z: 0, w: 0 };
            q.lerp(target, 0);
            expect(q.x).toBeCloseTo(1, 5);
            expect(q.y).toBeCloseTo(0, 5);
        });

        it('should return the target quaternion when t=1', function ()
        {
            var q = new Quaternion(1, 0, 0, 0);
            var target = { x: 0, y: 1, z: 0, w: 0 };
            q.lerp(target, 1);
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(1, 5);
        });

        it('should interpolate halfway when t=0.5', function ()
        {
            var q = new Quaternion(0, 0, 0, 0);
            var target = { x: 2, y: 4, z: 6, w: 8 };
            q.lerp(target, 0.5);
            expect(q.x).toBeCloseTo(1, 5);
            expect(q.y).toBeCloseTo(2, 5);
            expect(q.z).toBeCloseTo(3, 5);
            expect(q.w).toBeCloseTo(4, 5);
        });

        it('should default t to 0 when not provided', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            var target = { x: 10, y: 20, z: 30, w: 40 };
            q.lerp(target);
            expect(q.x).toBeCloseTo(1, 5);
            expect(q.y).toBeCloseTo(2, 5);
            expect(q.z).toBeCloseTo(3, 5);
            expect(q.w).toBeCloseTo(4, 5);
        });

        it('should return itself', function ()
        {
            var q = new Quaternion(1, 0, 0, 0);
            expect(q.lerp({ x: 0, y: 1, z: 0, w: 0 }, 0.5)).toBe(q);
        });
    });

    describe('rotationTo', function ()
    {
        it('should return itself', function ()
        {
            var q = new Quaternion();
            var a = new Vector3(1, 0, 0);
            var b = new Vector3(0, 1, 0);
            expect(q.rotationTo(a, b)).toBe(q);
        });

        it('should set identity when vectors are the same', function ()
        {
            var q = new Quaternion();
            var a = new Vector3(1, 0, 0);
            q.rotationTo(a, a);
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(0, 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(1, 5);
        });

        it('should produce a unit quaternion for any two unit vectors', function ()
        {
            var q = new Quaternion();
            var a = new Vector3(1, 0, 0);
            var b = new Vector3(0, 1, 0);
            q.rotationTo(a, b);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should handle opposite vectors', function ()
        {
            var q = new Quaternion();
            var a = new Vector3(0, 1, 0);
            var b = new Vector3(0, -1, 0);
            q.rotationTo(a, b);
            expect(q.length()).toBeCloseTo(1, 5);
        });
    });

    describe('setAxes', function ()
    {
        it('should return itself', function ()
        {
            var q = new Quaternion();
            var view = new Vector3(0, 0, -1);
            var right = new Vector3(1, 0, 0);
            var up = new Vector3(0, 1, 0);
            expect(q.setAxes(view, right, up)).toBe(q);
        });

        it('should produce a unit quaternion from orthogonal axes', function ()
        {
            var q = new Quaternion();
            var view = new Vector3(0, 0, -1);
            var right = new Vector3(1, 0, 0);
            var up = new Vector3(0, 1, 0);
            q.setAxes(view, right, up);
            expect(q.length()).toBeCloseTo(1, 5);
        });
    });

    describe('identity', function ()
    {
        it('should set quaternion to identity (0, 0, 0, 1)', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            q.identity();
            expect(q.x).toBe(0);
            expect(q.y).toBe(0);
            expect(q.z).toBe(0);
            expect(q.w).toBe(1);
        });

        it('should return itself', function ()
        {
            var q = new Quaternion();
            expect(q.identity()).toBe(q);
        });

        it('should have length of 1', function ()
        {
            var q = new Quaternion();
            q.identity();
            expect(q.length()).toBeCloseTo(1, 5);
        });
    });

    describe('setAxisAngle', function ()
    {
        it('should return itself', function ()
        {
            var q = new Quaternion();
            var axis = new Vector3(0, 1, 0);
            expect(q.setAxisAngle(axis, Math.PI)).toBe(q);
        });

        it('should produce a unit quaternion', function ()
        {
            var q = new Quaternion();
            var axis = new Vector3(0, 1, 0);
            q.setAxisAngle(axis, Math.PI / 2);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should set identity quaternion for zero angle', function ()
        {
            var q = new Quaternion();
            var axis = new Vector3(0, 1, 0);
            q.setAxisAngle(axis, 0);
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(0, 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(1, 5);
        });

        it('should set correct quaternion for 90 degree rotation around Y', function ()
        {
            var q = new Quaternion();
            var axis = new Vector3(0, 1, 0);
            q.setAxisAngle(axis, Math.PI / 2);
            var halfAngle = Math.PI / 4;
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(Math.sin(halfAngle), 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(Math.cos(halfAngle), 5);
        });
    });

    describe('multiply', function ()
    {
        it('should return itself', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            var b = { x: 0, y: 0, z: 0, w: 1 };
            expect(q.multiply(b)).toBe(q);
        });

        it('should multiply by identity and remain unchanged', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            var identity = { x: 0, y: 0, z: 0, w: 1 };
            q.multiply(identity);
            expect(q.x).toBeCloseTo(1, 5);
            expect(q.y).toBeCloseTo(2, 5);
            expect(q.z).toBeCloseTo(3, 5);
            expect(q.w).toBeCloseTo(4, 5);
        });

        it('should combine two 90 degree rotations into a 180 degree rotation', function ()
        {
            var q = new Quaternion();
            var axis = new Vector3(0, 0, 1);
            q.setAxisAngle(axis, Math.PI / 2);
            var half = Math.sin(Math.PI / 4);
            var halfW = Math.cos(Math.PI / 4);
            q.multiply({ x: 0, y: 0, z: half, w: halfW });
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should not be commutative in general', function ()
        {
            var q1 = new Quaternion(1, 0, 0, 0);
            var q2 = { x: 0, y: 1, z: 0, w: 0 };
            var q1copy = new Quaternion(1, 0, 0, 0);
            q1.multiply(q2);
            var q2q = new Quaternion(0, 1, 0, 0);
            q2q.multiply({ x: 1, y: 0, z: 0, w: 0 });
            // q1*q2 != q2*q1 in general for non-trivial quaternions
            expect(q1.z).not.toBeCloseTo(q2q.z, 5);
        });
    });

    describe('slerp', function ()
    {
        it('should return itself', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            expect(q.slerp({ x: 0, y: 0, z: 0, w: 1 }, 0.5)).toBe(q);
        });

        it('should return starting quaternion when t=0', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            var target = { x: 0, y: 1, z: 0, w: 0 };
            q.slerp(target, 0);
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(0, 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(1, 5);
        });

        it('should return target quaternion when t=1', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            var target = { x: 0, y: 1, z: 0, w: 0 };
            q.slerp(target, 1);
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(1, 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(0, 5);
        });

        it('should interpolate between identical quaternions', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            var target = { x: 0, y: 0, z: 0, w: 1 };
            q.slerp(target, 0.5);
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(0, 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(1, 5);
        });

        it('should handle negative dot product case (opposite hemispheres)', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            var target = { x: 0, y: 0, z: 0, w: -1 };
            q.slerp(target, 0.5);
            expect(q.length()).toBeCloseTo(1, 5);
        });
    });

    describe('invert', function ()
    {
        it('should return itself', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            expect(q.invert()).toBe(q);
        });

        it('should invert the identity quaternion to itself', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            q.invert();
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(0, 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(1, 5);
        });

        it('should negate x, y, z and keep w positive for a unit quaternion', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            var axis = new Vector3(1, 0, 0);
            q.setAxisAngle(axis, Math.PI / 2);
            var origX = q.x;
            var origW = q.w;
            q.invert();
            expect(q.x).toBeCloseTo(-origX, 5);
            expect(q.w).toBeCloseTo(origW, 5);
        });

        it('should produce identity when multiplied by original', function ()
        {
            var q = new Quaternion();
            var axis = new Vector3(0, 1, 0);
            q.setAxisAngle(axis, Math.PI / 4);
            var origX = q.x;
            var origY = q.y;
            var origZ = q.z;
            var origW = q.w;
            var inv = new Quaternion();
            inv.setAxisAngle(axis, Math.PI / 4);
            inv.invert();
            q.multiply(inv);
            expect(q.x).toBeCloseTo(0, 4);
            expect(q.y).toBeCloseTo(0, 4);
            expect(q.z).toBeCloseTo(0, 4);
            expect(Math.abs(q.w)).toBeCloseTo(1, 4);
        });

        it('should not change a zero-length quaternion', function ()
        {
            var q = new Quaternion(0, 0, 0, 0);
            q.invert();
            expect(q.x).toBe(0);
            expect(q.y).toBe(0);
            expect(q.z).toBe(0);
            expect(q.w).toBe(0);
        });
    });

    describe('conjugate', function ()
    {
        it('should negate x, y, z components', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            q.conjugate();
            expect(q.x).toBe(-1);
            expect(q.y).toBe(-2);
            expect(q.z).toBe(-3);
            expect(q.w).toBe(4);
        });

        it('should return itself', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            expect(q.conjugate()).toBe(q);
        });

        it('should leave w unchanged', function ()
        {
            var q = new Quaternion(1, 2, 3, 5);
            q.conjugate();
            expect(q.w).toBe(5);
        });

        it('should be its own inverse (double conjugate is original)', function ()
        {
            var q = new Quaternion(1, 2, 3, 4);
            q.conjugate().conjugate();
            expect(q.x).toBe(1);
            expect(q.y).toBe(2);
            expect(q.z).toBe(3);
            expect(q.w).toBe(4);
        });
    });

    describe('rotateX', function ()
    {
        it('should return itself', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            expect(q.rotateX(Math.PI / 2)).toBe(q);
        });

        it('should produce a unit quaternion', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            q.rotateX(Math.PI / 3);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should not change quaternion when rotating by zero', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            q.rotateX(0);
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(0, 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(1, 5);
        });

        it('should set correct quaternion when rotating identity by 90 degrees', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            q.rotateX(Math.PI / 2);
            var half = Math.PI / 4;
            expect(q.x).toBeCloseTo(Math.sin(half), 5);
            expect(q.y).toBeCloseTo(0, 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(Math.cos(half), 5);
        });
    });

    describe('rotateY', function ()
    {
        it('should return itself', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            expect(q.rotateY(Math.PI / 2)).toBe(q);
        });

        it('should produce a unit quaternion', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            q.rotateY(Math.PI / 3);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should not change quaternion when rotating by zero', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            q.rotateY(0);
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(0, 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(1, 5);
        });

        it('should set correct quaternion when rotating identity by 90 degrees', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            q.rotateY(Math.PI / 2);
            var half = Math.PI / 4;
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(Math.sin(half), 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(Math.cos(half), 5);
        });
    });

    describe('rotateZ', function ()
    {
        it('should return itself', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            expect(q.rotateZ(Math.PI / 2)).toBe(q);
        });

        it('should produce a unit quaternion', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            q.rotateZ(Math.PI / 3);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should not change quaternion when rotating by zero', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            q.rotateZ(0);
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(0, 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(1, 5);
        });

        it('should set correct quaternion when rotating identity by 90 degrees', function ()
        {
            var q = new Quaternion(0, 0, 0, 1);
            q.rotateZ(Math.PI / 2);
            var half = Math.PI / 4;
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(0, 5);
            expect(q.z).toBeCloseTo(Math.sin(half), 5);
            expect(q.w).toBeCloseTo(Math.cos(half), 5);
        });
    });

    describe('calculateW', function ()
    {
        it('should return itself', function ()
        {
            var q = new Quaternion(0, 0, 0, 0);
            expect(q.calculateW()).toBe(q);
        });

        it('should calculate w for zero x, y, z to be -1', function ()
        {
            var q = new Quaternion(0, 0, 0, 0);
            q.calculateW();
            expect(q.w).toBeCloseTo(-1, 5);
        });

        it('should compute w to make unit quaternion length', function ()
        {
            var q = new Quaternion(0.5, 0.5, 0.5, 0);
            q.calculateW();
            var len = Math.sqrt(0.5 * 0.5 + 0.5 * 0.5 + 0.5 * 0.5 + q.w * q.w);
            expect(len).toBeCloseTo(1, 5);
        });
    });

    describe('setFromEuler', function ()
    {
        it('should return itself', function ()
        {
            var q = new Quaternion();
            var euler = { x: 0, y: 0, z: 0, order: 'XYZ' };
            expect(q.setFromEuler(euler)).toBe(q);
        });

        it('should produce identity for zero Euler angles (XYZ order)', function ()
        {
            var q = new Quaternion();
            var euler = { x: 0, y: 0, z: 0, order: 'XYZ' };
            q.setFromEuler(euler);
            expect(q.x).toBeCloseTo(0, 5);
            expect(q.y).toBeCloseTo(0, 5);
            expect(q.z).toBeCloseTo(0, 5);
            expect(q.w).toBeCloseTo(1, 5);
        });

        it('should produce a unit quaternion for XYZ order', function ()
        {
            var q = new Quaternion();
            var euler = { x: 0.3, y: 0.5, z: 0.7, order: 'XYZ' };
            q.setFromEuler(euler);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should produce a unit quaternion for YXZ order', function ()
        {
            var q = new Quaternion();
            var euler = { x: 0.3, y: 0.5, z: 0.7, order: 'YXZ' };
            q.setFromEuler(euler);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should produce a unit quaternion for ZXY order', function ()
        {
            var q = new Quaternion();
            var euler = { x: 0.3, y: 0.5, z: 0.7, order: 'ZXY' };
            q.setFromEuler(euler);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should produce a unit quaternion for ZYX order', function ()
        {
            var q = new Quaternion();
            var euler = { x: 0.3, y: 0.5, z: 0.7, order: 'ZYX' };
            q.setFromEuler(euler);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should produce a unit quaternion for YZX order', function ()
        {
            var q = new Quaternion();
            var euler = { x: 0.3, y: 0.5, z: 0.7, order: 'YZX' };
            q.setFromEuler(euler);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should produce a unit quaternion for XZY order', function ()
        {
            var q = new Quaternion();
            var euler = { x: 0.3, y: 0.5, z: 0.7, order: 'XZY' };
            q.setFromEuler(euler);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should produce different results for different rotation orders', function ()
        {
            var q1 = new Quaternion();
            var q2 = new Quaternion();
            var euler1 = { x: 0.5, y: 0.5, z: 0.5, order: 'XYZ' };
            var euler2 = { x: 0.5, y: 0.5, z: 0.5, order: 'ZYX' };
            q1.setFromEuler(euler1);
            q2.setFromEuler(euler2);
            var same = (
                Math.abs(q1.x - q2.x) < 0.0001 &&
                Math.abs(q1.y - q2.y) < 0.0001 &&
                Math.abs(q1.z - q2.z) < 0.0001 &&
                Math.abs(q1.w - q2.w) < 0.0001
            );
            expect(same).toBe(false);
        });
    });

    describe('setFromRotationMatrix', function ()
    {
        it('should return itself', function ()
        {
            var q = new Quaternion();
            var mat4 = { val: new Float32Array(16) };
            mat4.val[0] = 1; mat4.val[5] = 1; mat4.val[10] = 1; mat4.val[15] = 1;
            expect(q.setFromRotationMatrix(mat4)).toBe(q);
        });

        it('should produce identity quaternion from identity matrix', function ()
        {
            var q = new Quaternion();
            var val = new Float32Array(16);
            val[0] = 1; val[5] = 1; val[10] = 1; val[15] = 1;
            q.setFromRotationMatrix({ val: val });
            expect(q.length()).toBeCloseTo(1, 4);
        });

        it('should produce a unit quaternion from a valid rotation matrix', function ()
        {
            var q = new Quaternion();
            // 90 degree rotation around Z axis as column-major matrix
            var val = new Float32Array(16);
            val[0] = 0;  val[1] = 1;  val[2] = 0;  val[3] = 0;
            val[4] = -1; val[5] = 0;  val[6] = 0;  val[7] = 0;
            val[8] = 0;  val[9] = 0;  val[10] = 1; val[11] = 0;
            val[12] = 0; val[13] = 0; val[14] = 0; val[15] = 1;
            q.setFromRotationMatrix({ val: val });
            expect(q.length()).toBeCloseTo(1, 4);
        });
    });

    describe('fromMat3', function ()
    {
        it('should return itself', function ()
        {
            var q = new Quaternion();
            var mat3 = new Matrix3();
            expect(q.fromMat3(mat3)).toBe(q);
        });

        it('should produce identity quaternion from identity matrix', function ()
        {
            var q = new Quaternion();
            var mat3 = new Matrix3();
            q.fromMat3(mat3);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should produce unit quaternion from a rotation matrix', function ()
        {
            var q = new Quaternion();
            var mat3 = new Matrix3();
            // 90 degree rotation around Z axis
            var m = mat3.val;
            m[0] = 0;  m[1] = 1;  m[2] = 0;
            m[3] = -1; m[4] = 0;  m[5] = 0;
            m[6] = 0;  m[7] = 0;  m[8] = 1;
            q.fromMat3(mat3);
            expect(q.length()).toBeCloseTo(1, 5);
        });

        it('should match setAxisAngle result for a known rotation', function ()
        {
            var q1 = new Quaternion();
            var axis = new Vector3(0, 0, 1);
            q1.setAxisAngle(axis, Math.PI / 2);

            var q2 = new Quaternion();
            var mat3 = new Matrix3();
            var m = mat3.val;
            var c = Math.cos(Math.PI / 2);
            var s = Math.sin(Math.PI / 2);
            m[0] = c;  m[1] = s;  m[2] = 0;
            m[3] = -s; m[4] = c;  m[5] = 0;
            m[6] = 0;  m[7] = 0;  m[8] = 1;
            q2.fromMat3(mat3);

            expect(Math.abs(q1.x) - Math.abs(q2.x)).toBeCloseTo(0, 4);
            expect(Math.abs(q1.y) - Math.abs(q2.y)).toBeCloseTo(0, 4);
            expect(Math.abs(q1.z) - Math.abs(q2.z)).toBeCloseTo(0, 4);
            expect(Math.abs(q1.w) - Math.abs(q2.w)).toBeCloseTo(0, 4);
        });
    });
});
