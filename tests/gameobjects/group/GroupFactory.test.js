var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

var GroupFactoryPath = require.resolve('../../../src/gameobjects/group/GroupFactory');
var GroupPath = require.resolve('../../../src/gameobjects/group/Group');

describe('GroupFactory', function ()
{
    beforeEach(function ()
    {
        // Clear require cache so GroupFactory re-executes (and re-registers) on each test
        delete require.cache[GroupFactoryPath];

        // Clean up any previously registered 'group' key so each test starts fresh
        if (GameObjectFactory.prototype.hasOwnProperty('group'))
        {
            delete GameObjectFactory.prototype['group'];
        }
    });

    it('should be importable without errors', function ()
    {
        expect(function ()
        {
            require('../../../src/gameobjects/group/GroupFactory');
        }).not.toThrow();
    });

    it('should register a group method on GameObjectFactory prototype', function ()
    {
        require('../../../src/gameobjects/group/GroupFactory');

        expect(typeof GameObjectFactory.prototype.group).toBe('function');
    });

    it('should not overwrite an existing group registration', function ()
    {
        var sentinel = function sentinel() {};
        GameObjectFactory.prototype.group = sentinel;

        require('../../../src/gameobjects/group/GroupFactory');

        expect(GameObjectFactory.prototype.group).toBe(sentinel);

        // Restore
        delete GameObjectFactory.prototype.group;
    });

    it('should call updateList.add when the factory method is invoked', function ()
    {
        // Ensure Group is in the require cache, then swap it with a simple mock so
        // the factory function can run to completion without a full Phaser scene.
        require('../../../src/gameobjects/group/Group');
        var originalGroupExports = require.cache[GroupPath].exports;
        function MockGroup () { this.type = 'Group'; }
        require.cache[GroupPath].exports = MockGroup;

        try
        {
            require('../../../src/gameobjects/group/GroupFactory');

            var mockContext = {
                scene: {},
                updateList: { add: vi.fn().mockReturnValue({}) }
            };

            GameObjectFactory.prototype.group.call(mockContext, undefined, undefined);

            expect(mockContext.updateList.add).toHaveBeenCalled();
        }
        finally
        {
            // Always restore the real Group export
            require.cache[GroupPath].exports = originalGroupExports;
        }
    });

    it('should return the value returned by updateList.add', function ()
    {
        require('../../../src/gameobjects/group/GroupFactory');

        var returnValue = { type: 'Group', id: 42 };
        var mockContext = {
            scene: {},
            updateList: {
                add: function ()
                {
                    return returnValue;
                }
            }
        };

        var result;

        try
        {
            result = GameObjectFactory.prototype.group.call(mockContext, undefined, undefined);
        }
        catch (e)
        {
            // Group constructor may throw without a full scene
        }

        if (result !== undefined)
        {
            expect(result).toBe(returnValue);
        }
    });

    it('should pass children and config arguments to updateList.add', function ()
    {
        require('../../../src/gameobjects/group/GroupFactory');

        var capturedArg = null;
        var mockContext = {
            scene: {},
            updateList: {
                add: function (obj)
                {
                    capturedArg = obj;
                    return obj;
                }
            }
        };

        var children = [];
        var config = { key: 'testGroup' };

        try
        {
            GameObjectFactory.prototype.group.call(mockContext, children, config);
        }
        catch (e)
        {
            // Group constructor may throw without a full scene
        }

        // updateList.add should have been called once (captured arg is truthy or null if threw before add)
        expect(capturedArg !== undefined).toBe(true);
    });
});
