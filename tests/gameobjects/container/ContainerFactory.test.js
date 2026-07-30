var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

// Requiring the factory file triggers GameObjectFactory.register('container', ...)
require('../../../src/gameobjects/container/ContainerFactory');

describe('ContainerFactory', function ()
{
    it('should register a container method on GameObjectFactory prototype', function ()
    {
        expect(typeof GameObjectFactory.prototype.container).toBe('function');
    });

    it('should not re-register if container already exists on the prototype', function ()
    {
        var original = GameObjectFactory.prototype.container;

        // Calling register again should not overwrite because of the hasOwnProperty guard
        GameObjectFactory.register('container', function () { return 'overwritten'; });

        expect(GameObjectFactory.prototype.container).toBe(original);
    });

    it('should be importable without throwing', function ()
    {
        expect(function ()
        {
            require('../../../src/gameobjects/container/ContainerFactory');
        }).not.toThrow();
    });
});
