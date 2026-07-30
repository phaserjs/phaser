var RandomOutside = require('../../../src/geom/rectangle/RandomOutside');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Rectangle.RandomOutside', function ()
{
    // Helper to create a plain rectangle mock with computed properties
    function makeRect (x, y, width, height)
    {
        return {
            x: x,
            y: y,
            width: width,
            height: height,
            left: x,
            top: y,
            right: x + width,
            bottom: y + height
        };
    }

    var outer;
    var inner;

    beforeEach(function ()
    {
        // outer: 0,0 -> 200,200  inner: 50,50 -> 150,150 (strictly contained)
        outer = makeRect(0, 0, 200, 200);
        inner = makeRect(50, 50, 100, 100);
    });

    it('should return a Vector2 when no out parameter is provided', function ()
    {
        var result = RandomOutside(outer, inner);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should use the provided out object and return it', function ()
    {
        var out = new Vector2();
        var result = RandomOutside(outer, inner, out);

        expect(result).toBe(out);
    });

    it('should return out unchanged when inner is not contained in outer', function ()
    {
        var notContained = makeRect(-10, -10, 100, 100); // extends outside outer
        var out = new Vector2(99, 88);
        var result = RandomOutside(outer, notContained, out);

        expect(result.x).toBe(99);
        expect(result.y).toBe(88);
    });

    it('should return out unchanged when inner equals outer (not strictly contained)', function ()
    {
        var sameAsOuter = makeRect(0, 0, 200, 200);
        var out = new Vector2(42, 42);
        var result = RandomOutside(outer, sameAsOuter, out);

        expect(result.x).toBe(42);
        expect(result.y).toBe(42);
    });

    it('should return out unchanged when inner is larger than outer', function ()
    {
        var larger = makeRect(-10, -10, 300, 300);
        var out = new Vector2(7, 13);
        var result = RandomOutside(outer, larger, out);

        expect(result.x).toBe(7);
        expect(result.y).toBe(13);
    });

    it('should return out unchanged when inner touches outer edge', function ()
    {
        // inner left edge == outer left edge — not strictly contained
        var touchingLeft = makeRect(0, 50, 100, 100);
        var out = new Vector2(5, 5);
        var result = RandomOutside(outer, touchingLeft, out);

        expect(result.x).toBe(5);
        expect(result.y).toBe(5);
    });

    it('should return a point within outer bounds when inner is contained', function ()
    {
        var iterations = 500;

        for (var i = 0; i < iterations; i++)
        {
            var out = new Vector2();
            RandomOutside(outer, inner, out);

            expect(out.x).toBeGreaterThanOrEqual(outer.x);
            expect(out.x).toBeLessThanOrEqual(outer.right);
            expect(out.y).toBeGreaterThanOrEqual(outer.y);
            expect(out.y).toBeLessThanOrEqual(outer.bottom);
        }
    });

    it('should return a point outside of inner when inner is contained', function ()
    {
        var iterations = 500;

        for (var i = 0; i < iterations; i++)
        {
            var out = new Vector2();
            RandomOutside(outer, inner, out);

            var insideInner = (
                out.x >= inner.x && out.x <= inner.right &&
                out.y >= inner.y && out.y <= inner.bottom
            );

            expect(insideInner).toBe(false);
        }
    });

    it('should produce points from all four regions over many iterations', function ()
    {
        var topCount = 0;
        var bottomCount = 0;
        var leftCount = 0;
        var rightCount = 0;
        var iterations = 2000;

        for (var i = 0; i < iterations; i++)
        {
            var out = new Vector2();
            RandomOutside(outer, inner, out);

            if (out.y < inner.y) { topCount++; }
            if (out.y > inner.bottom) { bottomCount++; }
            if (out.x < inner.x) { leftCount++; }
            if (out.x > inner.right) { rightCount++; }
        }

        // With 2000 iterations and 4 equal quadrants, each should appear at least some times
        expect(topCount).toBeGreaterThan(0);
        expect(bottomCount).toBeGreaterThan(0);
        expect(leftCount).toBeGreaterThan(0);
        expect(rightCount).toBeGreaterThan(0);
    });

    it('should work with a non-centred inner rectangle', function ()
    {
        var asymOuter = makeRect(0, 0, 400, 300);
        var asymInner = makeRect(10, 10, 50, 50); // small inner near top-left corner
        var iterations = 200;

        for (var i = 0; i < iterations; i++)
        {
            var out = new Vector2();
            RandomOutside(asymOuter, asymInner, out);

            expect(out.x).toBeGreaterThanOrEqual(asymOuter.x);
            expect(out.x).toBeLessThanOrEqual(asymOuter.right);
            expect(out.y).toBeGreaterThanOrEqual(asymOuter.y);
            expect(out.y).toBeLessThanOrEqual(asymOuter.bottom);
        }
    });

    it('should create a fresh Vector2 with default position 0,0 when out is not provided and inner is not contained', function ()
    {
        var notContained = makeRect(-100, -100, 50, 50);
        var result = RandomOutside(outer, notContained);

        expect(result).toBeInstanceOf(Vector2);
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should handle a very thin inner rectangle (tall strip)', function ()
    {
        var tallStrip = makeRect(90, 10, 20, 180); // thin vertical strip in centre
        var iterations = 200;

        for (var i = 0; i < iterations; i++)
        {
            var out = new Vector2();
            RandomOutside(outer, tallStrip, out);

            expect(out.x).toBeGreaterThanOrEqual(outer.x);
            expect(out.x).toBeLessThanOrEqual(outer.right);
            expect(out.y).toBeGreaterThanOrEqual(outer.y);
            expect(out.y).toBeLessThanOrEqual(outer.bottom);
        }
    });

    it('should handle a very thin inner rectangle (wide strip)', function ()
    {
        var wideStrip = makeRect(10, 90, 180, 20); // thin horizontal strip in centre
        var iterations = 200;

        for (var i = 0; i < iterations; i++)
        {
            var out = new Vector2();
            RandomOutside(outer, wideStrip, out);

            expect(out.x).toBeGreaterThanOrEqual(outer.x);
            expect(out.x).toBeLessThanOrEqual(outer.right);
            expect(out.y).toBeGreaterThanOrEqual(outer.y);
            expect(out.y).toBeLessThanOrEqual(outer.bottom);
        }
    });

    it('should work with floating point rectangle coordinates', function ()
    {
        var floatOuter = makeRect(0.5, 0.5, 100.5, 100.5);
        var floatInner = makeRect(10.25, 10.25, 50.5, 50.5);
        var iterations = 200;

        for (var i = 0; i < iterations; i++)
        {
            var out = new Vector2();
            RandomOutside(floatOuter, floatInner, out);

            expect(out.x).toBeGreaterThanOrEqual(floatOuter.x);
            expect(out.x).toBeLessThanOrEqual(floatOuter.right);
            expect(out.y).toBeGreaterThanOrEqual(floatOuter.y);
            expect(out.y).toBeLessThanOrEqual(floatOuter.bottom);
        }
    });

    it('should work with negative coordinate rectangles', function ()
    {
        var negOuter = makeRect(-200, -200, 400, 400);
        var negInner = makeRect(-50, -50, 100, 100);
        var iterations = 200;

        for (var i = 0; i < iterations; i++)
        {
            var out = new Vector2();
            RandomOutside(negOuter, negInner, out);

            expect(out.x).toBeGreaterThanOrEqual(negOuter.x);
            expect(out.x).toBeLessThanOrEqual(negOuter.right);
            expect(out.y).toBeGreaterThanOrEqual(negOuter.y);
            expect(out.y).toBeLessThanOrEqual(negOuter.bottom);

            var insideInner = (
                out.x >= negInner.x && out.x <= negInner.right &&
                out.y >= negInner.y && out.y <= negInner.bottom
            );

            expect(insideInner).toBe(false);
        }
    });
});
