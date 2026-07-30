var GameObjectCreator = require('../../../../src/gameobjects/GameObjectCreator');

describe('NoiseSimplex2DCreator', function ()
{
    it('should be importable and register the noisesimplex2d creator', function ()
    {
        require('../../../../src/gameobjects/noise/noisesimplex2d/NoiseSimplex2DCreator');

        expect(typeof GameObjectCreator.register).toBe('function');
    });
});
