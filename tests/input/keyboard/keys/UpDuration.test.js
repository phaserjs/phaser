var UpDuration = require('../../../../src/input/keyboard/keys/UpDuration');

describe('Phaser.Input.Keyboard.UpDuration', function ()
{
    function makeKey(isUp, timeUp, currentTime)
    {
        return {
            isUp: isUp,
            timeUp: timeUp,
            plugin: {
                game: {
                    loop: {
                        time: currentTime
                    }
                }
            }
        };
    }

    it('should return true when key is up and released within default duration', function ()
    {
        var key = makeKey(true, 960, 1000);

        expect(UpDuration(key)).toBe(true);
    });

    it('should return false when key is not up', function ()
    {
        var key = makeKey(false, 950, 1000);

        expect(UpDuration(key)).toBe(false);
    });

    it('should return false when key was released longer ago than default duration', function ()
    {
        var key = makeKey(true, 900, 1000);

        expect(UpDuration(key)).toBe(false);
    });

    it('should return false when elapsed time equals default duration', function ()
    {
        var key = makeKey(true, 950, 1000);

        expect(UpDuration(key, 50)).toBe(false);
    });

    it('should return true when elapsed time is just under default duration', function ()
    {
        var key = makeKey(true, 951, 1000);

        expect(UpDuration(key)).toBe(true);
    });

    it('should use default duration of 50ms when duration is not provided', function ()
    {
        var keyJustUnder = makeKey(true, 951, 1000);
        var keyJustOver = makeKey(true, 949, 1000);

        expect(UpDuration(keyJustUnder)).toBe(true);
        expect(UpDuration(keyJustOver)).toBe(false);
    });

    it('should respect a custom duration', function ()
    {
        var key = makeKey(true, 800, 1000);

        expect(UpDuration(key, 100)).toBe(false);
        expect(UpDuration(key, 200)).toBe(false);
        expect(UpDuration(key, 201)).toBe(true);
    });

    it('should return false when key is not up even if within duration', function ()
    {
        var key = makeKey(false, 990, 1000);

        expect(UpDuration(key, 50)).toBe(false);
    });

    it('should return true when key is up and released very recently', function ()
    {
        var key = makeKey(true, 999, 1000);

        expect(UpDuration(key, 50)).toBe(true);
    });

    it('should return true when timeUp equals current time', function ()
    {
        var key = makeKey(true, 1000, 1000);

        expect(UpDuration(key, 50)).toBe(true);
    });

    it('should return false with zero duration', function ()
    {
        var key = makeKey(true, 999, 1000);

        expect(UpDuration(key, 0)).toBe(false);
    });

    it('should handle large duration values', function ()
    {
        var key = makeKey(true, 0, 1000);

        expect(UpDuration(key, 2000)).toBe(true);
        expect(UpDuration(key, 999)).toBe(false);
        expect(UpDuration(key, 1001)).toBe(true);
    });

    it('should return false when both isUp is false and outside duration', function ()
    {
        var key = makeKey(false, 900, 1000);

        expect(UpDuration(key, 50)).toBe(false);
    });
});
