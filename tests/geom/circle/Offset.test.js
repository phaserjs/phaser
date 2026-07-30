var Offset = require('../../../src/geom/circle/Offset');

describe('Phaser.Geom.Circle.Offset', function ()
{
    var circle;

    beforeEach(function ()
    {
        circle = { x: 0, y: 0, radius: 10 };
    });

    it('should offset the circle x and y by the given values', function ()
    {
        Offset(circle, 5, 10);

        expect(circle.x).toBe(5);
        expect(circle.y).toBe(10);
    });

    it('should return the same circle object', function ()
    {
        var result = Offset(circle, 5, 10);

        expect(result).toBe(circle);
    });

    it('should offset by zero without changing the position', function ()
    {
        circle.x = 100;
        circle.y = 200;

        Offset(circle, 0, 0);

        expect(circle.x).toBe(100);
        expect(circle.y).toBe(200);
    });

    it('should offset by negative values', function ()
    {
        circle.x = 10;
        circle.y = 20;

        Offset(circle, -5, -8);

        expect(circle.x).toBe(5);
        expect(circle.y).toBe(12);
    });

    it('should accumulate multiple offsets', function ()
    {
        Offset(circle, 10, 20);
        Offset(circle, 5, -5);

        expect(circle.x).toBe(15);
        expect(circle.y).toBe(15);
    });

    it('should handle floating point offsets', function ()
    {
        Offset(circle, 1.5, 2.7);

        expect(circle.x).toBeCloseTo(1.5);
        expect(circle.y).toBeCloseTo(2.7);
    });

    it('should not modify the radius', function ()
    {
        Offset(circle, 50, 50);

        expect(circle.radius).toBe(10);
    });

    it('should work with a non-zero starting position', function ()
    {
        circle.x = 100;
        circle.y = -50;

        Offset(circle, 25, 75);

        expect(circle.x).toBe(125);
        expect(circle.y).toBe(25);
    });

    it('should handle large offset values', function ()
    {
        Offset(circle, 1000000, -1000000);

        expect(circle.x).toBe(1000000);
        expect(circle.y).toBe(-1000000);
    });
});
