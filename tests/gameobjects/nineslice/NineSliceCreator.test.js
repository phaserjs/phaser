var GameObjectCreator = require('../../../src/gameobjects/GameObjectCreator');

describe('NineSliceCreator', function ()
{
    it('should be importable without errors', function ()
    {
        expect(function ()
        {
            require('../../../src/gameobjects/nineslice/NineSliceCreator');
        }).not.toThrow();
    });

    it('should register the nineslice creator on GameObjectCreator', function ()
    {
        require('../../../src/gameobjects/nineslice/NineSliceCreator');

        expect(typeof GameObjectCreator.prototype.nineslice).toBe('function');
    });
});
