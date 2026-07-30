var Vector2 = require('../../src/math/Vector2');

describe('Vector2', function ()
{
    describe('constructor', function ()
    {
        it('should create a vector with default values of zero', function ()
        {
            var v = new Vector2();
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
        });

        it('should create a vector with given x and y values', function ()
        {
            var v = new Vector2(3, 4);
            expect(v.x).toBe(3);
            expect(v.y).toBe(4);
        });

        it('should set y equal to x when only x is given', function ()
        {
            var v = new Vector2(5);
            expect(v.x).toBe(5);
            expect(v.y).toBe(5);
        });

        it('should create a vector from an object with x and y properties', function ()
        {
            var v = new Vector2({ x: 7, y: 8 });
            expect(v.x).toBe(7);
            expect(v.y).toBe(8);
        });

        it('should default missing object properties to zero', function ()
        {
            var v = new Vector2({ x: 3 });
            expect(v.x).toBe(3);
            expect(v.y).toBe(0);
        });

        it('should handle negative values', function ()
        {
            var v = new Vector2(-3, -4);
            expect(v.x).toBe(-3);
            expect(v.y).toBe(-4);
        });

        it('should handle floating point values', function ()
        {
            var v = new Vector2(1.5, 2.7);
            expect(v.x).toBe(1.5);
            expect(v.y).toBe(2.7);
        });
    });

    describe('static constants', function ()
    {
        it('should have a ZERO constant at (0, 0)', function ()
        {
            expect(Vector2.ZERO.x).toBe(0);
            expect(Vector2.ZERO.y).toBe(0);
        });

        it('should have a RIGHT constant at (1, 0)', function ()
        {
            expect(Vector2.RIGHT.x).toBe(1);
            expect(Vector2.RIGHT.y).toBe(0);
        });

        it('should have a LEFT constant at (-1, 0)', function ()
        {
            expect(Vector2.LEFT.x).toBe(-1);
            expect(Vector2.LEFT.y).toBe(0);
        });

        it('should have an UP constant at (0, -1)', function ()
        {
            expect(Vector2.UP.x).toBe(0);
            expect(Vector2.UP.y).toBe(-1);
        });

        it('should have a DOWN constant at (0, 1)', function ()
        {
            expect(Vector2.DOWN.x).toBe(0);
            expect(Vector2.DOWN.y).toBe(1);
        });

        it('should have a ONE constant at (1, 1)', function ()
        {
            expect(Vector2.ONE.x).toBe(1);
            expect(Vector2.ONE.y).toBe(1);
        });
    });

    describe('clone', function ()
    {
        it('should return a new Vector2 with the same components', function ()
        {
            var v = new Vector2(3, 4);
            var c = v.clone();
            expect(c.x).toBe(3);
            expect(c.y).toBe(4);
        });

        it('should return a different instance', function ()
        {
            var v = new Vector2(3, 4);
            var c = v.clone();
            expect(c).not.toBe(v);
        });

        it('should not affect the original when mutating the clone', function ()
        {
            var v = new Vector2(3, 4);
            var c = v.clone();
            c.x = 99;
            expect(v.x).toBe(3);
        });
    });

    describe('copy', function ()
    {
        it('should copy components from the source vector', function ()
        {
            var v = new Vector2();
            v.copy({ x: 5, y: 6 });
            expect(v.x).toBe(5);
            expect(v.y).toBe(6);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2();
            var result = v.copy({ x: 1, y: 2 });
            expect(result).toBe(v);
        });

        it('should default missing src properties to zero', function ()
        {
            var v = new Vector2(10, 10);
            v.copy({ x: 5 });
            expect(v.x).toBe(5);
            expect(v.y).toBe(0);
        });
    });

    describe('setFromObject', function ()
    {
        it('should set components from an object', function ()
        {
            var v = new Vector2();
            v.setFromObject({ x: 3, y: 7 });
            expect(v.x).toBe(3);
            expect(v.y).toBe(7);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2();
            var result = v.setFromObject({ x: 1, y: 2 });
            expect(result).toBe(v);
        });

        it('should default missing properties to zero', function ()
        {
            var v = new Vector2(5, 5);
            v.setFromObject({});
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
        });
    });

    describe('set', function ()
    {
        it('should set x and y components', function ()
        {
            var v = new Vector2();
            v.set(3, 4);
            expect(v.x).toBe(3);
            expect(v.y).toBe(4);
        });

        it('should set y equal to x when only x is given', function ()
        {
            var v = new Vector2();
            v.set(7);
            expect(v.x).toBe(7);
            expect(v.y).toBe(7);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2();
            var result = v.set(1, 2);
            expect(result).toBe(v);
        });
    });

    describe('setTo', function ()
    {
        it('should behave identically to set', function ()
        {
            var v = new Vector2();
            v.setTo(3, 4);
            expect(v.x).toBe(3);
            expect(v.y).toBe(4);
        });

        it('should set y equal to x when only x is given', function ()
        {
            var v = new Vector2();
            v.setTo(9);
            expect(v.x).toBe(9);
            expect(v.y).toBe(9);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2();
            var result = v.setTo(1, 2);
            expect(result).toBe(v);
        });
    });

    describe('ceil', function ()
    {
        it('should ceil both components', function ()
        {
            var v = new Vector2(1.2, 2.7);
            v.ceil();
            expect(v.x).toBe(2);
            expect(v.y).toBe(3);
        });

        it('should handle negative values', function ()
        {
            var v = new Vector2(-1.2, -2.7);
            v.ceil();
            expect(v.x).toBe(-1);
            expect(v.y).toBe(-2);
        });

        it('should not change integer values', function ()
        {
            var v = new Vector2(3, 4);
            v.ceil();
            expect(v.x).toBe(3);
            expect(v.y).toBe(4);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(1.5, 2.5);
            var result = v.ceil();
            expect(result).toBe(v);
        });
    });

    describe('floor', function ()
    {
        it('should floor both components', function ()
        {
            var v = new Vector2(1.9, 2.1);
            v.floor();
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
        });

        it('should handle negative values', function ()
        {
            var v = new Vector2(-1.2, -2.7);
            v.floor();
            expect(v.x).toBe(-2);
            expect(v.y).toBe(-3);
        });

        it('should not change integer values', function ()
        {
            var v = new Vector2(3, 4);
            v.floor();
            expect(v.x).toBe(3);
            expect(v.y).toBe(4);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(1.5, 2.5);
            var result = v.floor();
            expect(result).toBe(v);
        });
    });

    describe('invert', function ()
    {
        it('should swap x and y components', function ()
        {
            var v = new Vector2(3, 7);
            v.invert();
            expect(v.x).toBe(7);
            expect(v.y).toBe(3);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(1, 2);
            var result = v.invert();
            expect(result).toBe(v);
        });

        it('should work when components are equal', function ()
        {
            var v = new Vector2(5, 5);
            v.invert();
            expect(v.x).toBe(5);
            expect(v.y).toBe(5);
        });
    });

    describe('setToPolar', function ()
    {
        it('should set components from angle 0 with default length', function ()
        {
            var v = new Vector2();
            v.setToPolar(0);
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(0);
        });

        it('should set components from angle PI/2 with default length', function ()
        {
            var v = new Vector2();
            v.setToPolar(Math.PI / 2);
            expect(v.x).toBeCloseTo(0);
            expect(v.y).toBeCloseTo(1);
        });

        it('should scale by length', function ()
        {
            var v = new Vector2();
            v.setToPolar(0, 5);
            expect(v.x).toBeCloseTo(5);
            expect(v.y).toBeCloseTo(0);
        });

        it('should handle angle PI', function ()
        {
            var v = new Vector2();
            v.setToPolar(Math.PI, 2);
            expect(v.x).toBeCloseTo(-2);
            expect(v.y).toBeCloseTo(0);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2();
            var result = v.setToPolar(0);
            expect(result).toBe(v);
        });
    });

    describe('equals', function ()
    {
        it('should return true for equal vectors', function ()
        {
            var v = new Vector2(3, 4);
            expect(v.equals({ x: 3, y: 4 })).toBe(true);
        });

        it('should return false when x differs', function ()
        {
            var v = new Vector2(3, 4);
            expect(v.equals({ x: 2, y: 4 })).toBe(false);
        });

        it('should return false when y differs', function ()
        {
            var v = new Vector2(3, 4);
            expect(v.equals({ x: 3, y: 5 })).toBe(false);
        });

        it('should return true for zero vectors', function ()
        {
            var v = new Vector2(0, 0);
            expect(v.equals({ x: 0, y: 0 })).toBe(true);
        });
    });

    describe('fuzzyEquals', function ()
    {
        it('should return true for exactly equal vectors', function ()
        {
            var v = new Vector2(3, 4);
            expect(v.fuzzyEquals({ x: 3, y: 4 })).toBe(true);
        });

        it('should return true for vectors within default epsilon', function ()
        {
            var v = new Vector2(1, 1);
            expect(v.fuzzyEquals({ x: 1.00005, y: 1.00005 })).toBe(true);
        });

        it('should return false for vectors outside default epsilon', function ()
        {
            var v = new Vector2(1, 1);
            expect(v.fuzzyEquals({ x: 1.001, y: 1.001 })).toBe(false);
        });

        it('should respect a custom epsilon', function ()
        {
            var v = new Vector2(1, 1);
            expect(v.fuzzyEquals({ x: 1.05, y: 1.05 }, 0.1)).toBe(true);
        });
    });

    describe('angle', function ()
    {
        it('should return 0 for a vector pointing right', function ()
        {
            var v = new Vector2(1, 0);
            expect(v.angle()).toBeCloseTo(0);
        });

        it('should return PI/2 for a vector pointing down', function ()
        {
            var v = new Vector2(0, 1);
            expect(v.angle()).toBeCloseTo(Math.PI / 2);
        });

        it('should return PI for a vector pointing left', function ()
        {
            var v = new Vector2(-1, 0);
            expect(v.angle()).toBeCloseTo(Math.PI);
        });

        it('should return 3*PI/2 for a vector pointing up (negative y)', function ()
        {
            var v = new Vector2(0, -1);
            expect(v.angle()).toBeCloseTo(3 * Math.PI / 2);
        });

        it('should always return a non-negative angle', function ()
        {
            var v = new Vector2(1, -1);
            expect(v.angle()).toBeGreaterThanOrEqual(0);
        });
    });

    describe('setAngle', function ()
    {
        it('should set the angle while preserving length', function ()
        {
            var v = new Vector2(2, 0);
            v.setAngle(Math.PI / 2);
            expect(v.x).toBeCloseTo(0);
            expect(v.y).toBeCloseTo(2);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(1, 0);
            var result = v.setAngle(0);
            expect(result).toBe(v);
        });
    });

    describe('add', function ()
    {
        it('should add components from the source vector', function ()
        {
            var v = new Vector2(1, 2);
            v.add({ x: 3, y: 4 });
            expect(v.x).toBe(4);
            expect(v.y).toBe(6);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(1, 2);
            var result = v.add({ x: 1, y: 1 });
            expect(result).toBe(v);
        });

        it('should handle negative values', function ()
        {
            var v = new Vector2(5, 5);
            v.add({ x: -3, y: -2 });
            expect(v.x).toBe(2);
            expect(v.y).toBe(3);
        });
    });

    describe('subtract', function ()
    {
        it('should subtract components of the source vector', function ()
        {
            var v = new Vector2(5, 6);
            v.subtract({ x: 2, y: 3 });
            expect(v.x).toBe(3);
            expect(v.y).toBe(3);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(5, 6);
            var result = v.subtract({ x: 1, y: 1 });
            expect(result).toBe(v);
        });

        it('should handle subtraction resulting in negatives', function ()
        {
            var v = new Vector2(1, 1);
            v.subtract({ x: 5, y: 5 });
            expect(v.x).toBe(-4);
            expect(v.y).toBe(-4);
        });
    });

    describe('multiply', function ()
    {
        it('should multiply components component-wise', function ()
        {
            var v = new Vector2(2, 3);
            v.multiply({ x: 4, y: 5 });
            expect(v.x).toBe(8);
            expect(v.y).toBe(15);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(2, 3);
            var result = v.multiply({ x: 1, y: 1 });
            expect(result).toBe(v);
        });

        it('should handle multiplication by zero', function ()
        {
            var v = new Vector2(5, 5);
            v.multiply({ x: 0, y: 0 });
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
        });
    });

    describe('scale', function ()
    {
        it('should scale both components by the given value', function ()
        {
            var v = new Vector2(3, 4);
            v.scale(2);
            expect(v.x).toBe(6);
            expect(v.y).toBe(8);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(3, 4);
            var result = v.scale(2);
            expect(result).toBe(v);
        });

        it('should set components to zero for non-finite values', function ()
        {
            var v = new Vector2(3, 4);
            v.scale(Infinity);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
        });

        it('should set components to zero for NaN', function ()
        {
            var v = new Vector2(3, 4);
            v.scale(NaN);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
        });

        it('should handle scale by zero', function ()
        {
            var v = new Vector2(3, 4);
            v.scale(0);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
        });

        it('should handle negative scale', function ()
        {
            var v = new Vector2(3, 4);
            v.scale(-1);
            expect(v.x).toBe(-3);
            expect(v.y).toBe(-4);
        });
    });

    describe('divide', function ()
    {
        it('should divide components component-wise', function ()
        {
            var v = new Vector2(10, 12);
            v.divide({ x: 2, y: 3 });
            expect(v.x).toBe(5);
            expect(v.y).toBe(4);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(10, 12);
            var result = v.divide({ x: 2, y: 3 });
            expect(result).toBe(v);
        });

        it('should handle floating point division', function ()
        {
            var v = new Vector2(1, 1);
            v.divide({ x: 4, y: 4 });
            expect(v.x).toBeCloseTo(0.25);
            expect(v.y).toBeCloseTo(0.25);
        });
    });

    describe('negate', function ()
    {
        it('should negate both components', function ()
        {
            var v = new Vector2(3, 4);
            v.negate();
            expect(v.x).toBe(-3);
            expect(v.y).toBe(-4);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(3, 4);
            var result = v.negate();
            expect(result).toBe(v);
        });

        it('should negate negative values to positive', function ()
        {
            var v = new Vector2(-3, -4);
            v.negate();
            expect(v.x).toBe(3);
            expect(v.y).toBe(4);
        });

        it('should return zero vector when negating zero vector', function ()
        {
            var v = new Vector2(0, 0);
            v.negate();
            expect(v.x).toBeCloseTo(0);
            expect(v.y).toBeCloseTo(0);
        });
    });

    describe('distance', function ()
    {
        it('should return the distance between two vectors', function ()
        {
            var v = new Vector2(0, 0);
            expect(v.distance({ x: 3, y: 4 })).toBe(5);
        });

        it('should return zero for the same point', function ()
        {
            var v = new Vector2(3, 4);
            expect(v.distance({ x: 3, y: 4 })).toBe(0);
        });

        it('should work with non-origin vectors', function ()
        {
            var v = new Vector2(1, 1);
            expect(v.distance({ x: 4, y: 5 })).toBe(5);
        });

        it('should be symmetric', function ()
        {
            var a = new Vector2(1, 2);
            var b = new Vector2(4, 6);
            expect(a.distance(b)).toBeCloseTo(b.distance(a));
        });
    });

    describe('distanceSq', function ()
    {
        it('should return the squared distance between two vectors', function ()
        {
            var v = new Vector2(0, 0);
            expect(v.distanceSq({ x: 3, y: 4 })).toBe(25);
        });

        it('should return zero for the same point', function ()
        {
            var v = new Vector2(5, 5);
            expect(v.distanceSq({ x: 5, y: 5 })).toBe(0);
        });
    });

    describe('length', function ()
    {
        it('should return the length of the vector', function ()
        {
            var v = new Vector2(3, 4);
            expect(v.length()).toBe(5);
        });

        it('should return zero for a zero vector', function ()
        {
            var v = new Vector2(0, 0);
            expect(v.length()).toBe(0);
        });

        it('should return the absolute length for negative components', function ()
        {
            var v = new Vector2(-3, -4);
            expect(v.length()).toBe(5);
        });
    });

    describe('setLength', function ()
    {
        it('should set the length of the vector', function ()
        {
            var v = new Vector2(3, 4);
            v.setLength(10);
            expect(v.length()).toBeCloseTo(10);
        });

        it('should preserve direction', function ()
        {
            var v = new Vector2(1, 0);
            v.setLength(5);
            expect(v.x).toBeCloseTo(5);
            expect(v.y).toBeCloseTo(0);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(1, 0);
            var result = v.setLength(5);
            expect(result).toBe(v);
        });
    });

    describe('lengthSq', function ()
    {
        it('should return the squared length of the vector', function ()
        {
            var v = new Vector2(3, 4);
            expect(v.lengthSq()).toBe(25);
        });

        it('should return zero for a zero vector', function ()
        {
            var v = new Vector2(0, 0);
            expect(v.lengthSq()).toBe(0);
        });

        it('should return a positive value for negative components', function ()
        {
            var v = new Vector2(-3, -4);
            expect(v.lengthSq()).toBe(25);
        });
    });

    describe('normalize', function ()
    {
        it('should produce a unit length vector', function ()
        {
            var v = new Vector2(3, 4);
            v.normalize();
            expect(v.length()).toBeCloseTo(1);
        });

        it('should preserve direction', function ()
        {
            var v = new Vector2(5, 0);
            v.normalize();
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(0);
        });

        it('should not change a zero vector', function ()
        {
            var v = new Vector2(0, 0);
            v.normalize();
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(3, 4);
            var result = v.normalize();
            expect(result).toBe(v);
        });
    });

    describe('normalizeRightHand', function ()
    {
        it('should rotate the vector 90 degrees counterclockwise', function ()
        {
            var v = new Vector2(1, 0);
            v.normalizeRightHand();
            expect(v.x).toBeCloseTo(0);
            expect(v.y).toBeCloseTo(1);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(1, 0);
            var result = v.normalizeRightHand();
            expect(result).toBe(v);
        });

        it('should swap and negate x to get perpendicular', function ()
        {
            var v = new Vector2(3, 4);
            v.normalizeRightHand();
            expect(v.x).toBe(-4);
            expect(v.y).toBe(3);
        });
    });

    describe('normalizeLeftHand', function ()
    {
        it('should rotate the vector 90 degrees clockwise', function ()
        {
            var v = new Vector2(1, 0);
            v.normalizeLeftHand();
            expect(v.x).toBeCloseTo(0);
            expect(v.y).toBeCloseTo(-1);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(1, 0);
            var result = v.normalizeLeftHand();
            expect(result).toBe(v);
        });

        it('should swap and negate y to get perpendicular', function ()
        {
            var v = new Vector2(3, 4);
            v.normalizeLeftHand();
            expect(v.x).toBe(4);
            expect(v.y).toBe(-3);
        });
    });

    describe('dot', function ()
    {
        it('should return the dot product of two vectors', function ()
        {
            var v = new Vector2(2, 3);
            expect(v.dot({ x: 4, y: 5 })).toBe(23);
        });

        it('should return zero for perpendicular vectors', function ()
        {
            var v = new Vector2(1, 0);
            expect(v.dot({ x: 0, y: 1 })).toBe(0);
        });

        it('should return the length squared for a vector dotted with itself', function ()
        {
            var v = new Vector2(3, 4);
            expect(v.dot({ x: 3, y: 4 })).toBe(25);
        });
    });

    describe('cross', function ()
    {
        it('should return the cross product of two vectors', function ()
        {
            var v = new Vector2(2, 3);
            expect(v.cross({ x: 4, y: 5 })).toBe(-2);
        });

        it('should return zero for parallel vectors', function ()
        {
            var v = new Vector2(1, 0);
            expect(v.cross({ x: 2, y: 0 })).toBe(0);
        });

        it('should return a positive value for counterclockwise turn', function ()
        {
            var v = new Vector2(1, 0);
            expect(v.cross({ x: 0, y: 1 })).toBeGreaterThan(0);
        });
    });

    describe('lerp', function ()
    {
        it('should return this vector when t is 0', function ()
        {
            var v = new Vector2(0, 0);
            v.lerp({ x: 10, y: 10 }, 0);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
        });

        it('should return the target vector when t is 1', function ()
        {
            var v = new Vector2(0, 0);
            v.lerp({ x: 10, y: 10 }, 1);
            expect(v.x).toBe(10);
            expect(v.y).toBe(10);
        });

        it('should interpolate halfway when t is 0.5', function ()
        {
            var v = new Vector2(0, 0);
            v.lerp({ x: 10, y: 10 }, 0.5);
            expect(v.x).toBe(5);
            expect(v.y).toBe(5);
        });

        it('should default t to 0 when not provided', function ()
        {
            var v = new Vector2(5, 5);
            v.lerp({ x: 10, y: 10 });
            expect(v.x).toBe(5);
            expect(v.y).toBe(5);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(0, 0);
            var result = v.lerp({ x: 1, y: 1 }, 0.5);
            expect(result).toBe(v);
        });
    });

    describe('transformMat3', function ()
    {
        it('should transform the vector with an identity matrix', function ()
        {
            var v = new Vector2(2, 3);
            var mat = {
                val: [
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1
                ]
            };
            v.transformMat3(mat);
            expect(v.x).toBeCloseTo(2);
            expect(v.y).toBeCloseTo(3);
        });

        it('should apply translation from a matrix', function ()
        {
            var v = new Vector2(1, 1);
            var mat = {
                val: [
                    1, 0, 0,
                    0, 1, 0,
                    5, 7, 1
                ]
            };
            v.transformMat3(mat);
            expect(v.x).toBeCloseTo(6);
            expect(v.y).toBeCloseTo(8);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(1, 1);
            var mat = { val: [1, 0, 0, 0, 1, 0, 0, 0, 1] };
            var result = v.transformMat3(mat);
            expect(result).toBe(v);
        });
    });

    describe('transformMat4', function ()
    {
        it('should transform the vector with an identity matrix', function ()
        {
            var v = new Vector2(2, 3);
            var mat = {
                val: [
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ]
            };
            v.transformMat4(mat);
            expect(v.x).toBeCloseTo(2);
            expect(v.y).toBeCloseTo(3);
        });

        it('should apply translation from a matrix', function ()
        {
            var v = new Vector2(1, 1);
            var mat = {
                val: [
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    5, 7, 0, 1
                ]
            };
            v.transformMat4(mat);
            expect(v.x).toBeCloseTo(6);
            expect(v.y).toBeCloseTo(8);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(1, 1);
            var mat = { val: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] };
            var result = v.transformMat4(mat);
            expect(result).toBe(v);
        });
    });

    describe('reset', function ()
    {
        it('should set both components to zero', function ()
        {
            var v = new Vector2(5, 10);
            v.reset();
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(5, 10);
            var result = v.reset();
            expect(result).toBe(v);
        });
    });

    describe('limit', function ()
    {
        it('should not change a vector shorter than the max', function ()
        {
            var v = new Vector2(3, 4);
            v.limit(10);
            expect(v.length()).toBeCloseTo(5);
        });

        it('should clamp a vector longer than the max to the max length', function ()
        {
            var v = new Vector2(3, 4);
            v.limit(2);
            expect(v.length()).toBeCloseTo(2);
        });

        it('should preserve direction when limiting', function ()
        {
            var v = new Vector2(3, 0);
            v.limit(1);
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(0);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(3, 4);
            var result = v.limit(10);
            expect(result).toBe(v);
        });

        it('should not change a zero vector', function ()
        {
            var v = new Vector2(0, 0);
            v.limit(5);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
        });
    });

    describe('reflect', function ()
    {
        it('should reflect across a horizontal normal (vertical surface)', function ()
        {
            var v = new Vector2(1, -1);
            var normal = new Vector2(0, 1);
            v.reflect(normal);
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(1);
        });

        it('should reflect across a vertical normal (horizontal surface)', function ()
        {
            var v = new Vector2(1, 1);
            var normal = new Vector2(1, 0);
            v.reflect(normal);
            expect(v.x).toBeCloseTo(-1);
            expect(v.y).toBeCloseTo(1);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(1, -1);
            var normal = new Vector2(0, 1);
            var result = v.reflect(normal);
            expect(result).toBe(v);
        });
    });

    describe('mirror', function ()
    {
        it('should mirror across an axis', function ()
        {
            var v = new Vector2(1, -1);
            var axis = new Vector2(0, 1);
            v.mirror(axis);
            expect(v.x).toBeCloseTo(-1);
            expect(v.y).toBeCloseTo(-1);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(1, -1);
            var axis = new Vector2(0, 1);
            var result = v.mirror(axis);
            expect(result).toBe(v);
        });
    });

    describe('rotate', function ()
    {
        it('should rotate a vector by 90 degrees', function ()
        {
            var v = new Vector2(1, 0);
            v.rotate(Math.PI / 2);
            expect(v.x).toBeCloseTo(0);
            expect(v.y).toBeCloseTo(1);
        });

        it('should rotate a vector by 180 degrees', function ()
        {
            var v = new Vector2(1, 0);
            v.rotate(Math.PI);
            expect(v.x).toBeCloseTo(-1);
            expect(v.y).toBeCloseTo(0);
        });

        it('should not change the length of the vector', function ()
        {
            var v = new Vector2(3, 4);
            var len = v.length();
            v.rotate(1.234);
            expect(v.length()).toBeCloseTo(len);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(1, 0);
            var result = v.rotate(0);
            expect(result).toBe(v);
        });

        it('should not change the vector when rotated by zero', function ()
        {
            var v = new Vector2(3, 4);
            v.rotate(0);
            expect(v.x).toBeCloseTo(3);
            expect(v.y).toBeCloseTo(4);
        });
    });

    describe('project', function ()
    {
        it('should project this vector onto another', function ()
        {
            var v = new Vector2(3, 4);
            var onto = new Vector2(1, 0);
            v.project(onto);
            expect(v.x).toBeCloseTo(3);
            expect(v.y).toBeCloseTo(0);
        });

        it('should return the zero vector when projection is orthogonal', function ()
        {
            var v = new Vector2(0, 5);
            var onto = new Vector2(1, 0);
            v.project(onto);
            expect(v.x).toBeCloseTo(0);
            expect(v.y).toBeCloseTo(0);
        });

        it('should return this vector', function ()
        {
            var v = new Vector2(3, 4);
            var onto = new Vector2(1, 0);
            var result = v.project(onto);
            expect(result).toBe(v);
        });
    });

    describe('projectUnit', function ()
    {
        it('should project this vector onto a unit vector', function ()
        {
            var v = new Vector2(3, 4);
            var onto = new Vector2(1, 0);
            var result = v.projectUnit(onto);
            expect(result.x).toBeCloseTo(3);
            expect(result.y).toBeCloseTo(0);
        });

        it('should create a new Vector2 when no out is given', function ()
        {
            var v = new Vector2(3, 4);
            var onto = new Vector2(1, 0);
            var result = v.projectUnit(onto);
            expect(result).not.toBe(v);
            expect(result).not.toBe(onto);
        });

        it('should write into the provided out vector', function ()
        {
            var v = new Vector2(3, 4);
            var onto = new Vector2(1, 0);
            var out = new Vector2();
            var result = v.projectUnit(onto, out);
            expect(result).toBe(out);
        });

        it('should return a zero vector when projection is orthogonal', function ()
        {
            var v = new Vector2(0, 5);
            var onto = new Vector2(1, 0);
            var result = v.projectUnit(onto);
            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
        });

        it('should not modify this vector', function ()
        {
            var v = new Vector2(3, 4);
            var onto = new Vector2(1, 0);
            v.projectUnit(onto);
            expect(v.x).toBe(3);
            expect(v.y).toBe(4);
        });
    });
});
