var SceneManager = require('../../src/scene/SceneManager');
var CONST = require('../../src/scene/const');

function createMockGame ()
{
    return {
        events: {
            once: function () {},
            emit: function () {},
            off: function () {}
        }
    };
}

function createMockScene (key, statusOverride)
{
    var status = (statusOverride !== undefined) ? statusOverride : CONST.RUNNING;

    return {
        sys: {
            settings: {
                key: key,
                status: status,
                visible: true,
                active: true,
                data: {}
            },
            isActive: function ()
            {
                return this.settings.status === CONST.RUNNING;
            },
            isPaused: function ()
            {
                return this.settings.status === CONST.PAUSED;
            },
            isVisible: function ()
            {
                return this.settings.visible;
            },
            isSleeping: function ()
            {
                return this.settings.status === CONST.SLEEPING;
            },
            isTransitioning: function ()
            {
                return false;
            },
            pause: function () { this.settings.status = CONST.PAUSED; },
            resume: function () { this.settings.status = CONST.RUNNING; },
            sleep: function () { this.settings.status = CONST.SLEEPING; },
            wake: function () { this.settings.status = CONST.RUNNING; },
            shutdown: function () { this.settings.status = CONST.SHUTDOWN; },
            destroy: function () { this.settings.status = CONST.DESTROYED; }
        }
    };
}

function createBootedManager ()
{
    var game = createMockGame();
    var manager = new SceneManager(game, null);

    manager.isBooted = true;

    return manager;
}

function addSceneToManager (manager, key, statusOverride)
{
    var scene = createMockScene(key, statusOverride);

    manager.scenes.push(scene);
    manager.keys[key] = scene;

    return scene;
}

