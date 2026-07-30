var Pixelate = require('../../src/filters/Pixelate');

describe('Pixelate', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = { id: 'camera' };
    });

    describe('constructor', function ()
    {
        it('should create a Pixelate instance with default amount', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            expect(pixelate.amount).toBe(1);
        });

        it('should create a Pixelate instance with a custom amount', function ()
        {
            var pixelate = new Pixelate(mockCamera, 5);

            expect(pixelate.amount).toBe(5);
        });

        it('should set the camera reference', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            expect(pixelate.camera).toBe(mockCamera);
        });

        it('should set the renderNode to FilterPixelate', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            expect(pixelate.renderNode).toBe('FilterPixelate');
        });

        it('should be active by default', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            expect(pixelate.active).toBe(true);
        });

        it('should set amount to zero when zero is passed', function ()
        {
            var pixelate = new Pixelate(mockCamera, 0);

            expect(pixelate.amount).toBe(0);
        });

        it('should set amount to a floating point value', function ()
        {
            var pixelate = new Pixelate(mockCamera, 2.5);

            expect(pixelate.amount).toBeCloseTo(2.5);
        });

        it('should set amount to a large value', function ()
        {
            var pixelate = new Pixelate(mockCamera, 1000);

            expect(pixelate.amount).toBe(1000);
        });
    });

    describe('inherited Controller properties', function ()
    {
        it('should have a paddingOverride rectangle', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            expect(pixelate.paddingOverride).not.toBeNull();
        });

        it('should have a currentPadding rectangle', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            expect(pixelate.currentPadding).not.toBeNull();
        });

        it('should have allowBaseDraw set to true', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            expect(pixelate.allowBaseDraw).toBe(true);
        });

        it('should have ignoreDestroy set to false', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            expect(pixelate.ignoreDestroy).toBe(false);
        });
    });

    describe('setActive', function ()
    {
        it('should disable the filter when passed false', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            pixelate.setActive(false);

            expect(pixelate.active).toBe(false);
        });

        it('should enable the filter when passed true', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            pixelate.setActive(false);
            pixelate.setActive(true);

            expect(pixelate.active).toBe(true);
        });

        it('should return the filter instance for chaining', function ()
        {
            var pixelate = new Pixelate(mockCamera);
            var result = pixelate.setActive(false);

            expect(result).toBe(pixelate);
        });
    });

    describe('getPadding', function ()
    {
        it('should return the paddingOverride when set', function ()
        {
            var pixelate = new Pixelate(mockCamera);
            var padding = pixelate.getPadding();

            expect(padding).toBe(pixelate.paddingOverride);
        });

        it('should return currentPadding when paddingOverride is null', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            pixelate.setPaddingOverride(null);

            var padding = pixelate.getPadding();

            expect(padding).toBe(pixelate.currentPadding);
        });
    });

    describe('setPaddingOverride', function ()
    {
        it('should set paddingOverride to null when null is passed', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            pixelate.setPaddingOverride(null);

            expect(pixelate.paddingOverride).toBeNull();
        });

        it('should set padding to zero when called with no arguments', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            pixelate.setPaddingOverride();

            expect(pixelate.paddingOverride.x).toBe(0);
            expect(pixelate.paddingOverride.y).toBe(0);
        });

        it('should return the filter instance for chaining', function ()
        {
            var pixelate = new Pixelate(mockCamera);
            var result = pixelate.setPaddingOverride(0, 0, 0, 0);

            expect(result).toBe(pixelate);
        });
    });

    describe('destroy', function ()
    {
        it('should set active to false', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            pixelate.destroy();

            expect(pixelate.active).toBe(false);
        });

        it('should null the renderNode', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            pixelate.destroy();

            expect(pixelate.renderNode).toBeNull();
        });

        it('should null the camera reference', function ()
        {
            var pixelate = new Pixelate(mockCamera);

            pixelate.destroy();

            expect(pixelate.camera).toBeNull();
        });
    });

    describe('amount property', function ()
    {
        it('should be directly mutable', function ()
        {
            var pixelate = new Pixelate(mockCamera, 1);

            pixelate.amount = 10;

            expect(pixelate.amount).toBe(10);
        });

        it('should accept negative values', function ()
        {
            var pixelate = new Pixelate(mockCamera, -3);

            expect(pixelate.amount).toBe(-3);
        });
    });
});
