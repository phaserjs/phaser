var EasingNaming = require('../../../src/gameobjects/spritegpulayer/EasingNaming');
var EasingEncoding = require('../../../src/gameobjects/spritegpulayer/EasingEncoding');

describe('EasingNaming', function ()
{
    it('should be a plain object', function ()
    {
        expect(typeof EasingNaming).toBe('object');
        expect(EasingNaming).not.toBeNull();
    });

    it('should map numeric keys to string names', function ()
    {
        var keys = Object.keys(EasingNaming);
        keys.forEach(function (key)
        {
            expect(typeof EasingNaming[key]).toBe('string');
        });
    });

    it('should be a reverse mapping of EasingEncoding', function ()
    {
        var animations = Object.keys(EasingEncoding);
        animations.forEach(function (name)
        {
            var value = EasingEncoding[name];
            expect(EasingNaming[value]).toBeDefined();
        });
    });

    it('should map 0 to None', function ()
    {
        expect(EasingNaming[0]).toBe('None');
    });

    it('should map 1 to Linear (last key with value 1)', function ()
    {
        expect(EasingNaming[1]).toBe('Linear');
    });

    it('should map 2 to Gravity', function ()
    {
        expect(EasingNaming[2]).toBe('Gravity');
    });

    it('should map 10 to Quad.easeOut (last key with value 10)', function ()
    {
        expect(EasingNaming[10]).toBe('Quad.easeOut');
    });

    it('should map 11 to Quad.easeIn', function ()
    {
        expect(EasingNaming[11]).toBe('Quad.easeIn');
    });

    it('should map 12 to Quad.easeInOut', function ()
    {
        expect(EasingNaming[12]).toBe('Quad.easeInOut');
    });

    it('should map 20 to Cubic.easeOut', function ()
    {
        expect(EasingNaming[20]).toBe('Cubic.easeOut');
    });

    it('should map 21 to Cubic.easeIn', function ()
    {
        expect(EasingNaming[21]).toBe('Cubic.easeIn');
    });

    it('should map 22 to Cubic.easeInOut', function ()
    {
        expect(EasingNaming[22]).toBe('Cubic.easeInOut');
    });

    it('should map 30 to Quart.easeOut', function ()
    {
        expect(EasingNaming[30]).toBe('Quart.easeOut');
    });

    it('should map 31 to Quart.easeIn', function ()
    {
        expect(EasingNaming[31]).toBe('Quart.easeIn');
    });

    it('should map 32 to Quart.easeInOut', function ()
    {
        expect(EasingNaming[32]).toBe('Quart.easeInOut');
    });

    it('should map 40 to Quint.easeOut', function ()
    {
        expect(EasingNaming[40]).toBe('Quint.easeOut');
    });

    it('should map 41 to Quint.easeIn', function ()
    {
        expect(EasingNaming[41]).toBe('Quint.easeIn');
    });

    it('should map 42 to Quint.easeInOut', function ()
    {
        expect(EasingNaming[42]).toBe('Quint.easeInOut');
    });

    it('should map 50 to Sine.easeOut', function ()
    {
        expect(EasingNaming[50]).toBe('Sine.easeOut');
    });

    it('should map 51 to Sine.easeIn', function ()
    {
        expect(EasingNaming[51]).toBe('Sine.easeIn');
    });

    it('should map 52 to Sine.easeInOut', function ()
    {
        expect(EasingNaming[52]).toBe('Sine.easeInOut');
    });

    it('should map 60 to Expo.easeOut', function ()
    {
        expect(EasingNaming[60]).toBe('Expo.easeOut');
    });

    it('should map 61 to Expo.easeIn', function ()
    {
        expect(EasingNaming[61]).toBe('Expo.easeIn');
    });

    it('should map 62 to Expo.easeInOut', function ()
    {
        expect(EasingNaming[62]).toBe('Expo.easeInOut');
    });

    it('should map 70 to Circ.easeOut', function ()
    {
        expect(EasingNaming[70]).toBe('Circ.easeOut');
    });

    it('should map 71 to Circ.easeIn', function ()
    {
        expect(EasingNaming[71]).toBe('Circ.easeIn');
    });

    it('should map 72 to Circ.easeInOut', function ()
    {
        expect(EasingNaming[72]).toBe('Circ.easeInOut');
    });

    it('should map 90 to Back.easeOut', function ()
    {
        expect(EasingNaming[90]).toBe('Back.easeOut');
    });

    it('should map 91 to Back.easeIn', function ()
    {
        expect(EasingNaming[91]).toBe('Back.easeIn');
    });

    it('should map 92 to Back.easeInOut', function ()
    {
        expect(EasingNaming[92]).toBe('Back.easeInOut');
    });

    it('should map 100 to Bounce.easeOut', function ()
    {
        expect(EasingNaming[100]).toBe('Bounce.easeOut');
    });

    it('should map 101 to Bounce.easeIn', function ()
    {
        expect(EasingNaming[101]).toBe('Bounce.easeIn');
    });

    it('should map 102 to Bounce.easeInOut', function ()
    {
        expect(EasingNaming[102]).toBe('Bounce.easeInOut');
    });

    it('should map 110 to Stepped', function ()
    {
        expect(EasingNaming[110]).toBe('Stepped');
    });

    it('should map 120 to Smoothstep.easeOut', function ()
    {
        expect(EasingNaming[120]).toBe('Smoothstep.easeOut');
    });

    it('should map 121 to Smoothstep.easeIn', function ()
    {
        expect(EasingNaming[121]).toBe('Smoothstep.easeIn');
    });

    it('should map 122 to Smoothstep.easeInOut', function ()
    {
        expect(EasingNaming[122]).toBe('Smoothstep.easeInOut');
    });

    it('should not contain a mapping for undefined encoding values', function ()
    {
        expect(EasingNaming[999]).toBeUndefined();
        expect(EasingNaming[-1]).toBeUndefined();
    });

    it('should use the last key when multiple keys share the same value', function ()
    {
        // Power0 and Linear both map to 1; Linear is last so it wins
        expect(EasingNaming[1]).toBe('Linear');
        // Power1, Quad, and Quad.easeOut all map to 10; Quad.easeOut is last
        expect(EasingNaming[10]).toBe('Quad.easeOut');
        // Power2, Cubic, and Cubic.easeOut all map to 20; Cubic.easeOut is last
        expect(EasingNaming[20]).toBe('Cubic.easeOut');
    });

    it('should produce values that are valid EasingEncoding keys', function ()
    {
        var values = Object.values(EasingNaming);
        values.forEach(function (name)
        {
            expect(EasingEncoding[name]).toBeDefined();
        });
    });

    it('should round-trip: EasingEncoding[EasingNaming[n]] equals n for all mapped values', function ()
    {
        var keys = Object.keys(EasingNaming);
        keys.forEach(function (key)
        {
            var num = parseInt(key, 10);
            var name = EasingNaming[num];
            expect(EasingEncoding[name]).toBe(num);
        });
    });
});
