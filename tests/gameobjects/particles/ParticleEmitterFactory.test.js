var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

describe('ParticleEmitterFactory', function ()
{
    it('should be importable', function ()
    {
        require('../../../src/gameobjects/particles/ParticleEmitterFactory');
    });

    it('should register a particles factory method on GameObjectFactory', function ()
    {
        require('../../../src/gameobjects/particles/ParticleEmitterFactory');

        expect(typeof GameObjectFactory.prototype.particles).toBe('function');
    });

    it('should log a warning when x is a string (legacy ParticleEmitterManager usage)', function ()
    {
        require('../../../src/gameobjects/particles/ParticleEmitterFactory');

        var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});

        var mockEmitter = { setDepth: function () {} };
        var mockDisplayList = {
            add: function (obj) { return obj; }
        };
        var mockScene = {};

        var factory = Object.create(GameObjectFactory.prototype);
        factory.scene = mockScene;
        factory.displayList = mockDisplayList;
        factory.updateList = { add: function () {} };

        try
        {
            factory.particles('myTextureKey', 0, null, {});
        }
        catch (e)
        {
            // ParticleEmitter constructor will fail without a full scene - that is expected
        }

        expect(warnSpy).toHaveBeenCalledWith(
            'ParticleEmitterManager was removed in Phaser 3.60. See documentation for details'
        );

        warnSpy.mockRestore();
    });

    it('should not log a warning when x is a number', function ()
    {
        require('../../../src/gameobjects/particles/ParticleEmitterFactory');

        var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});

        var mockDisplayList = {
            add: function (obj) { return obj; }
        };
        var mockScene = {};

        var factory = Object.create(GameObjectFactory.prototype);
        factory.scene = mockScene;
        factory.displayList = mockDisplayList;
        factory.updateList = { add: function () {} };

        try
        {
            factory.particles(100, 200, 'texture', {});
        }
        catch (e)
        {
            // ParticleEmitter constructor will fail without a full scene - that is expected
        }

        expect(warnSpy).not.toHaveBeenCalled();

        warnSpy.mockRestore();
    });

    it('should not log a warning when x is undefined', function ()
    {
        require('../../../src/gameobjects/particles/ParticleEmitterFactory');

        var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});

        var mockDisplayList = {
            add: function (obj) { return obj; }
        };
        var mockScene = {};

        var factory = Object.create(GameObjectFactory.prototype);
        factory.scene = mockScene;
        factory.displayList = mockDisplayList;
        factory.updateList = { add: function () {} };

        try
        {
            factory.particles(undefined, undefined, 'texture', {});
        }
        catch (e)
        {
            // ParticleEmitter constructor will fail without a full scene - that is expected
        }

        expect(warnSpy).not.toHaveBeenCalled();

        warnSpy.mockRestore();
    });
});
