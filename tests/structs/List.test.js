var List = require('../../src/structs/List');

describe('Phaser.Structs.List', function ()
{
    var list;

    beforeEach(function ()
    {
        list = new List({ name: 'parent' });
    });

    afterEach(function ()
    {
        list = null;
    });

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    describe('constructor', function ()
    {
        it('should set the parent property', function ()
        {
            var parent = { name: 'parent' };
            var l = new List(parent);
            expect(l.parent).toBe(parent);
        });

        it('should initialise list as an empty array', function ()
        {
            expect(list.list).toEqual([]);
        });

        it('should initialise position to zero', function ()
        {
            expect(list.position).toBe(0);
        });

        it('should initialise _sortKey to empty string', function ()
        {
            expect(list._sortKey).toBe('');
        });

        it('should accept null as parent', function ()
        {
            var l = new List(null);
            expect(l.parent).toBeNull();
        });
    });

    // -------------------------------------------------------------------------
    // add
    // -------------------------------------------------------------------------

    describe('add', function ()
    {
        it('should add a single item to the list', function ()
        {
            var item = { id: 1 };
            list.add(item, true);
            expect(list.list.length).toBe(1);
            expect(list.list[0]).toBe(item);
        });

        it('should add multiple items via an array', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            expect(list.list.length).toBe(2);
        });

        it('should not add duplicate items', function ()
        {
            var item = { id: 1 };
            list.add(item, true);
            list.add(item, true);
            expect(list.list.length).toBe(1);
        });

        it('should invoke the addCallback when skipCallback is false', function ()
        {
            var called = false;
            list.addCallback = function () { called = true; };
            var item = { id: 1 };
            list.add(item, false);
            expect(called).toBe(true);
        });

        it('should not invoke the addCallback when skipCallback is true', function ()
        {
            var called = false;
            list.addCallback = function () { called = true; };
            var item = { id: 1 };
            list.add(item, true);
            expect(called).toBe(false);
        });

        it('should return the added item', function ()
        {
            var item = { id: 1 };
            var result = list.add(item, true);
            expect(result).toBe(item);
        });
    });

    // -------------------------------------------------------------------------
    // addAt
    // -------------------------------------------------------------------------

    describe('addAt', function ()
    {
        it('should insert an item at the specified index', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, c ], true);
            list.addAt(b, 1, true);
            expect(list.list[1]).toBe(b);
        });

        it('should insert at index 0 by default', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add(a, true);
            list.addAt(b, 0, true);
            expect(list.list[0]).toBe(b);
        });

        it('should invoke the addCallback when skipCallback is false', function ()
        {
            var called = false;
            list.addCallback = function () { called = true; };
            var item = { id: 1 };
            list.addAt(item, 0, false);
            expect(called).toBe(true);
        });

        it('should not add a duplicate item', function ()
        {
            var item = { id: 1 };
            list.add(item, true);
            list.addAt(item, 0, true);
            expect(list.list.length).toBe(1);
        });
    });

    // -------------------------------------------------------------------------
    // getAt
    // -------------------------------------------------------------------------

    describe('getAt', function ()
    {
        it('should return the item at the given index', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            expect(list.getAt(0)).toBe(a);
            expect(list.getAt(1)).toBe(b);
        });

        it('should return undefined for an out-of-bounds index', function ()
        {
            expect(list.getAt(0)).toBeUndefined();
            expect(list.getAt(99)).toBeUndefined();
        });

        it('should return undefined for a negative index', function ()
        {
            list.add({ id: 1 }, true);
            expect(list.getAt(-1)).toBeUndefined();
        });
    });

    // -------------------------------------------------------------------------
    // getIndex
    // -------------------------------------------------------------------------

    describe('getIndex', function ()
    {
        it('should return the index of an existing child', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            expect(list.getIndex(a)).toBe(0);
            expect(list.getIndex(b)).toBe(1);
        });

        it('should return -1 for a child not in the list', function ()
        {
            var a = { id: 1 };
            expect(list.getIndex(a)).toBe(-1);
        });
    });

    // -------------------------------------------------------------------------
    // sort
    // -------------------------------------------------------------------------

    describe('sort', function ()
    {
        it('should sort items by a numeric property', function ()
        {
            var a = { depth: 3 };
            var b = { depth: 1 };
            var c = { depth: 2 };
            list.add([ a, b, c ], true);
            list.sort('depth');
            expect(list.list[0]).toBe(b);
            expect(list.list[1]).toBe(c);
            expect(list.list[2]).toBe(a);
        });

        it('should accept a custom handler function', function ()
        {
            var a = { depth: 1 };
            var b = { depth: 2 };
            var c = { depth: 3 };
            list.add([ a, b, c ], true);
            list.sort('depth', function (x, y) { return y.depth - x.depth; });
            expect(list.list[0]).toBe(c);
            expect(list.list[2]).toBe(a);
        });

        it('should return the List instance', function ()
        {
            var result = list.sort('depth');
            expect(result).toBe(list);
        });

        it('should return the List without sorting when no property is given', function ()
        {
            var a = { depth: 2 };
            var b = { depth: 1 };
            list.add([ a, b ], true);
            list.sort('');
            expect(list.list[0]).toBe(a);
        });
    });

    // -------------------------------------------------------------------------
    // getByName
    // -------------------------------------------------------------------------

    describe('getByName', function ()
    {
        it('should return the first child with a matching name', function ()
        {
            var a = { name: 'alpha' };
            var b = { name: 'beta' };
            list.add([ a, b ], true);
            expect(list.getByName('alpha')).toBe(a);
        });

        it('should return null when no child matches', function ()
        {
            list.add({ name: 'alpha' }, true);
            expect(list.getByName('missing')).toBeNull();
        });

        it('should return null for an empty list', function ()
        {
            expect(list.getByName('anything')).toBeNull();
        });
    });

    // -------------------------------------------------------------------------
    // getRandom
    // -------------------------------------------------------------------------

    describe('getRandom', function ()
    {
        it('should return an item from the list', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            var result = list.getRandom();
            expect([ a, b, c ]).toContain(result);
        });

        it('should return null for an empty list', function ()
        {
            expect(list.getRandom()).toBeNull();
        });

        it('should always return the only item when the list has one member', function ()
        {
            var a = { id: 1 };
            list.add(a, true);
            for (var i = 0; i < 10; i++)
            {
                expect(list.getRandom()).toBe(a);
            }
        });

        it('should respect startIndex and length constraints', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            for (var i = 0; i < 20; i++)
            {
                var result = list.getRandom(1, 2);
                expect([ b, c ]).toContain(result);
            }
        });
    });

    // -------------------------------------------------------------------------
    // getFirst
    // -------------------------------------------------------------------------

    describe('getFirst', function ()
    {
        it('should return the first child matching property and value', function ()
        {
            var a = { active: false };
            var b = { active: true };
            var c = { active: true };
            list.add([ a, b, c ], true);
            expect(list.getFirst('active', true)).toBe(b);
        });

        it('should return null when no child matches', function ()
        {
            list.add({ active: false }, true);
            expect(list.getFirst('active', true)).toBeNull();
        });

        it('should respect startIndex', function ()
        {
            var a = { active: true };
            var b = { active: true };
            list.add([ a, b ], true);
            expect(list.getFirst('active', true, 1)).toBe(b);
        });
    });

    // -------------------------------------------------------------------------
    // getAll
    // -------------------------------------------------------------------------

    describe('getAll', function ()
    {
        it('should return all children when no criteria are given', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            var result = list.getAll();
            expect(result.length).toBe(2);
        });

        it('should return children matching property and value', function ()
        {
            var a = { visible: true };
            var b = { visible: false };
            var c = { visible: true };
            list.add([ a, b, c ], true);
            var result = list.getAll('visible', true);
            expect(result.length).toBe(2);
            expect(result).toContain(a);
            expect(result).toContain(c);
        });

        it('should return an empty array when no children match', function ()
        {
            list.add({ visible: false }, true);
            var result = list.getAll('visible', true);
            expect(result.length).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // count
    // -------------------------------------------------------------------------

    describe('count', function ()
    {
        it('should count children with a matching property value', function ()
        {
            list.add([ { active: true }, { active: false }, { active: true } ], true);
            expect(list.count('active', true)).toBe(2);
        });

        it('should return zero when no children match', function ()
        {
            list.add({ active: false }, true);
            expect(list.count('active', true)).toBe(0);
        });

        it('should return zero for an empty list', function ()
        {
            expect(list.count('active', true)).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // swap
    // -------------------------------------------------------------------------

    describe('swap', function ()
    {
        it('should swap the positions of two children', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            list.swap(a, b);
            expect(list.list[0]).toBe(b);
            expect(list.list[1]).toBe(a);
        });

        it('should leave the list unchanged when swapping an item with itself', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            list.swap(a, a);
            expect(list.list[0]).toBe(a);
            expect(list.list[1]).toBe(b);
        });
    });

    // -------------------------------------------------------------------------
    // moveTo
    // -------------------------------------------------------------------------

    describe('moveTo', function ()
    {
        it('should move an item to the specified index', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            list.moveTo(a, 2);
            expect(list.list[2]).toBe(a);
        });

        it('should return the moved child', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            var result = list.moveTo(a, 1);
            expect(result).toBe(a);
        });
    });

    // -------------------------------------------------------------------------
    // moveAbove
    // -------------------------------------------------------------------------

    describe('moveAbove', function ()
    {
        it('should move child1 directly above child2', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            // Move a above b means a should end up at index 1
            list.moveAbove(a, b);
            var idxA = list.getIndex(a);
            var idxB = list.getIndex(b);
            expect(idxA).toBe(idxB + 1);
        });

        it('should not move child1 if it is already above child2', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            list.moveAbove(c, a);
            expect(list.getIndex(c)).toBe(2);
        });
    });

    // -------------------------------------------------------------------------
    // moveBelow
    // -------------------------------------------------------------------------

    describe('moveBelow', function ()
    {
        it('should move child1 directly below child2', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            // Move c below b means c should end up at index 1
            list.moveBelow(c, b);
            var idxC = list.getIndex(c);
            var idxB = list.getIndex(b);
            expect(idxC).toBe(idxB - 1);
        });

        it('should not move child1 if it is already below child2', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            list.moveBelow(a, c);
            expect(list.getIndex(a)).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // remove
    // -------------------------------------------------------------------------

    describe('remove', function ()
    {
        it('should remove a single child', function ()
        {
            var a = { id: 1 };
            list.add(a, true);
            list.remove(a, true);
            expect(list.list.length).toBe(0);
        });

        it('should remove an array of children', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            list.remove([ a, b ], true);
            expect(list.list.length).toBe(0);
        });

        it('should invoke the removeCallback when skipCallback is false', function ()
        {
            var called = false;
            list.removeCallback = function () { called = true; };
            var item = { id: 1 };
            list.add(item, true);
            list.remove(item, false);
            expect(called).toBe(true);
        });

        it('should not invoke the removeCallback when skipCallback is true', function ()
        {
            var called = false;
            list.removeCallback = function () { called = true; };
            var item = { id: 1 };
            list.add(item, true);
            list.remove(item, true);
            expect(called).toBe(false);
        });

        it('should return the removed child', function ()
        {
            var a = { id: 1 };
            list.add(a, true);
            var result = list.remove(a, true);
            expect(result).toBe(a);
        });
    });

    // -------------------------------------------------------------------------
    // removeAt
    // -------------------------------------------------------------------------

    describe('removeAt', function ()
    {
        it('should remove the item at the given index', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            list.removeAt(0, true);
            expect(list.list.length).toBe(1);
            expect(list.list[0]).toBe(b);
        });

        it('should return the removed item', function ()
        {
            var a = { id: 1 };
            list.add(a, true);
            var result = list.removeAt(0, true);
            expect(result).toBe(a);
        });

        it('should invoke the removeCallback when skipCallback is false', function ()
        {
            var called = false;
            list.removeCallback = function () { called = true; };
            var item = { id: 1 };
            list.add(item, true);
            list.removeAt(0, false);
            expect(called).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // removeBetween
    // -------------------------------------------------------------------------

    describe('removeBetween', function ()
    {
        it('should remove items within the given range', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            var d = { id: 4 };
            list.add([ a, b, c, d ], true);
            var removed = list.removeBetween(1, 3, true);
            expect(removed.length).toBe(2);
            expect(list.list.length).toBe(2);
            expect(list.list[0]).toBe(a);
            expect(list.list[1]).toBe(d);
        });

        it('should return an array of removed items', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            var result = list.removeBetween(0, 1, true);
            expect(Array.isArray(result)).toBe(true);
            expect(result).toContain(a);
        });
    });

    // -------------------------------------------------------------------------
    // removeAll
    // -------------------------------------------------------------------------

    describe('removeAll', function ()
    {
        it('should remove all items from the list', function ()
        {
            list.add([ { id: 1 }, { id: 2 }, { id: 3 } ], true);
            list.removeAll(true);
            expect(list.list.length).toBe(0);
        });

        it('should return the List instance', function ()
        {
            var result = list.removeAll(true);
            expect(result).toBe(list);
        });

        it('should work on an already empty list', function ()
        {
            expect(function () { list.removeAll(true); }).not.toThrow();
            expect(list.list.length).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // bringToTop
    // -------------------------------------------------------------------------

    describe('bringToTop', function ()
    {
        it('should move the given child to the end of the list', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            list.bringToTop(a);
            expect(list.list[list.list.length - 1]).toBe(a);
        });

        it('should return the moved child', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            var result = list.bringToTop(a);
            expect(result).toBe(a);
        });
    });

    // -------------------------------------------------------------------------
    // sendToBack
    // -------------------------------------------------------------------------

    describe('sendToBack', function ()
    {
        it('should move the given child to the start of the list', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            list.sendToBack(c);
            expect(list.list[0]).toBe(c);
        });

        it('should return the moved child', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            var result = list.sendToBack(b);
            expect(result).toBe(b);
        });
    });

    // -------------------------------------------------------------------------
    // moveUp
    // -------------------------------------------------------------------------

    describe('moveUp', function ()
    {
        it('should move the child one position toward the end', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            list.moveUp(a);
            expect(list.list[1]).toBe(a);
        });

        it('should not move the child if it is already at the top', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            list.moveUp(b);
            expect(list.list[1]).toBe(b);
        });

        it('should return the child', function ()
        {
            var a = { id: 1 };
            list.add(a, true);
            var result = list.moveUp(a);
            expect(result).toBe(a);
        });
    });

    // -------------------------------------------------------------------------
    // moveDown
    // -------------------------------------------------------------------------

    describe('moveDown', function ()
    {
        it('should move the child one position toward the start', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            list.moveDown(c);
            expect(list.list[1]).toBe(c);
        });

        it('should not move the child if it is already at the bottom', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            list.moveDown(a);
            expect(list.list[0]).toBe(a);
        });

        it('should return the child', function ()
        {
            var a = { id: 1 };
            list.add(a, true);
            var result = list.moveDown(a);
            expect(result).toBe(a);
        });
    });

    // -------------------------------------------------------------------------
    // reverse
    // -------------------------------------------------------------------------

    describe('reverse', function ()
    {
        it('should reverse the order of items', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            list.reverse();
            expect(list.list[0]).toBe(c);
            expect(list.list[1]).toBe(b);
            expect(list.list[2]).toBe(a);
        });

        it('should return the List instance', function ()
        {
            var result = list.reverse();
            expect(result).toBe(list);
        });

        it('should handle an empty list without throwing', function ()
        {
            expect(function () { list.reverse(); }).not.toThrow();
        });
    });

    // -------------------------------------------------------------------------
    // shuffle
    // -------------------------------------------------------------------------

    describe('shuffle', function ()
    {
        it('should return the List instance', function ()
        {
            var result = list.shuffle();
            expect(result).toBe(list);
        });

        it('should keep the same number of items after shuffling', function ()
        {
            list.add([ { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 } ], true);
            list.shuffle();
            expect(list.list.length).toBe(4);
        });

        it('should still contain all original items after shuffling', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            list.shuffle();
            expect(list.list).toContain(a);
            expect(list.list).toContain(b);
            expect(list.list).toContain(c);
        });
    });

    // -------------------------------------------------------------------------
    // replace
    // -------------------------------------------------------------------------

    describe('replace', function ()
    {
        it('should replace oldChild with newChild', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b ], true);
            list.replace(a, c);
            expect(list.list).toContain(c);
            expect(list.list).not.toContain(a);
        });

        it('should preserve position of the replacement', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b ], true);
            list.replace(a, c);
            expect(list.list[0]).toBe(c);
        });

        it('should return the old child', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add(a, true);
            var result = list.replace(a, b);
            // replace returns true on success
            expect(result).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // exists
    // -------------------------------------------------------------------------

    describe('exists', function ()
    {
        it('should return true for a child in the list', function ()
        {
            var a = { id: 1 };
            list.add(a, true);
            expect(list.exists(a)).toBe(true);
        });

        it('should return false for a child not in the list', function ()
        {
            var a = { id: 1 };
            expect(list.exists(a)).toBe(false);
        });

        it('should return false after removing the child', function ()
        {
            var a = { id: 1 };
            list.add(a, true);
            list.remove(a, true);
            expect(list.exists(a)).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // setAll
    // -------------------------------------------------------------------------

    describe('setAll', function ()
    {
        it('should set a property on all children', function ()
        {
            var a = { visible: true };
            var b = { visible: true };
            list.add([ a, b ], true);
            list.setAll('visible', false);
            expect(a.visible).toBe(false);
            expect(b.visible).toBe(false);
        });

        it('should return the List instance', function ()
        {
            var result = list.setAll('x', 0);
            expect(result).toBe(list);
        });

        it('should respect startIndex and endIndex', function ()
        {
            var a = { x: 0 };
            var b = { x: 0 };
            var c = { x: 0 };
            list.add([ a, b, c ], true);
            list.setAll('x', 99, 1, 2);
            expect(a.x).toBe(0);
            expect(b.x).toBe(99);
            expect(c.x).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // each
    // -------------------------------------------------------------------------

    describe('each', function ()
    {
        it('should call the callback once per item', function ()
        {
            var count = 0;
            list.add([ { id: 1 }, { id: 2 }, { id: 3 } ], true);
            list.each(function (item) { count++; });
            expect(count).toBe(3);
        });

        it('should pass each child as the first argument', function ()
        {
            var visited = [];
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            list.each(function (item) { visited.push(item); });
            expect(visited[0]).toBe(a);
            expect(visited[1]).toBe(b);
        });

        it('should forward additional arguments to the callback', function ()
        {
            var results = [];
            list.add([ { id: 1 }, { id: 2 } ], true);
            list.each(function (item, extra) { results.push(extra); }, null, 'hello');
            expect(results[0]).toBe('hello');
            expect(results[1]).toBe('hello');
        });

        it('should apply the supplied context', function ()
        {
            var ctx = { value: 42 };
            var captured = [];
            list.add({ id: 1 }, true);
            list.each(function () { captured.push(this.value); }, ctx);
            expect(captured[0]).toBe(42);
        });
    });

    // -------------------------------------------------------------------------
    // shutdown
    // -------------------------------------------------------------------------

    describe('shutdown', function ()
    {
        it('should empty the list', function ()
        {
            list.add([ { id: 1 }, { id: 2 } ], true);
            list.shutdown();
            expect(list.list.length).toBe(0);
        });

        it('should replace the list array with a fresh array', function ()
        {
            var original = list.list;
            list.add({ id: 1 }, true);
            list.shutdown();
            expect(list.list).not.toBe(original);
        });
    });

    // -------------------------------------------------------------------------
    // destroy
    // -------------------------------------------------------------------------

    describe('destroy', function ()
    {
        it('should set parent to null', function ()
        {
            list.destroy();
            expect(list.parent).toBeNull();
        });

        it('should set addCallback to null', function ()
        {
            list.destroy();
            expect(list.addCallback).toBeNull();
        });

        it('should set removeCallback to null', function ()
        {
            list.destroy();
            expect(list.removeCallback).toBeNull();
        });

        it('should empty the list', function ()
        {
            list.add([ { id: 1 }, { id: 2 } ], true);
            list.destroy();
            expect(list.list.length).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // length (getter)
    // -------------------------------------------------------------------------

    describe('length', function ()
    {
        it('should return zero for an empty list', function ()
        {
            expect(list.length).toBe(0);
        });

        it('should return the correct count after adding items', function ()
        {
            list.add([ { id: 1 }, { id: 2 }, { id: 3 } ], true);
            expect(list.length).toBe(3);
        });

        it('should update after removing an item', function ()
        {
            var a = { id: 1 };
            list.add(a, true);
            list.remove(a, true);
            expect(list.length).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // first / last / next / previous (getters)
    // -------------------------------------------------------------------------

    describe('first', function ()
    {
        it('should return null for an empty list', function ()
        {
            expect(list.first).toBeNull();
        });

        it('should return the first item', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            expect(list.first).toBe(a);
        });

        it('should reset position to zero', function ()
        {
            list.add([ { id: 1 }, { id: 2 } ], true);
            list.position = 5;
            list.first;
            expect(list.position).toBe(0);
        });
    });

    describe('last', function ()
    {
        it('should return null for an empty list', function ()
        {
            expect(list.last).toBeNull();
        });

        it('should return the last item', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            expect(list.last).toBe(b);
        });

        it('should set position to the last index', function ()
        {
            list.add([ { id: 1 }, { id: 2 }, { id: 3 } ], true);
            list.last;
            expect(list.position).toBe(2);
        });
    });

    describe('next', function ()
    {
        it('should return null when the list is empty', function ()
        {
            expect(list.next).toBeNull();
        });

        it('should iterate items after reading first', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            list.first;
            expect(list.next).toBe(b);
            expect(list.next).toBe(c);
        });

        it('should return undefined after the last item', function ()
        {
            var a = { id: 1 };
            list.add(a, true);
            list.first;
            expect(list.next).toBeUndefined();
        });
    });

    describe('previous', function ()
    {
        it('should return null when position is zero', function ()
        {
            list.add([ { id: 1 }, { id: 2 } ], true);
            list.position = 0;
            expect(list.previous).toBeNull();
        });

        it('should iterate items backwards after reading last', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            var c = { id: 3 };
            list.add([ a, b, c ], true);
            list.last;
            expect(list.previous).toBe(b);
            expect(list.previous).toBe(a);
        });

        it('should return null after reaching the start', function ()
        {
            var a = { id: 1 };
            var b = { id: 2 };
            list.add([ a, b ], true);
            list.last;
            list.previous;
            expect(list.previous).toBeNull();
        });
    });
});
