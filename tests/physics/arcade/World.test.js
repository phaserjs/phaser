var World = require('../../../src/physics/arcade/World');
var CONST = require('../../../src/physics/arcade/const');
var Vector2 = require('../../../src/math/Vector2');
var Events = require('../../../src/physics/arcade/events');

function createMockScene ()
{
    return {
        sys: {
            scale: { width: 800, height: 600 }
        }
    };
}

function createWorld (config)
{
    return new World(createMockScene(), config || {});
}

function createMockDynamicBody (overrides)
{
    var body = {
        physicsType: CONST.DYNAMIC_BODY,
        enable: true,
        isCircle: false,
        left: 0, right: 32,
        top: 0, bottom: 32,
        center: { x: 16, y: 16 },
        halfWidth: 16,
        checkCollision: { none: false },
        collisionMask: 1,
        collisionCategory: 1
    };

    if (overrides)
    {
        for (var k in overrides)
        {
            body[k] = overrides[k];
        }
    }

    return body;
}

function createMockStaticBody (overrides)
{
    var body = {
        physicsType: CONST.STATIC_BODY,
        enable: true,
        isCircle: false,
        left: 0, right: 32,
        top: 0, bottom: 32,
        center: { x: 16, y: 16 },
        halfWidth: 16,
        checkCollision: { none: false },
        collisionMask: 1,
        collisionCategory: 1
    };

    if (overrides)
    {
        for (var k in overrides)
        {
            body[k] = overrides[k];
        }
    }

    return body;
}

function createMockVelocityBody (overrides)
{
    var body = {
        velocity: new Vector2(0, 0),
        acceleration: new Vector2(0, 0),
        drag: new Vector2(0, 0),
        maxVelocity: new Vector2(500, 500),
        gravity: new Vector2(0, 0),
        speed: 0,
        maxSpeed: -1,
        allowDrag: false,
        useDamping: false,
        allowGravity: false
    };

    if (overrides)
    {
        for (var k in overrides)
        {
            body[k] = overrides[k];
        }
    }

    return body;
}

