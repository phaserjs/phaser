var Quantize = require('../../src/filters/Quantize');

describe('Quantize', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = {};
    });

    describe('constructor defaults', function ()
    {
        it('should create a Quantize instance with default steps', function ()
        {
            var q = new Quantize(mockCamera);
            expect(q.steps[0]).toBe(8);
            expect(q.steps[1]).toBe(8);
            expect(q.steps[2]).toBe(8);
            expect(q.steps[3]).toBe(8);
        });

        it('should create a Quantize instance with default gamma', function ()
        {
            var q = new Quantize(mockCamera);
            expect(q.gamma[0]).toBe(1);
            expect(q.gamma[1]).toBe(1);
            expect(q.gamma[2]).toBe(1);
            expect(q.gamma[3]).toBe(1);
        });

        it('should create a Quantize instance with default offset', function ()
        {
            var q = new Quantize(mockCamera);
            expect(q.offset[0]).toBe(0);
            expect(q.offset[1]).toBe(0);
            expect(q.offset[2]).toBe(0);
            expect(q.offset[3]).toBe(0);
        });

        it('should default mode to 0 (RGBA)', function ()
        {
            var q = new Quantize(mockCamera);
            expect(q.mode).toBe(0);
        });

        it('should default dither to false', function ()
        {
            var q = new Quantize(mockCamera);
            expect(q.dither).toBe(false);
        });

        it('should set renderNode to FilterQuantize', function ()
        {
            var q = new Quantize(mockCamera);
            expect(q.renderNode).toBe('FilterQuantize');
        });

        it('should set camera reference', function ()
        {
            var q = new Quantize(mockCamera);
            expect(q.camera).toBe(mockCamera);
        });

        it('should be active by default', function ()
        {
            var q = new Quantize(mockCamera);
            expect(q.active).toBe(true);
        });

        it('should work with no config argument', function ()
        {
            var q = new Quantize(mockCamera);
            expect(q.steps).toBeDefined();
            expect(q.gamma).toBeDefined();
            expect(q.offset).toBeDefined();
        });

        it('should work with an empty config object', function ()
        {
            var q = new Quantize(mockCamera, {});
            expect(q.steps[0]).toBe(8);
            expect(q.gamma[0]).toBe(1);
            expect(q.offset[0]).toBe(0);
            expect(q.mode).toBe(0);
            expect(q.dither).toBe(false);
        });
    });

    describe('constructor with config', function ()
    {
        it('should apply custom steps from config', function ()
        {
            var q = new Quantize(mockCamera, { steps: [ 16, 4, 4, 1 ] });
            expect(q.steps[0]).toBe(16);
            expect(q.steps[1]).toBe(4);
            expect(q.steps[2]).toBe(4);
            expect(q.steps[3]).toBe(1);
        });

        it('should apply custom gamma from config', function ()
        {
            var q = new Quantize(mockCamera, { gamma: [ 2.2, 2.2, 2.2, 1.0 ] });
            expect(q.gamma[0]).toBe(2.2);
            expect(q.gamma[1]).toBe(2.2);
            expect(q.gamma[2]).toBe(2.2);
            expect(q.gamma[3]).toBe(1.0);
        });

        it('should apply custom offset from config', function ()
        {
            var q = new Quantize(mockCamera, { offset: [ 0.1, 0.2, 0.3, 0.4 ] });
            expect(q.offset[0]).toBeCloseTo(0.1);
            expect(q.offset[1]).toBeCloseTo(0.2);
            expect(q.offset[2]).toBeCloseTo(0.3);
            expect(q.offset[3]).toBeCloseTo(0.4);
        });

        it('should set mode to 1 (HSVA) from config', function ()
        {
            var q = new Quantize(mockCamera, { mode: 1 });
            expect(q.mode).toBe(1);
        });

        it('should set mode to 0 from config', function ()
        {
            var q = new Quantize(mockCamera, { mode: 0 });
            expect(q.mode).toBe(0);
        });

        it('should set dither to true from config', function ()
        {
            var q = new Quantize(mockCamera, { dither: true });
            expect(q.dither).toBe(true);
        });

        it('should set dither to false from config', function ()
        {
            var q = new Quantize(mockCamera, { dither: false });
            expect(q.dither).toBe(false);
        });

        it('should coerce truthy dither values to boolean true', function ()
        {
            var q = new Quantize(mockCamera, { dither: 1 });
            expect(q.dither).toBe(true);
        });

        it('should coerce falsy dither values to boolean false', function ()
        {
            var q = new Quantize(mockCamera, { dither: 0 });
            expect(q.dither).toBe(false);
        });

        it('should apply all config options together', function ()
        {
            var q = new Quantize(mockCamera, {
                steps: [ 16, 1, 1, 1 ],
                gamma: [ 1.5, 1.0, 1.0, 1.0 ],
                offset: [ 0.05, 0, 0, 0 ],
                mode: 1,
                dither: true
            });
            expect(q.steps[0]).toBe(16);
            expect(q.steps[1]).toBe(1);
            expect(q.steps[2]).toBe(1);
            expect(q.steps[3]).toBe(1);
            expect(q.gamma[0]).toBe(1.5);
            expect(q.offset[0]).toBeCloseTo(0.05);
            expect(q.mode).toBe(1);
            expect(q.dither).toBe(true);
        });
    });

    describe('steps array', function ()
    {
        it('should be an array of length 4', function ()
        {
            var q = new Quantize(mockCamera);
            expect(Array.isArray(q.steps)).toBe(true);
            expect(q.steps.length).toBe(4);
        });

        it('should accept step value of 1 (no quantization)', function ()
        {
            var q = new Quantize(mockCamera, { steps: [ 1, 1, 1, 1 ] });
            expect(q.steps[0]).toBe(1);
            expect(q.steps[1]).toBe(1);
            expect(q.steps[2]).toBe(1);
            expect(q.steps[3]).toBe(1);
        });

        it('should accept large step values', function ()
        {
            var q = new Quantize(mockCamera, { steps: [ 256, 256, 256, 256 ] });
            expect(q.steps[0]).toBe(256);
        });

        it('should accept mixed step values', function ()
        {
            var q = new Quantize(mockCamera, { steps: [ 32, 8, 4, 1 ] });
            expect(q.steps[0]).toBe(32);
            expect(q.steps[1]).toBe(8);
            expect(q.steps[2]).toBe(4);
            expect(q.steps[3]).toBe(1);
        });
    });

    describe('gamma array', function ()
    {
        it('should be an array of length 4', function ()
        {
            var q = new Quantize(mockCamera);
            expect(Array.isArray(q.gamma)).toBe(true);
            expect(q.gamma.length).toBe(4);
        });

        it('should accept gamma values less than 1 (darken bias)', function ()
        {
            var q = new Quantize(mockCamera, { gamma: [ 0.5, 0.5, 0.5, 1.0 ] });
            expect(q.gamma[0]).toBe(0.5);
        });

        it('should accept gamma values greater than 1 (lighten bias)', function ()
        {
            var q = new Quantize(mockCamera, { gamma: [ 2.2, 2.2, 2.2, 1.0 ] });
            expect(q.gamma[0]).toBeCloseTo(2.2);
        });

        it('should accept floating point gamma values', function ()
        {
            var q = new Quantize(mockCamera, { gamma: [ 1.8, 0.7, 1.2, 1.0 ] });
            expect(q.gamma[0]).toBeCloseTo(1.8);
            expect(q.gamma[1]).toBeCloseTo(0.7);
            expect(q.gamma[2]).toBeCloseTo(1.2);
            expect(q.gamma[3]).toBe(1.0);
        });
    });

    describe('offset array', function ()
    {
        it('should be an array of length 4', function ()
        {
            var q = new Quantize(mockCamera);
            expect(Array.isArray(q.offset)).toBe(true);
            expect(q.offset.length).toBe(4);
        });

        it('should accept negative offset values', function ()
        {
            var q = new Quantize(mockCamera, { offset: [ -0.1, -0.2, -0.3, 0 ] });
            expect(q.offset[0]).toBeCloseTo(-0.1);
            expect(q.offset[1]).toBeCloseTo(-0.2);
            expect(q.offset[2]).toBeCloseTo(-0.3);
        });

        it('should accept positive offset values', function ()
        {
            var q = new Quantize(mockCamera, { offset: [ 0.25, 0.5, 0.75, 0 ] });
            expect(q.offset[0]).toBeCloseTo(0.25);
            expect(q.offset[1]).toBeCloseTo(0.5);
            expect(q.offset[2]).toBeCloseTo(0.75);
        });

        it('should accept zero offset values', function ()
        {
            var q = new Quantize(mockCamera, { offset: [ 0, 0, 0, 0 ] });
            expect(q.offset[0]).toBe(0);
            expect(q.offset[3]).toBe(0);
        });
    });

    describe('mode property', function ()
    {
        it('should default to 0 when mode is not in config', function ()
        {
            var q = new Quantize(mockCamera, {});
            expect(q.mode).toBe(0);
        });

        it('should use 0 when config.mode is falsy (0)', function ()
        {
            var q = new Quantize(mockCamera, { mode: 0 });
            expect(q.mode).toBe(0);
        });

        it('should set mode to 1 for HSVA', function ()
        {
            var q = new Quantize(mockCamera, { mode: 1 });
            expect(q.mode).toBe(1);
        });
    });

    describe('dither property', function ()
    {
        it('should be a boolean', function ()
        {
            var q = new Quantize(mockCamera);
            expect(typeof q.dither).toBe('boolean');
        });

        it('should be false by default', function ()
        {
            var q = new Quantize(mockCamera);
            expect(q.dither).toBe(false);
        });

        it('should be true when config.dither is true', function ()
        {
            var q = new Quantize(mockCamera, { dither: true });
            expect(q.dither).toBe(true);
        });
    });

    describe('inherited Controller methods', function ()
    {
        it('should have a getPadding method', function ()
        {
            var q = new Quantize(mockCamera);
            expect(typeof q.getPadding).toBe('function');
        });

        it('should have a setActive method', function ()
        {
            var q = new Quantize(mockCamera);
            expect(typeof q.setActive).toBe('function');
        });

        it('should have a destroy method', function ()
        {
            var q = new Quantize(mockCamera);
            expect(typeof q.destroy).toBe('function');
        });

        it('should disable filter with setActive(false)', function ()
        {
            var q = new Quantize(mockCamera);
            q.setActive(false);
            expect(q.active).toBe(false);
        });

        it('should enable filter with setActive(true)', function ()
        {
            var q = new Quantize(mockCamera);
            q.setActive(false);
            q.setActive(true);
            expect(q.active).toBe(true);
        });

        it('should null camera and renderNode on destroy', function ()
        {
            var q = new Quantize(mockCamera);
            q.destroy();
            expect(q.camera).toBeNull();
            expect(q.renderNode).toBeNull();
        });

        it('should set active to false on destroy', function ()
        {
            var q = new Quantize(mockCamera);
            q.destroy();
            expect(q.active).toBe(false);
        });

        it('should return padding override from getPadding', function ()
        {
            var q = new Quantize(mockCamera);
            var padding = q.getPadding();
            expect(padding).toBeDefined();
        });
    });
});
