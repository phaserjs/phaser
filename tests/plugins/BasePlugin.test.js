var BasePlugin = require('../../src/plugins/BasePlugin');

describe('BasePlugin', function ()
{
    var mockPluginManager;

    beforeEach(function ()
    {
        mockPluginManager = {
            game: {
                events: {
                    once: function () {},
                    on: function () {},
                    off: function () {}
                }
            }
        };
    });

    describe('constructor', function ()
    {
        it('should store a reference to the plugin manager', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            expect(plugin.pluginManager).toBe(mockPluginManager);
        });

        it('should store a reference to the game via the plugin manager', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            expect(plugin.game).toBe(mockPluginManager.game);
        });
    });

    describe('init', function ()
    {
        it('should be callable without throwing', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            expect(function () { plugin.init(); }).not.toThrow();
        });

        it('should be callable with data argument without throwing', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            expect(function () { plugin.init({ someData: true }); }).not.toThrow();
        });

        it('should return undefined', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            expect(plugin.init()).toBeUndefined();
        });
    });

    describe('start', function ()
    {
        it('should be callable without throwing', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            expect(function () { plugin.start(); }).not.toThrow();
        });

        it('should return undefined', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            expect(plugin.start()).toBeUndefined();
        });
    });

    describe('stop', function ()
    {
        it('should be callable without throwing', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            expect(function () { plugin.stop(); }).not.toThrow();
        });

        it('should return undefined', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            expect(plugin.stop()).toBeUndefined();
        });
    });

    describe('destroy', function ()
    {
        it('should set pluginManager to null', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            plugin.destroy();
            expect(plugin.pluginManager).toBeNull();
        });

        it('should set game to null', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            plugin.destroy();
            expect(plugin.game).toBeNull();
        });

        it('should set scene to null', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            plugin.destroy();
            expect(plugin.scene).toBeNull();
        });

        it('should set systems to null', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            plugin.destroy();
            expect(plugin.systems).toBeNull();
        });

        it('should be callable without throwing', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            expect(function () { plugin.destroy(); }).not.toThrow();
        });

        it('should allow start and stop to be called before destroy', function ()
        {
            var plugin = new BasePlugin(mockPluginManager);
            plugin.init();
            plugin.start();
            plugin.stop();
            plugin.destroy();
            expect(plugin.game).toBeNull();
            expect(plugin.pluginManager).toBeNull();
        });
    });
});
