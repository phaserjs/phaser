var GameObjectFactory = require('../../../../src/gameobjects/GameObjectFactory');

describe('RectangleFactory', function ()
{
    it('should be importable', function ()
    {
        require('../../../../src/gameobjects/shape/rectangle/RectangleFactory');
    });

    it('should register rectangle on GameObjectFactory', function ()
    {
        require('../../../../src/gameobjects/shape/rectangle/RectangleFactory');

        expect(typeof GameObjectFactory.prototype.rectangle).toBe('function');
    });
});
