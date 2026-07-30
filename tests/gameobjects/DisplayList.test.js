// Stub browser globals required by Phaser's device-detection modules at load time
if (typeof navigator === 'undefined')
{
    globalThis.navigator = { userAgent: '', appVersion: '', standalone: false, maxTouchPoints: 0 };
}

if (typeof window === 'undefined')
{
    globalThis.window = {};
}

if (!globalThis.window.devicePixelRatio)
{
    globalThis.window.devicePixelRatio = 1;
}

if (typeof document === 'undefined')
{
    globalThis.document = {
        pointerLockElement: null,
        mozPointerLockElement: null,
        webkitPointerLockElement: null,
        createElement: function (tag)
        {
            return {
                style: {},
                getContext: function () { return null; }
            };
        }
    };
}

if (typeof localStorage === 'undefined')
{
    globalThis.localStorage = { getItem: function () { return null; } };
}

var DisplayList = require('../../src/gameobjects/DisplayList');

function createMockScene ()
{
    var events = {
        handlers: {},
        once: function (event, fn, ctx) { return this; },
        on: function (event, fn, ctx) { return this; },
        off: function (event, fn, ctx) { return this; },
        emit: function (event) { return this; }
    };

    return {
        sys: {
            events: events
        }
    };
}

describe('DisplayList', function ()
{
    var scene;
    var displayList;

    beforeEach(function ()
    {
        scene = createMockScene();
        displayList = new DisplayList(scene);
    });

    describe('constructor', function ()
    {
        it('should set sortChildrenFlag to false by default', function ()
        {
            expect(displayList.sortChildrenFlag).toBe(false);
        });

        it('should set scene to the provided scene', function ()
        {
            expect(displayList.scene).toBe(scene);
        });

        it('should set systems to scene.sys', function ()
        {
            expect(displayList.systems).toBe(scene.sys);
        });

        it('should set events to scene.sys.events', function ()
        {
            expect(displayList.events).toBe(scene.sys.events);
        });

        it('should initialise with an empty list', function ()
        {
            expect(displayList.list).toEqual([]);
        });
    });

    describe('queueDepthSort', function ()
    {
        it('should set sortChildrenFlag to true', function ()
        {
            expect(displayList.sortChildrenFlag).toBe(false);
            displayList.queueDepthSort();
            expect(displayList.sortChildrenFlag).toBe(true);
        });

        it('should remain true when called multiple times', function ()
        {
            displayList.queueDepthSort();
            displayList.queueDepthSort();
            expect(displayList.sortChildrenFlag).toBe(true);
        });
    });

    describe('depthSort', function ()
    {
        it('should not sort when sortChildrenFlag is false', function ()
        {
            displayList.list = [
                { _depth: 3 },
                { _depth: 1 },
                { _depth: 2 }
            ];

            displayList.sortChildrenFlag = false;
            displayList.depthSort();

            expect(displayList.list[0]._depth).toBe(3);
            expect(displayList.list[1]._depth).toBe(1);
            expect(displayList.list[2]._depth).toBe(2);
        });

        it('should sort list by depth ascending when sortChildrenFlag is true', function ()
        {
            displayList.list = [
                { _depth: 3 },
                { _depth: 1 },
                { _depth: 2 }
            ];

            displayList.sortChildrenFlag = true;
            displayList.depthSort();

            expect(displayList.list[0]._depth).toBe(1);
            expect(displayList.list[1]._depth).toBe(2);
            expect(displayList.list[2]._depth).toBe(3);
        });

        it('should reset sortChildrenFlag to false after sorting', function ()
        {
            displayList.list = [{ _depth: 1 }];
            displayList.sortChildrenFlag = true;
            displayList.depthSort();

            expect(displayList.sortChildrenFlag).toBe(false);
        });

        it('should not reset sortChildrenFlag when it was already false', function ()
        {
            displayList.sortChildrenFlag = false;
            displayList.depthSort();

            expect(displayList.sortChildrenFlag).toBe(false);
        });

        it('should handle an empty list without error', function ()
        {
            displayList.list = [];
            displayList.sortChildrenFlag = true;

            expect(function () { displayList.depthSort(); }).not.toThrow();
            expect(displayList.sortChildrenFlag).toBe(false);
        });

        it('should handle a single-item list without error', function ()
        {
            displayList.list = [{ _depth: 5 }];
            displayList.sortChildrenFlag = true;
            displayList.depthSort();

            expect(displayList.list[0]._depth).toBe(5);
            expect(displayList.sortChildrenFlag).toBe(false);
        });

        it('should be stable — items with equal depth retain original order', function ()
        {
            var a = { name: 'a', _depth: 1 };
            var b = { name: 'b', _depth: 1 };
            var c = { name: 'c', _depth: 1 };

            displayList.list = [a, b, c];
            displayList.sortChildrenFlag = true;
            displayList.depthSort();

            expect(displayList.list[0].name).toBe('a');
            expect(displayList.list[1].name).toBe('b');
            expect(displayList.list[2].name).toBe('c');
        });
    });

    describe('sortByDepth', function ()
    {
        it('should return a negative number when childA depth is less than childB depth', function ()
        {
            var childA = { _depth: 1 };
            var childB = { _depth: 5 };

            expect(displayList.sortByDepth(childA, childB)).toBe(-4);
        });

        it('should return a positive number when childA depth is greater than childB depth', function ()
        {
            var childA = { _depth: 10 };
            var childB = { _depth: 3 };

            expect(displayList.sortByDepth(childA, childB)).toBe(7);
        });

        it('should return zero when both depths are equal', function ()
        {
            var childA = { _depth: 5 };
            var childB = { _depth: 5 };

            expect(displayList.sortByDepth(childA, childB)).toBe(0);
        });

        it('should work with negative depth values', function ()
        {
            var childA = { _depth: -10 };
            var childB = { _depth: -3 };

            expect(displayList.sortByDepth(childA, childB)).toBe(-7);
        });

        it('should work with zero depth values', function ()
        {
            var childA = { _depth: 0 };
            var childB = { _depth: 0 };

            expect(displayList.sortByDepth(childA, childB)).toBe(0);
        });

        it('should work when one depth is negative and the other positive', function ()
        {
            var childA = { _depth: -5 };
            var childB = { _depth: 5 };

            expect(displayList.sortByDepth(childA, childB)).toBe(-10);
        });
    });

    describe('getChildren', function ()
    {
        it('should return the internal list array', function ()
        {
            var result = displayList.getChildren();

            expect(result).toBe(displayList.list);
        });

        it('should return an empty array when list is empty', function ()
        {
            var result = displayList.getChildren();

            expect(result).toEqual([]);
        });

        it('should return the same reference as the internal list', function ()
        {
            var item = { _depth: 0 };
            displayList.list.push(item);

            var result = displayList.getChildren();

            expect(result.length).toBe(1);
            expect(result[0]).toBe(item);
        });

        it('should reflect live changes to the list', function ()
        {
            var children = displayList.getChildren();
            var item = { _depth: 0 };

            displayList.list.push(item);

            expect(children.length).toBe(1);
            expect(children[0]).toBe(item);
        });
    });
});
