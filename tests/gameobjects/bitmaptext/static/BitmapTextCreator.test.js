var GameObjectCreator = require('../../../../src/gameobjects/GameObjectCreator');

describe('BitmapTextCreator', function ()
{
    it('should be importable', function ()
    {
        require('../../../../src/gameobjects/bitmaptext/static/BitmapTextCreator');
    });

    it('should register bitmapText on GameObjectCreator', function ()
    {
        require('../../../../src/gameobjects/bitmaptext/static/BitmapTextCreator');

        expect(typeof GameObjectCreator.register).toBe('function');
    });
});
