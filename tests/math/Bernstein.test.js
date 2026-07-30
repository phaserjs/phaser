var Bernstein = require('../../src/math/Bernstein');

describe('Phaser.Math.Bernstein', function ()
{
    it('should return 1 when n=0 and i=0', function ()
    {
        expect(Bernstein(0, 0)).toBe(1);
    });

    it('should return 1 when i=0 (first basis function)', function ()
    {
        expect(Bernstein(1, 0)).toBe(1);
        expect(Bernstein(2, 0)).toBe(1);
        expect(Bernstein(3, 0)).toBe(1);
        expect(Bernstein(5, 0)).toBe(1);
    });

    it('should return 1 when i equals n (last basis function)', function ()
    {
        expect(Bernstein(1, 1)).toBe(1);
        expect(Bernstein(2, 2)).toBe(1);
        expect(Bernstein(3, 3)).toBe(1);
        expect(Bernstein(5, 5)).toBe(1);
    });

    it('should return n when i=1 (linear coefficient)', function ()
    {
        expect(Bernstein(2, 1)).toBe(2);
        expect(Bernstein(3, 1)).toBe(3);
        expect(Bernstein(4, 1)).toBe(4);
        expect(Bernstein(5, 1)).toBe(5);
    });

    it('should return correct coefficients for degree 2 (quadratic)', function ()
    {
        expect(Bernstein(2, 0)).toBe(1);
        expect(Bernstein(2, 1)).toBe(2);
        expect(Bernstein(2, 2)).toBe(1);
    });

    it('should return correct coefficients for degree 3 (cubic)', function ()
    {
        expect(Bernstein(3, 0)).toBe(1);
        expect(Bernstein(3, 1)).toBe(3);
        expect(Bernstein(3, 2)).toBe(3);
        expect(Bernstein(3, 3)).toBe(1);
    });

    it('should return correct coefficients for degree 4', function ()
    {
        expect(Bernstein(4, 0)).toBe(1);
        expect(Bernstein(4, 1)).toBe(4);
        expect(Bernstein(4, 2)).toBe(6);
        expect(Bernstein(4, 3)).toBe(4);
        expect(Bernstein(4, 4)).toBe(1);
    });

    it('should return correct coefficients for degree 5', function ()
    {
        expect(Bernstein(5, 0)).toBe(1);
        expect(Bernstein(5, 1)).toBe(5);
        expect(Bernstein(5, 2)).toBe(10);
        expect(Bernstein(5, 3)).toBe(10);
        expect(Bernstein(5, 4)).toBe(5);
        expect(Bernstein(5, 5)).toBe(1);
    });

    it('should be symmetric: Bernstein(n, i) equals Bernstein(n, n-i)', function ()
    {
        expect(Bernstein(4, 1)).toBe(Bernstein(4, 3));
        expect(Bernstein(5, 1)).toBe(Bernstein(5, 4));
        expect(Bernstein(5, 2)).toBe(Bernstein(5, 3));
        expect(Bernstein(6, 2)).toBe(Bernstein(6, 4));
    });

    it('should return a number', function ()
    {
        expect(typeof Bernstein(3, 1)).toBe('number');
    });
});
