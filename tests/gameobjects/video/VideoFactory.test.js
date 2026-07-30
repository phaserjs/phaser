var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

describe('VideoFactory', function ()
{
    it('should be importable without errors', function ()
    {
        expect(function ()
        {
            require('../../../src/gameobjects/video/VideoFactory');
        }).not.toThrow();
    });

    it('should register a video method on GameObjectFactory prototype', function ()
    {
        require('../../../src/gameobjects/video/VideoFactory');

        expect(typeof GameObjectFactory.prototype.video).toBe('function');
    });

    it('should not overwrite an existing video registration', function ()
    {
        require('../../../src/gameobjects/video/VideoFactory');

        var firstRef = GameObjectFactory.prototype.video;

        // Simulate calling register again manually
        GameObjectFactory.register('video', function () { return 'overwrite'; });

        expect(GameObjectFactory.prototype.video).toBe(firstRef);
    });
});
