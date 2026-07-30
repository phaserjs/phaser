var ColorMatrix = require('../../src/filters/ColorMatrix');

describe('Phaser.Filters.ColorMatrix', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = {};
    });

    describe('constructor', function ()
    {
        it('should create a ColorMatrix filter with active set to true', function ()
        {
            var filter = new ColorMatrix(mockCamera);
            expect(filter.active).toBe(true);
        });

        it('should store a reference to the camera', function ()
        {
            var filter = new ColorMatrix(mockCamera);
            expect(filter.camera).toBe(mockCamera);
        });

        it('should set the renderNode to FilterColorMatrix', function ()
        {
            var filter = new ColorMatrix(mockCamera);
            expect(filter.renderNode).toBe('FilterColorMatrix');
        });

        it('should create a colorMatrix property', function ()
        {
            var filter = new ColorMatrix(mockCamera);
            expect(filter.colorMatrix).toBeDefined();
            expect(filter.colorMatrix).not.toBeNull();
        });

        it('should create a colorMatrix that is an instance of DisplayColorMatrix', function ()
        {
            var DisplayColorMatrix = require('../../src/display/ColorMatrix');
            var filter = new ColorMatrix(mockCamera);
            expect(filter.colorMatrix instanceof DisplayColorMatrix).toBe(true);
        });

        it('should set paddingOverride to a Rectangle', function ()
        {
            var filter = new ColorMatrix(mockCamera);
            expect(filter.paddingOverride).toBeDefined();
            expect(filter.paddingOverride).not.toBeNull();
        });

        it('should set allowBaseDraw to true', function ()
        {
            var filter = new ColorMatrix(mockCamera);
            expect(filter.allowBaseDraw).toBe(true);
        });

        it('should set ignoreDestroy to false', function ()
        {
            var filter = new ColorMatrix(mockCamera);
            expect(filter.ignoreDestroy).toBe(false);
        });
    });

    describe('destroy', function ()
    {
        it('should set colorMatrix to null', function ()
        {
            var filter = new ColorMatrix(mockCamera);
            filter.destroy();
            expect(filter.colorMatrix).toBeNull();
        });

        it('should set active to false', function ()
        {
            var filter = new ColorMatrix(mockCamera);
            filter.destroy();
            expect(filter.active).toBe(false);
        });

        it('should set camera to null', function ()
        {
            var filter = new ColorMatrix(mockCamera);
            filter.destroy();
            expect(filter.camera).toBeNull();
        });

        it('should set renderNode to null', function ()
        {
            var filter = new ColorMatrix(mockCamera);
            filter.destroy();
            expect(filter.renderNode).toBeNull();
        });

        it('should be safe to call destroy multiple times', function ()
        {
            var filter = new ColorMatrix(mockCamera);
            filter.destroy();
            expect(function () { filter.destroy(); }).not.toThrow();
        });
    });
});
