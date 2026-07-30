var Linear = require('../../../../src/math/easing/linear/Linear');

describe('Phaser.Math.Easing.Linear', function ()
{
    it('should return the value unchanged', function ()
    {
        expect(Linear(0.5)).toBe(0.5);
    });

    it('should return 0 when given 0', function ()
    {
        expect(Linear(0)).toBe(0);
    });

    it('should return 1 when given 1', function ()
    {
        expect(Linear(1)).toBe(1);
    });

    it('should return negative values unchanged', function ()
    {
        expect(Linear(-1)).toBe(-1);
        expect(Linear(-0.5)).toBe(-0.5);
    });

    it('should return values greater than 1 unchanged', function ()
    {
        expect(Linear(2)).toBe(2);
        expect(Linear(1.5)).toBe(1.5);
    });

    it('should return floating point values unchanged', function ()
    {
        expect(Linear(0.123456789)).toBeCloseTo(0.123456789);
        expect(Linear(0.999999)).toBeCloseTo(0.999999);
    });

    it('should return integer values unchanged', function ()
    {
        expect(Linear(42)).toBe(42);
        expect(Linear(-100)).toBe(-100);
    });
});
