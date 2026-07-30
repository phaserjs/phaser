var FilterQuantize = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterQuantize');

describe('FilterQuantize', function ()
{
    it('should be importable', function ()
    {
        expect(FilterQuantize).toBeDefined();
    });

    describe('setupUniforms', function ()
    {
        var mockInstance;
        var mockProgramManager;
        var uniformCalls;

        beforeEach(function ()
        {
            uniformCalls = {};

            mockProgramManager = {
                setUniform: function (name, value)
                {
                    uniformCalls[name] = value;
                }
            };

            mockInstance = {
                programManager: mockProgramManager,
                setupUniforms: FilterQuantize.prototype.setupUniforms
            };
        });

        it('should set uSteps uniform from controller.steps', function ()
        {
            var controller = { steps: 8, gamma: 1.0, offset: 0.0, mode: 0, dither: false };
            mockInstance.setupUniforms(controller, null);
            expect(uniformCalls['uSteps']).toBe(8);
        });

        it('should set uGamma uniform from controller.gamma', function ()
        {
            var controller = { steps: 4, gamma: 2.2, offset: 0.0, mode: 0, dither: false };
            mockInstance.setupUniforms(controller, null);
            expect(uniformCalls['uGamma']).toBeCloseTo(2.2);
        });

        it('should set uOffset uniform from controller.offset', function ()
        {
            var controller = { steps: 4, gamma: 1.0, offset: 0.5, mode: 0, dither: false };
            mockInstance.setupUniforms(controller, null);
            expect(uniformCalls['uOffset']).toBeCloseTo(0.5);
        });

        it('should set uMode uniform from controller.mode', function ()
        {
            var controller = { steps: 4, gamma: 1.0, offset: 0.0, mode: 2, dither: false };
            mockInstance.setupUniforms(controller, null);
            expect(uniformCalls['uMode']).toBe(2);
        });

        it('should set uDither uniform from controller.dither', function ()
        {
            var controller = { steps: 4, gamma: 1.0, offset: 0.0, mode: 0, dither: true };
            mockInstance.setupUniforms(controller, null);
            expect(uniformCalls['uDither']).toBe(true);
        });

        it('should set all five uniforms in a single call', function ()
        {
            var controller = { steps: 16, gamma: 1.5, offset: 0.1, mode: 1, dither: false };
            mockInstance.setupUniforms(controller, null);
            expect(Object.keys(uniformCalls).length).toBe(5);
            expect(uniformCalls['uSteps']).toBe(16);
            expect(uniformCalls['uGamma']).toBeCloseTo(1.5);
            expect(uniformCalls['uOffset']).toBeCloseTo(0.1);
            expect(uniformCalls['uMode']).toBe(1);
            expect(uniformCalls['uDither']).toBe(false);
        });

        it('should pass zero values correctly', function ()
        {
            var controller = { steps: 0, gamma: 0, offset: 0, mode: 0, dither: false };
            mockInstance.setupUniforms(controller, null);
            expect(uniformCalls['uSteps']).toBe(0);
            expect(uniformCalls['uGamma']).toBe(0);
            expect(uniformCalls['uOffset']).toBe(0);
            expect(uniformCalls['uMode']).toBe(0);
            expect(uniformCalls['uDither']).toBe(false);
        });

        it('should pass negative values correctly', function ()
        {
            var controller = { steps: -1, gamma: -0.5, offset: -1.0, mode: -1, dither: false };
            mockInstance.setupUniforms(controller, null);
            expect(uniformCalls['uSteps']).toBe(-1);
            expect(uniformCalls['uGamma']).toBeCloseTo(-0.5);
            expect(uniformCalls['uOffset']).toBeCloseTo(-1.0);
            expect(uniformCalls['uMode']).toBe(-1);
        });

        it('should pass large step values correctly', function ()
        {
            var controller = { steps: 256, gamma: 1.0, offset: 0.0, mode: 0, dither: false };
            mockInstance.setupUniforms(controller, null);
            expect(uniformCalls['uSteps']).toBe(256);
        });

        it('should ignore the drawingContext argument', function ()
        {
            var controller = { steps: 4, gamma: 1.0, offset: 0.0, mode: 0, dither: false };
            var sentinel = {};
            mockInstance.setupUniforms(controller, sentinel);
            expect(uniformCalls['uSteps']).toBe(4);
        });

        it('should use programManager from the instance, not a global', function ()
        {
            var secondCalls = {};
            var secondInstance = {
                programManager: {
                    setUniform: function (name, value)
                    {
                        secondCalls[name] = value;
                    }
                },
                setupUniforms: FilterQuantize.prototype.setupUniforms
            };
            var controller = { steps: 3, gamma: 0.8, offset: 0.2, mode: 1, dither: true };
            secondInstance.setupUniforms(controller, null);
            expect(Object.keys(uniformCalls).length).toBe(0);
            expect(secondCalls['uSteps']).toBe(3);
        });

        it('should forward floating point step values without rounding', function ()
        {
            var controller = { steps: 7.5, gamma: 1.0, offset: 0.0, mode: 0, dither: false };
            mockInstance.setupUniforms(controller, null);
            expect(uniformCalls['uSteps']).toBeCloseTo(7.5);
        });
    });
});
