var Scale = require('../../../src/geom/rectangle/Scale');

describe('Phaser.Geom.Rectangle.Scale', function ()
{
    var rect;

    beforeEach(function ()
    {
        rect = { x: 0, y: 0, width: 100, height: 50 };
    });

    it('should scale width and height by separate x and y factors', function ()
    {
        Scale(rect, 2, 3);

        expect(rect.width).toBe(200);
        expect(rect.height).toBe(150);
    });

    it('should scale uniformly when only x is provided', function ()
    {
        Scale(rect, 2);

        expect(rect.width).toBe(200);
        expect(rect.height).toBe(100);
    });

    it('should return the same rectangle object', function ()
    {
        var result = Scale(rect, 2, 3);

        expect(result).toBe(rect);
    });

    it('should not modify x or y position', function ()
    {
        rect.x = 10;
        rect.y = 20;

        Scale(rect, 2, 3);

        expect(rect.x).toBe(10);
        expect(rect.y).toBe(20);
    });

    it('should scale by 1 leaving dimensions unchanged', function ()
    {
        Scale(rect, 1, 1);

        expect(rect.width).toBe(100);
        expect(rect.height).toBe(50);
    });

    it('should scale to zero when factor is zero', function ()
    {
        Scale(rect, 0, 0);

        expect(rect.width).toBe(0);
        expect(rect.height).toBe(0);
    });

    it('should scale with zero x factor only', function ()
    {
        Scale(rect, 0, 2);

        expect(rect.width).toBe(0);
        expect(rect.height).toBe(100);
    });

    it('should scale with zero y factor only', function ()
    {
        Scale(rect, 2, 0);

        expect(rect.width).toBe(200);
        expect(rect.height).toBe(0);
    });

    it('should scale by fractional values', function ()
    {
        Scale(rect, 0.5, 0.25);

        expect(rect.width).toBe(50);
        expect(rect.height).toBe(12.5);
    });

    it('should scale by negative factors', function ()
    {
        Scale(rect, -1, -2);

        expect(rect.width).toBe(-100);
        expect(rect.height).toBe(-100);
    });

    it('should scale with floating point factors correctly', function ()
    {
        Scale(rect, 1.5, 2.5);

        expect(rect.width).toBeCloseTo(150);
        expect(rect.height).toBeCloseTo(125);
    });

    it('should scale uniformly when y is undefined explicitly', function ()
    {
        Scale(rect, 3, undefined);

        expect(rect.width).toBe(300);
        expect(rect.height).toBe(150);
    });

    it('should handle a rectangle with zero dimensions', function ()
    {
        rect.width = 0;
        rect.height = 0;

        Scale(rect, 5, 5);

        expect(rect.width).toBe(0);
        expect(rect.height).toBe(0);
    });

    it('should handle large scale factors', function ()
    {
        Scale(rect, 1000, 1000);

        expect(rect.width).toBe(100000);
        expect(rect.height).toBe(50000);
    });

    it('should apply mixed positive and negative factors', function ()
    {
        Scale(rect, 2, -1);

        expect(rect.width).toBe(200);
        expect(rect.height).toBe(-50);
    });
});
