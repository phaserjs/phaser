var BuildFromPolygon = require('../../../src/geom/triangle/BuildFromPolygon');
var Triangle = require('../../../src/geom/triangle/Triangle');

describe('Phaser.Geom.Triangle.BuildFromPolygon', function ()
{
    it('should return an array of Triangle instances from a simple square', function ()
    {
        var data = [ 0, 0, 100, 0, 100, 100, 0, 100 ];
        var result = BuildFromPolygon(data);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        expect(result[0]).toBeInstanceOf(Triangle);
        expect(result[1]).toBeInstanceOf(Triangle);
    });

    it('should return an array with one Triangle from three vertices', function ()
    {
        var data = [ 0, 0, 100, 0, 50, 100 ];
        var result = BuildFromPolygon(data);

        expect(result.length).toBe(1);
        expect(result[0]).toBeInstanceOf(Triangle);
    });

    it('should use the provided out array', function ()
    {
        var data = [ 0, 0, 100, 0, 50, 100 ];
        var out = [];
        var result = BuildFromPolygon(data, null, 1, 1, out);

        expect(result).toBe(out);
        expect(out.length).toBe(1);
    });

    it('should apply scaleX to all x coordinates', function ()
    {
        // EarCut returns [1,2,0] for this input, so vertex order is (100,0),(50,100),(0,0)
        var data = [ 0, 0, 100, 0, 50, 100 ];
        var result = BuildFromPolygon(data, null, 2, 1);
        var tri = result[0];

        expect(tri.x1).toBeCloseTo(200);
        expect(tri.x2).toBeCloseTo(100);
        expect(tri.x3).toBeCloseTo(0);
    });

    it('should apply scaleY to all y coordinates', function ()
    {
        // EarCut returns [1,2,0] for this input, so vertex order is (100,0),(50,100),(0,0)
        var data = [ 0, 0, 100, 0, 50, 100 ];
        var result = BuildFromPolygon(data, null, 1, 3);
        var tri = result[0];

        expect(tri.y1).toBeCloseTo(0);
        expect(tri.y2).toBeCloseTo(300);
        expect(tri.y3).toBeCloseTo(0);
    });

    it('should apply both scaleX and scaleY', function ()
    {
        // EarCut returns [1,2,0] for this input, so vertex order is (100,0),(50,100),(0,0)
        var data = [ 0, 0, 100, 0, 50, 100 ];
        var result = BuildFromPolygon(data, null, 2, 4);
        var tri = result[0];

        expect(tri.x1).toBeCloseTo(200);
        expect(tri.y1).toBeCloseTo(0);
        expect(tri.x2).toBeCloseTo(100);
        expect(tri.y2).toBeCloseTo(400);
        expect(tri.x3).toBeCloseTo(0);
        expect(tri.y3).toBeCloseTo(0);
    });

    it('should default scaleX and scaleY to 1 when not provided', function ()
    {
        // EarCut returns [1,2,0] for this input, so vertex order is (100,0),(50,100),(0,0)
        var data = [ 0, 0, 100, 0, 50, 100 ];
        var result = BuildFromPolygon(data);
        var tri = result[0];

        expect(tri.x1).toBeCloseTo(100);
        expect(tri.y1).toBeCloseTo(0);
        expect(tri.x2).toBeCloseTo(50);
        expect(tri.y2).toBeCloseTo(100);
        expect(tri.x3).toBeCloseTo(0);
        expect(tri.y3).toBeCloseTo(0);
    });

    it('should default holes to null when not provided', function ()
    {
        var data = [ 0, 0, 100, 0, 100, 100, 0, 100 ];
        var result = BuildFromPolygon(data);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should return an empty array for empty data', function ()
    {
        var data = [];
        var result = BuildFromPolygon(data);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should work with floating point vertex data', function ()
    {
        var data = [ 0.5, 0.5, 10.5, 0.5, 5.5, 10.5 ];
        var result = BuildFromPolygon(data);

        expect(result.length).toBe(1);
        expect(result[0]).toBeInstanceOf(Triangle);
        // EarCut returns [1,2,0] so first vertex is index 1: (10.5, 0.5)
        expect(result[0].x1).toBeCloseTo(10.5);
        expect(result[0].y1).toBeCloseTo(0.5);
    });

    it('should work with negative vertex coordinates', function ()
    {
        var data = [ -50, -50, 50, -50, 0, 50 ];
        var result = BuildFromPolygon(data, null, 1, 1);

        expect(result.length).toBe(1);
        var tri = result[0];
        // EarCut returns [1,2,0] so first vertex is index 1: (50, -50)
        expect(tri.x1).toBeCloseTo(50);
        expect(tri.y1).toBeCloseTo(-50);
    });

    it('should apply fractional scale factors', function ()
    {
        var data = [ 0, 0, 100, 0, 50, 100 ];
        var result = BuildFromPolygon(data, null, 0.5, 0.5);
        var tri = result[0];

        // EarCut returns [1,2,0]: x1=100*0.5=50, x2=50*0.5=25, y2=100*0.5=50
        expect(tri.x1).toBeCloseTo(50);
        expect(tri.y2).toBeCloseTo(50);
    });

    it('should append to an existing out array', function ()
    {
        var data = [ 0, 0, 100, 0, 50, 100 ];
        var existing = new Triangle(0, 0, 1, 0, 0, 1);
        var out = [ existing ];
        BuildFromPolygon(data, null, 1, 1, out);

        expect(out.length).toBe(2);
        expect(out[0]).toBe(existing);
        expect(out[1]).toBeInstanceOf(Triangle);
    });

    it('should decompose a pentagon into triangles', function ()
    {
        var data = [ 0, -50, 47, -15, 29, 40, -29, 40, -47, -15 ];
        var result = BuildFromPolygon(data);

        expect(result.length).toBe(3);
        result.forEach(function (tri)
        {
            expect(tri).toBeInstanceOf(Triangle);
        });
    });

    it('should return the out array reference', function ()
    {
        var data = [ 0, 0, 100, 0, 50, 100 ];
        var out = [];
        var result = BuildFromPolygon(data, null, 1, 1, out);

        expect(result).toBe(out);
    });
});
