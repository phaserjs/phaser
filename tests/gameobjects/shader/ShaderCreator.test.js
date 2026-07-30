var GameObjectCreator = require('../../../src/gameobjects/GameObjectCreator');

describe('ShaderCreator', function ()
{
    it('should be importable', function ()
    {
        require('../../../src/gameobjects/shader/ShaderCreator');
    });

    it('should register a shader factory on GameObjectCreator', function ()
    {
        require('../../../src/gameobjects/shader/ShaderCreator');

        expect(typeof GameObjectCreator.prototype.shader).toBe('function');
    });
});
