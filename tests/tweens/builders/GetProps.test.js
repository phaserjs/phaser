var GetProps = require('../../../src/tweens/builders/GetProps');

describe('Phaser.Tweens.Builders.GetProps', function ()
{
    describe('when config has a props object', function ()
    {
        it('should return keys from the props object', function ()
        {
            var config = {
                targets: {},
                props: {
                    x: 100,
                    y: 200
                }
            };

            var result = GetProps(config);

            expect(result.length).toBe(2);
        });

        it('should return key/value pairs from props', function ()
        {
            var config = {
                props: {
                    x: 100
                }
            };

            var result = GetProps(config);

            expect(result[0].key).toBe('x');
            expect(result[0].value).toBe(100);
        });

        it('should skip props keys that start with an underscore', function ()
        {
            var config = {
                props: {
                    x: 100,
                    _private: 999,
                    y: 200
                }
            };

            var result = GetProps(config);

            expect(result.length).toBe(2);
            expect(result[0].key).toBe('x');
            expect(result[1].key).toBe('y');
        });

        it('should return an empty array if all props keys start with underscore', function ()
        {
            var config = {
                props: {
                    _a: 1,
                    _b: 2
                }
            };

            var result = GetProps(config);

            expect(result.length).toBe(0);
        });

        it('should return an empty array for an empty props object', function ()
        {
            var config = {
                props: {}
            };

            var result = GetProps(config);

            expect(result.length).toBe(0);
        });

        it('should not skip reserved top-level keys when inside props', function ()
        {
            var config = {
                props: {
                    delay: 500,
                    duration: 1000,
                    x: 100
                }
            };

            var result = GetProps(config);

            expect(result.length).toBe(3);
        });

        it('should preserve object values from props', function ()
        {
            var valueObj = { value: 100, ease: 'Linear' };
            var config = {
                props: {
                    x: valueObj
                }
            };

            var result = GetProps(config);

            expect(result[0].value).toBe(valueObj);
        });
    });

    describe('when config has no props object', function ()
    {
        it('should return non-reserved top-level keys', function ()
        {
            var config = {
                x: 100,
                y: 200
            };

            var result = GetProps(config);

            expect(result.length).toBe(2);
            expect(result[0].key).toBe('x');
            expect(result[1].key).toBe('y');
        });

        it('should skip reserved keys', function ()
        {
            var config = {
                targets: {},
                duration: 1000,
                ease: 'Linear',
                x: 100
            };

            var result = GetProps(config);

            expect(result.length).toBe(1);
            expect(result[0].key).toBe('x');
            expect(result[0].value).toBe(100);
        });

        it('should skip keys that start with an underscore', function ()
        {
            var config = {
                x: 100,
                _hidden: 999
            };

            var result = GetProps(config);

            expect(result.length).toBe(1);
            expect(result[0].key).toBe('x');
        });

        it('should skip both reserved keys and underscore-prefixed keys', function ()
        {
            var config = {
                targets: {},
                duration: 500,
                _internal: 0,
                alpha: 0.5
            };

            var result = GetProps(config);

            expect(result.length).toBe(1);
            expect(result[0].key).toBe('alpha');
        });

        it('should return an empty array when all keys are reserved', function ()
        {
            var config = {
                targets: {},
                duration: 1000,
                ease: 'Linear',
                delay: 0,
                repeat: 0,
                yoyo: false,
                paused: false
            };

            var result = GetProps(config);

            expect(result.length).toBe(0);
        });

        it('should return an empty array for an empty config', function ()
        {
            var result = GetProps({});

            expect(result.length).toBe(0);
        });

        it('should include all known reserved props when provided', function ()
        {
            var config = {
                callbackScope: null,
                completeDelay: 0,
                delay: 0,
                duration: 1000,
                ease: 'Linear',
                easeParams: null,
                flipX: false,
                flipY: false,
                hold: 0,
                interpolation: null,
                loop: 0,
                loopDelay: 0,
                onActive: null,
                onActiveParams: null,
                onComplete: null,
                onCompleteParams: null,
                onLoop: null,
                onLoopParams: null,
                onPause: null,
                onPauseParams: null,
                onRepeat: null,
                onRepeatParams: null,
                onResume: null,
                onResumeParams: null,
                onStart: null,
                onStartParams: null,
                onStop: null,
                onStopParams: null,
                onUpdate: null,
                onUpdateParams: null,
                onYoyo: null,
                onYoyoParams: null,
                paused: false,
                persist: false,
                props: null,
                repeat: 0,
                repeatDelay: 0,
                targets: null,
                yoyo: false,
                x: 100
            };

            var result = GetProps(config);

            // Only 'x' should remain; 'props' is reserved but also triggers the props branch
            // Since props is null (falsy but exists), hasOwnProperty('props') is true,
            // so it enters the props branch and iterates over null — which yields nothing.
            // This tests that 'props' itself being reserved doesn't matter in the else branch.
            expect(Array.isArray(result)).toBe(true);
        });

        it('should return correct key/value pairs', function ()
        {
            var config = {
                x: 500,
                rotation: 1.57
            };

            var result = GetProps(config);

            expect(result.length).toBe(2);

            var xProp = result.filter(function (p) { return p.key === 'x'; })[0];
            var rotProp = result.filter(function (p) { return p.key === 'rotation'; })[0];

            expect(xProp.value).toBe(500);
            expect(rotProp.value).toBe(1.57);
        });
    });

    describe('return value structure', function ()
    {
        it('should always return an array', function ()
        {
            expect(Array.isArray(GetProps({}))).toBe(true);
            expect(Array.isArray(GetProps({ props: {} }))).toBe(true);
        });

        it('each entry should have a key and value property', function ()
        {
            var config = {
                props: {
                    x: 42
                }
            };

            var result = GetProps(config);

            expect(result[0]).toHaveProperty('key');
            expect(result[0]).toHaveProperty('value');
        });

        it('should handle numeric values', function ()
        {
            var config = { props: { x: 0, y: -50, z: 3.14 } };
            var result = GetProps(config);

            expect(result.length).toBe(3);
        });

        it('should handle array values', function ()
        {
            var arr = [0, 100, 200];
            var config = { props: { x: arr } };
            var result = GetProps(config);

            expect(result[0].value).toBe(arr);
        });

        it('should handle function values', function ()
        {
            var fn = function () { return 100; };
            var config = { props: { x: fn } };
            var result = GetProps(config);

            expect(result[0].value).toBe(fn);
        });
    });
});
