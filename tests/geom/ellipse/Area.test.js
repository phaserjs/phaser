var Area = require('../../../src/geom/ellipse/Area');

describe('Phaser.Geom.Ellipse.Area', function ()
{
    function makeEllipse(majorRadius, minorRadius, empty)
    {
        return {
            isEmpty: function () { return empty === true; },
            getMajorRadius: function () { return majorRadius; },
            getMinorRadius: function () { return minorRadius; }
        };
    }

    it('should return zero when the ellipse is empty', function ()
    {
        var ellipse = makeEllipse(100, 50, true);

        expect(Area(ellipse)).toBe(0);
    });

    it('should return π × majorRadius × minorRadius for a normal ellipse', function ()
    {
        var ellipse = makeEllipse(100, 50, false);

        expect(Area(ellipse)).toBeCloseTo(100 * 50 * Math.PI, 10);
    });

    it('should return π × r² for a circle (equal radii)', function ()
    {
        var ellipse = makeEllipse(50, 50, false);

        expect(Area(ellipse)).toBeCloseTo(50 * 50 * Math.PI, 10);
    });

    it('should return zero when both radii are zero and ellipse is empty', function ()
    {
        var ellipse = makeEllipse(0, 0, true);

        expect(Area(ellipse)).toBe(0);
    });

    it('should return correct area when majorRadius is 1 and minorRadius is 1', function ()
    {
        var ellipse = makeEllipse(1, 1, false);

        expect(Area(ellipse)).toBeCloseTo(Math.PI, 10);
    });

    it('should return correct area with floating point radii', function ()
    {
        var ellipse = makeEllipse(2.5, 1.5, false);

        expect(Area(ellipse)).toBeCloseTo(2.5 * 1.5 * Math.PI, 10);
    });

    it('should return correct area with large radii', function ()
    {
        var ellipse = makeEllipse(1000, 500, false);

        expect(Area(ellipse)).toBeCloseTo(1000 * 500 * Math.PI, 5);
    });

    it('should return a positive number for non-empty ellipse', function ()
    {
        var ellipse = makeEllipse(10, 20, false);

        expect(Area(ellipse)).toBeGreaterThan(0);
    });

    it('should return a number type', function ()
    {
        var ellipse = makeEllipse(10, 5, false);

        expect(typeof Area(ellipse)).toBe('number');
    });

    it('should return zero type for empty ellipse', function ()
    {
        var ellipse = makeEllipse(10, 5, true);

        expect(typeof Area(ellipse)).toBe('number');
        expect(Area(ellipse)).toBe(0);
    });
});