describe('SceneManager', function ()
{
    describe('constructor', function ()
    {
        it('should initialize with correct default values', function ()
        {
            var game = createMockGame();
            var manager = new SceneManager(game, null);

            expect(manager.game).toBe(game);
            expect(manager.isProcessing).toBe(false);
            expect(manager.isBooted).toBe(false);
            expect(manager.customViewports).toBe(0);
            expect(Array.isArray(manager.scenes)).toBe(true);
            expect(manager.scenes.length).toBe(0);
        });

        it('should initialize with empty keys, pending, start and queue collections', function ()
        {
            var game = createMockGame();
            var manager = new SceneManager(game, null);

            expect(typeof manager.keys).toBe('object');
            expect(manager._pending.length).toBe(0);
            expect(manager._start.length).toBe(0);
            expect(manager._queue.length).toBe(0);
        });

        it('should push a single scene config into the pending list', function ()
        {
            var game = createMockGame();
            var sceneConfig = { key: 'TestScene' };
            var manager = new SceneManager(game, sceneConfig);

            expect(manager._pending.length).toBe(1);
            expect(manager._pending[0].key).toBe('default');
            expect(manager._pending[0].scene).toBe(sceneConfig);
            expect(manager._pending[0].autoStart).toBe(true);
        });

        it('should push multiple scene configs into the pending list', function ()
        {
            var game = createMockGame();
            var sceneA = { key: 'SceneA' };
            var sceneB = { key: 'SceneB' };
            var manager = new SceneManager(game, [ sceneA, sceneB ]);

            expect(manager._pending.length).toBe(2);
            expect(manager._pending[0].autoStart).toBe(true);
            expect(manager._pending[1].autoStart).toBe(false);
        });

        it('should wrap a non-array scene config in an array', function ()
        {
            var game = createMockGame();
            var sceneConfig = { key: 'Solo' };
            var manager = new SceneManager(game, sceneConfig);

            expect(manager._pending.length).toBe(1);
        });
    });

    describe('processQueue', function ()
    {
        it('should return early when both pending and queue are empty', function ()
        {
            var manager = createBootedManager();

            // Should not throw
            manager.processQueue();

            expect(manager._pending.length).toBe(0);
            expect(manager._queue.length).toBe(0);
        });

        it('should process queued operations', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');

            // Queue a swapPosition op
            manager._queue.push({ op: 'swapPosition', keyA: 'SceneA', keyB: 'SceneB', data: undefined });

            manager.processQueue();

            expect(manager.scenes[0]).toBe(sceneB);
            expect(manager.scenes[1]).toBe(sceneA);
            expect(manager._queue.length).toBe(0);
        });
    });

    describe('add', function ()
    {
        it('should queue to pending when not booted', function ()
        {
            var game = createMockGame();
            var manager = new SceneManager(game, null);

            // isBooted is false
            var result = manager.add('NewScene', { key: 'NewScene' }, false, {});

            expect(result).toBeNull();
            expect(manager._pending.length).toBe(1);
            expect(manager._pending[0].key).toBe('NewScene');
        });

        it('should queue to pending when isProcessing is true', function ()
        {
            var manager = createBootedManager();

            manager.isProcessing = true;

            var result = manager.add('NewScene', { key: 'NewScene' }, false, {});

            expect(result).toBeNull();
            expect(manager._pending.length).toBe(1);
        });
    });

    describe('getScene', function ()
    {
        it('should retrieve a scene by string key', function ()
        {
            var manager = createBootedManager();
            var scene = addSceneToManager(manager, 'Level1');

            expect(manager.getScene('Level1')).toBe(scene);
        });

        it('should return null for an unknown key', function ()
        {
            var manager = createBootedManager();

            expect(manager.getScene('DoesNotExist')).toBeNull();
        });

        it('should retrieve a scene when passed a scene object directly', function ()
        {
            var manager = createBootedManager();
            var scene = addSceneToManager(manager, 'Level1');

            expect(manager.getScene(scene)).toBe(scene);
        });

        it('should return null when a scene object is not in the manager', function ()
        {
            var manager = createBootedManager();
            var foreignScene = createMockScene('Foreign');

            expect(manager.getScene(foreignScene)).toBeNull();
        });
    });

    describe('getScenes', function ()
    {
        it('should return only active scenes by default', function ()
        {
            var manager = createBootedManager();

            addSceneToManager(manager, 'Active', CONST.RUNNING);
            addSceneToManager(manager, 'Sleeping', CONST.SLEEPING);

            var result = manager.getScenes();

            expect(result.length).toBe(1);
            expect(result[0].sys.settings.key).toBe('Active');
        });

        it('should return all scenes when isActive is false', function ()
        {
            var manager = createBootedManager();

            addSceneToManager(manager, 'Active', CONST.RUNNING);
            addSceneToManager(manager, 'Sleeping', CONST.SLEEPING);

            var result = manager.getScenes(false);

            expect(result.length).toBe(2);
        });

        it('should return scenes in reverse when inReverse is true', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA', CONST.RUNNING);
            var sceneB = addSceneToManager(manager, 'SceneB', CONST.RUNNING);

            var result = manager.getScenes(true, true);

            expect(result[0]).toBe(sceneB);
            expect(result[1]).toBe(sceneA);
        });

        it('should return an empty array when no scenes exist', function ()
        {
            var manager = createBootedManager();

            var result = manager.getScenes();

            expect(result.length).toBe(0);
        });
    });

    describe('getAt', function ()
    {
        it('should return the scene at the given index', function ()
        {
            var manager = createBootedManager();
            var scene = addSceneToManager(manager, 'First');

            expect(manager.getAt(0)).toBe(scene);
        });

        it('should return undefined for an out-of-bounds index', function ()
        {
            var manager = createBootedManager();

            expect(manager.getAt(99)).toBeUndefined();
        });
    });

    describe('getIndex', function ()
    {
        it('should return the correct index for a known scene key', function ()
        {
            var manager = createBootedManager();

            addSceneToManager(manager, 'First');
            addSceneToManager(manager, 'Second');

            expect(manager.getIndex('First')).toBe(0);
            expect(manager.getIndex('Second')).toBe(1);
        });

        it('should return -1 for an unknown scene key', function ()
        {
            var manager = createBootedManager();

            expect(manager.getIndex('Unknown')).toBe(-1);
        });
    });

    describe('isActive / isPaused / isVisible / isSleeping', function ()
    {
        it('should return null when the scene key does not exist', function ()
        {
            var manager = createBootedManager();

            expect(manager.isActive('Ghost')).toBeNull();
            expect(manager.isPaused('Ghost')).toBeNull();
            expect(manager.isVisible('Ghost')).toBeNull();
            expect(manager.isSleeping('Ghost')).toBeNull();
        });

        it('isActive should return true for a running scene', function ()
        {
            var manager = createBootedManager();
            addSceneToManager(manager, 'Running', CONST.RUNNING);

            expect(manager.isActive('Running')).toBe(true);
        });

        it('isPaused should return true for a paused scene', function ()
        {
            var manager = createBootedManager();
            addSceneToManager(manager, 'Paused', CONST.PAUSED);

            expect(manager.isPaused('Paused')).toBe(true);
        });

        it('isSleeping should return true for a sleeping scene', function ()
        {
            var manager = createBootedManager();
            addSceneToManager(manager, 'Sleeping', CONST.SLEEPING);

            expect(manager.isSleeping('Sleeping')).toBe(true);
        });
    });

    describe('bringToTop', function ()
    {
        it('should move a scene to the end of the scenes array', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');
            var sceneC = addSceneToManager(manager, 'SceneC');

            manager.bringToTop('SceneA');

            expect(manager.scenes[2]).toBe(sceneA);
            expect(manager.scenes[0]).toBe(sceneB);
            expect(manager.scenes[1]).toBe(sceneC);
        });

        it('should return this for chaining', function ()
        {
            var manager = createBootedManager();
            addSceneToManager(manager, 'SceneA');

            expect(manager.bringToTop('SceneA')).toBe(manager);
        });

        it('should queue the operation when isProcessing is true', function ()
        {
            var manager = createBootedManager();
            addSceneToManager(manager, 'SceneA');

            manager.isProcessing = true;
            manager.bringToTop('SceneA');

            expect(manager._queue.length).toBe(1);
            expect(manager._queue[0].op).toBe('bringToTop');
        });
    });

    describe('sendToBack', function ()
    {
        it('should move a scene to the start of the scenes array', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');
            var sceneC = addSceneToManager(manager, 'SceneC');

            manager.sendToBack('SceneC');

            expect(manager.scenes[0]).toBe(sceneC);
            expect(manager.scenes[1]).toBe(sceneA);
            expect(manager.scenes[2]).toBe(sceneB);
        });

        it('should not move a scene that is already at index 0', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');

            manager.sendToBack('SceneA');

            expect(manager.scenes[0]).toBe(sceneA);
            expect(manager.scenes[1]).toBe(sceneB);
        });
    });

    describe('moveUp', function ()
    {
        it('should move a scene one position toward the end of the array', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');

            manager.moveUp('SceneA');

            expect(manager.scenes[0]).toBe(sceneB);
            expect(manager.scenes[1]).toBe(sceneA);
        });

        it('should not move a scene already at the top', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');

            manager.moveUp('SceneB');

            expect(manager.scenes[0]).toBe(sceneA);
            expect(manager.scenes[1]).toBe(sceneB);
        });
    });

    describe('moveDown', function ()
    {
        it('should move a scene one position toward the start of the array', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');

            manager.moveDown('SceneB');

            expect(manager.scenes[0]).toBe(sceneB);
            expect(manager.scenes[1]).toBe(sceneA);
        });

        it('should not move a scene already at index 0', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');

            manager.moveDown('SceneA');

            expect(manager.scenes[0]).toBe(sceneA);
            expect(manager.scenes[1]).toBe(sceneB);
        });
    });

    describe('swapPosition', function ()
    {
        it('should swap two scenes positions', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');

            manager.swapPosition('SceneA', 'SceneB');

            expect(manager.scenes[0]).toBe(sceneB);
            expect(manager.scenes[1]).toBe(sceneA);
        });

        it('should not change order when both keys are the same', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');

            manager.swapPosition('SceneA', 'SceneA');

            expect(manager.scenes[0]).toBe(sceneA);
            expect(manager.scenes[1]).toBe(sceneB);
        });

        it('should return this for chaining', function ()
        {
            var manager = createBootedManager();
            addSceneToManager(manager, 'SceneA');
            addSceneToManager(manager, 'SceneB');

            expect(manager.swapPosition('SceneA', 'SceneB')).toBe(manager);
        });
    });

    describe('moveAbove', function ()
    {
        it('should move sceneB immediately above sceneA when B is below A', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');
            var sceneC = addSceneToManager(manager, 'SceneC');

            // Move SceneA (index 0) above SceneC (index 2) — SceneA is below SceneC
            manager.moveAbove('SceneC', 'SceneA');

            // SceneA should now be at index 2 (above SceneC)
            expect(manager.scenes[2]).toBe(sceneA);
        });

        it('should return this unchanged when both keys are the same', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');

            manager.moveAbove('SceneA', 'SceneA');

            expect(manager.scenes[0]).toBe(sceneA);
            expect(manager.scenes[1]).toBe(sceneB);
        });
    });

    describe('moveBelow', function ()
    {
        it('should move sceneB immediately below sceneA when B is above A', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');
            var sceneC = addSceneToManager(manager, 'SceneC');

            // Move SceneC (index 2) below SceneA (index 0) — SceneC is above SceneA
            manager.moveBelow('SceneA', 'SceneC');

            expect(manager.scenes[0]).toBe(sceneC);
        });

        it('should return this unchanged when both keys are the same', function ()
        {
            var manager = createBootedManager();
            var sceneA = addSceneToManager(manager, 'SceneA');
            var sceneB = addSceneToManager(manager, 'SceneB');

            manager.moveBelow('SceneA', 'SceneA');

            expect(manager.scenes[0]).toBe(sceneA);
            expect(manager.scenes[1]).toBe(sceneB);
        });
    });

    describe('remove', function ()
    {
        it('should remove a scene by key', function ()
        {
            var manager = createBootedManager();
            addSceneToManager(manager, 'Level1');

            manager.remove('Level1');

            expect(manager.scenes.length).toBe(0);
            expect(manager.keys['Level1']).toBeUndefined();
        });

        it('should return this when scene key is not found', function ()
        {
            var manager = createBootedManager();

            var result = manager.remove('NonExistent');

            expect(result).toBe(manager);
        });

        it('should return this for chaining on successful remove', function ()
        {
            var manager = createBootedManager();
            addSceneToManager(manager, 'Level1');

            var result = manager.remove('Level1');

            expect(result).toBe(manager);
        });

        it('should queue the operation when isProcessing is true', function ()
        {
            var manager = createBootedManager();
            addSceneToManager(manager, 'Level1');

            manager.isProcessing = true;
            manager.remove('Level1');

            expect(manager._queue.length).toBe(1);
            expect(manager._queue[0].op).toBe('remove');
            expect(manager.scenes.length).toBe(1);
        });
    });

    describe('destroy', function ()
    {
        it('should clear all internal arrays and nullify references', function ()
        {
            var manager = createBootedManager();

            // Give it a fake systemScene so destroy does not throw
            manager.systemScene = { sys: { destroy: function () {} } };

            manager.destroy();

            expect(manager.scenes.length).toBe(0);
            expect(manager._pending.length).toBe(0);
            expect(manager._start.length).toBe(0);
            expect(manager._queue.length).toBe(0);
            expect(manager.game).toBeNull();
            expect(manager.systemScene).toBeNull();
        });

        it('should replace update with NOOP after destroy', function ()
        {
            var manager = createBootedManager();

            manager.systemScene = { sys: { destroy: function () {} } };

            manager.destroy();

            var NOOP = require('../../src/utils/NOOP');

            expect(manager.update).toBe(NOOP);
        });
    });
});
