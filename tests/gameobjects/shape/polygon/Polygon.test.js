var Polygon = require('../../../../src/gameobjects/shape/polygon/Polygon');

// Minimal mock scene: only what the constructor chain actually needs.
// - scene.sys.queueDepthSort is called by the GameObject constructor.
// - scene.sys.renderer = null causes initRenderNodes to exit early (no WebGL needed).
function createMockScene ()
{
    return {
        sys: {
            queueDepthSort: function () {},
            renderer: null
        }
    };
}

// A simple triangle expressed as a flat numeric array.
// Coords: (0,0), (100,0), (50,100)  →  width=100, height=100
var TRIANGLE_POINTS = [ 0, 0, 100, 0, 50, 100 ];

// A smaller square for setTo tests.
// Coords: (0,0), (40,0), (40,40), (0,40)  →  width=40, height=40
var SQUARE_POINTS = [ 0, 0, 40, 0, 40, 40, 0, 40 ];

describe('Polygon', function ()
{
    var scene;

    beforeEach(function ()
    {
        scene = createMockScene();
    });

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    describe('constructor', function ()
    {
        it('should create a Polygon with type "Polygon"', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            expect(poly.type).toBe('Polygon');
        });

        it('should default x and y to 0 when not provided', function ()
        {
            var poly = new Polygon(scene, undefined, undefined, TRIANGLE_POINTS);

            expect(poly.x).toBe(0);
            expect(poly.y).toBe(0);
        });

        it('should set x and y to the provided values', function ()
        {
            var poly = new Polygon(scene, 200, 300, TRIANGLE_POINTS);

            expect(poly.x).toBe(200);
            expect(poly.y).toBe(300);
        });

        it('should create a GeomPolygon on geom with the supplied points', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            expect(poly.geom).toBeDefined();
            expect(Array.isArray(poly.geom.points)).toBe(true);
            expect(poly.geom.points.length).toBe(3);
        });

        it('should calculate width and height from the bounding box of the points', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            expect(poly.width).toBe(100);
            expect(poly.height).toBe(100);
        });

        it('should populate pathData after construction', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            // updateData pushes x,y for each point plus a closing x,y (points[0])
            // so 3 points → 3*2 + 2 = 8 values
            expect(Array.isArray(poly.pathData)).toBe(true);
            expect(poly.pathData.length).toBe(8);
        });

        it('should populate pathIndexes after construction', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            expect(Array.isArray(poly.pathIndexes)).toBe(true);
            expect(poly.pathIndexes.length).toBeGreaterThan(0);
        });

        it('should set isFilled to true when fillColor is provided', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS, 0xff0000, 1);

            expect(poly.isFilled).toBe(true);
        });

        it('should set fillColor when provided', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS, 0xff0000, 1);

            expect(poly.fillColor).toBe(0xff0000);
        });

        it('should set fillAlpha when provided', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS, 0xff0000, 0.5);

            expect(poly.fillAlpha).toBe(0.5);
        });

        it('should leave isFilled as false when no fillColor is provided', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            expect(poly.isFilled).toBe(false);
        });

        it('should accept points as a space-separated string', function ()
        {
            var poly = new Polygon(scene, 0, 0, '0 0 100 0 50 100');

            expect(poly.geom.points.length).toBe(3);
            expect(poly.width).toBe(100);
            expect(poly.height).toBe(100);
        });

        it('should accept points as an array of objects with x/y properties', function ()
        {
            var pts = [ { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 50, y: 100 } ];
            var poly = new Polygon(scene, 0, 0, pts);

            expect(poly.geom.points.length).toBe(3);
        });

        it('should accept points as an array of [x, y] pairs', function ()
        {
            var pts = [ [ 0, 0 ], [ 100, 0 ], [ 50, 100 ] ];
            var poly = new Polygon(scene, 0, 0, pts);

            expect(poly.geom.points.length).toBe(3);
        });

        it('should store a reference to the scene', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            expect(poly.scene).toBe(scene);
        });
    });

    // -------------------------------------------------------------------------
    // smooth
    // -------------------------------------------------------------------------

    describe('smooth', function ()
    {
        it('should return the Polygon instance for chaining', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);
            var result = poly.smooth();

            expect(result).toBe(poly);
        });

        it('should default iterations to 1 when not provided', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);
            var before = poly.geom.points.length;

            poly.smooth();

            // One smooth pass on a 3-point polygon inserts a midpoint between
            // each pair of adjacent vertices, so the count should increase.
            expect(poly.geom.points.length).toBeGreaterThan(before);
        });

        it('should increase the number of points after smoothing', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);
            var before = poly.geom.points.length;

            poly.smooth(1);

            expect(poly.geom.points.length).toBeGreaterThan(before);
        });

        it('should apply smoothing multiple times when iterations > 1', function ()
        {
            var poly1 = new Polygon(scene, 0, 0, TRIANGLE_POINTS);
            var poly2 = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            poly1.smooth(1);
            poly2.smooth(2);

            // More iterations → more points
            expect(poly2.geom.points.length).toBeGreaterThan(poly1.geom.points.length);
        });

        it('should do nothing when iterations is 0', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);
            var before = poly.geom.points.length;

            poly.smooth(0);

            expect(poly.geom.points.length).toBe(before);
        });

        it('should update pathData after smoothing', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);
            var beforeLen = poly.pathData.length;

            poly.smooth(1);

            // More points means a longer pathData array
            expect(poly.pathData.length).toBeGreaterThan(beforeLen);
        });

        it('should be chainable with setTo', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            var result = poly.smooth(1);

            expect(result).toBe(poly);
        });
    });

    // -------------------------------------------------------------------------
    // setTo
    // -------------------------------------------------------------------------

    describe('setTo', function ()
    {
        it('should return the Polygon instance for chaining', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);
            var result = poly.setTo(SQUARE_POINTS);

            expect(result).toBe(poly);
        });

        it('should replace geom points with the new point set', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            poly.setTo(SQUARE_POINTS);

            expect(poly.geom.points.length).toBe(4);
        });

        it('should update width and height to match the new bounding box', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            poly.setTo(SQUARE_POINTS);

            expect(poly.width).toBe(40);
            expect(poly.height).toBe(40);
        });

        it('should update pathData to reflect the new points', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            poly.setTo(SQUARE_POINTS);

            // 4 points → 4*2 + 2 = 10 values in pathData
            expect(poly.pathData.length).toBe(10);
        });

        it('should update pathIndexes to reflect the new polygon', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            poly.setTo(SQUARE_POINTS);

            expect(poly.pathIndexes.length).toBeGreaterThan(0);
        });

        it('should accept a space-separated string of coordinates', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            poly.setTo('0 0 40 0 40 40 0 40');

            expect(poly.geom.points.length).toBe(4);
            expect(poly.width).toBe(40);
            expect(poly.height).toBe(40);
        });

        it('should accept an array of objects with x/y properties', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);
            var pts = [ { x: 0, y: 0 }, { x: 60, y: 0 }, { x: 30, y: 80 } ];

            poly.setTo(pts);

            expect(poly.geom.points.length).toBe(3);
            expect(poly.width).toBe(60);
            expect(poly.height).toBe(80);
        });

        it('should accept an array of [x, y] pair arrays', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);
            var pts = [ [ 0, 0 ], [ 50, 0 ], [ 25, 75 ] ];

            poly.setTo(pts);

            expect(poly.geom.points.length).toBe(3);
            expect(poly.width).toBe(50);
            expect(poly.height).toBe(75);
        });

        it('should overwrite previously smoothed points', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            poly.smooth(3);
            var smoothedCount = poly.geom.points.length;

            poly.setTo(TRIANGLE_POINTS);

            // Back to the original 3 points
            expect(poly.geom.points.length).toBe(3);
            expect(poly.geom.points.length).toBeLessThan(smoothedCount);
        });

        it('should allow chaining multiple setTo calls', function ()
        {
            var poly = new Polygon(scene, 0, 0, TRIANGLE_POINTS);

            poly.setTo(SQUARE_POINTS).setTo(TRIANGLE_POINTS);

            expect(poly.geom.points.length).toBe(3);
        });
    });
});
