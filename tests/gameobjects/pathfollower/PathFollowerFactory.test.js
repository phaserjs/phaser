var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

describe('PathFollowerFactory', function ()
{
    it('should be importable', function ()
    {
        require('../../../src/gameobjects/pathfollower/PathFollowerFactory');
    });

    it('should register a follower factory function on GameObjectFactory', function ()
    {
        require('../../../src/gameobjects/pathfollower/PathFollowerFactory');

        expect(typeof GameObjectFactory.prototype.follower).toBe('function');
    });
});
