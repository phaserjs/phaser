var BuildGameObjectAnimation = require('../../src/gameobjects/BuildGameObjectAnimation');

describe('Phaser.GameObjects.BuildGameObjectAnimation', function ()
{
    var sprite;

    beforeEach(function ()
    {
        sprite = {
            anims: {
                play: vi.fn(),
                playAfterDelay: vi.fn(),
                load: vi.fn()
            }
        };
    });

    describe('when anims is absent or null', function ()
    {
        it('should return the sprite unchanged when config has no anims property', function ()
        {
            var result = BuildGameObjectAnimation(sprite, {});

            expect(result).toBe(sprite);
            expect(sprite.anims.play).not.toHaveBeenCalled();
            expect(sprite.anims.load).not.toHaveBeenCalled();
        });

        it('should return the sprite unchanged when anims is explicitly null', function ()
        {
            var result = BuildGameObjectAnimation(sprite, { anims: null });

            expect(result).toBe(sprite);
            expect(sprite.anims.play).not.toHaveBeenCalled();
        });

        it('should return the sprite unchanged when config is an empty object', function ()
        {
            var result = BuildGameObjectAnimation(sprite, {});

            expect(result).toBe(sprite);
        });
    });

    describe('when anims is a string', function ()
    {
        it('should call sprite.anims.play with the animation key', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: 'walk' });

            expect(sprite.anims.play).toHaveBeenCalledWith('walk');
        });

        it('should return the sprite', function ()
        {
            var result = BuildGameObjectAnimation(sprite, { anims: 'run' });

            expect(result).toBe(sprite);
        });

        it('should not call load or playAfterDelay when anims is a string', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: 'jump' });

            expect(sprite.anims.load).not.toHaveBeenCalled();
            expect(sprite.anims.playAfterDelay).not.toHaveBeenCalled();
        });
    });

    describe('when anims is an object with a key', function ()
    {
        it('should call anims.load with default values when play and delayedPlay are not set', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: { key: 'walk' } });

            expect(sprite.anims.load).toHaveBeenCalledWith({
                key: 'walk',
                delay: 0,
                repeat: 0,
                repeatDelay: 0,
                yoyo: false,
                startFrame: undefined
            });
        });

        it('should call anims.play when play is true', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: { key: 'walk', play: true } });

            expect(sprite.anims.play).toHaveBeenCalled();
            expect(sprite.anims.load).not.toHaveBeenCalled();
            expect(sprite.anims.playAfterDelay).not.toHaveBeenCalled();
        });

        it('should pass the correct playConfig when play is true', function ()
        {
            BuildGameObjectAnimation(sprite, {
                anims: {
                    key: 'walk',
                    play: true,
                    delay: 100,
                    repeat: 3,
                    repeatDelay: 200,
                    yoyo: true,
                    startFrame: 2
                }
            });

            expect(sprite.anims.play).toHaveBeenCalledWith({
                key: 'walk',
                delay: 100,
                repeat: 3,
                repeatDelay: 200,
                yoyo: true,
                startFrame: 2
            });
        });

        it('should call anims.playAfterDelay when delayedPlay is greater than zero', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: { key: 'walk', delayedPlay: 500 } });

            expect(sprite.anims.playAfterDelay).toHaveBeenCalled();
            expect(sprite.anims.play).not.toHaveBeenCalled();
            expect(sprite.anims.load).not.toHaveBeenCalled();
        });

        it('should pass the correct playConfig and delay to playAfterDelay', function ()
        {
            BuildGameObjectAnimation(sprite, {
                anims: {
                    key: 'run',
                    delayedPlay: 300,
                    repeat: 2,
                    yoyo: true
                }
            });

            expect(sprite.anims.playAfterDelay).toHaveBeenCalledWith(
                {
                    key: 'run',
                    delay: 0,
                    repeat: 2,
                    repeatDelay: 0,
                    yoyo: true,
                    startFrame: undefined
                },
                300
            );
        });

        it('should prefer play over delayedPlay when both are set', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: { key: 'walk', play: true, delayedPlay: 500 } });

            expect(sprite.anims.play).toHaveBeenCalled();
            expect(sprite.anims.playAfterDelay).not.toHaveBeenCalled();
        });

        it('should call anims.load when play is false and delayedPlay is zero', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: { key: 'idle', play: false, delayedPlay: 0 } });

            expect(sprite.anims.load).toHaveBeenCalled();
            expect(sprite.anims.play).not.toHaveBeenCalled();
            expect(sprite.anims.playAfterDelay).not.toHaveBeenCalled();
        });

        it('should not call any anim method when key is absent from the object', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: { delay: 100, repeat: 2 } });

            expect(sprite.anims.play).not.toHaveBeenCalled();
            expect(sprite.anims.load).not.toHaveBeenCalled();
            expect(sprite.anims.playAfterDelay).not.toHaveBeenCalled();
        });

        it('should not call any anim method when key is an empty string', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: { key: '' } });

            expect(sprite.anims.play).not.toHaveBeenCalled();
            expect(sprite.anims.load).not.toHaveBeenCalled();
            expect(sprite.anims.playAfterDelay).not.toHaveBeenCalled();
        });

        it('should return the sprite', function ()
        {
            var result = BuildGameObjectAnimation(sprite, { anims: { key: 'walk', play: true } });

            expect(result).toBe(sprite);
        });

        it('should use default delay of 0 when not provided', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: { key: 'walk', play: true } });

            var callArg = sprite.anims.play.mock.calls[0][0];

            expect(callArg.delay).toBe(0);
        });

        it('should use default repeat of 0 when not provided', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: { key: 'walk', play: true } });

            var callArg = sprite.anims.play.mock.calls[0][0];

            expect(callArg.repeat).toBe(0);
        });

        it('should use default repeatDelay of 0 when not provided', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: { key: 'walk', play: true } });

            var callArg = sprite.anims.play.mock.calls[0][0];

            expect(callArg.repeatDelay).toBe(0);
        });

        it('should use default yoyo of false when not provided', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: { key: 'walk', play: true } });

            var callArg = sprite.anims.play.mock.calls[0][0];

            expect(callArg.yoyo).toBe(false);
        });

        it('should pass startFrame as undefined when not provided', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: { key: 'walk', play: true } });

            var callArg = sprite.anims.play.mock.calls[0][0];

            expect(callArg.startFrame).toBeUndefined();
        });

        it('should pass startFrame as a number when provided', function ()
        {
            BuildGameObjectAnimation(sprite, { anims: { key: 'walk', play: true, startFrame: 4 } });

            var callArg = sprite.anims.play.mock.calls[0][0];

            expect(callArg.startFrame).toBe(4);
        });
    });

    describe('return value', function ()
    {
        it('should always return the sprite object', function ()
        {
            expect(BuildGameObjectAnimation(sprite, {})).toBe(sprite);
            expect(BuildGameObjectAnimation(sprite, { anims: 'walk' })).toBe(sprite);
            expect(BuildGameObjectAnimation(sprite, { anims: { key: 'walk' } })).toBe(sprite);
        });
    });
});
