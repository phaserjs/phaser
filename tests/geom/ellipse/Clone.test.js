var Clone = require('../../../src/geom/ellipse/Clone');
var Ellipse = require('../../../src/geom/ellipse/Ellipse');

describe('Phaser.Geom.Ellipse.Clone', function ()
{
    it('should return a new Ellipse instance', function ()
    {
        var source = new Ellipse(0, 0, 100, 50);
        var result = Clone(source);

        expect(result).toBeInstanceOf(Ellipse);
    });

    it('should not return the same reference as the source', function ()
    {
        var source = new Ellipse(0, 0, 100, 50);
        var result = Clone(source);

        expect(result).not.toBe(source);
    });

    it('should copy the x property from the source', function ()
    {
        var source = new Ellipse(10, 0, 100, 50);
        var result = Clone(source);

        expect(result.x).toBe(10);
    });

    it('should copy the y property from the source', function ()
    {
        var source = new Ellipse(0, 20, 100, 50);
        var result = Clone(source);

        expect(result.y).toBe(20);
    });

    it('should copy the width property from the source', function ()
    {
        var source = new Ellipse(0, 0, 200, 50);
        var result = Clone(source);

        expect(result.width).toBe(200);
    });

    it('should copy the height property from the source', function ()
    {
        var source = new Ellipse(0, 0, 100, 75);
        var result = Clone(source);

        expect(result.height).toBe(75);
    });

    it('should clone all properties together correctly', function ()
    {
        var source = new Ellipse(15, 25, 120, 80);
        var result = Clone(source);

        expect(result.x).toBe(15);
        expect(result.y).toBe(25);
        expect(result.width).toBe(120);
        expect(result.height).toBe(80);
    });

    it('should work with negative values', function ()
    {
        var source = new Ellipse(-10, -20, 100, 50);
        var result = Clone(source);

        expect(result.x).toBe(-10);
        expect(result.y).toBe(-20);
        expect(result.width).toBe(100);
        expect(result.height).toBe(50);
    });

    it('should work with floating point values', function ()
    {
        var source = new Ellipse(1.5, 2.7, 10.3, 5.9);
        var result = Clone(source);

        expect(result.x).toBeCloseTo(1.5);
        expect(result.y).toBeCloseTo(2.7);
        expect(result.width).toBeCloseTo(10.3);
        expect(result.height).toBeCloseTo(5.9);
    });

    it('should work with zero values', function ()
    {
        var source = new Ellipse(0, 0, 0, 0);
        var result = Clone(source);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should work with a plain ellipse-like object', function ()
    {
        var source = { x: 5, y: 10, width: 40, height: 30 };
        var result = Clone(source);

        expect(result).toBeInstanceOf(Ellipse);
        expect(result.x).toBe(5);
        expect(result.y).toBe(10);
        expect(result.width).toBe(40);
        expect(result.height).toBe(30);
    });

    it('should produce an independent clone that does not reflect mutations to the source', function ()
    {
        var source = new Ellipse(10, 20, 100, 50);
        var result = Clone(source);

        source.x = 999;
        source.y = 999;
        source.width = 999;
        source.height = 999;

        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(100);
        expect(result.height).toBe(50);
    });
});
