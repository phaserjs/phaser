var GameObjectCreator = require('../../../src/gameobjects/GameObjectCreator');

require('../../../src/gameobjects/particles/ParticleEmitterCreator');

describe('ParticleEmitterCreator', function ()
{
    it('should be importable', function ()
    {
        expect(GameObjectCreator).toBeDefined();
    });

    it('should register particles on GameObjectCreator prototype', function ()
    {
        expect(typeof GameObjectCreator.prototype.particles).toBe('function');
    });
});
