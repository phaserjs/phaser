var RotateTo = require('../../../src/math/angle/RotateTo');

var PI = Math.PI;
var TAU = PI * 2;

describe('Phaser.Math.Angle.RotateTo', function ()
{
    it('should return currentAngle unchanged when it equals targetAngle', function ()
    {
        expect(RotateTo(1.0, 1.0)).toBe(1.0);
        expect(RotateTo(0, 0)).toBe(0);
        expect(RotateTo(-PI, -PI)).toBe(-PI);
    });

    it('should use default lerp of 0.05 when not specified', function ()
    {
        var result = RotateTo(0, PI);
        expect(result).toBeCloseTo(0.05, 10);
    });

    it('should step towards a larger targetAngle by lerp', function ()
    {
        expect(RotateTo(0, PI, 0.1)).toBeCloseTo(0.1, 10);
        expect(RotateTo(0.5, PI, 0.2)).toBeCloseTo(0.7, 10);
    });

    it('should step towards a smaller targetAngle by lerp', function ()
    {
        expect(RotateTo(PI, 0, 0.1)).toBeCloseTo(PI - 0.1, 10);
        expect(RotateTo(1.0, 0.5, 0.1)).toBeCloseTo(0.9, 10);
    });

    it('should snap to targetAngle when difference is exactly equal to lerp', function ()
    {
        expect(RotateTo(0, 0.1, 0.1)).toBe(0.1);
        expect(RotateTo(1.0, 1.1, 0.1)).toBe(1.1);
    });

    it('should snap to targetAngle when difference is less than lerp', function ()
    {
        expect(RotateTo(0, 0.05, 0.1)).toBe(0.05);
        expect(RotateTo(1.0, 1.03, 0.1)).toBe(1.03);
    });

    it('should snap to targetAngle when difference is less than lerp in negative direction', function ()
    {
        expect(RotateTo(0.1, 0, 0.1)).toBe(0);
        expect(RotateTo(1.03, 1.0, 0.1)).toBe(1.0);
    });

    it('should snap when angle difference is >= TAU - lerp (near full circle)', function ()
    {
        var current = 0;
        var target = TAU - 0.04;
        expect(RotateTo(current, target, 0.05)).toBe(target);
    });

    it('should take the shortest path when crossing the PI boundary going negative', function ()
    {
        // currentAngle near +PI, targetAngle near -PI — shortest path wraps
        // diff = -PI - PI = -2PI, abs > PI so we add TAU to targetAngle
        var current = PI - 0.1;
        var target = -(PI - 0.1);
        var result = RotateTo(current, target, 0.1);
        // Should rotate away from target directly (short path is wrapping), so currentAngle increases
        expect(result).toBeCloseTo(current + 0.1, 10);
    });

    it('should take the shortest path when crossing the PI boundary going positive', function ()
    {
        var current = -(PI - 0.1);
        var target = PI - 0.1;
        var result = RotateTo(current, target, 0.1);
        // Shortest path is wrapping, so currentAngle decreases
        expect(result).toBeCloseTo(current - 0.1, 10);
    });

    it('should handle zero current angle rotating to positive target', function ()
    {
        expect(RotateTo(0, 1, 0.1)).toBeCloseTo(0.1, 10);
    });

    it('should handle zero current angle rotating to negative target', function ()
    {
        expect(RotateTo(0, -1, 0.1)).toBeCloseTo(-0.1, 10);
    });

    it('should handle negative current angle rotating towards zero', function ()
    {
        expect(RotateTo(-1, 0, 0.1)).toBeCloseTo(-0.9, 10);
    });

    it('should handle very small lerp values', function ()
    {
        var result = RotateTo(0, PI, 0.001);
        expect(result).toBeCloseTo(0.001, 10);
    });

    it('should handle lerp larger than the remaining distance and snap', function ()
    {
        expect(RotateTo(0, 0.5, 1.0)).toBe(0.5);
        expect(RotateTo(1.0, 0, 1.5)).toBe(0);
    });

    it('should converge to targetAngle after repeated calls', function ()
    {
        var current = 0;
        var target = 1;
        var lerp = 0.1;
        for (var i = 0; i < 20; i++)
        {
            current = RotateTo(current, target, lerp);
        }
        expect(current).toBe(target);
    });

    it('should converge to targetAngle after repeated calls in negative direction', function ()
    {
        var current = 1;
        var target = 0;
        var lerp = 0.1;
        for (var i = 0; i < 20; i++)
        {
            current = RotateTo(current, target, lerp);
        }
        expect(current).toBe(target);
    });

    it('should return a number', function ()
    {
        expect(typeof RotateTo(0, 1)).toBe('number');
        expect(typeof RotateTo(0, 0)).toBe('number');
    });

    it('should handle floating point angle values', function ()
    {
        var result = RotateTo(0.123456, 0.987654, 0.1);
        expect(result).toBeCloseTo(0.223456, 5);
    });

    it('should handle currentAngle equal to PI', function ()
    {
        var result = RotateTo(PI, 0, 0.1);
        // diff = 0 - PI = -PI, abs is exactly PI so no wrap adjustment
        expect(result).toBeCloseTo(PI - 0.1, 10);
    });

    it('should handle large lerp that equals TAU snapping to target', function ()
    {
        // When lerp >= TAU, difference <= lerp is always true — snaps immediately
        expect(RotateTo(0, PI, TAU)).toBe(PI);
    });
});
