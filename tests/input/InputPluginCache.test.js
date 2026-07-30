var InputPluginCache = require('../../src/input/InputPluginCache');

describe('Phaser.Input.InputPluginCache', function ()
{
    afterEach(function ()
    {
        InputPluginCache.remove('testPlugin');
        InputPluginCache.remove('pluginA');
        InputPluginCache.remove('pluginB');
        InputPluginCache.remove('noInstall');
        InputPluginCache.remove('withMapping');
    });

    describe('register', function ()
    {
        it('should store a plugin entry under the given key', function ()
        {
            function MockPlugin() {}

            InputPluginCache.register('testPlugin', MockPlugin, 'mock', 'input.mock', 'mockInput');

            var entry = InputPluginCache.getPlugin('testPlugin');

            expect(entry).toBeDefined();
        });

        it('should store the plugin constructor', function ()
        {
            function MockPlugin() {}

            InputPluginCache.register('testPlugin', MockPlugin, 'mock', 'input.mock', 'mockInput');

            var entry = InputPluginCache.getPlugin('testPlugin');

            expect(entry.plugin).toBe(MockPlugin);
        });

        it('should store the mapping property', function ()
        {
            function MockPlugin() {}

            InputPluginCache.register('testPlugin', MockPlugin, 'myMapping', 'input.mock', 'mockInput');

            var entry = InputPluginCache.getPlugin('testPlugin');

            expect(entry.mapping).toBe('myMapping');
        });

        it('should store the settingsKey', function ()
        {
            function MockPlugin() {}

            InputPluginCache.register('testPlugin', MockPlugin, 'mock', 'input.myKey', 'mockInput');

            var entry = InputPluginCache.getPlugin('testPlugin');

            expect(entry.settingsKey).toBe('input.myKey');
        });

        it('should store the configKey', function ()
        {
            function MockPlugin() {}

            InputPluginCache.register('testPlugin', MockPlugin, 'mock', 'input.myKey', 'myConfigKey');

            var entry = InputPluginCache.getPlugin('testPlugin');

            expect(entry.configKey).toBe('myConfigKey');
        });

        it('should overwrite an existing entry with the same key', function ()
        {
            function PluginA() {}
            function PluginB() {}

            InputPluginCache.register('testPlugin', PluginA, 'mappingA', 'keyA', 'configA');
            InputPluginCache.register('testPlugin', PluginB, 'mappingB', 'keyB', 'configB');

            var entry = InputPluginCache.getPlugin('testPlugin');

            expect(entry.plugin).toBe(PluginB);
            expect(entry.mapping).toBe('mappingB');
        });
    });

    describe('getPlugin', function ()
    {
        it('should return undefined for an unknown key', function ()
        {
            var entry = InputPluginCache.getPlugin('nonExistentKey_xyz');

            expect(entry).toBeUndefined();
        });

        it('should return the registered plugin entry', function ()
        {
            function MockPlugin() {}

            InputPluginCache.register('testPlugin', MockPlugin, 'mock', 'input.mock', 'mockInput');

            var entry = InputPluginCache.getPlugin('testPlugin');

            expect(entry).not.toBeNull();
            expect(typeof entry).toBe('object');
        });

        it('should return the same object that was registered', function ()
        {
            function MockPlugin() {}

            InputPluginCache.register('testPlugin', MockPlugin, 'mock', 'input.mock', 'mockInput');

            var first = InputPluginCache.getPlugin('testPlugin');
            var second = InputPluginCache.getPlugin('testPlugin');

            expect(first).toBe(second);
        });
    });

    describe('remove', function ()
    {
        it('should remove a registered plugin', function ()
        {
            function MockPlugin() {}

            InputPluginCache.register('testPlugin', MockPlugin, 'mock', 'input.mock', 'mockInput');
            InputPluginCache.remove('testPlugin');

            var entry = InputPluginCache.getPlugin('testPlugin');

            expect(entry).toBeUndefined();
        });

        it('should not throw when removing a key that does not exist', function ()
        {
            expect(function ()
            {
                InputPluginCache.remove('nonExistentKey_xyz');
            }).not.toThrow();
        });

        it('should only remove the specified key', function ()
        {
            function PluginA() {}
            function PluginB() {}

            InputPluginCache.register('pluginA', PluginA, 'a', 'input.a', 'configA');
            InputPluginCache.register('pluginB', PluginB, 'b', 'input.b', 'configB');

            InputPluginCache.remove('pluginA');

            expect(InputPluginCache.getPlugin('pluginA')).toBeUndefined();
            expect(InputPluginCache.getPlugin('pluginB')).toBeDefined();
        });
    });

    describe('install', function ()
    {
        it('should instantiate plugins where config key resolves to true', function ()
        {
            var instantiated = false;

            function MockPlugin(target)
            {
                instantiated = true;
            }

            InputPluginCache.register('testPlugin', MockPlugin, 'mockProp', 'mockSetting', 'mockConfig');

            var target = {
                scene: {
                    sys: {
                        settings: { input: {} },
                        game: { config: { mockConfig: true } }
                    }
                }
            };

            InputPluginCache.install(target);

            expect(instantiated).toBe(true);
        });

        it('should assign the instantiated plugin to the mapping property on target', function ()
        {
            function MockPlugin(t) { this.owner = t; }

            InputPluginCache.register('withMapping', MockPlugin, 'myMappedProp', 'withMappingSetting', 'withMappingConfig');

            var target = {
                scene: {
                    sys: {
                        settings: { input: {} },
                        game: { config: { withMappingConfig: true } }
                    }
                }
            };

            InputPluginCache.install(target);

            expect(target.myMappedProp).toBeDefined();
            expect(target.myMappedProp instanceof MockPlugin).toBe(true);
        });

        it('should not instantiate a plugin when config key is false', function ()
        {
            var instantiated = false;

            function MockPlugin()
            {
                instantiated = true;
            }

            InputPluginCache.register('noInstall', MockPlugin, 'noInstallProp', 'noInstallSetting', 'noInstallConfig');

            var target = {
                scene: {
                    sys: {
                        settings: { input: {} },
                        game: { config: { noInstallConfig: false } }
                    }
                }
            };

            InputPluginCache.install(target);

            expect(instantiated).toBe(false);
        });

        it('should prefer the settings value over the config value when settings key is present', function ()
        {
            var instantiated = false;

            function MockPlugin()
            {
                instantiated = true;
            }

            InputPluginCache.register('testPlugin', MockPlugin, 'mockProp', 'mockSetting', 'mockConfig');

            var target = {
                scene: {
                    sys: {
                        settings: { input: { mockSetting: true } },
                        game: { config: { mockConfig: false } }
                    }
                }
            };

            InputPluginCache.install(target);

            expect(instantiated).toBe(true);
        });

        it('should pass the target to each instantiated plugin constructor', function ()
        {
            var receivedTarget = null;

            function MockPlugin(t)
            {
                receivedTarget = t;
            }

            InputPluginCache.register('testPlugin', MockPlugin, 'mockProp', 'mockSetting', 'mockConfig');

            var target = {
                scene: {
                    sys: {
                        settings: { input: {} },
                        game: { config: { mockConfig: true } }
                    }
                }
            };

            InputPluginCache.install(target);

            expect(receivedTarget).toBe(target);
        });
    });
});
