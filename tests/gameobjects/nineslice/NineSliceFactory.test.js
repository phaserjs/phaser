/**
 * NineSliceFactory.test.js
 *
 * NineSliceFactory.js registers a factory method on GameObjectFactory and
 * relies on the WEBGL_RENDERER webpack define, the NineSlice class (which
 * requires a full WebGL/scene context), and GameObjectFactory (which is
 * tightly coupled to the Phaser scene system). None of these can be
 * exercised without a running Phaser game instance, so only an import
 * smoke-test is possible here.
 */

describe('NineSliceFactory', function ()
{
    it('should be importable without throwing', function ()
    {
        // WEBGL_RENDERER is a webpack define that does not exist in Node.js.
        // Defining it here prevents a ReferenceError when the module is loaded.
        if (typeof WEBGL_RENDERER === 'undefined')
        {
            global.WEBGL_RENDERER = true;
        }

        expect(function ()
        {
            require('../../../src/gameobjects/nineslice/NineSliceFactory');
        }).not.toThrow();
    });
});
