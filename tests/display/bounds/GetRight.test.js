var GetRight = require('../../../src/display/bounds/GetRight');

describe('Phaser.Display.Bounds.GetRight', function ()
{
    it('should return x + width when originX is 0', function ()
    {
        var gameObject = { x: 10, width: 100, originX: 0 };
        expect(GetRight(gameObject)).toBe(110);
    });

    it('should return x when originX is 1', function ()
    {
        var gameObject = { x: 10, width: 100, originX: 1 };
        expect(GetRight(gameObject)).toBe(10);
    });

    it('should return x + half width when originX is 0.5', function ()
    {
        var gameObject = { x: 10, width: 100, originX: 0.5 };
        expect(GetRight(gameObject)).toBe(60);
    });

    it('should return correct value for default origin at center', function ()
    {
        var gameObject = { x: 200, width: 64, originX: 0.5 };
        expect(GetRight(gameObject)).toBe(232);
    });

    it('should work with zero x position', function ()
    {
        var gameObject = { x: 0, width: 50, originX: 0 };
        expect(GetRight(gameObject)).toBe(50);
    });

    it('should work with zero width', function ()
    {
        var gameObject = { x: 100, width: 0, originX: 0.5 };
        expect(GetRight(gameObject)).toBe(100);
    });

    it('should work with negative x position', function ()
    {
        var gameObject = { x: -100, width: 50, originX: 0 };
        expect(GetRight(gameObject)).toBe(-50);
    });

    it('should work with negative x and centered origin', function ()
    {
        var gameObject = { x: -100, width: 50, originX: 0.5 };
        expect(GetRight(gameObject)).toBe(-75);
    });

    it('should work with floating point x values', function ()
    {
        var gameObject = { x: 10.5, width: 100, originX: 0 };
        expect(GetRight(gameObject)).toBeCloseTo(110.5);
    });

    it('should work with floating point width values', function ()
    {
        var gameObject = { x: 0, width: 33.3, originX: 0 };
        expect(GetRight(gameObject)).toBeCloseTo(33.3);
    });

    it('should work with floating point originX values', function ()
    {
        var gameObject = { x: 100, width: 200, originX: 0.25 };
        expect(GetRight(gameObject)).toBeCloseTo(250);
    });

    it('should return x + width - (width * originX) formula correctly', function ()
    {
        var gameObject = { x: 50, width: 80, originX: 0.75 };
        expect(GetRight(gameObject)).toBeCloseTo(50 + 80 - (80 * 0.75));
    });

    it('should work with large coordinate values', function ()
    {
        var gameObject = { x: 10000, width: 500, originX: 0 };
        expect(GetRight(gameObject)).toBe(10500);
    });

    it('should work when all values are zero', function ()
    {
        var gameObject = { x: 0, width: 0, originX: 0 };
        expect(GetRight(gameObject)).toBe(0);
    });
});
