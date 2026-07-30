var ScenePlugin = require('../../src/plugins/ScenePlugin');

describe('ScenePlugin', function ()
{
    var mockScene;
    var mockPluginManager;
    var mockEvents;

    beforeEach(function ()
    {
        mockEvents = {
            once: vi.fn(),
            emit: vi.fn()
        };

        mockScene = {
            sys: {
                events: mockEvents
            }
        };

        mockPluginManager = {
            game: {
                events: {
                    on: vi.fn(),
                    off: vi.fn()
                }
            }
        };
    });

    describe('constructor', function ()
    {
        it('should set scene property to the provided scene', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, 'testKey');
            expect(plugin.scene).toBe(mockScene);
        });

        it('should set systems property to scene.sys', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, 'testKey');
            expect(plugin.systems).toBe(mockScene.sys);
        });

        it('should set pluginKey to the provided key', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, 'myPlugin');
            expect(plugin.pluginKey).toBe('myPlugin');
        });

        it('should set pluginKey to an empty string when empty string is provided', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, '');
            expect(plugin.pluginKey).toBe('');
        });

        it('should register a once listener for the BOOT scene event', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, 'testKey');
            expect(mockEvents.once).toHaveBeenCalled();
            var callArgs = mockEvents.once.mock.calls[0];
            expect(callArgs[1]).toBe(plugin.boot);
            expect(callArgs[2]).toBe(plugin);
        });

        it('should inherit pluginManager from BasePlugin', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, 'testKey');
            expect(plugin.pluginManager).toBe(mockPluginManager);
        });

        it('should inherit game from BasePlugin', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, 'testKey');
            expect(plugin.game).toBe(mockPluginManager.game);
        });
    });

    describe('boot', function ()
    {
        it('should be callable without throwing', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, 'testKey');
            expect(function () { plugin.boot(); }).not.toThrow();
        });

        it('should return undefined', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, 'testKey');
            expect(plugin.boot()).toBeUndefined();
        });
    });

    describe('destroy', function ()
    {
        it('should set pluginManager to null', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, 'testKey');
            plugin.destroy();
            expect(plugin.pluginManager).toBeNull();
        });

        it('should set game to null', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, 'testKey');
            plugin.destroy();
            expect(plugin.game).toBeNull();
        });

        it('should set scene to null', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, 'testKey');
            plugin.destroy();
            expect(plugin.scene).toBeNull();
        });

        it('should set systems to null', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, 'testKey');
            plugin.destroy();
            expect(plugin.systems).toBeNull();
        });

        it('should be callable multiple times without throwing', function ()
        {
            var plugin = new ScenePlugin(mockScene, mockPluginManager, 'testKey');
            plugin.destroy();
            expect(function () { plugin.destroy(); }).not.toThrow();
        });
    });
});
