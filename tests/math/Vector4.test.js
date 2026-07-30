var Vector4 = require('../../src/math/Vector4');

describe('Vector4', function ()
{
    describe('constructor', function ()
    {
        it('should create a vector with default values of zero', function ()
        {
            var v = new Vector4();
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
            expect(v.w).toBe(0);
        });

        it('should create a vector with given numeric values', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
            expect(v.z).toBe(3);
            expect(v.w).toBe(4);
        });

        it('should create a vector from an object with x, y, z, w properties', function ()
        {
            var v = new Vector4({ x: 5, y: 6, z: 7, w: 8 });
            expect(v.x).toBe(5);
            expect(v.y).toBe(6);
            expect(v.z).toBe(7);
            expect(v.w).toBe(8);
        });

        it('should default missing object properties to zero', function ()
        {
            var v = new Vector4({ x: 1 });
            expect(v.x).toBe(1);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
            expect(v.w).toBe(0);
        });

        it('should handle negative values', function ()
        {
            var v = new Vector4(-1, -2, -3, -4);
            expect(v.x).toBe(-1);
            expect(v.y).toBe(-2);
            expect(v.z).toBe(-3);
            expect(v.w).toBe(-4);
        });

        it('should handle floating point values', function ()
        {
            var v = new Vector4(1.5, 2.5, 3.5, 4.5);
            expect(v.x).toBe(1.5);
            expect(v.y).toBe(2.5);
            expect(v.z).toBe(3.5);
            expect(v.w).toBe(4.5);
        });
    });

    describe('clone', function ()
    {
        it('should return a new Vector4 instance', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            var clone = v.clone();
            expect(clone).not.toBe(v);
        });

        it('should return a vector with the same component values', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            var clone = v.clone();
            expect(clone.x).toBe(1);
            expect(clone.y).toBe(2);
            expect(clone.z).toBe(3);
            expect(clone.w).toBe(4);
        });

        it('should not mutate the original when the clone is modified', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            var clone = v.clone();
            clone.x = 99;
            expect(v.x).toBe(1);
        });
    });

    describe('copy', function ()
    {
        it('should copy all components from the source vector', function ()
        {
            var src = new Vector4(5, 6, 7, 8);
            var v = new Vector4();
            v.copy(src);
            expect(v.x).toBe(5);
            expect(v.y).toBe(6);
            expect(v.z).toBe(7);
            expect(v.w).toBe(8);
        });

        it('should return this vector for chaining', function ()
        {
            var src = new Vector4(1, 2, 3, 4);
            var v = new Vector4();
            var result = v.copy(src);
            expect(result).toBe(v);
        });

        it('should default z and w to zero if source lacks them', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            v.copy({ x: 10, y: 20 });
            expect(v.x).toBe(10);
            expect(v.y).toBe(20);
            expect(v.z).toBe(0);
            expect(v.w).toBe(0);
        });
    });

    describe('equals', function ()
    {
        it('should return true when all components are equal', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(1, 2, 3, 4);
            expect(a.equals(b)).toBe(true);
        });

        it('should return false when x differs', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(9, 2, 3, 4);
            expect(a.equals(b)).toBe(false);
        });

        it('should return false when y differs', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(1, 9, 3, 4);
            expect(a.equals(b)).toBe(false);
        });

        it('should return false when z differs', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(1, 2, 9, 4);
            expect(a.equals(b)).toBe(false);
        });

        it('should return false when w differs', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(1, 2, 3, 9);
            expect(a.equals(b)).toBe(false);
        });

        it('should return true for two zero vectors', function ()
        {
            var a = new Vector4();
            var b = new Vector4();
            expect(a.equals(b)).toBe(true);
        });
    });

    describe('set', function ()
    {
        it('should set components from numeric arguments', function ()
        {
            var v = new Vector4();
            v.set(1, 2, 3, 4);
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
            expect(v.z).toBe(3);
            expect(v.w).toBe(4);
        });

        it('should set components from an object', function ()
        {
            var v = new Vector4();
            v.set({ x: 5, y: 6, z: 7, w: 8 });
            expect(v.x).toBe(5);
            expect(v.y).toBe(6);
            expect(v.z).toBe(7);
            expect(v.w).toBe(8);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector4();
            var result = v.set(1, 2, 3, 4);
            expect(result).toBe(v);
        });

        it('should default missing numeric args to zero', function ()
        {
            var v = new Vector4(9, 9, 9, 9);
            v.set(1);
            expect(v.x).toBe(1);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
            expect(v.w).toBe(0);
        });
    });

    describe('add', function ()
    {
        it('should add components of another vector', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(10, 20, 30, 40);
            a.add(b);
            expect(a.x).toBe(11);
            expect(a.y).toBe(22);
            expect(a.z).toBe(33);
            expect(a.w).toBe(44);
        });

        it('should return this vector for chaining', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(1, 1, 1, 1);
            var result = a.add(b);
            expect(result).toBe(a);
        });

        it('should handle adding zero vector', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(0, 0, 0, 0);
            a.add(b);
            expect(a.x).toBe(1);
            expect(a.y).toBe(2);
            expect(a.z).toBe(3);
            expect(a.w).toBe(4);
        });

        it('should handle negative values', function ()
        {
            var a = new Vector4(5, 5, 5, 5);
            var b = new Vector4(-3, -3, -3, -3);
            a.add(b);
            expect(a.x).toBe(2);
            expect(a.y).toBe(2);
            expect(a.z).toBe(2);
            expect(a.w).toBe(2);
        });
    });

    describe('subtract', function ()
    {
        it('should subtract components of another vector', function ()
        {
            var a = new Vector4(10, 20, 30, 40);
            var b = new Vector4(1, 2, 3, 4);
            a.subtract(b);
            expect(a.x).toBe(9);
            expect(a.y).toBe(18);
            expect(a.z).toBe(27);
            expect(a.w).toBe(36);
        });

        it('should return this vector for chaining', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(1, 1, 1, 1);
            var result = a.subtract(b);
            expect(result).toBe(a);
        });

        it('should return zero vector when subtracting itself', function ()
        {
            var a = new Vector4(5, 6, 7, 8);
            var b = new Vector4(5, 6, 7, 8);
            a.subtract(b);
            expect(a.x).toBe(0);
            expect(a.y).toBe(0);
            expect(a.z).toBe(0);
            expect(a.w).toBe(0);
        });
    });

    describe('scale', function ()
    {
        it('should multiply all components by the scale factor', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            v.scale(3);
            expect(v.x).toBe(3);
            expect(v.y).toBe(6);
            expect(v.z).toBe(9);
            expect(v.w).toBe(12);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            var result = v.scale(2);
            expect(result).toBe(v);
        });

        it('should result in zero vector when scaled by zero', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            v.scale(0);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
            expect(v.w).toBe(0);
        });

        it('should negate the vector when scaled by -1', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            v.scale(-1);
            expect(v.x).toBe(-1);
            expect(v.y).toBe(-2);
            expect(v.z).toBe(-3);
            expect(v.w).toBe(-4);
        });

        it('should handle fractional scale', function ()
        {
            var v = new Vector4(2, 4, 6, 8);
            v.scale(0.5);
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
            expect(v.z).toBe(3);
            expect(v.w).toBe(4);
        });
    });

    describe('length', function ()
    {
        it('should return zero for the zero vector', function ()
        {
            var v = new Vector4(0, 0, 0, 0);
            expect(v.length()).toBe(0);
        });

        it('should return correct length for a unit vector along x', function ()
        {
            var v = new Vector4(1, 0, 0, 0);
            expect(v.length()).toBe(1);
        });

        it('should return correct length for known values', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            expect(v.length()).toBeCloseTo(Math.sqrt(1 + 4 + 9 + 16), 10);
        });

        it('should return the same length for negated components', function ()
        {
            var v1 = new Vector4(3, 4, 0, 0);
            var v2 = new Vector4(-3, -4, 0, 0);
            expect(v1.length()).toBe(v2.length());
        });
    });

    describe('lengthSq', function ()
    {
        it('should return zero for the zero vector', function ()
        {
            var v = new Vector4(0, 0, 0, 0);
            expect(v.lengthSq()).toBe(0);
        });

        it('should return the squared length', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            expect(v.lengthSq()).toBe(1 + 4 + 9 + 16);
        });

        it('should equal length squared', function ()
        {
            var v = new Vector4(2, 3, 6, 0);
            var len = v.length();
            expect(v.lengthSq()).toBeCloseTo(len * len, 10);
        });
    });

    describe('normalize', function ()
    {
        it('should produce a vector of unit length', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            v.normalize();
            expect(v.length()).toBeCloseTo(1, 10);
        });

        it('should not change direction', function ()
        {
            var v = new Vector4(3, 0, 0, 0);
            v.normalize();
            expect(v.x).toBeCloseTo(1, 10);
            expect(v.y).toBeCloseTo(0, 10);
            expect(v.z).toBeCloseTo(0, 10);
            expect(v.w).toBeCloseTo(0, 10);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            var result = v.normalize();
            expect(result).toBe(v);
        });

        it('should not modify the zero vector', function ()
        {
            var v = new Vector4(0, 0, 0, 0);
            v.normalize();
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
            expect(v.w).toBe(0);
        });
    });

    describe('dot', function ()
    {
        it('should return zero for perpendicular unit vectors', function ()
        {
            var a = new Vector4(1, 0, 0, 0);
            var b = new Vector4(0, 1, 0, 0);
            expect(a.dot(b)).toBe(0);
        });

        it('should return 1 for identical unit vectors', function ()
        {
            var a = new Vector4(1, 0, 0, 0);
            expect(a.dot(a)).toBe(1);
        });

        it('should return correct value for known vectors', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(5, 6, 7, 8);
            expect(a.dot(b)).toBe(5 + 12 + 21 + 32);
        });

        it('should return negative value for opposing vectors', function ()
        {
            var a = new Vector4(1, 0, 0, 0);
            var b = new Vector4(-1, 0, 0, 0);
            expect(a.dot(b)).toBe(-1);
        });
    });

    describe('lerp', function ()
    {
        it('should return this vector unchanged when t is 0', function ()
        {
            var a = new Vector4(0, 0, 0, 0);
            var b = new Vector4(10, 10, 10, 10);
            a.lerp(b, 0);
            expect(a.x).toBe(0);
            expect(a.y).toBe(0);
            expect(a.z).toBe(0);
            expect(a.w).toBe(0);
        });

        it('should return the target vector when t is 1', function ()
        {
            var a = new Vector4(0, 0, 0, 0);
            var b = new Vector4(10, 20, 30, 40);
            a.lerp(b, 1);
            expect(a.x).toBe(10);
            expect(a.y).toBe(20);
            expect(a.z).toBe(30);
            expect(a.w).toBe(40);
        });

        it('should interpolate to midpoint when t is 0.5', function ()
        {
            var a = new Vector4(0, 0, 0, 0);
            var b = new Vector4(10, 20, 30, 40);
            a.lerp(b, 0.5);
            expect(a.x).toBe(5);
            expect(a.y).toBe(10);
            expect(a.z).toBe(15);
            expect(a.w).toBe(20);
        });

        it('should default t to 0 when not provided', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(10, 20, 30, 40);
            a.lerp(b);
            expect(a.x).toBe(1);
            expect(a.y).toBe(2);
            expect(a.z).toBe(3);
            expect(a.w).toBe(4);
        });

        it('should return this vector for chaining', function ()
        {
            var a = new Vector4(0, 0, 0, 0);
            var b = new Vector4(1, 1, 1, 1);
            var result = a.lerp(b, 0.5);
            expect(result).toBe(a);
        });
    });

    describe('multiply', function ()
    {
        it('should multiply components together', function ()
        {
            var a = new Vector4(2, 3, 4, 5);
            var b = new Vector4(6, 7, 8, 9);
            a.multiply(b);
            expect(a.x).toBe(12);
            expect(a.y).toBe(21);
            expect(a.z).toBe(32);
            expect(a.w).toBe(45);
        });

        it('should return this vector for chaining', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(1, 1, 1, 1);
            var result = a.multiply(b);
            expect(result).toBe(a);
        });

        it('should default missing z/w to 1 so they are unchanged', function ()
        {
            var a = new Vector4(2, 3, 4, 5);
            a.multiply({ x: 2, y: 2 });
            expect(a.x).toBe(4);
            expect(a.y).toBe(6);
            expect(a.z).toBe(4);
            expect(a.w).toBe(5);
        });
    });

    describe('divide', function ()
    {
        it('should divide components', function ()
        {
            var a = new Vector4(10, 20, 30, 40);
            var b = new Vector4(2, 4, 5, 8);
            a.divide(b);
            expect(a.x).toBe(5);
            expect(a.y).toBe(5);
            expect(a.z).toBe(6);
            expect(a.w).toBe(5);
        });

        it('should return this vector for chaining', function ()
        {
            var a = new Vector4(4, 4, 4, 4);
            var b = new Vector4(2, 2, 2, 2);
            var result = a.divide(b);
            expect(result).toBe(a);
        });

        it('should default missing z/w to 1 so they are unchanged', function ()
        {
            var a = new Vector4(10, 20, 30, 40);
            a.divide({ x: 2, y: 4 });
            expect(a.x).toBe(5);
            expect(a.y).toBe(5);
            expect(a.z).toBe(30);
            expect(a.w).toBe(40);
        });
    });

    describe('distance', function ()
    {
        it('should return zero when both vectors are identical', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(1, 2, 3, 4);
            expect(a.distance(b)).toBe(0);
        });

        it('should return correct distance for known vectors', function ()
        {
            var a = new Vector4(0, 0, 0, 0);
            var b = new Vector4(1, 0, 0, 0);
            expect(a.distance(b)).toBe(1);
        });

        it('should return the same distance regardless of direction', function ()
        {
            var a = new Vector4(0, 0, 0, 0);
            var b = new Vector4(3, 4, 0, 0);
            expect(a.distance(b)).toBeCloseTo(5, 10);
        });

        it('should compute 4D distance correctly', function ()
        {
            var a = new Vector4(0, 0, 0, 0);
            var b = new Vector4(1, 1, 1, 1);
            expect(a.distance(b)).toBeCloseTo(2, 10);
        });
    });

    describe('distanceSq', function ()
    {
        it('should return zero when both vectors are identical', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(1, 2, 3, 4);
            expect(a.distanceSq(b)).toBe(0);
        });

        it('should return the squared distance', function ()
        {
            var a = new Vector4(0, 0, 0, 0);
            var b = new Vector4(3, 4, 0, 0);
            expect(a.distanceSq(b)).toBe(25);
        });

        it('should equal the square of distance()', function ()
        {
            var a = new Vector4(1, 2, 3, 4);
            var b = new Vector4(5, 6, 7, 8);
            var dist = a.distance(b);
            expect(a.distanceSq(b)).toBeCloseTo(dist * dist, 10);
        });
    });

    describe('negate', function ()
    {
        it('should negate all components', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            v.negate();
            expect(v.x).toBe(-1);
            expect(v.y).toBe(-2);
            expect(v.z).toBe(-3);
            expect(v.w).toBe(-4);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            var result = v.negate();
            expect(result).toBe(v);
        });

        it('should double-negate back to original', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            v.negate().negate();
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
            expect(v.z).toBe(3);
            expect(v.w).toBe(4);
        });

        it('should leave the zero vector unchanged', function ()
        {
            var v = new Vector4(0, 0, 0, 0);
            v.negate();
            expect(v.x).toBe(-0);
            expect(v.y).toBe(-0);
            expect(v.z).toBe(-0);
            expect(v.w).toBe(-0);
        });
    });

    describe('transformMat4', function ()
    {
        it('should transform by the identity matrix leaving components unchanged', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            // Column-major identity matrix
            var mat = {
                val: [
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ]
            };
            v.transformMat4(mat);
            expect(v.x).toBeCloseTo(1, 10);
            expect(v.y).toBeCloseTo(2, 10);
            expect(v.z).toBeCloseTo(3, 10);
            expect(v.w).toBeCloseTo(4, 10);
        });

        it('should scale components by a scaling matrix', function ()
        {
            var v = new Vector4(1, 2, 3, 1);
            // Scale by (2, 3, 4) — column-major
            var mat = {
                val: [
                    2, 0, 0, 0,
                    0, 3, 0, 0,
                    0, 0, 4, 0,
                    0, 0, 0, 1
                ]
            };
            v.transformMat4(mat);
            expect(v.x).toBeCloseTo(2, 10);
            expect(v.y).toBeCloseTo(6, 10);
            expect(v.z).toBeCloseTo(12, 10);
            expect(v.w).toBeCloseTo(1, 10);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector4(1, 0, 0, 1);
            var mat = {
                val: [
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ]
            };
            var result = v.transformMat4(mat);
            expect(result).toBe(v);
        });
    });

    describe('transformQuat', function ()
    {
        it('should leave the vector unchanged when transformed by identity quaternion', function ()
        {
            var v = new Vector4(1, 0, 0, 0);
            var q = { x: 0, y: 0, z: 0, w: 1 };
            v.transformQuat(q);
            expect(v.x).toBeCloseTo(1, 10);
            expect(v.y).toBeCloseTo(0, 10);
            expect(v.z).toBeCloseTo(0, 10);
        });

        it('should rotate 90 degrees around z-axis using a quaternion', function ()
        {
            var v = new Vector4(1, 0, 0, 0);
            // 90° around z: q = (0, 0, sin(45°), cos(45°))
            var s = Math.sin(Math.PI / 4);
            var c = Math.cos(Math.PI / 4);
            var q = { x: 0, y: 0, z: s, w: c };
            v.transformQuat(q);
            expect(v.x).toBeCloseTo(0, 5);
            expect(v.y).toBeCloseTo(1, 5);
            expect(v.z).toBeCloseTo(0, 5);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector4(1, 0, 0, 0);
            var q = { x: 0, y: 0, z: 0, w: 1 };
            var result = v.transformQuat(q);
            expect(result).toBe(v);
        });
    });

    describe('reset', function ()
    {
        it('should set all components to zero', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            v.reset();
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
            expect(v.w).toBe(0);
        });

        it('should return this vector for chaining', function ()
        {
            var v = new Vector4(1, 2, 3, 4);
            var result = v.reset();
            expect(result).toBe(v);
        });

        it('should be idempotent on a zero vector', function ()
        {
            var v = new Vector4(0, 0, 0, 0);
            v.reset();
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
            expect(v.w).toBe(0);
        });
    });

    describe('aliases', function ()
    {
        it('should have sub as an alias for subtract', function ()
        {
            expect(Vector4.prototype.sub).toBe(Vector4.prototype.subtract);
        });

        it('should have mul as an alias for multiply', function ()
        {
            expect(Vector4.prototype.mul).toBe(Vector4.prototype.multiply);
        });

        it('should have div as an alias for divide', function ()
        {
            expect(Vector4.prototype.div).toBe(Vector4.prototype.divide);
        });

        it('should have dist as an alias for distance', function ()
        {
            expect(Vector4.prototype.dist).toBe(Vector4.prototype.distance);
        });

        it('should have distSq as an alias for distanceSq', function ()
        {
            expect(Vector4.prototype.distSq).toBe(Vector4.prototype.distanceSq);
        });

        it('should have len as an alias for length', function ()
        {
            expect(Vector4.prototype.len).toBe(Vector4.prototype.length);
        });

        it('should have lenSq as an alias for lengthSq', function ()
        {
            expect(Vector4.prototype.lenSq).toBe(Vector4.prototype.lengthSq);
        });
    });
});
