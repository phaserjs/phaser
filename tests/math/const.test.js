var MATH_CONST = require('../../src/math/const');

describe('const', function ()
{
    it('should export TAU as PI * 2', function ()
    {
        expect(MATH_CONST.TAU).toBeCloseTo(Math.PI * 2);
    });

    it('should export PI_OVER_2 as PI / 2', function ()
    {
        expect(MATH_CONST.PI_OVER_2).toBeCloseTo(Math.PI / 2);
    });

    it('should export EPSILON as 1.0e-6', function ()
    {
        expect(MATH_CONST.EPSILON).toBe(1.0e-6);
    });

    it('should export DEG_TO_RAD as PI / 180', function ()
    {
        expect(MATH_CONST.DEG_TO_RAD).toBeCloseTo(Math.PI / 180);
    });

    it('should export RAD_TO_DEG as 180 / PI', function ()
    {
        expect(MATH_CONST.RAD_TO_DEG).toBeCloseTo(180 / Math.PI);
    });

    it('should export RND as null', function ()
    {
        expect(MATH_CONST.RND).toBeNull();
    });

    it('should export MIN_SAFE_INTEGER as -9007199254740991', function ()
    {
        expect(MATH_CONST.MIN_SAFE_INTEGER).toBe(-9007199254740991);
    });

    it('should export MAX_SAFE_INTEGER as 9007199254740991', function ()
    {
        expect(MATH_CONST.MAX_SAFE_INTEGER).toBe(9007199254740991);
    });

    it('should convert 180 degrees to PI radians using DEG_TO_RAD', function ()
    {
        expect(180 * MATH_CONST.DEG_TO_RAD).toBeCloseTo(Math.PI);
    });

    it('should convert PI radians to 180 degrees using RAD_TO_DEG', function ()
    {
        expect(Math.PI * MATH_CONST.RAD_TO_DEG).toBeCloseTo(180);
    });

    it('should convert 90 degrees to PI/2 radians using DEG_TO_RAD', function ()
    {
        expect(90 * MATH_CONST.DEG_TO_RAD).toBeCloseTo(Math.PI / 2);
    });

    it('should convert 360 degrees to TAU radians using DEG_TO_RAD', function ()
    {
        expect(360 * MATH_CONST.DEG_TO_RAD).toBeCloseTo(MATH_CONST.TAU);
    });

    it('should have DEG_TO_RAD and RAD_TO_DEG as reciprocals', function ()
    {
        expect(MATH_CONST.DEG_TO_RAD * MATH_CONST.RAD_TO_DEG).toBeCloseTo(1);
    });

    it('should have TAU equal to twice PI_OVER_2 times two', function ()
    {
        expect(MATH_CONST.TAU).toBeCloseTo(MATH_CONST.PI_OVER_2 * 4);
    });

    it('should have EPSILON be a very small positive number', function ()
    {
        expect(MATH_CONST.EPSILON).toBeGreaterThan(0);
        expect(MATH_CONST.EPSILON).toBeLessThan(0.001);
    });

    it('should have MIN_SAFE_INTEGER be negative', function ()
    {
        expect(MATH_CONST.MIN_SAFE_INTEGER).toBeLessThan(0);
    });

    it('should have MAX_SAFE_INTEGER be positive', function ()
    {
        expect(MATH_CONST.MAX_SAFE_INTEGER).toBeGreaterThan(0);
    });

    it('should have MIN_SAFE_INTEGER and MAX_SAFE_INTEGER as equal magnitude', function ()
    {
        expect(Math.abs(MATH_CONST.MIN_SAFE_INTEGER)).toBe(MATH_CONST.MAX_SAFE_INTEGER);
    });
});
