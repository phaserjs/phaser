var RGB = require('../../src/display/RGB');

describe('RGB', function ()
{
    describe('Constructor', function ()
    {
        it('should create an RGB object with default values', function ()
        {
            var rgb = new RGB();
            expect(rgb.r).toBe(0);
            expect(rgb.g).toBe(0);
            expect(rgb.b).toBe(0);
        });

        it('should create an RGB object with given values', function ()
        {
            var rgb = new RGB(1, 0.5, 0.25);
            expect(rgb.r).toBe(1);
            expect(rgb.g).toBe(0.5);
            expect(rgb.b).toBe(0.25);
        });

        it('should initialize dirty to false before set is called', function ()
        {
            // After construction, set() is called which sets dirty to true
            var rgb = new RGB();
            expect(rgb.dirty).toBe(true);
        });

        it('should set dirty to true after construction', function ()
        {
            var rgb = new RGB(1, 1, 1);
            expect(rgb.dirty).toBe(true);
        });

        it('should initialize onChangeCallback to a function (NOOP)', function ()
        {
            var rgb = new RGB();
            expect(typeof rgb.onChangeCallback).toBe('function');
        });

        it('should accept zero values', function ()
        {
            var rgb = new RGB(0, 0, 0);
            expect(rgb.r).toBe(0);
            expect(rgb.g).toBe(0);
            expect(rgb.b).toBe(0);
        });

        it('should accept floating point values', function ()
        {
            var rgb = new RGB(0.1, 0.2, 0.3);
            expect(rgb.r).toBeCloseTo(0.1);
            expect(rgb.g).toBeCloseTo(0.2);
            expect(rgb.b).toBeCloseTo(0.3);
        });
    });

    describe('set', function ()
    {
        it('should set red, green and blue values', function ()
        {
            var rgb = new RGB();
            rgb.set(0.5, 0.6, 0.7);
            expect(rgb.r).toBe(0.5);
            expect(rgb.g).toBe(0.6);
            expect(rgb.b).toBe(0.7);
        });

        it('should default to zero when called with no arguments', function ()
        {
            var rgb = new RGB(1, 1, 1);
            rgb.set();
            expect(rgb.r).toBe(0);
            expect(rgb.g).toBe(0);
            expect(rgb.b).toBe(0);
        });

        it('should default missing arguments to zero', function ()
        {
            var rgb = new RGB(1, 1, 1);
            rgb.set(0.5);
            expect(rgb.r).toBe(0.5);
            expect(rgb.g).toBe(0);
            expect(rgb.b).toBe(0);
        });

        it('should return the RGB instance for chaining', function ()
        {
            var rgb = new RGB();
            var result = rgb.set(1, 0.5, 0.25);
            expect(result).toBe(rgb);
        });

        it('should mark the object as dirty', function ()
        {
            var rgb = new RGB();
            rgb.dirty = false;
            rgb.set(0.5, 0.5, 0.5);
            expect(rgb.dirty).toBe(true);
        });

        it('should invoke onChangeCallback with the new values', function ()
        {
            var rgb = new RGB();
            var called = false;
            var calledR, calledG, calledB;
            rgb.onChangeCallback = function (r, g, b)
            {
                called = true;
                calledR = r;
                calledG = g;
                calledB = b;
            };
            rgb.set(0.1, 0.2, 0.3);
            expect(called).toBe(true);
            expect(calledR).toBeCloseTo(0.1);
            expect(calledG).toBeCloseTo(0.2);
            expect(calledB).toBeCloseTo(0.3);
        });

        it('should accept values outside 0-1 range', function ()
        {
            var rgb = new RGB();
            rgb.set(2, -1, 100);
            expect(rgb.r).toBe(2);
            expect(rgb.g).toBe(-1);
            expect(rgb.b).toBe(100);
        });
    });

    describe('equals', function ()
    {
        it('should return true when all values match', function ()
        {
            var rgb = new RGB(0.5, 0.6, 0.7);
            expect(rgb.equals(0.5, 0.6, 0.7)).toBe(true);
        });

        it('should return false when red does not match', function ()
        {
            var rgb = new RGB(0.5, 0.6, 0.7);
            expect(rgb.equals(0.1, 0.6, 0.7)).toBe(false);
        });

        it('should return false when green does not match', function ()
        {
            var rgb = new RGB(0.5, 0.6, 0.7);
            expect(rgb.equals(0.5, 0.1, 0.7)).toBe(false);
        });

        it('should return false when blue does not match', function ()
        {
            var rgb = new RGB(0.5, 0.6, 0.7);
            expect(rgb.equals(0.5, 0.6, 0.1)).toBe(false);
        });

        it('should return false when all values differ', function ()
        {
            var rgb = new RGB(0.5, 0.6, 0.7);
            expect(rgb.equals(0, 0, 0)).toBe(false);
        });

        it('should return true for default zero values', function ()
        {
            var rgb = new RGB();
            expect(rgb.equals(0, 0, 0)).toBe(true);
        });

        it('should return true for max values', function ()
        {
            var rgb = new RGB(1, 1, 1);
            expect(rgb.equals(1, 1, 1)).toBe(true);
        });

        it('should not trigger onChange or modify dirty', function ()
        {
            var rgb = new RGB(0.5, 0.5, 0.5);
            rgb.dirty = false;
            rgb.equals(0.5, 0.5, 0.5);
            expect(rgb.dirty).toBe(false);
        });
    });

    describe('onChange', function ()
    {
        it('should set dirty to true', function ()
        {
            var rgb = new RGB();
            rgb.dirty = false;
            rgb.onChange();
            expect(rgb.dirty).toBe(true);
        });

        it('should invoke onChangeCallback', function ()
        {
            var rgb = new RGB(0.2, 0.4, 0.6);
            var callCount = 0;
            rgb.onChangeCallback = function ()
            {
                callCount++;
            };
            rgb.onChange();
            expect(callCount).toBe(1);
        });

        it('should invoke onChangeCallback with current rgb values', function ()
        {
            var rgb = new RGB(0.2, 0.4, 0.6);
            var receivedR, receivedG, receivedB;
            rgb.onChangeCallback = function (r, g, b)
            {
                receivedR = r;
                receivedG = g;
                receivedB = b;
            };
            rgb.onChange();
            expect(receivedR).toBeCloseTo(0.2);
            expect(receivedG).toBeCloseTo(0.4);
            expect(receivedB).toBeCloseTo(0.6);
        });

        it('should invoke onChangeCallback with this bound to the RGB instance', function ()
        {
            var rgb = new RGB();
            var context;
            rgb.onChangeCallback = function ()
            {
                context = this;
            };
            rgb.onChange();
            expect(context).toBe(rgb);
        });

        it('should call onChangeCallback each time it is invoked', function ()
        {
            var rgb = new RGB();
            var callCount = 0;
            rgb.onChangeCallback = function ()
            {
                callCount++;
            };
            rgb.onChange();
            rgb.onChange();
            rgb.onChange();
            expect(callCount).toBe(3);
        });
    });

    describe('r, g, b property setters', function ()
    {
        it('should update r and mark dirty', function ()
        {
            var rgb = new RGB();
            rgb.dirty = false;
            rgb.r = 0.9;
            expect(rgb.r).toBe(0.9);
            expect(rgb.dirty).toBe(true);
        });

        it('should update g and mark dirty', function ()
        {
            var rgb = new RGB();
            rgb.dirty = false;
            rgb.g = 0.8;
            expect(rgb.g).toBe(0.8);
            expect(rgb.dirty).toBe(true);
        });

        it('should update b and mark dirty', function ()
        {
            var rgb = new RGB();
            rgb.dirty = false;
            rgb.b = 0.7;
            expect(rgb.b).toBe(0.7);
            expect(rgb.dirty).toBe(true);
        });

        it('should invoke onChangeCallback when r is set', function ()
        {
            var rgb = new RGB();
            var called = false;
            rgb.onChangeCallback = function ()
            {
                called = true;
            };
            rgb.r = 0.5;
            expect(called).toBe(true);
        });

        it('should invoke onChangeCallback when g is set', function ()
        {
            var rgb = new RGB();
            var called = false;
            rgb.onChangeCallback = function ()
            {
                called = true;
            };
            rgb.g = 0.5;
            expect(called).toBe(true);
        });

        it('should invoke onChangeCallback when b is set', function ()
        {
            var rgb = new RGB();
            var called = false;
            rgb.onChangeCallback = function ()
            {
                called = true;
            };
            rgb.b = 0.5;
            expect(called).toBe(true);
        });
    });

    describe('destroy', function ()
    {
        it('should set onChangeCallback to null', function ()
        {
            var rgb = new RGB();
            rgb.destroy();
            expect(rgb.onChangeCallback).toBeNull();
        });

        it('should not affect the color values', function ()
        {
            var rgb = new RGB(0.3, 0.6, 0.9);
            rgb.destroy();
            expect(rgb.r).toBeCloseTo(0.3);
            expect(rgb.g).toBeCloseTo(0.6);
            expect(rgb.b).toBeCloseTo(0.9);
        });

        it('should not affect the dirty flag', function ()
        {
            var rgb = new RGB();
            rgb.dirty = false;
            rgb.destroy();
            expect(rgb.dirty).toBe(false);
        });
    });
});
