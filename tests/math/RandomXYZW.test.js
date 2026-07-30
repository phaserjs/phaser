var RandomXYZW = require('../../src/math/RandomXYZW');

describe('Phaser.Math.RandomXYZW', function ()
{
    var vec4;

    beforeEach(function ()
    {
        vec4 = { x: 0, y: 0, z: 0, w: 0 };
    });

    it('should return the same vec4 object passed in', function ()
    {
        var result = RandomXYZW(vec4);

        expect(result).toBe(vec4);
    });

    it('should set x, y, z, w properties on the vector', function ()
    {
        RandomXYZW(vec4);

        expect(typeof vec4.x).toBe('number');
        expect(typeof vec4.y).toBe('number');
        expect(typeof vec4.z).toBe('number');
        expect(typeof vec4.w).toBe('number');
    });

    it('should default scale to 1 when not provided', function ()
    {
        var iterations = 1000;

        for (var i = 0; i < iterations; i++)
        {
            RandomXYZW(vec4);

            expect(vec4.x).toBeGreaterThanOrEqual(-1);
            expect(vec4.x).toBeLessThanOrEqual(1);
            expect(vec4.y).toBeGreaterThanOrEqual(-1);
            expect(vec4.y).toBeLessThanOrEqual(1);
            expect(vec4.z).toBeGreaterThanOrEqual(-1);
            expect(vec4.z).toBeLessThanOrEqual(1);
            expect(vec4.w).toBeGreaterThanOrEqual(-1);
            expect(vec4.w).toBeLessThanOrEqual(1);
        }
    });

    it('should scale all components by the given scale value', function ()
    {
        var scale = 5;
        var iterations = 1000;

        for (var i = 0; i < iterations; i++)
        {
            RandomXYZW(vec4, scale);

            expect(vec4.x).toBeGreaterThanOrEqual(-5);
            expect(vec4.x).toBeLessThanOrEqual(5);
            expect(vec4.y).toBeGreaterThanOrEqual(-5);
            expect(vec4.y).toBeLessThanOrEqual(5);
            expect(vec4.z).toBeGreaterThanOrEqual(-5);
            expect(vec4.z).toBeLessThanOrEqual(5);
            expect(vec4.w).toBeGreaterThanOrEqual(-5);
            expect(vec4.w).toBeLessThanOrEqual(5);
        }
    });

    it('should produce values in range [-scale, scale] for fractional scale', function ()
    {
        var scale = 0.5;
        var iterations = 1000;

        for (var i = 0; i < iterations; i++)
        {
            RandomXYZW(vec4, scale);

            expect(vec4.x).toBeGreaterThanOrEqual(-0.5);
            expect(vec4.x).toBeLessThanOrEqual(0.5);
            expect(vec4.y).toBeGreaterThanOrEqual(-0.5);
            expect(vec4.y).toBeLessThanOrEqual(0.5);
            expect(vec4.z).toBeGreaterThanOrEqual(-0.5);
            expect(vec4.z).toBeLessThanOrEqual(0.5);
            expect(vec4.w).toBeGreaterThanOrEqual(-0.5);
            expect(vec4.w).toBeLessThanOrEqual(0.5);
        }
    });

    it('should set all components to zero when scale is 0', function ()
    {
        RandomXYZW(vec4, 0);

        expect(vec4.x === 0).toBe(true);
        expect(vec4.y === 0).toBe(true);
        expect(vec4.z === 0).toBe(true);
        expect(vec4.w === 0).toBe(true);
    });

    it('should produce negative range values when scale is negative', function ()
    {
        var scale = -3;
        var iterations = 1000;

        for (var i = 0; i < iterations; i++)
        {
            RandomXYZW(vec4, scale);

            expect(vec4.x).toBeGreaterThanOrEqual(-3);
            expect(vec4.x).toBeLessThanOrEqual(3);
            expect(vec4.y).toBeGreaterThanOrEqual(-3);
            expect(vec4.y).toBeLessThanOrEqual(3);
            expect(vec4.z).toBeGreaterThanOrEqual(-3);
            expect(vec4.z).toBeLessThanOrEqual(3);
            expect(vec4.w).toBeGreaterThanOrEqual(-3);
            expect(vec4.w).toBeLessThanOrEqual(3);
        }
    });

    it('should produce both positive and negative values over many iterations', function ()
    {
        var hasPositive = false;
        var hasNegative = false;
        var iterations = 1000;

        for (var i = 0; i < iterations; i++)
        {
            RandomXYZW(vec4);

            if (vec4.x > 0) { hasPositive = true; }
            if (vec4.x < 0) { hasNegative = true; }

            if (hasPositive && hasNegative) { break; }
        }

        expect(hasPositive).toBe(true);
        expect(hasNegative).toBe(true);
    });

    it('should mutate the vec4 object in place', function ()
    {
        vec4.x = 99;
        vec4.y = 99;
        vec4.z = 99;
        vec4.w = 99;

        RandomXYZW(vec4, 1);

        expect(vec4.x).not.toBe(99);
        expect(vec4.y).not.toBe(99);
        expect(vec4.z).not.toBe(99);
        expect(vec4.w).not.toBe(99);
    });

    it('should independently randomize each component', function ()
    {
        var allSame = true;
        var iterations = 100;

        for (var i = 0; i < iterations; i++)
        {
            RandomXYZW(vec4);

            if (vec4.x !== vec4.y || vec4.y !== vec4.z || vec4.z !== vec4.w)
            {
                allSame = false;
                break;
            }
        }

        expect(allSame).toBe(false);
    });
});
