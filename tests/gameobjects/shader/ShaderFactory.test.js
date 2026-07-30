var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

describe('ShaderFactory', function ()
{
    it('should be importable', function ()
    {
        expect(function ()
        {
            require('../../../src/gameobjects/shader/ShaderFactory');
        }).not.toThrow();
    });

    it('should register a shader factory method on GameObjectFactory', function ()
    {
        require('../../../src/gameobjects/shader/ShaderFactory');

        expect(typeof GameObjectFactory.prototype.shader).toBe('function');
    });
});
