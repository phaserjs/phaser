var WrapDegrees = require('../../../src/math/angle/WrapDegrees');

describe('Phaser.Math.Angle.WrapDegrees', function ()
{
    it('should return the angle unchanged when within range', function ()
    {
        expect(WrapDegrees(0)).toBe(0);
        expect(WrapDegrees(90)).toBe(90);
        expect(WrapDegrees(-90)).toBe(-90);
    });

    it('should return -180 for an angle of -180', function ()
    {
        expect(WrapDegrees(-180)).toBe(-180);
    });

    it('should wrap 180 degrees to -180', function ()
    {
        expect(WrapDegrees(180)).toBe(-180);
    });

    it('should wrap 360 degrees to 0', function ()
    {
        expect(WrapDegrees(360)).toBe(0);
    });

    it('should wrap 270 degrees to -90', function ()
    {
        expect(WrapDegrees(270)).toBe(-90);
    });

    it('should wrap -270 degrees to 90', function ()
    {
        expect(WrapDegrees(-270)).toBe(90);
    });

    it('should wrap -360 degrees to 0', function ()
    {
        expect(WrapDegrees(-360)).toBe(0);
    });

    it('should wrap values greater than 360', function ()
    {
        expect(WrapDegrees(540)).toBe(-180);
        expect(WrapDegrees(720)).toBe(0);
    });

    it('should wrap values less than -360', function ()
    {
        expect(WrapDegrees(-540)).toBe(-180);
        expect(WrapDegrees(-720)).toBe(0);
    });

    it('should handle floating point angles', function ()
    {
        expect(WrapDegrees(180.5)).toBeCloseTo(-179.5, 5);
        expect(WrapDegrees(-180.5)).toBeCloseTo(179.5, 5);
    });

    it('should return a value in the range [-180, 180)', function ()
    {
        var angles = [ -1000, -720, -540, -360, -270, -180, -90, 0, 90, 180, 270, 360, 540, 720, 1000 ];

        for (var i = 0; i < angles.length; i++)
        {
            var result = WrapDegrees(angles[i]);
            expect(result).toBeGreaterThanOrEqual(-180);
            expect(result).toBeLessThan(180);
        }
    });
});
