var GetMinMaxValue = require('../../../src/utils/object/GetMinMaxValue');

describe('Phaser.Utils.Objects.GetMinMaxValue', function ()
{
    it('should return the value from the source object when within range', function ()
    {
        expect(GetMinMaxValue({ speed: 5 }, 'speed', 0, 10, 0)).toBe(5);
    });

    it('should return the default value when the key does not exist', function ()
    {
        expect(GetMinMaxValue({}, 'speed', 0, 10, 3)).toBe(3);
    });

    it('should default defaultValue to min when not provided', function ()
    {
        expect(GetMinMaxValue({}, 'speed', 2, 10)).toBe(2);
    });

    it('should clamp value to min when below range', function ()
    {
        expect(GetMinMaxValue({ speed: -5 }, 'speed', 0, 10, 0)).toBe(0);
    });

    it('should clamp value to max when above range', function ()
    {
        expect(GetMinMaxValue({ speed: 100 }, 'speed', 0, 10, 0)).toBe(10);
    });

    it('should return min when value equals min', function ()
    {
        expect(GetMinMaxValue({ speed: 0 }, 'speed', 0, 10, 0)).toBe(0);
    });

    it('should return max when value equals max', function ()
    {
        expect(GetMinMaxValue({ speed: 10 }, 'speed', 0, 10, 0)).toBe(10);
    });

    it('should clamp defaultValue to min when defaultValue is below range', function ()
    {
        expect(GetMinMaxValue({}, 'speed', 0, 10, -5)).toBe(0);
    });

    it('should clamp defaultValue to max when defaultValue is above range', function ()
    {
        expect(GetMinMaxValue({}, 'speed', 0, 10, 100)).toBe(10);
    });

    it('should retrieve nested property values using dot notation', function ()
    {
        expect(GetMinMaxValue({ a: { b: 7 } }, 'a.b', 0, 10, 0)).toBe(7);
    });

    it('should return default when nested property does not exist', function ()
    {
        expect(GetMinMaxValue({ a: {} }, 'a.b', 0, 10, 4)).toBe(4);
    });

    it('should work with negative ranges', function ()
    {
        expect(GetMinMaxValue({ val: -5 }, 'val', -10, -1, -5)).toBe(-5);
        expect(GetMinMaxValue({ val: -15 }, 'val', -10, -1, -5)).toBe(-10);
        expect(GetMinMaxValue({ val: 0 }, 'val', -10, -1, -5)).toBe(-1);
    });

    it('should work with floating point values', function ()
    {
        expect(GetMinMaxValue({ val: 0.5 }, 'val', 0, 1, 0)).toBeCloseTo(0.5);
        expect(GetMinMaxValue({ val: 1.5 }, 'val', 0, 1, 0)).toBeCloseTo(1);
        expect(GetMinMaxValue({ val: -0.5 }, 'val', 0, 1, 0)).toBeCloseTo(0);
    });

    it('should return min when min equals max and value is within that point', function ()
    {
        expect(GetMinMaxValue({ val: 5 }, 'val', 5, 5, 5)).toBe(5);
    });

    it('should return min when min equals max regardless of source value', function ()
    {
        expect(GetMinMaxValue({ val: 100 }, 'val', 5, 5, 5)).toBe(5);
        expect(GetMinMaxValue({ val: 0 }, 'val', 5, 5, 5)).toBe(5);
    });
});
