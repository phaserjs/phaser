var FilterBokeh = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterBokeh');

describe('FilterBokeh', function ()
{
    describe('setupUniforms', function ()
    {
        var mockProgramManager;
        var mockContext;
        var mockController;

        beforeEach(function ()
        {
            mockProgramManager = {
                setUniform: vi.fn()
            };

            mockController = {
                radius: 1.0,
                amount: 0.5,
                contrast: 0.2,
                strength: 1.5,
                blurX: 0.25,
                blurY: 0.75,
                isTiltShift: false
            };

            mockContext = {
                width: 800,
                height: 600
            };
        });

        it('should call setUniform for each expected uniform', function ()
        {
            FilterBokeh.prototype.setupUniforms.call(
                { programManager: mockProgramManager },
                mockController,
                mockContext
            );

            expect(mockProgramManager.setUniform).toHaveBeenCalledTimes(7);
        });

        it('should set radius from controller', function ()
        {
            mockController.radius = 2.5;

            FilterBokeh.prototype.setupUniforms.call(
                { programManager: mockProgramManager },
                mockController,
                mockContext
            );

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('radius', 2.5);
        });

        it('should set amount from controller', function ()
        {
            mockController.amount = 0.8;

            FilterBokeh.prototype.setupUniforms.call(
                { programManager: mockProgramManager },
                mockController,
                mockContext
            );

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('amount', 0.8);
        });

        it('should set contrast from controller', function ()
        {
            mockController.contrast = 0.9;

            FilterBokeh.prototype.setupUniforms.call(
                { programManager: mockProgramManager },
                mockController,
                mockContext
            );

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('contrast', 0.9);
        });

        it('should set strength from controller', function ()
        {
            mockController.strength = 3.0;

            FilterBokeh.prototype.setupUniforms.call(
                { programManager: mockProgramManager },
                mockController,
                mockContext
            );

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('strength', 3.0);
        });

        it('should set blur as an array of blurX and blurY from controller', function ()
        {
            mockController.blurX = 0.1;
            mockController.blurY = 0.9;

            FilterBokeh.prototype.setupUniforms.call(
                { programManager: mockProgramManager },
                mockController,
                mockContext
            );

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('blur', [ 0.1, 0.9 ]);
        });

        it('should set isTiltShift from controller when false', function ()
        {
            mockController.isTiltShift = false;

            FilterBokeh.prototype.setupUniforms.call(
                { programManager: mockProgramManager },
                mockController,
                mockContext
            );

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('isTiltShift', false);
        });

        it('should set isTiltShift from controller when true', function ()
        {
            mockController.isTiltShift = true;

            FilterBokeh.prototype.setupUniforms.call(
                { programManager: mockProgramManager },
                mockController,
                mockContext
            );

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('isTiltShift', true);
        });

        it('should set resolution as an array of width and height from drawing context', function ()
        {
            mockContext.width = 1920;
            mockContext.height = 1080;

            FilterBokeh.prototype.setupUniforms.call(
                { programManager: mockProgramManager },
                mockController,
                mockContext
            );

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('resolution', [ 1920, 1080 ]);
        });

        it('should set all uniforms with zero values when controller values are zero', function ()
        {
            mockController.radius = 0;
            mockController.amount = 0;
            mockController.contrast = 0;
            mockController.strength = 0;
            mockController.blurX = 0;
            mockController.blurY = 0;

            FilterBokeh.prototype.setupUniforms.call(
                { programManager: mockProgramManager },
                mockController,
                mockContext
            );

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('radius', 0);
            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('amount', 0);
            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('contrast', 0);
            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('strength', 0);
            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('blur', [ 0, 0 ]);
        });

        it('should set resolution with zero dimensions', function ()
        {
            mockContext.width = 0;
            mockContext.height = 0;

            FilterBokeh.prototype.setupUniforms.call(
                { programManager: mockProgramManager },
                mockController,
                mockContext
            );

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('resolution', [ 0, 0 ]);
        });

        it('should set blur with negative values', function ()
        {
            mockController.blurX = -0.5;
            mockController.blurY = -1.0;

            FilterBokeh.prototype.setupUniforms.call(
                { programManager: mockProgramManager },
                mockController,
                mockContext
            );

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('blur', [ -0.5, -1.0 ]);
        });

        it('should pass floating point values accurately', function ()
        {
            mockController.radius = 1.23456789;

            FilterBokeh.prototype.setupUniforms.call(
                { programManager: mockProgramManager },
                mockController,
                mockContext
            );

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('radius', 1.23456789);
        });
    });
});
