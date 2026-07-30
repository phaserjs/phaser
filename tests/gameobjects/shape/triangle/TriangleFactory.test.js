var GameObjectFactory = require('../../../../src/gameobjects/GameObjectFactory');

describe('TriangleFactory', function ()
{
    it('should be importable', function ()
    {
        require('../../../../src/gameobjects/shape/triangle/TriangleFactory');
    });

    it('should register a triangle factory method on GameObjectFactory', function ()
    {
        require('../../../../src/gameobjects/shape/triangle/TriangleFactory');

        expect(typeof GameObjectFactory.prototype.triangle).toBe('function');
    });
});
