var JustDown = require('../../../../src/input/keyboard/keys/JustDown');

describe('Phaser.Input.Keyboard.JustDown', function ()
{
    it('should return true when _justDown is true', function ()
    {
        var key = { _justDown: true };

        expect(JustDown(key)).toBe(true);
    });

    it('should return false when _justDown is false', function ()
    {
        var key = { _justDown: false };

        expect(JustDown(key)).toBe(false);
    });

    it('should set _justDown to false after returning true', function ()
    {
        var key = { _justDown: true };

        JustDown(key);

        expect(key._justDown).toBe(false);
    });

    it('should only return true once per press', function ()
    {
        var key = { _justDown: true };

        expect(JustDown(key)).toBe(true);
        expect(JustDown(key)).toBe(false);
        expect(JustDown(key)).toBe(false);
    });

    it('should return true again after _justDown is reset to true', function ()
    {
        var key = { _justDown: true };

        expect(JustDown(key)).toBe(true);
        expect(JustDown(key)).toBe(false);

        key._justDown = true;

        expect(JustDown(key)).toBe(true);
    });

    it('should not modify _justDown when it is false', function ()
    {
        var key = { _justDown: false };

        JustDown(key);

        expect(key._justDown).toBe(false);
    });
});
