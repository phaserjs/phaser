var GetCenterY = require('../../../src/display/bounds/GetCenterY');

describe('Phaser.Display.Bounds.GetCenterY', function ()
{
    it('should return center y when origin is 0.5 and y is at center of height', function ()
    {
        var gameObject = { y: 50, height: 100, originY: 0.5 };

        expect(GetCenterY(gameObject)).toBe(50);
    });

    it('should return center y when origin is 0 (top-left)', function ()
    {
        var gameObject = { y: 0, height: 100, originY: 0 };

        expect(GetCenterY(gameObject)).toBe(50);
    });

    it('should return center y when origin is 1 (bottom)', function ()
    {
        var gameObject = { y: 100, height: 100, originY: 1 };

        expect(GetCenterY(gameObject)).toBe(50);
    });

    it('should return correct center y for arbitrary position and origin', function ()
    {
        var gameObject = { y: 200, height: 80, originY: 0.25 };

        // y - (height * originY) + (height * 0.5)
        // 200 - (80 * 0.25) + (80 * 0.5) = 200 - 20 + 40 = 220
        expect(GetCenterY(gameObject)).toBe(220);
    });

    it('should return zero when y is zero, origin is 0.5, and height is zero', function ()
    {
        var gameObject = { y: 0, height: 0, originY: 0.5 };

        expect(GetCenterY(gameObject)).toBe(0);
    });

    it('should handle zero height', function ()
    {
        var gameObject = { y: 150, height: 0, originY: 0.5 };

        expect(GetCenterY(gameObject)).toBe(150);
    });

    it('should handle negative y position', function ()
    {
        var gameObject = { y: -50, height: 100, originY: 0.5 };

        // -50 - (100 * 0.5) + (100 * 0.5) = -50
        expect(GetCenterY(gameObject)).toBe(-50);
    });

    it('should handle negative y with top-left origin', function ()
    {
        var gameObject = { y: -100, height: 60, originY: 0 };

        // -100 - 0 + 30 = -70
        expect(GetCenterY(gameObject)).toBe(-70);
    });

    it('should handle floating point height and origin', function ()
    {
        var gameObject = { y: 10, height: 33.3, originY: 0.5 };

        // 10 - (33.3 * 0.5) + (33.3 * 0.5) = 10
        expect(GetCenterY(gameObject)).toBeCloseTo(10, 5);
    });

    it('should handle fractional origin values', function ()
    {
        var gameObject = { y: 100, height: 200, originY: 0.75 };

        // 100 - (200 * 0.75) + (200 * 0.5) = 100 - 150 + 100 = 50
        expect(GetCenterY(gameObject)).toBe(50);
    });

    it('should handle large values', function ()
    {
        var gameObject = { y: 10000, height: 5000, originY: 0.5 };

        // 10000 - 2500 + 2500 = 10000
        expect(GetCenterY(gameObject)).toBe(10000);
    });

    it('should return a number', function ()
    {
        var gameObject = { y: 50, height: 100, originY: 0.5 };

        expect(typeof GetCenterY(gameObject)).toBe('number');
    });
});
