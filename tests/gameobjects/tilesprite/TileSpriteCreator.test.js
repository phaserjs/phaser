var GameObjectCreator = require('../../../src/gameobjects/GameObjectCreator');

describe('TileSpriteCreator', function ()
{
    it('should be importable', function ()
    {
        require('../../../src/gameobjects/tilesprite/TileSpriteCreator');
    });

    it('should register tileSprite on GameObjectCreator', function ()
    {
        require('../../../src/gameobjects/tilesprite/TileSpriteCreator');

        expect(typeof GameObjectCreator.prototype.tileSprite).toBe('function');
    });
});
