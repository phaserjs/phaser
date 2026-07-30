var Earcut = require('../../../src/geom/polygon/Earcut');

describe('Phaser.Geom.Polygon.Earcut', function ()
{
    describe('basic triangulation', function ()
    {
        it('should triangulate a simple triangle', function ()
        {
            var result = Earcut([0,0, 100,0, 50,100]);
            expect(result).toEqual([1, 2, 0]);
        });

        it('should triangulate a simple quad into two triangles', function ()
        {
            var result = Earcut([0,0, 100,0, 100,100, 0,100]);
            expect(result.length).toBe(6);
        });

        it('should return an array', function ()
        {
            var result = Earcut([10,0, 0,50, 60,60, 70,10]);
            expect(Array.isArray(result)).toBe(true);
        });

        it('should triangulate the example from the docs', function ()
        {
            var result = Earcut([10,0, 0,50, 60,60, 70,10]);
            expect(result).toEqual([1, 0, 3, 3, 2, 1]);
        });

        it('should produce indices that reference valid vertices', function ()
        {
            var data = [0,0, 100,0, 100,100, 0,100, 50,50];
            var numVertices = data.length / 2;
            var result = Earcut(data);
            for (var i = 0; i < result.length; i++)
            {
                expect(result[i]).toBeGreaterThanOrEqual(0);
                expect(result[i]).toBeLessThan(numVertices);
            }
        });

        it('should return groups of 3 indices (triangles)', function ()
        {
            var result = Earcut([0,0, 100,0, 100,100, 0,100]);
            expect(result.length % 3).toBe(0);
        });

        it('should triangulate a pentagon', function ()
        {
            var result = Earcut([0,0, 100,0, 120,80, 60,140, -20,80]);
            expect(result.length).toBe(9); // 3 triangles = 9 indices
            expect(result.length % 3).toBe(0);
        });

        it('should triangulate a hexagon', function ()
        {
            var result = Earcut([100,0, 50,87, -50,87, -100,0, -50,-87, 50,-87]);
            expect(result.length).toBe(12); // 4 triangles
            expect(result.length % 3).toBe(0);
        });
    });

    describe('edge cases', function ()
    {
        it('should return empty array for degenerate input with too few points', function ()
        {
            var result = Earcut([0,0, 1,1]);
            expect(result).toEqual([]);
        });

        it('should return empty array for empty input', function ()
        {
            var result = Earcut([]);
            expect(result).toEqual([]);
        });

        it('should handle collinear points', function ()
        {
            var result = Earcut([0,0, 50,0, 100,0, 100,100, 0,100]);
            expect(result.length % 3).toBe(0);
        });

        it('should handle duplicate points gracefully', function ()
        {
            var result = Earcut([0,0, 0,0, 100,0, 100,100]);
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('holes', function ()
    {
        it('should triangulate a polygon with a hole', function ()
        {
            var result = Earcut([0,0, 100,0, 100,100, 0,100,  20,20, 80,20, 80,80, 20,80], [4]);
            expect(result.length % 3).toBe(0);
            expect(result.length).toBeGreaterThan(0);
        });

        it('should match the expected result for a square with a square hole', function ()
        {
            var result = Earcut([0,0, 100,0, 100,100, 0,100,  20,20, 80,20, 80,80, 20,80], [4]);
            expect(result).toEqual([0,4,7, 5,4,0, 3,0,7, 5,0,1, 2,3,7, 6,5,1, 2,7,6, 6,1,2]);
        });

        it('should produce valid vertex indices when hole is present', function ()
        {
            var data = [0,0, 100,0, 100,100, 0,100,  20,20, 80,20, 80,80, 20,80];
            var numVertices = data.length / 2;
            var result = Earcut(data, [4]);
            for (var i = 0; i < result.length; i++)
            {
                expect(result[i]).toBeGreaterThanOrEqual(0);
                expect(result[i]).toBeLessThan(numVertices);
            }
        });

        it('should triangulate a polygon with multiple holes', function ()
        {
            var result = Earcut(
                [0,0, 200,0, 200,200, 0,200,  20,20, 80,20, 80,80, 20,80,  120,120, 180,120, 180,180, 120,180],
                [4, 8]
            );
            expect(result.length % 3).toBe(0);
            expect(result.length).toBeGreaterThan(0);
        });

        it('should handle a Steiner point (single vertex hole)', function ()
        {
            var result = Earcut([0,0, 100,0, 100,100, 0,100,  50,50], [4]);
            expect(result.length % 3).toBe(0);
            expect(result.length).toBeGreaterThan(0);
        });
    });

    describe('3D coordinates (dim parameter)', function ()
    {
        it('should triangulate with 3D coords using dim=3', function ()
        {
            var result = Earcut([10,0,1, 0,50,2, 60,60,3, 70,10,4], null, 3);
            expect(result).toEqual([1, 0, 3, 3, 2, 1]);
        });

        it('should return groups of 3 indices when using dim=3', function ()
        {
            var result = Earcut([0,0,0, 100,0,0, 100,100,0, 0,100,0], null, 3);
            expect(result.length % 3).toBe(0);
        });

        it('should produce valid vertex indices with dim=3', function ()
        {
            var data = [10,0,1, 0,50,2, 60,60,3, 70,10,4];
            var numVertices = data.length / 3;
            var result = Earcut(data, null, 3);
            for (var i = 0; i < result.length; i++)
            {
                expect(result[i]).toBeGreaterThanOrEqual(0);
                expect(result[i]).toBeLessThan(numVertices);
            }
        });
    });

    describe('Earcut.deviation', function ()
    {
        it('should return 0 for a perfect triangulation of a triangle', function ()
        {
            var data = [0,0, 100,0, 50,100];
            var triangles = Earcut(data);
            var dev = Earcut.deviation(data, null, 2, triangles);
            expect(dev).toBeCloseTo(0, 10);
        });

        it('should return 0 for a perfect triangulation of a quad', function ()
        {
            var data = [0,0, 100,0, 100,100, 0,100];
            var triangles = Earcut(data);
            var dev = Earcut.deviation(data, null, 2, triangles);
            expect(dev).toBeCloseTo(0, 10);
        });

        it('should return 0 for polygon with hole triangulation', function ()
        {
            var data = [0,0, 100,0, 100,100, 0,100,  20,20, 80,20, 80,80, 20,80];
            var triangles = Earcut(data, [4]);
            var dev = Earcut.deviation(data, [4], 2, triangles);
            expect(dev).toBeCloseTo(0, 10);
        });

        it('should return 0 when both polygon and triangles have zero area', function ()
        {
            var data = [0,0, 0,0, 0,0];
            var triangles = [0, 1, 2];
            var dev = Earcut.deviation(data, null, 2, triangles);
            expect(dev).toBe(0);
        });

        it('should return a number', function ()
        {
            var data = [0,0, 100,0, 100,100, 0,100];
            var triangles = Earcut(data);
            var dev = Earcut.deviation(data, null, 2, triangles);
            expect(typeof dev).toBe('number');
        });

        it('should return 0 for 3D coords triangulation', function ()
        {
            var data = [10,0,1, 0,50,2, 60,60,3, 70,10,4];
            var triangles = Earcut(data, null, 3);
            var dev = Earcut.deviation(data, null, 3, triangles);
            expect(dev).toBeCloseTo(0, 10);
        });
    });

    describe('Earcut.flatten', function ()
    {
        it('should be a function', function ()
        {
            expect(typeof Earcut.flatten).toBe('function');
        });

        it('should flatten a simple polygon from multi-dimensional array', function ()
        {
            var data = [[[0,0], [100,0], [100,100], [0,100]]];
            var result = Earcut.flatten(data);
            expect(result.vertices).toEqual([0,0, 100,0, 100,100, 0,100]);
            expect(result.holes).toEqual([]);
            expect(result.dimensions).toBe(2);
        });

        it('should detect dimensions from the data', function ()
        {
            var data = [[[0,0,1], [100,0,2], [100,100,3]]];
            var result = Earcut.flatten(data);
            expect(result.dimensions).toBe(3);
        });

        it('should flatten a polygon with a hole', function ()
        {
            var outer = [[0,0], [100,0], [100,100], [0,100]];
            var hole = [[20,20], [80,20], [80,80], [20,80]];
            var result = Earcut.flatten([outer, hole]);
            expect(result.vertices.length).toBe(16);
            expect(result.holes).toEqual([4]);
            expect(result.dimensions).toBe(2);
        });

        it('should flatten a polygon with multiple holes', function ()
        {
            var outer = [[0,0], [200,0], [200,200], [0,200]];
            var hole1 = [[20,20], [80,20], [80,80], [20,80]];
            var hole2 = [[120,120], [180,120], [180,180], [120,180]];
            var result = Earcut.flatten([outer, hole1, hole2]);
            expect(result.holes).toEqual([4, 8]);
        });

        it('should return an object with vertices, holes, and dimensions', function ()
        {
            var data = [[[0,0], [1,0], [1,1]]];
            var result = Earcut.flatten(data);
            expect(result).toHaveProperty('vertices');
            expect(result).toHaveProperty('holes');
            expect(result).toHaveProperty('dimensions');
            expect(Array.isArray(result.vertices)).toBe(true);
            expect(Array.isArray(result.holes)).toBe(true);
        });

        it('should produce vertices usable by Earcut', function ()
        {
            var geojson = [[[0,0], [100,0], [100,100], [0,100]]];
            var flat = Earcut.flatten(geojson);
            var triangles = Earcut(flat.vertices, flat.holes, flat.dimensions);
            expect(triangles.length % 3).toBe(0);
            expect(triangles.length).toBeGreaterThan(0);
        });

        it('should produce correct triangulation via flatten for polygon with hole', function ()
        {
            var outer = [[0,0], [100,0], [100,100], [0,100]];
            var hole = [[20,20], [80,20], [80,80], [20,80]];
            var flat = Earcut.flatten([outer, hole]);
            var triangles = Earcut(flat.vertices, flat.holes, flat.dimensions);
            var dev = Earcut.deviation(flat.vertices, flat.holes, flat.dimensions, triangles);
            expect(dev).toBeCloseTo(0, 10);
        });
    });

    describe('large polygons (z-order hashing path)', function ()
    {
        it('should triangulate a large polygon using z-order hashing', function ()
        {
            // Generate a polygon with > 80*2 = 160 data points (more than 80 vertices)
            var data = [];
            var n = 90;
            for (var i = 0; i < n; i++)
            {
                var angle = (i / n) * Math.PI * 2;
                data.push(Math.cos(angle) * 100);
                data.push(Math.sin(angle) * 100);
            }
            var result = Earcut(data);
            expect(result.length % 3).toBe(0);
            expect(result.length).toBeGreaterThan(0);
        });

        it('should produce valid deviation for large polygon', function ()
        {
            var data = [];
            var n = 90;
            for (var i = 0; i < n; i++)
            {
                var angle = (i / n) * Math.PI * 2;
                data.push(Math.cos(angle) * 100);
                data.push(Math.sin(angle) * 100);
            }
            var triangles = Earcut(data);
            var dev = Earcut.deviation(data, null, 2, triangles);
            expect(dev).toBeLessThan(0.01);
        });
    });
});
