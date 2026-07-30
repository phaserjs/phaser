var Body = require('../../../src/physics/arcade/Body');

function createMockWorld ()
{
    return {
        defaults: {
            debugShowBody: true,
            debugShowVelocity: true,
            bodyDebugColor: 0xff0000,
            velocityDebugColor: 0x00ff00
        },
        bounds: { x: 0, y: 0, width: 800, height: 600, right: 800, bottom: 600 },
        checkCollision: { left: true, right: true, up: true, down: true },
        pendingDestroy: { add: function () {} }
    };
}

function createMockGameObject (overrides)
{
    var obj = {
        x: 0,
        y: 0,
        angle: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        displayOriginX: 0,
        displayOriginY: 0,
        displayWidth: 64,
        displayHeight: 64
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            obj[key] = overrides[key];
        }
    }

    return obj;
}

describe('Body', function ()
{
    var world;

    beforeEach(function ()
    {
        world = createMockWorld();
    });

    describe('constructor (no game object)', function ()
    {
        it('should create a Body with default values when no game object is given', function ()
        {
            var body = new Body(world);

            expect(body.isBody).toBe(true);
            expect(body.enable).toBe(true);
            expect(body.isCircle).toBe(false);
            expect(body.radius).toBe(0);
            expect(body.width).toBe(64);
            expect(body.height).toBe(64);
            expect(body.halfWidth).toBe(32);
            expect(body.halfHeight).toBe(32);
            expect(body.mass).toBe(1);
            expect(body.immovable).toBe(false);
            expect(body.moves).toBe(true);
            expect(body.allowGravity).toBe(true);
            expect(body.allowDrag).toBe(true);
            expect(body.allowRotation).toBe(true);
            expect(body.maxSpeed).toBe(-1);
            expect(body.useDamping).toBe(false);
            expect(body.directControl).toBe(false);
            expect(body.collideWorldBounds).toBe(false);
            expect(body.worldBounce).toBeNull();
            expect(body.gameObject).toBeUndefined();
        });

        it('should initialise velocity, acceleration, drag, and gravity as zero vectors', function ()
        {
            var body = new Body(world);

            expect(body.velocity.x).toBe(0);
            expect(body.velocity.y).toBe(0);
            expect(body.acceleration.x).toBe(0);
            expect(body.acceleration.y).toBe(0);
            expect(body.drag.x).toBe(0);
            expect(body.drag.y).toBe(0);
            expect(body.gravity.x).toBe(0);
            expect(body.gravity.y).toBe(0);
        });

        it('should set maxVelocity to (10000, 10000) by default', function ()
        {
            var body = new Body(world);

            expect(body.maxVelocity.x).toBe(10000);
            expect(body.maxVelocity.y).toBe(10000);
        });

        it('should set friction to (1, 0) by default', function ()
        {
            var body = new Body(world);

            expect(body.friction.x).toBe(1);
            expect(body.friction.y).toBe(0);
        });

        it('should set slideFactor to (1, 1) by default', function ()
        {
            var body = new Body(world);

            expect(body.slideFactor.x).toBe(1);
            expect(body.slideFactor.y).toBe(1);
        });
    });

    describe('constructor (with game object)', function ()
    {
        it('should use displayWidth and displayHeight from the game object', function ()
        {
            var go = createMockGameObject({ displayWidth: 32, displayHeight: 48 });
            var body = new Body(world, go);

            expect(body.width).toBe(32);
            expect(body.height).toBe(48);
            expect(body.halfWidth).toBe(16);
            expect(body.halfHeight).toBe(24);
        });

        it('should store the game object reference', function ()
        {
            var go = createMockGameObject();
            var body = new Body(world, go);

            expect(body.gameObject).toBe(go);
        });

        it('should set position from game object x/y minus scaled origin', function ()
        {
            var go = createMockGameObject({ x: 100, y: 200, scaleX: 1, scaleY: 1, displayOriginX: 0, displayOriginY: 0 });
            var body = new Body(world, go);

            expect(body.position.x).toBe(100);
            expect(body.position.y).toBe(200);
        });
    });

    describe('updateCenter', function ()
    {
        it('should set center to position plus half-dimensions', function ()
        {
            var body = new Body(world);

            body.position.set(100, 200);
            body.halfWidth = 32;
            body.halfHeight = 32;
            body.updateCenter();

            expect(body.center.x).toBe(132);
            expect(body.center.y).toBe(232);
        });
    });

    describe('setOffset', function ()
    {
        it('should set both x and y offset', function ()
        {
            var body = new Body(world);
            var result = body.setOffset(10, 20);

            expect(body.offset.x).toBe(10);
            expect(body.offset.y).toBe(20);
            expect(result).toBe(body);
        });

        it('should use x for y when y is omitted', function ()
        {
            var body = new Body(world);
            body.setOffset(15);

            expect(body.offset.x).toBe(15);
            expect(body.offset.y).toBe(15);
        });
    });

    describe('setSize', function ()
    {
        it('should set source width/height and derived dimensions', function ()
        {
            var body = new Body(world);
            body.setSize(40, 80);

            expect(body.sourceWidth).toBe(40);
            expect(body.sourceHeight).toBe(80);
            expect(body.width).toBe(40);
            expect(body.height).toBe(80);
            expect(body.halfWidth).toBe(20);
            expect(body.halfHeight).toBe(40);
        });

        it('should clear circle mode', function ()
        {
            var body = new Body(world);
            body.isCircle = true;
            body.radius = 20;
            body.setSize(40, 40);

            expect(body.isCircle).toBe(false);
            expect(body.radius).toBe(0);
        });

        it('should return this', function ()
        {
            var body = new Body(world);
            var result = body.setSize(32, 32);

            expect(result).toBe(body);
        });
    });

    describe('setCircle', function ()
    {
        it('should enable circle mode with the given radius', function ()
        {
            var body = new Body(world);
            body.setCircle(20);

            expect(body.isCircle).toBe(true);
            expect(body.radius).toBe(20);
            expect(body.sourceWidth).toBe(40);
            expect(body.sourceHeight).toBe(40);
            expect(body.width).toBe(40);
            expect(body.height).toBe(40);
            expect(body.halfWidth).toBe(20);
            expect(body.halfHeight).toBe(20);
        });

        it('should set offset when provided', function ()
        {
            var body = new Body(world);
            body.setCircle(20, 5, 10);

            expect(body.offset.x).toBe(5);
            expect(body.offset.y).toBe(10);
        });

        it('should disable circle mode when radius is zero or negative', function ()
        {
            var body = new Body(world);
            body.setCircle(20);
            body.setCircle(0);

            expect(body.isCircle).toBe(false);
        });

        it('should return this', function ()
        {
            var body = new Body(world);
            var result = body.setCircle(10);

            expect(result).toBe(body);
        });
    });

    describe('stop', function ()
    {
        it('should zero velocity, acceleration, speed, and angular values', function ()
        {
            var body = new Body(world);
            body.velocity.set(100, 200);
            body.acceleration.set(50, 50);
            body.speed = 223;
            body.angularVelocity = 45;
            body.angularAcceleration = 10;

            body.stop();

            expect(body.velocity.x).toBe(0);
            expect(body.velocity.y).toBe(0);
            expect(body.acceleration.x).toBe(0);
            expect(body.acceleration.y).toBe(0);
            expect(body.speed).toBe(0);
            expect(body.angularVelocity).toBe(0);
            expect(body.angularAcceleration).toBe(0);
        });

        it('should return this', function ()
        {
            var body = new Body(world);
            var result = body.stop();

            expect(result).toBe(body);
        });
    });

    describe('getBounds', function ()
    {
        it('should populate the given object with x, y, right, bottom', function ()
        {
            var body = new Body(world);
            body.position.set(10, 20);
            body.width = 50;
            body.height = 80;

            var bounds = {};
            var result = body.getBounds(bounds);

            expect(bounds.x).toBe(10);
            expect(bounds.y).toBe(20);
            expect(bounds.right).toBe(60);
            expect(bounds.bottom).toBe(100);
            expect(result).toBe(bounds);
        });
    });

    describe('hitTest', function ()
    {
        it('should return true for a point inside a rectangular body', function ()
        {
            var body = new Body(world);
            body.position.set(0, 0);
            body.width = 100;
            body.height = 100;

            expect(body.hitTest(50, 50)).toBe(true);
        });

        it('should return false for a point outside a rectangular body', function ()
        {
            var body = new Body(world);
            body.position.set(0, 0);
            body.width = 100;
            body.height = 100;

            expect(body.hitTest(150, 50)).toBe(false);
        });

        it('should return true for a point inside a circular body', function ()
        {
            var body = new Body(world);
            body.setCircle(50);
            body.position.set(0, 0);
            body.center.set(50, 50);

            expect(body.hitTest(50, 50)).toBe(true);
        });

        it('should return false for a point outside a circular body', function ()
        {
            var body = new Body(world);
            body.setCircle(50);
            body.position.set(0, 0);
            body.center.set(50, 50);

            expect(body.hitTest(150, 150)).toBe(false);
        });
    });

    describe('onFloor / onCeiling / onWall', function ()
    {
        it('onFloor should return true when blocked.down is true', function ()
        {
            var body = new Body(world);
            body.blocked.down = true;

            expect(body.onFloor()).toBe(true);
        });

        it('onCeiling should return true when blocked.up is true', function ()
        {
            var body = new Body(world);
            body.blocked.up = true;

            expect(body.onCeiling()).toBe(true);
        });

        it('onWall should return true when blocked.left is true', function ()
        {
            var body = new Body(world);
            body.blocked.left = true;

            expect(body.onWall()).toBe(true);
        });

        it('onWall should return true when blocked.right is true', function ()
        {
            var body = new Body(world);
            body.blocked.right = true;

            expect(body.onWall()).toBe(true);
        });

        it('onFloor should return false when not blocked', function ()
        {
            var body = new Body(world);

            expect(body.onFloor()).toBe(false);
        });
    });

    describe('deltaAbsX / deltaAbsY', function ()
    {
        it('should return the absolute value of _dx', function ()
        {
            var body = new Body(world);
            body._dx = -50;

            expect(body.deltaAbsX()).toBe(50);
        });

        it('should return the absolute value of _dy', function ()
        {
            var body = new Body(world);
            body._dy = -30;

            expect(body.deltaAbsY()).toBe(30);
        });

        it('should return zero when _dx is zero', function ()
        {
            var body = new Body(world);
            body._dx = 0;

            expect(body.deltaAbsX()).toBeCloseTo(0);
        });
    });

    describe('deltaX / deltaY / deltaXFinal / deltaYFinal / deltaZ', function ()
    {
        it('deltaX should return _dx', function ()
        {
            var body = new Body(world);
            body._dx = 7;

            expect(body.deltaX()).toBe(7);
        });

        it('deltaY should return _dy', function ()
        {
            var body = new Body(world);
            body._dy = -3;

            expect(body.deltaY()).toBe(-3);
        });

        it('deltaXFinal should return _tx', function ()
        {
            var body = new Body(world);
            body._tx = 15;

            expect(body.deltaXFinal()).toBe(15);
        });

        it('deltaYFinal should return _ty', function ()
        {
            var body = new Body(world);
            body._ty = 25;

            expect(body.deltaYFinal()).toBe(25);
        });

        it('deltaZ should return the difference between rotation and preRotation', function ()
        {
            var body = new Body(world);
            body.rotation = 90;
            body.preRotation = 45;

            expect(body.deltaZ()).toBe(45);
        });
    });

    describe('setVelocity', function ()
    {
        it('should set velocity x and y', function ()
        {
            var body = new Body(world);
            body.setVelocity(100, 200);

            expect(body.velocity.x).toBe(100);
            expect(body.velocity.y).toBe(200);
        });

        it('should update speed to the magnitude of velocity', function ()
        {
            var body = new Body(world);
            body.setVelocity(3, 4);

            expect(body.speed).toBe(5);
        });

        it('should use x for y when y is omitted', function ()
        {
            var body = new Body(world);
            body.setVelocity(50);

            expect(body.velocity.x).toBe(50);
            expect(body.velocity.y).toBe(50);
        });

        it('should return this', function ()
        {
            var body = new Body(world);
            var result = body.setVelocity(10, 10);

            expect(result).toBe(body);
        });

        it('setVelocityX should only change x and update speed', function ()
        {
            var body = new Body(world);
            body.setVelocity(100, 100);
            body.setVelocityX(50);

            expect(body.velocity.x).toBe(50);
            expect(body.velocity.y).toBe(100);
        });

        it('setVelocityY should only change y and update speed', function ()
        {
            var body = new Body(world);
            body.setVelocity(100, 100);
            body.setVelocityY(50);

            expect(body.velocity.x).toBe(100);
            expect(body.velocity.y).toBe(50);
        });
    });

    describe('setMaxVelocity / setMaxSpeed', function ()
    {
        it('setMaxVelocity should set both components', function ()
        {
            var body = new Body(world);
            body.setMaxVelocity(500, 300);

            expect(body.maxVelocity.x).toBe(500);
            expect(body.maxVelocity.y).toBe(300);
        });

        it('setMaxSpeed should set maxSpeed', function ()
        {
            var body = new Body(world);
            body.setMaxSpeed(999);

            expect(body.maxSpeed).toBe(999);
        });
    });

    describe('setBounce', function ()
    {
        it('should set bounce x and y', function ()
        {
            var body = new Body(world);
            body.setBounce(0.5, 0.8);

            expect(body.bounce.x).toBe(0.5);
            expect(body.bounce.y).toBe(0.8);
        });

        it('setBounceX should set only x', function ()
        {
            var body = new Body(world);
            body.setBounceX(0.6);

            expect(body.bounce.x).toBe(0.6);
        });

        it('setBounceY should set only y', function ()
        {
            var body = new Body(world);
            body.setBounceY(0.4);

            expect(body.bounce.y).toBe(0.4);
        });
    });

    describe('setCollideWorldBounds', function ()
    {
        it('should enable collideWorldBounds', function ()
        {
            var body = new Body(world);
            body.setCollideWorldBounds(true);

            expect(body.collideWorldBounds).toBe(true);
        });

        it('should default to true when no argument given', function ()
        {
            var body = new Body(world);
            body.setCollideWorldBounds();

            expect(body.collideWorldBounds).toBe(true);
        });

        it('should create worldBounce vector when bounce values are provided', function ()
        {
            var body = new Body(world);
            body.setCollideWorldBounds(true, 0.5, 0.8);

            expect(body.worldBounce).not.toBeNull();
            expect(body.worldBounce.x).toBe(0.5);
            expect(body.worldBounce.y).toBe(0.8);
        });

        it('should set onWorldBounds when provided', function ()
        {
            var body = new Body(world);
            body.setCollideWorldBounds(true, undefined, undefined, true);

            expect(body.onWorldBounds).toBe(true);
        });
    });

    describe('setAcceleration / setGravity / setDrag', function ()
    {
        it('setAcceleration should set both components', function ()
        {
            var body = new Body(world);
            body.setAcceleration(200, 300);

            expect(body.acceleration.x).toBe(200);
            expect(body.acceleration.y).toBe(300);
        });

        it('setGravity should set both components', function ()
        {
            var body = new Body(world);
            body.setGravity(0, 980);

            expect(body.gravity.x).toBe(0);
            expect(body.gravity.y).toBe(980);
        });

        it('setDrag should set both components', function ()
        {
            var body = new Body(world);
            body.setDrag(100, 50);

            expect(body.drag.x).toBe(100);
            expect(body.drag.y).toBe(50);
        });

        it('setDamping should set useDamping', function ()
        {
            var body = new Body(world);
            body.setDamping(true);

            expect(body.useDamping).toBe(true);
        });
    });

    describe('setMass / setImmovable / setEnable', function ()
    {
        it('setMass should update mass', function ()
        {
            var body = new Body(world);
            body.setMass(5);

            expect(body.mass).toBe(5);
        });

        it('setImmovable should set immovable to true by default', function ()
        {
            var body = new Body(world);
            body.setImmovable();

            expect(body.immovable).toBe(true);
        });

        it('setImmovable should accept false', function ()
        {
            var body = new Body(world);
            body.setImmovable(false);

            expect(body.immovable).toBe(false);
        });

        it('setEnable should set enable to true by default', function ()
        {
            var body = new Body(world);
            body.enable = false;
            body.setEnable();

            expect(body.enable).toBe(true);
        });

        it('setEnable should accept false', function ()
        {
            var body = new Body(world);
            body.setEnable(false);

            expect(body.enable).toBe(false);
        });
    });

    describe('setAllowDrag / setAllowGravity / setAllowRotation', function ()
    {
        it('setAllowDrag should default to true', function ()
        {
            var body = new Body(world);
            body.allowDrag = false;
            body.setAllowDrag();

            expect(body.allowDrag).toBe(true);
        });

        it('setAllowGravity should default to true', function ()
        {
            var body = new Body(world);
            body.allowGravity = false;
            body.setAllowGravity();

            expect(body.allowGravity).toBe(true);
        });

        it('setAllowRotation should accept false', function ()
        {
            var body = new Body(world);
            body.setAllowRotation(false);

            expect(body.allowRotation).toBe(false);
        });
    });

    describe('setSlideFactor', function ()
    {
        it('should set both slide factor components', function ()
        {
            var body = new Body(world);
            body.setSlideFactor(0.5, 0.25);

            expect(body.slideFactor.x).toBe(0.5);
            expect(body.slideFactor.y).toBe(0.25);
        });
    });

    describe('setDirectControl', function ()
    {
        it('should default to true', function ()
        {
            var body = new Body(world);
            body.setDirectControl();

            expect(body.directControl).toBe(true);
        });

        it('should accept false', function ()
        {
            var body = new Body(world);
            body.setDirectControl(false);

            expect(body.directControl).toBe(false);
        });
    });

    describe('resetFlags', function ()
    {
        it('should reset overlapX, overlapY, overlapR, and embedded', function ()
        {
            var body = new Body(world);
            body.overlapX = 10;
            body.overlapY = 20;
            body.overlapR = 5;
            body.embedded = true;

            body.resetFlags();

            expect(body.overlapX).toBe(0);
            expect(body.overlapY).toBe(0);
            expect(body.overlapR).toBe(0);
            expect(body.embedded).toBe(false);
        });

        it('should copy touching to wasTouching by default', function ()
        {
            var body = new Body(world);
            body.touching.down = true;
            body.touching.none = false;

            body.resetFlags(false);

            expect(body.wasTouching.down).toBe(true);
            expect(body.wasTouching.none).toBe(false);
        });

        it('should reset wasTouching to defaults when clear is true', function ()
        {
            var body = new Body(world);
            body.touching.down = true;

            body.resetFlags(true);

            expect(body.wasTouching.none).toBe(true);
            expect(body.wasTouching.down).toBe(false);
        });
    });

    describe('willDrawDebug', function ()
    {
        it('should return true when debugShowBody is true', function ()
        {
            var body = new Body(world);
            body.debugShowBody = true;
            body.debugShowVelocity = false;

            expect(body.willDrawDebug()).toBe(true);
        });

        it('should return true when debugShowVelocity is true', function ()
        {
            var body = new Body(world);
            body.debugShowBody = false;
            body.debugShowVelocity = true;

            expect(body.willDrawDebug()).toBe(true);
        });

        it('should return false when both are false', function ()
        {
            var body = new Body(world);
            body.debugShowBody = false;
            body.debugShowVelocity = false;

            expect(body.willDrawDebug()).toBe(false);
        });
    });

    describe('setBoundsRectangle', function ()
    {
        it('should set a custom bounds rectangle', function ()
        {
            var body = new Body(world);
            var rect = { x: 10, y: 10, width: 400, height: 300, right: 410, bottom: 310 };
            body.setBoundsRectangle(rect);

            expect(body.customBoundsRectangle).toBe(rect);
        });

        it('should revert to world bounds when null is passed', function ()
        {
            var body = new Body(world);
            body.setBoundsRectangle(null);

            expect(body.customBoundsRectangle).toBe(world.bounds);
        });
    });

    describe('destroy', function ()
    {
        it('should set enable to false and add to pendingDestroy', function ()
        {
            var added = [];
            var mockW = createMockWorld();
            mockW.pendingDestroy = { add: function (b) { added.push(b); } };

            var body = new Body(mockW);
            body.enable = true;
            body.destroy();

            expect(body.enable).toBe(false);
            expect(added.length).toBe(1);
            expect(added[0]).toBe(body);
        });
    });

    describe('processX / processY', function ()
    {
        it('processX should move x position and update center', function ()
        {
            var body = new Body(world);
            body.position.set(100, 100);
            body.halfWidth = 32;
            body.halfHeight = 32;

            body.processX(10, null, false, false);

            expect(body.x).toBe(110);
            expect(body.center.x).toBe(142);
        });

        it('processX should set velocity.x scaled by slideFactor.x', function ()
        {
            var body = new Body(world);
            body.slideFactor.x = 0.5;

            body.processX(0, 100, false, false);

            expect(body.velocity.x).toBe(50);
        });

        it('processX should set blocked.left when left is true', function ()
        {
            var body = new Body(world);
            body.processX(0, null, true, false);

            expect(body.blocked.left).toBe(true);
            expect(body.blocked.none).toBe(false);
        });

        it('processX should set blocked.right when right is true', function ()
        {
            var body = new Body(world);
            body.processX(0, null, false, true);

            expect(body.blocked.right).toBe(true);
            expect(body.blocked.none).toBe(false);
        });

        it('processY should move y position and update center', function ()
        {
            var body = new Body(world);
            body.position.set(100, 100);
            body.halfWidth = 32;
            body.halfHeight = 32;

            body.processY(15, null, false, false);

            expect(body.y).toBe(115);
            expect(body.center.y).toBe(147);
        });

        it('processY should set velocity.y scaled by slideFactor.y', function ()
        {
            var body = new Body(world);
            body.slideFactor.y = 0.25;

            body.processY(0, 200, false, false);

            expect(body.velocity.y).toBe(50);
        });

        it('processY should set blocked.down when down is true', function ()
        {
            var body = new Body(world);
            body.processY(0, null, false, true);

            expect(body.blocked.down).toBe(true);
            expect(body.blocked.none).toBe(false);
        });
    });

    describe('x / y / left / right / top / bottom properties', function ()
    {
        it('x getter should return position.x', function ()
        {
            var body = new Body(world);
            body.position.x = 42;

            expect(body.x).toBe(42);
        });

        it('x setter should update position.x', function ()
        {
            var body = new Body(world);
            body.x = 99;

            expect(body.position.x).toBe(99);
        });

        it('right should equal x plus width', function ()
        {
            var body = new Body(world);
            body.position.x = 50;
            body.width = 64;

            expect(body.right).toBe(114);
        });

        it('bottom should equal y plus height', function ()
        {
            var body = new Body(world);
            body.position.y = 30;
            body.height = 64;

            expect(body.bottom).toBe(94);
        });
    });
});
