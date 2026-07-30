var Inflate = require('../../../src/geom/rectangle/Inflate');

function makeRect(x, y, width, height)
{
    var rect = {
        x: x,
        y: y,
        width: width,
        height: height,
        get centerX() { return this.x + this.width / 2; },
        get centerY() { return this.y + this.height / 2; },
        setSize: function (w, h)
        {
            this.width = w;
            this.height = h;
            return this;
        }
    };

    return rect;
}

describe('Phaser.Geom.Rectangle.Inflate', function ()
{
    it('should return the rectangle', function ()
    {
        var rect = makeRect(0, 0, 100, 100);

        var result = Inflate(rect, 10, 10);

        expect(result).toBe(rect);
    });

    it('should increase width by twice the x argument', function ()
    {
        var rect = makeRect(0, 0, 100, 50);

        Inflate(rect, 10, 0);

        expect(rect.width).toBe(120);
    });

    it('should increase height by twice the y argument', function ()
    {
        var rect = makeRect(0, 0, 100, 50);

        Inflate(rect, 0, 20);

        expect(rect.height).toBe(90);
    });

    it('should increase both width and height', function ()
    {
        var rect = makeRect(0, 0, 100, 60);

        Inflate(rect, 5, 10);

        expect(rect.width).toBe(110);
        expect(rect.height).toBe(80);
    });

    it('should maintain the center X position after inflation', function ()
    {
        var rect = makeRect(0, 0, 100, 100);
        var cx = rect.centerX;

        Inflate(rect, 20, 0);

        expect(rect.centerX).toBeCloseTo(cx);
    });

    it('should maintain the center Y position after inflation', function ()
    {
        var rect = makeRect(0, 0, 100, 100);
        var cy = rect.centerY;

        Inflate(rect, 0, 30);

        expect(rect.centerY).toBeCloseTo(cy);
    });

    it('should maintain both center coordinates after inflation', function ()
    {
        var rect = makeRect(50, 50, 200, 100);
        var cx = rect.centerX;
        var cy = rect.centerY;

        Inflate(rect, 25, 15);

        expect(rect.centerX).toBeCloseTo(cx);
        expect(rect.centerY).toBeCloseTo(cy);
    });

    it('should adjust x so the left edge moves left by the x argument', function ()
    {
        var rect = makeRect(0, 0, 100, 100);

        Inflate(rect, 10, 0);

        expect(rect.x).toBeCloseTo(-10);
    });

    it('should adjust y so the top edge moves up by the y argument', function ()
    {
        var rect = makeRect(0, 0, 100, 100);

        Inflate(rect, 0, 15);

        expect(rect.y).toBeCloseTo(-15);
    });

    it('should handle zero inflation without changing size or position', function ()
    {
        var rect = makeRect(10, 20, 80, 60);

        Inflate(rect, 0, 0);

        expect(rect.width).toBe(80);
        expect(rect.height).toBe(60);
        expect(rect.x).toBeCloseTo(10);
        expect(rect.y).toBeCloseTo(20);
    });

    it('should deflate when given negative values', function ()
    {
        var rect = makeRect(0, 0, 100, 80);

        Inflate(rect, -10, -5);

        expect(rect.width).toBe(80);
        expect(rect.height).toBe(70);
    });

    it('should maintain center when deflating', function ()
    {
        var rect = makeRect(0, 0, 100, 80);
        var cx = rect.centerX;
        var cy = rect.centerY;

        Inflate(rect, -10, -5);

        expect(rect.centerX).toBeCloseTo(cx);
        expect(rect.centerY).toBeCloseTo(cy);
    });

    it('should work with floating point inflation values', function ()
    {
        var rect = makeRect(0, 0, 100, 100);

        Inflate(rect, 0.5, 1.5);

        expect(rect.width).toBeCloseTo(101);
        expect(rect.height).toBeCloseTo(103);
    });

    it('should maintain center with floating point values', function ()
    {
        var rect = makeRect(10, 10, 100, 100);
        var cx = rect.centerX;
        var cy = rect.centerY;

        Inflate(rect, 1.25, 2.75);

        expect(rect.centerX).toBeCloseTo(cx);
        expect(rect.centerY).toBeCloseTo(cy);
    });

    it('should work with a rectangle not at the origin', function ()
    {
        var rect = makeRect(200, 300, 80, 40);
        var cx = rect.centerX;
        var cy = rect.centerY;

        Inflate(rect, 10, 5);

        expect(rect.width).toBe(100);
        expect(rect.height).toBe(50);
        expect(rect.centerX).toBeCloseTo(cx);
        expect(rect.centerY).toBeCloseTo(cy);
    });

    it('should work with a rectangle at negative coordinates', function ()
    {
        var rect = makeRect(-100, -100, 60, 40);
        var cx = rect.centerX;
        var cy = rect.centerY;

        Inflate(rect, 5, 10);

        expect(rect.width).toBe(70);
        expect(rect.height).toBe(60);
        expect(rect.centerX).toBeCloseTo(cx);
        expect(rect.centerY).toBeCloseTo(cy);
    });

    it('should work with large inflation values', function ()
    {
        var rect = makeRect(0, 0, 10, 10);
        var cx = rect.centerX;
        var cy = rect.centerY;

        Inflate(rect, 500, 500);

        expect(rect.width).toBe(1010);
        expect(rect.height).toBe(1010);
        expect(rect.centerX).toBeCloseTo(cx);
        expect(rect.centerY).toBeCloseTo(cy);
    });
});
