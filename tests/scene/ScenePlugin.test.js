var ScenePlugin = require('../../src/scene/ScenePlugin');

function createMockScene (key)
{
    if (key === undefined) { key = 'TestScene'; }

    var events = {
        once: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn()
    };

    var manager = {
        queueOp: vi.fn(),
        add: vi.fn(),
        remove: vi.fn(),
        getScene: vi.fn(),
        getIndex: vi.fn(),
        isSleeping: vi.fn(),
        isActive: vi.fn(),
        isPaused: vi.fn(),
        isVisible: vi.fn(),
        swapPosition: vi.fn(),
        moveAbove: vi.fn(),
        moveBelow: vi.fn(),
        moveUp: vi.fn(),
        moveDown: vi.fn(),
        bringToTop: vi.fn(),
        sendToBack: vi.fn(),
        start: vi.fn(),
        stop: vi.fn()
    };

    var sys = {
        settings: { key: key },
        events: events,
        game: { scene: manager },
        setActive: vi.fn(),
        setVisible: vi.fn(),
        isSleeping: vi.fn().mockReturnValue(false),
        isActive: vi.fn().mockReturnValue(false),
        isTransitioning: vi.fn().mockReturnValue(false),
        sleep: vi.fn(),
        wake: vi.fn(),
        getStatus: vi.fn().mockReturnValue(0)
    };

    var scene = {
        sys: sys
    };

    return scene;
}

function createPlugin (key)
{
    var scene = createMockScene(key);
    var plugin = new ScenePlugin(scene);
    return plugin;
}

