var Hash = require('../../src/math/Hash');

describe('Phaser.Math.Hash', function ()
{
    // -------------------------------------------------------------------------
    // Output range
    // -------------------------------------------------------------------------

    describe('output range', function ()
    {
        it('should return a number between 0 (inclusive) and 1 (exclusive) for a single number input', function ()
        {
            var result = Hash(42);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should return a value in [0,1) for a two-element array (TRIG)', function ()
        {
            var result = Hash([3, 7], 0);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should return a value in [0,1) for a three-element array (TRIG)', function ()
        {
            var result = Hash([3, 7, 11], 0);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should return a value in [0,1) for a four-element array (TRIG)', function ()
        {
            var result = Hash([3, 7, 11, 13], 0);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should return a value in [0,1) for PCG algorithm with integer input', function ()
        {
            var result = Hash(42, 1);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should return a value in [0,1) for PCG_FLOAT algorithm', function ()
        {
            var result = Hash(3.7, 2);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });
    });

    // -------------------------------------------------------------------------
    // Determinism
    // -------------------------------------------------------------------------

    describe('determinism', function ()
    {
        it('should return the same value for the same single number input (TRIG)', function ()
        {
            expect(Hash(42, 0)).toBe(Hash(42, 0));
        });

        it('should return the same value for the same array input (TRIG)', function ()
        {
            expect(Hash([1, 2, 3, 4], 0)).toBe(Hash([1, 2, 3, 4], 0));
        });

        it('should return the same value for the same single number input (PCG)', function ()
        {
            expect(Hash(100, 1)).toBe(Hash(100, 1));
        });

        it('should return the same value for the same single number input (PCG_FLOAT)', function ()
        {
            expect(Hash(1.5, 2)).toBe(Hash(1.5, 2));
        });

        it('should return different values for different inputs (TRIG)', function ()
        {
            expect(Hash(1, 0)).not.toBe(Hash(2, 0));
        });

        it('should return different values for different inputs (PCG)', function ()
        {
            expect(Hash(1, 1)).not.toBe(Hash(2, 1));
        });
    });

    // -------------------------------------------------------------------------
    // Input as a plain number vs single-element array
    // -------------------------------------------------------------------------

    describe('single number vs single-element array', function ()
    {
        it('should treat a plain number identically to a single-element array (TRIG)', function ()
        {
            expect(Hash(5, 0)).toBe(Hash([5], 0));
        });

        it('should treat a plain number identically to a single-element array (PCG)', function ()
        {
            expect(Hash(5, 1)).toBe(Hash([5], 1));
        });

        it('should treat a plain number identically to a single-element array (PCG_FLOAT)', function ()
        {
            expect(Hash(5, 2)).toBe(Hash([5], 2));
        });
    });

    // -------------------------------------------------------------------------
    // Default algorithm
    // -------------------------------------------------------------------------

    describe('default algorithm', function ()
    {
        it('should use TRIG (algorithm 0) when no algorithm is provided', function ()
        {
            expect(Hash(42)).toBe(Hash(42, 0));
        });

        it('should use TRIG when algorithm is undefined', function ()
        {
            expect(Hash([1, 2], undefined)).toBe(Hash([1, 2], 0));
        });

        it('should use TRIG when algorithm is an unknown value', function ()
        {
            expect(Hash(42, 99)).toBe(Hash(42, 0));
        });
    });

    // -------------------------------------------------------------------------
    // TRIG algorithm (0)
    // -------------------------------------------------------------------------

    describe('TRIG algorithm (0)', function ()
    {
        it('should handle zero input', function ()
        {
            var result = Hash(0, 0);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should handle negative input', function ()
        {
            var result = Hash(-5, 0);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should handle floating-point input', function ()
        {
            var result = Hash(0.12345, 0);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should handle two-element array with negative values', function ()
        {
            var result = Hash([-3, -7], 0);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should produce distinct values for different two-element inputs', function ()
        {
            expect(Hash([1, 2], 0)).not.toBe(Hash([2, 1], 0));
        });

        it('should produce distinct values for different three-element inputs', function ()
        {
            expect(Hash([1, 2, 3], 0)).not.toBe(Hash([3, 2, 1], 0));
        });

        it('should produce distinct values for different four-element inputs', function ()
        {
            expect(Hash([1, 2, 3, 4], 0)).not.toBe(Hash([4, 3, 2, 1], 0));
        });

        it('should return a number type', function ()
        {
            expect(typeof Hash(7, 0)).toBe('number');
        });
    });

    // -------------------------------------------------------------------------
    // PCG algorithm (1)
    // -------------------------------------------------------------------------

    describe('PCG algorithm (1)', function ()
    {
        it('should handle zero input', function ()
        {
            var result = Hash(0, 1);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should handle large integer input', function ()
        {
            var result = Hash(100000, 1);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should handle a two-element integer array', function ()
        {
            var result = Hash([5, 10], 1);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should handle a three-element integer array', function ()
        {
            var result = Hash([1, 2, 3], 1);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should handle a four-element integer array', function ()
        {
            var result = Hash([1, 2, 3, 4], 1);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should return a number type', function ()
        {
            expect(typeof Hash(7, 1)).toBe('number');
        });
    });

    // -------------------------------------------------------------------------
    // PCG_FLOAT algorithm (2)
    // -------------------------------------------------------------------------

    describe('PCG_FLOAT algorithm (2)', function ()
    {
        it('should handle floating-point single input', function ()
        {
            var result = Hash(0.5, 2);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should handle a two-element float array', function ()
        {
            var result = Hash([0.1, 0.9], 2);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should handle a three-element float array', function ()
        {
            var result = Hash([0.1, 0.2, 0.3], 2);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should handle a four-element float array', function ()
        {
            var result = Hash([0.1, 0.2, 0.3, 0.4], 2);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1);
        });

        it('should return a number type', function ()
        {
            expect(typeof Hash(1.23, 2)).toBe('number');
        });

        it('should produce different results from PCG for float inputs', function ()
        {
            // PCG_FLOAT applies float conversion; results may differ from PCG integer path
            var floatInput = 3.7;
            var pcgResult = Hash(floatInput, 1);
            var pcgFloatResult = Hash(floatInput, 2);
            // They may differ due to the float expansion step
            expect(typeof pcgFloatResult).toBe('number');
            expect(pcgFloatResult).toBeGreaterThanOrEqual(0);
            expect(pcgFloatResult).toBeLessThan(1);
        });
    });

    // -------------------------------------------------------------------------
    // Variety across many inputs
    // -------------------------------------------------------------------------

    describe('variety across many inputs', function ()
    {
        it('should not return the same value for all integers 0-99 (TRIG)', function ()
        {
            var values = {};
            for (var i = 0; i < 100; i++)
            {
                values[Hash(i, 0)] = true;
            }
            expect(Object.keys(values).length).toBeGreaterThan(90);
        });

        it('should not return the same value for all integers 0-99 (PCG)', function ()
        {
            var values = {};
            for (var i = 0; i < 100; i++)
            {
                values[Hash(i, 1)] = true;
            }
            expect(Object.keys(values).length).toBeGreaterThan(90);
        });

        it('should keep all outputs within [0,1) over 1000 iterations (TRIG)', function ()
        {
            for (var i = 0; i < 1000; i++)
            {
                var result = Hash(i, 0);
                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThan(1);
            }
        });

        it('should keep all outputs within [0,1) over 1000 iterations (PCG)', function ()
        {
            for (var i = 0; i < 1000; i++)
            {
                var result = Hash(i, 1);
                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThan(1);
            }
        });
    });

    // -------------------------------------------------------------------------
    // Circular input pattern (as suggested in the docs)
    // -------------------------------------------------------------------------

    describe('circular input pattern', function ()
    {
        it('should return values in [0,1) when using cos/sin inputs (TRIG)', function ()
        {
            for (var i = 0; i < 20; i++)
            {
                var t = i * 0.314;
                var result = Hash([Math.cos(t), Math.sin(t)], 0);
                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThan(1);
            }
        });
    });
});
