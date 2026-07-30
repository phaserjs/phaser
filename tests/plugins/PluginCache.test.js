var PluginCache = require('../../src/plugins/PluginCache');

describe('PluginCache', function ()
{
    beforeEach(function ()
    {
        PluginCache.destroyCorePlugins();
        PluginCache.destroyCustomPlugins();
    });

    afterEach(function ()
    {
        PluginCache.destroyCorePlugins();
        PluginCache.destroyCustomPlugins();
    });

    describe('register', function ()
    {
        it('should register a core plugin with the given key', function ()
        {
            function MyPlugin() {}

            PluginCache.register('TestPlugin', MyPlugin, 'testPlugin');

            expect(PluginCache.hasCore('TestPlugin')).toBe(true);
        });

        it('should store the plugin constructor', function ()
        {
            function MyPlugin() {}

            PluginCache.register('TestPlugin', MyPlugin, 'testPlugin');

            var entry = PluginCache.getCore('TestPlugin');

            expect(entry.plugin).toBe(MyPlugin);
        });

        it('should store the mapping key', function ()
        {
            function MyPlugin() {}

            PluginCache.register('TestPlugin', MyPlugin, 'testPlugin');

            var entry = PluginCache.getCore('TestPlugin');

            expect(entry.mapping).toBe('testPlugin');
        });

        it('should default custom to false when not provided', function ()
        {
            function MyPlugin() {}

            PluginCache.register('TestPlugin', MyPlugin, 'testPlugin');

            var entry = PluginCache.getCore('TestPlugin');

            expect(entry.custom).toBe(false);
        });

        it('should store custom as true when provided', function ()
        {
            function MyPlugin() {}

            PluginCache.register('TestPlugin', MyPlugin, 'testPlugin', true);

            var entry = PluginCache.getCore('TestPlugin');

            expect(entry.custom).toBe(true);
        });

        it('should overwrite an existing core plugin with the same key', function ()
        {
            function PluginA() {}
            function PluginB() {}

            PluginCache.register('TestPlugin', PluginA, 'testPlugin');
            PluginCache.register('TestPlugin', PluginB, 'testPlugin2');

            var entry = PluginCache.getCore('TestPlugin');

            expect(entry.plugin).toBe(PluginB);
            expect(entry.mapping).toBe('testPlugin2');
        });
    });

    describe('registerCustom', function ()
    {
        it('should register a custom plugin with the given key', function ()
        {
            function MyPlugin() {}

            PluginCache.registerCustom('CustomPlugin', MyPlugin, 'customPlugin', null);

            expect(PluginCache.hasCustom('CustomPlugin')).toBe(true);
        });

        it('should store the plugin constructor', function ()
        {
            function MyPlugin() {}

            PluginCache.registerCustom('CustomPlugin', MyPlugin, 'customPlugin', null);

            var entry = PluginCache.getCustom('CustomPlugin');

            expect(entry.plugin).toBe(MyPlugin);
        });

        it('should store the mapping key', function ()
        {
            function MyPlugin() {}

            PluginCache.registerCustom('CustomPlugin', MyPlugin, 'customPlugin', null);

            var entry = PluginCache.getCustom('CustomPlugin');

            expect(entry.mapping).toBe('customPlugin');
        });

        it('should store the data value', function ()
        {
            function MyPlugin() {}

            var data = { foo: 'bar' };

            PluginCache.registerCustom('CustomPlugin', MyPlugin, 'customPlugin', data);

            var entry = PluginCache.getCustom('CustomPlugin');

            expect(entry.data).toBe(data);
        });

        it('should store undefined data when not provided', function ()
        {
            function MyPlugin() {}

            PluginCache.registerCustom('CustomPlugin', MyPlugin, 'customPlugin');

            var entry = PluginCache.getCustom('CustomPlugin');

            expect(entry.data).toBeUndefined();
        });
    });

    describe('hasCore', function ()
    {
        it('should return true for a registered core plugin', function ()
        {
            function MyPlugin() {}

            PluginCache.register('TestPlugin', MyPlugin, 'testPlugin');

            expect(PluginCache.hasCore('TestPlugin')).toBe(true);
        });

        it('should return false for an unregistered key', function ()
        {
            expect(PluginCache.hasCore('NonExistent')).toBe(false);
        });

        it('should return false for a key that exists in custom but not core', function ()
        {
            function MyPlugin() {}

            PluginCache.registerCustom('CustomPlugin', MyPlugin, 'customPlugin', null);

            expect(PluginCache.hasCore('CustomPlugin')).toBe(false);
        });
    });

    describe('hasCustom', function ()
    {
        it('should return true for a registered custom plugin', function ()
        {
            function MyPlugin() {}

            PluginCache.registerCustom('CustomPlugin', MyPlugin, 'customPlugin', null);

            expect(PluginCache.hasCustom('CustomPlugin')).toBe(true);
        });

        it('should return false for an unregistered key', function ()
        {
            expect(PluginCache.hasCustom('NonExistent')).toBe(false);
        });

        it('should return false for a key that exists in core but not custom', function ()
        {
            function MyPlugin() {}

            PluginCache.register('TestPlugin', MyPlugin, 'testPlugin');

            expect(PluginCache.hasCustom('TestPlugin')).toBe(false);
        });
    });

    describe('getCore', function ()
    {
        it('should return the core plugin entry for a registered key', function ()
        {
            function MyPlugin() {}

            PluginCache.register('TestPlugin', MyPlugin, 'testPlugin');

            var entry = PluginCache.getCore('TestPlugin');

            expect(entry).toBeDefined();
            expect(entry.plugin).toBe(MyPlugin);
            expect(entry.mapping).toBe('testPlugin');
            expect(entry.custom).toBe(false);
        });

        it('should return undefined for an unregistered key', function ()
        {
            var entry = PluginCache.getCore('NonExistent');

            expect(entry).toBeUndefined();
        });
    });

    describe('getCustom', function ()
    {
        it('should return the custom plugin entry for a registered key', function ()
        {
            function MyPlugin() {}

            var data = { init: true };

            PluginCache.registerCustom('CustomPlugin', MyPlugin, 'customPlugin', data);

            var entry = PluginCache.getCustom('CustomPlugin');

            expect(entry).toBeDefined();
            expect(entry.plugin).toBe(MyPlugin);
            expect(entry.mapping).toBe('customPlugin');
            expect(entry.data).toBe(data);
        });

        it('should return undefined for an unregistered key', function ()
        {
            var entry = PluginCache.getCustom('NonExistent');

            expect(entry).toBeUndefined();
        });
    });

    describe('getCustomClass', function ()
    {
        it('should return the plugin constructor for a registered custom plugin', function ()
        {
            function MyPlugin() {}

            PluginCache.registerCustom('CustomPlugin', MyPlugin, 'customPlugin', null);

            expect(PluginCache.getCustomClass('CustomPlugin')).toBe(MyPlugin);
        });

        it('should return null for an unregistered key', function ()
        {
            expect(PluginCache.getCustomClass('NonExistent')).toBeNull();
        });

        it('should not return core plugins', function ()
        {
            function MyPlugin() {}

            PluginCache.register('TestPlugin', MyPlugin, 'testPlugin');

            expect(PluginCache.getCustomClass('TestPlugin')).toBeNull();
        });
    });

    describe('remove', function ()
    {
        it('should remove a registered core plugin', function ()
        {
            function MyPlugin() {}

            PluginCache.register('TestPlugin', MyPlugin, 'testPlugin');
            PluginCache.remove('TestPlugin');

            expect(PluginCache.hasCore('TestPlugin')).toBe(false);
        });

        it('should not throw when removing a non-existent key', function ()
        {
            expect(function ()
            {
                PluginCache.remove('NonExistent');
            }).not.toThrow();
        });

        it('should not affect other registered core plugins', function ()
        {
            function PluginA() {}
            function PluginB() {}

            PluginCache.register('PluginA', PluginA, 'pluginA');
            PluginCache.register('PluginB', PluginB, 'pluginB');
            PluginCache.remove('PluginA');

            expect(PluginCache.hasCore('PluginA')).toBe(false);
            expect(PluginCache.hasCore('PluginB')).toBe(true);
        });

        it('should not remove a custom plugin with the same key', function ()
        {
            function MyPlugin() {}

            PluginCache.register('TestPlugin', MyPlugin, 'testPlugin');
            PluginCache.registerCustom('TestPlugin', MyPlugin, 'testPlugin', null);
            PluginCache.remove('TestPlugin');

            expect(PluginCache.hasCore('TestPlugin')).toBe(false);
            expect(PluginCache.hasCustom('TestPlugin')).toBe(true);
        });
    });

    describe('removeCustom', function ()
    {
        it('should remove a registered custom plugin', function ()
        {
            function MyPlugin() {}

            PluginCache.registerCustom('CustomPlugin', MyPlugin, 'customPlugin', null);
            PluginCache.removeCustom('CustomPlugin');

            expect(PluginCache.hasCustom('CustomPlugin')).toBe(false);
        });

        it('should not throw when removing a non-existent key', function ()
        {
            expect(function ()
            {
                PluginCache.removeCustom('NonExistent');
            }).not.toThrow();
        });

        it('should not affect other registered custom plugins', function ()
        {
            function PluginA() {}
            function PluginB() {}

            PluginCache.registerCustom('PluginA', PluginA, 'pluginA', null);
            PluginCache.registerCustom('PluginB', PluginB, 'pluginB', null);
            PluginCache.removeCustom('PluginA');

            expect(PluginCache.hasCustom('PluginA')).toBe(false);
            expect(PluginCache.hasCustom('PluginB')).toBe(true);
        });

        it('should not remove a core plugin with the same key', function ()
        {
            function MyPlugin() {}

            PluginCache.register('TestPlugin', MyPlugin, 'testPlugin');
            PluginCache.registerCustom('TestPlugin', MyPlugin, 'testPlugin', null);
            PluginCache.removeCustom('TestPlugin');

            expect(PluginCache.hasCustom('TestPlugin')).toBe(false);
            expect(PluginCache.hasCore('TestPlugin')).toBe(true);
        });
    });

    describe('destroyCorePlugins', function ()
    {
        it('should remove all registered core plugins', function ()
        {
            function PluginA() {}
            function PluginB() {}

            PluginCache.register('PluginA', PluginA, 'pluginA');
            PluginCache.register('PluginB', PluginB, 'pluginB');
            PluginCache.destroyCorePlugins();

            expect(PluginCache.hasCore('PluginA')).toBe(false);
            expect(PluginCache.hasCore('PluginB')).toBe(false);
        });

        it('should not throw when the core cache is already empty', function ()
        {
            expect(function ()
            {
                PluginCache.destroyCorePlugins();
            }).not.toThrow();
        });

        it('should not affect custom plugins', function ()
        {
            function PluginA() {}
            function PluginB() {}

            PluginCache.register('PluginA', PluginA, 'pluginA');
            PluginCache.registerCustom('PluginB', PluginB, 'pluginB', null);
            PluginCache.destroyCorePlugins();

            expect(PluginCache.hasCore('PluginA')).toBe(false);
            expect(PluginCache.hasCustom('PluginB')).toBe(true);
        });
    });

    describe('destroyCustomPlugins', function ()
    {
        it('should remove all registered custom plugins', function ()
        {
            function PluginA() {}
            function PluginB() {}

            PluginCache.registerCustom('PluginA', PluginA, 'pluginA', null);
            PluginCache.registerCustom('PluginB', PluginB, 'pluginB', null);
            PluginCache.destroyCustomPlugins();

            expect(PluginCache.hasCustom('PluginA')).toBe(false);
            expect(PluginCache.hasCustom('PluginB')).toBe(false);
        });

        it('should not throw when the custom cache is already empty', function ()
        {
            expect(function ()
            {
                PluginCache.destroyCustomPlugins();
            }).not.toThrow();
        });

        it('should not affect core plugins', function ()
        {
            function PluginA() {}
            function PluginB() {}

            PluginCache.register('PluginA', PluginA, 'pluginA');
            PluginCache.registerCustom('PluginB', PluginB, 'pluginB', null);
            PluginCache.destroyCustomPlugins();

            expect(PluginCache.hasCore('PluginA')).toBe(true);
            expect(PluginCache.hasCustom('PluginB')).toBe(false);
        });
    });
});
