// Mock the heavy Phaser dependencies that transitively require browser globals
// (window, document, navigator) via device detection modules.
vi.mock('../../../src/gameobjects/group/Group', function ()
{
    function Group () {}
    Group.prototype.on = function () {};
    Group.prototype.off = function () {};
    Group.prototype.once = function () {};
    Group.prototype.emit = function () {};
    Group.prototype.removeAllListeners = function () {};
    return Group;
});

vi.mock('../../../src/physics/arcade/ArcadeSprite', function ()
{
    function ArcadeSprite () {}
    return ArcadeSprite;
});

var StaticPhysicsGroup = require('../../../src/physics/arcade/StaticPhysicsGroup');
var CONST = require('../../../src/physics/arcade/const');

describe('StaticGroup', function ()
{
    it('should be importable', function ()
    {
        expect(StaticPhysicsGroup).toBeDefined();
    });

    it('should expose prototype methods', function ()
    {
        expect(typeof StaticPhysicsGroup.prototype.createCallbackHandler).toBe('function');
        expect(typeof StaticPhysicsGroup.prototype.removeCallbackHandler).toBe('function');
        expect(typeof StaticPhysicsGroup.prototype.createMultipleCallbackHandler).toBe('function');
        expect(typeof StaticPhysicsGroup.prototype.refresh).toBe('function');
    });

    describe('createCallbackHandler', function ()
    {
        it('should call world.enableBody with STATIC_BODY type when child has no body', function ()
        {
            var mockWorld = {
                enableBody: vi.fn(),
                disableBody: vi.fn()
            };
            var mockSelf = { world: mockWorld };
            var child = { body: null };

            StaticPhysicsGroup.prototype.createCallbackHandler.call(mockSelf, child);

            expect(mockWorld.enableBody).toHaveBeenCalledWith(child, CONST.STATIC_BODY);
        });

        it('should destroy an existing dynamic body before calling enableBody', function ()
        {
            var mockWorld = {
                enableBody: vi.fn(),
                disableBody: vi.fn()
            };
            var mockSelf = { world: mockWorld };
            var mockBody = {
                physicsType: CONST.DYNAMIC_BODY,
                destroy: vi.fn()
            };
            var child = { body: mockBody };

            StaticPhysicsGroup.prototype.createCallbackHandler.call(mockSelf, child);

            expect(mockBody.destroy).toHaveBeenCalled();
            expect(child.body).toBeNull();
            expect(mockWorld.enableBody).toHaveBeenCalledWith(child, CONST.STATIC_BODY);
        });

        it('should null the body reference after destroying the dynamic body', function ()
        {
            var mockWorld = { enableBody: vi.fn() };
            var mockSelf = { world: mockWorld };
            var child = {
                body: {
                    physicsType: CONST.DYNAMIC_BODY,
                    destroy: vi.fn()
                }
            };

            StaticPhysicsGroup.prototype.createCallbackHandler.call(mockSelf, child);

            expect(child.body).toBeNull();
        });

        it('should not destroy or re-enable a child that already has a static body', function ()
        {
            var mockWorld = {
                enableBody: vi.fn(),
                disableBody: vi.fn()
            };
            var mockSelf = { world: mockWorld };
            var mockBody = {
                physicsType: CONST.STATIC_BODY,
                destroy: vi.fn()
            };
            var child = { body: mockBody };

            StaticPhysicsGroup.prototype.createCallbackHandler.call(mockSelf, child);

            expect(mockBody.destroy).not.toHaveBeenCalled();
            expect(mockWorld.enableBody).not.toHaveBeenCalled();
        });

        it('should pass CONST.STATIC_BODY (value 1) to world.enableBody', function ()
        {
            var capturedType;
            var mockWorld = {
                enableBody: function (child, type) { capturedType = type; }
            };
            var mockSelf = { world: mockWorld };
            var child = { body: null };

            StaticPhysicsGroup.prototype.createCallbackHandler.call(mockSelf, child);

            expect(capturedType).toBe(1);
        });
    });

    describe('removeCallbackHandler', function ()
    {
        it('should call world.disableBody when child has a body', function ()
        {
            var mockWorld = {
                enableBody: vi.fn(),
                disableBody: vi.fn()
            };
            var mockSelf = { world: mockWorld };
            var child = { body: { physicsType: CONST.STATIC_BODY } };

            StaticPhysicsGroup.prototype.removeCallbackHandler.call(mockSelf, child);

            expect(mockWorld.disableBody).toHaveBeenCalledWith(child);
        });

        it('should not call world.disableBody when child has no body', function ()
        {
            var mockWorld = {
                enableBody: vi.fn(),
                disableBody: vi.fn()
            };
            var mockSelf = { world: mockWorld };
            var child = { body: null };

            StaticPhysicsGroup.prototype.removeCallbackHandler.call(mockSelf, child);

            expect(mockWorld.disableBody).not.toHaveBeenCalled();
        });

        it('should not call world.disableBody when child body is undefined', function ()
        {
            var mockWorld = {
                enableBody: vi.fn(),
                disableBody: vi.fn()
            };
            var mockSelf = { world: mockWorld };
            var child = {};

            StaticPhysicsGroup.prototype.removeCallbackHandler.call(mockSelf, child);

            expect(mockWorld.disableBody).not.toHaveBeenCalled();
        });

        it('should pass the child itself to world.disableBody', function ()
        {
            var capturedChild;
            var mockWorld = {
                disableBody: function (c) { capturedChild = c; }
            };
            var mockSelf = { world: mockWorld };
            var child = { body: { physicsType: CONST.STATIC_BODY } };

            StaticPhysicsGroup.prototype.removeCallbackHandler.call(mockSelf, child);

            expect(capturedChild).toBe(child);
        });
    });

    describe('createMultipleCallbackHandler', function ()
    {
        it('should call refresh', function ()
        {
            var refreshCalled = false;
            var mockSelf = {
                refresh: function () { refreshCalled = true; }
            };

            StaticPhysicsGroup.prototype.createMultipleCallbackHandler.call(mockSelf);

            expect(refreshCalled).toBe(true);
        });

        it('should call refresh exactly once', function ()
        {
            var callCount = 0;
            var mockSelf = {
                refresh: function () { callCount++; }
            };

            StaticPhysicsGroup.prototype.createMultipleCallbackHandler.call(mockSelf);

            expect(callCount).toBe(1);
        });

        it('should call refresh regardless of entries argument', function ()
        {
            var refreshCalled = false;
            var mockSelf = {
                refresh: function () { refreshCalled = true; }
            };

            StaticPhysicsGroup.prototype.createMultipleCallbackHandler.call(mockSelf, [{}, {}, {}]);

            expect(refreshCalled).toBe(true);
        });
    });

    describe('refresh', function ()
    {
        it('should return this', function ()
        {
            var mockSelf = { children: new Set([]) };

            var result = StaticPhysicsGroup.prototype.refresh.call(mockSelf);

            expect(result).toBe(mockSelf);
        });

        it('should call body.reset on each child', function ()
        {
            var reset1 = vi.fn();
            var reset2 = vi.fn();
            var reset3 = vi.fn();
            var mockSelf = {
                children: new Set([
                    { body: { reset: reset1 } },
                    { body: { reset: reset2 } },
                    { body: { reset: reset3 } }
                ])
            };

            StaticPhysicsGroup.prototype.refresh.call(mockSelf);

            expect(reset1).toHaveBeenCalled();
            expect(reset2).toHaveBeenCalled();
            expect(reset3).toHaveBeenCalled();
        });

        it('should call reset on a single child exactly once', function ()
        {
            var resetSpy = vi.fn();
            var mockSelf = {
                children: new Set([{ body: { reset: resetSpy } }])
            };

            StaticPhysicsGroup.prototype.refresh.call(mockSelf);

            expect(resetSpy).toHaveBeenCalledTimes(1);
        });

        it('should not throw when children set is empty', function ()
        {
            var mockSelf = { children: new Set([]) };

            expect(function ()
            {
                StaticPhysicsGroup.prototype.refresh.call(mockSelf);
            }).not.toThrow();
        });

        it('should call reset on every child exactly once', function ()
        {
            var callCounts = [0, 0, 0];
            var mockSelf = {
                children: new Set([
                    { body: { reset: function () { callCounts[0]++; } } },
                    { body: { reset: function () { callCounts[1]++; } } },
                    { body: { reset: function () { callCounts[2]++; } } }
                ])
            };

            StaticPhysicsGroup.prototype.refresh.call(mockSelf);

            expect(callCounts[0]).toBe(1);
            expect(callCounts[1]).toBe(1);
            expect(callCounts[2]).toBe(1);
        });

        it('should return the same object reference as the context', function ()
        {
            var mockSelf = { children: new Set([]) };

            var result = StaticPhysicsGroup.prototype.refresh.call(mockSelf);

            expect(result === mockSelf).toBe(true);
        });
    });
});
