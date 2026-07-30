var GameObjectFactory = require('../../../../src/gameobjects/GameObjectFactory');

describe('DynamicBitmapTextFactory', function ()
{
    it('should be importable', function ()
    {
        // DynamicBitmapTextFactory registers itself onto GameObjectFactory as a side
        // effect of being required. The full factory function cannot be exercised in
        // a headless Node environment because DynamicBitmapText extends a chain of
        // Phaser Game Objects that depend on Canvas / WebGL / DOM APIs.
        // We verify only that the module loads cleanly and registers its method.
        require('../../../../src/gameobjects/bitmaptext/dynamic/DynamicBitmapTextFactory');

        expect(typeof GameObjectFactory.prototype.dynamicBitmapText).toBe('function');
    });
});
