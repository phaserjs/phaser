var HashSimplex = require('../../src/math/HashSimplex');

describe('Phaser.Math.HashSimplex', function ()
{
    describe('input handling', function ()
    {
        it('should accept a single number', function ()
        {
            var result = HashSimplex(0.5);
            expect(typeof result).toBe('number');
        });

        it('should accept a 1D array', function ()
        {
            var result = HashSimplex([ 0.5 ]);
            expect(typeof result).toBe('number');
        });

        it('should accept a 2D array', function ()
        {
            var result = HashSimplex([ 0.5, 0.5 ]);
            expect(typeof result).toBe('number');
        });

        it('should accept a 3D array', function ()
        {
            var result = HashSimplex([ 0.5, 0.5, 0.5 ]);
            expect(typeof result).toBe('number');
        });

        it('should treat scalar input the same as a 1D array', function ()
        {
            var r1 = HashSimplex(1.23);
            var r2 = HashSimplex([ 1.23 ]);
            expect(r1).toBeCloseTo(r2, 10);
        });

        it('should work with no config argument', function ()
        {
            var result = HashSimplex([ 1, 2 ]);
            expect(typeof result).toBe('number');
        });

        it('should work with an empty config object', function ()
        {
            var result = HashSimplex([ 1, 2 ], {});
            expect(typeof result).toBe('number');
        });
    });

    describe('determinism', function ()
    {
        it('should return the same value for the same 2D input', function ()
        {
            var r1 = HashSimplex([ 10, 20 ]);
            var r2 = HashSimplex([ 10, 20 ]);
            expect(r1).toBe(r2);
        });

        it('should return the same value for the same 3D input', function ()
        {
            var r1 = HashSimplex([ 1, 2, 3 ]);
            var r2 = HashSimplex([ 1, 2, 3 ]);
            expect(r1).toBe(r2);
        });

        it('should return the same value for the same scalar input', function ()
        {
            var r1 = HashSimplex(7);
            var r2 = HashSimplex(7);
            expect(r1).toBe(r2);
        });

        it('should return different values for different inputs', function ()
        {
            var r1 = HashSimplex([ 0.15, 0.23 ]);
            var r2 = HashSimplex([ 0.87, 0.42 ]);
            expect(r1).not.toBe(r2);
        });

        it('should return different values when x differs', function ()
        {
            var r1 = HashSimplex([ 0.15, 0.23 ]);
            var r2 = HashSimplex([ 0.65, 0.23 ]);
            expect(r1).not.toBe(r2);
        });

        it('should return different values when y differs', function ()
        {
            var r1 = HashSimplex([ 0.15, 0.23 ]);
            var r2 = HashSimplex([ 0.15, 0.73 ]);
            expect(r1).not.toBe(r2);
        });
    });

    describe('output range (single iteration)', function ()
    {
        it('should return a finite number', function ()
        {
            var result = HashSimplex([ 0, 0 ]);
            expect(isFinite(result)).toBe(true);
        });

        it('should return values within [-1, 1] for a range of 2D inputs', function ()
        {
            var outOfRange = false;
            for (var x = 0; x < 10; x++)
            {
                for (var y = 0; y < 10; y++)
                {
                    var v = HashSimplex([ x * 0.1, y * 0.1 ]);
                    if (v < -1.1 || v > 1.1)
                    {
                        outOfRange = true;
                    }
                }
            }
            expect(outOfRange).toBe(false);
        });

        it('should return values within [-1, 1] for a range of 3D inputs', function ()
        {
            var outOfRange = false;
            for (var x = 0; x < 5; x++)
            {
                for (var y = 0; y < 5; y++)
                {
                    for (var z = 0; z < 5; z++)
                    {
                        var v = HashSimplex([ x * 0.1, y * 0.1, z * 0.1 ]);
                        if (v < -1.1 || v > 1.1)
                        {
                            outOfRange = true;
                        }
                    }
                }
            }
            expect(outOfRange).toBe(false);
        });

        it('should produce both positive and negative values across many inputs', function ()
        {
            var hasPositive = false;
            var hasNegative = false;
            for (var i = 0; i < 50; i++)
            {
                var v = HashSimplex([ i * 0.3, i * 0.7 ]);
                if (v > 0) { hasPositive = true; }
                if (v < 0) { hasNegative = true; }
            }
            expect(hasPositive).toBe(true);
            expect(hasNegative).toBe(true);
        });
    });

    describe('config: noiseSeed', function ()
    {
        it('should produce different output with different seeds', function ()
        {
            var r1 = HashSimplex([ 0.15, 0.23 ], { noiseSeed: [ 1, 2 ] });
            var r2 = HashSimplex([ 0.15, 0.23 ], { noiseSeed: [ 3, 4 ] });
            expect(r1).not.toBe(r2);
        });

        it('should produce consistent output with the same seed', function ()
        {
            var cfg = { noiseSeed: [ 5, 6 ] };
            var r1 = HashSimplex([ 2, 3 ], cfg);
            var r2 = HashSimplex([ 2, 3 ], cfg);
            expect(r1).toBe(r2);
        });
    });

    describe('config: noiseIterations', function ()
    {
        it('should accept noiseIterations of 1 (default)', function ()
        {
            var r1 = HashSimplex([ 1, 2 ], { noiseIterations: 1 });
            var r2 = HashSimplex([ 1, 2 ]);
            expect(r1).toBe(r2);
        });

        it('should return a finite number with multiple iterations', function ()
        {
            var result = HashSimplex([ 1, 2 ], { noiseIterations: 4 });
            expect(isFinite(result)).toBe(true);
        });

        it('should return a different result with more iterations', function ()
        {
            var r1 = HashSimplex([ 0.15, 0.23 ], { noiseIterations: 1 });
            var r2 = HashSimplex([ 0.15, 0.23 ], { noiseIterations: 3 });
            expect(r1).not.toBe(r2);
        });
    });

    describe('config: noiseOffset', function ()
    {
        it('should shift output when noiseOffset is applied', function ()
        {
            var r1 = HashSimplex([ 0.15, 0.23 ], {});
            var r2 = HashSimplex([ 0.15, 0.23 ], { noiseOffset: [ 10, 10, 0 ] });
            expect(r1).not.toBe(r2);
        });

        it('should return a finite number with noiseOffset', function ()
        {
            var result = HashSimplex([ 1, 2 ], { noiseOffset: [ 5, 5, 0 ] });
            expect(isFinite(result)).toBe(true);
        });
    });

    describe('config: noiseCells', function ()
    {
        it('should use noiseCells to scale input', function ()
        {
            var r1 = HashSimplex([ 0.15, 0.23 ], { noiseCells: [ 32, 32, 32 ] });
            var r2 = HashSimplex([ 0.15, 0.23 ], { noiseCells: [ 64, 64, 64 ] });
            expect(r1).not.toBe(r2);
        });

        it('should return a finite number with custom noiseCells', function ()
        {
            var result = HashSimplex([ 0.5, 0.5 ], { noiseCells: [ 16, 16, 16 ] });
            expect(isFinite(result)).toBe(true);
        });
    });

    describe('config: noiseFlow', function ()
    {
        it('should return a finite number with noiseFlow set', function ()
        {
            var result = HashSimplex([ 1, 2 ], { noiseFlow: 1.0 });
            expect(isFinite(result)).toBe(true);
        });

        it('should return a different result with different noiseFlow', function ()
        {
            var r1 = HashSimplex([ 0.15, 0.23 ], { noiseFlow: 0 });
            var r2 = HashSimplex([ 0.15, 0.23 ], { noiseFlow: 1.5 });
            expect(r1).not.toBe(r2);
        });
    });

    describe('config: noiseWarpAmount (2D)', function ()
    {
        it('should return a finite number with warp enabled on 2D input', function ()
        {
            var result = HashSimplex([ 1, 2 ], { noiseWarpAmount: 0.5 });
            expect(isFinite(result)).toBe(true);
        });

        it('should return a different result when warp is applied vs not', function ()
        {
            var r1 = HashSimplex([ 1, 2 ], { noiseWarpAmount: 0 });
            var r2 = HashSimplex([ 1, 2 ], { noiseWarpAmount: 1.0 });
            expect(r1).not.toBe(r2);
        });

        it('should return a finite number with warp on 3D input', function ()
        {
            var result = HashSimplex([ 1, 2, 3 ], { noiseWarpAmount: 0.5 });
            expect(isFinite(result)).toBe(true);
        });

        it('should return a different result with warp on 3D input vs no warp', function ()
        {
            var r1 = HashSimplex([ 1, 2, 3 ], { noiseWarpAmount: 0 });
            var r2 = HashSimplex([ 1, 2, 3 ], { noiseWarpAmount: 1.0 });
            expect(r1).not.toBe(r2);
        });
    });

    describe('config: noisePeriod', function ()
    {
        it('should return a finite number with noisePeriod set', function ()
        {
            var result = HashSimplex([ 1, 2 ], { noisePeriod: [ 32, 32, 32 ] });
            expect(isFinite(result)).toBe(true);
        });

        it('should tile: inputs separated by the period should return the same value (2D)', function ()
        {
            var period = [ 32, 32, 32 ];
            var cfg = { noisePeriod: period, noiseCells: [ 1, 1, 1 ] };
            var r1 = HashSimplex([ 5, 5 ], cfg);
            var r2 = HashSimplex([ 5 + 32, 5 + 32 ], cfg);
            expect(r1).toBeCloseTo(r2, 4);
        });
    });

    describe('edge cases', function ()
    {
        it('should handle zero vector', function ()
        {
            var result = HashSimplex([ 0, 0 ]);
            expect(isFinite(result)).toBe(true);
        });

        it('should handle negative inputs', function ()
        {
            var result = HashSimplex([ -5, -3 ]);
            expect(isFinite(result)).toBe(true);
        });

        it('should handle large inputs', function ()
        {
            var result = HashSimplex([ 1000, 2000 ]);
            expect(isFinite(result)).toBe(true);
        });

        it('should handle floating point inputs', function ()
        {
            var result = HashSimplex([ 0.123456, 0.654321 ]);
            expect(isFinite(result)).toBe(true);
        });

        it('should handle scalar zero', function ()
        {
            var result = HashSimplex(0);
            expect(isFinite(result)).toBe(true);
        });

        it('should handle scalar negative value', function ()
        {
            var result = HashSimplex(-5);
            expect(isFinite(result)).toBe(true);
        });
    });
});
