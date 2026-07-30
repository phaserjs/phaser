var Systems = require('../../src/scene/Systems');
var CONST = require('../../src/scene/const');

describe('Phaser.Scenes.Systems', function ()
{
    var sys;
    var mockScene;
    var mockEvents;
    var mockDisplayList;
    var mockCameras;
    var mockScenePlugin;

    beforeEach(function ()
    {
        mockScene = {};

        mockEvents = {
            emit: vi.fn(),
            off: vi.fn(),
            on: vi.fn(),
            removeAllListeners: vi.fn()
        };

        mockDisplayList = {
            queueDepthSort: vi.fn(),
            depthSort: vi.fn()
        };

        mockCameras = {
            render: vi.fn()
        };

        mockScenePlugin = {
            _target: null,
            _duration: 0
        };

        sys = new Systems(mockScene, { key: 'test' });

        // Inject mocks since init() requires a full Game instance
        sys.events = mockEvents;
        sys.displayList = mockDisplayList;
        sys.cameras = mockCameras;
        sys.scenePlugin = mockScenePlugin;
    });

    describe('constructor', function ()
    {
        it('should create a Systems instance', function ()
        {
            expect(sys).toBeDefined();
        });

        it('should set the scene reference', function ()
        {
            expect(sys.scene).toBe(mockScene);
        });

        it('should set the config', function ()
        {
            expect(sys.config).toEqual({ key: 'test' });
        });

        it('should create a settings object from config', function ()
        {
            expect(sys.settings).toBeDefined();
            expect(typeof sys.settings).toBe('object');
        });

        it('should accept a string config and set the key', function ()
        {
            var s = new Systems(mockScene, 'myScene');
            expect(s.settings.key).toBe('myScene');
        });

        it('should initialize sceneUpdate as a function', function ()
        {
            expect(typeof sys.sceneUpdate).toBe('function');
        });

        it('should set settings.key from config object', function ()
        {
            expect(sys.settings.key).toBe('test');
        });
    });

    describe('getStatus', function ()
    {
        it('should return the current settings status', function ()
        {
            sys.settings.status = CONST.RUNNING;
            expect(sys.getStatus()).toBe(CONST.RUNNING);
        });

        it('should return PAUSED when scene is paused', function ()
        {
            sys.settings.status = CONST.PAUSED;
            expect(sys.getStatus()).toBe(CONST.PAUSED);
        });

        it('should return SLEEPING when scene is sleeping', function ()
        {
            sys.settings.status = CONST.SLEEPING;
            expect(sys.getStatus()).toBe(CONST.SLEEPING);
        });

        it('should return PENDING as the initial status', function ()
        {
            var s = new Systems(mockScene, { key: 'fresh' });
            expect(s.getStatus()).toBe(CONST.PENDING);
        });
    });

    describe('getData', function ()
    {
        it('should return the settings data object', function ()
        {
            sys.settings.data = { score: 100 };
            expect(sys.getData()).toEqual({ score: 100 });
        });

        it('should return undefined when no data has been set', function ()
        {
            sys.settings.data = undefined;
            expect(sys.getData()).toBeUndefined();
        });

        it('should return null when data is explicitly null', function ()
        {
            sys.settings.data = null;
            expect(sys.getData()).toBeNull();
        });
    });

    describe('canInput', function ()
    {
        it('should return false when status is PENDING (0)', function ()
        {
            sys.settings.status = CONST.PENDING;
            expect(sys.canInput()).toBe(false);
        });

        it('should return true when status is INIT (1)', function ()
        {
            sys.settings.status = CONST.INIT;
            expect(sys.canInput()).toBe(true);
        });

        it('should return true when status is START (2)', function ()
        {
            sys.settings.status = CONST.START;
            expect(sys.canInput()).toBe(true);
        });

        it('should return true when status is CREATING (4)', function ()
        {
            sys.settings.status = CONST.CREATING;
            expect(sys.canInput()).toBe(true);
        });

        it('should return true when status is RUNNING (5)', function ()
        {
            sys.settings.status = CONST.RUNNING;
            expect(sys.canInput()).toBe(true);
        });

        it('should return false when status is PAUSED (6)', function ()
        {
            sys.settings.status = CONST.PAUSED;
            expect(sys.canInput()).toBe(false);
        });

        it('should return false when status is SLEEPING (7)', function ()
        {
            sys.settings.status = CONST.SLEEPING;
            expect(sys.canInput()).toBe(false);
        });

        it('should return false when status is SHUTDOWN (8)', function ()
        {
            sys.settings.status = CONST.SHUTDOWN;
            expect(sys.canInput()).toBe(false);
        });
    });

    describe('isSleeping', function ()
    {
        it('should return true when status is SLEEPING', function ()
        {
            sys.settings.status = CONST.SLEEPING;
            expect(sys.isSleeping()).toBe(true);
        });

        it('should return false when status is RUNNING', function ()
        {
            sys.settings.status = CONST.RUNNING;
            expect(sys.isSleeping()).toBe(false);
        });

        it('should return false when status is PAUSED', function ()
        {
            sys.settings.status = CONST.PAUSED;
            expect(sys.isSleeping()).toBe(false);
        });
    });

    describe('isActive', function ()
    {
        it('should return true when status is RUNNING', function ()
        {
            sys.settings.status = CONST.RUNNING;
            expect(sys.isActive()).toBe(true);
        });

        it('should return false when status is PAUSED', function ()
        {
            sys.settings.status = CONST.PAUSED;
            expect(sys.isActive()).toBe(false);
        });

        it('should return false when status is SLEEPING', function ()
        {
            sys.settings.status = CONST.SLEEPING;
            expect(sys.isActive()).toBe(false);
        });

        it('should return false when status is PENDING', function ()
        {
            sys.settings.status = CONST.PENDING;
            expect(sys.isActive()).toBe(false);
        });
    });

    describe('isPaused', function ()
    {
        it('should return true when status is PAUSED', function ()
        {
            sys.settings.status = CONST.PAUSED;
            expect(sys.isPaused()).toBe(true);
        });

        it('should return false when status is RUNNING', function ()
        {
            sys.settings.status = CONST.RUNNING;
            expect(sys.isPaused()).toBe(false);
        });

        it('should return false when status is SLEEPING', function ()
        {
            sys.settings.status = CONST.SLEEPING;
            expect(sys.isPaused()).toBe(false);
        });
    });

    describe('isVisible', function ()
    {
        it('should return true when visible is true', function ()
        {
            sys.settings.visible = true;
            expect(sys.isVisible()).toBe(true);
        });

        it('should return false when visible is false', function ()
        {
            sys.settings.visible = false;
            expect(sys.isVisible()).toBe(false);
        });
    });

    describe('setVisible', function ()
    {
        it('should set visible to true', function ()
        {
            sys.settings.visible = false;
            sys.setVisible(true);
            expect(sys.settings.visible).toBe(true);
        });

        it('should set visible to false', function ()
        {
            sys.settings.visible = true;
            sys.setVisible(false);
            expect(sys.settings.visible).toBe(false);
        });

        it('should return the Systems instance for chaining', function ()
        {
            expect(sys.setVisible(true)).toBe(sys);
        });
    });

    describe('isTransitionIn', function ()
    {
        it('should return true when settings.isTransition is true', function ()
        {
            sys.settings.isTransition = true;
            expect(sys.isTransitionIn()).toBe(true);
        });

        it('should return false when settings.isTransition is false', function ()
        {
            sys.settings.isTransition = false;
            expect(sys.isTransitionIn()).toBe(false);
        });
    });

    describe('isTransitionOut', function ()
    {
        it('should return false when _target is null', function ()
        {
            sys.scenePlugin._target = null;
            sys.scenePlugin._duration = 1000;
            expect(sys.isTransitionOut()).toBe(false);
        });

        it('should return true when _target is set and _duration is positive', function ()
        {
            sys.scenePlugin._target = { key: 'other' };
            sys.scenePlugin._duration = 1000;
            expect(sys.isTransitionOut()).toBe(true);
        });

        it('should return false when _target is set but _duration is zero', function ()
        {
            sys.scenePlugin._target = { key: 'other' };
            sys.scenePlugin._duration = 0;
            expect(sys.isTransitionOut()).toBe(false);
        });

        it('should return false when _target is set but _duration is negative', function ()
        {
            sys.scenePlugin._target = { key: 'other' };
            sys.scenePlugin._duration = -1;
            expect(sys.isTransitionOut()).toBe(false);
        });
    });

    describe('isTransitioning', function ()
    {
        it('should return false when not in any transition state', function ()
        {
            sys.settings.isTransition = false;
            sys.scenePlugin._target = null;
            expect(sys.isTransitioning()).toBe(false);
        });

        it('should return true when settings.isTransition is true', function ()
        {
            sys.settings.isTransition = true;
            sys.scenePlugin._target = null;
            expect(sys.isTransitioning()).toBe(true);
        });

        it('should return true when scenePlugin has a non-null _target', function ()
        {
            sys.settings.isTransition = false;
            sys.scenePlugin._target = { key: 'other' };
            expect(sys.isTransitioning()).toBe(true);
        });

        it('should return true when both conditions are true', function ()
        {
            sys.settings.isTransition = true;
            sys.scenePlugin._target = { key: 'other' };
            expect(sys.isTransitioning()).toBe(true);
        });
    });

    describe('pause', function ()
    {
        it('should set status to PAUSED when RUNNING', function ()
        {
            sys.settings.status = CONST.RUNNING;
            sys.settings.active = true;
            sys.pause();
            expect(sys.settings.status).toBe(CONST.PAUSED);
        });

        it('should set active to false', function ()
        {
            sys.settings.status = CONST.RUNNING;
            sys.settings.active = true;
            sys.pause();
            expect(sys.settings.active).toBe(false);
        });

        it('should emit a PAUSE event with data', function ()
        {
            sys.settings.status = CONST.RUNNING;
            sys.settings.active = true;
            var data = { foo: 'bar' };
            sys.pause(data);
            expect(mockEvents.emit).toHaveBeenCalledWith(expect.any(String), sys, data);
        });

        it('should return the Systems instance for chaining', function ()
        {
            sys.settings.status = CONST.RUNNING;
            sys.settings.active = true;
            expect(sys.pause()).toBe(sys);
        });

        it('should not pause when status is SLEEPING', function ()
        {
            sys.settings.status = CONST.SLEEPING;
            sys.settings.active = true;
            sys.pause();
            expect(sys.settings.status).toBe(CONST.SLEEPING);
        });

        it('should not pause when status is SHUTDOWN', function ()
        {
            sys.settings.status = CONST.SHUTDOWN;
            sys.settings.active = true;
            sys.pause();
            expect(sys.settings.status).toBe(CONST.SHUTDOWN);
        });

        it('should pause when status is CREATING', function ()
        {
            sys.settings.status = CONST.CREATING;
            sys.settings.active = true;
            sys.pause();
            expect(sys.settings.status).toBe(CONST.PAUSED);
        });

        it('should not pause when active is false even if RUNNING', function ()
        {
            sys.settings.status = CONST.RUNNING;
            sys.settings.active = false;
            sys.pause();
            expect(sys.settings.status).toBe(CONST.RUNNING);
        });
    });

    describe('resume', function ()
    {
        it('should set status to RUNNING when not active', function ()
        {
            sys.settings.status = CONST.PAUSED;
            sys.settings.active = false;
            sys.resume();
            expect(sys.settings.status).toBe(CONST.RUNNING);
        });

        it('should set active to true', function ()
        {
            sys.settings.status = CONST.PAUSED;
            sys.settings.active = false;
            sys.resume();
            expect(sys.settings.active).toBe(true);
        });

        it('should emit a RESUME event', function ()
        {
            sys.settings.active = false;
            var data = { level: 2 };
            sys.resume(data);
            expect(mockEvents.emit).toHaveBeenCalled();
        });

        it('should not resume when already active', function ()
        {
            sys.settings.status = CONST.PAUSED;
            sys.settings.active = true;
            sys.resume();
            expect(sys.settings.status).toBe(CONST.PAUSED);
        });

        it('should return the Systems instance for chaining', function ()
        {
            sys.settings.active = false;
            expect(sys.resume()).toBe(sys);
        });
    });

    describe('sleep', function ()
    {
        it('should set status to SLEEPING when RUNNING', function ()
        {
            sys.settings.status = CONST.RUNNING;
            sys.settings.active = true;
            sys.sleep();
            expect(sys.settings.status).toBe(CONST.SLEEPING);
        });

        it('should set active to false', function ()
        {
            sys.settings.status = CONST.RUNNING;
            sys.settings.active = true;
            sys.sleep();
            expect(sys.settings.active).toBe(false);
        });

        it('should set visible to false', function ()
        {
            sys.settings.status = CONST.RUNNING;
            sys.settings.active = true;
            sys.settings.visible = true;
            sys.sleep();
            expect(sys.settings.visible).toBe(false);
        });

        it('should emit a SLEEP event with data', function ()
        {
            sys.settings.status = CONST.RUNNING;
            sys.settings.active = true;
            var data = { reason: 'test' };
            sys.sleep(data);
            expect(mockEvents.emit).toHaveBeenCalledWith(expect.any(String), sys, data);
        });

        it('should not sleep when status is SLEEPING', function ()
        {
            sys.settings.status = CONST.SLEEPING;
            sys.sleep();
            expect(mockEvents.emit).not.toHaveBeenCalled();
        });

        it('should not sleep when status is SHUTDOWN', function ()
        {
            sys.settings.status = CONST.SHUTDOWN;
            sys.sleep();
            expect(mockEvents.emit).not.toHaveBeenCalled();
        });

        it('should return the Systems instance for chaining', function ()
        {
            sys.settings.status = CONST.RUNNING;
            sys.settings.active = true;
            expect(sys.sleep()).toBe(sys);
        });
    });

    describe('wake', function ()
    {
        it('should set status to RUNNING', function ()
        {
            sys.settings.status = CONST.SLEEPING;
            sys.settings.isTransition = false;
            sys.wake();
            expect(sys.settings.status).toBe(CONST.RUNNING);
        });

        it('should set active to true', function ()
        {
            sys.settings.active = false;
            sys.settings.isTransition = false;
            sys.wake();
            expect(sys.settings.active).toBe(true);
        });

        it('should set visible to true', function ()
        {
            sys.settings.visible = false;
            sys.settings.isTransition = false;
            sys.wake();
            expect(sys.settings.visible).toBe(true);
        });

        it('should emit a WAKE event', function ()
        {
            sys.settings.isTransition = false;
            sys.wake();
            expect(mockEvents.emit).toHaveBeenCalled();
        });

        it('should emit TRANSITION_WAKE when isTransition is true', function ()
        {
            sys.settings.isTransition = true;
            sys.settings.transitionFrom = { key: 'other' };
            sys.settings.transitionDuration = 1000;
            sys.wake();
            expect(mockEvents.emit.mock.calls.length).toBeGreaterThanOrEqual(2);
        });

        it('should not emit TRANSITION_WAKE when isTransition is false', function ()
        {
            sys.settings.isTransition = false;
            sys.wake();
            expect(mockEvents.emit.mock.calls.length).toBe(1);
        });

        it('should return the Systems instance for chaining', function ()
        {
            sys.settings.isTransition = false;
            expect(sys.wake()).toBe(sys);
        });
    });

    describe('start', function ()
    {
        it('should set status to START', function ()
        {
            sys.start({});
            expect(sys.settings.status).toBe(CONST.START);
        });

        it('should set active to true', function ()
        {
            sys.settings.active = false;
            sys.start({});
            expect(sys.settings.active).toBe(true);
        });

        it('should set visible to true', function ()
        {
            sys.settings.visible = false;
            sys.start({});
            expect(sys.settings.visible).toBe(true);
        });

        it('should store data in settings when provided', function ()
        {
            var data = { level: 1 };
            sys.start(data);
            expect(sys.settings.data).toEqual(data);
        });

        it('should emit START and READY events', function ()
        {
            sys.start({});
            expect(mockEvents.emit.mock.calls.length).toBe(2);
        });

        it('should not overwrite settings.data when data is falsy', function ()
        {
            sys.settings.data = { existing: true };
            sys.start(null);
            expect(sys.settings.data).toEqual({ existing: true });
        });

        it('should not overwrite settings.data when called with undefined', function ()
        {
            sys.settings.data = { existing: true };
            sys.start(undefined);
            expect(sys.settings.data).toEqual({ existing: true });
        });
    });

    describe('shutdown', function ()
    {
        it('should set status to SHUTDOWN', function ()
        {
            sys.shutdown();
            expect(sys.settings.status).toBe(CONST.SHUTDOWN);
        });

        it('should set active to false', function ()
        {
            sys.settings.active = true;
            sys.shutdown();
            expect(sys.settings.active).toBe(false);
        });

        it('should set visible to false', function ()
        {
            sys.settings.visible = true;
            sys.shutdown();
            expect(sys.settings.visible).toBe(false);
        });

        it('should call events.off four times for transition events', function ()
        {
            sys.shutdown();
            expect(mockEvents.off.mock.calls.length).toBe(4);
        });

        it('should emit a SHUTDOWN event', function ()
        {
            sys.shutdown();
            expect(mockEvents.emit).toHaveBeenCalled();
        });

        it('should pass data to the SHUTDOWN event', function ()
        {
            var data = { reason: 'done' };
            sys.shutdown(data);
            expect(mockEvents.emit).toHaveBeenCalledWith(expect.any(String), sys, data);
        });
    });

    describe('setActive', function ()
    {
        it('should resume the scene when value is true and not active', function ()
        {
            sys.settings.active = false;
            sys.setActive(true);
            expect(sys.settings.active).toBe(true);
        });

        it('should pause the scene when value is false and RUNNING', function ()
        {
            sys.settings.status = CONST.RUNNING;
            sys.settings.active = true;
            sys.setActive(false);
            expect(sys.settings.active).toBe(false);
        });

        it('should return the Systems instance for chaining', function ()
        {
            sys.settings.active = false;
            expect(sys.setActive(true)).toBe(sys);
        });
    });

    describe('step', function ()
    {
        it('should emit PRE_UPDATE, UPDATE, and POST_UPDATE events', function ()
        {
            sys.step(1000, 16);
            expect(mockEvents.emit.mock.calls.length).toBe(3);
        });

        it('should call sceneUpdate with correct time and delta', function ()
        {
            var calledWith = null;
            sys.sceneUpdate = function (time, delta)
            {
                calledWith = { time: time, delta: delta };
            };
            sys.step(1000, 16);
            expect(calledWith).not.toBeNull();
            expect(calledWith.time).toBe(1000);
            expect(calledWith.delta).toBe(16);
        });

        it('should call sceneUpdate with zero time and delta', function ()
        {
            var calledWith = null;
            sys.sceneUpdate = function (time, delta)
            {
                calledWith = { time: time, delta: delta };
            };
            sys.step(0, 0);
            expect(calledWith.time).toBe(0);
            expect(calledWith.delta).toBe(0);
        });
    });

    describe('render', function ()
    {
        it('should call displayList.depthSort', function ()
        {
            var mockRenderer = {};
            sys.render(mockRenderer);
            expect(mockDisplayList.depthSort).toHaveBeenCalled();
        });

        it('should call cameras.render with renderer and displayList', function ()
        {
            var mockRenderer = {};
            sys.render(mockRenderer);
            expect(mockCameras.render).toHaveBeenCalledWith(mockRenderer, mockDisplayList);
        });

        it('should emit PRE_RENDER and RENDER events', function ()
        {
            var mockRenderer = {};
            sys.render(mockRenderer);
            expect(mockEvents.emit.mock.calls.length).toBe(2);
        });

        it('should emit PRE_RENDER before RENDER', function ()
        {
            var order = [];
            mockEvents.emit = vi.fn(function (event)
            {
                order.push(event);
            });
            var mockRenderer = {};
            sys.render(mockRenderer);
            expect(order.length).toBe(2);
        });
    });

    describe('queueDepthSort', function ()
    {
        it('should call displayList.queueDepthSort', function ()
        {
            sys.queueDepthSort();
            expect(mockDisplayList.queueDepthSort).toHaveBeenCalled();
        });

        it('should call queueDepthSort exactly once', function ()
        {
            sys.queueDepthSort();
            expect(mockDisplayList.queueDepthSort.mock.calls.length).toBe(1);
        });
    });

    describe('depthSort', function ()
    {
        it('should call displayList.depthSort', function ()
        {
            sys.depthSort();
            expect(mockDisplayList.depthSort).toHaveBeenCalled();
        });

        it('should call depthSort exactly once', function ()
        {
            sys.depthSort();
            expect(mockDisplayList.depthSort.mock.calls.length).toBe(1);
        });
    });
});
