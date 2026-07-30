var EmitterOp = require('../../../src/gameobjects/particles/EmitterOp');

describe('EmitterOp', function ()
{
    describe('Constructor', function ()
    {
        it('should create an EmitterOp with default values', function ()
        {
            var op = new EmitterOp('x', 0);

            expect(op.propertyKey).toBe('x');
            expect(op.propertyValue).toBe(0);
            expect(op.defaultValue).toBe(0);
            expect(op.steps).toBe(0);
            expect(op.counter).toBe(0);
            expect(op.yoyo).toBe(false);
            expect(op.direction).toBe(0);
            expect(op.start).toBe(0);
            expect(op.current).toBe(0);
            expect(op.end).toBe(0);
            expect(op.ease).toBeNull();
            expect(op.interpolation).toBeNull();
            expect(op.emitOnly).toBe(false);
            expect(op.active).toBe(true);
            expect(op.method).toBe(0);
        });

        it('should set emitOnly to true when passed', function ()
        {
            var op = new EmitterOp('x', 0, true);

            expect(op.emitOnly).toBe(true);
        });

        it('should default emitOnly to false when not passed', function ()
        {
            var op = new EmitterOp('x', 0);

            expect(op.emitOnly).toBe(false);
        });

        it('should set onEmit to defaultEmit by default', function ()
        {
            var op = new EmitterOp('x', 5);

            expect(op.onEmit).toBe(op.defaultEmit);
        });

        it('should set onUpdate to defaultUpdate by default', function ()
        {
            var op = new EmitterOp('x', 5);

            expect(op.onUpdate).toBe(op.defaultUpdate);
        });

        it('should accept a string as the default value', function ()
        {
            var op = new EmitterOp('key', 'hello');

            expect(op.propertyValue).toBe('hello');
            expect(op.defaultValue).toBe('hello');
        });

        it('should accept null as the default value', function ()
        {
            var op = new EmitterOp('moveToX', null);

            expect(op.propertyValue).toBeNull();
            expect(op.defaultValue).toBeNull();
        });
    });

    describe('has', function ()
    {
        it('should return true when the object has the property', function ()
        {
            var op = new EmitterOp('x', 0);
            var obj = { foo: 1 };

            expect(op.has(obj, 'foo')).toBe(true);
        });

        it('should return false when the object does not have the property', function ()
        {
            var op = new EmitterOp('x', 0);
            var obj = { foo: 1 };

            expect(op.has(obj, 'bar')).toBe(false);
        });

        it('should return false for inherited properties', function ()
        {
            var op = new EmitterOp('x', 0);
            var parent = { inherited: true };
            var child = Object.create(parent);

            expect(op.has(child, 'inherited')).toBe(false);
        });

        it('should return true for a property with a falsy value', function ()
        {
            var op = new EmitterOp('x', 0);
            var obj = { count: 0, flag: false, name: '' };

            expect(op.has(obj, 'count')).toBe(true);
            expect(op.has(obj, 'flag')).toBe(true);
            expect(op.has(obj, 'name')).toBe(true);
        });
    });

    describe('hasBoth', function ()
    {
        it('should return true when both properties exist', function ()
        {
            var op = new EmitterOp('x', 0);
            var obj = { start: 0, end: 10 };

            expect(op.hasBoth(obj, 'start', 'end')).toBe(true);
        });

        it('should return false when only the first property exists', function ()
        {
            var op = new EmitterOp('x', 0);
            var obj = { start: 0 };

            expect(op.hasBoth(obj, 'start', 'end')).toBe(false);
        });

        it('should return false when only the second property exists', function ()
        {
            var op = new EmitterOp('x', 0);
            var obj = { end: 10 };

            expect(op.hasBoth(obj, 'start', 'end')).toBe(false);
        });

        it('should return false when neither property exists', function ()
        {
            var op = new EmitterOp('x', 0);
            var obj = {};

            expect(op.hasBoth(obj, 'start', 'end')).toBe(false);
        });
    });

    describe('hasEither', function ()
    {
        it('should return true when both properties exist', function ()
        {
            var op = new EmitterOp('x', 0);
            var obj = { onEmit: function () {}, onUpdate: function () {} };

            expect(op.hasEither(obj, 'onEmit', 'onUpdate')).toBe(true);
        });

        it('should return true when only the first property exists', function ()
        {
            var op = new EmitterOp('x', 0);
            var obj = { onEmit: function () {} };

            expect(op.hasEither(obj, 'onEmit', 'onUpdate')).toBe(true);
        });

        it('should return true when only the second property exists', function ()
        {
            var op = new EmitterOp('x', 0);
            var obj = { onUpdate: function () {} };

            expect(op.hasEither(obj, 'onEmit', 'onUpdate')).toBe(true);
        });

        it('should return false when neither property exists', function ()
        {
            var op = new EmitterOp('x', 0);
            var obj = {};

            expect(op.hasEither(obj, 'onEmit', 'onUpdate')).toBe(false);
        });
    });

    describe('defaultEmit', function ()
    {
        it('should return the default value', function ()
        {
            var op = new EmitterOp('x', 42);

            expect(op.defaultEmit()).toBe(42);
        });

        it('should return the default value even after propertyValue changes', function ()
        {
            var op = new EmitterOp('x', 10);
            op.propertyValue = 99;

            expect(op.defaultEmit()).toBe(10);
        });
    });

    describe('defaultUpdate', function ()
    {
        it('should return the passed-in value unchanged', function ()
        {
            var op = new EmitterOp('x', 0);
            var particle = {};

            expect(op.defaultUpdate(particle, 'x', 0.5, 123)).toBe(123);
        });

        it('should return zero when value is zero', function ()
        {
            var op = new EmitterOp('x', 0);

            expect(op.defaultUpdate({}, 'x', 0, 0)).toBe(0);
        });

        it('should return negative values unchanged', function ()
        {
            var op = new EmitterOp('x', 0);

            expect(op.defaultUpdate({}, 'x', 0.5, -50)).toBe(-50);
        });
    });

    describe('staticValueEmit', function ()
    {
        it('should return the current value', function ()
        {
            var op = new EmitterOp('x', 0);
            op.current = 99;

            expect(op.staticValueEmit()).toBe(99);
        });
    });

    describe('staticValueUpdate', function ()
    {
        it('should return the current value', function ()
        {
            var op = new EmitterOp('x', 0);
            op.current = 55;

            expect(op.staticValueUpdate()).toBe(55);
        });
    });

    describe('randomStaticValueEmit', function ()
    {
        it('should return a value from the property value array', function ()
        {
            var op = new EmitterOp('x', [ 10, 20, 30 ]);
            op.propertyValue = [ 10, 20, 30 ];

            var result = op.randomStaticValueEmit();

            expect([ 10, 20, 30 ]).toContain(result);
        });

        it('should update current to the returned value', function ()
        {
            var op = new EmitterOp('x', [ 5, 15 ]);
            op.propertyValue = [ 5, 15 ];

            var result = op.randomStaticValueEmit();

            expect(op.current).toBe(result);
        });

        it('should always return a value within the array over many calls', function ()
        {
            var op = new EmitterOp('x', [ 1, 2, 3, 4, 5 ]);
            op.propertyValue = [ 1, 2, 3, 4, 5 ];

            for (var i = 0; i < 50; i++)
            {
                var result = op.randomStaticValueEmit();
                expect([ 1, 2, 3, 4, 5 ]).toContain(result);
            }
        });

        it('should return the only value when array has one element', function ()
        {
            var op = new EmitterOp('x', [ 42 ]);
            op.propertyValue = [ 42 ];

            expect(op.randomStaticValueEmit()).toBe(42);
        });
    });

    describe('randomRangedValueEmit', function ()
    {
        it('should return a float between start and end', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 10;
            op.end = 20;

            var result = op.randomRangedValueEmit(null, 'x');

            expect(result).toBeGreaterThanOrEqual(10);
            expect(result).toBeLessThanOrEqual(20);
        });

        it('should update current to the returned value', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 0;
            op.end = 100;

            var result = op.randomRangedValueEmit(null, 'x');

            expect(op.current).toBe(result);
        });

        it('should update particle data when particle has data for the key', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 5;
            op.end = 15;

            var particle = { data: { x: { min: 0, max: 0 } } };
            var result = op.randomRangedValueEmit(particle, 'x');

            expect(particle.data.x.min).toBe(result);
            expect(particle.data.x.max).toBe(15);
        });

        it('should not throw when particle is null', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 0;
            op.end = 10;

            expect(function () { op.randomRangedValueEmit(null, 'x'); }).not.toThrow();
        });

        it('should stay within range over many iterations', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = -50;
            op.end = 50;

            for (var i = 0; i < 100; i++)
            {
                var result = op.randomRangedValueEmit(null, 'x');
                expect(result).toBeGreaterThanOrEqual(-50);
                expect(result).toBeLessThanOrEqual(50);
            }
        });
    });

    describe('randomRangedIntEmit', function ()
    {
        it('should return an integer between start and end inclusive', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 1;
            op.end = 10;

            var result = op.randomRangedIntEmit(null, 'x');

            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(10);
            expect(Number.isInteger(result)).toBe(true);
        });

        it('should update current to the returned value', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 0;
            op.end = 10;

            var result = op.randomRangedIntEmit(null, 'x');

            expect(op.current).toBe(result);
        });

        it('should update particle data when particle has data for the key', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 1;
            op.end = 5;

            var particle = { data: { x: { min: 0, max: 0 } } };
            var result = op.randomRangedIntEmit(particle, 'x');

            expect(particle.data.x.min).toBe(result);
            expect(particle.data.x.max).toBe(5);
        });

        it('should return exact value when start equals end', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 7;
            op.end = 7;

            expect(op.randomRangedIntEmit(null, 'x')).toBe(7);
        });

        it('should always return integers over many iterations', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 0;
            op.end = 100;

            for (var i = 0; i < 50; i++)
            {
                var result = op.randomRangedIntEmit(null, 'x');
                expect(Number.isInteger(result)).toBe(true);
            }
        });
    });

    describe('steppedEmit', function ()
    {
        it('should return the start value on first call', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 0;
            op.end = 10;
            op.steps = 5;
            op.counter = 0;
            op.yoyo = false;

            expect(op.steppedEmit()).toBe(0);
        });

        it('should advance by step each call without yoyo', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 0;
            op.end = 10;
            op.steps = 5;
            op.counter = 0;
            op.yoyo = false;

            op.steppedEmit(); // returns 0, counter -> 2
            var result = op.steppedEmit(); // returns 2, counter -> 4

            expect(result).toBe(2);
        });

        it('should wrap counter around when it exceeds end without yoyo', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 0;
            op.end = 10;
            op.steps = 2;
            op.counter = 0;
            op.yoyo = false;

            // step = (10-0)/2 = 5
            op.steppedEmit(); // returns 0, counter -> 5
            op.steppedEmit(); // returns 5, counter -> 10 -> wraps -> 0
            var result = op.steppedEmit(); // returns 0

            expect(result).toBe(0);
        });

        it('should update current to the returned value', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 0;
            op.end = 10;
            op.steps = 5;
            op.counter = 0;
            op.yoyo = false;

            var result = op.steppedEmit();

            expect(op.current).toBe(result);
        });

        it('should bounce direction with yoyo enabled going up', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 0;
            op.end = 10;
            op.steps = 2;
            op.counter = 0;
            op.yoyo = true;
            op.direction = 0;

            // step = 5
            op.steppedEmit(); // returns 0, next=5, counter=5, direction=0
            op.steppedEmit(); // returns 5, next=10, hits end, direction flips to 1

            expect(op.direction).toBe(1);
        });
    });

    describe('easedValueEmit', function ()
    {
        it('should return the start value', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 5;
            op.end = 20;

            var result = op.easedValueEmit(null, 'x');

            expect(result).toBe(5);
        });

        it('should update current to start', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 15;
            op.end = 30;

            op.easedValueEmit(null, 'x');

            expect(op.current).toBe(15);
        });

        it('should set particle data min and max when particle has data for key', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 10;
            op.end = 50;

            var particle = { data: { x: { min: 0, max: 0 } } };
            op.easedValueEmit(particle, 'x');

            expect(particle.data.x.min).toBe(10);
            expect(particle.data.x.max).toBe(50);
        });

        it('should not throw when particle is null', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 0;
            op.end = 10;

            expect(function () { op.easedValueEmit(null, 'x'); }).not.toThrow();
        });
    });

    describe('easeValueUpdate', function ()
    {
        it('should interpolate between data.min and data.max using the ease function', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = 0;
            op.end = 100;
            op.ease = function (t) { return t; }; // linear

            var particle = { data: { x: { min: 0, max: 100 } } };

            var result = op.easeValueUpdate(particle, 'x', 0.5);

            expect(result).toBeCloseTo(50);
        });

        it('should return min when t is 0', function ()
        {
            var op = new EmitterOp('x', 0);
            op.ease = function (t) { return t; };

            var particle = { data: { x: { min: 10, max: 90 } } };

            var result = op.easeValueUpdate(particle, 'x', 0);

            expect(result).toBeCloseTo(10);
        });

        it('should return max when t is 1', function ()
        {
            var op = new EmitterOp('x', 0);
            op.ease = function (t) { return t; };

            var particle = { data: { x: { min: 10, max: 90 } } };

            var result = op.easeValueUpdate(particle, 'x', 1);

            expect(result).toBeCloseTo(90);
        });

        it('should update current to the returned value', function ()
        {
            var op = new EmitterOp('x', 0);
            op.ease = function (t) { return t; };

            var particle = { data: { x: { min: 0, max: 100 } } };

            var result = op.easeValueUpdate(particle, 'x', 0.75);

            expect(op.current).toBeCloseTo(result);
        });

        it('should use interpolation function when set', function ()
        {
            var op = new EmitterOp('x', 0);
            op.start = [ 0, 50, 100 ];
            op.ease = function (t) { return t; };
            op.interpolation = function (values, t) { return t * 200; };

            var particle = { data: { x: { min: 0, max: 100 } } };

            var result = op.easeValueUpdate(particle, 'x', 0.5);

            expect(result).toBeCloseTo(100);
        });
    });

    describe('proxyEmit', function ()
    {
        it('should call _onEmit and return its result', function ()
        {
            var op = new EmitterOp('x', 0);
            op._onEmit = function (particle, key, value) { return 42; };

            var result = op.proxyEmit({}, 'x', 0);

            expect(result).toBe(42);
        });

        it('should update current to the returned value', function ()
        {
            var op = new EmitterOp('x', 0);
            op._onEmit = function (particle, key, value) { return 99; };

            op.proxyEmit({}, 'x', 0);

            expect(op.current).toBe(99);
        });

        it('should pass particle, key, and value to _onEmit', function ()
        {
            var op = new EmitterOp('x', 0);
            var received = {};

            op._onEmit = function (particle, key, value)
            {
                received.particle = particle;
                received.key = key;
                received.value = value;
                return 1;
            };

            var fakeParticle = { id: 1 };
            op.proxyEmit(fakeParticle, 'x', 5);

            expect(received.particle).toBe(fakeParticle);
            expect(received.key).toBe('x');
            expect(received.value).toBe(5);
        });
    });

    describe('proxyUpdate', function ()
    {
        it('should call _onUpdate and return its result', function ()
        {
            var op = new EmitterOp('x', 0);
            op._onUpdate = function (particle, key, t, value) { return 77; };

            var result = op.proxyUpdate({}, 'x', 0.5, 10);

            expect(result).toBe(77);
        });

        it('should update current to the returned value', function ()
        {
            var op = new EmitterOp('x', 0);
            op._onUpdate = function (particle, key, t, value) { return 33; };

            op.proxyUpdate({}, 'x', 0.5, 10);

            expect(op.current).toBe(33);
        });

        it('should pass particle, key, t, and value to _onUpdate', function ()
        {
            var op = new EmitterOp('x', 0);
            var received = {};

            op._onUpdate = function (particle, key, t, value)
            {
                received.particle = particle;
                received.key = key;
                received.t = t;
                received.value = value;
                return value;
            };

            var fakeParticle = { id: 2 };
            op.proxyUpdate(fakeParticle, 'x', 0.3, 50);

            expect(received.particle).toBe(fakeParticle);
            expect(received.key).toBe('x');
            expect(received.t).toBe(0.3);
            expect(received.value).toBe(50);
        });
    });

    describe('toJSON', function ()
    {
        it('should return a JSON string of the property value', function ()
        {
            var op = new EmitterOp('x', 42);

            expect(op.toJSON()).toBe('42');
        });

        it('should return a JSON string for an object value', function ()
        {
            var op = new EmitterOp('x', { start: 0, end: 10 });

            expect(op.toJSON()).toBe('{"start":0,"end":10}');
        });

        it('should return a JSON string for an array value', function ()
        {
            var op = new EmitterOp('x', [ 1, 2, 3 ]);

            expect(op.toJSON()).toBe('[1,2,3]');
        });
    });

    describe('getMethod', function ()
    {
        it('should return 0 for null', function ()
        {
            var op = new EmitterOp('x', null);

            expect(op.getMethod()).toBe(0);
        });

        it('should return 1 for a number', function ()
        {
            var op = new EmitterOp('x', 5);

            expect(op.getMethod()).toBe(1);
        });

        it('should return 2 for an array', function ()
        {
            var op = new EmitterOp('x', [ 1, 2, 3 ]);

            expect(op.getMethod()).toBe(2);
        });

        it('should return 3 for a function', function ()
        {
            var op = new EmitterOp('x', function () { return 1; });

            expect(op.getMethod()).toBe(3);
        });

        it('should return 4 for an object with start, end, and steps', function ()
        {
            var op = new EmitterOp('x', { start: 0, end: 10, steps: 5 });

            expect(op.getMethod()).toBe(4);
        });

        it('should return 5 for an object with start and end only', function ()
        {
            var op = new EmitterOp('x', { start: 0, end: 10 });

            expect(op.getMethod()).toBe(5);
        });

        it('should return 6 for an object with min and max', function ()
        {
            var op = new EmitterOp('x', { min: 0, max: 10 });

            expect(op.getMethod()).toBe(6);
        });

        it('should return 7 for an object with random property', function ()
        {
            var op = new EmitterOp('x', { random: [ 0, 10 ] });

            expect(op.getMethod()).toBe(7);
        });

        it('should return 8 for an object with onEmit callback', function ()
        {
            var op = new EmitterOp('x', { onEmit: function () { return 1; } });

            expect(op.getMethod()).toBe(8);
        });

        it('should return 8 for an object with onUpdate callback', function ()
        {
            var op = new EmitterOp('x', { onUpdate: function (p, k, t, v) { return v; } });

            expect(op.getMethod()).toBe(8);
        });

        it('should return 9 for an object with values property', function ()
        {
            var op = new EmitterOp('x', { values: [ 0, 50, 100 ] });

            expect(op.getMethod()).toBe(9);
        });

        it('should return 9 for an object with interpolation property', function ()
        {
            var op = new EmitterOp('x', { values: [ 0, 100 ], interpolation: 'linear' });

            expect(op.getMethod()).toBe(9);
        });

        it('should return 0 for an unrecognized object', function ()
        {
            var op = new EmitterOp('x', { foo: 'bar' });

            expect(op.getMethod()).toBe(0);
        });

        it('should return 0 for undefined', function ()
        {
            var op = new EmitterOp('x', undefined);

            expect(op.getMethod()).toBe(0);
        });
    });

    describe('setMethods', function ()
    {
        it('should set onEmit to staticValueEmit for method 1 (number)', function ()
        {
            var op = new EmitterOp('x', 10);
            op.method = 1;
            op.setMethods();

            expect(op.onEmit).toBe(op.staticValueEmit);
            expect(op.current).toBe(10);
        });

        it('should set onEmit to randomStaticValueEmit for method 2 (array)', function ()
        {
            var op = new EmitterOp('x', [ 1, 2, 3 ]);
            op.method = 2;
            op.setMethods();

            expect(op.onEmit).toBe(op.randomStaticValueEmit);
            expect(op.current).toBe(1);
        });

        it('should set onEmit to proxyEmit for method 3 (function)', function ()
        {
            var fn = function () { return 5; };
            var op = new EmitterOp('x', fn);
            op.method = 3;
            op.setMethods();

            expect(op.onEmit).toBe(op.proxyEmit);
            expect(op._onEmit).toBe(fn);
        });

        it('should set stepped properties for method 4', function ()
        {
            var op = new EmitterOp('x', { start: 0, end: 100, steps: 10 });
            op.method = 4;
            op.setMethods();

            expect(op.start).toBe(0);
            expect(op.end).toBe(100);
            expect(op.steps).toBe(10);
            expect(op.counter).toBe(0);
            expect(op.onEmit).toBe(op.steppedEmit);
        });

        it('should set yoyo on method 4 when provided', function ()
        {
            var op = new EmitterOp('x', { start: 0, end: 10, steps: 5, yoyo: true });
            op.method = 4;
            op.setMethods();

            expect(op.yoyo).toBe(true);
        });

        it('should set eased properties for method 5', function ()
        {
            var op = new EmitterOp('x', { start: 0, end: 100 });
            op.method = 5;
            op.setMethods();

            expect(op.start).toBe(0);
            expect(op.end).toBe(100);
            expect(op.ease).not.toBeNull();
            expect(op.onUpdate).toBe(op.easeValueUpdate);
        });

        it('should set randomRangedValueEmit for method 5 when random flag is set', function ()
        {
            var op = new EmitterOp('x', { start: 0, end: 100, random: true });
            op.method = 5;
            op.setMethods();

            expect(op.onEmit).toBe(op.randomRangedValueEmit);
        });

        it('should set easedValueEmit for method 5 without random flag', function ()
        {
            var op = new EmitterOp('x', { start: 0, end: 100 });
            op.method = 5;
            op.setMethods();

            expect(op.onEmit).toBe(op.easedValueEmit);
        });

        it('should set random float range for method 6 (min/max)', function ()
        {
            var op = new EmitterOp('x', { min: 5, max: 15 });
            op.method = 6;
            op.setMethods();

            expect(op.start).toBe(5);
            expect(op.end).toBe(15);
            expect(op.onEmit).toBe(op.randomRangedValueEmit);
        });

        it('should set randomRangedIntEmit for method 6 when int flag is set', function ()
        {
            var op = new EmitterOp('x', { min: 5, max: 15, int: true });
            op.method = 6;
            op.setMethods();

            expect(op.onEmit).toBe(op.randomRangedIntEmit);
        });

        it('should set random int range for method 7 (random object with array)', function ()
        {
            var op = new EmitterOp('x', { random: [ 0, 50 ] });
            op.method = 7;
            op.setMethods();

            expect(op.start).toBe(0);
            expect(op.end).toBe(50);
            expect(op.onEmit).toBe(op.randomRangedIntEmit);
        });

        it('should set proxy callbacks for method 8 (custom onEmit/onUpdate)', function ()
        {
            var emitFn = function (p, k, v) { return v + 1; };
            var updateFn = function (p, k, t, v) { return v; };
            var op = new EmitterOp('x', { onEmit: emitFn, onUpdate: updateFn });
            op.method = 8;
            op.setMethods();

            expect(op.onEmit).toBe(op.proxyEmit);
            expect(op.onUpdate).toBe(op.proxyUpdate);
            expect(op._onEmit).toBe(emitFn);
            expect(op._onUpdate).toBe(updateFn);
        });

        it('should set interpolation for method 9', function ()
        {
            var op = new EmitterOp('x', { values: [ 0, 50, 100 ] });
            op.method = 9;
            op.setMethods();

            expect(op.start).toEqual([ 0, 50, 100 ]);
            expect(op.ease).not.toBeNull();
            expect(op.onEmit).toBe(op.easedValueEmit);
            expect(op.onUpdate).toBe(op.easeValueUpdate);
        });

        it('should return this for chaining', function ()
        {
            var op = new EmitterOp('x', 5);
            op.method = 1;

            expect(op.setMethods()).toBe(op);
        });
    });

    describe('loadConfig', function ()
    {
        it('should load a numeric value from config', function ()
        {
            var op = new EmitterOp('x', 0);
            op.loadConfig({ x: 42 });

            expect(op.propertyValue).toBe(42);
            expect(op.method).toBe(1);
        });

        it('should use default value when key is not in config', function ()
        {
            var op = new EmitterOp('x', 10);
            op.loadConfig({});

            expect(op.propertyValue).toBe(10);
        });

        it('should use an empty config when none is provided', function ()
        {
            var op = new EmitterOp('x', 5);
            op.loadConfig();

            expect(op.propertyValue).toBe(5);
        });

        it('should update propertyKey when newKey is provided', function ()
        {
            var op = new EmitterOp('x', 0);
            op.loadConfig({ y: 99 }, 'y');

            expect(op.propertyKey).toBe('y');
            expect(op.propertyValue).toBe(99);
        });

        it('should reset onUpdate to defaultUpdate when emitOnly is true', function ()
        {
            var op = new EmitterOp('x', { start: 0, end: 10 }, true);
            op.loadConfig({ x: { start: 0, end: 10 } });

            expect(op.onUpdate).toBe(op.defaultUpdate);
        });

        it('should set onEmit to staticValueEmit for a number', function ()
        {
            var op = new EmitterOp('x', 0);
            op.loadConfig({ x: 50 });

            expect(op.onEmit).toBe(op.staticValueEmit);
        });

        it('should set method correctly for a range object', function ()
        {
            var op = new EmitterOp('x', 0);
            op.loadConfig({ x: { min: 5, max: 20 } });

            expect(op.method).toBe(6);
        });
    });

    describe('onChange', function ()
    {
        it('should update current for method 1 (number)', function ()
        {
            var op = new EmitterOp('x', 10);
            op.loadConfig({ x: 10 });
            op.onChange(99);

            expect(op.current).toBe(99);
        });

        it('should update current for method 3 (function)', function ()
        {
            var op = new EmitterOp('x', function () { return 1; });
            op.loadConfig({ x: function () { return 1; } });
            op.onChange(5);

            expect(op.current).toBe(5);
        });

        it('should update current for method 8 (custom callbacks)', function ()
        {
            var op = new EmitterOp('x', { onEmit: function () { return 1; } });
            op.loadConfig({ x: { onEmit: function () { return 1; } } });
            op.onChange(7);

            expect(op.current).toBe(7);
        });

        it('should update current when value is in the array for method 2', function ()
        {
            var op = new EmitterOp('x', [ 10, 20, 30 ]);
            op.loadConfig({ x: [ 10, 20, 30 ] });
            op.onChange(20);

            expect(op.current).toBe(20);
        });

        it('should not update current when value is not in the array for method 2', function ()
        {
            var op = new EmitterOp('x', [ 10, 20, 30 ]);
            op.loadConfig({ x: [ 10, 20, 30 ] });
            op.current = 10;
            op.onChange(99);

            expect(op.current).toBeUndefined();
        });

        it('should clamp value for method 5 (eased range)', function ()
        {
            var op = new EmitterOp('x', { start: 0, end: 10 });
            op.loadConfig({ x: { start: 0, end: 10 } });
            op.onChange(15);

            expect(op.current).toBe(10);
        });

        it('should clamp value for method 6 (min/max)', function ()
        {
            var op = new EmitterOp('x', { min: 5, max: 15 });
            op.loadConfig({ x: { min: 5, max: 15 } });
            op.onChange(0);

            expect(op.current).toBe(5);
        });

        it('should clamp value for method 7 (random object)', function ()
        {
            var op = new EmitterOp('x', { random: [ 0, 10 ] });
            op.loadConfig({ x: { random: [ 0, 10 ] } });
            op.onChange(-5);

            expect(op.current).toBe(0);
        });

        it('should set current to start[0] for method 9 (interpolation)', function ()
        {
            var op = new EmitterOp('x', { values: [ 5, 50, 100 ] });
            op.loadConfig({ x: { values: [ 5, 50, 100 ] } });
            op.onChange(99);

            expect(op.current).toBe(5);
        });

        it('should return this for chaining', function ()
        {
            var op = new EmitterOp('x', 5);
            op.loadConfig({ x: 5 });

            expect(op.onChange(5)).toBe(op);
        });
    });

    describe('destroy', function ()
    {
        it('should set propertyValue to null', function ()
        {
            var op = new EmitterOp('x', 10);
            op.destroy();

            expect(op.propertyValue).toBeNull();
        });

        it('should set defaultValue to null', function ()
        {
            var op = new EmitterOp('x', 10);
            op.destroy();

            expect(op.defaultValue).toBeNull();
        });

        it('should set ease to null', function ()
        {
            var op = new EmitterOp('x', { start: 0, end: 10 });
            op.loadConfig({ x: { start: 0, end: 10 } });
            op.destroy();

            expect(op.ease).toBeNull();
        });

        it('should set interpolation to null', function ()
        {
            var op = new EmitterOp('x', { values: [ 0, 100 ] });
            op.loadConfig({ x: { values: [ 0, 100 ] } });
            op.destroy();

            expect(op.interpolation).toBeNull();
        });

        it('should set _onEmit to null', function ()
        {
            var op = new EmitterOp('x', function () { return 1; });
            op.loadConfig({ x: function () { return 1; } });
            op.destroy();

            expect(op._onEmit).toBeNull();
        });

        it('should set _onUpdate to null', function ()
        {
            var op = new EmitterOp('x', { onEmit: function () { return 1; }, onUpdate: function () { return 1; } });
            op.loadConfig({ x: { onEmit: function () { return 1; }, onUpdate: function () { return 1; } } });
            op.destroy();

            expect(op._onUpdate).toBeNull();
        });
    });
});