describe('ScenePlugin', function ()
{
    describe('constructor', function ()
    {
        it('should set initial properties from scene', function ()
        {
            var scene = createMockScene('MyScene');
            var plugin = new ScenePlugin(scene);

            expect(plugin.scene).toBe(scene);
            expect(plugin.systems).toBe(scene.sys);
            expect(plugin.settings).toBe(scene.sys.settings);
            expect(plugin.key).toBe('MyScene');
            expect(plugin.manager).toBe(scene.sys.game.scene);
        });

        it('should initialise transitionProgress to 0', function ()
        {
            var plugin = createPlugin();

            expect(plugin.transitionProgress).toBe(0);
        });

        it('should initialise _willSleep and _willRemove to false', function ()
        {
            var plugin = createPlugin();

            expect(plugin._willSleep).toBe(false);
            expect(plugin._willRemove).toBe(false);
        });

        it('should initialise _target to null and _duration to 0', function ()
        {
            var plugin = createPlugin();

            expect(plugin._target).toBeNull();
            expect(plugin._duration).toBe(0);
        });

        it('should register BOOT and START event listeners', function ()
        {
            var scene = createMockScene();
            var plugin = new ScenePlugin(scene);

            expect(scene.sys.events.once).toHaveBeenCalledWith(expect.any(String), plugin.boot, plugin);
            expect(scene.sys.events.on).toHaveBeenCalledWith(expect.any(String), plugin.pluginStart, plugin);
        });
    });

    describe('start', function ()
    {
        it('should queue stop on own key then start on target key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.start('SceneB');

            expect(plugin.manager.queueOp).toHaveBeenNthCalledWith(1, 'stop', 'SceneA');
            expect(plugin.manager.queueOp).toHaveBeenNthCalledWith(2, 'start', 'SceneB', undefined);
        });

        it('should default to own key when no key given', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.start();

            expect(plugin.manager.queueOp).toHaveBeenNthCalledWith(1, 'stop', 'SceneA');
            expect(plugin.manager.queueOp).toHaveBeenNthCalledWith(2, 'start', 'SceneA', undefined);
        });

        it('should pass data to the start operation', function ()
        {
            var plugin = createPlugin('SceneA');
            var data = { level: 1 };

            plugin.start('SceneB', data);

            expect(plugin.manager.queueOp).toHaveBeenNthCalledWith(2, 'start', 'SceneB', data);
        });

        it('should return this for chaining', function ()
        {
            var plugin = createPlugin();

            expect(plugin.start('Other')).toBe(plugin);
        });
    });

    describe('restart', function ()
    {
        it('should queue stop then start on own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.restart();

            expect(plugin.manager.queueOp).toHaveBeenNthCalledWith(1, 'stop', 'SceneA');
            expect(plugin.manager.queueOp).toHaveBeenNthCalledWith(2, 'start', 'SceneA', undefined);
        });

        it('should pass data through', function ()
        {
            var plugin = createPlugin('SceneA');
            var data = { foo: 'bar' };

            plugin.restart(data);

            expect(plugin.manager.queueOp).toHaveBeenNthCalledWith(2, 'start', 'SceneA', data);
        });

        it('should return this for chaining', function ()
        {
            var plugin = createPlugin();

            expect(plugin.restart()).toBe(plugin);
        });
    });

    describe('launch', function ()
    {
        it('should queue start for the given key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.launch('SceneB');

            expect(plugin.manager.queueOp).toHaveBeenCalledWith('start', 'SceneB', undefined);
        });

        it('should not queue if key equals own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.launch('SceneA');

            expect(plugin.manager.queueOp).not.toHaveBeenCalled();
        });

        it('should return this for chaining', function ()
        {
            var plugin = createPlugin('SceneA');

            expect(plugin.launch('SceneB')).toBe(plugin);
        });
    });

    describe('run', function ()
    {
        it('should queue run for the given key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.run('SceneB');

            expect(plugin.manager.queueOp).toHaveBeenCalledWith('run', 'SceneB', undefined);
        });

        it('should not queue if key equals own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.run('SceneA');

            expect(plugin.manager.queueOp).not.toHaveBeenCalled();
        });

        it('should return this for chaining', function ()
        {
            var plugin = createPlugin('SceneA');

            expect(plugin.run('SceneB')).toBe(plugin);
        });
    });

    describe('pause', function ()
    {
        it('should queue pause on the given key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.pause('SceneB');

            expect(plugin.manager.queueOp).toHaveBeenCalledWith('pause', 'SceneB', undefined);
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.pause();

            expect(plugin.manager.queueOp).toHaveBeenCalledWith('pause', 'SceneA', undefined);
        });

        it('should return this for chaining', function ()
        {
            var plugin = createPlugin();

            expect(plugin.pause()).toBe(plugin);
        });
    });

    describe('resume', function ()
    {
        it('should queue resume on the given key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.resume('SceneB');

            expect(plugin.manager.queueOp).toHaveBeenCalledWith('resume', 'SceneB', undefined);
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.resume();

            expect(plugin.manager.queueOp).toHaveBeenCalledWith('resume', 'SceneA', undefined);
        });
    });

    describe('sleep', function ()
    {
        it('should queue sleep on the given key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.sleep('SceneB');

            expect(plugin.manager.queueOp).toHaveBeenCalledWith('sleep', 'SceneB', undefined);
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.sleep();

            expect(plugin.manager.queueOp).toHaveBeenCalledWith('sleep', 'SceneA', undefined);
        });
    });

    describe('stop', function ()
    {
        it('should queue stop on the given key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.stop('SceneB');

            expect(plugin.manager.queueOp).toHaveBeenCalledWith('stop', 'SceneB', undefined);
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.stop();

            expect(plugin.manager.queueOp).toHaveBeenCalledWith('stop', 'SceneA', undefined);
        });

        it('should return this for chaining', function ()
        {
            var plugin = createPlugin();

            expect(plugin.stop()).toBe(plugin);
        });
    });

    describe('switch', function ()
    {
        it('should queue a switch operation when key differs', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.switch('SceneB');

            expect(plugin.manager.queueOp).toHaveBeenCalledWith('switch', 'SceneA', 'SceneB', undefined);
        });

        it('should not queue if key equals own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.switch('SceneA');

            expect(plugin.manager.queueOp).not.toHaveBeenCalled();
        });

        it('should return this for chaining', function ()
        {
            var plugin = createPlugin('SceneA');

            expect(plugin.switch('SceneB')).toBe(plugin);
        });
    });

    describe('setActive', function ()
    {
        it('should call sys.setActive on the target scene', function ()
        {
            var plugin = createPlugin('SceneA');
            var targetScene = createMockScene('SceneB');

            plugin.manager.getScene.mockReturnValue(targetScene);

            plugin.setActive(true, 'SceneB');

            expect(targetScene.sys.setActive).toHaveBeenCalledWith(true, undefined);
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');
            var ownScene = plugin.scene;

            plugin.manager.getScene.mockReturnValue(ownScene);

            plugin.setActive(false);

            expect(plugin.manager.getScene).toHaveBeenCalledWith('SceneA');
        });

        it('should do nothing if scene is not found', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.manager.getScene.mockReturnValue(null);

            expect(function () { plugin.setActive(true); }).not.toThrow();
        });

        it('should return this for chaining', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.manager.getScene.mockReturnValue(null);

            expect(plugin.setActive(true)).toBe(plugin);
        });
    });

    describe('setVisible', function ()
    {
        it('should call sys.setVisible on the target scene', function ()
        {
            var plugin = createPlugin('SceneA');
            var targetScene = createMockScene('SceneB');

            plugin.manager.getScene.mockReturnValue(targetScene);

            plugin.setVisible(true, 'SceneB');

            expect(targetScene.sys.setVisible).toHaveBeenCalledWith(true);
        });

        it('should do nothing if scene is not found', function ()
        {
            var plugin = createPlugin();

            plugin.manager.getScene.mockReturnValue(null);

            expect(function () { plugin.setVisible(false); }).not.toThrow();
        });
    });

    describe('isSleeping', function ()
    {
        it('should delegate to manager.isSleeping with given key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.manager.isSleeping.mockReturnValue(true);

            var result = plugin.isSleeping('SceneB');

            expect(plugin.manager.isSleeping).toHaveBeenCalledWith('SceneB');
            expect(result).toBe(true);
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.manager.isSleeping.mockReturnValue(false);

            plugin.isSleeping();

            expect(plugin.manager.isSleeping).toHaveBeenCalledWith('SceneA');
        });
    });

    describe('isActive', function ()
    {
        it('should delegate to manager.isActive with given key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.manager.isActive.mockReturnValue(true);

            var result = plugin.isActive('SceneB');

            expect(plugin.manager.isActive).toHaveBeenCalledWith('SceneB');
            expect(result).toBe(true);
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.isActive();

            expect(plugin.manager.isActive).toHaveBeenCalledWith('SceneA');
        });
    });

    describe('isPaused', function ()
    {
        it('should delegate to manager.isPaused', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.manager.isPaused.mockReturnValue(true);

            var result = plugin.isPaused('SceneB');

            expect(result).toBe(true);
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.isPaused();

            expect(plugin.manager.isPaused).toHaveBeenCalledWith('SceneA');
        });
    });

    describe('isVisible', function ()
    {
        it('should delegate to manager.isVisible', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.manager.isVisible.mockReturnValue(true);

            var result = plugin.isVisible('SceneB');

            expect(result).toBe(true);
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.isVisible();

            expect(plugin.manager.isVisible).toHaveBeenCalledWith('SceneA');
        });
    });

    describe('swapPosition', function ()
    {
        it('should call manager.swapPosition when keys differ', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.swapPosition('SceneB', 'SceneC');

            expect(plugin.manager.swapPosition).toHaveBeenCalledWith('SceneB', 'SceneC');
        });

        it('should default keyB to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.swapPosition('SceneB');

            expect(plugin.manager.swapPosition).toHaveBeenCalledWith('SceneB', 'SceneA');
        });

        it('should not call swapPosition when keys are the same', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.swapPosition('SceneA', 'SceneA');

            expect(plugin.manager.swapPosition).not.toHaveBeenCalled();
        });

        it('should return this for chaining', function ()
        {
            var plugin = createPlugin('SceneA');

            expect(plugin.swapPosition('SceneB')).toBe(plugin);
        });
    });

    describe('moveAbove', function ()
    {
        it('should call manager.moveAbove when keys differ', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.moveAbove('SceneB', 'SceneC');

            expect(plugin.manager.moveAbove).toHaveBeenCalledWith('SceneB', 'SceneC');
        });

        it('should default keyB to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.moveAbove('SceneB');

            expect(plugin.manager.moveAbove).toHaveBeenCalledWith('SceneB', 'SceneA');
        });

        it('should not call moveAbove when keys are the same', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.moveAbove('SceneA', 'SceneA');

            expect(plugin.manager.moveAbove).not.toHaveBeenCalled();
        });
    });

    describe('moveBelow', function ()
    {
        it('should call manager.moveBelow when keys differ', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.moveBelow('SceneB', 'SceneC');

            expect(plugin.manager.moveBelow).toHaveBeenCalledWith('SceneB', 'SceneC');
        });

        it('should default keyB to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.moveBelow('SceneB');

            expect(plugin.manager.moveBelow).toHaveBeenCalledWith('SceneB', 'SceneA');
        });

        it('should not call moveBelow when keys are the same', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.moveBelow('SceneA', 'SceneA');

            expect(plugin.manager.moveBelow).not.toHaveBeenCalled();
        });
    });

    describe('remove', function ()
    {
        it('should call manager.remove with the given key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.remove('SceneB');

            expect(plugin.manager.remove).toHaveBeenCalledWith('SceneB');
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.remove();

            expect(plugin.manager.remove).toHaveBeenCalledWith('SceneA');
        });

        it('should return this for chaining', function ()
        {
            var plugin = createPlugin();

            expect(plugin.remove()).toBe(plugin);
        });
    });

    describe('moveUp', function ()
    {
        it('should call manager.moveUp with given key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.moveUp('SceneB');

            expect(plugin.manager.moveUp).toHaveBeenCalledWith('SceneB');
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.moveUp();

            expect(plugin.manager.moveUp).toHaveBeenCalledWith('SceneA');
        });
    });

    describe('moveDown', function ()
    {
        it('should call manager.moveDown with given key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.moveDown('SceneB');

            expect(plugin.manager.moveDown).toHaveBeenCalledWith('SceneB');
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.moveDown();

            expect(plugin.manager.moveDown).toHaveBeenCalledWith('SceneA');
        });
    });

    describe('bringToTop', function ()
    {
        it('should call manager.bringToTop with given key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.bringToTop('SceneB');

            expect(plugin.manager.bringToTop).toHaveBeenCalledWith('SceneB');
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.bringToTop();

            expect(plugin.manager.bringToTop).toHaveBeenCalledWith('SceneA');
        });
    });

    describe('sendToBack', function ()
    {
        it('should call manager.sendToBack with given key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.sendToBack('SceneB');

            expect(plugin.manager.sendToBack).toHaveBeenCalledWith('SceneB');
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.sendToBack();

            expect(plugin.manager.sendToBack).toHaveBeenCalledWith('SceneA');
        });
    });

    describe('get', function ()
    {
        it('should return the scene from manager.getScene', function ()
        {
            var plugin = createPlugin('SceneA');
            var mockScene = createMockScene('SceneB');

            plugin.manager.getScene.mockReturnValue(mockScene);

            var result = plugin.get('SceneB');

            expect(plugin.manager.getScene).toHaveBeenCalledWith('SceneB');
            expect(result).toBe(mockScene);
        });

        it('should return null when scene is not found', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.manager.getScene.mockReturnValue(null);

            var result = plugin.get('Missing');

            expect(result).toBeNull();
        });
    });

    describe('getStatus', function ()
    {
        it('should return the status from the scene sys', function ()
        {
            var plugin = createPlugin('SceneA');
            var targetScene = createMockScene('SceneB');

            targetScene.sys.getStatus.mockReturnValue(5);
            plugin.manager.getScene.mockReturnValue(targetScene);

            var result = plugin.getStatus('SceneB');

            expect(result).toBe(5);
        });

        it('should return undefined if scene is not found', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.manager.getScene.mockReturnValue(null);

            var result = plugin.getStatus('Missing');

            expect(result).toBeUndefined();
        });
    });

    describe('getIndex', function ()
    {
        it('should return the index from manager.getIndex', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.manager.getIndex.mockReturnValue(3);

            var result = plugin.getIndex('SceneB');

            expect(plugin.manager.getIndex).toHaveBeenCalledWith('SceneB');
            expect(result).toBe(3);
        });

        it('should default to own key', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.manager.getIndex.mockReturnValue(0);

            plugin.getIndex();

            expect(plugin.manager.getIndex).toHaveBeenCalledWith('SceneA');
        });
    });

    describe('add', function ()
    {
        it('should delegate to manager.add and return the result', function ()
        {
            var plugin = createPlugin('SceneA');
            var newScene = createMockScene('NewScene');

            plugin.manager.add.mockReturnValue(newScene);

            var result = plugin.add('NewScene', {}, true, { foo: 'bar' });

            expect(plugin.manager.add).toHaveBeenCalledWith('NewScene', {}, true, { foo: 'bar' });
            expect(result).toBe(newScene);
        });

        it('should return null when manager.add returns null', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.manager.add.mockReturnValue(null);

            var result = plugin.add('NewScene', {});

            expect(result).toBeNull();
        });
    });

    describe('transition', function ()
    {
        it('should return false when no target key is provided', function ()
        {
            var plugin = createPlugin('SceneA');

            var result = plugin.transition({});

            expect(result).toBe(false);
        });

        it('should return false when target scene is not found', function ()
        {
            var plugin = createPlugin('SceneA');

            plugin.manager.getScene.mockReturnValue(null);

            var result = plugin.transition({ target: 'SceneB' });

            expect(result).toBe(false);
        });

        it('should return false when target scene is already active', function ()
        {
            var plugin = createPlugin('SceneA');
            var targetScene = createMockScene('SceneB');

            targetScene.sys.isActive.mockReturnValue(true);
            plugin.manager.getScene.mockReturnValue(targetScene);

            var result = plugin.transition({ target: 'SceneB' });

            expect(result).toBe(false);
        });

        it('should return false with empty config', function ()
        {
            var plugin = createPlugin('SceneA');

            var result = plugin.transition();

            expect(result).toBe(false);
        });
    });
});
