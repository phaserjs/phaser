var GetValueOp = require('../../../src/tweens/builders/GetValueOp');

describe('Phaser.Tweens.Builders.GetValueOp', function ()
{
    var target = { x: 100, y: 200 };

    describe('return value structure', function ()
    {
        it('should return an object with getActive, getEnd, and getStart functions', function ()
        {
            var result = GetValueOp('x', 400);

            expect(typeof result).toBe('object');
            expect(typeof result.getEnd).toBe('function');
            expect(typeof result.getStart).toBe('function');
        });

        it('should return getActive as null by default for number value', function ()
        {
            var result = GetValueOp('x', 400);

            expect(result.getActive).toBeNull();
        });
    });

    describe('number value', function ()
    {
        it('should return the number as the end value', function ()
        {
            var result = GetValueOp('x', 400);

            expect(result.getEnd(target, 'x', 100)).toBe(400);
        });

        it('should return the current value unchanged for getStart', function ()
        {
            var result = GetValueOp('x', 400);

            expect(result.getStart(target, 'x', 100)).toBe(100);
        });

        it('should work with zero', function ()
        {
            var result = GetValueOp('x', 0);

            expect(result.getEnd(target, 'x', 100)).toBe(0);
        });

        it('should work with negative numbers', function ()
        {
            var result = GetValueOp('x', -50);

            expect(result.getEnd(target, 'x', 100)).toBe(-50);
        });

        it('should work with floating point numbers', function ()
        {
            var result = GetValueOp('x', 3.14);

            expect(result.getEnd(target, 'x', 100)).toBeCloseTo(3.14);
        });
    });

    describe('array value', function ()
    {
        it('should return the first element as the start value', function ()
        {
            var result = GetValueOp('x', [100, 200, 300]);

            expect(result.getStart()).toBe(100);
        });

        it('should return the last element as the end value', function ()
        {
            var result = GetValueOp('x', [100, 200, 300]);

            expect(result.getEnd()).toBe(300);
        });

        it('should work with a two-element array', function ()
        {
            var result = GetValueOp('x', [50, 150]);

            expect(result.getStart()).toBe(50);
            expect(result.getEnd()).toBe(150);
        });

        it('should work with a single-element array', function ()
        {
            var result = GetValueOp('x', [42]);

            expect(result.getStart()).toBe(42);
            expect(result.getEnd()).toBe(42);
        });

        it('should return null for getActive', function ()
        {
            var result = GetValueOp('x', [100, 200]);

            expect(result.getActive).toBeNull();
        });
    });

    describe('string value - relative operators', function ()
    {
        it('should add to the current value with += operator', function ()
        {
            var result = GetValueOp('x', '+=100');

            expect(result.getEnd(target, 'x', 200)).toBe(300);
        });

        it('should subtract from the current value with -= operator', function ()
        {
            var result = GetValueOp('x', '-=50');

            expect(result.getEnd(target, 'x', 200)).toBe(150);
        });

        it('should multiply the current value with *= operator', function ()
        {
            var result = GetValueOp('x', '*=3');

            expect(result.getEnd(target, 'x', 100)).toBe(300);
        });

        it('should divide the current value with /= operator', function ()
        {
            var result = GetValueOp('x', '/=4');

            expect(result.getEnd(target, 'x', 200)).toBe(50);
        });

        it('should use parseFloat for unknown string operator (default case)', function ()
        {
            var result = GetValueOp('x', '500');

            expect(result.getEnd(target, 'x', 100)).toBe(500);
        });

        it('should return the current value unchanged for getStart with += string', function ()
        {
            var result = GetValueOp('x', '+=100');

            expect(result.getStart(target, 'x', 99)).toBe(99);
        });

        it('should work with floating point operand in +=', function ()
        {
            var result = GetValueOp('x', '+=1.5');

            expect(result.getEnd(target, 'x', 10)).toBeCloseTo(11.5);
        });

        it('should work with floating point operand in -=', function ()
        {
            var result = GetValueOp('x', '-=0.5');

            expect(result.getEnd(target, 'x', 10)).toBeCloseTo(9.5);
        });

        it('should return null for getActive with string operator', function ()
        {
            var result = GetValueOp('x', '+=100');

            expect(result.getActive).toBeNull();
        });
    });

    describe('string value - random()', function ()
    {
        it('should return a float between the two values for random()', function ()
        {
            var result = GetValueOp('x', 'random(10, 100)');

            var iterations = 50;
            for (var i = 0; i < iterations; i++)
            {
                var val = result.getEnd();
                expect(val).toBeGreaterThanOrEqual(10);
                expect(val).toBeLessThanOrEqual(100);
            }
        });

        it('should return a float (not necessarily integer) for random()', function ()
        {
            var result = GetValueOp('x', 'random(0.5, 3.45)');
            var hasFloat = false;

            for (var i = 0; i < 100; i++)
            {
                var val = result.getEnd();
                if (val !== Math.floor(val))
                {
                    hasFloat = true;
                    break;
                }
            }

            expect(hasFloat).toBe(true);
        });
    });

    describe('string value - int()', function ()
    {
        it('should return an integer between the two values for int()', function ()
        {
            var result = GetValueOp('x', 'int(10, 100)');

            var iterations = 50;
            for (var i = 0; i < iterations; i++)
            {
                var val = result.getEnd();
                expect(val).toBeGreaterThanOrEqual(10);
                expect(val).toBeLessThanOrEqual(100);
                expect(Number.isInteger(val)).toBe(true);
            }
        });
    });

    describe('function value', function ()
    {
        it('should use the function as getEnd', function ()
        {
            var fn = function (target, key, value) { return value + 50; };
            var result = GetValueOp('x', fn);

            expect(result.getEnd(target, 'x', 100)).toBe(150);
        });

        it('should return the current value unchanged for getStart', function ()
        {
            var fn = function (target, key, value) { return value + 50; };
            var result = GetValueOp('x', fn);

            expect(result.getStart(target, 'x', 100)).toBe(100);
        });

        it('should return null for getActive', function ()
        {
            var fn = function (target, key, value) { return value * 2; };
            var result = GetValueOp('x', fn);

            expect(result.getActive).toBeNull();
        });

        it('should pass target, key, and value to the function', function ()
        {
            var receivedArgs = [];
            var fn = function (target, key, value)
            {
                receivedArgs = [target, key, value];
                return value;
            };
            var result = GetValueOp('x', fn);

            result.getEnd(target, 'x', 100);

            expect(receivedArgs[0]).toBe(target);
            expect(receivedArgs[1]).toBe('x');
            expect(receivedArgs[2]).toBe(100);
        });
    });

    describe('object value - with getters', function ()
    {
        it('should use getEnd from the object if provided', function ()
        {
            var def = {
                getEnd: function (target, key, value) { return value + 200; }
            };
            var result = GetValueOp('x', def);

            expect(result.getEnd(target, 'x', 100)).toBe(300);
        });

        it('should use getStart from the object if provided', function ()
        {
            var def = {
                getStart: function (target, key, value) { return value - 50; }
            };
            var result = GetValueOp('x', def);

            expect(result.getStart(target, 'x', 100)).toBe(50);
        });

        it('should use getActive from the object if provided', function ()
        {
            var def = {
                getActive: function (target, key, value) { return 999; }
            };
            var result = GetValueOp('x', def);

            expect(result.getActive(target, 'x', 100)).toBe(999);
        });

        it('should use all three getters when all are provided', function ()
        {
            var def = {
                getActive: function () { return 1; },
                getEnd: function () { return 2; },
                getStart: function () { return 3; }
            };
            var result = GetValueOp('x', def);

            expect(result.getActive()).toBe(1);
            expect(result.getEnd()).toBe(2);
            expect(result.getStart()).toBe(3);
        });

        it('should keep default getStart when only getEnd is provided', function ()
        {
            var def = {
                getEnd: function () { return 500; }
            };
            var result = GetValueOp('x', def);

            expect(result.getStart(target, 'x', 77)).toBe(77);
        });
    });

    describe('object value - with value property', function ()
    {
        it('should delegate to GetValueOp with the value property (number)', function ()
        {
            var result = GetValueOp('x', { value: 400 });

            expect(result.getEnd(target, 'x', 100)).toBe(400);
        });

        it('should delegate to GetValueOp with the value property (string)', function ()
        {
            var result = GetValueOp('x', { value: '+=50' });

            expect(result.getEnd(target, 'x', 100)).toBe(150);
        });

        it('should delegate to GetValueOp with the value property (function)', function ()
        {
            var result = GetValueOp('x', { value: function (t, k, v) { return v * 3; } });

            expect(result.getEnd(target, 'x', 10)).toBe(30);
        });
    });

    describe('object value - from/to/start', function ()
    {
        it('should set getEnd from to and getStart from from', function ()
        {
            var result = GetValueOp('x', { from: 100, to: 500 });

            expect(result.getEnd(target, 'x', 0)).toBe(500);
            expect(result.getStart(target, 'x', 0)).toBe(100);
        });

        it('should set getActive from start when start and to are provided', function ()
        {
            var result = GetValueOp('x', { start: 200, to: 600 });

            expect(result.getActive(target, 'x', 0)).toBe(200);
            expect(result.getEnd(target, 'x', 0)).toBe(600);
        });

        it('should set getActive from start, getStart from from, getEnd from to', function ()
        {
            var result = GetValueOp('x', { start: 100, from: 300, to: 600 });

            expect(result.getActive(target, 'x', 0)).toBe(100);
            expect(result.getStart(target, 'x', 0)).toBe(300);
            expect(result.getEnd(target, 'x', 0)).toBe(600);
        });

        it('should not use from/to when only from is provided (no to)', function ()
        {
            // Without 'to', getEnd falls back to default (pass-through)
            var result = GetValueOp('x', { from: 100 });

            expect(result.getEnd(target, 'x', 77)).toBe(77);
        });

        it('should not use from/to when only to is provided (no from or start)', function ()
        {
            // Without 'from' or 'start', the object has no getters and no value property
            var result = GetValueOp('x', { to: 500 });

            // Falls through to default pass-through callbacks
            expect(result.getEnd(target, 'x', 77)).toBe(77);
        });

        it('should support string values in from and to', function ()
        {
            var result = GetValueOp('x', { from: '+=10', to: '+=100' });

            expect(result.getEnd(target, 'x', 50)).toBe(150);
            expect(result.getStart(target, 'x', 50)).toBe(60);
        });
    });

    describe('edge cases', function ()
    {
        it('should handle undefined propertyValue by returning pass-through callbacks', function ()
        {
            var result = GetValueOp('x', undefined);

            expect(result.getEnd(target, 'x', 50)).toBe(50);
            expect(result.getStart(target, 'x', 50)).toBe(50);
        });

        it('should throw when null is passed (null is typeof object with no getters)', function ()
        {
            expect(function () { GetValueOp('x', null); }).toThrow();
        });
    });
});
