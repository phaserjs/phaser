var GameObjectFactory = require('../../../../src/gameobjects/GameObjectFactory');

describe('NoiseCell2DFactory', function ()
{
    it('should be importable', function ()
    {
        require('../../../../src/gameobjects/noise/noisecell2d/NoiseCell2DFactory');
    });

    it('should register a noisecell2d factory method on GameObjectFactory', function ()
    {
        require('../../../../src/gameobjects/noise/noisecell2d/NoiseCell2DFactory');

        expect(typeof GameObjectFactory.prototype.noisecell2d).toBe('function');
    });
});
