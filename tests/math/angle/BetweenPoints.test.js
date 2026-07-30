var BetweenPoints = require('../../../src/math/angle/BetweenPoints');

describe('Phaser.Math.Angle.BetweenPoints', function ()
{
    it('should return zero when both points are the same', function ()
    {
        expect(BetweenPoints({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
    });

    it('should return zero when points are on the same horizontal line pointing right', function ()
    {
        expect(BetweenPoints({ x: 0, y: 0 }, { x: 5, y: 0 })).toBe(0);
    });

    it('should return PI when pointing left', function ()
    {
        expect(BetweenPoints({ x: 5, y: 0 }, { x: 0, y: 0 })).toBeCloseTo(Math.PI);
    });

    it('should return PI/2 when pointing down', function ()
    {
        expect(BetweenPoints({ x: 0, y: 0 }, { x: 0, y: 5 })).toBeCloseTo(Math.PI / 2);
    });

    it('should return -PI/2 when pointing up', function ()
    {
        expect(BetweenPoints({ x: 0, y: 5 }, { x: 0, y: 0 })).toBeCloseTo(-Math.PI / 2);
    });

    it('should return PI/4 for a 45-degree angle', function ()
    {
        expect(BetweenPoints({ x: 0, y: 0 }, { x: 1, y: 1 })).toBeCloseTo(Math.PI / 4);
    });

    it('should return -PI/4 for a -45-degree angle', function ()
    {
        expect(BetweenPoints({ x: 0, y: 0 }, { x: 1, y: -1 })).toBeCloseTo(-Math.PI / 4);
    });

    it('should work with negative coordinates', function ()
    {
        expect(BetweenPoints({ x: -5, y: 0 }, { x: 0, y: 0 })).toBeCloseTo(0);
        expect(BetweenPoints({ x: 0, y: 0 }, { x: -5, y: 0 })).toBeCloseTo(Math.PI);
    });

    it('should work with floating point coordinates', function ()
    {
        expect(BetweenPoints({ x: 0.5, y: 0.5 }, { x: 1.5, y: 1.5 })).toBeCloseTo(Math.PI / 4);
    });

    it('should return the same result regardless of distance along the same direction', function ()
    {
        var angle1 = BetweenPoints({ x: 0, y: 0 }, { x: 1, y: 0 });
        var angle2 = BetweenPoints({ x: 0, y: 0 }, { x: 100, y: 0 });
        expect(angle1).toBeCloseTo(angle2);
    });

    it('should return a value in the range [-PI, PI]', function ()
    {
        var points = [
            [{ x: 0, y: 0 }, { x: 1, y: 0 }],
            [{ x: 0, y: 0 }, { x: -1, y: 0 }],
            [{ x: 0, y: 0 }, { x: 0, y: 1 }],
            [{ x: 0, y: 0 }, { x: 0, y: -1 }],
            [{ x: 0, y: 0 }, { x: 1, y: 1 }],
            [{ x: 0, y: 0 }, { x: -1, y: -1 }]
        ];

        for (var i = 0; i < points.length; i++)
        {
            var result = BetweenPoints(points[i][0], points[i][1]);
            expect(result).toBeGreaterThanOrEqual(-Math.PI);
            expect(result).toBeLessThanOrEqual(Math.PI);
        }
    });

    it('should work with non-origin start points', function ()
    {
        expect(BetweenPoints({ x: 3, y: 3 }, { x: 6, y: 3 })).toBeCloseTo(0);
        expect(BetweenPoints({ x: 3, y: 3 }, { x: 3, y: 6 })).toBeCloseTo(Math.PI / 2);
    });
});
