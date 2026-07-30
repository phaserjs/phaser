var CircumCircle = require('../../../src/geom/triangle/CircumCircle');
var Circle = require('../../../src/geom/circle/Circle');

describe('Phaser.Geom.Triangle.CircumCircle', function ()
{
    var triangle;

    beforeEach(function ()
    {
        triangle = { x1: 0, y1: 0, x2: 4, y2: 0, x3: 0, y3: 3 };
    });

    it('should return a Circle instance when no out is provided', function ()
    {
        var result = CircumCircle(triangle);

        expect(result).toBeInstanceOf(Circle);
    });

    it('should return the provided out Circle', function ()
    {
        var out = new Circle();
        var result = CircumCircle(triangle, out);

        expect(result).toBe(out);
    });

    it('should compute the circumcircle of a right triangle', function ()
    {
        // Right triangle with vertices (0,0), (4,0), (0,3)
        // The circumcenter of a right triangle is the midpoint of the hypotenuse
        // Hypotenuse midpoint: (2, 1.5), radius = sqrt(4 + 2.25) = sqrt(6.25) = 2.5
        var result = CircumCircle(triangle);

        expect(result.x).toBeCloseTo(2, 5);
        expect(result.y).toBeCloseTo(1.5, 5);
        expect(result.radius).toBeCloseTo(2.5, 5);
    });

    it('should compute the circumcircle of an equilateral triangle', function ()
    {
        // Equilateral triangle with side length 2
        var eq = {
            x1: 0, y1: 0,
            x2: 2, y2: 0,
            x3: 1, y3: Math.sqrt(3)
        };

        var result = CircumCircle(eq);

        // Circumcenter at (1, 1/sqrt(3)), radius = 2/sqrt(3)
        expect(result.x).toBeCloseTo(1, 5);
        expect(result.y).toBeCloseTo(1 / Math.sqrt(3), 5);
        expect(result.radius).toBeCloseTo(2 / Math.sqrt(3), 5);
    });

    it('should compute the circumcircle of an isoceles triangle', function ()
    {
        var iso = { x1: -3, y1: 0, x2: 3, y2: 0, x3: 0, y3: 4 };
        var result = CircumCircle(iso);

        // All three vertices should be equidistant from the circumcenter
        var d1 = Math.sqrt(Math.pow(result.x - iso.x1, 2) + Math.pow(result.y - iso.y1, 2));
        var d2 = Math.sqrt(Math.pow(result.x - iso.x2, 2) + Math.pow(result.y - iso.y2, 2));
        var d3 = Math.sqrt(Math.pow(result.x - iso.x3, 2) + Math.pow(result.y - iso.y3, 2));

        expect(d1).toBeCloseTo(result.radius, 5);
        expect(d2).toBeCloseTo(result.radius, 5);
        expect(d3).toBeCloseTo(result.radius, 5);
    });

    it('should handle collinear points by using midpoint of extremes', function ()
    {
        // Collinear points along x-axis
        var collinear = { x1: 0, y1: 0, x2: 4, y2: 0, x3: 8, y3: 0 };
        var result = CircumCircle(collinear);

        // midX = 0 + (8-0)*0.5 = 4, midY = 0
        expect(result.x).toBeCloseTo(4, 5);
        expect(result.y).toBeCloseTo(0, 5);
        expect(result.radius).toBeCloseTo(4, 5);
    });

    it('should handle collinear points along y-axis', function ()
    {
        var collinear = { x1: 0, y1: 0, x2: 0, y2: 6, x3: 0, y3: 3 };
        var result = CircumCircle(collinear);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(3, 5);
        expect(result.radius).toBeCloseTo(3, 5);
    });

    it('should handle a degenerate triangle where all points are the same', function ()
    {
        var degenerate = { x1: 5, y1: 5, x2: 5, y2: 5, x3: 5, y3: 5 };
        var result = CircumCircle(degenerate);

        expect(result.x).toBeCloseTo(5, 5);
        expect(result.y).toBeCloseTo(5, 5);
        expect(result.radius).toBeCloseTo(0, 5);
    });

    it('should place all three vertices on the circumcircle for a general triangle', function ()
    {
        var general = { x1: 1, y1: 2, x2: 7, y2: 4, x3: 3, y3: 8 };
        var result = CircumCircle(general);

        var d1 = Math.sqrt(Math.pow(result.x - general.x1, 2) + Math.pow(result.y - general.y1, 2));
        var d2 = Math.sqrt(Math.pow(result.x - general.x2, 2) + Math.pow(result.y - general.y2, 2));
        var d3 = Math.sqrt(Math.pow(result.x - general.x3, 2) + Math.pow(result.y - general.y3, 2));

        expect(d1).toBeCloseTo(result.radius, 5);
        expect(d2).toBeCloseTo(result.radius, 5);
        expect(d3).toBeCloseTo(result.radius, 5);
    });

    it('should handle triangles with negative coordinates', function ()
    {
        var neg = { x1: -5, y1: -5, x2: -1, y2: -5, x3: -3, y3: -2 };
        var result = CircumCircle(neg);

        var d1 = Math.sqrt(Math.pow(result.x - neg.x1, 2) + Math.pow(result.y - neg.y1, 2));
        var d2 = Math.sqrt(Math.pow(result.x - neg.x2, 2) + Math.pow(result.y - neg.y2, 2));
        var d3 = Math.sqrt(Math.pow(result.x - neg.x3, 2) + Math.pow(result.y - neg.y3, 2));

        expect(d1).toBeCloseTo(result.radius, 5);
        expect(d2).toBeCloseTo(result.radius, 5);
        expect(d3).toBeCloseTo(result.radius, 5);
    });

    it('should handle triangles with floating point coordinates', function ()
    {
        var flt = { x1: 0.5, y1: 0.5, x2: 3.5, y2: 0.5, x3: 2.0, y3: 2.5 };
        var result = CircumCircle(flt);

        var d1 = Math.sqrt(Math.pow(result.x - flt.x1, 2) + Math.pow(result.y - flt.y1, 2));
        var d2 = Math.sqrt(Math.pow(result.x - flt.x2, 2) + Math.pow(result.y - flt.y2, 2));
        var d3 = Math.sqrt(Math.pow(result.x - flt.x3, 2) + Math.pow(result.y - flt.y3, 2));

        expect(d1).toBeCloseTo(result.radius, 5);
        expect(d2).toBeCloseTo(result.radius, 5);
        expect(d3).toBeCloseTo(result.radius, 5);
    });

    it('should mutate the provided out Circle rather than creating a new one', function ()
    {
        var out = new Circle(99, 99, 99);
        CircumCircle(triangle, out);

        expect(out.x).not.toBeCloseTo(99, 0);
    });

    it('should return a circle with a positive radius', function ()
    {
        var result = CircumCircle(triangle);

        expect(result.radius).toBeGreaterThan(0);
    });
});
