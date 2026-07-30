var Perimeter = require('../../../src/geom/rectangle/Perimeter');

describe('Phaser.Geom.Rectangle.Perimeter', function ()
{
    it('should return zero for a zero-size rectangle', function ()
    {
        var rect = { width: 0, height: 0 };
        expect(Perimeter(rect)).toBe(0);
    });

    it('should return correct perimeter for a square', function ()
    {
        var rect = { width: 5, height: 5 };
        expect(Perimeter(rect)).toBe(20);
    });

    it('should return correct perimeter for a rectangle', function ()
    {
        var rect = { width: 10, height: 4 };
        expect(Perimeter(rect)).toBe(28);
    });

    it('should return correct perimeter for a unit rectangle', function ()
    {
        var rect = { width: 1, height: 1 };
        expect(Perimeter(rect)).toBe(4);
    });

    it('should return correct perimeter when width is zero', function ()
    {
        var rect = { width: 0, height: 10 };
        expect(Perimeter(rect)).toBe(20);
    });

    it('should return correct perimeter when height is zero', function ()
    {
        var rect = { width: 10, height: 0 };
        expect(Perimeter(rect)).toBe(20);
    });

    it('should work with floating point dimensions', function ()
    {
        var rect = { width: 1.5, height: 2.5 };
        expect(Perimeter(rect)).toBeCloseTo(8);
    });

    it('should work with large values', function ()
    {
        var rect = { width: 1000, height: 500 };
        expect(Perimeter(rect)).toBe(3000);
    });

    it('should work with negative dimensions', function ()
    {
        var rect = { width: -5, height: -3 };
        expect(Perimeter(rect)).toBe(-16);
    });

    it('should equal (width * 2) + (height * 2)', function ()
    {
        var rect = { width: 7, height: 3 };
        expect(Perimeter(rect)).toBe((rect.width * 2) + (rect.height * 2));
    });
});
