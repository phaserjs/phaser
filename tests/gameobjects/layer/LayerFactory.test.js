var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

describe('LayerFactory', function ()
{
    it('should be importable', function ()
    {
        require('../../../src/gameobjects/layer/LayerFactory');
    });

    it('should register a layer factory method on GameObjectFactory', function ()
    {
        require('../../../src/gameobjects/layer/LayerFactory');

        expect(typeof GameObjectFactory.prototype.layer).toBe('function');
    });
});
