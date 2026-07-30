var GameObjectCreator = require('../../../src/gameobjects/GameObjectCreator');

describe('TextCreator', function ()
{
    it('should be importable', function ()
    {
        require('../../../src/gameobjects/text/TextCreator');
    });

    it('should register a text creator on GameObjectCreator', function ()
    {
        require('../../../src/gameobjects/text/TextCreator');

        expect(typeof GameObjectCreator.prototype.text).toBe('function');
    });
});
