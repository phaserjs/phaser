var FilterVignette = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterVignette');

describe('FilterVignette', function ()
{
    it('should be importable', function ()
    {
        expect(FilterVignette).toBeDefined();
    });

    describe('setupUniforms', function ()
    {
        var mockInstance;
        var mockProgramManager;
        var mockController;

        beforeEach(function ()
        {
            mockProgramManager = {
                setUniform: vi.fn()
            };

            mockInstance = {
                programManager: mockProgramManager
            };

            mockController = {
                radius: 0.5,
                strength: 0.8,
                x: 0.5,
                y: 0.5,
                blendMode: 0,
                color: {
                    redGL: 0.0,
                    greenGL: 0.0,
                    blueGL: 0.0,
                    alphaGL: 1.0
                }
            };
        });

        it('should call setUniform for uRadius with controller.radius', function ()
        {
            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('uRadius', 0.5);
        });

        it('should call setUniform for uStrength with controller.strength', function ()
        {
            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('uStrength', 0.8);
        });

        it('should call setUniform for uPosition with [controller.x, controller.y]', function ()
        {
            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('uPosition', [ 0.5, 0.5 ]);
        });

        it('should call setUniform for uColor with color channel values', function ()
        {
            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('uColor', [ 0.0, 0.0, 0.0, 1.0 ]);
        });

        it('should call setUniform for uBlendMode with controller.blendMode', function ()
        {
            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('uBlendMode', 0);
        });

        it('should call setUniform exactly five times', function ()
        {
            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.setUniform).toHaveBeenCalledTimes(5);
        });

        it('should pass custom radius value to uRadius', function ()
        {
            mockController.radius = 0.25;

            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('uRadius', 0.25);
        });

        it('should pass custom strength value to uStrength', function ()
        {
            mockController.strength = 1.0;

            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('uStrength', 1.0);
        });

        it('should pass custom position values to uPosition', function ()
        {
            mockController.x = 0.25;
            mockController.y = 0.75;

            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('uPosition', [ 0.25, 0.75 ]);
        });

        it('should pass custom color channel values to uColor', function ()
        {
            mockController.color = {
                redGL: 1.0,
                greenGL: 0.5,
                blueGL: 0.25,
                alphaGL: 0.8
            };

            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('uColor', [ 1.0, 0.5, 0.25, 0.8 ]);
        });

        it('should pass custom blendMode value to uBlendMode', function ()
        {
            mockController.blendMode = 2;

            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('uBlendMode', 2);
        });

        it('should pass zero values correctly for radius and strength', function ()
        {
            mockController.radius = 0;
            mockController.strength = 0;

            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('uRadius', 0);
            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('uStrength', 0);
        });

        it('should pass zero position values correctly', function ()
        {
            mockController.x = 0;
            mockController.y = 0;

            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('uPosition', [ 0, 0 ]);
        });

        it('should ignore the drawingContext argument', function ()
        {
            var fakContext = { someProperty: 'value' };

            expect(function ()
            {
                FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, fakContext);
            }).not.toThrow();

            expect(mockProgramManager.setUniform).toHaveBeenCalledTimes(5);
        });

        it('should pass floating point color channel values correctly', function ()
        {
            mockController.color = {
                redGL: 0.333,
                greenGL: 0.667,
                blueGL: 0.111,
                alphaGL: 0.999
            };

            FilterVignette.prototype.setupUniforms.call(mockInstance, mockController, null);

            var colorCall = mockProgramManager.setUniform.mock.calls.find(function (call)
            {
                return call[0] === 'uColor';
            });

            expect(colorCall).toBeDefined();
            expect(colorCall[1][0]).toBeCloseTo(0.333);
            expect(colorCall[1][1]).toBeCloseTo(0.667);
            expect(colorCall[1][2]).toBeCloseTo(0.111);
            expect(colorCall[1][3]).toBeCloseTo(0.999);
        });
    });
});
