var GameObjectCreator = require('../../../src/gameobjects/GameObjectCreator');
require('../../../src/gameobjects/gradient/GradientCreator');

describe('GradientCreator', function ()
{
    it('should register a gradient factory on GameObjectCreator', function ()
    {
        expect(typeof GameObjectCreator.prototype.gradient).toBe('function');
    });
});
