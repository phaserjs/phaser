var GetPoints = require('../../../src/geom/triangle/GetPoints');

// 3-4-5 right triangle: A=(0,0), B=(4,0), C=(0,3)
// LineA: (0,0)->(4,0), length=4
// LineB: (4,0)->(0,3), length=5
// LineC: (0,3)->(0,0), length=3
// Perimeter = 12
function makeMockTriangle ()
{
    return {
        getLineA: function () { return { x1: 0, y1: 0, x2: 4, y2: 0 }; },
        getLineB: function () { return { x1: 4, y1: 0, x2: 0, y2: 3 }; },
        getLineC: function () { return { x1: 0, y1: 3, x2: 0, y2: 0 }; }
    };
}

// Equilateral-ish triangle with integer side lengths for easy reasoning
// A=(0,0), B=(6,0), C=(6,0): degenerate — avoid.
// Use a simple 3-4-5 triangle (perimeter=12) as above.

describe('Phaser.Geom.Triangle.GetPoints', function ()
{
    it('should return an empty array when quantity is 0 and stepRate is 0', function ()
    {
        var tri = makeMockTriangle();
        var result = GetPoints(tri, 0, 0);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when quantity is 0 and stepRate is falsy', function ()
    {
        var tri = makeMockTriangle();
        var result = GetPoints(tri, 0, 0);

        expect(result.length).toBe(0);
    });

    it('should return the correct number of points when quantity is specified', function ()
    {
        var tri = makeMockTriangle();
        var result = GetPoints(tri, 6, 0);

        expect(result.length).toBe(6);
    });

    it('should return one point when quantity is 1', function ()
    {
        var tri = makeMockTriangle();
        var result = GetPoints(tri, 1, 0);

        expect(result.length).toBe(1);
    });

    it('should place the first point at the start of line A when quantity is 1', function ()
    {
        var tri = makeMockTriangle();
        var result = GetPoints(tri, 1, 0);

        // i=0: p = 12 * (0/1) = 0, on line1, localPos=0, x=0, y=0
        expect(result[0].x).toBeCloseTo(0);
        expect(result[0].y).toBeCloseTo(0);
    });

    it('should return Vector2-like objects with x and y properties', function ()
    {
        var tri = makeMockTriangle();
        var result = GetPoints(tri, 4, 0);

        for (var i = 0; i < result.length; i++)
        {
            expect(typeof result[i].x).toBe('number');
            expect(typeof result[i].y).toBe('number');
        }
    });

    it('should distribute 12 points evenly across a 3-4-5 triangle', function ()
    {
        var tri = makeMockTriangle();
        // Perimeter=12, quantity=12 => step=1 unit apart
        var result = GetPoints(tri, 12, 0);

        expect(result.length).toBe(12);

        // i=0: p=0, line1, localPos=0/4=0, (0,0)
        expect(result[0].x).toBeCloseTo(0);
        expect(result[0].y).toBeCloseTo(0);

        // i=1: p=1, line1, localPos=1/4=0.25, (1,0)
        expect(result[1].x).toBeCloseTo(1);
        expect(result[1].y).toBeCloseTo(0);

        // i=2: p=2, line1, localPos=2/4=0.5, (2,0)
        expect(result[2].x).toBeCloseTo(2);
        expect(result[2].y).toBeCloseTo(0);

        // i=3: p=3, line1, localPos=3/4=0.75, (3,0)
        expect(result[3].x).toBeCloseTo(3);
        expect(result[3].y).toBeCloseTo(0);

        // i=4: p=4, NOT < 4 and NOT > 9, line2, p-=4=0, localPos=0, (4,0)
        expect(result[4].x).toBeCloseTo(4);
        expect(result[4].y).toBeCloseTo(0);

        // i=9: p=9, NOT < 4 and NOT > 9, line2, p-=4=5, localPos=1, (0,3)
        expect(result[9].x).toBeCloseTo(0);
        expect(result[9].y).toBeCloseTo(3);

        // i=10: p=10, > 9, line3, p-=9=1, localPos=1/3, x=0, y=3+(0-3)*(1/3)=2
        expect(result[10].x).toBeCloseTo(0);
        expect(result[10].y).toBeCloseTo(2);

        // i=11: p=11, > 9, line3, p-=9=2, localPos=2/3, x=0, y=3+(0-3)*(2/3)=1
        expect(result[11].x).toBeCloseTo(0);
        expect(result[11].y).toBeCloseTo(1);
    });

    it('should use stepRate to determine quantity when quantity is 0', function ()
    {
        var tri = makeMockTriangle();
        // perimeter=12, stepRate=1 => quantity=12
        var result = GetPoints(tri, 0, 1);

        expect(result.length).toBe(12);
    });

    it('should use stepRate=2 to produce 6 points on a perimeter-12 triangle', function ()
    {
        var tri = makeMockTriangle();
        var result = GetPoints(tri, 0, 2);

        expect(result.length).toBe(6);
    });

    it('should use stepRate=4 to produce 3 points on a perimeter-12 triangle', function ()
    {
        var tri = makeMockTriangle();
        var result = GetPoints(tri, 0, 4);

        expect(result.length).toBe(3);
    });

    it('should ignore stepRate when quantity is non-zero', function ()
    {
        var tri = makeMockTriangle();
        var result = GetPoints(tri, 5, 1);

        expect(result.length).toBe(5);
    });

    it('should append to an existing out array', function ()
    {
        var tri = makeMockTriangle();
        var out = [];
        var returned = GetPoints(tri, 3, 0, out);

        expect(returned).toBe(out);
        expect(out.length).toBe(3);
    });

    it('should return the same array reference that was passed in', function ()
    {
        var tri = makeMockTriangle();
        var out = [];
        var result = GetPoints(tri, 4, 0, out);

        expect(result).toBe(out);
    });

    it('should append points to a pre-populated out array', function ()
    {
        var tri = makeMockTriangle();
        var out = [ { x: 99, y: 99 } ];
        GetPoints(tri, 3, 0, out);

        expect(out.length).toBe(4);
        expect(out[0].x).toBe(99);
    });

    it('should create a new array when out is not provided', function ()
    {
        var tri = makeMockTriangle();
        var result = GetPoints(tri, 3, 0);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(3);
    });

    it('should place points on line A for positions within the first edge', function ()
    {
        var tri = makeMockTriangle();
        // With quantity=4, step=3 units: p values = 0, 3, 6, 9
        // i=0: p=0, line1, (0,0)
        // i=1: p=3, line1, localPos=3/4=0.75, (3,0)
        var result = GetPoints(tri, 4, 0);

        expect(result[0].y).toBeCloseTo(0); // on line A (y=0)
        expect(result[1].y).toBeCloseTo(0); // still on line A
    });

    it('should place points on line B for positions in the middle edge range', function ()
    {
        var tri = makeMockTriangle();
        // i=5 with quantity=12: p=5, line2, p-=4=1, localPos=0.2
        // x=4+(-4)*0.2=3.2, y=0+(3)*0.2=0.6
        var result = GetPoints(tri, 12, 0);

        expect(result[5].x).toBeCloseTo(3.2);
        expect(result[5].y).toBeCloseTo(0.6);
    });

    it('should place points on line C for positions beyond line A + B lengths', function ()
    {
        var tri = makeMockTriangle();
        // i=10 with quantity=12: p=10 > 9, line3, p-=9=1, localPos=1/3
        // x=0+(0-0)*(1/3)=0, y=3+(0-3)*(1/3)=2
        var result = GetPoints(tri, 12, 0);

        expect(result[10].x).toBeCloseTo(0);
        expect(result[10].y).toBeCloseTo(2);
    });

    it('should work with a degenerate triangle where all points are the same', function ()
    {
        var degenerateTri = {
            getLineA: function () { return { x1: 5, y1: 5, x2: 5, y2: 5 }; },
            getLineB: function () { return { x1: 5, y1: 5, x2: 5, y2: 5 }; },
            getLineC: function () { return { x1: 5, y1: 5, x2: 5, y2: 5 }; }
        };

        var result = GetPoints(degenerateTri, 0, 1);

        // perimeter=0, quantity=0/1=0, so no points
        expect(result.length).toBe(0);
    });

    it('should handle a flat horizontal triangle', function ()
    {
        // All vertices on y=0: A=(0,0), B=(10,0), C=(5,0)
        // LineA: (0,0)->(10,0), len=10; LineB: (10,0)->(5,0), len=5; LineC: (5,0)->(0,0), len=5
        // Perimeter=20
        var flatTri = {
            getLineA: function () { return { x1: 0, y1: 0, x2: 10, y2: 0 }; },
            getLineB: function () { return { x1: 10, y1: 0, x2: 5, y2: 0 }; },
            getLineC: function () { return { x1: 5, y1: 0, x2: 0, y2: 0 }; }
        };

        var result = GetPoints(flatTri, 4, 0);

        expect(result.length).toBe(4);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].y).toBeCloseTo(0);
        }
    });

    it('should use falsy quantity values (null, false, undefined) the same as 0', function ()
    {
        var tri = makeMockTriangle();

        var r1 = GetPoints(tri, null, 2);
        var r2 = GetPoints(tri, false, 2);
        var r3 = GetPoints(tri, undefined, 2);

        // perimeter=12, stepRate=2 => 6 points each
        expect(r1.length).toBe(6);
        expect(r2.length).toBe(6);
        expect(r3.length).toBe(6);
    });

    it('should not add points if stepRate is 0 and quantity is falsy', function ()
    {
        var tri = makeMockTriangle();
        var result = GetPoints(tri, false, 0);

        expect(result.length).toBe(0);
    });

    it('should not add points if stepRate is negative and quantity is falsy', function ()
    {
        var tri = makeMockTriangle();
        var result = GetPoints(tri, 0, -1);

        expect(result.length).toBe(0);
    });
});
