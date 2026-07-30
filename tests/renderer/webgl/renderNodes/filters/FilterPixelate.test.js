vi.mock('../../../../../src/renderer/webgl/renderNodes/filters/BaseFilterShader', function ()
{
    function BaseFilterShader () {}
    BaseFilterShader.prototype = {};
    return BaseFilterShader;
});

vi.mock('../../../../../src/renderer/webgl/shaders/FilterPixelate-frag.js', function ()
{
    return 'mock-frag-shader-source';
});

var FilterPixelate = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterPixelate');

describe('FilterPixelate', function ()
{
    describe('setupUniforms', function ()
    {
        var instance;
        var mockProgramManager;
        var mockController;
        var mockDrawingContext;

        beforeEach(function ()
        {
            mockProgramManager = {
                setUniform: vi.fn()
            };

            instance = Object.create(FilterPixelate.prototype);
            instance.programManager = mockProgramManager;

            mockController = {
                amount: 4
            };

            mockDrawingContext = {
                width: 800,
                height: 600
            };
        });

        it('should call setUniform with amount from the controller', function ()
        {
            FilterPixelate.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('amount', 4);
        });

        it('should call setUniform with resolution from the drawing context', function ()
        {
            FilterPixelate.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('resolution', [ 800, 600 ]);
        });

        it('should call setUniform exactly twice', function ()
        {
            FilterPixelate.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            expect(mockProgramManager.setUniform).toHaveBeenCalledTimes(2);
        });

        it('should pass amount before resolution', function ()
        {
            FilterPixelate.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var calls = mockProgramManager.setUniform.mock.calls;
            expect(calls[0][0]).toBe('amount');
            expect(calls[1][0]).toBe('resolution');
        });

        it('should use controller amount of 1', function ()
        {
            mockController.amount = 1;
            FilterPixelate.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('amount', 1);
        });

        it('should use a large amount value', function ()
        {
            mockController.amount = 64;
            FilterPixelate.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('amount', 64);
        });

        it('should use a floating point amount value', function ()
        {
            mockController.amount = 2.5;
            FilterPixelate.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('amount', 2.5);
        });

        it('should pass resolution as an array with width as first element', function ()
        {
            mockDrawingContext.width = 1920;
            mockDrawingContext.height = 1080;
            FilterPixelate.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var resolutionCall = mockProgramManager.setUniform.mock.calls[1];
            expect(resolutionCall[1][0]).toBe(1920);
        });

        it('should pass resolution as an array with height as second element', function ()
        {
            mockDrawingContext.width = 1920;
            mockDrawingContext.height = 1080;
            FilterPixelate.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var resolutionCall = mockProgramManager.setUniform.mock.calls[1];
            expect(resolutionCall[1][1]).toBe(1080);
        });

        it('should pass resolution as a two-element array', function ()
        {
            FilterPixelate.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            var resolutionCall = mockProgramManager.setUniform.mock.calls[1];
            expect(resolutionCall[1].length).toBe(2);
        });

        it('should handle zero amount', function ()
        {
            mockController.amount = 0;
            FilterPixelate.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('amount', 0);
        });

        it('should handle square resolution', function ()
        {
            mockDrawingContext.width = 512;
            mockDrawingContext.height = 512;
            FilterPixelate.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('resolution', [ 512, 512 ]);
        });

        it('should handle small resolution', function ()
        {
            mockDrawingContext.width = 1;
            mockDrawingContext.height = 1;
            FilterPixelate.prototype.setupUniforms.call(instance, mockController, mockDrawingContext);

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('resolution', [ 1, 1 ]);
        });
    });
});
