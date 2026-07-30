var ProcessQueue = require('../../src/structs/ProcessQueue');

describe('ProcessQueue', function ()
{
    var queue;

    beforeEach(function ()
    {
        queue = new ProcessQueue();
    });

    afterEach(function ()
    {
        queue.destroy();
    });

    describe('constructor', function ()
    {
        it('should create a ProcessQueue with empty lists', function ()
        {
            expect(queue.getActive()).toEqual([]);
        });

        it('should initialize _toProcess to zero', function ()
        {
            expect(queue._toProcess).toBe(0);
        });

        it('should initialize checkQueue to false', function ()
        {
            expect(queue.checkQueue).toBe(false);
        });

        it('should have a length of zero initially', function ()
        {
            expect(queue.length).toBe(0);
        });
    });

    describe('isActive', function ()
    {
        it('should return false for an item not in the active list', function ()
        {
            var item = { id: 1 };
            expect(queue.isActive(item)).toBe(false);
        });

        it('should return true for an item in the active list after update', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            expect(queue.isActive(item)).toBe(true);
        });

        it('should return false for an item only in pending list', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            expect(queue.isActive(item)).toBe(false);
        });

        it('should return false after item is removed and updated', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            queue.remove(item);
            queue.update();
            expect(queue.isActive(item)).toBe(false);
        });
    });

    describe('isPending', function ()
    {
        it('should return false when nothing is pending', function ()
        {
            var item = { id: 1 };
            expect(queue.isPending(item)).toBe(false);
        });

        it('should return true for an item added but not yet updated', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            expect(queue.isPending(item)).toBe(true);
        });

        it('should return false after update processes pending items', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            expect(queue.isPending(item)).toBe(false);
        });

        it('should return false for an item not in pending list', function ()
        {
            var item1 = { id: 1 };
            var item2 = { id: 2 };
            queue.add(item1);
            expect(queue.isPending(item2)).toBe(false);
        });
    });

    describe('isDestroying', function ()
    {
        it('should return false for an item not pending destruction', function ()
        {
            var item = { id: 1 };
            expect(queue.isDestroying(item)).toBe(false);
        });

        it('should return true for an active item that has been removed', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            queue.remove(item);
            expect(queue.isDestroying(item)).toBe(true);
        });

        it('should return false after the destroy list is processed', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            queue.remove(item);
            queue.update();
            expect(queue.isDestroying(item)).toBe(false);
        });
    });

    describe('add', function ()
    {
        it('should add an item to the pending list', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            expect(queue.isPending(item)).toBe(true);
        });

        it('should return the added item', function ()
        {
            var item = { id: 1 };
            var result = queue.add(item);
            expect(result).toBe(item);
        });

        it('should increment _toProcess count', function ()
        {
            queue.add({ id: 1 });
            expect(queue._toProcess).toBe(1);
        });

        it('should allow multiple different items to be added', function ()
        {
            var item1 = { id: 1 };
            var item2 = { id: 2 };
            queue.add(item1);
            queue.add(item2);
            expect(queue._toProcess).toBe(2);
        });

        it('should allow the same item multiple times when checkQueue is false', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.add(item);
            expect(queue._toProcess).toBe(1);
        });

        it('should not add a duplicate pending item when checkQueue is true', function ()
        {
            queue.checkQueue = true;
            var item = { id: 1 };
            queue.add(item);
            queue.add(item);
            expect(queue._toProcess).toBe(1);
        });

        it('should not add an active item when checkQueue is true and item is not destroying', function ()
        {
            queue.checkQueue = true;
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            queue.add(item);
            expect(queue._toProcess).toBe(0);
        });

        it('should allow re-adding an item that is active but pending destruction when checkQueue is true', function ()
        {
            queue.checkQueue = true;
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            queue.remove(item);
            var result = queue.add(item);
            expect(result).toBe(item);
        });
    });

    describe('remove', function ()
    {
        it('should return the removed item', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            var result = queue.remove(item);
            expect(result).toBe(item);
        });

        it('should move an active item to the destroy list', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            queue.remove(item);
            expect(queue.isDestroying(item)).toBe(true);
        });

        it('should remove a pending item directly without waiting for update', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.remove(item);
            expect(queue.isPending(item)).toBe(false);
        });

        it('should not move a pending item to destroy list when removed', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.remove(item);
            expect(queue.isDestroying(item)).toBe(false);
        });

        it('should do nothing if item is not pending or active', function ()
        {
            var item = { id: 1 };
            var result = queue.remove(item);
            expect(result).toBe(item);
            expect(queue._toProcess).toBe(0);
        });

        it('should add item to destroy list each time remove is called', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            queue.remove(item);
            queue.remove(item);
            expect(queue._destroy.length).toBe(2);
        });
    });

    describe('removeAll', function ()
    {
        it('should return the queue instance', function ()
        {
            var result = queue.removeAll();
            expect(result).toBe(queue);
        });

        it('should move all active items to the destroy list', function ()
        {
            var item1 = { id: 1 };
            var item2 = { id: 2 };
            queue.add(item1);
            queue.add(item2);
            queue.update();
            queue.removeAll();
            expect(queue.isDestroying(item1)).toBe(true);
            expect(queue.isDestroying(item2)).toBe(true);
        });

        it('should remove all items from active list after update', function ()
        {
            var item1 = { id: 1 };
            var item2 = { id: 2 };
            queue.add(item1);
            queue.add(item2);
            queue.update();
            queue.removeAll();
            queue.update();
            expect(queue.getActive().length).toBe(0);
        });

        it('should do nothing when no active items exist', function ()
        {
            queue.removeAll();
            expect(queue._toProcess).toBe(0);
        });

        it('should increment _toProcess for each active item', function ()
        {
            var item1 = { id: 1 };
            var item2 = { id: 2 };
            var item3 = { id: 3 };
            queue.add(item1);
            queue.add(item2);
            queue.add(item3);
            queue.update();
            queue.removeAll();
            expect(queue._toProcess).toBe(3);
        });
    });

    describe('update', function ()
    {
        it('should return the active list', function ()
        {
            var result = queue.update();
            expect(Array.isArray(result)).toBe(true);
        });

        it('should return active list immediately when _toProcess is zero', function ()
        {
            var active = queue.getActive();
            var result = queue.update();
            expect(result).toBe(active);
        });

        it('should move pending items to active list', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            expect(queue.isActive(item)).toBe(true);
        });

        it('should remove destroyed items from active list', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            queue.remove(item);
            queue.update();
            expect(queue.isActive(item)).toBe(false);
        });

        it('should reset _toProcess to zero after update', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            expect(queue._toProcess).toBe(0);
        });

        it('should clear the pending list after update', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            expect(queue._pending.length).toBe(0);
        });

        it('should clear the destroy list after update', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            queue.remove(item);
            queue.update();
            expect(queue._destroy.length).toBe(0);
        });

        it('should emit PROCESS_QUEUE_ADD event when item becomes active', function ()
        {
            var item = { id: 1 };
            var emitted = null;
            queue.on('add', function (i) { emitted = i; });
            queue.add(item);
            queue.update();
            expect(emitted).toBe(item);
        });

        it('should emit PROCESS_QUEUE_REMOVE event when item is destroyed', function ()
        {
            var item = { id: 1 };
            var emitted = null;
            queue.on('remove', function (i) { emitted = i; });
            queue.add(item);
            queue.update();
            queue.remove(item);
            queue.update();
            expect(emitted).toBe(item);
        });

        it('should not add duplicate items when checkQueue is true', function ()
        {
            queue.checkQueue = true;
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            queue._pending.push(item);
            queue._toProcess = 1;
            queue.update();
            expect(queue.getActive().length).toBe(1);
        });

        it('should handle multiple add and remove cycles', function ()
        {
            var item1 = { id: 1 };
            var item2 = { id: 2 };
            queue.add(item1);
            queue.add(item2);
            queue.update();
            queue.remove(item1);
            queue.update();
            expect(queue.isActive(item1)).toBe(false);
            expect(queue.isActive(item2)).toBe(true);
        });
    });

    describe('getActive', function ()
    {
        it('should return an empty array initially', function ()
        {
            expect(queue.getActive()).toEqual([]);
        });

        it('should return the active items after update', function ()
        {
            var item1 = { id: 1 };
            var item2 = { id: 2 };
            queue.add(item1);
            queue.add(item2);
            queue.update();
            var active = queue.getActive();
            expect(active.length).toBe(2);
            expect(active.indexOf(item1)).toBeGreaterThan(-1);
            expect(active.indexOf(item2)).toBeGreaterThan(-1);
        });

        it('should return a reference to the internal array, not a copy', function ()
        {
            var ref1 = queue.getActive();
            var ref2 = queue.getActive();
            expect(ref1).toBe(ref2);
        });
    });

    describe('length', function ()
    {
        it('should return zero for an empty queue', function ()
        {
            expect(queue.length).toBe(0);
        });

        it('should reflect active item count after update', function ()
        {
            queue.add({ id: 1 });
            queue.add({ id: 2 });
            queue.update();
            expect(queue.length).toBe(2);
        });

        it('should not count pending items', function ()
        {
            queue.add({ id: 1 });
            expect(queue.length).toBe(0);
        });

        it('should decrease after items are removed and updated', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            queue.remove(item);
            queue.update();
            expect(queue.length).toBe(0);
        });
    });

    describe('destroy', function ()
    {
        it('should reset _toProcess to zero', function ()
        {
            queue.add({ id: 1 });
            queue.destroy();
            expect(queue._toProcess).toBe(0);
        });

        it('should clear the pending list', function ()
        {
            queue.add({ id: 1 });
            queue.destroy();
            expect(queue._pending.length).toBe(0);
        });

        it('should clear the active list', function ()
        {
            queue.add({ id: 1 });
            queue.update();
            queue.destroy();
            expect(queue._active.length).toBe(0);
        });

        it('should clear the destroy list', function ()
        {
            var item = { id: 1 };
            queue.add(item);
            queue.update();
            queue.remove(item);
            queue.destroy();
            expect(queue._destroy.length).toBe(0);
        });

        it('should result in a length of zero', function ()
        {
            queue.add({ id: 1 });
            queue.update();
            queue.destroy();
            expect(queue.length).toBe(0);
        });
    });
});
