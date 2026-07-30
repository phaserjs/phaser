var OverlapCirc = require('../../../../src/physics/arcade/components/OverlapCirc');

describe('Phaser.Physics.Arcade.Components.OverlapCirc', function ()
{
    function createMockWorld (dynamicBodies, staticBodies)
    {
        return {
            treeMinMax: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
            useTree: true,
            tree: {
                search: function () { return dynamicBodies || []; }
            },
            staticTree: {
                search: function () { return staticBodies || []; }
            },
            bodies: new Set(),
            intersects: function () { return false; }
        };
    }

    function makeRectBody (x, y, width, height)
    {
        return { isCircle: false, x: x, y: y, width: width, height: height };
    }

    function makeCircleBody (cx, cy, halfWidth)
    {
        return { isCircle: true, center: { x: cx, y: cy }, halfWidth: halfWidth };
    }

    it('should return an empty array when no bodies are found in the bounding rect', function ()
    {
        var world = createMockWorld([]);

        var result = OverlapCirc(world, 100, 100, 50);

        expect(result).toEqual([]);
    });

    it('should compute the bounding rect as (x-r, y-r, 2r, 2r) for OverlapRect', function ()
    {
        var world = createMockWorld([]);

        OverlapCirc(world, 100, 200, 50);

        // OverlapRect sets treeMinMax before searching
        expect(world.treeMinMax.minX).toBe(50);
        expect(world.treeMinMax.minY).toBe(150);
        expect(world.treeMinMax.maxX).toBe(150);
        expect(world.treeMinMax.maxY).toBe(250);
    });

    it('should include a rect body whose center is inside the circle', function ()
    {
        // Circle: center (100, 100), radius 50
        // Body centered at (100, 100), size 40x40 — fully inside circle
        var body = makeRectBody(80, 80, 40, 40);
        var world = createMockWorld([ body ]);

        var result = OverlapCirc(world, 100, 100, 50);

        expect(result.length).toBe(1);
        expect(result[0]).toBe(body);
    });

    it('should exclude a rect body that is in the bounding box but outside the circle', function ()
    {
        // Circle: center (100, 100), radius 50
        // Small body at (50, 50) — in the corner of the bounding square but outside the circle
        var body = makeRectBody(50, 50, 5, 5);
        var world = createMockWorld([ body ]);

        var result = OverlapCirc(world, 100, 100, 50);

        expect(result.length).toBe(0);
    });

    it('should include a circle body that overlaps the search area', function ()
    {
        // Search circle: center (100, 100), radius 50
        // Body circle: center (100, 100), halfWidth 30 — same center, overlaps fully
        var body = makeCircleBody(100, 100, 30);
        var world = createMockWorld([ body ]);

        var result = OverlapCirc(world, 100, 100, 50);

        expect(result.length).toBe(1);
        expect(result[0]).toBe(body);
    });

    it('should exclude a circle body that does not overlap the search area', function ()
    {
        // Search circle: center (100, 100), radius 50
        // Body circle: center (200, 200), halfWidth 10 — distance ~141, sum of radii 60
        var body = makeCircleBody(200, 200, 10);
        var world = createMockWorld([ body ]);

        var result = OverlapCirc(world, 100, 100, 50);

        expect(result.length).toBe(0);
    });

    it('should include a circle body that just touches the edge of the search area', function ()
    {
        // Search circle: center (0, 0), radius 50
        // Body circle: center (100, 0), halfWidth 50 — distance exactly 100, sum of radii 100
        var body = makeCircleBody(100, 0, 50);
        var world = createMockWorld([ body ]);

        var result = OverlapCirc(world, 0, 0, 50);

        expect(result.length).toBe(1);
        expect(result[0]).toBe(body);
    });

    it('should include a rect body that just touches the edge of the circle', function ()
    {
        // Search circle: center (0, 0), radius 50
        // Rect body: x=50, y=-5, width=10, height=10 — left edge at x=50, within circle radius
        var body = makeRectBody(50, -5, 10, 10);
        var world = createMockWorld([ body ]);

        var result = OverlapCirc(world, 0, 0, 50);

        expect(result.length).toBe(1);
        expect(result[0]).toBe(body);
    });

    it('should handle a mix of overlapping and non-overlapping bodies', function ()
    {
        // Search circle: center (100, 100), radius 50
        var overlappingRect = makeRectBody(80, 80, 40, 40);
        var nonOverlappingRect = makeRectBody(50, 50, 5, 5);
        var overlappingCirc = makeCircleBody(100, 100, 20);
        var nonOverlappingCirc = makeCircleBody(200, 200, 10);

        var world = createMockWorld([ overlappingRect, nonOverlappingRect, overlappingCirc, nonOverlappingCirc ]);

        var result = OverlapCirc(world, 100, 100, 50);

        expect(result.length).toBe(2);
        expect(result).toContain(overlappingRect);
        expect(result).toContain(overlappingCirc);
        expect(result).not.toContain(nonOverlappingRect);
        expect(result).not.toContain(nonOverlappingCirc);
    });

    it('should return an empty array when all bodies fail the circle intersection test', function ()
    {
        var body1 = makeRectBody(50, 50, 5, 5);
        var body2 = makeCircleBody(200, 200, 5);
        var world = createMockWorld([ body1, body2 ]);

        var result = OverlapCirc(world, 100, 100, 50);

        expect(result.length).toBe(0);
    });

    it('should return all bodies when all of them overlap', function ()
    {
        var body1 = makeRectBody(80, 80, 40, 40);
        var body2 = makeCircleBody(100, 100, 20);
        var world = createMockWorld([ body1, body2 ]);

        var result = OverlapCirc(world, 100, 100, 50);

        expect(result.length).toBe(2);
    });

    it('should handle zero radius', function ()
    {
        var world = createMockWorld([]);

        OverlapCirc(world, 100, 100, 0);

        expect(world.treeMinMax.minX).toBe(100);
        expect(world.treeMinMax.minY).toBe(100);
        expect(world.treeMinMax.maxX).toBe(100);
        expect(world.treeMinMax.maxY).toBe(100);
    });

    it('should handle negative coordinates for the search area', function ()
    {
        var world = createMockWorld([]);

        OverlapCirc(world, -50, -50, 30);

        expect(world.treeMinMax.minX).toBe(-80);
        expect(world.treeMinMax.minY).toBe(-80);
        expect(world.treeMinMax.maxX).toBe(-20);
        expect(world.treeMinMax.maxY).toBe(-20);
    });

    it('should include static bodies when includeStatic is true', function ()
    {
        var staticBody = makeRectBody(80, 80, 40, 40);
        var world = createMockWorld([], [ staticBody ]);

        var result = OverlapCirc(world, 100, 100, 50, false, true);

        expect(result.length).toBe(1);
        expect(result[0]).toBe(staticBody);
    });

    it('should exclude dynamic bodies when includeDynamic is false', function ()
    {
        var dynamicBody = makeRectBody(80, 80, 40, 40);
        var world = createMockWorld([ dynamicBody ]);

        var result = OverlapCirc(world, 100, 100, 50, false, false);

        expect(result.length).toBe(0);
    });

    it('should return a new array, not the same reference as the bodies from OverlapRect', function ()
    {
        var body = makeRectBody(80, 80, 40, 40);
        var capturedResult = null;
        var world = {
            treeMinMax: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
            useTree: true,
            tree: {
                search: function ()
                {
                    capturedResult = [ body ];

                    return capturedResult;
                }
            },
            staticTree: { search: function () { return []; } },
            bodies: new Set(),
            intersects: function () { return false; }
        };

        var result = OverlapCirc(world, 100, 100, 50);

        expect(result).not.toBe(capturedResult);
        expect(result[0]).toBe(body);
    });

    it('should use halfWidth as the radius for circle bodies', function ()
    {
        // Search circle: center (0, 0), radius 10
        // Body circle: center (19, 0), halfWidth 10 — distance 19, sum of radii 20 → overlaps
        var overlapping = makeCircleBody(19, 0, 10);
        // Body circle: center (21, 0), halfWidth 10 — distance 21, sum of radii 20 → no overlap
        var notOverlapping = makeCircleBody(21, 0, 10);

        var worldA = createMockWorld([ overlapping ]);
        var worldB = createMockWorld([ notOverlapping ]);

        expect(OverlapCirc(worldA, 0, 0, 10).length).toBe(1);
        expect(OverlapCirc(worldB, 0, 0, 10).length).toBe(0);
    });
});
