var EasingEncoding = require('../../../src/gameobjects/spritegpulayer/EasingEncoding');

describe('EasingEncoding', function ()
{
    it('should be importable', function ()
    {
        expect(EasingEncoding).toBeDefined();
    });

    it('should export an object', function ()
    {
        expect(typeof EasingEncoding).toBe('object');
    });

    // Base / special values

    it('should have None equal to 0', function ()
    {
        expect(EasingEncoding.None).toBe(0);
    });

    it('should have Gravity equal to 2', function ()
    {
        expect(EasingEncoding.Gravity).toBe(2);
    });

    // Power / Linear aliases

    it('should have Power0 equal to 1', function ()
    {
        expect(EasingEncoding.Power0).toBe(1);
    });

    it('should have Linear equal to 1 (same as Power0)', function ()
    {
        expect(EasingEncoding.Linear).toBe(1);
    });

    it('should have Power1 equal to 10', function ()
    {
        expect(EasingEncoding.Power1).toBe(10);
    });

    it('should have Power2 equal to 20', function ()
    {
        expect(EasingEncoding.Power2).toBe(20);
    });

    it('should have Power3 equal to 30', function ()
    {
        expect(EasingEncoding.Power3).toBe(30);
    });

    it('should have Power4 equal to 40', function ()
    {
        expect(EasingEncoding.Power4).toBe(40);
    });

    // Quad

    it('should have Quad equal to 10', function ()
    {
        expect(EasingEncoding.Quad).toBe(10);
    });

    it('should have Quad.easeOut equal to 10', function ()
    {
        expect(EasingEncoding['Quad.easeOut']).toBe(10);
    });

    it('should have Quad.easeIn equal to 11', function ()
    {
        expect(EasingEncoding['Quad.easeIn']).toBe(11);
    });

    it('should have Quad.easeInOut equal to 12', function ()
    {
        expect(EasingEncoding['Quad.easeInOut']).toBe(12);
    });

    // Cubic

    it('should have Cubic equal to 20', function ()
    {
        expect(EasingEncoding.Cubic).toBe(20);
    });

    it('should have Cubic.easeOut equal to 20', function ()
    {
        expect(EasingEncoding['Cubic.easeOut']).toBe(20);
    });

    it('should have Cubic.easeIn equal to 21', function ()
    {
        expect(EasingEncoding['Cubic.easeIn']).toBe(21);
    });

    it('should have Cubic.easeInOut equal to 22', function ()
    {
        expect(EasingEncoding['Cubic.easeInOut']).toBe(22);
    });

    // Quart

    it('should have Quart equal to 30', function ()
    {
        expect(EasingEncoding.Quart).toBe(30);
    });

    it('should have Quart.easeOut equal to 30', function ()
    {
        expect(EasingEncoding['Quart.easeOut']).toBe(30);
    });

    it('should have Quart.easeIn equal to 31', function ()
    {
        expect(EasingEncoding['Quart.easeIn']).toBe(31);
    });

    it('should have Quart.easeInOut equal to 32', function ()
    {
        expect(EasingEncoding['Quart.easeInOut']).toBe(32);
    });

    // Quint

    it('should have Quint equal to 40', function ()
    {
        expect(EasingEncoding.Quint).toBe(40);
    });

    it('should have Quint.easeOut equal to 40', function ()
    {
        expect(EasingEncoding['Quint.easeOut']).toBe(40);
    });

    it('should have Quint.easeIn equal to 41', function ()
    {
        expect(EasingEncoding['Quint.easeIn']).toBe(41);
    });

    it('should have Quint.easeInOut equal to 42', function ()
    {
        expect(EasingEncoding['Quint.easeInOut']).toBe(42);
    });

    // Sine

    it('should have Sine equal to 50', function ()
    {
        expect(EasingEncoding.Sine).toBe(50);
    });

    it('should have Sine.easeOut equal to 50', function ()
    {
        expect(EasingEncoding['Sine.easeOut']).toBe(50);
    });

    it('should have Sine.easeIn equal to 51', function ()
    {
        expect(EasingEncoding['Sine.easeIn']).toBe(51);
    });

    it('should have Sine.easeInOut equal to 52', function ()
    {
        expect(EasingEncoding['Sine.easeInOut']).toBe(52);
    });

    // Expo

    it('should have Expo equal to 60', function ()
    {
        expect(EasingEncoding.Expo).toBe(60);
    });

    it('should have Expo.easeOut equal to 60', function ()
    {
        expect(EasingEncoding['Expo.easeOut']).toBe(60);
    });

    it('should have Expo.easeIn equal to 61', function ()
    {
        expect(EasingEncoding['Expo.easeIn']).toBe(61);
    });

    it('should have Expo.easeInOut equal to 62', function ()
    {
        expect(EasingEncoding['Expo.easeInOut']).toBe(62);
    });

    // Circ

    it('should have Circ equal to 70', function ()
    {
        expect(EasingEncoding.Circ).toBe(70);
    });

    it('should have Circ.easeOut equal to 70', function ()
    {
        expect(EasingEncoding['Circ.easeOut']).toBe(70);
    });

    it('should have Circ.easeIn equal to 71', function ()
    {
        expect(EasingEncoding['Circ.easeIn']).toBe(71);
    });

    it('should have Circ.easeInOut equal to 72', function ()
    {
        expect(EasingEncoding['Circ.easeInOut']).toBe(72);
    });

    // Back

    it('should have Back equal to 90', function ()
    {
        expect(EasingEncoding.Back).toBe(90);
    });

    it('should have Back.easeOut equal to 90', function ()
    {
        expect(EasingEncoding['Back.easeOut']).toBe(90);
    });

    it('should have Back.easeIn equal to 91', function ()
    {
        expect(EasingEncoding['Back.easeIn']).toBe(91);
    });

    it('should have Back.easeInOut equal to 92', function ()
    {
        expect(EasingEncoding['Back.easeInOut']).toBe(92);
    });

    // Bounce

    it('should have Bounce equal to 100', function ()
    {
        expect(EasingEncoding.Bounce).toBe(100);
    });

    it('should have Bounce.easeOut equal to 100', function ()
    {
        expect(EasingEncoding['Bounce.easeOut']).toBe(100);
    });

    it('should have Bounce.easeIn equal to 101', function ()
    {
        expect(EasingEncoding['Bounce.easeIn']).toBe(101);
    });

    it('should have Bounce.easeInOut equal to 102', function ()
    {
        expect(EasingEncoding['Bounce.easeInOut']).toBe(102);
    });

    // Stepped

    it('should have Stepped equal to 110', function ()
    {
        expect(EasingEncoding.Stepped).toBe(110);
    });

    // Smoothstep

    it('should have Smoothstep equal to 120', function ()
    {
        expect(EasingEncoding.Smoothstep).toBe(120);
    });

    it('should have Smoothstep.easeOut equal to 120', function ()
    {
        expect(EasingEncoding['Smoothstep.easeOut']).toBe(120);
    });

    it('should have Smoothstep.easeIn equal to 121', function ()
    {
        expect(EasingEncoding['Smoothstep.easeIn']).toBe(121);
    });

    it('should have Smoothstep.easeInOut equal to 122', function ()
    {
        expect(EasingEncoding['Smoothstep.easeInOut']).toBe(122);
    });

    // Elastic should not be present (commented out in source)

    it('should not have Elastic defined', function ()
    {
        expect(EasingEncoding.Elastic).toBeUndefined();
    });

    it('should not have Elastic.easeIn defined', function ()
    {
        expect(EasingEncoding['Elastic.easeIn']).toBeUndefined();
    });

    it('should not have Elastic.easeOut defined', function ()
    {
        expect(EasingEncoding['Elastic.easeOut']).toBeUndefined();
    });

    it('should not have Elastic.easeInOut defined', function ()
    {
        expect(EasingEncoding['Elastic.easeInOut']).toBeUndefined();
    });

    // Alias consistency checks

    it('should have easeOut variants equal to the base value for each family', function ()
    {
        expect(EasingEncoding['Quad.easeOut']).toBe(EasingEncoding.Quad);
        expect(EasingEncoding['Cubic.easeOut']).toBe(EasingEncoding.Cubic);
        expect(EasingEncoding['Quart.easeOut']).toBe(EasingEncoding.Quart);
        expect(EasingEncoding['Quint.easeOut']).toBe(EasingEncoding.Quint);
        expect(EasingEncoding['Sine.easeOut']).toBe(EasingEncoding.Sine);
        expect(EasingEncoding['Expo.easeOut']).toBe(EasingEncoding.Expo);
        expect(EasingEncoding['Circ.easeOut']).toBe(EasingEncoding.Circ);
        expect(EasingEncoding['Back.easeOut']).toBe(EasingEncoding.Back);
        expect(EasingEncoding['Bounce.easeOut']).toBe(EasingEncoding.Bounce);
        expect(EasingEncoding['Smoothstep.easeOut']).toBe(EasingEncoding.Smoothstep);
    });

    it('should have easeIn variants equal to base + 1', function ()
    {
        expect(EasingEncoding['Quad.easeIn']).toBe(EasingEncoding.Quad + 1);
        expect(EasingEncoding['Cubic.easeIn']).toBe(EasingEncoding.Cubic + 1);
        expect(EasingEncoding['Quart.easeIn']).toBe(EasingEncoding.Quart + 1);
        expect(EasingEncoding['Quint.easeIn']).toBe(EasingEncoding.Quint + 1);
        expect(EasingEncoding['Sine.easeIn']).toBe(EasingEncoding.Sine + 1);
        expect(EasingEncoding['Expo.easeIn']).toBe(EasingEncoding.Expo + 1);
        expect(EasingEncoding['Circ.easeIn']).toBe(EasingEncoding.Circ + 1);
        expect(EasingEncoding['Back.easeIn']).toBe(EasingEncoding.Back + 1);
        expect(EasingEncoding['Bounce.easeIn']).toBe(EasingEncoding.Bounce + 1);
        expect(EasingEncoding['Smoothstep.easeIn']).toBe(EasingEncoding.Smoothstep + 1);
    });

    it('should have easeInOut variants equal to base + 2', function ()
    {
        expect(EasingEncoding['Quad.easeInOut']).toBe(EasingEncoding.Quad + 2);
        expect(EasingEncoding['Cubic.easeInOut']).toBe(EasingEncoding.Cubic + 2);
        expect(EasingEncoding['Quart.easeInOut']).toBe(EasingEncoding.Quart + 2);
        expect(EasingEncoding['Quint.easeInOut']).toBe(EasingEncoding.Quint + 2);
        expect(EasingEncoding['Sine.easeInOut']).toBe(EasingEncoding.Sine + 2);
        expect(EasingEncoding['Expo.easeInOut']).toBe(EasingEncoding.Expo + 2);
        expect(EasingEncoding['Circ.easeInOut']).toBe(EasingEncoding.Circ + 2);
        expect(EasingEncoding['Back.easeInOut']).toBe(EasingEncoding.Back + 2);
        expect(EasingEncoding['Bounce.easeInOut']).toBe(EasingEncoding.Bounce + 2);
        expect(EasingEncoding['Smoothstep.easeInOut']).toBe(EasingEncoding.Smoothstep + 2);
    });

    it('should have all values as non-negative integers', function ()
    {
        var keys = Object.keys(EasingEncoding);

        for (var i = 0; i < keys.length; i++)
        {
            var value = EasingEncoding[keys[i]];

            expect(typeof value).toBe('number');
            expect(value).toBeGreaterThanOrEqual(0);
            expect(Number.isInteger(value)).toBe(true);
        }
    });
});
