var LightsPlugin = require('../../../src/gameobjects/lights/LightsPlugin');

describe('LightsPlugin', function ()
{
    var scene;
    var mockEvents;

    beforeEach(function ()
    {
        mockEvents = {
            once: vi.fn(),
            on: vi.fn(),
            off: vi.fn(),
            emit: vi.fn()
        };

        scene = {
            sys: {
                settings: { isBooted: true },
                events: mockEvents
            }
        };
    });

    describe('constructor', function ()
    {
        it('should store a reference to the scene', function ()
        {
            var plugin = new LightsPlugin(scene);

            expect(plugin.scene).toBe(scene);
        });

        it('should store a reference to the scene systems', function ()
        {
            var plugin = new LightsPlugin(scene);

            expect(plugin.systems).toBe(scene.sys);
        });

        it('should register boot listener when scene is not booted', function ()
        {
            scene.sys.settings.isBooted = false;

            var plugin = new LightsPlugin(scene);

            expect(mockEvents.once).toHaveBeenCalledWith('boot', plugin.boot, plugin);
        });

        it('should not register boot listener when scene is already booted', function ()
        {
            scene.sys.settings.isBooted = true;

            new LightsPlugin(scene);

            expect(mockEvents.once).not.toHaveBeenCalled();
        });

        it('should extend LightsManager and have lights array', function ()
        {
            var plugin = new LightsPlugin(scene);

            expect(Array.isArray(plugin.lights)).toBe(true);
        });
    });

    describe('boot', function ()
    {
        it('should subscribe to shutdown event', function ()
        {
            var plugin = new LightsPlugin(scene);

            plugin.boot();

            expect(mockEvents.on).toHaveBeenCalledWith('shutdown', plugin.shutdown, plugin);
        });

        it('should subscribe to destroy event', function ()
        {
            var plugin = new LightsPlugin(scene);

            plugin.boot();

            expect(mockEvents.on).toHaveBeenCalledWith('destroy', plugin.destroy, plugin);
        });

        it('should use the systems events emitter', function ()
        {
            var plugin = new LightsPlugin(scene);

            plugin.boot();

            expect(mockEvents.on).toHaveBeenCalledTimes(2);
        });
    });

    describe('destroy', function ()
    {
        it('should set scene to undefined', function ()
        {
            var plugin = new LightsPlugin(scene);

            plugin.destroy();

            expect(plugin.scene).toBeUndefined();
        });

        it('should set systems to undefined', function ()
        {
            var plugin = new LightsPlugin(scene);

            plugin.destroy();

            expect(plugin.systems).toBeUndefined();
        });

        it('should call shutdown before clearing references', function ()
        {
            var plugin = new LightsPlugin(scene);
            var shutdownCalled = false;

            plugin.shutdown = function ()
            {
                shutdownCalled = true;
            };

            plugin.destroy();

            expect(shutdownCalled).toBe(true);
        });
    });
});
