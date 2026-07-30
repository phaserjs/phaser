var GameObjectCreator = require('../../../../src/gameobjects/GameObjectCreator');

describe('NoiseCell3DCreator', function ()
{
    it('should be importable', function ()
    {
        require('../../../../src/gameobjects/noise/noisecell3d/NoiseCell3DCreator');
    });

    it('should register noisecell3d on GameObjectCreator', function ()
    {
        require('../../../../src/gameobjects/noise/noisecell3d/NoiseCell3DCreator');

        expect(typeof GameObjectCreator.register).toBe('function');
    });
});
