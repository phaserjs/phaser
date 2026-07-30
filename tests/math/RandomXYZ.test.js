var RandomXYZ = require('../../src/math/RandomXYZ');

describe('Phaser.Math.RandomXYZ', function ()
{
    it('should return the same vec3 object that was passed in', function ()
    {
        var vec3 = { x: 0, y: 0, z: 0 };
        var result = RandomXYZ(vec3);

        expect(result).toBe(vec3);
    });

    it('should set x, y, z properties on the vector', function ()
    {
        var vec3 = { x: 0, y: 0, z: 0 };
        RandomXYZ(vec3);

        expect(typeof vec3.x).toBe('number');
        expect(typeof vec3.y).toBe('number');
        expect(typeof vec3.z).toBe('number');
    });

    it('should default to radius 1 when no radius is given', function ()
    {
        var iterations = 1000;

        for (var i = 0; i < iterations; i++)
        {
            var vec3 = { x: 0, y: 0, z: 0 };
            RandomXYZ(vec3);

            var len = Math.sqrt(vec3.x * vec3.x + vec3.y * vec3.y + vec3.z * vec3.z);

            expect(len).toBeCloseTo(1, 10);
        }
    });

    it('should produce a point on the surface of a sphere with the given radius', function ()
    {
        var radius = 5;
        var iterations = 1000;

        for (var i = 0; i < iterations; i++)
        {
            var vec3 = { x: 0, y: 0, z: 0 };
            RandomXYZ(vec3, radius);

            var len = Math.sqrt(vec3.x * vec3.x + vec3.y * vec3.y + vec3.z * vec3.z);

            expect(len).toBeCloseTo(radius, 10);
        }
    });

    it('should keep z within [-radius, radius]', function ()
    {
        var radius = 3;
        var iterations = 1000;

        for (var i = 0; i < iterations; i++)
        {
            var vec3 = { x: 0, y: 0, z: 0 };
            RandomXYZ(vec3, radius);

            expect(vec3.z).toBeGreaterThanOrEqual(-radius);
            expect(vec3.z).toBeLessThanOrEqual(radius);
        }
    });

    it('should keep x within [-radius, radius]', function ()
    {
        var radius = 3;
        var iterations = 1000;

        for (var i = 0; i < iterations; i++)
        {
            var vec3 = { x: 0, y: 0, z: 0 };
            RandomXYZ(vec3, radius);

            expect(vec3.x).toBeGreaterThanOrEqual(-radius);
            expect(vec3.x).toBeLessThanOrEqual(radius);
        }
    });

    it('should keep y within [-radius, radius]', function ()
    {
        var radius = 3;
        var iterations = 1000;

        for (var i = 0; i < iterations; i++)
        {
            var vec3 = { x: 0, y: 0, z: 0 };
            RandomXYZ(vec3, radius);

            expect(vec3.y).toBeGreaterThanOrEqual(-radius);
            expect(vec3.y).toBeLessThanOrEqual(radius);
        }
    });

    it('should work with a fractional radius', function ()
    {
        var radius = 0.5;
        var iterations = 500;

        for (var i = 0; i < iterations; i++)
        {
            var vec3 = { x: 0, y: 0, z: 0 };
            RandomXYZ(vec3, radius);

            var len = Math.sqrt(vec3.x * vec3.x + vec3.y * vec3.y + vec3.z * vec3.z);

            expect(len).toBeCloseTo(radius, 10);
        }
    });

    it('should produce a zero-length vector when radius is 0', function ()
    {
        var iterations = 20;

        for (var i = 0; i < iterations; i++)
        {
            var vec3 = { x: 1, y: 1, z: 1 };
            RandomXYZ(vec3, 0);

            expect(vec3.x).toBeCloseTo(0, 10);
            expect(vec3.y).toBeCloseTo(0, 10);
            expect(vec3.z).toBeCloseTo(0, 10);
        }
    });

    it('should overwrite existing values on the vector', function ()
    {
        var vec3 = { x: 99, y: 99, z: 99 };
        RandomXYZ(vec3, 1);

        var len = Math.sqrt(vec3.x * vec3.x + vec3.y * vec3.y + vec3.z * vec3.z);

        expect(len).toBeCloseTo(1, 10);
    });

    it('should produce varied results across multiple calls', function ()
    {
        var results = [];
        var iterations = 20;

        for (var i = 0; i < iterations; i++)
        {
            var vec3 = { x: 0, y: 0, z: 0 };
            RandomXYZ(vec3, 1);
            results.push(vec3.x + ',' + vec3.y + ',' + vec3.z);
        }

        var unique = results.filter(function (val, idx, arr) { return arr.indexOf(val) === idx; });

        expect(unique.length).toBeGreaterThan(1);
    });
});
