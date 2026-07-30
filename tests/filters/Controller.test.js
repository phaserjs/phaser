var Controller = require('../../src/filters/Controller');

describe('Controller', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = { id: 'test-camera' };
    });

    describe('Constructor', function ()
    {
        it('should set active to true by default', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            expect(controller.active).toBe(true);
        });

        it('should store the camera reference', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            expect(controller.camera).toBe(mockCamera);
        });

        it('should store the renderNode id', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            expect(controller.renderNode).toBe('TestNode');
        });

        it('should initialize paddingOverride as a Rectangle', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            expect(controller.paddingOverride).not.toBeNull();
            expect(typeof controller.paddingOverride).toBe('object');
        });

        it('should initialize currentPadding as a Rectangle', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            expect(controller.currentPadding).not.toBeNull();
            expect(typeof controller.currentPadding).toBe('object');
        });

        it('should set allowBaseDraw to true by default', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            expect(controller.allowBaseDraw).toBe(true);
        });

        it('should set ignoreDestroy to false by default', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            expect(controller.ignoreDestroy).toBe(false);
        });

        it('should initialize paddingOverride with zero values', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            expect(controller.paddingOverride.x).toBe(0);
            expect(controller.paddingOverride.y).toBe(0);
            expect(controller.paddingOverride.width).toBe(0);
            expect(controller.paddingOverride.height).toBe(0);
        });
    });

    describe('getPadding', function ()
    {
        it('should return paddingOverride when it is set', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            var result = controller.getPadding();
            expect(result).toBe(controller.paddingOverride);
        });

        it('should return currentPadding when paddingOverride is null', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.paddingOverride = null;
            var result = controller.getPadding();
            expect(result).toBe(controller.currentPadding);
        });

        it('should return a Rectangle object', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            var result = controller.getPadding();
            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
        });
    });

    describe('setPaddingOverride', function ()
    {
        it('should set paddingOverride to null when called with null', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.setPaddingOverride(null);
            expect(controller.paddingOverride).toBeNull();
        });

        it('should return this when called with null', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            var result = controller.setPaddingOverride(null);
            expect(result).toBe(controller);
        });

        it('should set padding to zero when called with no arguments', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.setPaddingOverride();
            expect(controller.paddingOverride.x).toBe(0);
            expect(controller.paddingOverride.y).toBe(0);
        });

        it('should encode left and top as x and y of the Rectangle', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.setPaddingOverride(10, 20, 30, 40);
            expect(controller.paddingOverride.x).toBe(10);
            expect(controller.paddingOverride.y).toBe(20);
        });

        it('should encode width as right minus left', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.setPaddingOverride(10, 20, 30, 40);
            expect(controller.paddingOverride.width).toBe(20);
        });

        it('should encode height as bottom minus top', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.setPaddingOverride(10, 20, 30, 40);
            expect(controller.paddingOverride.height).toBe(20);
        });

        it('should return this for chaining', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            var result = controller.setPaddingOverride(5, 5, 10, 10);
            expect(result).toBe(controller);
        });

        it('should replace paddingOverride with a new Rectangle', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            var original = controller.paddingOverride;
            controller.setPaddingOverride(1, 2, 3, 4);
            expect(controller.paddingOverride).not.toBe(original);
        });

        it('should default missing arguments to zero', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.setPaddingOverride(5);
            expect(controller.paddingOverride.x).toBe(5);
            expect(controller.paddingOverride.y).toBe(0);
            expect(controller.paddingOverride.width).toBe(-5);
            expect(controller.paddingOverride.height).toBe(0);
        });

        it('should handle negative padding values', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.setPaddingOverride(-10, -20, 10, 20);
            expect(controller.paddingOverride.x).toBe(-10);
            expect(controller.paddingOverride.y).toBe(-20);
            expect(controller.paddingOverride.width).toBe(20);
            expect(controller.paddingOverride.height).toBe(40);
        });

        it('should re-enable getPadding to use override after null was set', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.setPaddingOverride(null);
            controller.setPaddingOverride(5, 5, 10, 10);
            var result = controller.getPadding();
            expect(result).toBe(controller.paddingOverride);
        });
    });

    describe('setActive', function ()
    {
        it('should set active to false', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.setActive(false);
            expect(controller.active).toBe(false);
        });

        it('should set active to true', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.setActive(false);
            controller.setActive(true);
            expect(controller.active).toBe(true);
        });

        it('should return this for chaining', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            var result = controller.setActive(false);
            expect(result).toBe(controller);
        });

        it('should support chaining multiple calls', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.setActive(false).setActive(true);
            expect(controller.active).toBe(true);
        });
    });

    describe('destroy', function ()
    {
        it('should set active to false', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.destroy();
            expect(controller.active).toBe(false);
        });

        it('should set renderNode to null', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.destroy();
            expect(controller.renderNode).toBeNull();
        });

        it('should set camera to null', function ()
        {
            var controller = new Controller(mockCamera, 'TestNode');
            controller.destroy();
            expect(controller.camera).toBeNull();
        });
    });
});
