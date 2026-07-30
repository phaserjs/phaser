var EmitterColorOp = require('../../../src/gameobjects/particles/EmitterColorOp');

describe('EmitterColorOp', function ()
{
    describe('Constructor', function ()
    {
        it('should create an instance with the given key', function ()
        {
            var op = new EmitterColorOp('color');
            expect(op.propertyKey).toBe('color');
        });

        it('should set propertyValue to null by default', function ()
        {
            var op = new EmitterColorOp('color');
            expect(op.propertyValue).toBeNull();
        });

        it('should set active to false', function ()
        {
            var op = new EmitterColorOp('color');
            expect(op.active).toBe(false);
        });

        it('should set easeName to Linear', function ()
        {
            var op = new EmitterColorOp('color');
            expect(op.easeName).toBe('Linear');
        });

        it('should initialize r as an empty array', function ()
        {
            var op = new EmitterColorOp('color');
            expect(Array.isArray(op.r)).toBe(true);
            expect(op.r.length).toBe(0);
        });

        it('should initialize g as an empty array', function ()
        {
            var op = new EmitterColorOp('color');
            expect(Array.isArray(op.g)).toBe(true);
            expect(op.g.length).toBe(0);
        });

        it('should initialize b as an empty array', function ()
        {
            var op = new EmitterColorOp('color');
            expect(Array.isArray(op.b)).toBe(true);
            expect(op.b.length).toBe(0);
        });
    });

    describe('getMethod', function ()
    {
        it('should return 0 when propertyValue is null', function ()
        {
            var op = new EmitterColorOp('color');
            expect(op.getMethod()).toBe(0);
        });

        it('should return 9 when propertyValue is set to a color array', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00, 0x0000ff ];
            expect(op.getMethod()).toBe(9);
        });

        it('should return 9 when propertyValue is a single-element array', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xffffff ];
            expect(op.getMethod()).toBe(9);
        });
    });

    describe('setMethods', function ()
    {
        it('should return this for chaining', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00 ];
            op.method = 9;
            var result = op.setMethods();
            expect(result).toBe(op);
        });

        it('should set active to true when method is 9', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00 ];
            op.method = 9;
            op.setMethods();
            expect(op.active).toBe(true);
        });

        it('should populate the r array with red components', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00, 0x0000ff ];
            op.method = 9;
            op.setMethods();
            expect(op.r.length).toBe(3);
            expect(op.r[0]).toBe(255);
            expect(op.r[1]).toBe(0);
            expect(op.r[2]).toBe(0);
        });

        it('should populate the g array with green components', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00, 0x0000ff ];
            op.method = 9;
            op.setMethods();
            expect(op.g.length).toBe(3);
            expect(op.g[0]).toBe(0);
            expect(op.g[1]).toBe(255);
            expect(op.g[2]).toBe(0);
        });

        it('should populate the b array with blue components', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00, 0x0000ff ];
            op.method = 9;
            op.setMethods();
            expect(op.b.length).toBe(3);
            expect(op.b[0]).toBe(0);
            expect(op.b[1]).toBe(0);
            expect(op.b[2]).toBe(255);
        });

        it('should set start to the first color value', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00 ];
            op.method = 9;
            op.setMethods();
            expect(op.start).toBe(0xff0000);
        });

        it('should set current to the first color value', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00 ];
            op.method = 9;
            op.setMethods();
            expect(op.current).toBe(0xff0000);
        });

        it('should set ease to a function when method is 9', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00 ];
            op.method = 9;
            op.setMethods();
            expect(typeof op.ease).toBe('function');
        });

        it('should set interpolation to a function when method is 9', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00 ];
            op.method = 9;
            op.setMethods();
            expect(typeof op.interpolation).toBe('function');
        });

        it('should set onEmit to easedValueEmit when method is 9', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00 ];
            op.method = 9;
            op.setMethods();
            expect(op.onEmit).toBe(op.easedValueEmit);
        });

        it('should set onUpdate to easeValueUpdate when method is 9', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00 ];
            op.method = 9;
            op.setMethods();
            expect(op.onUpdate).toBe(op.easeValueUpdate);
        });

        it('should clear existing r, g, b arrays before repopulating', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00 ];
            op.method = 9;
            op.setMethods();
            op.propertyValue = [ 0x0000ff ];
            op.setMethods();
            expect(op.r.length).toBe(1);
            expect(op.g.length).toBe(1);
            expect(op.b.length).toBe(1);
        });

        it('should handle a two-color gradient', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xffffff, 0x000000 ];
            op.method = 9;
            op.setMethods();
            expect(op.r.length).toBe(2);
            expect(op.r[0]).toBe(255);
            expect(op.r[1]).toBe(0);
            expect(op.g[0]).toBe(255);
            expect(op.g[1]).toBe(0);
            expect(op.b[0]).toBe(255);
            expect(op.b[1]).toBe(0);
        });

        it('should use defaultEmit and defaultUpdate when method is 0', function ()
        {
            var op = new EmitterColorOp('color');
            op.method = 0;
            op.setMethods();
            expect(op.onEmit).toBe(op.defaultEmit);
            expect(op.onUpdate).toBe(op.defaultUpdate);
        });

        it('should not set active to true when method is 0', function ()
        {
            var op = new EmitterColorOp('color');
            op.method = 0;
            op.setMethods();
            expect(op.active).toBe(false);
        });
    });

    describe('setEase', function ()
    {
        it('should update easeName to the given value', function ()
        {
            var op = new EmitterColorOp('color');
            op.setEase('Sine.easeIn');
            expect(op.easeName).toBe('Sine.easeIn');
        });

        it('should set ease to a function', function ()
        {
            var op = new EmitterColorOp('color');
            op.setEase('Quad.easeOut');
            expect(typeof op.ease).toBe('function');
        });

        it('should override the previous ease function', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x0000ff ];
            op.method = 9;
            op.setMethods();
            var firstEase = op.ease;
            op.setEase('Cubic.easeIn');
            expect(op.ease).not.toBe(firstEase);
            expect(op.easeName).toBe('Cubic.easeIn');
        });

        it('should accept Linear ease by name', function ()
        {
            var op = new EmitterColorOp('color');
            op.setEase('Linear');
            expect(op.easeName).toBe('Linear');
            expect(typeof op.ease).toBe('function');
        });
    });

    describe('easedValueEmit', function ()
    {
        it('should return the start value', function ()
        {
            var op = new EmitterColorOp('color');
            op.start = 0xff0000;
            var result = op.easedValueEmit();
            expect(result).toBe(0xff0000);
        });

        it('should set current to start', function ()
        {
            var op = new EmitterColorOp('color');
            op.start = 0x00ff00;
            op.current = 0;
            op.easedValueEmit();
            expect(op.current).toBe(0x00ff00);
        });

        it('should work with zero as the start value', function ()
        {
            var op = new EmitterColorOp('color');
            op.start = 0;
            var result = op.easedValueEmit();
            expect(result).toBe(0);
            expect(op.current).toBe(0);
        });

        it('should ignore particle and key arguments', function ()
        {
            var op = new EmitterColorOp('color');
            op.start = 0xaabbcc;
            var fakeParticle = { x: 10, lifeT: 0 };
            var result = op.easedValueEmit(fakeParticle, 'color');
            expect(result).toBe(0xaabbcc);
        });
    });

    describe('easeValueUpdate', function ()
    {
        it('should return a packed RGB integer', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x0000ff ];
            op.method = 9;
            op.setMethods();
            var result = op.easeValueUpdate(null, 'color', 0.5);
            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThanOrEqual(0);
        });

        it('should return the first color at t=0', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x0000ff ];
            op.method = 9;
            op.setMethods();
            var result = op.easeValueUpdate(null, 'color', 0);
            // At t=0, should be close to red (0xff0000 = 16711680)
            expect(result).toBe(0xff0000);
        });

        it('should return the last color at t=1', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x0000ff ];
            op.method = 9;
            op.setMethods();
            var result = op.easeValueUpdate(null, 'color', 1);
            // At t=1, should be close to blue (0x0000ff = 255)
            expect(result).toBe(0x0000ff);
        });

        it('should update current property with the result', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x0000ff ];
            op.method = 9;
            op.setMethods();
            op.current = 0;
            var result = op.easeValueUpdate(null, 'color', 0.5);
            expect(op.current).toBe(result);
        });

        it('should produce midpoint color for a white-to-black gradient at t=0.5', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xffffff, 0x000000 ];
            op.method = 9;
            op.setMethods();
            var result = op.easeValueUpdate(null, 'color', 0.5);
            // Mid-grey: r=127 or 128, g=127 or 128, b=127 or 128
            var r = (result >> 16) & 0xff;
            var g = (result >> 8) & 0xff;
            var b = result & 0xff;
            expect(r).toBeGreaterThan(100);
            expect(r).toBeLessThan(160);
            expect(g).toBeGreaterThan(100);
            expect(g).toBeLessThan(160);
            expect(b).toBeGreaterThan(100);
            expect(b).toBeLessThan(160);
        });

        it('should interpolate across three colors', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x00ff00, 0x0000ff ];
            op.method = 9;
            op.setMethods();
            var r0 = op.easeValueUpdate(null, 'color', 0);
            var r1 = op.easeValueUpdate(null, 'color', 1);
            expect(r0).toBe(0xff0000);
            expect(r1).toBe(0x0000ff);
        });

        it('should return consistent values when called repeatedly with same t', function ()
        {
            var op = new EmitterColorOp('color');
            op.propertyValue = [ 0xff0000, 0x0000ff ];
            op.method = 9;
            op.setMethods();
            var result1 = op.easeValueUpdate(null, 'color', 0.75);
            var result2 = op.easeValueUpdate(null, 'color', 0.75);
            expect(result1).toBe(result2);
        });
    });
});
