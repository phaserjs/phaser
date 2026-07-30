var DataManagerPlugin = require('../../src/data/DataManagerPlugin');

function createMockScene ()
{
    var mockEvents = {
        once: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn()
    };

    var mockScene = {
        sys: {
            events: mockEvents
        }
    };

    return mockScene;
}

describe('DataManagerPlugin', function ()
{
    describe('constructor', function ()
    {
        it('should set the scene property to the given scene', function ()
        {
            var scene = createMockScene();
            var plugin = new DataManagerPlugin(scene);

            expect(plugin.scene).toBe(scene);
        });

        it('should set the systems property to scene.sys', function ()
        {
            var scene = createMockScene();
            var plugin = new DataManagerPlugin(scene);

            expect(plugin.systems).toBe(scene.sys);
        });

        it('should set the events property to scene.sys.events', function ()
        {
            var scene = createMockScene();
            var plugin = new DataManagerPlugin(scene);

            expect(plugin.events).toBe(scene.sys.events);
        });

        it('should initialise list as an empty object', function ()
        {
            var scene = createMockScene();
            var plugin = new DataManagerPlugin(scene);

            expect(plugin.list).toEqual({});
        });

        it('should initialise values as an empty object', function ()
        {
            var scene = createMockScene();
            var plugin = new DataManagerPlugin(scene);

            expect(plugin.values).toEqual({});
        });

        it('should register a once listener for the BOOT event on scene.sys.events', function ()
        {
            var scene = createMockScene();
            new DataManagerPlugin(scene);

            var onceCalls = scene.sys.events.once.mock.calls;
            var bootCall = onceCalls.find(function (call) { return call[0] === 'boot'; });

            expect(bootCall).toBeDefined();
        });

        it('should register an on listener for the START event on scene.sys.events', function ()
        {
            var scene = createMockScene();
            new DataManagerPlugin(scene);

            var onCalls = scene.sys.events.on.mock.calls;
            var startCall = onCalls.find(function (call) { return call[0] === 'start'; });

            expect(startCall).toBeDefined();
        });
    });

    describe('destroy', function ()
    {
        it('should set scene to null', function ()
        {
            var scene = createMockScene();
            var plugin = new DataManagerPlugin(scene);

            plugin.destroy();

            expect(plugin.scene).toBeNull();
        });

        it('should set systems to null', function ()
        {
            var scene = createMockScene();
            var plugin = new DataManagerPlugin(scene);

            plugin.destroy();

            expect(plugin.systems).toBeNull();
        });

        it('should call events.off to remove the START listener', function ()
        {
            var scene = createMockScene();
            var plugin = new DataManagerPlugin(scene);

            plugin.destroy();

            var offCalls = scene.sys.events.off.mock.calls;
            var startOffCall = offCalls.find(function (call) { return call[0] === 'start'; });

            expect(startOffCall).toBeDefined();
        });

        it('should clear the list of stored data', function ()
        {
            var scene = createMockScene();
            var plugin = new DataManagerPlugin(scene);

            plugin.list['foo'] = 'bar';
            plugin.list['baz'] = 42;

            plugin.destroy();

            expect(Object.keys(plugin.list).length).toBe(0);
        });

        it('should set parent to null via the base DataManager destroy', function ()
        {
            var scene = createMockScene();
            var plugin = new DataManagerPlugin(scene);

            plugin.destroy();

            expect(plugin.parent).toBeNull();
        });

        it('should unfreeze the data after destroy', function ()
        {
            var scene = createMockScene();
            var plugin = new DataManagerPlugin(scene);

            plugin._frozen = true;
            plugin.destroy();

            expect(plugin._frozen).toBe(false);
        });

        it('should be safe to check scene and systems are both null after destroy', function ()
        {
            var scene = createMockScene();
            var plugin = new DataManagerPlugin(scene);

            plugin.destroy();

            expect(plugin.scene).toBeNull();
            expect(plugin.systems).toBeNull();
        });
    });
});
