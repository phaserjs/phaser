var NumberTweenBuilder = require('../../../src/tweens/builders/NumberTweenBuilder');
var Tween = require('../../../src/tweens/tween/Tween');

var mockParent = {};

function makeConfig (overrides)
{
    return Object.assign({}, overrides);
}

describe('Phaser.Tweens.Builders.NumberTweenBuilder', function ()
{
    describe('when config is a Tween instance', function ()
    {
        it('should return the same Tween with parent reassigned', function ()
        {
            var existingTween = new Tween(null, [ { value: 0 } ]);
            var result = NumberTweenBuilder(mockParent, existingTween, undefined);

            expect(result).toBe(existingTween);
            expect(result.parent).toBe(mockParent);
        });
    });

    describe('return value', function ()
    {
        it('should return a Tween instance', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result).toBeInstanceOf(Tween);
        });

        it('should mark the tween as a number tween', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.isNumberTween).toBe(true);
        });
    });

    describe('from / to defaults', function ()
    {
        it('should default from to 0 and to to 1', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.data[0].start).toBe(0);
            expect(result.data[0].current).toBe(0);
        });

        it('should use from value from config', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ from: 50 }), undefined);

            expect(result.data[0].start).toBe(50);
            expect(result.data[0].current).toBe(50);
        });

        it('should use negative from value', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ from: -100 }), undefined);

            expect(result.data[0].start).toBe(-100);
            expect(result.data[0].current).toBe(-100);
        });

        it('should use floating point from value', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ from: 0.5 }), undefined);

            expect(result.data[0].start).toBeCloseTo(0.5);
            expect(result.data[0].current).toBeCloseTo(0.5);
        });
    });

    describe('paused', function ()
    {
        it('should default paused to false', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.paused).toBe(false);
        });

        it('should set paused to true from config', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ paused: true }), undefined);

            expect(result.paused).toBe(true);
        });
    });

    describe('persist', function ()
    {
        it('should default persist to false', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.persist).toBe(false);
        });

        it('should set persist to true from config', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ persist: true }), undefined);

            expect(result.persist).toBe(true);
        });
    });

    describe('loop', function ()
    {
        it('should default loop to 0', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.loop).toBe(0);
        });

        it('should set loop from config', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ loop: 3 }), undefined);

            expect(result.loop).toBe(3);
        });

        it('should round loop value', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ loop: 2.7 }), undefined);

            expect(result.loop).toBe(3);
        });
    });

    describe('loopDelay', function ()
    {
        it('should default loopDelay to 0', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.loopDelay).toBe(0);
        });

        it('should set loopDelay from config', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ loopDelay: 500 }), undefined);

            expect(result.loopDelay).toBe(500);
        });

        it('should round loopDelay value', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ loopDelay: 100.9 }), undefined);

            expect(result.loopDelay).toBe(101);
        });
    });

    describe('completeDelay', function ()
    {
        it('should default completeDelay to 0', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.completeDelay).toBe(0);
        });

        it('should set completeDelay from config', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ completeDelay: 200 }), undefined);

            expect(result.completeDelay).toBe(200);
        });
    });

    describe('callbackScope', function ()
    {
        it('should default callbackScope to the tween itself', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.callbackScope).toBe(result);
        });

        it('should use callbackScope from config', function ()
        {
            var scope = { custom: true };
            var result = NumberTweenBuilder(mockParent, makeConfig({ callbackScope: scope }), undefined);

            expect(result.callbackScope).toBe(scope);
        });
    });

    describe('callbacks', function ()
    {
        it('should set onComplete callback when provided', function ()
        {
            var cb = function () {};
            var result = NumberTweenBuilder(mockParent, makeConfig({ onComplete: cb }), undefined);

            expect(result.callbacks.onComplete).not.toBeNull();
            expect(result.callbacks.onComplete.func).toBe(cb);
        });

        it('should set onStart callback when provided', function ()
        {
            var cb = function () {};
            var result = NumberTweenBuilder(mockParent, makeConfig({ onStart: cb }), undefined);

            expect(result.callbacks.onStart).not.toBeNull();
            expect(result.callbacks.onStart.func).toBe(cb);
        });

        it('should set onUpdate callback when provided', function ()
        {
            var cb = function () {};
            var result = NumberTweenBuilder(mockParent, makeConfig({ onUpdate: cb }), undefined);

            expect(result.callbacks.onUpdate).not.toBeNull();
            expect(result.callbacks.onUpdate.func).toBe(cb);
        });

        it('should pass callbackParams to callbacks', function ()
        {
            var cb = function () {};
            var params = [ 1, 2, 3 ];
            var result = NumberTweenBuilder(mockParent, makeConfig({ onComplete: cb, onCompleteParams: params }), undefined);

            expect(result.callbacks.onComplete.params).toEqual(params);
        });

        it('should not set callbacks that are not provided', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.callbacks.onComplete).toBeNull();
            expect(result.callbacks.onStart).toBeNull();
        });
    });

    describe('custom defaults', function ()
    {
        it('should use provided defaults for duration when not in config', function ()
        {
            var customDefaults = { duration: 5000 };
            var result = NumberTweenBuilder(mockParent, makeConfig({}), customDefaults);

            expect(result.data[0].duration).toBe(5000);
        });

        it('should prefer config values over custom defaults', function ()
        {
            var customDefaults = { duration: 5000 };
            var result = NumberTweenBuilder(mockParent, makeConfig({ duration: 250 }), customDefaults);

            expect(result.data[0].duration).toBe(250);
        });

        it('should use provided defaults for repeat when not in config', function ()
        {
            var customDefaults = { repeat: 4 };
            var result = NumberTweenBuilder(mockParent, makeConfig({}), customDefaults);

            expect(result.data[0].repeat).toBe(4);
        });
    });

    describe('tween data', function ()
    {
        it('should create exactly one tween data entry', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.data.length).toBe(1);
        });

        it('should target the value property', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.data[0].key).toBe('value');
        });

        it('should use default duration of 1000ms', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.data[0].duration).toBe(1000);
        });

        it('should use config duration', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ duration: 3000 }), undefined);

            expect(result.data[0].duration).toBe(3000);
        });

        it('should default yoyo to false', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.data[0].yoyo).toBe(false);
        });

        it('should set yoyo from config', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ yoyo: true }), undefined);

            expect(result.data[0].yoyo).toBe(true);
        });

        it('should default repeat to 0', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.data[0].repeat).toBe(0);
        });

        it('should set repeat from config', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ repeat: 5 }), undefined);

            expect(result.data[0].repeat).toBe(5);
        });

        it('should default hold to 0', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.data[0].hold).toBe(0);
        });

        it('should set hold from config', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ hold: 300 }), undefined);

            expect(result.data[0].hold).toBe(300);
        });

        it('should default repeatDelay to 0', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({}), undefined);

            expect(result.data[0].repeatDelay).toBe(0);
        });

        it('should set repeatDelay from config', function ()
        {
            var result = NumberTweenBuilder(mockParent, makeConfig({ repeatDelay: 150 }), undefined);

            expect(result.data[0].repeatDelay).toBe(150);
        });
    });
});
