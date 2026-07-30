var GetEaseFunction = require('../../../src/tweens/builders/GetEaseFunction');
var EaseMap = require('../../../src/math/easing/EaseMap');

describe('Phaser.Tweens.Builders.GetEaseFunction', function ()
{
    describe('default / fallback behaviour', function ()
    {
        it('should return Power0 (linear) for an unrecognised string', function ()
        {
            var fn = GetEaseFunction('NotARealEase');

            expect(fn).toBe(EaseMap.Power0);
        });

        it('should return Power0 (linear) when called with no arguments', function ()
        {
            var fn = GetEaseFunction();

            expect(fn).toBe(EaseMap.Power0);
        });

        it('should return Power0 (linear) for null ease', function ()
        {
            var fn = GetEaseFunction(null);

            expect(fn).toBe(EaseMap.Power0);
        });

        it('should return Power0 (linear) for a numeric ease value', function ()
        {
            var fn = GetEaseFunction(42);

            expect(fn).toBe(EaseMap.Power0);
        });
    });

    describe('exact EaseMap key look-up', function ()
    {
        it('should resolve Power0', function ()
        {
            expect(GetEaseFunction('Power0')).toBe(EaseMap.Power0);
        });

        it('should resolve Power1', function ()
        {
            expect(GetEaseFunction('Power1')).toBe(EaseMap.Power1);
        });

        it('should resolve Power2', function ()
        {
            expect(GetEaseFunction('Power2')).toBe(EaseMap.Power2);
        });

        it('should resolve Power3', function ()
        {
            expect(GetEaseFunction('Power3')).toBe(EaseMap.Power3);
        });

        it('should resolve Power4', function ()
        {
            expect(GetEaseFunction('Power4')).toBe(EaseMap.Power4);
        });

        it('should resolve Linear', function ()
        {
            expect(GetEaseFunction('Linear')).toBe(EaseMap.Linear);
        });

        it('should resolve Quad', function ()
        {
            expect(GetEaseFunction('Quad')).toBe(EaseMap.Quad);
        });

        it('should resolve Cubic', function ()
        {
            expect(GetEaseFunction('Cubic')).toBe(EaseMap.Cubic);
        });

        it('should resolve Sine', function ()
        {
            expect(GetEaseFunction('Sine')).toBe(EaseMap.Sine);
        });

        it('should resolve Elastic', function ()
        {
            expect(GetEaseFunction('Elastic')).toBe(EaseMap.Elastic);
        });

        it('should resolve Back', function ()
        {
            expect(GetEaseFunction('Back')).toBe(EaseMap.Back);
        });

        it('should resolve Bounce', function ()
        {
            expect(GetEaseFunction('Bounce')).toBe(EaseMap.Bounce);
        });

        it('should resolve Stepped', function ()
        {
            expect(GetEaseFunction('Stepped')).toBe(EaseMap.Stepped);
        });

        it('should resolve Quad.easeIn', function ()
        {
            expect(GetEaseFunction('Quad.easeIn')).toBe(EaseMap['Quad.easeIn']);
        });

        it('should resolve Quad.easeOut', function ()
        {
            expect(GetEaseFunction('Quad.easeOut')).toBe(EaseMap['Quad.easeOut']);
        });

        it('should resolve Quad.easeInOut', function ()
        {
            expect(GetEaseFunction('Quad.easeInOut')).toBe(EaseMap['Quad.easeInOut']);
        });

        it('should resolve Cubic.easeIn', function ()
        {
            expect(GetEaseFunction('Cubic.easeIn')).toBe(EaseMap['Cubic.easeIn']);
        });

        it('should resolve Back.easeIn', function ()
        {
            expect(GetEaseFunction('Back.easeIn')).toBe(EaseMap['Back.easeIn']);
        });

        it('should resolve Bounce.easeOut', function ()
        {
            expect(GetEaseFunction('Bounce.easeOut')).toBe(EaseMap['Bounce.easeOut']);
        });

        it('should resolve Elastic.easeInOut', function ()
        {
            expect(GetEaseFunction('Elastic.easeInOut')).toBe(EaseMap['Elastic.easeInOut']);
        });
    });

    describe('dot-notation shorthand look-up', function ()
    {
        it('should resolve quad.in to Quad.easeIn', function ()
        {
            expect(GetEaseFunction('quad.in')).toBe(EaseMap['Quad.easeIn']);
        });

        it('should resolve quad.out to Quad.easeOut', function ()
        {
            expect(GetEaseFunction('quad.out')).toBe(EaseMap['Quad.easeOut']);
        });

        it('should resolve quad.inout to Quad.easeInOut', function ()
        {
            expect(GetEaseFunction('quad.inout')).toBe(EaseMap['Quad.easeInOut']);
        });

        it('should resolve cubic.in to Cubic.easeIn', function ()
        {
            expect(GetEaseFunction('cubic.in')).toBe(EaseMap['Cubic.easeIn']);
        });

        it('should resolve cubic.out to Cubic.easeOut', function ()
        {
            expect(GetEaseFunction('cubic.out')).toBe(EaseMap['Cubic.easeOut']);
        });

        it('should resolve cubic.inout to Cubic.easeInOut', function ()
        {
            expect(GetEaseFunction('cubic.inout')).toBe(EaseMap['Cubic.easeInOut']);
        });

        it('should resolve sine.in to Sine.easeIn', function ()
        {
            expect(GetEaseFunction('sine.in')).toBe(EaseMap['Sine.easeIn']);
        });

        it('should resolve sine.out to Sine.easeOut', function ()
        {
            expect(GetEaseFunction('sine.out')).toBe(EaseMap['Sine.easeOut']);
        });

        it('should resolve sine.inout to Sine.easeInOut', function ()
        {
            expect(GetEaseFunction('sine.inout')).toBe(EaseMap['Sine.easeInOut']);
        });

        it('should resolve back.in to Back.easeIn', function ()
        {
            expect(GetEaseFunction('back.in')).toBe(EaseMap['Back.easeIn']);
        });

        it('should resolve back.out to Back.easeOut', function ()
        {
            expect(GetEaseFunction('back.out')).toBe(EaseMap['Back.easeOut']);
        });

        it('should resolve back.inout to Back.easeInOut', function ()
        {
            expect(GetEaseFunction('back.inout')).toBe(EaseMap['Back.easeInOut']);
        });

        it('should resolve bounce.in to Bounce.easeIn', function ()
        {
            expect(GetEaseFunction('bounce.in')).toBe(EaseMap['Bounce.easeIn']);
        });

        it('should resolve elastic.inout to Elastic.easeInOut', function ()
        {
            expect(GetEaseFunction('elastic.inout')).toBe(EaseMap['Elastic.easeInOut']);
        });

        it('should resolve circ.in to Circ.easeIn', function ()
        {
            expect(GetEaseFunction('circ.in')).toBe(EaseMap['Circ.easeIn']);
        });

        it('should resolve expo.out to Expo.easeOut', function ()
        {
            expect(GetEaseFunction('expo.out')).toBe(EaseMap['Expo.easeOut']);
        });

        it('should resolve quart.inout to Quart.easeInOut', function ()
        {
            expect(GetEaseFunction('quart.inout')).toBe(EaseMap['Quart.easeInOut']);
        });

        it('should resolve quint.in to Quint.easeIn', function ()
        {
            expect(GetEaseFunction('quint.in')).toBe(EaseMap['Quint.easeIn']);
        });
    });

    describe('custom function', function ()
    {
        it('should return the function directly when a function is passed', function ()
        {
            var myEase = function (v) { return v * v; };
            var fn = GetEaseFunction(myEase);

            expect(fn).toBe(myEase);
        });

        it('should call the custom function correctly', function ()
        {
            var myEase = function (v) { return v * 2; };
            var fn = GetEaseFunction(myEase);

            expect(fn(0.5)).toBeCloseTo(1.0);
        });
    });

    describe('easeParams wrapper', function ()
    {
        it('should return a function (not the original) when easeParams is provided', function ()
        {
            var fn = GetEaseFunction('Linear', [1]);

            expect(typeof fn).toBe('function');
            expect(fn).not.toBe(EaseMap.Linear);
        });

        it('should forward easeParams to the ease function on each call', function ()
        {
            var received = [];
            var spy = function (v, a, b) { received.push([v, a, b]); return v; };
            var fn = GetEaseFunction(spy, [10, 20]);

            fn(0.5);

            expect(received.length).toBe(1);
            expect(received[0][0]).toBeCloseTo(0.5);
            expect(received[0][1]).toBe(10);
            expect(received[0][2]).toBe(20);
        });

        it('should update the first argument (v) on every call', function ()
        {
            var lastV;
            var spy = function (v) { lastV = v; return v; };
            var fn = GetEaseFunction(spy, [99]);

            fn(0.25);
            expect(lastV).toBeCloseTo(0.25);

            fn(0.75);
            expect(lastV).toBeCloseTo(0.75);
        });

        it('should not mutate the original easeParams array', function ()
        {
            var params = [5, 6];
            var spy = function (v, a, b) { return v; };
            var fn = GetEaseFunction(spy, params);

            fn(0.5);

            expect(params[0]).toBe(5);
            expect(params[1]).toBe(6);
        });

        it('should work with a named ease string and easeParams', function ()
        {
            var fn = GetEaseFunction('Linear', [1]);

            // Linear(v) === v, so wrapping with extra params should still return v
            expect(fn(0)).toBeCloseTo(0);
            expect(fn(1)).toBeCloseTo(1);
            expect(fn(0.5)).toBeCloseTo(0.5);
        });

        it('should return Power0 wrapper when ease is unresolved and easeParams provided', function ()
        {
            var fn = GetEaseFunction('NotReal', [1]);

            // Power0 is linear, so result should equal input
            expect(fn(0.4)).toBeCloseTo(0.4);
        });

        it('should handle empty easeParams array as falsy and return function directly', function ()
        {
            // An empty array is truthy in JS, so a wrapper IS returned
            var fn = GetEaseFunction('Linear', []);

            expect(typeof fn).toBe('function');
        });
    });

    describe('return value is callable', function ()
    {
        it('should return a function for every exact EaseMap key', function ()
        {
            var keys = Object.keys(EaseMap);

            for (var i = 0; i < keys.length; i++)
            {
                var fn = GetEaseFunction(keys[i]);
                expect(typeof fn).toBe('function');
            }
        });

        it('returned function should accept a value in [0, 1] and return a number', function ()
        {
            var fn = GetEaseFunction('Quad.easeIn');
            var result = fn(0.5);

            expect(typeof result).toBe('number');
        });

        it('should map 0 to 0 for linear ease', function ()
        {
            var fn = GetEaseFunction('Linear');

            expect(fn(0)).toBeCloseTo(0);
        });

        it('should map 1 to 1 for linear ease', function ()
        {
            var fn = GetEaseFunction('Linear');

            expect(fn(1)).toBeCloseTo(1);
        });
    });
});
