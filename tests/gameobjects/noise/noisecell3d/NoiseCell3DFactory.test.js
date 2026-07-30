var GameObjectFactory = require('../../../../src/gameobjects/GameObjectFactory');

describe('NoiseCell3DFactory', function ()
{
    it('should be importable', function ()
    {
        require('../../../../src/gameobjects/noise/noisecell3d/NoiseCell3DFactory');
    });

    it('should register noisecell3d on GameObjectFactory prototype', function ()
    {
        require('../../../../src/gameobjects/noise/noisecell3d/NoiseCell3DFactory');

        expect(typeof GameObjectFactory.prototype.noisecell3d).toBe('function');
    });

    it('should not overwrite an existing noisecell3d registration', function ()
    {
        var original = GameObjectFactory.prototype.noisecell3d;

        require('../../../../src/gameobjects/noise/noisecell3d/NoiseCell3DFactory');

        expect(GameObjectFactory.prototype.noisecell3d).toBe(original);
    });
});
