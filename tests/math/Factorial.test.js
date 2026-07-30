var Factorial = require('../../src/math/Factorial');

describe('Phaser.Math.Factorial', function ()
{
    it('should return 1 for 0', function ()
    {
        expect(Factorial(0)).toBe(1);
    });

    it('should return 1 for 1', function ()
    {
        expect(Factorial(1)).toBe(1);
    });

    it('should return 2 for 2', function ()
    {
        expect(Factorial(2)).toBe(2);
    });

    it('should return 6 for 3', function ()
    {
        expect(Factorial(3)).toBe(6);
    });

    it('should return 24 for 4', function ()
    {
        expect(Factorial(4)).toBe(24);
    });

    it('should return 120 for 5', function ()
    {
        expect(Factorial(5)).toBe(120);
    });

    it('should return 720 for 6', function ()
    {
        expect(Factorial(6)).toBe(720);
    });

    it('should return 5040 for 7', function ()
    {
        expect(Factorial(7)).toBe(5040);
    });

    it('should return 40320 for 8', function ()
    {
        expect(Factorial(8)).toBe(40320);
    });

    it('should return 362880 for 9', function ()
    {
        expect(Factorial(9)).toBe(362880);
    });

    it('should return 3628800 for 10', function ()
    {
        expect(Factorial(10)).toBe(3628800);
    });

    it('should return a number type', function ()
    {
        expect(typeof Factorial(5)).toBe('number');
    });
});
