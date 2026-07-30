var Offset = require('../../../src/geom/ellipse/Offset');

describe('Phaser.Geom.Ellipse.Offset', function ()
{
    var ellipse;

    beforeEach(function ()
    {
        ellipse = { x: 0, y: 0, width: 100, height: 50 };
    });

    it('should offset the ellipse x and y by the given values', function ()
    {
        Offset(ellipse, 10, 20);

        expect(ellipse.x).toBe(10);
        expect(ellipse.y).toBe(20);
    });

    it('should return the ellipse object', function ()
    {
        var result = Offset(ellipse, 5, 5);

        expect(result).toBe(ellipse);
    });

    it('should add offset to existing position', function ()
    {
        ellipse.x = 100;
        ellipse.y = 200;

        Offset(ellipse, 50, 75);

        expect(ellipse.x).toBe(150);
        expect(ellipse.y).toBe(275);
    });

    it('should offset by zero leaving position unchanged', function ()
    {
        ellipse.x = 10;
        ellipse.y = 20;

        Offset(ellipse, 0, 0);

        expect(ellipse.x).toBe(10);
        expect(ellipse.y).toBe(20);
    });

    it('should offset by negative values', function ()
    {
        ellipse.x = 100;
        ellipse.y = 100;

        Offset(ellipse, -30, -50);

        expect(ellipse.x).toBe(70);
        expect(ellipse.y).toBe(50);
    });

    it('should offset by floating point values', function ()
    {
        ellipse.x = 1.5;
        ellipse.y = 2.5;

        Offset(ellipse, 0.1, 0.2);

        expect(ellipse.x).toBeCloseTo(1.6);
        expect(ellipse.y).toBeCloseTo(2.7);
    });

    it('should not modify width or height', function ()
    {
        ellipse.width = 100;
        ellipse.height = 50;

        Offset(ellipse, 10, 20);

        expect(ellipse.width).toBe(100);
        expect(ellipse.height).toBe(50);
    });

    it('should handle large offset values', function ()
    {
        Offset(ellipse, 999999, 999999);

        expect(ellipse.x).toBe(999999);
        expect(ellipse.y).toBe(999999);
    });

    it('should handle negative result positions', function ()
    {
        ellipse.x = 5;
        ellipse.y = 5;

        Offset(ellipse, -10, -10);

        expect(ellipse.x).toBe(-5);
        expect(ellipse.y).toBe(-5);
    });
});
