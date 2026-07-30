var FilterBarrel = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterBarrel');

describe('FilterBarrel', function ()
{
    it('should be importable', function ()
    {
        expect(FilterBarrel).toBeDefined();
    });

    describe('setupUniforms', function ()
    {
        var node;
        var mockProgramManager;

        beforeEach(function ()
        {
            mockProgramManager = {
                setUniform: vi.fn()
            };

            // Bypass the constructor (which requires a WebGL context) by
            // creating a plain object and injecting the prototype method.
            node = Object.create(FilterBarrel.prototype);
            node.programManager = mockProgramManager;
        });

        it('should call setUniform with the amount from the controller', function ()
        {
            var controller = { amount: 0.5 };

            node.setupUniforms(controller, {});

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('amount', 0.5);
        });

        it('should pass zero amount correctly', function ()
        {
            var controller = { amount: 0 };

            node.setupUniforms(controller, {});

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('amount', 0);
        });

        it('should pass negative amount for pincushion distortion', function ()
        {
            var controller = { amount: -0.5 };

            node.setupUniforms(controller, {});

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('amount', -0.5);
        });

        it('should pass large positive amount for strong barrel distortion', function ()
        {
            var controller = { amount: 10 };

            node.setupUniforms(controller, {});

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('amount', 10);
        });

        it('should pass floating point amount accurately', function ()
        {
            var controller = { amount: 0.123456 };

            node.setupUniforms(controller, {});

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('amount', 0.123456);
        });

        it('should call setUniform exactly once per invocation', function ()
        {
            var controller = { amount: 1 };

            node.setupUniforms(controller, {});

            expect(mockProgramManager.setUniform).toHaveBeenCalledTimes(1);
        });

        it('should use the programManager on the node instance', function ()
        {
            var controller = { amount: 0.75 };
            var secondProgramManager = { setUniform: vi.fn() };

            node.programManager = secondProgramManager;
            node.setupUniforms(controller, {});

            expect(secondProgramManager.setUniform).toHaveBeenCalledWith('amount', 0.75);
            expect(mockProgramManager.setUniform).not.toHaveBeenCalled();
        });

        it('should read amount directly from the controller each call', function ()
        {
            var controller = { amount: 0.1 };

            node.setupUniforms(controller, {});
            controller.amount = 0.9;
            node.setupUniforms(controller, {});

            expect(mockProgramManager.setUniform).toHaveBeenNthCalledWith(1, 'amount', 0.1);
            expect(mockProgramManager.setUniform).toHaveBeenNthCalledWith(2, 'amount', 0.9);
        });

        it('should not throw when amount is negative large value', function ()
        {
            var controller = { amount: -100 };

            expect(function ()
            {
                node.setupUniforms(controller, {});
            }).not.toThrow();

            expect(mockProgramManager.setUniform).toHaveBeenCalledWith('amount', -100);
        });
    });
});
