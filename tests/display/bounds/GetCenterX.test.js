var GetCenterX = require('../../../src/display/bounds/GetCenterX');

describe('Phaser.Display.Bounds.GetCenterX', function ()
{
    it('should return center x when origin is 0.5 and x is at center', function ()
    {
        var gameObject = { x: 100, width: 200, originX: 0.5 };
        expect(GetCenterX(gameObject)).toBe(100);
    });

    it('should return center x when origin is 0 (left-aligned)', function ()
    {
        var gameObject = { x: 100, width: 200, originX: 0 };
        expect(GetCenterX(gameObject)).toBe(200);
    });

    it('should return center x when origin is 1 (right-aligned)', function ()
    {
        var gameObject = { x: 300, width: 200, originX: 1 };
        expect(GetCenterX(gameObject)).toBe(200);
    });

    it('should return x when width is zero', function ()
    {
        var gameObject = { x: 50, width: 0, originX: 0.5 };
        expect(GetCenterX(gameObject)).toBe(50);
    });

    it('should handle negative x values', function ()
    {
        var gameObject = { x: -100, width: 200, originX: 0.5 };
        expect(GetCenterX(gameObject)).toBe(-100);
    });

    it('should handle zero x value', function ()
    {
        var gameObject = { x: 0, width: 100, originX: 0 };
        expect(GetCenterX(gameObject)).toBe(50);
    });

    it('should handle floating point x and width', function ()
    {
        var gameObject = { x: 10.5, width: 100, originX: 0.5 };
        expect(GetCenterX(gameObject)).toBeCloseTo(10.5);
    });

    it('should handle floating point origin', function ()
    {
        var gameObject = { x: 100, width: 200, originX: 0.25 };
        // x - (200 * 0.25) + (200 * 0.5) = 100 - 50 + 100 = 150
        expect(GetCenterX(gameObject)).toBe(150);
    });

    it('should handle large width values', function ()
    {
        var gameObject = { x: 1000, width: 800, originX: 0.5 };
        // 1000 - (800 * 0.5) + (800 * 0.5) = 1000
        expect(GetCenterX(gameObject)).toBe(1000);
    });

    it('should handle negative width', function ()
    {
        var gameObject = { x: 100, width: -200, originX: 0.5 };
        // 100 - (-200 * 0.5) + (-200 * 0.5) = 100 - (-100) + (-100) = 100
        expect(GetCenterX(gameObject)).toBe(100);
    });

    it('should return correct value for typical game object placement', function ()
    {
        var gameObject = { x: 400, width: 64, originX: 0.5 };
        // 400 - (64 * 0.5) + (64 * 0.5) = 400
        expect(GetCenterX(gameObject)).toBe(400);
    });

    it('should return correct value when origin is 0 and x is at left edge', function ()
    {
        var gameObject = { x: 0, width: 64, originX: 0 };
        // 0 - 0 + 32 = 32
        expect(GetCenterX(gameObject)).toBe(32);
    });
});
