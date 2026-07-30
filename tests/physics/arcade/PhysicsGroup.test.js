vi.mock('../../../src/device/OS', function ()
{
    return {
        desktop: false,
        cordova: false,
        crosswalk: false,
        electron: false,
        ejecta: false,
        iOS: false,
        iOSVersion: 0,
        iPad: false,
        iPhone: false,
        kindle: false,
        linux: false,
        macOS: false,
        node: false,
        nodeWebkit: false,
        pixelRatio: 1,
        webApp: false,
        windows: false,
        windowsPhone: false
    };
});

vi.mock('../../../src/gameobjects/group/Group', function ()
{
    function MockGroup (scene, children, config) {}
    MockGroup.prototype.getChildren = function () { return []; };
    return MockGroup;
});

vi.mock('../../../src/physics/arcade/ArcadeSprite', function ()
{
    function MockArcadeSprite () {}
    return MockArcadeSprite;
});

var CONST = require('../../../src/physics/arcade/const');
var PhysicsGroup = require('../../../src/physics/arcade/PhysicsGroup');

describe('PhysicsGroup', function ()
{
    var proto = PhysicsGroup.prototype;

    function makeMockWorld ()
    {
        return {
            enableBody: vi.fn(),
            disableBody: vi.fn()
        };
    }

    function makeMockBody (physicsType)
    {
        if (physicsType === undefined) { physicsType = CONST.DYNAMIC_BODY; }

        return {
            physicsType: physicsType,
            velocity: { x: 0, y: 0, set: vi.fn(function (x, y) { this.x = x; this.y = y; }) },
            destroy: vi.fn(),
            setCollideWorldBounds: vi.fn(),
            setBoundsRectangle: vi.fn(),
            setAccelerationX: vi.fn(),
            setAccelerationY: vi.fn(),
            setAllowDrag: vi.fn(),
            setAllowGravity: vi.fn(),
            setAllowRotation: vi.fn(),
            setDamping: vi.fn(),
            setBounceX: vi.fn(),
            setBounceY: vi.fn(),
            setDragX: vi.fn(),
            setDragY: vi.fn(),
            setEnable: vi.fn(),
            setGravityX: vi.fn(),
            setGravityY: vi.fn(),
            setFrictionX: vi.fn(),
            setFrictionY: vi.fn(),
            setMaxSpeed: vi.fn(),
            setMaxVelocityX: vi.fn(),
            setMaxVelocityY: vi.fn(),
            setVelocityX: vi.fn(),
            setVelocityY: vi.fn(),
            setAngularVelocity: vi.fn(),
            setAngularAcceleration: vi.fn(),
            setAngularDrag: vi.fn(),
            setMass: vi.fn(),
            setImmovable: vi.fn()
        };
    }

    function makeDefaultsContext ()
    {
        return {
            world: makeMockWorld(),
            defaults: {
                setCollideWorldBounds: false,
                setBoundsRectangle: null,
                setAccelerationX: 0,
                setAccelerationY: 0,
                setAllowDrag: true,
                setAllowGravity: true,
                setAllowRotation: true,
                setDamping: false,
                setBounceX: 0,
                setBounceY: 0,
                setDragX: 0,
                setDragY: 0,
                setEnable: true,
                setGravityX: 0,
                setGravityY: 0,
                setFrictionX: 0,
                setFrictionY: 0,
                setMaxSpeed: -1,
                setMaxVelocityX: 10000,
                setMaxVelocityY: 10000,
                setVelocityX: 0,
                setVelocityY: 0,
                setAngularVelocity: 0,
                setAngularAcceleration: 0,
                setAngularDrag: 0,
                setMass: 1,
                setImmovable: false
            }
        };
    }

    describe('createCallbackHandler', function ()
    {
        it('should call world.enableBody when child has no body', function ()
        {
            var ctx = makeDefaultsContext();
            var child = { body: null };

            ctx.world.enableBody = vi.fn(function (c) { c.body = makeMockBody(); });

            proto.createCallbackHandler.call(ctx, child);

            expect(ctx.world.enableBody).toHaveBeenCalledWith(child, CONST.DYNAMIC_BODY);
        });

        it('should apply all defaults to the body after enabling', function ()
        {
            var ctx = makeDefaultsContext();
            var body = makeMockBody();
            var child = { body: null };

            ctx.world.enableBody = vi.fn(function (c) { c.body = body; });

            proto.createCallbackHandler.call(ctx, child);

            expect(body.setCollideWorldBounds).toHaveBeenCalledWith(false);
            expect(body.setAllowDrag).toHaveBeenCalledWith(true);
            expect(body.setAllowGravity).toHaveBeenCalledWith(true);
            expect(body.setMass).toHaveBeenCalledWith(1);
            expect(body.setImmovable).toHaveBeenCalledWith(false);
            expect(body.setMaxVelocityX).toHaveBeenCalledWith(10000);
            expect(body.setMaxVelocityY).toHaveBeenCalledWith(10000);
        });

        it('should not recreate body when child already has a dynamic body', function ()
        {
            var ctx = makeDefaultsContext();
            var existingBody = makeMockBody(CONST.DYNAMIC_BODY);
            var child = { body: existingBody };

            proto.createCallbackHandler.call(ctx, child);

            expect(ctx.world.enableBody).not.toHaveBeenCalled();
            expect(existingBody.destroy).not.toHaveBeenCalled();
        });

        it('should apply defaults to an existing dynamic body', function ()
        {
            var ctx = makeDefaultsContext();
            var existingBody = makeMockBody(CONST.DYNAMIC_BODY);
            var child = { body: existingBody };

            proto.createCallbackHandler.call(ctx, child);

            expect(existingBody.setEnable).toHaveBeenCalledWith(true);
            expect(existingBody.setGravityX).toHaveBeenCalledWith(0);
            expect(existingBody.setGravityY).toHaveBeenCalledWith(0);
        });

        it('should destroy and recreate body when child has a non-dynamic body', function ()
        {
            var ctx = makeDefaultsContext();
            var staticBody = makeMockBody(CONST.STATIC_BODY);
            var newBody = makeMockBody(CONST.DYNAMIC_BODY);
            var child = { body: staticBody };

            ctx.world.enableBody = vi.fn(function (c) { c.body = newBody; });

            proto.createCallbackHandler.call(ctx, child);

            expect(staticBody.destroy).toHaveBeenCalled();
            expect(ctx.world.enableBody).toHaveBeenCalledWith(child, CONST.DYNAMIC_BODY);
        });

        it('should set child.body to null before calling enableBody when replacing a non-dynamic body', function ()
        {
            var ctx = makeDefaultsContext();
            var staticBody = makeMockBody(CONST.STATIC_BODY);
            var capturedBodyAtEnableTime;
            var child = { body: staticBody };

            ctx.world.enableBody = vi.fn(function (c)
            {
                capturedBodyAtEnableTime = c.body;
                c.body = makeMockBody(CONST.DYNAMIC_BODY);
            });

            proto.createCallbackHandler.call(ctx, child);

            expect(capturedBodyAtEnableTime).toBeNull();
        });
    });

    describe('removeCallbackHandler', function ()
    {
        it('should call world.disableBody when child has a body', function ()
        {
            var ctx = makeDefaultsContext();
            var body = makeMockBody();
            var child = { body: body };

            proto.removeCallbackHandler.call(ctx, child);

            expect(ctx.world.disableBody).toHaveBeenCalledWith(child);
        });

        it('should not call world.disableBody when child has no body', function ()
        {
            var ctx = makeDefaultsContext();
            var child = { body: null };

            proto.removeCallbackHandler.call(ctx, child);

            expect(ctx.world.disableBody).not.toHaveBeenCalled();
        });

        it('should not call world.disableBody when child.body is undefined', function ()
        {
            var ctx = makeDefaultsContext();
            var child = {};

            proto.removeCallbackHandler.call(ctx, child);

            expect(ctx.world.disableBody).not.toHaveBeenCalled();
        });
    });

    describe('setVelocity', function ()
    {
        it('should set velocity on all children', function ()
        {
            var setMock0 = vi.fn();
            var setMock1 = vi.fn();
            var setMock2 = vi.fn();
            var children = [
                { body: { velocity: { set: setMock0 } } },
                { body: { velocity: { set: setMock1 } } },
                { body: { velocity: { set: setMock2 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocity.call(ctx, 100, 200);

            expect(setMock0).toHaveBeenCalledWith(100, 200);
            expect(setMock1).toHaveBeenCalledWith(100, 200);
            expect(setMock2).toHaveBeenCalledWith(100, 200);
        });

        it('should apply step increment to each child', function ()
        {
            var calls = [];
            var makeChild = function ()
            {
                return { body: { velocity: { set: function (x, y) { calls.push([ x, y ]); } } } };
            };

            var children = [ makeChild(), makeChild(), makeChild() ];
            var ctx = { getChildren: function () { return children; } };

            proto.setVelocity.call(ctx, 100, 50, 10);

            expect(calls[0]).toEqual([ 100, 50 ]);
            expect(calls[1]).toEqual([ 110, 60 ]);
            expect(calls[2]).toEqual([ 120, 70 ]);
        });

        it('should default step to zero when not provided', function ()
        {
            var calls = [];
            var makeChild = function ()
            {
                return { body: { velocity: { set: function (x, y) { calls.push([ x, y ]); } } } };
            };

            var children = [ makeChild(), makeChild() ];
            var ctx = { getChildren: function () { return children; } };

            proto.setVelocity.call(ctx, 300, 400);

            expect(calls[0]).toEqual([ 300, 400 ]);
            expect(calls[1]).toEqual([ 300, 400 ]);
        });

        it('should return this', function ()
        {
            var ctx = { getChildren: function () { return []; } };

            var result = proto.setVelocity.call(ctx, 0, 0);

            expect(result).toBe(ctx);
        });

        it('should work with negative velocities', function ()
        {
            var calls = [];
            var children = [
                { body: { velocity: { set: function (x, y) { calls.push([ x, y ]); } } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocity.call(ctx, -100, -200);

            expect(calls[0]).toEqual([ -100, -200 ]);
        });

        it('should work with zero velocity', function ()
        {
            var calls = [];
            var children = [
                { body: { velocity: { set: function (x, y) { calls.push([ x, y ]); } } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocity.call(ctx, 0, 0);

            expect(calls[0]).toEqual([ 0, 0 ]);
        });

        it('should handle empty children array', function ()
        {
            var ctx = { getChildren: function () { return []; } };

            var result = proto.setVelocity.call(ctx, 100, 200);

            expect(result).toBe(ctx);
        });

        it('should work with floating point velocities', function ()
        {
            var calls = [];
            var children = [
                { body: { velocity: { set: function (x, y) { calls.push([ x, y ]); } } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocity.call(ctx, 1.5, 2.7);

            expect(calls[0][0]).toBeCloseTo(1.5);
            expect(calls[0][1]).toBeCloseTo(2.7);
        });
    });

    describe('setVelocityX', function ()
    {
        it('should set x velocity on all children', function ()
        {
            var children = [
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityX.call(ctx, 150);

            expect(children[0].body.velocity.x).toBe(150);
            expect(children[1].body.velocity.x).toBe(150);
            expect(children[2].body.velocity.x).toBe(150);
        });

        it('should not alter y velocity', function ()
        {
            var children = [
                { body: { velocity: { x: 0, y: 99 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityX.call(ctx, 50);

            expect(children[0].body.velocity.y).toBe(99);
        });

        it('should apply step increment to x velocity for each child', function ()
        {
            var children = [
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityX.call(ctx, 100, 25);

            expect(children[0].body.velocity.x).toBe(100);
            expect(children[1].body.velocity.x).toBe(125);
            expect(children[2].body.velocity.x).toBe(150);
        });

        it('should default step to zero when not provided', function ()
        {
            var children = [
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityX.call(ctx, 200);

            expect(children[0].body.velocity.x).toBe(200);
            expect(children[1].body.velocity.x).toBe(200);
        });

        it('should return this', function ()
        {
            var ctx = { getChildren: function () { return []; } };

            var result = proto.setVelocityX.call(ctx, 0);

            expect(result).toBe(ctx);
        });

        it('should work with negative x velocity', function ()
        {
            var children = [
                { body: { velocity: { x: 0, y: 0 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityX.call(ctx, -75);

            expect(children[0].body.velocity.x).toBe(-75);
        });

        it('should work with negative step values', function ()
        {
            var children = [
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityX.call(ctx, 100, -20);

            expect(children[0].body.velocity.x).toBe(100);
            expect(children[1].body.velocity.x).toBe(80);
            expect(children[2].body.velocity.x).toBe(60);
        });

        it('should handle empty children array', function ()
        {
            var ctx = { getChildren: function () { return []; } };

            var result = proto.setVelocityX.call(ctx, 100);

            expect(result).toBe(ctx);
        });

        it('should work with floating point values and step', function ()
        {
            var children = [
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityX.call(ctx, 1.5, 0.5);

            expect(children[0].body.velocity.x).toBeCloseTo(1.5);
            expect(children[1].body.velocity.x).toBeCloseTo(2.0);
        });
    });

    describe('setVelocityY', function ()
    {
        it('should set y velocity on all children', function ()
        {
            var children = [
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityY.call(ctx, 250);

            expect(children[0].body.velocity.y).toBe(250);
            expect(children[1].body.velocity.y).toBe(250);
            expect(children[2].body.velocity.y).toBe(250);
        });

        it('should not alter x velocity', function ()
        {
            var children = [
                { body: { velocity: { x: 42, y: 0 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityY.call(ctx, 75);

            expect(children[0].body.velocity.x).toBe(42);
        });

        it('should apply step increment to y velocity for each child', function ()
        {
            var children = [
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityY.call(ctx, 50, 15);

            expect(children[0].body.velocity.y).toBe(50);
            expect(children[1].body.velocity.y).toBe(65);
            expect(children[2].body.velocity.y).toBe(80);
        });

        it('should default step to zero when not provided', function ()
        {
            var children = [
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityY.call(ctx, 300);

            expect(children[0].body.velocity.y).toBe(300);
            expect(children[1].body.velocity.y).toBe(300);
        });

        it('should return this', function ()
        {
            var ctx = { getChildren: function () { return []; } };

            var result = proto.setVelocityY.call(ctx, 0);

            expect(result).toBe(ctx);
        });

        it('should work with negative y velocity', function ()
        {
            var children = [
                { body: { velocity: { x: 0, y: 0 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityY.call(ctx, -300);

            expect(children[0].body.velocity.y).toBe(-300);
        });

        it('should work with negative step values', function ()
        {
            var children = [
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityY.call(ctx, 200, -30);

            expect(children[0].body.velocity.y).toBe(200);
            expect(children[1].body.velocity.y).toBe(170);
            expect(children[2].body.velocity.y).toBe(140);
        });

        it('should handle empty children array', function ()
        {
            var ctx = { getChildren: function () { return []; } };

            var result = proto.setVelocityY.call(ctx, 100);

            expect(result).toBe(ctx);
        });

        it('should work with floating point values and step', function ()
        {
            var children = [
                { body: { velocity: { x: 0, y: 0 } } },
                { body: { velocity: { x: 0, y: 0 } } }
            ];

            var ctx = { getChildren: function () { return children; } };

            proto.setVelocityY.call(ctx, 1.5, 0.5);

            expect(children[0].body.velocity.y).toBeCloseTo(1.5);
            expect(children[1].body.velocity.y).toBeCloseTo(2.0);
        });
    });
});
