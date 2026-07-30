var DownDuration = require('../../../../src/input/keyboard/keys/DownDuration');

describe('Phaser.Input.Keyboard.DownDuration', function ()
{
    var key;

    function makeKey(isDown, timeDown, currentTime)
    {
        return {
            isDown: isDown,
            timeDown: timeDown,
            plugin: {
                game: {
                    loop: {
                        time: currentTime
                    }
                }
            }
        };
    }

    it('should return true when key is down and pressed within default duration', function ()
    {
        var key = makeKey(true, 1000, 1030);

        expect(DownDuration(key)).toBe(true);
    });

    it('should return false when key is not down', function ()
    {
        var key = makeKey(false, 1000, 1030);

        expect(DownDuration(key)).toBe(false);
    });

    it('should return false when key is down but pressed longer ago than default duration', function ()
    {
        var key = makeKey(true, 1000, 1060);

        expect(DownDuration(key)).toBe(false);
    });

    it('should return false when elapsed time equals the default duration of 50ms', function ()
    {
        var key = makeKey(true, 1000, 1050);

        expect(DownDuration(key)).toBe(false);
    });

    it('should return true when elapsed time is just under the default duration', function ()
    {
        var key = makeKey(true, 1000, 1049);

        expect(DownDuration(key)).toBe(true);
    });

    it('should use custom duration when provided', function ()
    {
        var key = makeKey(true, 1000, 1080);

        expect(DownDuration(key, 100)).toBe(true);
    });

    it('should return false when elapsed time exceeds custom duration', function ()
    {
        var key = makeKey(true, 1000, 1110);

        expect(DownDuration(key, 100)).toBe(false);
    });

    it('should return false when elapsed time equals the custom duration', function ()
    {
        var key = makeKey(true, 1000, 1100);

        expect(DownDuration(key, 100)).toBe(false);
    });

    it('should return true when key was just pressed (zero elapsed time)', function ()
    {
        var key = makeKey(true, 1000, 1000);

        expect(DownDuration(key)).toBe(true);
    });

    it('should return false when key is not down even if within duration', function ()
    {
        var key = makeKey(false, 1000, 1010);

        expect(DownDuration(key, 100)).toBe(false);
    });

    it('should return true with a very large custom duration', function ()
    {
        var key = makeKey(true, 0, 5000);

        expect(DownDuration(key, 10000)).toBe(true);
    });

    it('should return false with a duration of zero', function ()
    {
        var key = makeKey(true, 1000, 1000);

        expect(DownDuration(key, 0)).toBe(false);
    });

    it('should return true when elapsed time is 1ms and duration is 50ms', function ()
    {
        var key = makeKey(true, 1000, 1001);

        expect(DownDuration(key)).toBe(true);
    });

    it('should handle large timestamp values correctly', function ()
    {
        var key = makeKey(true, 999990, 1000010);

        expect(DownDuration(key, 50)).toBe(true);
    });
});
