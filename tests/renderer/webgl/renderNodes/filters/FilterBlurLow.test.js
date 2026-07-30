var FilterBlurLow = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterBlurLow');

describe('FilterBlurLow', function ()
{
    it('should be importable', function ()
    {
        expect(FilterBlurLow).toBeDefined();
    });

    describe('setupUniforms', function ()
    {
        var instance;
        var mockProgramManager;
        var mockController;
        var mockDrawingContext;

        beforeEach(function ()
        {
            mockProgramManager = {
                calls: [],
                setUniform: function (name, value)
                {
                    this.calls.push({ name: name, value: value });
                }
            };

            instance = {
                programManager: mockProgramManager
            };

            mockController = {
                strength: 2,
                color: 0xffffff,
                x: 1,
                y: 0
            };

            mockDrawingContext = {
                width: 800,
                height: 600
            };
        });

        it('should set resolution uniform from drawingContext dimensions', function ()
        {
            FilterBlurLow.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var call = mockProgramManager.calls.find(function (c) { return c.name === 'resolution'; });
            expect(call).toBeDefined();
            expect(call.value).toEqual([ 800, 600 ]);
        });

        it('should set strength uniform from controller', function ()
        {
            FilterBlurLow.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var call = mockProgramManager.calls.find(function (c) { return c.name === 'strength'; });
            expect(call).toBeDefined();
            expect(call.value).toBe(2);
        });

        it('should set color uniform from controller', function ()
        {
            FilterBlurLow.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var call = mockProgramManager.calls.find(function (c) { return c.name === 'color'; });
            expect(call).toBeDefined();
            expect(call.value).toBe(0xffffff);
        });

        it('should set offset uniform as array of controller x and y', function ()
        {
            FilterBlurLow.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var call = mockProgramManager.calls.find(function (c) { return c.name === 'offset'; });
            expect(call).toBeDefined();
            expect(call.value).toEqual([ 1, 0 ]);
        });

        it('should call setUniform exactly four times', function ()
        {
            FilterBlurLow.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            expect(mockProgramManager.calls.length).toBe(4);
        });

        it('should use controller x and y values for the offset vector', function ()
        {
            mockController.x = 3;
            mockController.y = 7;

            FilterBlurLow.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var call = mockProgramManager.calls.find(function (c) { return c.name === 'offset'; });
            expect(call.value).toEqual([ 3, 7 ]);
        });

        it('should use drawingContext width and height for resolution', function ()
        {
            mockDrawingContext.width = 1920;
            mockDrawingContext.height = 1080;

            FilterBlurLow.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var call = mockProgramManager.calls.find(function (c) { return c.name === 'resolution'; });
            expect(call.value).toEqual([ 1920, 1080 ]);
        });

        it('should handle zero dimensions in drawingContext', function ()
        {
            mockDrawingContext.width = 0;
            mockDrawingContext.height = 0;

            FilterBlurLow.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var call = mockProgramManager.calls.find(function (c) { return c.name === 'resolution'; });
            expect(call.value).toEqual([ 0, 0 ]);
        });

        it('should handle zero strength', function ()
        {
            mockController.strength = 0;

            FilterBlurLow.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var call = mockProgramManager.calls.find(function (c) { return c.name === 'strength'; });
            expect(call.value).toBe(0);
        });

        it('should handle floating point strength values', function ()
        {
            mockController.strength = 1.5;

            FilterBlurLow.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var call = mockProgramManager.calls.find(function (c) { return c.name === 'strength'; });
            expect(call.value).toBeCloseTo(1.5);
        });

        it('should handle floating point offset values', function ()
        {
            mockController.x = 0.5;
            mockController.y = -0.5;

            FilterBlurLow.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var call = mockProgramManager.calls.find(function (c) { return c.name === 'offset'; });
            expect(call.value[0]).toBeCloseTo(0.5);
            expect(call.value[1]).toBeCloseTo(-0.5);
        });
    });
});
