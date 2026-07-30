var RandomDataGenerator = require('../../../src/math/random-data-generator/RandomDataGenerator');

describe('RandomDataGenerator', function ()
{
    var rng;

    beforeEach(function ()
    {
        rng = new RandomDataGenerator([ 'test-seed' ]);
    });

    describe('constructor', function ()
    {
        it('should create an instance with a seed array', function ()
        {
            var gen = new RandomDataGenerator([ 'hello' ]);
            expect(gen).toBeDefined();
            expect(gen.signs).toEqual([ -1, 1 ]);
        });

        it('should create an instance with a string seed via state format', function ()
        {
            var state = rng.state();
            var gen = new RandomDataGenerator(state);
            expect(gen.state()).toBe(state);
        });

        it('should create an instance with no arguments', function ()
        {
            var gen = new RandomDataGenerator();
            expect(gen).toBeDefined();
        });

        it('should initialize signs array with -1 and 1', function ()
        {
            expect(rng.signs).toHaveLength(2);
            expect(rng.signs).toContain(-1);
            expect(rng.signs).toContain(1);
        });
    });

    describe('sow', function ()
    {
        it('should reset the generator to a deterministic state given the same seeds', function ()
        {
            var gen1 = new RandomDataGenerator();
            var gen2 = new RandomDataGenerator();

            gen1.sow([ 'alpha', 'beta' ]);
            gen2.sow([ 'alpha', 'beta' ]);

            expect(gen1.integer()).toBe(gen2.integer());
        });

        it('should produce different sequences for different seeds', function ()
        {
            var gen1 = new RandomDataGenerator();
            var gen2 = new RandomDataGenerator();

            gen1.sow([ 'seed-a' ]);
            gen2.sow([ 'seed-b' ]);

            expect(gen1.integer()).not.toBe(gen2.integer());
        });

        it('should stop processing seeds at the first null value', function ()
        {
            var gen1 = new RandomDataGenerator();
            var gen2 = new RandomDataGenerator();

            gen1.sow([ 'x', null, 'y' ]);
            gen2.sow([ 'x' ]);

            expect(gen1.integer()).toBe(gen2.integer());
        });

        it('should handle an empty seed array', function ()
        {
            var gen = new RandomDataGenerator();
            gen.sow([]);
            expect(gen.frac()).toBeGreaterThanOrEqual(0);
            expect(gen.frac()).toBeLessThan(1);
        });

        it('should handle a null/undefined seed argument gracefully', function ()
        {
            var gen = new RandomDataGenerator();
            gen.sow(null);
            expect(gen.frac()).toBeGreaterThanOrEqual(0);
        });
    });

    describe('init', function ()
    {
        it('should call sow when given an array', function ()
        {
            var gen1 = new RandomDataGenerator();
            var gen2 = new RandomDataGenerator();

            gen1.init([ 'my-seed' ]);
            gen2.sow([ 'my-seed' ]);

            expect(gen1.integer()).toBe(gen2.integer());
        });

        it('should call state when given a string matching state format', function ()
        {
            var savedState = rng.state();
            var gen = new RandomDataGenerator([ 'different' ]);
            gen.init(savedState);

            expect(gen.state()).toBe(savedState);
        });
    });

    describe('integer', function ()
    {
        it('should return a number', function ()
        {
            expect(typeof rng.integer()).toBe('number');
        });

        it('should return values between 0 and 2^32', function ()
        {
            for (var i = 0; i < 100; i++)
            {
                var val = rng.integer();
                expect(val).toBeGreaterThanOrEqual(0);
                expect(val).toBeLessThanOrEqual(0x100000000);
            }
        });

        it('should be deterministic given the same seed', function ()
        {
            var gen1 = new RandomDataGenerator([ 'det-seed' ]);
            var gen2 = new RandomDataGenerator([ 'det-seed' ]);

            expect(gen1.integer()).toBe(gen2.integer());
            expect(gen1.integer()).toBe(gen2.integer());
        });
    });

    describe('frac', function ()
    {
        it('should return a number between 0 (inclusive) and 1 (exclusive)', function ()
        {
            for (var i = 0; i < 200; i++)
            {
                var val = rng.frac();
                expect(val).toBeGreaterThanOrEqual(0);
                expect(val).toBeLessThan(1);
            }
        });

        it('should return a floating point number', function ()
        {
            var val = rng.frac();
            expect(typeof val).toBe('number');
        });
    });

    describe('real', function ()
    {
        it('should return a number between 0 and 2^32', function ()
        {
            for (var i = 0; i < 100; i++)
            {
                var val = rng.real();
                expect(val).toBeGreaterThanOrEqual(0);
                expect(val).toBeLessThanOrEqual(0x100000000);
            }
        });

        it('should return a number type', function ()
        {
            expect(typeof rng.real()).toBe('number');
        });
    });

    describe('integerInRange', function ()
    {
        it('should return a value within the given range (inclusive)', function ()
        {
            for (var i = 0; i < 200; i++)
            {
                var val = rng.integerInRange(5, 10);
                expect(val).toBeGreaterThanOrEqual(5);
                expect(val).toBeLessThanOrEqual(10);
            }
        });

        it('should return an integer', function ()
        {
            var val = rng.integerInRange(1, 100);
            expect(val % 1).toBe(0);
        });

        it('should return min when min equals max', function ()
        {
            for (var i = 0; i < 20; i++)
            {
                expect(rng.integerInRange(7, 7)).toBe(7);
            }
        });

        it('should work with negative ranges', function ()
        {
            for (var i = 0; i < 100; i++)
            {
                var val = rng.integerInRange(-10, -1);
                expect(val).toBeGreaterThanOrEqual(-10);
                expect(val).toBeLessThanOrEqual(-1);
            }
        });

        it('should work with ranges spanning zero', function ()
        {
            for (var i = 0; i < 100; i++)
            {
                var val = rng.integerInRange(-5, 5);
                expect(val).toBeGreaterThanOrEqual(-5);
                expect(val).toBeLessThanOrEqual(5);
            }
        });
    });

    describe('between', function ()
    {
        it('should behave the same as integerInRange', function ()
        {
            var gen1 = new RandomDataGenerator([ 'same' ]);
            var gen2 = new RandomDataGenerator([ 'same' ]);

            for (var i = 0; i < 50; i++)
            {
                expect(gen1.between(0, 100)).toBe(gen2.integerInRange(0, 100));
            }
        });

        it('should return a value within the given range', function ()
        {
            for (var i = 0; i < 100; i++)
            {
                var val = rng.between(1, 6);
                expect(val).toBeGreaterThanOrEqual(1);
                expect(val).toBeLessThanOrEqual(6);
            }
        });
    });

    describe('realInRange', function ()
    {
        it('should return a value within the given range', function ()
        {
            for (var i = 0; i < 200; i++)
            {
                var val = rng.realInRange(1.5, 3.5);
                expect(val).toBeGreaterThanOrEqual(1.5);
                expect(val).toBeLessThan(3.5);
            }
        });

        it('should return min when min equals max', function ()
        {
            for (var i = 0; i < 20; i++)
            {
                expect(rng.realInRange(5, 5)).toBe(5);
            }
        });

        it('should work with negative ranges', function ()
        {
            for (var i = 0; i < 100; i++)
            {
                var val = rng.realInRange(-2, -1);
                expect(val).toBeGreaterThanOrEqual(-2);
                expect(val).toBeLessThan(-1);
            }
        });
    });

    describe('normal', function ()
    {
        it('should return a value between -1 and 1', function ()
        {
            for (var i = 0; i < 200; i++)
            {
                var val = rng.normal();
                expect(val).toBeGreaterThan(-1);
                expect(val).toBeLessThanOrEqual(1);
            }
        });

        it('should return a number type', function ()
        {
            expect(typeof rng.normal()).toBe('number');
        });

        it('should return both positive and negative values over many iterations', function ()
        {
            var hasPositive = false;
            var hasNegative = false;

            for (var i = 0; i < 200; i++)
            {
                var val = rng.normal();
                if (val > 0) { hasPositive = true; }
                if (val < 0) { hasNegative = true; }
                if (hasPositive && hasNegative) { break; }
            }

            expect(hasPositive).toBe(true);
            expect(hasNegative).toBe(true);
        });
    });

    describe('uuid', function ()
    {
        it('should return a string', function ()
        {
            expect(typeof rng.uuid()).toBe('string');
        });

        it('should return a string of length 36', function ()
        {
            expect(rng.uuid()).toHaveLength(36);
        });

        it('should match RFC4122 v4 UUID format', function ()
        {
            var uuid = rng.uuid();
            var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(uuid).toMatch(pattern);
        });

        it('should return unique values', function ()
        {
            var a = rng.uuid();
            var b = rng.uuid();
            expect(a).not.toBe(b);
        });
    });

    describe('pick', function ()
    {
        it('should return an element from the array', function ()
        {
            var arr = [ 'a', 'b', 'c', 'd' ];
            for (var i = 0; i < 50; i++)
            {
                expect(arr).toContain(rng.pick(arr));
            }
        });

        it('should return the only element of a single-element array', function ()
        {
            expect(rng.pick([ 42 ])).toBe(42);
        });

        it('should work with numeric arrays', function ()
        {
            var arr = [ 10, 20, 30 ];
            var val = rng.pick(arr);
            expect(arr).toContain(val);
        });

        it('should pick all elements eventually over many iterations', function ()
        {
            var arr = [ 1, 2, 3, 4, 5 ];
            var seen = {};

            for (var i = 0; i < 500; i++)
            {
                seen[rng.pick(arr)] = true;
            }

            expect(Object.keys(seen)).toHaveLength(5);
        });
    });

    describe('sign', function ()
    {
        it('should return either -1 or 1', function ()
        {
            for (var i = 0; i < 100; i++)
            {
                var val = rng.sign();
                expect(val === -1 || val === 1).toBe(true);
            }
        });

        it('should return both -1 and 1 over many iterations', function ()
        {
            var hasNeg = false;
            var hasPos = false;

            for (var i = 0; i < 200; i++)
            {
                var val = rng.sign();
                if (val === -1) { hasNeg = true; }
                if (val === 1) { hasPos = true; }
                if (hasNeg && hasPos) { break; }
            }

            expect(hasNeg).toBe(true);
            expect(hasPos).toBe(true);
        });
    });

    describe('weightedPick', function ()
    {
        it('should return an element from the array', function ()
        {
            var arr = [ 'x', 'y', 'z' ];
            for (var i = 0; i < 50; i++)
            {
                expect(arr).toContain(rng.weightedPick(arr));
            }
        });

        it('should return the only element for a single-item array', function ()
        {
            expect(rng.weightedPick([ 'only' ])).toBe('only');
        });

        it('should favor earlier entries over many iterations', function ()
        {
            var arr = [ 0, 1, 2, 3, 4 ];
            var counts = [ 0, 0, 0, 0, 0 ];

            for (var i = 0; i < 1000; i++)
            {
                counts[rng.weightedPick(arr)]++;
            }

            // Earlier elements should appear more frequently
            expect(counts[0]).toBeGreaterThan(counts[4]);
        });
    });

    describe('timestamp', function ()
    {
        it('should return a value within the default range', function ()
        {
            for (var i = 0; i < 50; i++)
            {
                var ts = rng.timestamp();
                expect(ts).toBeGreaterThanOrEqual(946684800000);
                expect(ts).toBeLessThanOrEqual(1577862000000);
            }
        });

        it('should return a value within a custom range', function ()
        {
            var min = 1000000;
            var max = 2000000;

            for (var i = 0; i < 50; i++)
            {
                var ts = rng.timestamp(min, max);
                expect(ts).toBeGreaterThanOrEqual(min);
                expect(ts).toBeLessThan(max);
            }
        });

        it('should return a number type', function ()
        {
            expect(typeof rng.timestamp()).toBe('number');
        });
    });

    describe('angle', function ()
    {
        it('should return a value between -180 and 180', function ()
        {
            for (var i = 0; i < 200; i++)
            {
                var val = rng.angle();
                expect(val).toBeGreaterThanOrEqual(-180);
                expect(val).toBeLessThanOrEqual(180);
            }
        });

        it('should return an integer', function ()
        {
            var val = rng.angle();
            expect(Number.isInteger(val)).toBe(true);
        });

        it('should return both positive and negative angles over many iterations', function ()
        {
            var hasPos = false;
            var hasNeg = false;

            for (var i = 0; i < 200; i++)
            {
                var val = rng.angle();
                if (val > 0) { hasPos = true; }
                if (val < 0) { hasNeg = true; }
                if (hasPos && hasNeg) { break; }
            }

            expect(hasPos).toBe(true);
            expect(hasNeg).toBe(true);
        });
    });

    describe('rotation', function ()
    {
        it('should return a value between -π and π (approximately)', function ()
        {
            for (var i = 0; i < 200; i++)
            {
                var val = rng.rotation();
                expect(val).toBeGreaterThanOrEqual(-3.1415926);
                expect(val).toBeLessThanOrEqual(3.1415926);
            }
        });

        it('should return a floating point number', function ()
        {
            expect(typeof rng.rotation()).toBe('number');
        });
    });

    describe('state', function ()
    {
        it('should return a string starting with !rnd', function ()
        {
            var state = rng.state();
            expect(state.startsWith('!rnd')).toBe(true);
        });

        it('should return a comma-delimited string with 5 parts', function ()
        {
            var parts = rng.state().split(',');
            expect(parts).toHaveLength(5);
        });

        it('should restore a previously saved state', function ()
        {
            var savedState = rng.state();
            var val1 = rng.integer();

            rng.state(savedState);
            var val2 = rng.integer();

            expect(val1).toBe(val2);
        });

        it('should allow two generators to be synchronized via state', function ()
        {
            var gen1 = new RandomDataGenerator([ 'sync-test' ]);
            var state = gen1.state();

            var gen2 = new RandomDataGenerator([ 'different-seed' ]);
            gen2.state(state);

            expect(gen1.integer()).toBe(gen2.integer());
            expect(gen1.frac()).toBeCloseTo(gen2.frac(), 15);
        });

        it('should ignore invalid state strings', function ()
        {
            var stateBefore = rng.state();
            rng.state('not-a-valid-state');
            var stateAfter = rng.state();

            expect(stateBefore).toBe(stateAfter);
        });
    });

    describe('shuffle', function ()
    {
        it('should return the same array reference', function ()
        {
            var arr = [ 1, 2, 3, 4, 5 ];
            var result = rng.shuffle(arr);
            expect(result).toBe(arr);
        });

        it('should contain all original elements after shuffle', function ()
        {
            var arr = [ 1, 2, 3, 4, 5 ];
            var copy = arr.slice();
            rng.shuffle(arr);

            expect(arr).toHaveLength(copy.length);
            copy.forEach(function (val)
            {
                expect(arr).toContain(val);
            });
        });

        it('should return an array of the same length', function ()
        {
            var arr = [ 'a', 'b', 'c', 'd' ];
            rng.shuffle(arr);
            expect(arr).toHaveLength(4);
        });

        it('should handle a single-element array without error', function ()
        {
            var arr = [ 42 ];
            rng.shuffle(arr);
            expect(arr).toEqual([ 42 ]);
        });

        it('should handle an empty array without error', function ()
        {
            var arr = [];
            rng.shuffle(arr);
            expect(arr).toEqual([]);
        });

        it('should produce different orderings given the same array over many runs', function ()
        {
            var original = [ 1, 2, 3, 4, 5 ];
            var different = false;
            var first = original.slice();

            rng.shuffle(first);

            for (var i = 0; i < 20; i++)
            {
                var attempt = original.slice();
                rng.shuffle(attempt);
                if (attempt.join(',') !== first.join(','))
                {
                    different = true;
                    break;
                }
            }

            expect(different).toBe(true);
        });

        it('should be deterministic given the same seed', function ()
        {
            var gen1 = new RandomDataGenerator([ 'shuffle-seed' ]);
            var gen2 = new RandomDataGenerator([ 'shuffle-seed' ]);

            var arr1 = [ 1, 2, 3, 4, 5 ];
            var arr2 = [ 1, 2, 3, 4, 5 ];

            gen1.shuffle(arr1);
            gen2.shuffle(arr2);

            expect(arr1.join(',')).toBe(arr2.join(','));
        });
    });
});
