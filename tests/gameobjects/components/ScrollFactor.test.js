var ScrollFactor = require('../../../src/gameobjects/components/ScrollFactor');

describe('ScrollFactor', function ()
{
    var obj;

    beforeEach(function ()
    {
        obj = Object.assign({}, ScrollFactor);
    });

    describe('default values', function ()
    {
        it('should have scrollFactorX default to 1', function ()
        {
            expect(ScrollFactor.scrollFactorX).toBe(1);
        });

        it('should have scrollFactorY default to 1', function ()
        {
            expect(ScrollFactor.scrollFactorY).toBe(1);
        });
    });

    describe('setScrollFactor', function ()
    {
        it('should set both scrollFactorX and scrollFactorY when both are provided', function ()
        {
            obj.setScrollFactor(0.5, 0.8);

            expect(obj.scrollFactorX).toBe(0.5);
            expect(obj.scrollFactorY).toBe(0.8);
        });

        it('should set scrollFactorY to x when y is not provided', function ()
        {
            obj.setScrollFactor(0.5);

            expect(obj.scrollFactorX).toBe(0.5);
            expect(obj.scrollFactorY).toBe(0.5);
        });

        it('should return the object itself for chaining', function ()
        {
            var result = obj.setScrollFactor(1, 1);

            expect(result).toBe(obj);
        });

        it('should set scroll factors to zero', function ()
        {
            obj.setScrollFactor(0);

            expect(obj.scrollFactorX).toBe(0);
            expect(obj.scrollFactorY).toBe(0);
        });

        it('should set scroll factors to zero independently', function ()
        {
            obj.setScrollFactor(0, 0);

            expect(obj.scrollFactorX).toBe(0);
            expect(obj.scrollFactorY).toBe(0);
        });

        it('should set scroll factors to 1', function ()
        {
            obj.setScrollFactor(0);
            obj.setScrollFactor(1);

            expect(obj.scrollFactorX).toBe(1);
            expect(obj.scrollFactorY).toBe(1);
        });

        it('should accept negative values', function ()
        {
            obj.setScrollFactor(-1, -2);

            expect(obj.scrollFactorX).toBe(-1);
            expect(obj.scrollFactorY).toBe(-2);
        });

        it('should accept values greater than 1', function ()
        {
            obj.setScrollFactor(2, 3);

            expect(obj.scrollFactorX).toBe(2);
            expect(obj.scrollFactorY).toBe(3);
        });

        it('should accept floating point values', function ()
        {
            obj.setScrollFactor(0.123, 0.456);

            expect(obj.scrollFactorX).toBeCloseTo(0.123);
            expect(obj.scrollFactorY).toBeCloseTo(0.456);
        });

        it('should allow chaining multiple calls', function ()
        {
            obj.setScrollFactor(0.5, 0.5).setScrollFactor(0.25, 0.75);

            expect(obj.scrollFactorX).toBe(0.25);
            expect(obj.scrollFactorY).toBe(0.75);
        });

        it('should set x and y to the same value when only x is provided', function ()
        {
            obj.setScrollFactor(0.3);

            expect(obj.scrollFactorX).toBeCloseTo(0.3);
            expect(obj.scrollFactorY).toBeCloseTo(0.3);
        });

        it('should treat explicit undefined y as defaulting to x', function ()
        {
            obj.setScrollFactor(0.7, undefined);

            expect(obj.scrollFactorX).toBeCloseTo(0.7);
            expect(obj.scrollFactorY).toBeCloseTo(0.7);
        });
    });
});
