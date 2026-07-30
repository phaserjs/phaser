var StaticBody = require('../../../src/physics/arcade/StaticBody');
var CONST = require('../../../src/physics/arcade/const');

function createMockWorld ()
{
    return {
        defaults: {
            debugShowStaticBody: true,
            staticBodyDebugColor: 0x00ff00
        },
        staticTree: {
            remove: function () {},
            insert: function () {}
        },
        pendingDestroy: {
            add: function () {}
        },
        disable: function () {}
    };
}

function createMockGameObject (x, y, width, height)
{
    x = (x === undefined) ? 0 : x;
    y = (y === undefined) ? 0 : y;
    width = (width === undefined) ? 64 : width;
    height = (height === undefined) ? 64 : height;

    return {
        x: x,
        y: y,
        originX: 0,
        originY: 0,
        displayWidth: width,
        displayHeight: height,
        hasTransformComponent: true,
        setPosition: function (px, py)
        {
            this.x = px;
            this.y = py;
        },
        getTopLeft: function (out)
        {
            out.x = this.x;
            out.y = this.y;
            return out;
        }
    };
}

describe('StaticBody', function ()
{
    describe('constructor', function ()
    {
        it('should set default property values when no gameObject is provided', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            expect(body.world).toBe(world);
            expect(body.gameObject).toBeUndefined();
            expect(body.isBody).toBe(true);
            expect(body.enable).toBe(true);
            expect(body.isCircle).toBe(false);
            expect(body.radius).toBe(0);
            expect(body.mass).toBe(1);
            expect(body.immovable).toBe(true);
            expect(body.pushable).toBe(false);
            expect(body.allowGravity).toBe(false);
            expect(body.onWorldBounds).toBe(false);
            expect(body.onCollide).toBe(false);
            expect(body.onOverlap).toBe(false);
            expect(body.embedded).toBe(false);
            expect(body.collideWorldBounds).toBe(false);
            expect(body.customSeparateX).toBe(false);
            expect(body.customSeparateY).toBe(false);
            expect(body.overlapX).toBe(0);
            expect(body.overlapY).toBe(0);
            expect(body.overlapR).toBe(0);
            expect(body.physicsType).toBe(CONST.STATIC_BODY);
        });

        it('should pick up debug settings from world defaults', function ()
        {
            var world = createMockWorld();
            world.defaults.debugShowStaticBody = false;
            world.defaults.staticBodyDebugColor = 0xff0000;

            var body = new StaticBody(world);

            expect(body.debugShowBody).toBe(false);
            expect(body.debugBodyColor).toBe(0xff0000);
        });

        it('should use gameObject displayWidth and displayHeight when provided', function ()
        {
            var world = createMockWorld();
            var go = createMockGameObject(100, 200, 80, 60);
            var body = new StaticBody(world, go);

            expect(body.width).toBe(80);
            expect(body.height).toBe(60);
            expect(body.halfWidth).toBe(40);
            expect(body.halfHeight).toBe(30);
        });

        it('should set position based on gameObject coordinates and origin', function ()
        {
            var world = createMockWorld();
            var go = createMockGameObject(100, 200, 80, 60);
            var body = new StaticBody(world, go);

            expect(body.position.x).toBe(100);
            expect(body.position.y).toBe(200);
        });

        it('should compute center correctly from position and dimensions', function ()
        {
            var world = createMockWorld();
            var go = createMockGameObject(100, 200, 80, 60);
            var body = new StaticBody(world, go);

            expect(body.center.x).toBe(140);
            expect(body.center.y).toBe(230);
        });

        it('should store the gameObject reference', function ()
        {
            var world = createMockWorld();
            var go = createMockGameObject(0, 0, 32, 32);
            var body = new StaticBody(world, go);

            expect(body.gameObject).toBe(go);
        });

        it('should default to 64x64 size when gameObject has no displayWidth', function ()
        {
            var world = createMockWorld();
            var go = { x: 0, y: 0, originX: 0, originY: 0 };
            var body = new StaticBody(world, go);

            expect(body.width).toBe(64);
            expect(body.height).toBe(64);
        });
    });

    describe('setCircle', function ()
    {
        it('should set isCircle, radius, width and height', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            body.setCircle(50);

            expect(body.isCircle).toBe(true);
            expect(body.radius).toBe(50);
            expect(body.width).toBe(100);
            expect(body.height).toBe(100);
            expect(body.halfWidth).toBe(50);
            expect(body.halfHeight).toBe(50);
        });

        it('should set isCircle to false when radius is zero or negative', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);
            body.isCircle = true;

            body.setCircle(0);
            expect(body.isCircle).toBe(false);

            body.isCircle = true;
            body.setCircle(-10);
            expect(body.isCircle).toBe(false);
        });

        it('should apply offsetX and offsetY to the offset vector', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            body.setCircle(25, 10, 20);

            expect(body.offset.x).toBe(10);
            expect(body.offset.y).toBe(20);
        });

        it('should return the StaticBody instance', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);
            var result = body.setCircle(30);

            expect(result).toBe(body);
        });
    });

    describe('setSize', function ()
    {
        it('should set width, height, halfWidth, and halfHeight', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            body.setSize(120, 80, false);

            expect(body.width).toBe(120);
            expect(body.height).toBe(80);
            expect(body.halfWidth).toBe(60);
            expect(body.halfHeight).toBe(40);
        });

        it('should clear isCircle and radius', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);
            body.setCircle(50);

            body.setSize(100, 100, false);

            expect(body.isCircle).toBe(false);
            expect(body.radius).toBe(0);
        });

        it('should return the StaticBody instance', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);
            var result = body.setSize(50, 50, false);

            expect(result).toBe(body);
        });
    });

    describe('setOffset', function ()
    {
        it('should update offset and adjust position', function ()
        {
            var world = createMockWorld();
            var go = createMockGameObject(100, 100, 64, 64);
            var body = new StaticBody(world, go);

            var prevX = body.position.x;
            var prevY = body.position.y;

            body.setOffset(10, 20);

            expect(body.offset.x).toBe(10);
            expect(body.offset.y).toBe(20);
            expect(body.position.x).toBe(prevX + 10);
            expect(body.position.y).toBe(prevY + 20);
        });

        it('should use x for both axes when y is not provided', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            body.setOffset(15);

            expect(body.offset.x).toBe(15);
            expect(body.offset.y).toBe(15);
        });

        it('should return the StaticBody instance', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);
            var result = body.setOffset(5, 5);

            expect(result).toBe(body);
        });
    });

    describe('updateCenter', function ()
    {
        it('should recalculate center from position and half-dimensions', function ()
        {
            var world = createMockWorld();
            var go = createMockGameObject(0, 0, 100, 80);
            var body = new StaticBody(world, go);

            body.position.x = 200;
            body.position.y = 300;
            body.halfWidth = 50;
            body.halfHeight = 40;

            body.updateCenter();

            expect(body.center.x).toBe(250);
            expect(body.center.y).toBe(340);
        });
    });

    describe('getBounds', function ()
    {
        it('should populate and return the bounds object', function ()
        {
            var world = createMockWorld();
            var go = createMockGameObject(50, 75, 100, 80);
            var body = new StaticBody(world, go);

            var bounds = {};
            var result = body.getBounds(bounds);

            expect(result).toBe(bounds);
            expect(bounds.x).toBe(50);
            expect(bounds.y).toBe(75);
            expect(bounds.right).toBe(150);
            expect(bounds.bottom).toBe(155);
        });
    });

    describe('hitTest', function ()
    {
        it('should return true for a point inside a rectangular body', function ()
        {
            var world = createMockWorld();
            var go = createMockGameObject(0, 0, 100, 100);
            var body = new StaticBody(world, go);

            expect(body.hitTest(50, 50)).toBe(true);
        });

        it('should return false for a point outside a rectangular body', function ()
        {
            var world = createMockWorld();
            var go = createMockGameObject(0, 0, 100, 100);
            var body = new StaticBody(world, go);

            expect(body.hitTest(200, 200)).toBe(false);
        });

        it('should use circle collision when isCircle is true', function ()
        {
            var world = createMockWorld();
            var go = createMockGameObject(0, 0, 100, 100);
            var body = new StaticBody(world, go);

            body.setCircle(50);

            // CircleContains uses body.x/body.y (position.x/y) as the circle center
            // A point at the body's position is distance 0 from that center, so inside
            expect(body.hitTest(body.x, body.y)).toBe(true);
            // A point far outside the radius should not be inside
            expect(body.hitTest(body.x + 200, body.y + 200)).toBe(false);
        });
    });

    describe('stop', function ()
    {
        it('should return the StaticBody instance', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);
            var result = body.stop();

            expect(result).toBe(body);
        });
    });

    describe('delta methods', function ()
    {
        it('deltaAbsX should always return zero', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            expect(body.deltaAbsX()).toBe(0);
        });

        it('deltaAbsY should always return zero', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            expect(body.deltaAbsY()).toBe(0);
        });

        it('deltaX should always return zero', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            expect(body.deltaX()).toBe(0);
        });

        it('deltaY should always return zero', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            expect(body.deltaY()).toBe(0);
        });

        it('deltaZ should always return zero', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            expect(body.deltaZ()).toBe(0);
        });
    });

    describe('willDrawDebug', function ()
    {
        it('should return true when debugShowBody is true', function ()
        {
            var world = createMockWorld();
            world.defaults.debugShowStaticBody = true;
            var body = new StaticBody(world);

            expect(body.willDrawDebug()).toBe(true);
        });

        it('should return false when debugShowBody is false', function ()
        {
            var world = createMockWorld();
            world.defaults.debugShowStaticBody = false;
            var body = new StaticBody(world);

            expect(body.willDrawDebug()).toBe(false);
        });
    });

    describe('setMass', function ()
    {
        it('should set the mass to the given value', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            body.setMass(5);

            expect(body.mass).toBe(5);
        });

        it('should clamp mass to 0.1 when value is zero', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            body.setMass(0);

            expect(body.mass).toBeCloseTo(0.1);
        });

        it('should clamp mass to 0.1 when value is negative', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            body.setMass(-10);

            expect(body.mass).toBeCloseTo(0.1);
        });

        it('should return the StaticBody instance', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);
            var result = body.setMass(2);

            expect(result).toBe(body);
        });
    });

    describe('destroy', function ()
    {
        it('should set enable to false', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);

            body.destroy();

            expect(body.enable).toBe(false);
        });

        it('should add the body to world.pendingDestroy', function ()
        {
            var world = createMockWorld();
            var body = new StaticBody(world);
            var added = null;

            world.pendingDestroy.add = function (item)
            {
                added = item;
            };

            body.destroy();

            expect(added).toBe(body);
        });
    });

    describe('coordinate getters', function ()
    {
        it('x getter should return position.x', function ()
        {
            var world = createMockWorld();
            var go = createMockGameObject(150, 200, 80, 60);
            var body = new StaticBody(world, go);

            expect(body.x).toBe(150);
        });

        it('right getter should return position.x + width', function ()
        {
            var world = createMockWorld();
            var go = createMockGameObject(50, 0, 100, 64);
            var body = new StaticBody(world, go);

            expect(body.right).toBe(150);
        });

        it('bottom getter should return position.y + height', function ()
        {
            var world = createMockWorld();
            var go = createMockGameObject(0, 50, 64, 80);
            var body = new StaticBody(world, go);

            expect(body.bottom).toBe(130);
        });
    });
});
