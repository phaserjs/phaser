var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

describe('StampFactory', function ()
{
    it('should be importable', function ()
    {
        expect(function ()
        {
            require('../../../src/gameobjects/stamp/StampFactory');
        }).not.toThrow();
    });

    it('should register a stamp factory function on GameObjectFactory', function ()
    {
        require('../../../src/gameobjects/stamp/StampFactory');

        expect(typeof GameObjectFactory.prototype.stamp).toBe('function');
    });
});
