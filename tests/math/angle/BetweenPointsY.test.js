var BetweenPointsY = require('../../../src/math/angle/BetweenPointsY');

describe('Phaser.Math.Angle.BetweenPointsY', function ()
{
    it('should return zero when point2 is directly below point1', function ()
    {
        var p1 = { x: 0, y: 0 };
        var p2 = { x: 0, y: 1 };

        expect(BetweenPointsY(p1, p2)).toBeCloseTo(0);
    });

    it('should return PI when point2 is directly above point1', function ()
    {
        var p1 = { x: 0, y: 1 };
        var p2 = { x: 0, y: 0 };

        expect(Math.abs(BetweenPointsY(p1, p2))).toBeCloseTo(Math.PI);
    });

    it('should return PI/2 when point2 is directly to the right of point1', function ()
    {
        var p1 = { x: 0, y: 0 };
        var p2 = { x: 1, y: 0 };

        expect(BetweenPointsY(p1, p2)).toBeCloseTo(Math.PI / 2);
    });

    it('should return -PI/2 when point2 is directly to the left of point1', function ()
    {
        var p1 = { x: 1, y: 0 };
        var p2 = { x: 0, y: 0 };

        expect(BetweenPointsY(p1, p2)).toBeCloseTo(-Math.PI / 2);
    });

    it('should return zero when both points are identical', function ()
    {
        var p1 = { x: 5, y: 5 };
        var p2 = { x: 5, y: 5 };

        expect(BetweenPointsY(p1, p2)).toBeCloseTo(0);
    });

    it('should return PI/4 for a diagonal point down-right', function ()
    {
        var p1 = { x: 0, y: 0 };
        var p2 = { x: 1, y: 1 };

        expect(BetweenPointsY(p1, p2)).toBeCloseTo(Math.PI / 4);
    });

    it('should return -PI/4 for a diagonal point down-left', function ()
    {
        var p1 = { x: 0, y: 0 };
        var p2 = { x: -1, y: 1 };

        expect(BetweenPointsY(p1, p2)).toBeCloseTo(-Math.PI / 4);
    });

    it('should work with negative coordinates', function ()
    {
        var p1 = { x: -5, y: -5 };
        var p2 = { x: -5, y: -4 };

        expect(BetweenPointsY(p1, p2)).toBeCloseTo(0);
    });

    it('should work with floating point coordinates', function ()
    {
        var p1 = { x: 0.5, y: 0.5 };
        var p2 = { x: 0.5, y: 1.5 };

        expect(BetweenPointsY(p1, p2)).toBeCloseTo(0);
    });

    it('should return a number', function ()
    {
        var p1 = { x: 1, y: 2 };
        var p2 = { x: 3, y: 4 };

        expect(typeof BetweenPointsY(p1, p2)).toBe('number');
    });

    it('should return values in the range -PI to PI', function ()
    {
        var points = [
            [{ x: 0, y: 0 }, { x: 1, y: 1 }],
            [{ x: 0, y: 0 }, { x: -1, y: -1 }],
            [{ x: 10, y: 10 }, { x: -10, y: -10 }],
            [{ x: 0, y: 0 }, { x: 100, y: 0 }],
            [{ x: 0, y: 0 }, { x: 0, y: 100 }]
        ];

        for (var i = 0; i < points.length; i++)
        {
            var result = BetweenPointsY(points[i][0], points[i][1]);

            expect(result).toBeGreaterThanOrEqual(-Math.PI);
            expect(result).toBeLessThanOrEqual(Math.PI);
        }
    });

    it('should measure from Y axis unlike BetweenPoints which uses X axis', function ()
    {
        var p1 = { x: 0, y: 0 };
        var p2 = { x: 0, y: 1 };

        // Pointing straight down: atan2(0, 1) = 0 (Y axis reference)
        expect(BetweenPointsY(p1, p2)).toBeCloseTo(0);
    });
});
