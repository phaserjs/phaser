var GetOffsetX = require('../../../src/display/bounds/GetOffsetX');

describe('Phaser.Display.Bounds.GetOffsetX', function ()
{
    it('should return zero when originX is zero', function ()
    {
        var gameObject = { width: 100, originX: 0 };
        expect(GetOffsetX(gameObject)).toBe(0);
    });

    it('should return width when originX is one', function ()
    {
        var gameObject = { width: 100, originX: 1 };
        expect(GetOffsetX(gameObject)).toBe(100);
    });

    it('should return half width when originX is 0.5', function ()
    {
        var gameObject = { width: 200, originX: 0.5 };
        expect(GetOffsetX(gameObject)).toBe(100);
    });

    it('should return correct value for arbitrary width and originX', function ()
    {
        var gameObject = { width: 80, originX: 0.25 };
        expect(GetOffsetX(gameObject)).toBe(20);
    });

    it('should return zero when width is zero', function ()
    {
        var gameObject = { width: 0, originX: 0.5 };
        expect(GetOffsetX(gameObject)).toBe(0);
    });

    it('should handle floating point width and originX', function ()
    {
        var gameObject = { width: 33.3, originX: 0.3 };
        expect(GetOffsetX(gameObject)).toBeCloseTo(9.99);
    });

    it('should handle negative width', function ()
    {
        var gameObject = { width: -100, originX: 0.5 };
        expect(GetOffsetX(gameObject)).toBe(-50);
    });

    it('should handle originX greater than one', function ()
    {
        var gameObject = { width: 100, originX: 2 };
        expect(GetOffsetX(gameObject)).toBe(200);
    });

    it('should handle negative originX', function ()
    {
        var gameObject = { width: 100, originX: -0.5 };
        expect(GetOffsetX(gameObject)).toBe(-50);
    });

    it('should return a number type', function ()
    {
        var gameObject = { width: 64, originX: 0.5 };
        expect(typeof GetOffsetX(gameObject)).toBe('number');
    });
});
