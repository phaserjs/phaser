var RandomXY = require('../../src/math/RandomXY');

describe('Phaser.Math.RandomXY', function ()
{
    it('should return the same vector object that was passed in', function ()
    {
        var vector = { x: 0, y: 0 };
        var result = RandomXY(vector);

        expect(result).toBe(vector);
    });

    it('should set x and y properties on the vector', function ()
    {
        var vector = { x: 0, y: 0 };
        RandomXY(vector);

        expect(typeof vector.x).toBe('number');
        expect(typeof vector.y).toBe('number');
    });

    it('should produce x and y values between -1 and 1 with default scale', function ()
    {
        var vector = { x: 0, y: 0 };

        for (var i = 0; i < 1000; i++)
        {
            RandomXY(vector);

            expect(vector.x).toBeGreaterThanOrEqual(-1);
            expect(vector.x).toBeLessThanOrEqual(1);
            expect(vector.y).toBeGreaterThanOrEqual(-1);
            expect(vector.y).toBeLessThanOrEqual(1);
        }
    });

    it('should use scale=1 when scale is not provided', function ()
    {
        var vector = { x: 0, y: 0 };

        for (var i = 0; i < 200; i++)
        {
            RandomXY(vector);
            var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            expect(length).toBeCloseTo(1, 10);
        }
    });

    it('should scale x and y values by the given scale', function ()
    {
        var vector = { x: 0, y: 0 };
        var scale = 5;

        for (var i = 0; i < 1000; i++)
        {
            RandomXY(vector, scale);

            expect(vector.x).toBeGreaterThanOrEqual(-5);
            expect(vector.x).toBeLessThanOrEqual(5);
            expect(vector.y).toBeGreaterThanOrEqual(-5);
            expect(vector.y).toBeLessThanOrEqual(5);
        }
    });

    it('should produce a unit vector of length equal to scale', function ()
    {
        var vector = { x: 0, y: 0 };
        var scale = 3;

        for (var i = 0; i < 200; i++)
        {
            RandomXY(vector, scale);
            var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            expect(length).toBeCloseTo(scale, 10);
        }
    });

    it('should work with a scale of 0', function ()
    {
        var vector = { x: 5, y: 5 };
        RandomXY(vector, 0);

        expect(vector.x).toBeCloseTo(0, 10);
        expect(vector.y).toBeCloseTo(0, 10);
    });

    it('should work with a negative scale', function ()
    {
        var vector = { x: 0, y: 0 };
        var scale = -2;

        for (var i = 0; i < 200; i++)
        {
            RandomXY(vector, scale);
            var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            expect(length).toBeCloseTo(Math.abs(scale), 10);
        }
    });

    it('should work with a fractional scale', function ()
    {
        var vector = { x: 0, y: 0 };
        var scale = 0.5;

        for (var i = 0; i < 200; i++)
        {
            RandomXY(vector, scale);
            var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            expect(length).toBeCloseTo(scale, 10);
        }
    });

    it('should overwrite existing vector values', function ()
    {
        var vector = { x: 999, y: 999 };
        RandomXY(vector, 1);

        expect(vector.x).not.toBe(999);
        expect(vector.y).not.toBe(999);
    });

    it('should produce varied results across multiple calls', function ()
    {
        var vector = { x: 0, y: 0 };
        var results = [];

        for (var i = 0; i < 100; i++)
        {
            RandomXY(vector);
            results.push(vector.x);
        }

        var allSame = results.every(function (val) { return val === results[0]; });
        expect(allSame).toBe(false);
    });

    it('should satisfy x^2 + y^2 = scale^2 (unit circle constraint)', function ()
    {
        var vector = { x: 0, y: 0 };
        var scale = 4;

        for (var i = 0; i < 200; i++)
        {
            RandomXY(vector, scale);
            var sumOfSquares = vector.x * vector.x + vector.y * vector.y;
            expect(sumOfSquares).toBeCloseTo(scale * scale, 10);
        }
    });
});
