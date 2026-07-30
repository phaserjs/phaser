var EaseMap = require('../../../src/math/easing/EaseMap');
var Linear = require('../../../src/math/easing/linear');
var Quadratic = require('../../../src/math/easing/quadratic');
var Cubic = require('../../../src/math/easing/cubic');
var Quartic = require('../../../src/math/easing/quartic');
var Quintic = require('../../../src/math/easing/quintic');
var Sine = require('../../../src/math/easing/sine');
var Expo = require('../../../src/math/easing/expo');
var Circular = require('../../../src/math/easing/circular');
var Elastic = require('../../../src/math/easing/elastic');
var Back = require('../../../src/math/easing/back');
var Bounce = require('../../../src/math/easing/bounce');
var Stepped = require('../../../src/math/easing/stepped');

describe('EaseMap', function ()
{
    it('should be importable', function ()
    {
        expect(EaseMap).toBeDefined();
    });

    it('should be a plain object', function ()
    {
        expect(typeof EaseMap).toBe('object');
        expect(EaseMap).not.toBeNull();
    });

    describe('Power aliases', function ()
    {
        it('should map Power0 to Linear', function ()
        {
            expect(EaseMap.Power0).toBe(Linear);
        });

        it('should map Power1 to Quadratic.Out', function ()
        {
            expect(EaseMap.Power1).toBe(Quadratic.Out);
        });

        it('should map Power2 to Cubic.Out', function ()
        {
            expect(EaseMap.Power2).toBe(Cubic.Out);
        });

        it('should map Power3 to Quartic.Out', function ()
        {
            expect(EaseMap.Power3).toBe(Quartic.Out);
        });

        it('should map Power4 to Quintic.Out', function ()
        {
            expect(EaseMap.Power4).toBe(Quintic.Out);
        });
    });

    describe('Short name aliases', function ()
    {
        it('should map Linear to Linear', function ()
        {
            expect(EaseMap.Linear).toBe(Linear);
        });

        it('should map Quad to Quadratic.Out', function ()
        {
            expect(EaseMap.Quad).toBe(Quadratic.Out);
        });

        it('should map Cubic to Cubic.Out', function ()
        {
            expect(EaseMap.Cubic).toBe(Cubic.Out);
        });

        it('should map Quart to Quartic.Out', function ()
        {
            expect(EaseMap.Quart).toBe(Quartic.Out);
        });

        it('should map Quint to Quintic.Out', function ()
        {
            expect(EaseMap.Quint).toBe(Quintic.Out);
        });

        it('should map Sine to Sine.Out', function ()
        {
            expect(EaseMap.Sine).toBe(Sine.Out);
        });

        it('should map Expo to Expo.Out', function ()
        {
            expect(EaseMap.Expo).toBe(Expo.Out);
        });

        it('should map Circ to Circular.Out', function ()
        {
            expect(EaseMap.Circ).toBe(Circular.Out);
        });

        it('should map Elastic to Elastic.Out', function ()
        {
            expect(EaseMap.Elastic).toBe(Elastic.Out);
        });

        it('should map Back to Back.Out', function ()
        {
            expect(EaseMap.Back).toBe(Back.Out);
        });

        it('should map Bounce to Bounce.Out', function ()
        {
            expect(EaseMap.Bounce).toBe(Bounce.Out);
        });

        it('should map Stepped to Stepped', function ()
        {
            expect(EaseMap.Stepped).toBe(Stepped);
        });
    });

    describe('easeIn variants', function ()
    {
        it('should map Quad.easeIn to Quadratic.In', function ()
        {
            expect(EaseMap['Quad.easeIn']).toBe(Quadratic.In);
        });

        it('should map Cubic.easeIn to Cubic.In', function ()
        {
            expect(EaseMap['Cubic.easeIn']).toBe(Cubic.In);
        });

        it('should map Quart.easeIn to Quartic.In', function ()
        {
            expect(EaseMap['Quart.easeIn']).toBe(Quartic.In);
        });

        it('should map Quint.easeIn to Quintic.In', function ()
        {
            expect(EaseMap['Quint.easeIn']).toBe(Quintic.In);
        });

        it('should map Sine.easeIn to Sine.In', function ()
        {
            expect(EaseMap['Sine.easeIn']).toBe(Sine.In);
        });

        it('should map Expo.easeIn to Expo.In', function ()
        {
            expect(EaseMap['Expo.easeIn']).toBe(Expo.In);
        });

        it('should map Circ.easeIn to Circular.In', function ()
        {
            expect(EaseMap['Circ.easeIn']).toBe(Circular.In);
        });

        it('should map Elastic.easeIn to Elastic.In', function ()
        {
            expect(EaseMap['Elastic.easeIn']).toBe(Elastic.In);
        });

        it('should map Back.easeIn to Back.In', function ()
        {
            expect(EaseMap['Back.easeIn']).toBe(Back.In);
        });

        it('should map Bounce.easeIn to Bounce.In', function ()
        {
            expect(EaseMap['Bounce.easeIn']).toBe(Bounce.In);
        });
    });

    describe('easeOut variants', function ()
    {
        it('should map Quad.easeOut to Quadratic.Out', function ()
        {
            expect(EaseMap['Quad.easeOut']).toBe(Quadratic.Out);
        });

        it('should map Cubic.easeOut to Cubic.Out', function ()
        {
            expect(EaseMap['Cubic.easeOut']).toBe(Cubic.Out);
        });

        it('should map Quart.easeOut to Quartic.Out', function ()
        {
            expect(EaseMap['Quart.easeOut']).toBe(Quartic.Out);
        });

        it('should map Quint.easeOut to Quintic.Out', function ()
        {
            expect(EaseMap['Quint.easeOut']).toBe(Quintic.Out);
        });

        it('should map Sine.easeOut to Sine.Out', function ()
        {
            expect(EaseMap['Sine.easeOut']).toBe(Sine.Out);
        });

        it('should map Expo.easeOut to Expo.Out', function ()
        {
            expect(EaseMap['Expo.easeOut']).toBe(Expo.Out);
        });

        it('should map Circ.easeOut to Circular.Out', function ()
        {
            expect(EaseMap['Circ.easeOut']).toBe(Circular.Out);
        });

        it('should map Elastic.easeOut to Elastic.Out', function ()
        {
            expect(EaseMap['Elastic.easeOut']).toBe(Elastic.Out);
        });

        it('should map Back.easeOut to Back.Out', function ()
        {
            expect(EaseMap['Back.easeOut']).toBe(Back.Out);
        });

        it('should map Bounce.easeOut to Bounce.Out', function ()
        {
            expect(EaseMap['Bounce.easeOut']).toBe(Bounce.Out);
        });
    });

    describe('easeInOut variants', function ()
    {
        it('should map Quad.easeInOut to Quadratic.InOut', function ()
        {
            expect(EaseMap['Quad.easeInOut']).toBe(Quadratic.InOut);
        });

        it('should map Cubic.easeInOut to Cubic.InOut', function ()
        {
            expect(EaseMap['Cubic.easeInOut']).toBe(Cubic.InOut);
        });

        it('should map Quart.easeInOut to Quartic.InOut', function ()
        {
            expect(EaseMap['Quart.easeInOut']).toBe(Quartic.InOut);
        });

        it('should map Quint.easeInOut to Quintic.InOut', function ()
        {
            expect(EaseMap['Quint.easeInOut']).toBe(Quintic.InOut);
        });

        it('should map Sine.easeInOut to Sine.InOut', function ()
        {
            expect(EaseMap['Sine.easeInOut']).toBe(Sine.InOut);
        });

        it('should map Expo.easeInOut to Expo.InOut', function ()
        {
            expect(EaseMap['Expo.easeInOut']).toBe(Expo.InOut);
        });

        it('should map Circ.easeInOut to Circular.InOut', function ()
        {
            expect(EaseMap['Circ.easeInOut']).toBe(Circular.InOut);
        });

        it('should map Elastic.easeInOut to Elastic.InOut', function ()
        {
            expect(EaseMap['Elastic.easeInOut']).toBe(Elastic.InOut);
        });

        it('should map Back.easeInOut to Back.InOut', function ()
        {
            expect(EaseMap['Back.easeInOut']).toBe(Back.InOut);
        });

        it('should map Bounce.easeInOut to Bounce.InOut', function ()
        {
            expect(EaseMap['Bounce.easeInOut']).toBe(Bounce.InOut);
        });
    });

    describe('all mapped values are functions', function ()
    {
        it('should have all entries as callable functions', function ()
        {
            var keys = Object.keys(EaseMap);

            for (var i = 0; i < keys.length; i++)
            {
                expect(typeof EaseMap[keys[i]]).toBe('function');
            }
        });
    });

    describe('consistency between aliases', function ()
    {
        it('should have Power1 and Quad point to the same function', function ()
        {
            expect(EaseMap.Power1).toBe(EaseMap.Quad);
        });

        it('should have Power2 and Cubic point to the same function', function ()
        {
            expect(EaseMap.Power2).toBe(EaseMap.Cubic);
        });

        it('should have Power3 and Quart point to the same function', function ()
        {
            expect(EaseMap.Power3).toBe(EaseMap.Quart);
        });

        it('should have Power4 and Quint point to the same function', function ()
        {
            expect(EaseMap.Power4).toBe(EaseMap.Quint);
        });

        it('should have Quad and Quad.easeOut point to the same function', function ()
        {
            expect(EaseMap.Quad).toBe(EaseMap['Quad.easeOut']);
        });

        it('should have Cubic and Cubic.easeOut point to the same function', function ()
        {
            expect(EaseMap.Cubic).toBe(EaseMap['Cubic.easeOut']);
        });

        it('should have Sine and Sine.easeOut point to the same function', function ()
        {
            expect(EaseMap.Sine).toBe(EaseMap['Sine.easeOut']);
        });

        it('should have Expo and Expo.easeOut point to the same function', function ()
        {
            expect(EaseMap.Expo).toBe(EaseMap['Expo.easeOut']);
        });

        it('should have Circ and Circ.easeOut point to the same function', function ()
        {
            expect(EaseMap.Circ).toBe(EaseMap['Circ.easeOut']);
        });

        it('should have Elastic and Elastic.easeOut point to the same function', function ()
        {
            expect(EaseMap.Elastic).toBe(EaseMap['Elastic.easeOut']);
        });

        it('should have Back and Back.easeOut point to the same function', function ()
        {
            expect(EaseMap.Back).toBe(EaseMap['Back.easeOut']);
        });

        it('should have Bounce and Bounce.easeOut point to the same function', function ()
        {
            expect(EaseMap.Bounce).toBe(EaseMap['Bounce.easeOut']);
        });
    });
});
