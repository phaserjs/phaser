var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

describe('GraphicsFactory', function ()
{
    it('should be importable', function ()
    {
        require('../../../src/gameobjects/graphics/GraphicsFactory');
    });

    it('should register a graphics factory method on GameObjectFactory', function ()
    {
        require('../../../src/gameobjects/graphics/GraphicsFactory');

        expect(typeof GameObjectFactory.prototype.graphics).toBe('function');
    });
});
