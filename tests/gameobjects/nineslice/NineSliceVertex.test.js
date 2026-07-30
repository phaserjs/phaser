var NineSliceVertex = require('../../../src/gameobjects/nineslice/NineSliceVertex');

describe('NineSliceVertex', function ()
{
    describe('constructor', function ()
    {
        it('should create a vertex with given x, y, u, v values', function ()
        {
            var v = new NineSliceVertex(0.5, 0.25, 0.1, 0.9);
            expect(v.x).toBe(0.5);
            expect(v.y).toBe(0.25);
            expect(v.u).toBe(0.1);
            expect(v.v).toBe(0.9);
        });

        it('should initialize vx and vy to zero', function ()
        {
            var v = new NineSliceVertex(1, 2, 0.5, 0.5);
            expect(v.vx).toBe(0);
            expect(v.vy).toBe(0);
        });

        it('should create a vertex with zero values', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.u).toBe(0);
            expect(v.v).toBe(0);
        });

        it('should create a vertex with negative values', function ()
        {
            var v = new NineSliceVertex(-0.5, -1, -0.2, -0.8);
            expect(v.x).toBe(-0.5);
            expect(v.y).toBe(-1);
            expect(v.u).toBe(-0.2);
            expect(v.v).toBe(-0.8);
        });

        it('should inherit from Vector2', function ()
        {
            var v = new NineSliceVertex(1, 2, 0, 0);
            expect(typeof v.length).toBe('function');
            expect(typeof v.add).toBe('function');
        });
    });

    describe('setUVs', function ()
    {
        it('should set u and v coordinates', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.setUVs(0.3, 0.7);
            expect(v.u).toBe(0.3);
            expect(v.v).toBe(0.7);
        });

        it('should overwrite existing u and v values', function ()
        {
            var v = new NineSliceVertex(0, 0, 0.1, 0.9);
            v.setUVs(0.5, 0.5);
            expect(v.u).toBe(0.5);
            expect(v.v).toBe(0.5);
        });

        it('should return this for chaining', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            var result = v.setUVs(0.3, 0.7);
            expect(result).toBe(v);
        });

        it('should accept zero values', function ()
        {
            var v = new NineSliceVertex(0, 0, 0.5, 0.5);
            v.setUVs(0, 0);
            expect(v.u).toBe(0);
            expect(v.v).toBe(0);
        });

        it('should accept values greater than 1', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.setUVs(2, 3);
            expect(v.u).toBe(2);
            expect(v.v).toBe(3);
        });

        it('should accept negative values', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.setUVs(-0.5, -1);
            expect(v.u).toBe(-0.5);
            expect(v.v).toBe(-1);
        });

        it('should not affect x and y position', function ()
        {
            var v = new NineSliceVertex(1, 2, 0, 0);
            v.setUVs(0.5, 0.5);
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
        });
    });

    describe('resize', function ()
    {
        it('should set x and y position', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.resize(0.5, 0.25, 100, 200, 0.5, 0.5);
            expect(v.x).toBe(0.5);
            expect(v.y).toBe(0.25);
        });

        it('should return this for chaining', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            var result = v.resize(0, 0, 100, 100, 0.5, 0.5);
            expect(result).toBe(v);
        });

        it('should calculate vx as x * width and vy as -y * height with centered origin', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.resize(0.5, 0.5, 100, 200, 0.5, 0.5);
            expect(v.vx).toBeCloseTo(50);
            expect(v.vy).toBeCloseTo(-100);
        });

        it('should shift vx right when originX is less than 0.5', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.resize(0, 0, 100, 100, 0, 0.5);
            // vx = 0 * 100 + 100 * (0.5 - 0) = 50
            expect(v.vx).toBeCloseTo(50);
        });

        it('should shift vx left when originX is greater than 0.5', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.resize(0, 0, 100, 100, 1, 0.5);
            // vx = 0 * 100 - 100 * (1 - 0.5) = -50
            expect(v.vx).toBeCloseTo(-50);
        });

        it('should shift vy down when originY is less than 0.5', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.resize(0, 0, 100, 100, 0.5, 0);
            // vy = -0 * 100 + 100 * (0.5 - 0) = 50
            expect(v.vy).toBeCloseTo(50);
        });

        it('should shift vy up when originY is greater than 0.5', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.resize(0, 0, 100, 100, 0.5, 1);
            // vy = -0 * 100 - 100 * (1 - 0.5) = -50
            expect(v.vy).toBeCloseTo(-50);
        });

        it('should not alter u and v coordinates', function ()
        {
            var v = new NineSliceVertex(0, 0, 0.3, 0.7);
            v.resize(0.5, 0.5, 100, 100, 0.5, 0.5);
            expect(v.u).toBe(0.3);
            expect(v.v).toBe(0.7);
        });

        it('should handle zero position with centered origin', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.resize(0, 0, 100, 100, 0.5, 0.5);
            expect(v.vx).toBeCloseTo(0);
            expect(v.vy).toBeCloseTo(0);
        });

        it('should handle negative x position', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.resize(-0.5, 0, 100, 100, 0.5, 0.5);
            expect(v.vx).toBeCloseTo(-50);
            expect(v.x).toBe(-0.5);
        });

        it('should handle negative y position (vy is negated)', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.resize(0, -0.5, 100, 100, 0.5, 0.5);
            expect(v.vy).toBeCloseTo(50);
            expect(v.y).toBe(-0.5);
        });

        it('should handle combined non-centered origin offsets', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.resize(0.5, 0.5, 200, 100, 0.25, 0.75);
            // vx = 0.5 * 200 + 200 * (0.5 - 0.25) = 100 + 50 = 150
            // vy = -0.5 * 100 - 100 * (0.75 - 0.5) = -50 - 25 = -75
            expect(v.vx).toBeCloseTo(150);
            expect(v.vy).toBeCloseTo(-75);
        });

        it('should handle floating point x and y inputs', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.resize(0.333, 0.667, 300, 150, 0.5, 0.5);
            expect(v.vx).toBeCloseTo(99.9);
            expect(v.vy).toBeCloseTo(-100.05);
        });

        it('should handle zero width and height', function ()
        {
            var v = new NineSliceVertex(0, 0, 0, 0);
            v.resize(1, 1, 0, 0, 0.5, 0.5);
            expect(v.vx).toBeCloseTo(0);
            expect(v.vy).toBeCloseTo(0);
        });
    });
});
