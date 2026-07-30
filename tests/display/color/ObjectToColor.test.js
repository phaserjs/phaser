var ObjectToColor = require('../../../src/display/color/ObjectToColor');
var Color = require('../../../src/display/color/Color');

describe('Phaser.Display.Color.ObjectToColor', function ()
{
    it('should return a new Color instance when no color argument is provided', function ()
    {
        var result = ObjectToColor({ r: 100, g: 150, b: 200, a: 255 });

        expect(result).toBeInstanceOf(Color);
    });

    it('should set r, g, b, a from the input object when creating a new Color', function ()
    {
        var result = ObjectToColor({ r: 100, g: 150, b: 200, a: 128 });

        expect(result.red).toBe(100);
        expect(result.green).toBe(150);
        expect(result.blue).toBe(200);
        expect(result.alpha).toBe(128);
    });

    it('should return a new Color when color argument is undefined', function ()
    {
        var result = ObjectToColor({ r: 10, g: 20, b: 30, a: 255 }, undefined);

        expect(result).toBeInstanceOf(Color);
        expect(result.red).toBe(10);
        expect(result.green).toBe(20);
        expect(result.blue).toBe(30);
    });

    it('should update the provided color object when one is given', function ()
    {
        var color = new Color(0, 0, 0, 255);
        var result = ObjectToColor({ r: 255, g: 128, b: 64, a: 200 }, color);

        expect(result).toBe(color);
        expect(color.red).toBe(255);
        expect(color.green).toBe(128);
        expect(color.blue).toBe(64);
        expect(color.alpha).toBe(200);
    });

    it('should return the same Color instance that was passed in', function ()
    {
        var color = new Color(10, 20, 30, 40);
        var result = ObjectToColor({ r: 50, g: 60, b: 70, a: 80 }, color);

        expect(result).toBe(color);
    });

    it('should handle minimum values of zero', function ()
    {
        var result = ObjectToColor({ r: 0, g: 0, b: 0, a: 0 });

        expect(result.red).toBe(0);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(0);
        expect(result.alpha).toBe(0);
    });

    it('should handle maximum values of 255', function ()
    {
        var result = ObjectToColor({ r: 255, g: 255, b: 255, a: 255 });

        expect(result.red).toBe(255);
        expect(result.green).toBe(255);
        expect(result.blue).toBe(255);
        expect(result.alpha).toBe(255);
    });

    it('should handle all distinct channel values', function ()
    {
        var result = ObjectToColor({ r: 10, g: 20, b: 30, a: 40 });

        expect(result.red).toBe(10);
        expect(result.green).toBe(20);
        expect(result.blue).toBe(30);
        expect(result.alpha).toBe(40);
    });

    it('should overwrite existing color values when updating an existing Color', function ()
    {
        var color = new Color(255, 255, 255, 255);

        ObjectToColor({ r: 1, g: 2, b: 3, a: 4 }, color);

        expect(color.red).toBe(1);
        expect(color.green).toBe(2);
        expect(color.blue).toBe(3);
        expect(color.alpha).toBe(4);
    });
});
