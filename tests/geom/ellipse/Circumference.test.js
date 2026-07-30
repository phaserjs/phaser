var Circumference = require('../../../src/geom/ellipse/Circumference');

describe('Phaser.Geom.Ellipse.Circumference', function ()
{
    it('should return the circumference of a circle (equal width and height)', function ()
    {
        var ellipse = { width: 100, height: 100 };
        var result = Circumference(ellipse);

        // Circumference of a circle with radius 50 is 2 * PI * 50
        expect(result).toBeCloseTo(2 * Math.PI * 50, 5);
    });

    it('should return correct circumference for a wide ellipse', function ()
    {
        var ellipse = { width: 200, height: 100 };
        var rx = 100;
        var ry = 50;
        var h = Math.pow((rx - ry), 2) / Math.pow((rx + ry), 2);
        var expected = (Math.PI * (rx + ry)) * (1 + ((3 * h) / (10 + Math.sqrt(4 - (3 * h)))));

        expect(Circumference(ellipse)).toBeCloseTo(expected, 10);
    });

    it('should return correct circumference for a tall ellipse', function ()
    {
        var ellipse = { width: 100, height: 200 };
        var rx = 50;
        var ry = 100;
        var h = Math.pow((rx - ry), 2) / Math.pow((rx + ry), 2);
        var expected = (Math.PI * (rx + ry)) * (1 + ((3 * h) / (10 + Math.sqrt(4 - (3 * h)))));

        expect(Circumference(ellipse)).toBeCloseTo(expected, 10);
    });

    it('should return a positive number for positive dimensions', function ()
    {
        var ellipse = { width: 80, height: 40 };

        expect(Circumference(ellipse)).toBeGreaterThan(0);
    });

    it('should return NaN when both width and height are zero', function ()
    {
        var ellipse = { width: 0, height: 0 };

        expect(Circumference(ellipse)).toBeNaN();
    });

    it('should return correct circumference for a very thin ellipse', function ()
    {
        var ellipse = { width: 200, height: 2 };
        var rx = 100;
        var ry = 1;
        var h = Math.pow((rx - ry), 2) / Math.pow((rx + ry), 2);
        var expected = (Math.PI * (rx + ry)) * (1 + ((3 * h) / (10 + Math.sqrt(4 - (3 * h)))));

        expect(Circumference(ellipse)).toBeCloseTo(expected, 10);
    });

    it('should return the same value for width/height swapped (symmetry)', function ()
    {
        var ellipse1 = { width: 100, height: 40 };
        var ellipse2 = { width: 40, height: 100 };

        expect(Circumference(ellipse1)).toBeCloseTo(Circumference(ellipse2), 10);
    });

    it('should return correct circumference for floating point dimensions', function ()
    {
        var ellipse = { width: 33.5, height: 17.25 };
        var rx = ellipse.width / 2;
        var ry = ellipse.height / 2;
        var h = Math.pow((rx - ry), 2) / Math.pow((rx + ry), 2);
        var expected = (Math.PI * (rx + ry)) * (1 + ((3 * h) / (10 + Math.sqrt(4 - (3 * h)))));

        expect(Circumference(ellipse)).toBeCloseTo(expected, 10);
    });

    it('should scale proportionally with uniform scaling', function ()
    {
        var ellipse1 = { width: 100, height: 50 };
        var ellipse2 = { width: 200, height: 100 };

        expect(Circumference(ellipse2)).toBeCloseTo(Circumference(ellipse1) * 2, 5);
    });

    it('should return a number type', function ()
    {
        var ellipse = { width: 60, height: 30 };

        expect(typeof Circumference(ellipse)).toBe('number');
    });
});
