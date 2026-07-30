var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

describe('TextFactory', function ()
{
    it('should be importable', function ()
    {
        require('../../../src/gameobjects/text/TextFactory');
    });

    it('should register a text factory method on GameObjectFactory', function ()
    {
        require('../../../src/gameobjects/text/TextFactory');

        expect(typeof GameObjectFactory.prototype.text).toBe('function');
    });
});
