var ArcadeSprite = require('../../../src/physics/arcade/ArcadeSprite');

describe('Sprite', function ()
{
    it('should be importable', function ()
    {
        expect(ArcadeSprite).toBeDefined();
    });

    it('should be a constructor function', function ()
    {
        expect(typeof ArcadeSprite).toBe('function');
    });
});
