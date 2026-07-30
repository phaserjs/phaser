var JustUp = require('../../../../src/input/keyboard/keys/JustUp');

describe('Phaser.Input.Keyboard.JustUp', function ()
{
    it('should return true when _justUp is true', function ()
    {
        var key = { _justUp: true };

        expect(JustUp(key)).toBe(true);
    });

    it('should return false when _justUp is false', function ()
    {
        var key = { _justUp: false };

        expect(JustUp(key)).toBe(false);
    });

    it('should set _justUp to false after returning true', function ()
    {
        var key = { _justUp: true };

        JustUp(key);

        expect(key._justUp).toBe(false);
    });

    it('should only return true once per release', function ()
    {
        var key = { _justUp: true };

        expect(JustUp(key)).toBe(true);
        expect(JustUp(key)).toBe(false);
        expect(JustUp(key)).toBe(false);
    });

    it('should not modify _justUp when it is already false', function ()
    {
        var key = { _justUp: false };

        JustUp(key);

        expect(key._justUp).toBe(false);
    });

    it('should return true again after _justUp is reset to true', function ()
    {
        var key = { _justUp: true };

        expect(JustUp(key)).toBe(true);
        expect(JustUp(key)).toBe(false);

        key._justUp = true;

        expect(JustUp(key)).toBe(true);
    });
});
