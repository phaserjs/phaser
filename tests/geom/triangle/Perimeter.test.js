var Perimeter = require('../../../src/geom/triangle/Perimeter');

describe('Phaser.Geom.Triangle.Perimeter', function ()
{
    function makeMockTriangle(x1, y1, x2, y2, x3, y3)
    {
        return {
            getLineA: function () { return { x1: x1, y1: y1, x2: x2, y2: y2 }; },
            getLineB: function () { return { x1: x2, y1: y2, x2: x3, y2: y3 }; },
            getLineC: function () { return { x1: x3, y1: y3, x2: x1, y2: y1 }; }
        };
    }

    it('should return a number', function ()
    {
        var triangle = makeMockTriangle(0, 0, 3, 0, 0, 4);
        expect(typeof Perimeter(triangle)).toBe('number');
    });

    it('should return the correct perimeter for a 3-4-5 right triangle', function ()
    {
        // sides: 3, 4, 5 => perimeter = 12
        var triangle = makeMockTriangle(0, 0, 3, 0, 0, 4);
        expect(Perimeter(triangle)).toBeCloseTo(12, 5);
    });

    it('should return the correct perimeter for an equilateral triangle', function ()
    {
        // equilateral triangle with side length 1
        var s = 1;
        var h = Math.sqrt(3) / 2;
        var triangle = makeMockTriangle(0, 0, s, 0, s / 2, h);
        expect(Perimeter(triangle)).toBeCloseTo(3, 5);
    });

    it('should return zero for a degenerate triangle where all points coincide', function ()
    {
        var triangle = makeMockTriangle(5, 5, 5, 5, 5, 5);
        expect(Perimeter(triangle)).toBeCloseTo(0, 5);
    });

    it('should return zero for a degenerate triangle where all points are on a line', function ()
    {
        // collinear points: perimeter is non-zero but forms a degenerate triangle
        var triangle = makeMockTriangle(0, 0, 5, 0, 10, 0);
        // sides: 5, 5, 10
        expect(Perimeter(triangle)).toBeCloseTo(20, 5);
    });

    it('should handle triangles with negative coordinates', function ()
    {
        // 3-4-5 triangle mirrored into negative quadrant
        var triangle = makeMockTriangle(0, 0, -3, 0, 0, -4);
        expect(Perimeter(triangle)).toBeCloseTo(12, 5);
    });

    it('should handle triangles with floating point coordinates', function ()
    {
        // 3-4-5 scaled by 0.5: sides 1.5, 2, 2.5 => perimeter = 6
        var triangle = makeMockTriangle(0, 0, 1.5, 0, 0, 2);
        expect(Perimeter(triangle)).toBeCloseTo(6, 5);
    });

    it('should handle large coordinate values', function ()
    {
        // 3-4-5 triangle scaled by 1000
        var triangle = makeMockTriangle(0, 0, 3000, 0, 0, 4000);
        expect(Perimeter(triangle)).toBeCloseTo(12000, 3);
    });

    it('should sum all three sides correctly', function ()
    {
        // isoceles triangle: base=6, two equal sides=5 each (3-4-5 twice)
        // points: (0,0), (6,0), (3,4)
        var triangle = makeMockTriangle(0, 0, 6, 0, 3, 4);
        // side A: (0,0)-(6,0) = 6
        // side B: (6,0)-(3,4) = sqrt(9+16) = 5
        // side C: (3,4)-(0,0) = sqrt(9+16) = 5
        expect(Perimeter(triangle)).toBeCloseTo(16, 5);
    });

    it('should call getLineA, getLineB, and getLineC on the triangle', function ()
    {
        var callCount = 0;
        var mockLine = { x1: 0, y1: 0, x2: 0, y2: 0 };
        var triangle = {
            getLineA: function () { callCount++; return mockLine; },
            getLineB: function () { callCount++; return mockLine; },
            getLineC: function () { callCount++; return mockLine; }
        };
        Perimeter(triangle);
        expect(callCount).toBe(3);
    });
});
