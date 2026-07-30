var EventEmitter = require('eventemitter3');
var UpdateList = require('../../src/gameobjects/UpdateList');

function createMockScene ()
{
    var events = new EventEmitter();

    return {
        sys: {
            events: events
        }
    };
}

function createMockGameObject (active)
{
    return {
        active: (active === undefined) ? true : active,
        preUpdate: vi.fn(),
        destroy: vi.fn()
    };
}

describe('UpdateList', function ()
{
    var scene;
    var updateList;

    beforeEach(function ()
    {
        scene = createMockScene();
        updateList = new UpdateList(scene);
    });

    afterEach(function ()
    {
        vi.restoreAllMocks();
    });

    describe('constructor', function ()
    {
        it('should set checkQueue to true', function ()
        {
            expect(updateList.checkQueue).toBe(true);
        });

        it('should store a reference to the scene', function ()
        {
            expect(updateList.scene).toBe(scene);
        });

        it('should store a reference to scene.sys as systems', function ()
        {
            expect(updateList.systems).toBe(scene.sys);
        });

        it('should initialise with an empty active list', function ()
        {
            expect(updateList.getActive()).toEqual([]);
        });

        it('should initialise with length zero', function ()
        {
            expect(updateList.length).toBe(0);
        });

        it('should register a boot listener on scene.sys.events', function ()
        {
            // After emitting boot, the destroy listener should be registered on sys events
            scene.sys.events.emit('boot');
            var hasDestroyListener = scene.sys.events.listenerCount('destroy') > 0;
            expect(hasDestroyListener).toBe(true);
        });

        it('should register a start listener on scene.sys.events', function ()
        {
            var listeners = scene.sys.events.listenerCount('start');
            expect(listeners).toBeGreaterThan(0);
        });
    });

    describe('add', function ()
    {
        it('should add an item to the pending list', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            expect(updateList._pending).toContain(obj);
        });

        it('should return the added item', function ()
        {
            var obj = createMockGameObject();
            var result = updateList.add(obj);
            expect(result).toBe(obj);
        });

        it('should move item from pending to active after update', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            expect(updateList.getActive()).toContain(obj);
        });

        it('should not add a duplicate item when already active (checkQueue is true)', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            updateList.add(obj);
            // _toProcess should remain 0 as duplicate was blocked
            expect(updateList._toProcess).toBe(0);
        });

        it('should not add a duplicate item when already pending', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.add(obj);
            expect(updateList._pending.length).toBe(1);
        });

        it('should increase length after update', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            expect(updateList.length).toBe(1);
        });
    });

    describe('remove', function ()
    {
        it('should return the removed item', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            var result = updateList.remove(obj);
            expect(result).toBe(obj);
        });

        it('should queue an active item for destruction', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            updateList.remove(obj);
            expect(updateList._destroy).toContain(obj);
        });

        it('should remove item from active list after update', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            updateList.remove(obj);
            updateList.update();
            expect(updateList.getActive()).not.toContain(obj);
        });

        it('should remove a pending item directly without waiting for update', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.remove(obj);
            expect(updateList._pending).not.toContain(obj);
        });
    });

    describe('removeAll', function ()
    {
        it('should return the UpdateList instance', function ()
        {
            var result = updateList.removeAll();
            expect(result).toBe(updateList);
        });

        it('should mark all active items for destruction', function ()
        {
            var obj1 = createMockGameObject();
            var obj2 = createMockGameObject();
            updateList.add(obj1);
            updateList.add(obj2);
            updateList.update();
            updateList.removeAll();
            expect(updateList._destroy).toContain(obj1);
            expect(updateList._destroy).toContain(obj2);
        });

        it('should result in an empty active list after update', function ()
        {
            var obj1 = createMockGameObject();
            var obj2 = createMockGameObject();
            updateList.add(obj1);
            updateList.add(obj2);
            updateList.update();
            updateList.removeAll();
            updateList.update();
            expect(updateList.getActive().length).toBe(0);
        });
    });

    describe('update', function ()
    {
        it('should return the active list', function ()
        {
            var result = updateList.update();
            expect(Array.isArray(result)).toBe(true);
        });

        it('should return the same active array reference', function ()
        {
            var active = updateList.getActive();
            var result = updateList.update();
            expect(result).toBe(active);
        });

        it('should move pending items to active', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            var active = updateList.update();
            expect(active).toContain(obj);
        });

        it('should reset _toProcess to zero after processing', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            expect(updateList._toProcess).toBe(0);
        });

        it('should clear the pending list after processing', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            expect(updateList._pending.length).toBe(0);
        });

        it('should remove destroyed items from active list', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            updateList.remove(obj);
            updateList.update();
            expect(updateList.getActive()).not.toContain(obj);
        });

        it('should bail early when _toProcess is zero', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            // No changes - should return same active list without processing
            var active = updateList.update();
            expect(active).toContain(obj);
        });
    });

    describe('getActive', function ()
    {
        it('should return an empty array initially', function ()
        {
            expect(updateList.getActive()).toEqual([]);
        });

        it('should return active items after update', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            expect(updateList.getActive()).toContain(obj);
        });

        it('should return a reference to the internal active array', function ()
        {
            var ref = updateList.getActive();
            expect(ref).toBe(updateList._active);
        });
    });

    describe('sceneUpdate', function ()
    {
        it('should call preUpdate on active game objects with active=true', function ()
        {
            var obj = createMockGameObject(true);
            updateList.add(obj);
            updateList.update();
            updateList.sceneUpdate(100, 16);
            expect(obj.preUpdate).toHaveBeenCalledWith(100, 16);
        });

        it('should not call preUpdate on inactive game objects', function ()
        {
            var obj = createMockGameObject(false);
            updateList.add(obj);
            updateList.update();
            updateList.sceneUpdate(100, 16);
            expect(obj.preUpdate).not.toHaveBeenCalled();
        });

        it('should pass time and delta to preUpdate', function ()
        {
            var obj = createMockGameObject(true);
            updateList.add(obj);
            updateList.update();
            updateList.sceneUpdate(9999, 32.5);
            expect(obj.preUpdate).toHaveBeenCalledWith(9999, 32.5);
        });

        it('should call preUpdate on multiple active objects', function ()
        {
            var obj1 = createMockGameObject(true);
            var obj2 = createMockGameObject(true);
            updateList.add(obj1);
            updateList.add(obj2);
            updateList.update();
            updateList.sceneUpdate(0, 16);
            expect(obj1.preUpdate).toHaveBeenCalledTimes(1);
            expect(obj2.preUpdate).toHaveBeenCalledTimes(1);
        });

        it('should do nothing when active list is empty', function ()
        {
            // Should not throw
            expect(function ()
            {
                updateList.sceneUpdate(0, 16);
            }).not.toThrow();
        });

        it('should skip objects with active=false but process active=true ones', function ()
        {
            var activeObj = createMockGameObject(true);
            var inactiveObj = createMockGameObject(false);
            updateList.add(activeObj);
            updateList.add(inactiveObj);
            updateList.update();
            updateList.sceneUpdate(0, 16);
            expect(activeObj.preUpdate).toHaveBeenCalledTimes(1);
            expect(inactiveObj.preUpdate).not.toHaveBeenCalled();
        });
    });

    describe('shutdown', function ()
    {
        it('should call destroy on all active objects', function ()
        {
            var obj1 = createMockGameObject();
            var obj2 = createMockGameObject();
            updateList.add(obj1);
            updateList.add(obj2);
            updateList.update();
            updateList.shutdown();
            expect(obj1.destroy).toHaveBeenCalledWith(true);
            expect(obj2.destroy).toHaveBeenCalledWith(true);
        });

        it('should call destroy on all pending objects', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            // Do NOT call update so obj stays pending
            updateList.shutdown();
            expect(obj.destroy).toHaveBeenCalledWith(true);
        });

        it('should reset _toProcess to zero', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.shutdown();
            expect(updateList._toProcess).toBe(0);
        });

        it('should clear the active list', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            updateList.shutdown();
            expect(updateList._active).toEqual([]);
        });

        it('should clear the pending list', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.shutdown();
            expect(updateList._pending).toEqual([]);
        });

        it('should clear the destroy list', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            updateList.remove(obj);
            updateList.shutdown();
            expect(updateList._destroy).toEqual([]);
        });

        it('should remove PRE_UPDATE and UPDATE scene event listeners', function ()
        {
            // Trigger start to register listeners
            scene.sys.events.emit('start');
            updateList.shutdown();
            expect(scene.sys.events.listenerCount('preupdate')).toBe(0);
            expect(scene.sys.events.listenerCount('update')).toBe(0);
        });
    });

    describe('destroy', function ()
    {
        it('should null the scene reference', function ()
        {
            updateList.destroy();
            expect(updateList.scene).toBeNull();
        });

        it('should null the systems reference', function ()
        {
            updateList.destroy();
            expect(updateList.systems).toBeNull();
        });

        it('should clear the active list', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            updateList.destroy();
            expect(updateList._active).toEqual([]);
        });

        it('should call destroy on active objects as part of shutdown', function ()
        {
            var obj = createMockGameObject();
            updateList.add(obj);
            updateList.update();
            updateList.destroy();
            expect(obj.destroy).toHaveBeenCalledWith(true);
        });
    });
});
