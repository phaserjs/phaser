var Offset = require('../../../src/geom/rectangle/Offset');

describe('Phaser.Geom.Rectangle.Offset', function ()
{
    var rect;

    beforeEach(function ()
    {
        rect = { x: 10, y: 20, width: 100, height: 50 };
    });

    it('should return the same rectangle object', function ()
    {
        var result = Offset(rect, 5, 5);

        expect(result).toBe(rect);
    });

    it('should offset x and y by positive values', function ()
    {
        Offset(rect, 5, 10);

        expect(rect.x).toBe(15);
        expect(rect.y).toBe(30);
    });

    it('should offset x and y by negative values', function ()
    {
        Offset(rect, -5, -10);

        expect(rect.x).toBe(5);
        expect(rect.y).toBe(10);
    });

    it('should not change width or height', function ()
    {
        Offset(rect, 99, 99);

        expect(rect.width).toBe(100);
        expect(rect.height).toBe(50);
    });

    it('should do nothing when both offsets are zero', function ()
    {
        Offset(rect, 0, 0);

        expect(rect.x).toBe(10);
        expect(rect.y).toBe(20);
    });

    it('should offset only x when y is zero', function ()
    {
        Offset(rect, 7, 0);

        expect(rect.x).toBe(17);
        expect(rect.y).toBe(20);
    });

    it('should offset only y when x is zero', function ()
    {
        Offset(rect, 0, 3);

        expect(rect.x).toBe(10);
        expect(rect.y).toBe(23);
    });

    it('should work with floating point offsets', function ()
    {
        Offset(rect, 1.5, 2.5);

        expect(rect.x).toBeCloseTo(11.5);
        expect(rect.y).toBeCloseTo(22.5);
    });

    it('should move rectangle to negative coordinates', function ()
    {
        Offset(rect, -50, -50);

        expect(rect.x).toBe(-40);
        expect(rect.y).toBe(-30);
    });

    it('should accumulate multiple offsets', function ()
    {
        Offset(rect, 5, 5);
        Offset(rect, 5, 5);

        expect(rect.x).toBe(20);
        expect(rect.y).toBe(30);
    });

    it('should work when starting from zero position', function ()
    {
        rect.x = 0;
        rect.y = 0;

        Offset(rect, 10, 20);

        expect(rect.x).toBe(10);
        expect(rect.y).toBe(20);
    });
});
