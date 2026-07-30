var GameObjectFactory = require('../../../../src/gameobjects/GameObjectFactory');

describe('NoiseCell4DFactory', function ()
{
    it('should be importable without errors', function ()
    {
        expect(function ()
        {
            require('../../../../src/gameobjects/noise/noisecell4d/NoiseCell4DFactory');
        }).not.toThrow();
    });

    it('should register the noisecell4d factory method on GameObjectFactory prototype', function ()
    {
        require('../../../../src/gameobjects/noise/noisecell4d/NoiseCell4DFactory');

        expect(typeof GameObjectFactory.prototype.noisecell4d).toBe('function');
    });

    it('should not overwrite an existing noisecell4d registration when required again', function ()
    {
        require('../../../../src/gameobjects/noise/noisecell4d/NoiseCell4DFactory');

        var first = GameObjectFactory.prototype.noisecell4d;

        require('../../../../src/gameobjects/noise/noisecell4d/NoiseCell4DFactory');

        expect(GameObjectFactory.prototype.noisecell4d).toBe(first);
    });
});
