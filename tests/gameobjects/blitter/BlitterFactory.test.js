var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

describe('BlitterFactory', function ()
{
    it('should be importable', function ()
    {
        require('../../../src/gameobjects/blitter/BlitterFactory');
    });

    it('should register a blitter factory method on GameObjectFactory', function ()
    {
        require('../../../src/gameobjects/blitter/BlitterFactory');

        expect(typeof GameObjectFactory.prototype.blitter).toBe('function');
    });
});
