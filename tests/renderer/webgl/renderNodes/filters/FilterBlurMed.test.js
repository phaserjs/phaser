var FilterBlurMed = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterBlurMed');

describe('FilterBlurMed', function ()
{
    it('should be importable', function ()
    {
        expect(FilterBlurMed).toBeDefined();
    });

    it('should be a constructor function', function ()
    {
        expect(typeof FilterBlurMed).toBe('function');
    });

    it('should have a setupUniforms method on its prototype', function ()
    {
        expect(typeof FilterBlurMed.prototype.setupUniforms).toBe('function');
    });

    describe('setupUniforms', function ()
    {
        var mockInstance;
        var mockProgramManager;
        var mockController;
        var mockDrawingContext;
        var calls;

        beforeEach(function ()
        {
            calls = [];

            mockProgramManager = {
                setUniform: function (name, value)
                {
                    calls.push({ name: name, value: value });
                }
            };

            mockInstance = {
                programManager: mockProgramManager
            };

            mockController = {
                strength: 1.5,
                color: 0xffffff,
                x: 2,
                y: 0
            };

            mockDrawingContext = {
                width: 800,
                height: 600
            };
        });

        it('should call setUniform four times', function ()
        {
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            expect(calls.length).toBe(4);
        });

        it('should set resolution to an array of [width, height]', function ()
        {
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            var resolutionCall = calls.find(function (c) { return c.name === 'resolution'; });
            expect(resolutionCall).toBeDefined();
            expect(resolutionCall.value).toEqual([ 800, 600 ]);
        });

        it('should set strength from the controller', function ()
        {
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            var strengthCall = calls.find(function (c) { return c.name === 'strength'; });
            expect(strengthCall).toBeDefined();
            expect(strengthCall.value).toBe(1.5);
        });

        it('should set color from the controller', function ()
        {
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            var colorCall = calls.find(function (c) { return c.name === 'color'; });
            expect(colorCall).toBeDefined();
            expect(colorCall.value).toBe(0xffffff);
        });

        it('should set offset to an array of [controller.x, controller.y]', function ()
        {
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            var offsetCall = calls.find(function (c) { return c.name === 'offset'; });
            expect(offsetCall).toBeDefined();
            expect(offsetCall.value).toEqual([ 2, 0 ]);
        });

        it('should pass resolution width and height as separate array elements', function ()
        {
            mockDrawingContext.width = 1920;
            mockDrawingContext.height = 1080;
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            var resolutionCall = calls.find(function (c) { return c.name === 'resolution'; });
            expect(resolutionCall.value[0]).toBe(1920);
            expect(resolutionCall.value[1]).toBe(1080);
        });

        it('should pass offset x and y as separate array elements', function ()
        {
            mockController.x = 3.5;
            mockController.y = 7.25;
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            var offsetCall = calls.find(function (c) { return c.name === 'offset'; });
            expect(offsetCall.value[0]).toBeCloseTo(3.5);
            expect(offsetCall.value[1]).toBeCloseTo(7.25);
        });

        it('should pass zero strength correctly', function ()
        {
            mockController.strength = 0;
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            var strengthCall = calls.find(function (c) { return c.name === 'strength'; });
            expect(strengthCall.value).toBe(0);
        });

        it('should pass negative strength correctly', function ()
        {
            mockController.strength = -2;
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            var strengthCall = calls.find(function (c) { return c.name === 'strength'; });
            expect(strengthCall.value).toBe(-2);
        });

        it('should pass floating point strength correctly', function ()
        {
            mockController.strength = 0.75;
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            var strengthCall = calls.find(function (c) { return c.name === 'strength'; });
            expect(strengthCall.value).toBeCloseTo(0.75);
        });

        it('should pass zero offset values correctly', function ()
        {
            mockController.x = 0;
            mockController.y = 0;
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            var offsetCall = calls.find(function (c) { return c.name === 'offset'; });
            expect(offsetCall.value).toEqual([ 0, 0 ]);
        });

        it('should pass negative offset values correctly', function ()
        {
            mockController.x = -1;
            mockController.y = -1;
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            var offsetCall = calls.find(function (c) { return c.name === 'offset'; });
            expect(offsetCall.value).toEqual([ -1, -1 ]);
        });

        it('should set uniforms in order: resolution, strength, color, offset', function ()
        {
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            expect(calls[0].name).toBe('resolution');
            expect(calls[1].name).toBe('strength');
            expect(calls[2].name).toBe('color');
            expect(calls[3].name).toBe('offset');
        });

        it('should use the programManager from the instance', function ()
        {
            var alternativeCalls = [];
            var alternativeProgramManager = {
                setUniform: function (name, value)
                {
                    alternativeCalls.push({ name: name, value: value });
                }
            };
            mockInstance.programManager = alternativeProgramManager;
            FilterBlurMed.prototype.setupUniforms.call(mockInstance, mockController, mockDrawingContext);
            expect(alternativeCalls.length).toBe(4);
            expect(calls.length).toBe(0);
        });
    });
});
