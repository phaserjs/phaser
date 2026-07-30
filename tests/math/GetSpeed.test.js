var GetSpeed = require('../../src/math/GetSpeed');

describe('Phaser.Math.GetSpeed', function ()
{
    it('should return 0.4 for 400px over 1 second', function ()
    {
        expect(GetSpeed(400, 1)).toBeCloseTo(0.4);
    });

    it('should return pixels per millisecond', function ()
    {
        // 1000px over 1 second = 1 px/ms
        expect(GetSpeed(1000, 1)).toBeCloseTo(1);
    });

    it('should divide by 1000 to convert seconds to milliseconds', function ()
    {
        expect(GetSpeed(1000, 1)).toBeCloseTo(1);
        expect(GetSpeed(1000, 2)).toBeCloseTo(0.5);
    });

    it('should handle zero distance', function ()
    {
        expect(GetSpeed(0, 1)).toBe(0);
    });

    it('should handle large distances', function ()
    {
        expect(GetSpeed(100000, 1)).toBeCloseTo(100);
    });

    it('should handle fractional time values', function ()
    {
        // 400px over 0.5 seconds = 800 px/s = 0.8 px/ms
        expect(GetSpeed(400, 0.5)).toBeCloseTo(0.8);
    });

    it('should handle negative distance', function ()
    {
        expect(GetSpeed(-400, 1)).toBeCloseTo(-0.4);
    });

    it('should handle negative time', function ()
    {
        expect(GetSpeed(400, -1)).toBeCloseTo(-0.4);
    });

    it('should handle small distances', function ()
    {
        // 1px over 1 second = 0.001 px/ms
        expect(GetSpeed(1, 1)).toBeCloseTo(0.001);
    });

    it('should handle floating point distance and time', function ()
    {
        expect(GetSpeed(1.5, 0.5)).toBeCloseTo(0.003);
    });

    it('should return Infinity when time is zero', function ()
    {
        expect(GetSpeed(400, 0)).toBe(Infinity);
    });

    it('should return NaN when both distance and time are zero', function ()
    {
        expect(GetSpeed(0, 0)).toBeNaN();
    });
});
