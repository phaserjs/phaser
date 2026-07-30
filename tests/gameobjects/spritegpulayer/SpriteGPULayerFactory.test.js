var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

describe('SpriteGPULayerFactory', function ()
{
    it('should be importable', function ()
    {
        expect(function ()
        {
            require('../../../src/gameobjects/spritegpulayer/SpriteGPULayerFactory');
        }).not.toThrow();
    });

    it('should register spriteGPULayer on GameObjectFactory prototype', function ()
    {
        require('../../../src/gameobjects/spritegpulayer/SpriteGPULayerFactory');

        expect(typeof GameObjectFactory.prototype.spriteGPULayer).toBe('function');
    });

    it('should not re-register if spriteGPULayer already exists on prototype', function ()
    {
        require('../../../src/gameobjects/spritegpulayer/SpriteGPULayerFactory');

        var original = GameObjectFactory.prototype.spriteGPULayer;

        require('../../../src/gameobjects/spritegpulayer/SpriteGPULayerFactory');

        expect(GameObjectFactory.prototype.spriteGPULayer).toBe(original);
    });
});
