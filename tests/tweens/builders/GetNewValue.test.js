var GetNewValue = require('../../../src/tweens/builders/GetNewValue');

describe('Phaser.Tweens.Builders.GetNewValue', function ()
{
    describe('when the source has the key as a static value', function ()
    {
        it('should return a function', function ()
        {
            var result = GetNewValue({ x: 100 }, 'x', 0);

            expect(typeof result).toBe('function');
        });

        it('should return a function that returns the static value', function ()
        {
            var cb = GetNewValue({ x: 100 }, 'x', 0);

            expect(cb()).toBe(100);
        });

        it('should return the correct value for a string property', function ()
        {
            var cb = GetNewValue({ ease: 'Linear' }, 'ease', 'Power0');

            expect(cb()).toBe('Linear');
        });

        it('should return zero when the property value is zero', function ()
        {
            var cb = GetNewValue({ x: 0 }, 'x', 999);

            expect(cb()).toBe(0);
        });

        it('should return false when the property value is false', function ()
        {
            var cb = GetNewValue({ loop: false }, 'loop', true);

            expect(cb()).toBe(false);
        });

        it('should return null when the property value is null', function ()
        {
            var cb = GetNewValue({ target: null }, 'target', 'default');

            expect(cb()).toBeNull();
        });

        it('should always return the same value regardless of arguments passed', function ()
        {
            var cb = GetNewValue({ x: 42 }, 'x', 0);

            expect(cb('target', 'x', 10, 0, 1, {})).toBe(42);
        });
    });

    describe('when the source has the key as a function', function ()
    {
        it('should return a function', function ()
        {
            var result = GetNewValue({ x: function () { return 5; } }, 'x', 0);

            expect(typeof result).toBe('function');
        });

        it('should call the source function and return its result', function ()
        {
            var cb = GetNewValue({ x: function () { return 50; } }, 'x', 0);

            expect(cb()).toBe(50);
        });

        it('should forward all arguments to the source function', function ()
        {
            var received = {};

            var sourceFn = function (target, targetKey, value, targetIndex, totalTargets, tween)
            {
                received.target = target;
                received.targetKey = targetKey;
                received.value = value;
                received.targetIndex = targetIndex;
                received.totalTargets = totalTargets;
                received.tween = tween;

                return 99;
            };

            var cb = GetNewValue({ x: sourceFn }, 'x', 0);
            var fakeTween = { id: 'tween1' };
            var result = cb('myTarget', 'x', 10, 2, 5, fakeTween);

            expect(result).toBe(99);
            expect(received.target).toBe('myTarget');
            expect(received.targetKey).toBe('x');
            expect(received.value).toBe(10);
            expect(received.targetIndex).toBe(2);
            expect(received.totalTargets).toBe(5);
            expect(received.tween).toBe(fakeTween);
        });

        it('should use the return value of the source function', function ()
        {
            var counter = 0;
            var cb = GetNewValue({ x: function () { return ++counter; } }, 'x', 0);

            expect(cb()).toBe(1);
            expect(cb()).toBe(2);
            expect(cb()).toBe(3);
        });
    });

    describe('when the source does not have the key', function ()
    {
        it('should return a function', function ()
        {
            var result = GetNewValue({}, 'x', 100);

            expect(typeof result).toBe('function');
        });

        it('should return a function that returns the default value when default is a number', function ()
        {
            var cb = GetNewValue({}, 'x', 100);

            expect(cb()).toBe(100);
        });

        it('should return the default value directly when it is a function', function ()
        {
            var defaultFn = function () { return 77; };
            var cb = GetNewValue({}, 'x', defaultFn);

            expect(cb).toBe(defaultFn);
        });

        it('should call the default function and return its result', function ()
        {
            var defaultFn = function () { return 77; };
            var cb = GetNewValue({}, 'x', defaultFn);

            expect(cb()).toBe(77);
        });

        it('should return a wrapper returning zero when default is zero', function ()
        {
            var cb = GetNewValue({}, 'x', 0);

            expect(cb()).toBe(0);
        });

        it('should return a wrapper returning null when default is null', function ()
        {
            var cb = GetNewValue({}, 'x', null);

            expect(cb()).toBeNull();
        });

        it('should return a wrapper returning the default string', function ()
        {
            var cb = GetNewValue({}, 'ease', 'Power1');

            expect(cb()).toBe('Power1');
        });

        it('should ignore inherited properties and use default value', function ()
        {
            var parent = { x: 500 };
            var child = Object.create(parent);

            var cb = GetNewValue(child, 'x', 42);

            expect(cb()).toBe(42);
        });
    });

    describe('edge cases', function ()
    {
        it('should prefer the source value over the default when source has the key', function ()
        {
            var cb = GetNewValue({ duration: 1000 }, 'duration', 300);

            expect(cb()).toBe(1000);
        });

        it('should handle numeric 0 as source value (falsy but valid)', function ()
        {
            var cb = GetNewValue({ alpha: 0 }, 'alpha', 1);

            expect(cb()).toBe(0);
        });

        it('should handle a source function returning 0', function ()
        {
            var cb = GetNewValue({ alpha: function () { return 0; } }, 'alpha', 1);

            expect(cb()).toBe(0);
        });

        it('should handle a default function that accepts arguments', function ()
        {
            var defaultFn = function (target, targetKey, value)
            {
                return value * 2;
            };

            var cb = GetNewValue({}, 'x', defaultFn);

            expect(cb(null, 'x', 5)).toBe(10);
        });
    });
});
