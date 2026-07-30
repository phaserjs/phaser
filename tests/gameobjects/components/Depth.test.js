var Depth = require('../../../src/gameobjects/components/Depth');
var ArrayUtils = require('../../../src/utils/array');

describe('Depth', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = Object.assign({}, Depth);
        gameObject._depth = 0;
        gameObject.displayList = null;
        gameObject.getDisplayList = function () { return null; };

        // Object.assign copies `depth` as a plain object {get, set}, not as a real accessor.
        // Re-define it so that setDepth (which does `this.depth = value`) invokes the setter.
        Object.defineProperty(gameObject, 'depth', {
            get: Depth.depth.get,
            set: Depth.depth.set,
            configurable: true
        });

        // Spy on the real ArrayUtils methods. Because CJS caches modules, Depth.js holds
        // a reference to the same object, so spies installed here are visible there too.
        vi.spyOn(ArrayUtils, 'BringToTop');
        vi.spyOn(ArrayUtils, 'SendToBack');
        vi.spyOn(ArrayUtils, 'MoveAbove');
        vi.spyOn(ArrayUtils, 'MoveBelow');
    });

    afterEach(function ()
    {
        vi.restoreAllMocks();
    });

    describe('default state', function ()
    {
        it('should have a default _depth of 0', function ()
        {
            expect(Depth._depth).toBe(0);
        });
    });

    describe('depth getter', function ()
    {
        it('should return 0 by default', function ()
        {
            expect(Depth.depth.get.call(gameObject)).toBe(0);
        });

        it('should return the current _depth value', function ()
        {
            gameObject._depth = 42;
            expect(Depth.depth.get.call(gameObject)).toBe(42);
        });

        it('should return negative depth values', function ()
        {
            gameObject._depth = -10;
            expect(Depth.depth.get.call(gameObject)).toBe(-10);
        });

        it('should return floating point depth values', function ()
        {
            gameObject._depth = 3.14;
            expect(Depth.depth.get.call(gameObject)).toBeCloseTo(3.14);
        });
    });

    describe('depth setter', function ()
    {
        it('should set _depth to the given value', function ()
        {
            Depth.depth.set.call(gameObject, 5);
            expect(gameObject._depth).toBe(5);
        });

        it('should set _depth to zero', function ()
        {
            gameObject._depth = 99;
            Depth.depth.set.call(gameObject, 0);
            expect(gameObject._depth).toBe(0);
        });

        it('should set _depth to a negative value', function ()
        {
            Depth.depth.set.call(gameObject, -50);
            expect(gameObject._depth).toBe(-50);
        });

        it('should set _depth to a floating point value', function ()
        {
            Depth.depth.set.call(gameObject, 1.5);
            expect(gameObject._depth).toBeCloseTo(1.5);
        });

        it('should call queueDepthSort on the displayList when present', function ()
        {
            var sortCalled = false;
            gameObject.displayList = {
                queueDepthSort: function () { sortCalled = true; }
            };
            Depth.depth.set.call(gameObject, 10);
            expect(sortCalled).toBe(true);
        });

        it('should not throw when displayList is null', function ()
        {
            gameObject.displayList = null;
            expect(function () { Depth.depth.set.call(gameObject, 10); }).not.toThrow();
        });

        it('should still set _depth when displayList is null', function ()
        {
            gameObject.displayList = null;
            Depth.depth.set.call(gameObject, 10);
            expect(gameObject._depth).toBe(10);
        });
    });

    describe('setDepth', function ()
    {
        it('should set depth to the given value', function ()
        {
            gameObject.setDepth(7);
            expect(gameObject._depth).toBe(7);
        });

        it('should default to 0 when no value is provided', function ()
        {
            gameObject._depth = 99;
            gameObject.setDepth();
            expect(gameObject._depth).toBe(0);
        });

        it('should set depth to zero explicitly', function ()
        {
            gameObject._depth = 5;
            gameObject.setDepth(0);
            expect(gameObject._depth).toBe(0);
        });

        it('should set depth to a negative value', function ()
        {
            gameObject.setDepth(-100);
            expect(gameObject._depth).toBe(-100);
        });

        it('should set depth to a large value', function ()
        {
            gameObject.setDepth(999999);
            expect(gameObject._depth).toBe(999999);
        });

        it('should call queueDepthSort on displayList when present', function ()
        {
            var sortCalled = false;
            gameObject.displayList = {
                queueDepthSort: function () { sortCalled = true; }
            };
            gameObject.setDepth(5);
            expect(sortCalled).toBe(true);
        });

        it('should return this for chaining', function ()
        {
            var result = gameObject.setDepth(1);
            expect(result).toBe(gameObject);
        });
    });

    describe('setToTop', function ()
    {
        it('should return this when getDisplayList returns null', function ()
        {
            gameObject.getDisplayList = function () { return null; };
            var result = gameObject.setToTop();
            expect(result).toBe(gameObject);
        });

        it('should not call BringToTop when list is null', function ()
        {
            gameObject.getDisplayList = function () { return null; };
            gameObject.setToTop();
            expect(ArrayUtils.BringToTop).not.toHaveBeenCalled();
        });

        it('should call BringToTop with the list and this object', function ()
        {
            var list = [gameObject, {}, {}];
            gameObject.getDisplayList = function () { return list; };
            gameObject.setToTop();
            expect(ArrayUtils.BringToTop).toHaveBeenCalledWith(list, gameObject);
        });

        it('should move the object to the top of the list', function ()
        {
            var other1 = {};
            var other2 = {};
            var list = [other1, other2, gameObject];
            gameObject.getDisplayList = function () { return list; };
            gameObject.setToTop();
            expect(list[list.length - 1]).toBe(gameObject);
        });

        it('should return this for chaining', function ()
        {
            var list = [gameObject];
            gameObject.getDisplayList = function () { return list; };
            var result = gameObject.setToTop();
            expect(result).toBe(gameObject);
        });
    });

    describe('setToBack', function ()
    {
        it('should return this when getDisplayList returns null', function ()
        {
            gameObject.getDisplayList = function () { return null; };
            var result = gameObject.setToBack();
            expect(result).toBe(gameObject);
        });

        it('should not call SendToBack when list is null', function ()
        {
            gameObject.getDisplayList = function () { return null; };
            gameObject.setToBack();
            expect(ArrayUtils.SendToBack).not.toHaveBeenCalled();
        });

        it('should call SendToBack with the list and this object', function ()
        {
            var list = [{}, {}, gameObject];
            gameObject.getDisplayList = function () { return list; };
            gameObject.setToBack();
            expect(ArrayUtils.SendToBack).toHaveBeenCalledWith(list, gameObject);
        });

        it('should move the object to index 0 in the list', function ()
        {
            var other1 = {};
            var other2 = {};
            var list = [other1, other2, gameObject];
            gameObject.getDisplayList = function () { return list; };
            gameObject.setToBack();
            expect(list[0]).toBe(gameObject);
        });

        it('should return this for chaining', function ()
        {
            var list = [gameObject];
            gameObject.getDisplayList = function () { return list; };
            var result = gameObject.setToBack();
            expect(result).toBe(gameObject);
        });
    });

    describe('setAbove', function ()
    {
        it('should return this when getDisplayList returns null', function ()
        {
            gameObject.getDisplayList = function () { return null; };
            var result = gameObject.setAbove({});
            expect(result).toBe(gameObject);
        });

        it('should not call MoveAbove when list is null', function ()
        {
            gameObject.getDisplayList = function () { return null; };
            gameObject.setAbove({});
            expect(ArrayUtils.MoveAbove).not.toHaveBeenCalled();
        });

        it('should not call MoveAbove when target gameObject is null', function ()
        {
            var list = [gameObject, {}];
            gameObject.getDisplayList = function () { return list; };
            gameObject.setAbove(null);
            expect(ArrayUtils.MoveAbove).not.toHaveBeenCalled();
        });

        it('should call MoveAbove with the list, this, and the target', function ()
        {
            var other = {};
            var list = [other, gameObject];
            gameObject.getDisplayList = function () { return list; };
            gameObject.setAbove(other);
            expect(ArrayUtils.MoveAbove).toHaveBeenCalledWith(list, gameObject, other);
        });

        it('should position this object immediately after the target in the list', function ()
        {
            var other = {};
            var third = {};
            var list = [gameObject, other, third];
            gameObject.getDisplayList = function () { return list; };
            gameObject.setAbove(third);
            var idxThis = list.indexOf(gameObject);
            var idxThird = list.indexOf(third);
            expect(idxThis).toBe(idxThird + 1);
        });

        it('should return this for chaining', function ()
        {
            var other = {};
            var list = [other, gameObject];
            gameObject.getDisplayList = function () { return list; };
            var result = gameObject.setAbove(other);
            expect(result).toBe(gameObject);
        });
    });

    describe('setBelow', function ()
    {
        it('should return this when getDisplayList returns null', function ()
        {
            gameObject.getDisplayList = function () { return null; };
            var result = gameObject.setBelow({});
            expect(result).toBe(gameObject);
        });

        it('should not call MoveBelow when list is null', function ()
        {
            gameObject.getDisplayList = function () { return null; };
            gameObject.setBelow({});
            expect(ArrayUtils.MoveBelow).not.toHaveBeenCalled();
        });

        it('should not call MoveBelow when target gameObject is null', function ()
        {
            var list = [gameObject, {}];
            gameObject.getDisplayList = function () { return list; };
            gameObject.setBelow(null);
            expect(ArrayUtils.MoveBelow).not.toHaveBeenCalled();
        });

        it('should call MoveBelow with the list, this, and the target', function ()
        {
            var other = {};
            var list = [other, gameObject];
            gameObject.getDisplayList = function () { return list; };
            gameObject.setBelow(other);
            expect(ArrayUtils.MoveBelow).toHaveBeenCalledWith(list, gameObject, other);
        });

        it('should position this object immediately before the target in the list', function ()
        {
            var other = {};
            var third = {};
            var list = [gameObject, other, third];
            gameObject.getDisplayList = function () { return list; };
            gameObject.setBelow(other);
            var idxThis = list.indexOf(gameObject);
            var idxOther = list.indexOf(other);
            expect(idxThis).toBe(idxOther - 1);
        });

        it('should return this for chaining', function ()
        {
            var other = {};
            var list = [other, gameObject];
            gameObject.getDisplayList = function () { return list; };
            var result = gameObject.setBelow(other);
            expect(result).toBe(gameObject);
        });
    });
});
