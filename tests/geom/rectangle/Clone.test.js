var Clone = require('../../../src/geom/rectangle/Clone');
var Rectangle = require('../../../src/geom/rectangle/Rectangle');

describe('Phaser.Geom.Rectangle.Clone', function ()
{
    it('should return a new Rectangle with the same properties as the source', function ()
    {
        var source = new Rectangle(10, 20, 100, 200);
        var clone = Clone(source);

        expect(clone.x).toBe(10);
        expect(clone.y).toBe(20);
        expect(clone.width).toBe(100);
        expect(clone.height).toBe(200);
    });

    it('should return a different object reference than the source', function ()
    {
        var source = new Rectangle(10, 20, 100, 200);
        var clone = Clone(source);

        expect(clone).not.toBe(source);
    });

    it('should return an instance of Rectangle', function ()
    {
        var source = new Rectangle(0, 0, 50, 50);
        var clone = Clone(source);

        expect(clone instanceof Rectangle).toBe(true);
    });

    it('should clone a Rectangle with zero values', function ()
    {
        var source = new Rectangle(0, 0, 0, 0);
        var clone = Clone(source);

        expect(clone.x).toBe(0);
        expect(clone.y).toBe(0);
        expect(clone.width).toBe(0);
        expect(clone.height).toBe(0);
    });

    it('should clone a Rectangle with negative position values', function ()
    {
        var source = new Rectangle(-50, -75, 100, 200);
        var clone = Clone(source);

        expect(clone.x).toBe(-50);
        expect(clone.y).toBe(-75);
        expect(clone.width).toBe(100);
        expect(clone.height).toBe(200);
    });

    it('should clone a Rectangle with floating point values', function ()
    {
        var source = new Rectangle(1.5, 2.75, 10.25, 20.5);
        var clone = Clone(source);

        expect(clone.x).toBeCloseTo(1.5);
        expect(clone.y).toBeCloseTo(2.75);
        expect(clone.width).toBeCloseTo(10.25);
        expect(clone.height).toBeCloseTo(20.5);
    });

    it('should not be affected by mutations to the source after cloning', function ()
    {
        var source = new Rectangle(10, 20, 100, 200);
        var clone = Clone(source);

        source.x = 999;
        source.y = 999;
        source.width = 999;
        source.height = 999;

        expect(clone.x).toBe(10);
        expect(clone.y).toBe(20);
        expect(clone.width).toBe(100);
        expect(clone.height).toBe(200);
    });

    it('should not affect the source when the clone is mutated', function ()
    {
        var source = new Rectangle(10, 20, 100, 200);
        var clone = Clone(source);

        clone.x = 999;
        clone.y = 999;
        clone.width = 999;
        clone.height = 999;

        expect(source.x).toBe(10);
        expect(source.y).toBe(20);
        expect(source.width).toBe(100);
        expect(source.height).toBe(200);
    });

    it('should work with a plain object having the required properties', function ()
    {
        var source = { x: 5, y: 15, width: 50, height: 75 };
        var clone = Clone(source);

        expect(clone.x).toBe(5);
        expect(clone.y).toBe(15);
        expect(clone.width).toBe(50);
        expect(clone.height).toBe(75);
    });

    it('should clone a Rectangle with large values', function ()
    {
        var source = new Rectangle(100000, 200000, 999999, 888888);
        var clone = Clone(source);

        expect(clone.x).toBe(100000);
        expect(clone.y).toBe(200000);
        expect(clone.width).toBe(999999);
        expect(clone.height).toBe(888888);
    });
});
