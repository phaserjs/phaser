var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

describe('ExternFactory', function ()
{
    it('should be importable', function ()
    {
        expect(function ()
        {
            require('../../../src/gameobjects/extern/ExternFactory');
        }).not.toThrow();
    });

    it('should register the extern factory method on GameObjectFactory', function ()
    {
        require('../../../src/gameobjects/extern/ExternFactory');

        expect(typeof GameObjectFactory.prototype.extern).toBe('function');
    });
});
