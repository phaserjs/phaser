var OverlapRect = require('../../../../src/physics/arcade/components/OverlapRect');

describe('Phaser.Physics.Arcade.Components.OverlapRect', function ()
{
    var world;

    function makeWorld (options)
    {
        options = options || {};

        return {
            treeMinMax: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
            useTree: options.useTree !== undefined ? options.useTree : true,
            bodies: options.bodies || new Set(),
            tree: {
                search: options.treeSearch || function () { return []; }
            },
            staticTree: {
                search: options.staticTreeSearch || function () { return []; }
            },
            intersects: options.intersects || function () { return false; }
        };
    }

    beforeEach(function ()
    {
        world = makeWorld();
    });

    it('should return an empty array when no bodies are found', function ()
    {
        var result = OverlapRect(world, 0, 0, 100, 100);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should default includeDynamic to true', function ()
    {
        var searched = false;

        world = makeWorld({
            useTree: true,
            treeSearch: function () { searched = true; return []; }
        });

        OverlapRect(world, 0, 0, 100, 100);

        expect(searched).toBe(true);
    });

    it('should default includeStatic to false', function ()
    {
        var searched = false;

        world = makeWorld({
            staticTreeSearch: function () { searched = true; return []; }
        });

        OverlapRect(world, 0, 0, 100, 100);

        expect(searched).toBe(false);
    });

    it('should set treeMinMax based on x, y, width, height', function ()
    {
        OverlapRect(world, 10, 20, 200, 150);

        expect(world.treeMinMax.minX).toBe(10);
        expect(world.treeMinMax.minY).toBe(20);
        expect(world.treeMinMax.maxX).toBe(210);
        expect(world.treeMinMax.maxY).toBe(170);
    });

    it('should query the dynamic tree when useTree is true and includeDynamic is true', function ()
    {
        var body1 = { id: 'dynamic1' };
        var body2 = { id: 'dynamic2' };

        world = makeWorld({
            useTree: true,
            treeSearch: function () { return [ body1, body2 ]; }
        });

        var result = OverlapRect(world, 0, 0, 100, 100, true, false);

        expect(result).toContain(body1);
        expect(result).toContain(body2);
    });

    it('should query the static tree when includeStatic is true', function ()
    {
        var staticBody = { id: 'static1' };

        world = makeWorld({
            staticTreeSearch: function () { return [ staticBody ]; }
        });

        var result = OverlapRect(world, 0, 0, 100, 100, false, true);

        expect(result).toContain(staticBody);
    });

    it('should return combined static and dynamic bodies', function ()
    {
        var dynamicBody = { id: 'dynamic1' };
        var staticBody = { id: 'static1' };

        world = makeWorld({
            useTree: true,
            treeSearch: function () { return [ dynamicBody ]; },
            staticTreeSearch: function () { return [ staticBody ]; }
        });

        var result = OverlapRect(world, 0, 0, 100, 100, true, true);

        expect(result.length).toBe(2);
        expect(result).toContain(dynamicBody);
        expect(result).toContain(staticBody);
    });

    it('should return static bodies first, then dynamic bodies in the result', function ()
    {
        var dynamicBody = { id: 'dynamic1' };
        var staticBody = { id: 'static1' };

        world = makeWorld({
            useTree: true,
            treeSearch: function () { return [ dynamicBody ]; },
            staticTreeSearch: function () { return [ staticBody ]; }
        });

        var result = OverlapRect(world, 0, 0, 100, 100, true, true);

        expect(result[0]).toBe(staticBody);
        expect(result[1]).toBe(dynamicBody);
    });

    it('should not query either tree when both includeDynamic and includeStatic are false', function ()
    {
        var dynamicSearched = false;
        var staticSearched = false;

        world = makeWorld({
            useTree: true,
            treeSearch: function () { dynamicSearched = true; return []; },
            staticTreeSearch: function () { staticSearched = true; return []; }
        });

        var result = OverlapRect(world, 0, 0, 100, 100, false, false);

        expect(dynamicSearched).toBe(false);
        expect(staticSearched).toBe(false);
        expect(result.length).toBe(0);
    });

    it('should use manual intersection when useTree is false', function ()
    {
        var bodyA = { id: 'bodyA' };
        var bodyB = { id: 'bodyB' };

        var intersectsCalled = [];

        world = makeWorld({
            useTree: false,
            bodies: new Set([ bodyA, bodyB ]),
            intersects: function (target, fakeBody)
            {
                intersectsCalled.push(target);
                return target === bodyA;
            }
        });

        var result = OverlapRect(world, 0, 0, 100, 100, true, false);

        expect(intersectsCalled.length).toBe(2);
        expect(result).toContain(bodyA);
        expect(result).not.toContain(bodyB);
    });

    it('should build the correct fakeBody when useTree is false', function ()
    {
        var capturedFakeBody = null;

        world = makeWorld({
            useTree: false,
            bodies: new Set([ { id: 'body1' } ]),
            intersects: function (target, fakeBody)
            {
                capturedFakeBody = fakeBody;
                return false;
            }
        });

        OverlapRect(world, 50, 75, 200, 100, true, false);

        expect(capturedFakeBody).not.toBeNull();
        expect(capturedFakeBody.position.x).toBe(50);
        expect(capturedFakeBody.position.y).toBe(75);
        expect(capturedFakeBody.left).toBe(50);
        expect(capturedFakeBody.top).toBe(75);
        expect(capturedFakeBody.right).toBe(250);
        expect(capturedFakeBody.bottom).toBe(175);
        expect(capturedFakeBody.isCircle).toBe(false);
    });

    it('should not use manual intersection when useTree is false and includeDynamic is false', function ()
    {
        var intersectsCalled = false;

        world = makeWorld({
            useTree: false,
            bodies: new Set([ { id: 'body1' } ]),
            intersects: function () { intersectsCalled = true; return true; }
        });

        OverlapRect(world, 0, 0, 100, 100, false, false);

        expect(intersectsCalled).toBe(false);
    });

    it('should handle zero width and height', function ()
    {
        OverlapRect(world, 50, 50, 0, 0);

        expect(world.treeMinMax.minX).toBe(50);
        expect(world.treeMinMax.minY).toBe(50);
        expect(world.treeMinMax.maxX).toBe(50);
        expect(world.treeMinMax.maxY).toBe(50);
    });

    it('should handle negative coordinates', function ()
    {
        OverlapRect(world, -100, -200, 50, 50);

        expect(world.treeMinMax.minX).toBe(-100);
        expect(world.treeMinMax.minY).toBe(-200);
        expect(world.treeMinMax.maxX).toBe(-50);
        expect(world.treeMinMax.maxY).toBe(-150);
    });

    it('should handle floating point coordinates', function ()
    {
        OverlapRect(world, 10.5, 20.5, 100.5, 200.5);

        expect(world.treeMinMax.minX).toBeCloseTo(10.5);
        expect(world.treeMinMax.minY).toBeCloseTo(20.5);
        expect(world.treeMinMax.maxX).toBeCloseTo(111.0);
        expect(world.treeMinMax.maxY).toBeCloseTo(221.0);
    });

    it('should return an array even when only static bodies are found', function ()
    {
        var staticBody = { id: 'static1' };

        world = makeWorld({
            staticTreeSearch: function () { return [ staticBody ]; }
        });

        var result = OverlapRect(world, 0, 0, 100, 100, false, true);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(staticBody);
    });

    it('should handle an empty bodies Set when useTree is false', function ()
    {
        world = makeWorld({
            useTree: false,
            bodies: new Set(),
            intersects: function () { return true; }
        });

        var result = OverlapRect(world, 0, 0, 100, 100, true, false);

        expect(result.length).toBe(0);
    });

    it('should pass the correct minMax object to tree.search', function ()
    {
        var passedMinMax = null;

        world = makeWorld({
            useTree: true,
            treeSearch: function (mm) { passedMinMax = mm; return []; }
        });

        OverlapRect(world, 5, 10, 300, 400);

        expect(passedMinMax).not.toBeNull();
        expect(passedMinMax.minX).toBe(5);
        expect(passedMinMax.minY).toBe(10);
        expect(passedMinMax.maxX).toBe(305);
        expect(passedMinMax.maxY).toBe(410);
    });

    it('should pass the correct minMax object to staticTree.search', function ()
    {
        var passedMinMax = null;

        world = makeWorld({
            staticTreeSearch: function (mm) { passedMinMax = mm; return []; }
        });

        OverlapRect(world, 5, 10, 300, 400, false, true);

        expect(passedMinMax).not.toBeNull();
        expect(passedMinMax.minX).toBe(5);
        expect(passedMinMax.minY).toBe(10);
        expect(passedMinMax.maxX).toBe(305);
        expect(passedMinMax.maxY).toBe(410);
    });
});
