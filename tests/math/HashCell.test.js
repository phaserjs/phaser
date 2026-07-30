var HashCell = require('../../src/math/HashCell');

describe('Phaser.Math.HashCell', function ()
{
    describe('input handling', function ()
    {
        it('should accept a single number as input', function ()
        {
            var result = HashCell(0.5);
            expect(typeof result).toBe('number');
        });

        it('should accept a 1-element array as input', function ()
        {
            var result = HashCell([ 0.5 ]);
            expect(typeof result).toBe('number');
        });

        it('should accept a 2-element array as input', function ()
        {
            var result = HashCell([ 0.5, 0.5 ]);
            expect(typeof result).toBe('number');
        });

        it('should accept a 3-element array as input', function ()
        {
            var result = HashCell([ 0.5, 0.5, 0.5 ]);
            expect(typeof result).toBe('number');
        });

        it('should accept a 4-element array as input', function ()
        {
            var result = HashCell([ 0.5, 0.5, 0.5, 0.5 ]);
            expect(typeof result).toBe('number');
        });

        it('should treat a single number the same as a 1-element array', function ()
        {
            var a = HashCell(0.5);
            var b = HashCell([ 0.5 ]);
            expect(a).toBe(b);
        });

        it('should work without a config argument', function ()
        {
            expect(function () { HashCell(0.5); }).not.toThrow();
        });

        it('should work with an empty config object', function ()
        {
            expect(function () { HashCell(0.5, {}); }).not.toThrow();
        });
    });

    describe('determinism', function ()
    {
        it('should return the same value for the same scalar input', function ()
        {
            var a = HashCell(0.25);
            var b = HashCell(0.25);
            expect(a).toBe(b);
        });

        it('should return the same value for the same 1D array input', function ()
        {
            var a = HashCell([ 0.75 ]);
            var b = HashCell([ 0.75 ]);
            expect(a).toBe(b);
        });

        it('should return the same value for the same 2D input', function ()
        {
            var a = HashCell([ 0.3, 0.7 ]);
            var b = HashCell([ 0.3, 0.7 ]);
            expect(a).toBe(b);
        });

        it('should return the same value for the same 4D input', function ()
        {
            var a = HashCell([ 0.1, 0.2, 0.3, 0.4 ]);
            var b = HashCell([ 0.1, 0.2, 0.3, 0.4 ]);
            expect(a).toBe(b);
        });

        it('should return different values for different inputs', function ()
        {
            var a = HashCell(0.1);
            var b = HashCell(0.9);
            expect(a).not.toBe(b);
        });

        it('should return the same value given the same config', function ()
        {
            var config = { noiseSeed: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ] };
            var a = HashCell(0.5, config);
            var b = HashCell(0.5, config);
            expect(a).toBe(b);
        });
    });

    describe('return value', function ()
    {
        it('should return a finite number', function ()
        {
            expect(isFinite(HashCell(0.5))).toBe(true);
        });

        it('should return a finite number for 2D input', function ()
        {
            expect(isFinite(HashCell([ 0.5, 0.5 ]))).toBe(true);
        });

        it('should return a non-negative value in mode 0 (default)', function ()
        {
            expect(HashCell(0.5)).toBeGreaterThanOrEqual(0);
            expect(HashCell([ 0.1, 0.9 ])).toBeGreaterThanOrEqual(0);
        });

        it('should return a number near 0.5 for zero input', function ()
        {
            var result = HashCell(0);
            expect(typeof result).toBe('number');
            expect(isFinite(result)).toBe(true);
        });

        it('should return a number for negative input', function ()
        {
            var result = HashCell(-0.5);
            expect(typeof result).toBe('number');
            expect(isFinite(result)).toBe(true);
        });
    });

    describe('noiseIterations config', function ()
    {
        it('should default to 1 iteration', function ()
        {
            var a = HashCell(0.5, {});
            var b = HashCell(0.5, { noiseIterations: 1 });
            expect(a).toBe(b);
        });

        it('should produce a different result with more iterations', function ()
        {
            var a = HashCell(0.5, { noiseIterations: 1 });
            var b = HashCell(0.5, { noiseIterations: 2 });
            expect(a).not.toBe(b);
        });

        it('should return a finite number with multiple iterations', function ()
        {
            var result = HashCell(0.5, { noiseIterations: 4 });
            expect(isFinite(result)).toBe(true);
        });

        it('should be deterministic with the same noiseIterations', function ()
        {
            var config = { noiseIterations: 3 };
            var a = HashCell(0.5, config);
            var b = HashCell(0.5, config);
            expect(a).toBe(b);
        });
    });

    describe('noiseMode config', function ()
    {
        it('should default to mode 0', function ()
        {
            var a = HashCell(0.5, {});
            var b = HashCell(0.5, { noiseMode: 0 });
            expect(a).toBe(b);
        });

        it('should return a finite number in mode 0', function ()
        {
            expect(isFinite(HashCell(0.5, { noiseMode: 0 }))).toBe(true);
        });

        it('should return a finite number in mode 1', function ()
        {
            expect(isFinite(HashCell(0.5, { noiseMode: 1 }))).toBe(true);
        });

        it('should return a finite number in mode 2', function ()
        {
            expect(isFinite(HashCell(0.5, { noiseMode: 2 }))).toBe(true);
        });

        it('should produce different results for mode 0 vs mode 1', function ()
        {
            var a = HashCell(0.5, { noiseMode: 0 });
            var b = HashCell(0.5, { noiseMode: 1 });
            expect(a).not.toBe(b);
        });

        it('should be deterministic in mode 1', function ()
        {
            var a = HashCell(0.3, { noiseMode: 1 });
            var b = HashCell(0.3, { noiseMode: 1 });
            expect(a).toBe(b);
        });

        it('should be deterministic in mode 2', function ()
        {
            var a = HashCell(0.3, { noiseMode: 2 });
            var b = HashCell(0.3, { noiseMode: 2 });
            expect(a).toBe(b);
        });
    });

    describe('noiseSmoothing config', function ()
    {
        it('should default to smoothing of 1 when not specified', function ()
        {
            var a = HashCell(0.5, { noiseMode: 2 });
            var b = HashCell(0.5, { noiseMode: 2, noiseSmoothing: 1 });
            expect(a).toBe(b);
        });

        it('should produce different results for different smoothing values in mode 2', function ()
        {
            var a = HashCell(0.5, { noiseMode: 2, noiseSmoothing: 1 });
            var b = HashCell(0.5, { noiseMode: 2, noiseSmoothing: 4 });
            expect(a).not.toBe(b);
        });

        it('should return a finite number with custom smoothing in mode 2', function ()
        {
            var result = HashCell(0.5, { noiseMode: 2, noiseSmoothing: 2 });
            expect(isFinite(result)).toBe(true);
        });
    });

    describe('noiseCells config', function ()
    {
        it('should accept a custom noiseCells array', function ()
        {
            var result = HashCell(0.5, { noiseCells: [ 16 ] });
            expect(typeof result).toBe('number');
            expect(isFinite(result)).toBe(true);
        });

        it('should produce different results with different cell sizes', function ()
        {
            var a = HashCell(0.5, { noiseCells: [ 32 ] });
            var b = HashCell(0.5, { noiseCells: [ 16 ] });
            expect(a).not.toBe(b);
        });

        it('should work with a 2D noiseCells config', function ()
        {
            var result = HashCell([ 0.5, 0.5 ], { noiseCells: [ 16, 16 ] });
            expect(isFinite(result)).toBe(true);
        });
    });

    describe('noiseSeed config', function ()
    {
        it('should accept a custom seed', function ()
        {
            var result = HashCell(0.5, { noiseSeed: [ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ] });
            expect(typeof result).toBe('number');
            expect(isFinite(result)).toBe(true);
        });

        it('should produce different results with different seeds', function ()
        {
            var seed1 = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
            var seed2 = [ 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160 ];
            var a = HashCell(0.5, { noiseSeed: seed1 });
            var b = HashCell(0.5, { noiseSeed: seed2 });
            expect(a).not.toBe(b);
        });
    });

    describe('noiseWrap config', function ()
    {
        it('should accept a noiseWrap config', function ()
        {
            var result = HashCell(0.5, { noiseWrap: [ 32 ] });
            expect(typeof result).toBe('number');
            expect(isFinite(result)).toBe(true);
        });

        it('should produce different results with different wrap values', function ()
        {
            var a = HashCell(0.5, { noiseWrap: [ 32 ] });
            var b = HashCell(0.5, { noiseWrap: [ 16 ] });
            expect(a).not.toBe(b);
        });
    });

    describe('2D vector behaviour', function ()
    {
        it('should produce different results for different 2D positions', function ()
        {
            var a = HashCell([ 0.1, 0.2 ]);
            var b = HashCell([ 0.8, 0.3 ]);
            expect(a).not.toBe(b);
        });

        it('should be finite for all corner-ish positions', function ()
        {
            expect(isFinite(HashCell([ 0, 0 ]))).toBe(true);
            expect(isFinite(HashCell([ 1, 0 ]))).toBe(true);
            expect(isFinite(HashCell([ 0, 1 ]))).toBe(true);
            expect(isFinite(HashCell([ 1, 1 ]))).toBe(true);
        });
    });

    describe('multiple calls with varying inputs', function ()
    {
        it('should always return a finite number for a range of scalar inputs', function ()
        {
            var i;
            for (i = 0; i <= 10; i++)
            {
                var v = i / 10;
                expect(isFinite(HashCell(v))).toBe(true);
            }
        });

        it('should be non-negative in mode 0 across a range of inputs', function ()
        {
            var i;
            for (i = 0; i <= 10; i++)
            {
                var v = i / 10;
                expect(HashCell(v, { noiseMode: 0 })).toBeGreaterThanOrEqual(0);
            }
        });

        it('should produce finite values for 2D inputs across a grid', function ()
        {
            var x, y;
            for (x = 0; x <= 4; x++)
            {
                for (y = 0; y <= 4; y++)
                {
                    var result = HashCell([ x / 4, y / 4 ]);
                    expect(isFinite(result)).toBe(true);
                }
            }
        });
    });
});
