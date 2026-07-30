var Clone = require('../../../src/geom/line/Clone');
var Line = require('../../../src/geom/line/Line');

describe('Phaser.Geom.Line.Clone', function ()
{
    it('should return a new Line instance', function ()
    {
        var source = new Line(0, 0, 10, 10);
        var result = Clone(source);

        expect(result).toBeInstanceOf(Line);
    });

    it('should return a different object reference than the source', function ()
    {
        var source = new Line(0, 0, 10, 10);
        var result = Clone(source);

        expect(result).not.toBe(source);
    });

    it('should copy x1 from the source line', function ()
    {
        var source = new Line(5, 0, 0, 0);
        var result = Clone(source);

        expect(result.x1).toBe(5);
    });

    it('should copy y1 from the source line', function ()
    {
        var source = new Line(0, 7, 0, 0);
        var result = Clone(source);

        expect(result.y1).toBe(7);
    });

    it('should copy x2 from the source line', function ()
    {
        var source = new Line(0, 0, 15, 0);
        var result = Clone(source);

        expect(result.x2).toBe(15);
    });

    it('should copy y2 from the source line', function ()
    {
        var source = new Line(0, 0, 0, 20);
        var result = Clone(source);

        expect(result.y2).toBe(20);
    });

    it('should clone a line with all coordinates set', function ()
    {
        var source = new Line(1, 2, 3, 4);
        var result = Clone(source);

        expect(result.x1).toBe(1);
        expect(result.y1).toBe(2);
        expect(result.x2).toBe(3);
        expect(result.y2).toBe(4);
    });

    it('should clone a line with negative coordinates', function ()
    {
        var source = new Line(-10, -20, -30, -40);
        var result = Clone(source);

        expect(result.x1).toBe(-10);
        expect(result.y1).toBe(-20);
        expect(result.x2).toBe(-30);
        expect(result.y2).toBe(-40);
    });

    it('should clone a line with floating point coordinates', function ()
    {
        var source = new Line(1.5, 2.7, 3.14, 9.99);
        var result = Clone(source);

        expect(result.x1).toBeCloseTo(1.5);
        expect(result.y1).toBeCloseTo(2.7);
        expect(result.x2).toBeCloseTo(3.14);
        expect(result.y2).toBeCloseTo(9.99);
    });

    it('should clone a zero-length line', function ()
    {
        var source = new Line(5, 5, 5, 5);
        var result = Clone(source);

        expect(result.x1).toBe(5);
        expect(result.y1).toBe(5);
        expect(result.x2).toBe(5);
        expect(result.y2).toBe(5);
    });

    it('should clone a default line with all zeros', function ()
    {
        var source = new Line();
        var result = Clone(source);

        expect(result.x1).toBe(0);
        expect(result.y1).toBe(0);
        expect(result.x2).toBe(0);
        expect(result.y2).toBe(0);
    });

    it('should produce an independent copy that does not share mutations', function ()
    {
        var source = new Line(1, 2, 3, 4);
        var result = Clone(source);

        source.x1 = 99;
        source.y1 = 99;
        source.x2 = 99;
        source.y2 = 99;

        expect(result.x1).toBe(1);
        expect(result.y1).toBe(2);
        expect(result.x2).toBe(3);
        expect(result.y2).toBe(4);
    });

    it('should work with a plain object that has x1, y1, x2, y2 properties', function ()
    {
        var source = { x1: 10, y1: 20, x2: 30, y2: 40 };
        var result = Clone(source);

        expect(result.x1).toBe(10);
        expect(result.y1).toBe(20);
        expect(result.x2).toBe(30);
        expect(result.y2).toBe(40);
    });
});
