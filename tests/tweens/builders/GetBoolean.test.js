var GetBoolean = require('../../../src/tweens/builders/GetBoolean');

describe('Phaser.Tweens.Builders.GetBoolean', function ()
{
    it('should return the default value when source is null', function ()
    {
        expect(GetBoolean(null, 'key', true)).toBe(true);
        expect(GetBoolean(null, 'key', false)).toBe(false);
    });

    it('should return the default value when source is undefined', function ()
    {
        expect(GetBoolean(undefined, 'key', true)).toBe(true);
        expect(GetBoolean(undefined, 'key', false)).toBe(false);
    });

    it('should return the default value when source is an empty object and key is missing', function ()
    {
        expect(GetBoolean({}, 'active', true)).toBe(true);
        expect(GetBoolean({}, 'active', false)).toBe(false);
    });

    it('should return the value from source when the key exists and is true', function ()
    {
        expect(GetBoolean({ active: true }, 'active', false)).toBe(true);
    });

    it('should return the value from source when the key exists and is false', function ()
    {
        expect(GetBoolean({ active: false }, 'active', true)).toBe(false);
    });

    it('should return the default value when the key does not exist on the source', function ()
    {
        expect(GetBoolean({ other: true }, 'active', true)).toBe(true);
        expect(GetBoolean({ other: true }, 'active', false)).toBe(false);
    });

    it('should not return the value of an inherited property', function ()
    {
        var parent = { active: true };
        var child = Object.create(parent);

        expect(GetBoolean(child, 'active', false)).toBe(false);
    });

    it('should return a non-boolean value as-is when the key exists', function ()
    {
        expect(GetBoolean({ repeat: 1 }, 'repeat', false)).toBe(1);
        expect(GetBoolean({ label: 'yes' }, 'label', false)).toBe('yes');
    });

    it('should return the default value when source is zero (falsy)', function ()
    {
        expect(GetBoolean(0, 'key', true)).toBe(true);
    });

    it('should return the default value when source is an empty string (falsy)', function ()
    {
        expect(GetBoolean('', 'key', true)).toBe(true);
    });

    it('should work correctly with multiple keys on the source object', function ()
    {
        var source = { paused: false, loop: true, yoyo: false };

        expect(GetBoolean(source, 'paused', true)).toBe(false);
        expect(GetBoolean(source, 'loop', false)).toBe(true);
        expect(GetBoolean(source, 'yoyo', true)).toBe(false);
        expect(GetBoolean(source, 'missing', true)).toBe(true);
    });
});
