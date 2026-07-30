var PluginManager = require('../../src/plugins/PluginManager');
var PluginCache = require('../../src/plugins/PluginCache');
var GameObjectFactory = require('../../src/gameobjects/GameObjectFactory');
var GameObjectCreator = require('../../src/gameobjects/GameObjectCreator');
var FileTypesManager = require('../../src/loader/FileTypesManager');

describe('PluginManager', function ()
{
    var manager;
    var mockGame;

    function createMockGame ()
    {
        return {
            isBooted: false,
            config: {
                renderType: 0,
                installGlobalPlugins: [],
                installScenePlugins: [],
                defaultPlugins: [ 'corePlugin' ]
            },
            events: {
                once: vi.fn(),
                emit: vi.fn(),
                on: vi.fn(),
                off: vi.fn()
            },
            noReturn: false
        };
    }

    function createMockPluginClass ()
    {
        var MockPlugin = function MockPlugin (pluginManager)
        {
            this.pluginManager = pluginManager;
        };

        MockPlugin.prototype.init = vi.fn(function (data) { this.data = data; });
        MockPlugin.prototype.start = vi.fn();
        MockPlugin.prototype.stop = vi.fn();
        MockPlugin.prototype.destroy = vi.fn();

        return MockPlugin;
    }

    beforeEach(function ()
    {
        mockGame = createMockGame();
        manager = new PluginManager(mockGame);
    });

    afterEach(function ()
    {
        vi.restoreAllMocks();
    });

    describe('constructor', function ()
    {
        it('should set the game reference', function ()
        {
            expect(manager.game).toBe(mockGame);
        });

        it('should initialise plugins as an empty array', function ()
        {
            expect(manager.plugins).toEqual([]);
        });

        it('should initialise scenePlugins as an empty array', function ()
        {
            expect(manager.scenePlugins).toEqual([]);
        });

        it('should initialise _pendingGlobal as an empty array', function ()
        {
            expect(manager._pendingGlobal).toEqual([]);
        });

        it('should initialise _pendingScene as an empty array', function ()
        {
            expect(manager._pendingScene).toEqual([]);
        });

        it('should register for BOOT event when game is not booted', function ()
        {
            expect(mockGame.events.once).toHaveBeenCalled();
        });

        it('should call boot immediately when game is already booted', function ()
        {
            var bootedGame = createMockGame();
            bootedGame.isBooted = true;

            var bootSpy = vi.spyOn(PluginManager.prototype, 'boot').mockImplementation(function () {});

            new PluginManager(bootedGame);

            expect(bootSpy).toHaveBeenCalled();
        });
    });

    describe('getIndex', function ()
    {
        it('should return -1 when plugins array is empty', function ()
        {
            expect(manager.getIndex('test')).toBe(-1);
        });

        it('should return 0 for the first plugin', function ()
        {
            manager.plugins.push({ key: 'testPlugin', plugin: {}, active: true });

            expect(manager.getIndex('testPlugin')).toBe(0);
        });

        it('should return -1 for a key that does not exist', function ()
        {
            manager.plugins.push({ key: 'testPlugin', plugin: {}, active: true });

            expect(manager.getIndex('nonExistent')).toBe(-1);
        });

        it('should return the correct index when multiple plugins exist', function ()
        {
            manager.plugins.push({ key: 'plugin1', plugin: {}, active: true });
            manager.plugins.push({ key: 'plugin2', plugin: {}, active: true });
            manager.plugins.push({ key: 'plugin3', plugin: {}, active: true });

            expect(manager.getIndex('plugin2')).toBe(1);
            expect(manager.getIndex('plugin3')).toBe(2);
        });

        it('should return -1 when searching an empty string key', function ()
        {
            manager.plugins.push({ key: 'testPlugin', plugin: {}, active: true });

            expect(manager.getIndex('')).toBe(-1);
        });
    });

    describe('getEntry', function ()
    {
        it('should return undefined when plugins array is empty', function ()
        {
            expect(manager.getEntry('test')).toBeUndefined();
        });

        it('should return the plugin entry when it exists', function ()
        {
            var entry = { key: 'testPlugin', plugin: {}, active: true };
            manager.plugins.push(entry);

            expect(manager.getEntry('testPlugin')).toBe(entry);
        });

        it('should return undefined for a non-existent key', function ()
        {
            manager.plugins.push({ key: 'testPlugin', plugin: {}, active: true });

            expect(manager.getEntry('missing')).toBeUndefined();
        });

        it('should return the correct entry when multiple plugins exist', function ()
        {
            var entry1 = { key: 'plugin1', plugin: {}, active: true };
            var entry2 = { key: 'plugin2', plugin: {}, active: false };

            manager.plugins.push(entry1);
            manager.plugins.push(entry2);

            expect(manager.getEntry('plugin2')).toBe(entry2);
        });
    });

    describe('isActive', function ()
    {
        it('should return falsy when plugin does not exist', function ()
        {
            expect(manager.isActive('nonExistent')).toBeFalsy();
        });

        it('should return true when plugin is active', function ()
        {
            manager.plugins.push({ key: 'testPlugin', plugin: {}, active: true });

            expect(manager.isActive('testPlugin')).toBe(true);
        });

        it('should return falsy when plugin is inactive', function ()
        {
            manager.plugins.push({ key: 'testPlugin', plugin: {}, active: false });

            expect(manager.isActive('testPlugin')).toBeFalsy();
        });

        it('should return falsy when plugins array is empty', function ()
        {
            expect(manager.isActive('any')).toBeFalsy();
        });
    });

    describe('stop', function ()
    {
        it('should return this for method chaining', function ()
        {
            var result = manager.stop('nonExistent');

            expect(result).toBe(manager);
        });

        it('should set plugin active to false', function ()
        {
            var mockPlugin = { stop: vi.fn() };
            manager.plugins.push({ key: 'testPlugin', plugin: mockPlugin, active: true });

            manager.stop('testPlugin');

            expect(manager.plugins[0].active).toBe(false);
        });

        it('should call the plugin stop method', function ()
        {
            var mockPlugin = { stop: vi.fn() };
            manager.plugins.push({ key: 'testPlugin', plugin: mockPlugin, active: true });

            manager.stop('testPlugin');

            expect(mockPlugin.stop).toHaveBeenCalled();
        });

        it('should not call stop if plugin is already inactive', function ()
        {
            var mockPlugin = { stop: vi.fn() };
            manager.plugins.push({ key: 'testPlugin', plugin: mockPlugin, active: false });

            manager.stop('testPlugin');

            expect(mockPlugin.stop).not.toHaveBeenCalled();
        });

        it('should not throw when key does not exist', function ()
        {
            expect(function () { manager.stop('nonExistent'); }).not.toThrow();
        });

        it('should still return this when key does not exist', function ()
        {
            expect(manager.stop('nonExistent')).toBe(manager);
        });
    });

    describe('getDefaultScenePlugins', function ()
    {
        it('should return an array containing config defaultPlugins', function ()
        {
            var result = manager.getDefaultScenePlugins();

            expect(result).toContain('corePlugin');
        });

        it('should merge scenePlugins into the result', function ()
        {
            manager.scenePlugins.push('customPlugin');

            var result = manager.getDefaultScenePlugins();

            expect(result).toContain('corePlugin');
            expect(result).toContain('customPlugin');
        });

        it('should return just config defaults when scenePlugins is empty', function ()
        {
            var result = manager.getDefaultScenePlugins();

            expect(result).toEqual([ 'corePlugin' ]);
        });

        it('should not mutate the original config.defaultPlugins array', function ()
        {
            var original = mockGame.config.defaultPlugins.slice();
            manager.scenePlugins.push('extra');

            manager.getDefaultScenePlugins();

            expect(mockGame.config.defaultPlugins).toEqual(original);
        });

        it('should return all scenePlugins when config defaultPlugins is empty', function ()
        {
            mockGame.config.defaultPlugins = [];
            manager.scenePlugins.push('onlyCustom');

            var result = manager.getDefaultScenePlugins();

            expect(result).toEqual([ 'onlyCustom' ]);
        });
    });

    describe('install', function ()
    {
        beforeEach(function ()
        {
            vi.spyOn(PluginCache, 'hasCustom').mockReturnValue(false);
        });

        it('should return null for a non-function plugin', function ()
        {
            var result = manager.install('key', 'not a function');

            expect(result).toBeNull();
        });

        it('should return null for a null plugin', function ()
        {
            var result = manager.install('key', null);

            expect(result).toBeNull();
        });

        it('should add to _pendingGlobal when game is not booted', function ()
        {
            var MockPlugin = createMockPluginClass();

            manager.install('testKey', MockPlugin, false);

            expect(manager._pendingGlobal.length).toBe(1);
            expect(manager._pendingGlobal[0].key).toBe('testKey');
        });

        it('should store the plugin class in _pendingGlobal entry', function ()
        {
            var MockPlugin = createMockPluginClass();

            manager.install('testKey', MockPlugin, false);

            expect(manager._pendingGlobal[0].plugin).toBe(MockPlugin);
        });

        it('should store start flag in _pendingGlobal entry', function ()
        {
            var MockPlugin = createMockPluginClass();

            manager.install('testKey', MockPlugin, true);

            expect(manager._pendingGlobal[0].start).toBe(true);
        });

        it('should store mapping in _pendingGlobal entry', function ()
        {
            var MockPlugin = createMockPluginClass();

            manager.install('testKey', MockPlugin, false, 'testMapping');

            expect(manager._pendingGlobal[0].mapping).toBe('testMapping');
        });

        it('should force start to true when mapping is provided', function ()
        {
            var MockPlugin = createMockPluginClass();

            manager.install('testKey', MockPlugin, false, 'testMapping');

            expect(manager._pendingGlobal[0].start).toBe(true);
        });

        it('should store data in _pendingGlobal entry', function ()
        {
            var MockPlugin = createMockPluginClass();
            var data = { msg: 'hello' };

            manager.install('testKey', MockPlugin, false, null, data);

            expect(manager._pendingGlobal[0].data).toBe(data);
        });

        it('should warn and return null when plugin key is already in use', function ()
        {
            var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});
            vi.spyOn(PluginCache, 'hasCustom').mockReturnValue(true);

            var result = manager.install('existingKey', createMockPluginClass());

            expect(warnSpy).toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('should return null when game is not booted even if start is true', function ()
        {
            var result = manager.install('testKey', createMockPluginClass(), true);

            expect(result).toBeNull();
        });
    });

    describe('installScenePlugin', function ()
    {
        it('should warn and return for a non-function plugin', function ()
        {
            var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});

            manager.installScenePlugin('key', 'not a function');

            expect(warnSpy).toHaveBeenCalled();
        });

        it('should add the key to scenePlugins array', function ()
        {
            vi.spyOn(PluginCache, 'hasCore').mockReturnValue(false);
            vi.spyOn(PluginCache, 'register').mockImplementation(function () {});

            manager.installScenePlugin('testScenePlugin', createMockPluginClass(), 'mapping');

            expect(manager.scenePlugins).toContain('testScenePlugin');
        });

        it('should not add a duplicate key to scenePlugins', function ()
        {
            vi.spyOn(PluginCache, 'hasCore').mockReturnValue(false);
            vi.spyOn(PluginCache, 'register').mockImplementation(function () {});

            manager.installScenePlugin('testScenePlugin', createMockPluginClass(), 'mapping');
            manager.installScenePlugin('testScenePlugin', createMockPluginClass(), 'mapping');

            var count = manager.scenePlugins.filter(function (k) { return k === 'testScenePlugin'; }).length;

            expect(count).toBe(1);
        });

        it('should call PluginCache.register when key is not already in core cache', function ()
        {
            vi.spyOn(PluginCache, 'hasCore').mockReturnValue(false);
            var registerSpy = vi.spyOn(PluginCache, 'register').mockImplementation(function () {});
            var MockPlugin = createMockPluginClass();

            manager.installScenePlugin('newPlugin', MockPlugin, 'mapping');

            expect(registerSpy).toHaveBeenCalledWith('newPlugin', MockPlugin, 'mapping', true);
        });

        it('should warn when key is already in use and not from loader', function ()
        {
            var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});
            vi.spyOn(PluginCache, 'hasCore').mockReturnValueOnce(false).mockReturnValue(true);
            vi.spyOn(PluginCache, 'register').mockImplementation(function () {});

            manager.scenePlugins.push('existingPlugin');
            manager.installScenePlugin('existingPlugin', createMockPluginClass(), 'mapping', undefined, false);

            expect(warnSpy).toHaveBeenCalled();
        });
    });

    describe('removeGlobalPlugin', function ()
    {
        it('should remove the plugin entry from plugins array', function ()
        {
            var mockPlugin = { destroy: vi.fn() };
            var entry = { key: 'testPlugin', plugin: mockPlugin, active: true };
            manager.plugins.push(entry);

            vi.spyOn(PluginCache, 'removeCustom').mockImplementation(function () {});

            manager.removeGlobalPlugin('testPlugin');

            expect(manager.plugins.length).toBe(0);
        });

        it('should call PluginCache.removeCustom with the key', function ()
        {
            var removeCustomSpy = vi.spyOn(PluginCache, 'removeCustom').mockImplementation(function () {});

            manager.removeGlobalPlugin('someKey');

            expect(removeCustomSpy).toHaveBeenCalledWith('someKey');
        });

        it('should not throw when the key does not exist', function ()
        {
            vi.spyOn(PluginCache, 'removeCustom').mockImplementation(function () {});

            expect(function () { manager.removeGlobalPlugin('nonExistent'); }).not.toThrow();
        });

        it('should not remove other plugins when removing one', function ()
        {
            var entry1 = { key: 'plugin1', plugin: { destroy: vi.fn() }, active: true };
            var entry2 = { key: 'plugin2', plugin: { destroy: vi.fn() }, active: true };
            manager.plugins.push(entry1);
            manager.plugins.push(entry2);

            vi.spyOn(PluginCache, 'removeCustom').mockImplementation(function () {});

            manager.removeGlobalPlugin('plugin1');

            expect(manager.plugins.length).toBe(1);
            expect(manager.plugins[0].key).toBe('plugin2');
        });
    });

    describe('removeScenePlugin', function ()
    {
        it('should remove the key from scenePlugins array', function ()
        {
            manager.scenePlugins.push('testScenePlugin');
            vi.spyOn(PluginCache, 'remove').mockImplementation(function () {});

            manager.removeScenePlugin('testScenePlugin');

            expect(manager.scenePlugins).not.toContain('testScenePlugin');
        });

        it('should call PluginCache.remove with the key', function ()
        {
            var removeSpy = vi.spyOn(PluginCache, 'remove').mockImplementation(function () {});

            manager.removeScenePlugin('testScenePlugin');

            expect(removeSpy).toHaveBeenCalledWith('testScenePlugin');
        });

        it('should not remove other keys from scenePlugins', function ()
        {
            manager.scenePlugins.push('plugin1');
            manager.scenePlugins.push('plugin2');
            vi.spyOn(PluginCache, 'remove').mockImplementation(function () {});

            manager.removeScenePlugin('plugin1');

            expect(manager.scenePlugins).toContain('plugin2');
            expect(manager.scenePlugins.length).toBe(1);
        });

        it('should not throw when key is not in scenePlugins', function ()
        {
            vi.spyOn(PluginCache, 'remove').mockImplementation(function () {});

            expect(function () { manager.removeScenePlugin('nonExistent'); }).not.toThrow();
        });
    });

    describe('registerGameObject', function ()
    {
        it('should return this for method chaining', function ()
        {
            var result = manager.registerGameObject('testObject', function () {});

            expect(result).toBe(manager);
        });

        it('should call GameObjectFactory.register when factoryCallback is provided', function ()
        {
            var factorySpy = vi.spyOn(GameObjectFactory, 'register');
            var factoryCb = function () {};

            manager.registerGameObject('testObject', factoryCb);

            expect(factorySpy).toHaveBeenCalledWith('testObject', factoryCb);
        });

        it('should call GameObjectCreator.register when creatorCallback is provided', function ()
        {
            var creatorSpy = vi.spyOn(GameObjectCreator, 'register');
            var creatorCb = function () {};

            manager.registerGameObject('testObject', null, creatorCb);

            expect(creatorSpy).toHaveBeenCalledWith('testObject', creatorCb);
        });

        it('should register both factory and creator callbacks when both are provided', function ()
        {
            var factorySpy = vi.spyOn(GameObjectFactory, 'register');
            var creatorSpy = vi.spyOn(GameObjectCreator, 'register');
            var factoryCb = function () {};
            var creatorCb = function () {};

            manager.registerGameObject('testObject', factoryCb, creatorCb);

            expect(factorySpy).toHaveBeenCalledWith('testObject', factoryCb);
            expect(creatorSpy).toHaveBeenCalledWith('testObject', creatorCb);
        });

        it('should not call GameObjectFactory.register when factoryCallback is not provided', function ()
        {
            var factorySpy = vi.spyOn(GameObjectFactory, 'register');

            manager.registerGameObject('testObject', null, function () {});

            expect(factorySpy).not.toHaveBeenCalled();
        });

        it('should not call GameObjectCreator.register when creatorCallback is not provided', function ()
        {
            var creatorSpy = vi.spyOn(GameObjectCreator, 'register');

            manager.registerGameObject('testObject', function () {}, null);

            expect(creatorSpy).not.toHaveBeenCalled();
        });
    });

    describe('removeGameObject', function ()
    {
        it('should return this for method chaining', function ()
        {
            vi.spyOn(GameObjectFactory, 'remove').mockImplementation(function () {});
            vi.spyOn(GameObjectCreator, 'remove').mockImplementation(function () {});

            var result = manager.removeGameObject('testObject');

            expect(result).toBe(manager);
        });

        it('should remove from both factory and creator by default', function ()
        {
            var factorySpy = vi.spyOn(GameObjectFactory, 'remove').mockImplementation(function () {});
            var creatorSpy = vi.spyOn(GameObjectCreator, 'remove').mockImplementation(function () {});

            manager.removeGameObject('testObject');

            expect(factorySpy).toHaveBeenCalledWith('testObject');
            expect(creatorSpy).toHaveBeenCalledWith('testObject');
        });

        it('should call GameObjectFactory.remove when removeFromFactory is true', function ()
        {
            var factorySpy = vi.spyOn(GameObjectFactory, 'remove').mockImplementation(function () {});
            vi.spyOn(GameObjectCreator, 'remove').mockImplementation(function () {});

            manager.removeGameObject('testObject', true, false);

            expect(factorySpy).toHaveBeenCalledWith('testObject');
        });

        it('should call GameObjectCreator.remove when removeFromCreator is true', function ()
        {
            vi.spyOn(GameObjectFactory, 'remove').mockImplementation(function () {});
            var creatorSpy = vi.spyOn(GameObjectCreator, 'remove').mockImplementation(function () {});

            manager.removeGameObject('testObject', false, true);

            expect(creatorSpy).toHaveBeenCalledWith('testObject');
        });

        it('should not call GameObjectFactory.remove when removeFromFactory is false', function ()
        {
            var factorySpy = vi.spyOn(GameObjectFactory, 'remove').mockImplementation(function () {});
            vi.spyOn(GameObjectCreator, 'remove').mockImplementation(function () {});

            manager.removeGameObject('testObject', false, true);

            expect(factorySpy).not.toHaveBeenCalled();
        });

        it('should not call GameObjectCreator.remove when removeFromCreator is false', function ()
        {
            vi.spyOn(GameObjectFactory, 'remove').mockImplementation(function () {});
            var creatorSpy = vi.spyOn(GameObjectCreator, 'remove').mockImplementation(function () {});

            manager.removeGameObject('testObject', true, false);

            expect(creatorSpy).not.toHaveBeenCalled();
        });
    });

    describe('registerFileType', function ()
    {
        it('should call FileTypesManager.register with key and callback', function ()
        {
            var ftSpy = vi.spyOn(FileTypesManager, 'register').mockImplementation(function () {});
            var callback = function () {};

            manager.registerFileType('testType', callback);

            expect(ftSpy).toHaveBeenCalledWith('testType', callback);
        });

        it('should inject the callback into scene loader when addToScene is provided', function ()
        {
            vi.spyOn(FileTypesManager, 'register').mockImplementation(function () {});
            var callback = function () {};
            var mockScene = { sys: { load: {} } };

            manager.registerFileType('testType', callback, mockScene);

            expect(mockScene.sys.load['testType']).toBe(callback);
        });

        it('should not throw when addToScene is not provided', function ()
        {
            vi.spyOn(FileTypesManager, 'register').mockImplementation(function () {});

            expect(function () { manager.registerFileType('testType', function () {}); }).not.toThrow();
        });

        it('should not inject into scene when scene has no load plugin', function ()
        {
            vi.spyOn(FileTypesManager, 'register').mockImplementation(function () {});
            var mockScene = { sys: {} };

            expect(function () { manager.registerFileType('testType', function () {}, mockScene); }).not.toThrow();
        });
    });

    describe('getClass', function ()
    {
        it('should return null for an unknown plugin key', function ()
        {
            vi.spyOn(PluginCache, 'getCustomClass').mockReturnValue(null);

            expect(manager.getClass('unknown')).toBeNull();
        });

        it('should return the plugin class from PluginCache', function ()
        {
            var MockPlugin = createMockPluginClass();
            vi.spyOn(PluginCache, 'getCustomClass').mockReturnValue(MockPlugin);

            expect(manager.getClass('testPlugin')).toBe(MockPlugin);
        });

        it('should delegate to PluginCache.getCustomClass with the correct key', function ()
        {
            var spy = vi.spyOn(PluginCache, 'getCustomClass').mockReturnValue(null);

            manager.getClass('someKey');

            expect(spy).toHaveBeenCalledWith('someKey');
        });
    });

    describe('get', function ()
    {
        it('should return null when plugin key does not exist anywhere', function ()
        {
            vi.spyOn(PluginCache, 'getCustomClass').mockReturnValue(null);

            var result = manager.get('nonExistent');

            expect(result).toBeNull();
        });

        it('should return the plugin instance when entry is already in plugins array', function ()
        {
            var mockPluginInstance = { stop: vi.fn(), destroy: vi.fn() };
            manager.plugins.push({ key: 'testPlugin', plugin: mockPluginInstance, active: true });

            var result = manager.get('testPlugin');

            expect(result).toBe(mockPluginInstance);
        });

        it('should return the class without starting when autoStart is false', function ()
        {
            var MockPlugin = createMockPluginClass();
            vi.spyOn(PluginCache, 'getCustomClass').mockReturnValue(MockPlugin);

            var result = manager.get('testPlugin', false);

            expect(result).toBe(MockPlugin);
        });

        it('should return null when autoStart is true but entry cannot be created', function ()
        {
            vi.spyOn(PluginCache, 'getCustomClass').mockReturnValue(createMockPluginClass());
            vi.spyOn(PluginCache, 'getCustom').mockReturnValue(null);

            var result = manager.get('testPlugin', true);

            expect(result).toBeNull();
        });
    });

    describe('start', function ()
    {
        it('should reactivate an inactive plugin entry', function ()
        {
            var mockPluginInstance = { init: vi.fn(), start: vi.fn(), stop: vi.fn(), destroy: vi.fn() };
            manager.plugins.push({ key: 'testPlugin', plugin: mockPluginInstance, active: false });

            manager.start('testPlugin');

            expect(manager.plugins[0].active).toBe(true);
        });

        it('should call start on the plugin instance when reactivating', function ()
        {
            var mockPluginInstance = { init: vi.fn(), start: vi.fn(), stop: vi.fn(), destroy: vi.fn() };
            manager.plugins.push({ key: 'testPlugin', plugin: mockPluginInstance, active: false });

            manager.start('testPlugin');

            expect(mockPluginInstance.start).toHaveBeenCalled();
        });

        it('should return the plugin instance when reactivating', function ()
        {
            var mockPluginInstance = { init: vi.fn(), start: vi.fn(), stop: vi.fn(), destroy: vi.fn() };
            manager.plugins.push({ key: 'testPlugin', plugin: mockPluginInstance, active: false });

            var result = manager.start('testPlugin');

            expect(result).toBe(mockPluginInstance);
        });

        it('should return the existing plugin instance when already active', function ()
        {
            var mockPluginInstance = { init: vi.fn(), start: vi.fn(), stop: vi.fn(), destroy: vi.fn() };
            manager.plugins.push({ key: 'testPlugin', plugin: mockPluginInstance, active: true });

            var result = manager.start('testPlugin');

            expect(result).toBe(mockPluginInstance);
        });

        it('should not call start again on an already active plugin', function ()
        {
            var mockPluginInstance = { init: vi.fn(), start: vi.fn(), stop: vi.fn(), destroy: vi.fn() };
            manager.plugins.push({ key: 'testPlugin', plugin: mockPluginInstance, active: true });

            manager.start('testPlugin');

            expect(mockPluginInstance.start).not.toHaveBeenCalled();
        });

        it('should return null when plugin cannot be found in cache', function ()
        {
            vi.spyOn(PluginCache, 'getCustom').mockReturnValue(null);

            var result = manager.start('nonExistent');

            expect(result).toBeNull();
        });

        it('should use runAs key when provided', function ()
        {
            var MockPlugin = createMockPluginClass();
            var mockInstance = new MockPlugin(manager);
            vi.spyOn(PluginCache, 'getCustom').mockReturnValue({
                plugin: MockPlugin,
                mapping: null,
                data: null
            });

            manager.start('sourceKey', 'aliasKey');

            var entry = manager.getEntry('aliasKey');

            expect(entry).toBeDefined();
            expect(entry.key).toBe('aliasKey');
        });
    });

    describe('addToScene', function ()
    {
        it('should inject global plugin references from game into scene systems', function ()
        {
            var mockPlugin = { someMethod: vi.fn() };
            mockGame.testPlugin = mockPlugin;

            var mockSys = {
                scene: {},
                settings: {
                    map: {},
                    isBooted: false
                }
            };

            manager.addToScene(mockSys, [ 'testPlugin' ], []);

            expect(mockSys.testPlugin).toBe(mockPlugin);
        });

        it('should map global plugin into scene when map contains the key', function ()
        {
            var mockPlugin = { someMethod: vi.fn() };
            mockGame.testPlugin = mockPlugin;

            var mockSys = {
                scene: {},
                settings: {
                    map: { testPlugin: 'mappedKey' },
                    isBooted: false
                }
            };

            manager.addToScene(mockSys, [ 'testPlugin' ], []);

            expect(mockSys.scene.mappedKey).toBe(mockPlugin);
        });

        it('should inject game reference into scene when plugin key is game and map has game', function ()
        {
            var mockSys = {
                scene: {},
                settings: {
                    map: { game: 'gameRef' },
                    isBooted: false
                }
            };

            manager.addToScene(mockSys, [ 'game' ], []);

            expect(mockSys.scene.gameRef).toBe(mockGame);
        });

        it('should inject plugin entries with mapping directly into scene', function ()
        {
            var mockPluginInstance = { destroy: vi.fn() };
            manager.plugins.push({ key: 'myPlugin', plugin: mockPluginInstance, active: true, mapping: 'myPluginRef' });

            var mockSys = {
                scene: {},
                settings: { map: {}, isBooted: false }
            };

            manager.addToScene(mockSys, [], [ [] ]);

            expect(mockSys.scene.myPluginRef).toBe(mockPluginInstance);
        });

        it('should not inject plugin entries that have no mapping', function ()
        {
            var mockPluginInstance = { destroy: vi.fn() };
            manager.plugins.push({ key: 'myPlugin', plugin: mockPluginInstance, active: true, mapping: null });

            var mockSys = {
                scene: {},
                settings: { map: {}, isBooted: false }
            };

            manager.addToScene(mockSys, [], [ [] ]);

            expect(mockSys.scene['myPlugin']).toBeUndefined();
        });
    });

    describe('boot', function ()
    {
        it('should clear _pendingGlobal after booting', function ()
        {
            var MockPlugin = createMockPluginClass();
            manager._pendingGlobal = [ { key: 'testPlugin', plugin: MockPlugin, start: false, mapping: null, data: null } ];

            vi.spyOn(manager, 'install').mockImplementation(function () {});
            mockGame.config.installGlobalPlugins = [];
            mockGame.config.installScenePlugins = [];

            manager.boot();

            expect(manager._pendingGlobal).toEqual([]);
        });

        it('should clear _pendingScene after booting', function ()
        {
            mockGame.config.installGlobalPlugins = [];
            mockGame.config.installScenePlugins = [];

            manager.boot();

            expect(manager._pendingScene).toEqual([]);
        });

        it('should call install for each pending global plugin with a key and plugin', function ()
        {
            var MockPlugin = createMockPluginClass();
            var installSpy = vi.spyOn(manager, 'install').mockImplementation(function () {});

            mockGame.config.installGlobalPlugins = [];
            mockGame.config.installScenePlugins = [];
            manager._pendingGlobal = [ { key: 'testPlugin', plugin: MockPlugin, start: false, mapping: null, data: null } ];

            manager.boot();

            expect(installSpy).toHaveBeenCalledWith('testPlugin', MockPlugin, false, null, null);
        });

        it('should warn when pending global plugin is missing plugin class', function ()
        {
            var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});

            mockGame.config.installGlobalPlugins = [];
            mockGame.config.installScenePlugins = [];
            manager._pendingGlobal = [ { key: 'brokenPlugin', plugin: null } ];

            manager.boot();

            expect(warnSpy).toHaveBeenCalled();
        });

        it('should call installScenePlugin for each pending scene plugin with key and plugin', function ()
        {
            var MockPlugin = createMockPluginClass();
            var installSceneSpy = vi.spyOn(manager, 'installScenePlugin').mockImplementation(function () {});

            mockGame.config.installGlobalPlugins = [];
            mockGame.config.installScenePlugins = [];
            manager._pendingScene = [ { key: 'scenePlugin', plugin: MockPlugin, mapping: 'sp' } ];

            manager.boot();

            expect(installSceneSpy).toHaveBeenCalledWith('scenePlugin', MockPlugin, 'sp');
        });

        it('should register for DESTROY event after booting', function ()
        {
            mockGame.config.installGlobalPlugins = [];
            mockGame.config.installScenePlugins = [];

            manager.boot();

            var calls = mockGame.events.once.mock.calls;
            var destroyCalled = calls.some(function (call) { return call[0] === 'destroy'; });

            expect(destroyCalled).toBe(true);
        });
    });

    describe('destroy', function ()
    {
        it('should call destroy on all plugin instances', function ()
        {
            var mockPlugin1 = { destroy: vi.fn() };
            var mockPlugin2 = { destroy: vi.fn() };
            manager.plugins.push({ key: 'plugin1', plugin: mockPlugin1, active: true });
            manager.plugins.push({ key: 'plugin2', plugin: mockPlugin2, active: true });

            vi.spyOn(PluginCache, 'destroyCustomPlugins').mockImplementation(function () {});

            manager.destroy();

            expect(mockPlugin1.destroy).toHaveBeenCalled();
            expect(mockPlugin2.destroy).toHaveBeenCalled();
        });

        it('should set game to null after destroy', function ()
        {
            vi.spyOn(PluginCache, 'destroyCustomPlugins').mockImplementation(function () {});

            manager.destroy();

            expect(manager.game).toBeNull();
        });

        it('should clear the plugins array after destroy', function ()
        {
            manager.plugins.push({ key: 'plugin1', plugin: { destroy: vi.fn() }, active: true });

            vi.spyOn(PluginCache, 'destroyCustomPlugins').mockImplementation(function () {});

            manager.destroy();

            expect(manager.plugins).toEqual([]);
        });

        it('should clear the scenePlugins array after destroy', function ()
        {
            manager.scenePlugins.push('somePlugin');

            vi.spyOn(PluginCache, 'destroyCustomPlugins').mockImplementation(function () {});

            manager.destroy();

            expect(manager.scenePlugins).toEqual([]);
        });

        it('should call PluginCache.destroyCustomPlugins', function ()
        {
            var destroySpy = vi.spyOn(PluginCache, 'destroyCustomPlugins').mockImplementation(function () {});

            manager.destroy();

            expect(destroySpy).toHaveBeenCalled();
        });

        it('should call PluginCache.destroyCorePlugins when game.noReturn is true', function ()
        {
            mockGame.noReturn = true;

            vi.spyOn(PluginCache, 'destroyCustomPlugins').mockImplementation(function () {});
            var coreDestroySpy = vi.spyOn(PluginCache, 'destroyCorePlugins').mockImplementation(function () {});

            manager.destroy();

            expect(coreDestroySpy).toHaveBeenCalled();
        });

        it('should not call PluginCache.destroyCorePlugins when game.noReturn is false', function ()
        {
            mockGame.noReturn = false;

            vi.spyOn(PluginCache, 'destroyCustomPlugins').mockImplementation(function () {});
            var coreDestroySpy = vi.spyOn(PluginCache, 'destroyCorePlugins').mockImplementation(function () {});

            manager.destroy();

            expect(coreDestroySpy).not.toHaveBeenCalled();
        });
    });
});
