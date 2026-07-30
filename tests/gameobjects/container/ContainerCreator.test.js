var GameObjectCreator = require('../../../src/gameobjects/GameObjectCreator');

describe('ContainerCreator', function ()
{
    it('should be importable', function ()
    {
        // ContainerCreator registers itself onto GameObjectCreator as a side
        // effect of being required. The full creator function cannot be exercised
        // in a headless Node environment because Container extends a chain of
        // Phaser Game Objects that depend on Canvas / WebGL / DOM APIs.
        // We verify only that the module loads cleanly and registers its method.
        require('../../../src/gameobjects/container/ContainerCreator');

        expect(typeof GameObjectCreator.prototype.container).toBe('function');
    });
});
