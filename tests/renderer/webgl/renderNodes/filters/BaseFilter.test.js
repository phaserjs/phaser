var BaseFilter = require('../../../../../src/renderer/webgl/renderNodes/filters/BaseFilter');

describe('BaseFilter', function ()
{
    var mockManager;

    beforeEach(function ()
    {
        mockManager = {
            renderer: {},
            nodes: {}
        };
    });

    describe('constructor', function ()
    {
        it('should create a BaseFilter with the given name', function ()
        {
            var filter = new BaseFilter('TestFilter', mockManager);
            expect(filter.name).toBe('TestFilter');
        });

        it('should create a BaseFilter with the given manager', function ()
        {
            var filter = new BaseFilter('TestFilter', mockManager);
            expect(filter.manager).toBe(mockManager);
        });

        it('should create a BaseFilter with any string name', function ()
        {
            var filter = new BaseFilter('BlurFilter', mockManager);
            expect(filter.name).toBe('BlurFilter');

            var filter2 = new BaseFilter('GlowFilter', mockManager);
            expect(filter2.name).toBe('GlowFilter');
        });

        it('should create a BaseFilter with an empty string name', function ()
        {
            var filter = new BaseFilter('', mockManager);
            expect(filter.name).toBe('');
        });
    });

    describe('run', function ()
    {
        it('should return undefined (base implementation does nothing)', function ()
        {
            var filter = new BaseFilter('TestFilter', mockManager);
            var result = filter.run({}, {}, {}, {});
            expect(result).toBeUndefined();
        });

        it('should return undefined when called with no arguments', function ()
        {
            var filter = new BaseFilter('TestFilter', mockManager);
            var result = filter.run();
            expect(result).toBeUndefined();
        });

        it('should return undefined when called with only a controller', function ()
        {
            var filter = new BaseFilter('TestFilter', mockManager);
            var mockController = { padding: { x: 0, y: 0 } };
            var result = filter.run(mockController);
            expect(result).toBeUndefined();
        });

        it('should return undefined when called with controller and inputDrawingContext', function ()
        {
            var filter = new BaseFilter('TestFilter', mockManager);
            var mockController = {};
            var mockInputCtx = { texture: {}, framebuffer: {} };
            var result = filter.run(mockController, mockInputCtx);
            expect(result).toBeUndefined();
        });

        it('should return undefined when called with all arguments', function ()
        {
            var filter = new BaseFilter('TestFilter', mockManager);
            var mockController = {};
            var mockInputCtx = { texture: {}, framebuffer: {} };
            var mockOutputCtx = { texture: {}, framebuffer: {} };
            var mockPadding = { x: 4, y: 4, width: 8, height: 8 };
            var result = filter.run(mockController, mockInputCtx, mockOutputCtx, mockPadding);
            expect(result).toBeUndefined();
        });

        it('should not throw when called', function ()
        {
            var filter = new BaseFilter('TestFilter', mockManager);
            expect(function ()
            {
                filter.run({}, {}, {}, {});
            }).not.toThrow();
        });

        it('should not mutate the controller argument', function ()
        {
            var filter = new BaseFilter('TestFilter', mockManager);
            var mockController = { value: 42 };
            filter.run(mockController, {}, {}, {});
            expect(mockController.value).toBe(42);
        });
    });
});