describe('Phaser.Physics.Arcade.World', function ()
{
    describe('constructor', function ()
    {
        it('should set default gravity to (0, 0)', function ()
        {
            var world = createWorld();

            expect(world.gravity.x).toBe(0);
            expect(world.gravity.y).toBe(0);
        });

        it('should set gravity from config', function ()
        {
            var world = createWorld({ gravity: { x: 0, y: 300 } });

            expect(world.gravity.x).toBe(0);
            expect(world.gravity.y).toBe(300);
        });

        it('should set default fps to 60', function ()
        {
            var world = createWorld();

            expect(world.fps).toBe(60);
        });

        it('should set fps from config', function ()
        {
            var world = createWorld({ fps: 30 });

            expect(world.fps).toBe(30);
        });

        it('should set bounds from scene dimensions by default', function ()
        {
            var world = createWorld();

            expect(world.bounds.width).toBe(800);
            expect(world.bounds.height).toBe(600);
        });

        it('should set bounds from config', function ()
        {
            var world = createWorld({ x: 10, y: 20, width: 400, height: 300 });

            expect(world.bounds.x).toBe(10);
            expect(world.bounds.y).toBe(20);
            expect(world.bounds.width).toBe(400);
            expect(world.bounds.height).toBe(300);
        });

        it('should default checkCollision to all sides enabled', function ()
        {
            var world = createWorld();

            expect(world.checkCollision.up).toBe(true);
            expect(world.checkCollision.down).toBe(true);
            expect(world.checkCollision.left).toBe(true);
            expect(world.checkCollision.right).toBe(true);
        });

        it('should not be paused by default', function ()
        {
            var world = createWorld();

            expect(world.isPaused).toBe(false);
        });

        it('should initialise with empty body sets', function ()
        {
            var world = createWorld();

            expect(world.bodies.size).toBe(0);
            expect(world.staticBodies.size).toBe(0);
        });

        it('should set OVERLAP_BIAS to 4 by default', function ()
        {
            var world = createWorld();

            expect(world.OVERLAP_BIAS).toBe(4);
        });

        it('should set TILE_BIAS to 16 by default', function ()
        {
            var world = createWorld();

            expect(world.TILE_BIAS).toBe(16);
        });
    });

    describe('setFPS', function ()
    {
        it('should update fps and derived frame time values', function ()
        {
            var world = createWorld();

            world.setFPS(30);

            expect(world.fps).toBe(30);
            expect(world._frameTime).toBeCloseTo(1 / 30);
            expect(world._frameTimeMS).toBeCloseTo(1000 / 30);
        });

        it('should return the world for chaining', function ()
        {
            var world = createWorld();

            expect(world.setFPS(60)).toBe(world);
        });
    });

    describe('setBounds', function ()
    {
        it('should update the world bounds rectangle', function ()
        {
            var world = createWorld();

            world.setBounds(50, 100, 1024, 768);

            expect(world.bounds.x).toBe(50);
            expect(world.bounds.y).toBe(100);
            expect(world.bounds.width).toBe(1024);
            expect(world.bounds.height).toBe(768);
        });

        it('should update checkCollision when collision args are provided', function ()
        {
            var world = createWorld();

            world.setBounds(0, 0, 800, 600, false, false, true, true);

            expect(world.checkCollision.left).toBe(false);
            expect(world.checkCollision.right).toBe(false);
            expect(world.checkCollision.up).toBe(true);
            expect(world.checkCollision.down).toBe(true);
        });

        it('should return the world for chaining', function ()
        {
            var world = createWorld();

            expect(world.setBounds(0, 0, 800, 600)).toBe(world);
        });
    });

    describe('setBoundsCollision', function ()
    {
        it('should set collision flags on each side', function ()
        {
            var world = createWorld();

            world.setBoundsCollision(false, true, false, true);

            expect(world.checkCollision.left).toBe(false);
            expect(world.checkCollision.right).toBe(true);
            expect(world.checkCollision.up).toBe(false);
            expect(world.checkCollision.down).toBe(true);
        });

        it('should default all sides to true when called with no args', function ()
        {
            var world = createWorld();

            world.checkCollision.left = false;
            world.checkCollision.right = false;
            world.setBoundsCollision();

            expect(world.checkCollision.left).toBe(true);
            expect(world.checkCollision.right).toBe(true);
            expect(world.checkCollision.up).toBe(true);
            expect(world.checkCollision.down).toBe(true);
        });

        it('should return the world for chaining', function ()
        {
            var world = createWorld();

            expect(world.setBoundsCollision()).toBe(world);
        });
    });

    describe('pause', function ()
    {
        it('should set isPaused to true', function ()
        {
            var world = createWorld();

            world.pause();

            expect(world.isPaused).toBe(true);
        });

        it('should emit a PAUSE event', function ()
        {
            var world = createWorld();
            var fired = false;

            world.on(Events.PAUSE, function () { fired = true; });
            world.pause();

            expect(fired).toBe(true);
        });

        it('should return the world for chaining', function ()
        {
            var world = createWorld();

            expect(world.pause()).toBe(world);
        });
    });

    describe('resume', function ()
    {
        it('should set isPaused to false', function ()
        {
            var world = createWorld();

            world.pause();
            world.resume();

            expect(world.isPaused).toBe(false);
        });

        it('should emit a RESUME event', function ()
        {
            var world = createWorld();
            var fired = false;

            world.on(Events.RESUME, function () { fired = true; });
            world.resume();

            expect(fired).toBe(true);
        });

        it('should return the world for chaining', function ()
        {
            var world = createWorld();

            expect(world.resume()).toBe(world);
        });
    });

    describe('add', function ()
    {
        it('should add a dynamic body to the bodies set and enable it', function ()
        {
            var world = createWorld();
            var body = createMockDynamicBody({ enable: false });

            world.add(body);

            expect(world.bodies.has(body)).toBe(true);
            expect(body.enable).toBe(true);
        });

        it('should add a static body to the staticBodies set and enable it', function ()
        {
            var world = createWorld();
            var body = createMockStaticBody({ enable: false });

            world.add(body);

            expect(world.staticBodies.has(body)).toBe(true);
            expect(body.enable).toBe(true);
        });

        it('should return the body', function ()
        {
            var world = createWorld();
            var body = createMockDynamicBody();

            expect(world.add(body)).toBe(body);
        });
    });

    describe('remove', function ()
    {
        it('should remove a dynamic body from the bodies set', function ()
        {
            var world = createWorld();
            var body = createMockDynamicBody();

            world.add(body);
            world.remove(body);

            expect(world.bodies.has(body)).toBe(false);
        });

        it('should remove a static body from the staticBodies set', function ()
        {
            var world = createWorld();
            var body = createMockStaticBody();

            world.add(body);
            world.remove(body);

            expect(world.staticBodies.has(body)).toBe(false);
        });
    });

    describe('disableBody', function ()
    {
        it('should remove body and set enable to false', function ()
        {
            var world = createWorld();
            var body = createMockDynamicBody({ enable: true });

            world.add(body);
            world.disableBody(body);

            expect(world.bodies.has(body)).toBe(false);
            expect(body.enable).toBe(false);
        });
    });

    describe('addCollider', function ()
    {
        it('should create and return a Collider', function ()
        {
            var world = createWorld();
            var obj1 = { body: createMockDynamicBody() };
            var obj2 = { body: createMockDynamicBody() };

            var collider = world.addCollider(obj1, obj2);

            expect(collider).toBeDefined();
            expect(collider.overlapOnly).toBe(false);
        });
    });

    describe('addOverlap', function ()
    {
        it('should create and return an overlap Collider', function ()
        {
            var world = createWorld();
            var obj1 = { body: createMockDynamicBody() };
            var obj2 = { body: createMockDynamicBody() };

            var collider = world.addOverlap(obj1, obj2);

            expect(collider).toBeDefined();
            expect(collider.overlapOnly).toBe(true);
        });
    });

    describe('removeCollider', function ()
    {
        it('should return the world for chaining', function ()
        {
            var world = createWorld();
            var obj1 = { body: createMockDynamicBody() };
            var obj2 = { body: createMockDynamicBody() };
            var collider = world.addCollider(obj1, obj2);

            expect(world.removeCollider(collider)).toBe(world);
        });
    });

    describe('canCollide', function ()
    {
        it('should return true when both masks allow collision', function ()
        {
            var world = createWorld();
            var body1 = { collisionMask: 1, collisionCategory: 1 };
            var body2 = { collisionMask: 1, collisionCategory: 1 };

            expect(world.canCollide(body1, body2)).toBe(true);
        });

        it('should return false when masks do not match', function ()
        {
            var world = createWorld();
            var body1 = { collisionMask: 1, collisionCategory: 2 };
            var body2 = { collisionMask: 4, collisionCategory: 1 };

            expect(world.canCollide(body1, body2)).toBe(false);
        });

        it('should return falsy if body1 is null', function ()
        {
            var world = createWorld();
            var body2 = { collisionMask: 1, collisionCategory: 1 };

            expect(world.canCollide(null, body2)).toBeFalsy();
        });

        it('should return falsy if body2 is null', function ()
        {
            var world = createWorld();
            var body1 = { collisionMask: 1, collisionCategory: 1 };

            expect(world.canCollide(body1, null)).toBeFalsy();
        });
    });

    describe('intersects', function ()
    {
        it('should return false when both bodies are the same object', function ()
        {
            var world = createWorld();
            var body = createMockDynamicBody();

            expect(world.intersects(body, body)).toBe(false);
        });

        it('should return true for overlapping rectangles', function ()
        {
            var world = createWorld();
            var body1 = createMockDynamicBody({ left: 0, right: 40, top: 0, bottom: 40 });
            var body2 = createMockDynamicBody({ left: 20, right: 60, top: 20, bottom: 60 });

            expect(world.intersects(body1, body2)).toBe(true);
        });

        it('should return false for non-overlapping rectangles', function ()
        {
            var world = createWorld();
            var body1 = createMockDynamicBody({ left: 0, right: 30, top: 0, bottom: 30 });
            var body2 = createMockDynamicBody({ left: 50, right: 80, top: 50, bottom: 80 });

            expect(world.intersects(body1, body2)).toBe(false);
        });

        it('should return true for two overlapping circles', function ()
        {
            var world = createWorld();
            var body1 = createMockDynamicBody({
                isCircle: true,
                center: { x: 0, y: 0 },
                halfWidth: 20
            });
            var body2 = createMockDynamicBody({
                isCircle: true,
                center: { x: 30, y: 0 },
                halfWidth: 20
            });

            // distance = 30, sum of radii = 40 => overlap
            expect(world.intersects(body1, body2)).toBe(true);
        });

        it('should return false for two non-overlapping circles', function ()
        {
            var world = createWorld();
            var body1 = createMockDynamicBody({
                isCircle: true,
                center: { x: 0, y: 0 },
                halfWidth: 10
            });
            var body2 = createMockDynamicBody({
                isCircle: true,
                center: { x: 50, y: 0 },
                halfWidth: 10
            });

            // distance = 50, sum of radii = 20 => no overlap
            expect(world.intersects(body1, body2)).toBe(false);
        });

        it('should return false for touching rectangles (edges only)', function ()
        {
            var world = createWorld();
            var body1 = createMockDynamicBody({ left: 0, right: 32, top: 0, bottom: 32 });
            var body2 = createMockDynamicBody({ left: 32, right: 64, top: 0, bottom: 32 });

            // Touching at right==left edge: right <= left means false
            expect(world.intersects(body1, body2)).toBe(false);
        });
    });

    describe('circleBodyIntersects', function ()
    {
        it('should return true when circle center is inside the rect', function ()
        {
            var world = createWorld();
            var circle = { center: { x: 20, y: 20 }, halfWidth: 10 };
            var rect = { left: 0, right: 50, top: 0, bottom: 50 };

            expect(world.circleBodyIntersects(circle, rect)).toBe(true);
        });

        it('should return true when circle overlaps the rect edge', function ()
        {
            var world = createWorld();
            // circle at (55, 25) with radius 10, rect is 0-50, 0-50
            // nearest point on rect is (50, 25), distance = 5 < 10
            var circle = { center: { x: 55, y: 25 }, halfWidth: 10 };
            var rect = { left: 0, right: 50, top: 0, bottom: 50 };

            expect(world.circleBodyIntersects(circle, rect)).toBe(true);
        });

        it('should return false when circle is far outside the rect', function ()
        {
            var world = createWorld();
            // circle at (100, 100) with radius 5, rect is 0-50, 0-50
            // nearest point is (50, 50), distance = sqrt(2500+2500) ~= 70 > 5
            var circle = { center: { x: 100, y: 100 }, halfWidth: 5 };
            var rect = { left: 0, right: 50, top: 0, bottom: 50 };

            expect(world.circleBodyIntersects(circle, rect)).toBe(false);
        });
    });

    describe('computeAngularVelocity', function ()
    {
        it('should apply angular acceleration to angular velocity', function ()
        {
            var world = createWorld();
            var body = {
                angularVelocity: 0,
                angularAcceleration: 100,
                angularDrag: 0,
                maxAngular: 1000,
                allowDrag: false,
                rotation: 0
            };

            world.computeAngularVelocity(body, 0.5);

            expect(body.angularVelocity).toBeCloseTo(50);
        });

        it('should clamp angular velocity to maxAngular', function ()
        {
            var world = createWorld();
            var body = {
                angularVelocity: 900,
                angularAcceleration: 500,
                angularDrag: 0,
                maxAngular: 1000,
                allowDrag: false,
                rotation: 0
            };

            world.computeAngularVelocity(body, 1);

            expect(body.angularVelocity).toBe(1000);
        });

        it('should update rotation by angular velocity times delta', function ()
        {
            var world = createWorld();
            var body = {
                angularVelocity: 90,
                angularAcceleration: 0,
                angularDrag: 0,
                maxAngular: 1000,
                allowDrag: false,
                rotation: 0
            };

            world.computeAngularVelocity(body, 1);

            expect(body.rotation).toBeCloseTo(90);
        });
    });

    describe('computeVelocity', function ()
    {
        it('should apply world gravity when allowGravity is true', function ()
        {
            var world = createWorld({ gravity: { x: 0, y: 200 } });
            var body = createMockVelocityBody({ allowGravity: true });

            world.computeVelocity(body, 1);

            expect(body.velocity.y).toBeCloseTo(200);
        });

        it('should not apply gravity when allowGravity is false', function ()
        {
            var world = createWorld({ gravity: { x: 0, y: 200 } });
            var body = createMockVelocityBody({ allowGravity: false });

            world.computeVelocity(body, 1);

            expect(body.velocity.y).toBe(0);
        });

        it('should apply acceleration', function ()
        {
            var world = createWorld();
            var body = createMockVelocityBody({
                acceleration: new Vector2(100, 0)
            });

            world.computeVelocity(body, 0.5);

            expect(body.velocity.x).toBeCloseTo(50);
        });

        it('should clamp velocity to maxVelocity', function ()
        {
            var world = createWorld();
            var body = createMockVelocityBody({
                velocity: new Vector2(400, 0),
                acceleration: new Vector2(500, 0),
                maxVelocity: new Vector2(500, 500)
            });

            world.computeVelocity(body, 1);

            expect(body.velocity.x).toBe(500);
        });
    });

    describe('wrapObject', function ()
    {
        it('should wrap x past the right boundary', function ()
        {
            var world = createWorld();
            // bounds: 0 to 800
            var obj = { x: 850, y: 300 };

            world.wrapObject(obj);

            expect(obj.x).toBeCloseTo(50);
        });

        it('should wrap x past the left boundary', function ()
        {
            var world = createWorld();
            // bounds: 0 to 800
            var obj = { x: -10, y: 300 };

            world.wrapObject(obj);

            expect(obj.x).toBeCloseTo(790);
        });

        it('should wrap y past the bottom boundary', function ()
        {
            var world = createWorld();
            // bounds: 0 to 600
            var obj = { x: 400, y: 650 };

            world.wrapObject(obj);

            expect(obj.y).toBeCloseTo(50);
        });

        it('should respect padding', function ()
        {
            var world = createWorld();
            // bounds: 0 to 800, padding: 10 => effective range [-10, 810)
            // Wrap(850, -10, 810): range=820, (850+10)%820=40, -10+40=30
            var obj = { x: 850, y: 300 };

            world.wrapObject(obj, 10);

            expect(obj.x).toBeCloseTo(30);
        });
    });

    describe('wrapArray', function ()
    {
        it('should wrap all objects in the array', function ()
        {
            var world = createWorld();
            var objects = [
                { x: 850, y: 300 },
                { x: 400, y: 650 }
            ];

            world.wrapArray(objects);

            expect(objects[0].x).toBeCloseTo(50);
            expect(objects[1].y).toBeCloseTo(50);
        });
    });

    describe('shutdown', function ()
    {
        it('should clear all bodies and static bodies', function ()
        {
            var world = createWorld();
            var dynBody = createMockDynamicBody();
            var staBody = createMockStaticBody();

            world.add(dynBody);
            world.add(staBody);
            world.shutdown();

            expect(world.bodies.size).toBe(0);
            expect(world.staticBodies.size).toBe(0);
        });

        it('should remove all event listeners', function ()
        {
            var world = createWorld();
            var called = false;

            world.on(Events.PAUSE, function () { called = true; });
            world.shutdown();
            world.emit(Events.PAUSE);

            expect(called).toBe(false);
        });
    });

    describe('destroy', function ()
    {
        it('should set scene to null', function ()
        {
            var world = createWorld();

            world.destroy();

            expect(world.scene).toBeNull();
        });

        it('should call shutdown (clearing bodies)', function ()
        {
            var world = createWorld();
            var body = createMockDynamicBody();

            world.add(body);
            world.destroy();

            expect(world.bodies.size).toBe(0);
        });
    });
});
