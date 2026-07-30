var GetLeft = require('../../../src/display/bounds/GetLeft');

describe('Phaser.Display.Bounds.GetLeft', function ()
{
    it('should return x when originX is zero', function ()
    {
        var gameObject = { x: 100, width: 200, originX: 0 };

        expect(GetLeft(gameObject)).toBe(100);
    });

    it('should return x minus half width when originX is 0.5', function ()
    {
        var gameObject = { x: 100, width: 200, originX: 0.5 };

        expect(GetLeft(gameObject)).toBe(0);
    });

    it('should return x minus full width when originX is 1', function ()
    {
        var gameObject = { x: 100, width: 200, originX: 1 };

        expect(GetLeft(gameObject)).toBe(-100);
    });

    it('should return x when width is zero', function ()
    {
        var gameObject = { x: 50, width: 0, originX: 0.5 };

        expect(GetLeft(gameObject)).toBe(50);
    });

    it('should work with x of zero', function ()
    {
        var gameObject = { x: 0, width: 100, originX: 0.5 };

        expect(GetLeft(gameObject)).toBe(-50);
    });

    it('should work with negative x', function ()
    {
        var gameObject = { x: -50, width: 100, originX: 0.5 };

        expect(GetLeft(gameObject)).toBe(-100);
    });

    it('should work with negative x and zero originX', function ()
    {
        var gameObject = { x: -50, width: 100, originX: 0 };

        expect(GetLeft(gameObject)).toBe(-50);
    });

    it('should work with floating point originX', function ()
    {
        var gameObject = { x: 100, width: 80, originX: 0.25 };

        expect(GetLeft(gameObject)).toBeCloseTo(80, 5);
    });

    it('should work with floating point x', function ()
    {
        var gameObject = { x: 10.5, width: 20, originX: 0.5 };

        expect(GetLeft(gameObject)).toBeCloseTo(0.5, 5);
    });

    it('should work with large values', function ()
    {
        var gameObject = { x: 10000, width: 5000, originX: 0.5 };

        expect(GetLeft(gameObject)).toBe(7500);
    });

    it('should return a number', function ()
    {
        var gameObject = { x: 100, width: 200, originX: 0.5 };

        expect(typeof GetLeft(gameObject)).toBe('number');
    });
});
