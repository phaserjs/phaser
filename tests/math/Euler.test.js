var Euler = require('../../src/math/Euler');
var Matrix4 = require('../../src/math/Matrix4');

describe('Euler', function ()
{
    describe('constructor', function ()
    {
        it('should create an Euler with default values', function ()
        {
            var e = new Euler();
            expect(e.x).toBe(0);
            expect(e.y).toBe(0);
            expect(e.z).toBe(0);
            expect(e.order).toBe('XYZ');
        });

        it('should create an Euler with given values', function ()
        {
            var e = new Euler(1, 2, 3, 'YXZ');
            expect(e.x).toBe(1);
            expect(e.y).toBe(2);
            expect(e.z).toBe(3);
            expect(e.order).toBe('YXZ');
        });

        it('should default order to DefaultOrder constant', function ()
        {
            var e = new Euler(0.1, 0.2, 0.3);
            expect(e.order).toBe(Euler.DefaultOrder);
        });

        it('should have onChangeCallback set to NOOP', function ()
        {
            var e = new Euler();
            expect(typeof e.onChangeCallback).toBe('function');
        });
    });

    describe('static properties', function ()
    {
        it('should have RotationOrders array with 6 entries', function ()
        {
            expect(Euler.RotationOrders).toEqual([ 'XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY' ]);
        });

        it('should have DefaultOrder of XYZ', function ()
        {
            expect(Euler.DefaultOrder).toBe('XYZ');
        });
    });

    describe('property setters invoke onChangeCallback', function ()
    {
        it('should invoke onChangeCallback when x is set', function ()
        {
            var e = new Euler();
            var called = false;
            e.onChangeCallback = function () { called = true; };
            e.x = 1;
            expect(called).toBe(true);
        });

        it('should invoke onChangeCallback when y is set', function ()
        {
            var e = new Euler();
            var called = false;
            e.onChangeCallback = function () { called = true; };
            e.y = 1;
            expect(called).toBe(true);
        });

        it('should invoke onChangeCallback when z is set', function ()
        {
            var e = new Euler();
            var called = false;
            e.onChangeCallback = function () { called = true; };
            e.z = 1;
            expect(called).toBe(true);
        });

        it('should invoke onChangeCallback when order is set', function ()
        {
            var e = new Euler();
            var called = false;
            e.onChangeCallback = function () { called = true; };
            e.order = 'YXZ';
            expect(called).toBe(true);
        });

        it('should pass itself to onChangeCallback', function ()
        {
            var e = new Euler();
            var received = null;
            e.onChangeCallback = function (euler) { received = euler; };
            e.x = 1;
            expect(received).toBe(e);
        });
    });

    describe('set', function ()
    {
        it('should set x, y, z and return this', function ()
        {
            var e = new Euler();
            var result = e.set(1, 2, 3);
            expect(e.x).toBe(1);
            expect(e.y).toBe(2);
            expect(e.z).toBe(3);
            expect(result).toBe(e);
        });

        it('should keep existing order when order not provided', function ()
        {
            var e = new Euler(0, 0, 0, 'ZYX');
            e.set(1, 2, 3);
            expect(e.order).toBe('ZYX');
        });

        it('should set order when provided', function ()
        {
            var e = new Euler();
            e.set(1, 2, 3, 'YZX');
            expect(e.order).toBe('YZX');
        });

        it('should invoke onChangeCallback', function ()
        {
            var e = new Euler();
            var callCount = 0;
            e.onChangeCallback = function () { callCount++; };
            e.set(1, 2, 3);
            expect(callCount).toBe(1);
        });

        it('should work with negative values', function ()
        {
            var e = new Euler();
            e.set(-1, -2, -3);
            expect(e.x).toBe(-1);
            expect(e.y).toBe(-2);
            expect(e.z).toBe(-3);
        });

        it('should work with floating point values', function ()
        {
            var e = new Euler();
            e.set(0.1, 0.2, 0.3);
            expect(e.x).toBeCloseTo(0.1);
            expect(e.y).toBeCloseTo(0.2);
            expect(e.z).toBeCloseTo(0.3);
        });

        it('should work with zero values', function ()
        {
            var e = new Euler(1, 2, 3);
            e.set(0, 0, 0);
            expect(e.x).toBe(0);
            expect(e.y).toBe(0);
            expect(e.z).toBe(0);
        });
    });

    describe('copy', function ()
    {
        it('should copy x, y, z, and order from another Euler', function ()
        {
            var source = new Euler(1, 2, 3, 'ZXY');
            var target = new Euler();
            target.copy(source);
            expect(target.x).toBe(1);
            expect(target.y).toBe(2);
            expect(target.z).toBe(3);
            expect(target.order).toBe('ZXY');
        });

        it('should return this', function ()
        {
            var source = new Euler(1, 2, 3);
            var target = new Euler();
            var result = target.copy(source);
            expect(result).toBe(target);
        });

        it('should not affect the source Euler', function ()
        {
            var source = new Euler(1, 2, 3, 'YZX');
            var target = new Euler();
            target.copy(source);
            expect(source.x).toBe(1);
            expect(source.y).toBe(2);
            expect(source.z).toBe(3);
            expect(source.order).toBe('YZX');
        });

        it('should invoke onChangeCallback on target', function ()
        {
            var source = new Euler(1, 2, 3);
            var target = new Euler();
            var called = false;
            target.onChangeCallback = function () { called = true; };
            target.copy(source);
            expect(called).toBe(true);
        });
    });

    describe('setFromRotationMatrix', function ()
    {
        it('should return this', function ()
        {
            var e = new Euler();
            var m = new Matrix4();
            m.identity();
            var result = e.setFromRotationMatrix(m);
            expect(result).toBe(e);
        });

        it('should set angles to zero for identity matrix with XYZ order', function ()
        {
            var e = new Euler();
            var m = new Matrix4();
            m.identity();
            e.setFromRotationMatrix(m, 'XYZ');
            expect(e.x).toBeCloseTo(0);
            expect(e.y).toBeCloseTo(0);
            expect(e.z).toBeCloseTo(0);
        });

        it('should set angles to zero for identity matrix with YXZ order', function ()
        {
            var e = new Euler();
            var m = new Matrix4();
            m.identity();
            e.setFromRotationMatrix(m, 'YXZ');
            expect(e.x).toBeCloseTo(0);
            expect(e.y).toBeCloseTo(0);
            expect(e.z).toBeCloseTo(0);
        });

        it('should set angles to zero for identity matrix with ZXY order', function ()
        {
            var e = new Euler();
            var m = new Matrix4();
            m.identity();
            e.setFromRotationMatrix(m, 'ZXY');
            expect(e.x).toBeCloseTo(0);
            expect(e.y).toBeCloseTo(0);
            expect(e.z).toBeCloseTo(0);
        });

        it('should set angles to zero for identity matrix with ZYX order', function ()
        {
            var e = new Euler();
            var m = new Matrix4();
            m.identity();
            e.setFromRotationMatrix(m, 'ZYX');
            expect(e.x).toBeCloseTo(0);
            expect(e.y).toBeCloseTo(0);
            expect(e.z).toBeCloseTo(0);
        });

        it('should set angles to zero for identity matrix with YZX order', function ()
        {
            var e = new Euler();
            var m = new Matrix4();
            m.identity();
            e.setFromRotationMatrix(m, 'YZX');
            expect(e.x).toBeCloseTo(0);
            expect(e.y).toBeCloseTo(0);
            expect(e.z).toBeCloseTo(0);
        });

        it('should set angles to zero for identity matrix with XZY order', function ()
        {
            var e = new Euler();
            var m = new Matrix4();
            m.identity();
            e.setFromRotationMatrix(m, 'XZY');
            expect(e.x).toBeCloseTo(0);
            expect(e.y).toBeCloseTo(0);
            expect(e.z).toBeCloseTo(0);
        });

        it('should default to current order when order not provided', function ()
        {
            var e = new Euler(0, 0, 0, 'ZYX');
            var m = new Matrix4();
            m.identity();
            e.setFromRotationMatrix(m);
            expect(e.order).toBe('ZYX');
        });

        it('should not invoke onChangeCallback by default', function ()
        {
            var e = new Euler();
            var called = false;
            e.onChangeCallback = function () { called = true; };
            var m = new Matrix4();
            m.identity();
            e.setFromRotationMatrix(m, 'XYZ', false);
            expect(called).toBe(false);
        });

        it('should invoke onChangeCallback when update is true', function ()
        {
            var e = new Euler();
            var called = false;
            e.onChangeCallback = function () { called = true; };
            var m = new Matrix4();
            m.identity();
            e.setFromRotationMatrix(m, 'XYZ', true);
            expect(called).toBe(true);
        });

        it('should extract rotation X from a rotation matrix (XYZ order)', function ()
        {
            // Build a rotation matrix for a 90-degree rotation around X
            var angle = Math.PI / 2;
            var m = new Matrix4();
            var val = m.val;
            // column-major layout: identity then apply rotation
            val[0] = 1;  val[4] = 0;           val[8]  = 0;
            val[1] = 0;  val[5] = Math.cos(angle); val[9]  = -Math.sin(angle);
            val[2] = 0;  val[6] = Math.sin(angle); val[10] = Math.cos(angle);
            // m13 = val[8] = 0, so |m13| < epsilon -> XYZ branch uses atan2
            var e = new Euler();
            e.setFromRotationMatrix(m, 'XYZ');
            expect(e.x).toBeCloseTo(angle);
            expect(e.y).toBeCloseTo(0);
            expect(e.z).toBeCloseTo(0);
        });

        it('should extract rotation Z from a rotation matrix (XYZ order)', function ()
        {
            var angle = Math.PI / 4;
            var m = new Matrix4();
            var val = m.val;
            val[0] = Math.cos(angle);  val[4] = -Math.sin(angle); val[8]  = 0;
            val[1] = Math.sin(angle);  val[5] = Math.cos(angle);  val[9]  = 0;
            val[2] = 0;                val[6] = 0;                 val[10] = 1;
            var e = new Euler();
            e.setFromRotationMatrix(m, 'XYZ');
            expect(e.x).toBeCloseTo(0);
            expect(e.y).toBeCloseTo(0);
            expect(e.z).toBeCloseTo(angle);
        });
    });

    describe('setFromQuaternion', function ()
    {
        it('should return this', function ()
        {
            var e = new Euler();
            var q = { x: 0, y: 0, z: 0, w: 1 };
            var result = e.setFromQuaternion(q);
            expect(result).toBe(e);
        });

        it('should produce zero angles from identity quaternion', function ()
        {
            var e = new Euler();
            var q = { x: 0, y: 0, z: 0, w: 1 };
            e.setFromQuaternion(q, 'XYZ');
            expect(e.x).toBeCloseTo(0);
            expect(e.y).toBeCloseTo(0);
            expect(e.z).toBeCloseTo(0);
        });

        it('should default to current order when order not provided', function ()
        {
            var e = new Euler(0, 0, 0, 'ZYX');
            var q = { x: 0, y: 0, z: 0, w: 1 };
            e.setFromQuaternion(q);
            expect(e.order).toBe('ZYX');
        });

        it('should not invoke onChangeCallback by default', function ()
        {
            var e = new Euler();
            var called = false;
            e.onChangeCallback = function () { called = true; };
            var q = { x: 0, y: 0, z: 0, w: 1 };
            e.setFromQuaternion(q, 'XYZ', false);
            expect(called).toBe(false);
        });

        it('should invoke onChangeCallback when update is true', function ()
        {
            var e = new Euler();
            var called = false;
            e.onChangeCallback = function () { called = true; };
            var q = { x: 0, y: 0, z: 0, w: 1 };
            e.setFromQuaternion(q, 'XYZ', true);
            expect(called).toBe(true);
        });

        it('should produce correct angles from a 90-degree X rotation quaternion', function ()
        {
            var half = Math.PI / 4; // sin/cos of 45deg for 90deg rotation
            var e = new Euler();
            var q = { x: Math.sin(half), y: 0, z: 0, w: Math.cos(half) };
            e.setFromQuaternion(q, 'XYZ');
            expect(e.x).toBeCloseTo(Math.PI / 2);
            expect(e.y).toBeCloseTo(0);
            expect(e.z).toBeCloseTo(0);
        });

        it('should produce correct angles from a 90-degree Y rotation quaternion', function ()
        {
            var half = Math.PI / 4;
            var e = new Euler();
            var q = { x: 0, y: Math.sin(half), z: 0, w: Math.cos(half) };
            e.setFromQuaternion(q, 'XYZ');
            expect(e.x).toBeCloseTo(0);
            expect(e.y).toBeCloseTo(Math.PI / 2);
            expect(e.z).toBeCloseTo(0);
        });

        it('should produce correct angles for all rotation orders with identity quaternion', function ()
        {
            var q = { x: 0, y: 0, z: 0, w: 1 };
            var orders = Euler.RotationOrders;
            for (var i = 0; i < orders.length; i++)
            {
                var e = new Euler();
                e.setFromQuaternion(q, orders[i]);
                expect(e.x).toBeCloseTo(0);
                expect(e.y).toBeCloseTo(0);
                expect(e.z).toBeCloseTo(0);
                expect(e.order).toBe(orders[i]);
            }
        });
    });
});
