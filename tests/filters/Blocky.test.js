var Blocky = require('../../src/filters/Blocky');

describe('Blocky', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = {};
    });

    describe('constructor', function ()
    {
        it('should create a Blocky instance with default values when no config is provided', function ()
        {
            var blocky = new Blocky(mockCamera);

            expect(blocky.size.x).toBe(4);
            expect(blocky.size.y).toBe(4);
            expect(blocky.offset.x).toBe(0);
            expect(blocky.offset.y).toBe(0);
        });

        it('should set the camera reference', function ()
        {
            var blocky = new Blocky(mockCamera);

            expect(blocky.camera).toBe(mockCamera);
        });

        it('should set the renderNode to FilterBlocky', function ()
        {
            var blocky = new Blocky(mockCamera);

            expect(blocky.renderNode).toBe('FilterBlocky');
        });

        it('should be active by default', function ()
        {
            var blocky = new Blocky(mockCamera);

            expect(blocky.active).toBe(true);
        });

        it('should accept a numeric size in config and apply it to both x and y', function ()
        {
            var blocky = new Blocky(mockCamera, { size: 8 });

            expect(blocky.size.x).toBe(8);
            expect(blocky.size.y).toBe(8);
        });

        it('should accept a vector size in config', function ()
        {
            var blocky = new Blocky(mockCamera, { size: { x: 2, y: 4 } });

            expect(blocky.size.x).toBe(2);
            expect(blocky.size.y).toBe(4);
        });

        it('should accept a numeric offset in config and apply it to both x and y', function ()
        {
            var blocky = new Blocky(mockCamera, { offset: 3 });

            expect(blocky.offset.x).toBe(3);
            expect(blocky.offset.y).toBe(3);
        });

        it('should accept a vector offset in config', function ()
        {
            var blocky = new Blocky(mockCamera, { offset: { x: 1, y: 2 } });

            expect(blocky.offset.x).toBe(1);
            expect(blocky.offset.y).toBe(2);
        });

        it('should accept both size and offset in config', function ()
        {
            var blocky = new Blocky(mockCamera, { size: { x: 2, y: 4 }, offset: { x: 1, y: 2 } });

            expect(blocky.size.x).toBe(2);
            expect(blocky.size.y).toBe(4);
            expect(blocky.offset.x).toBe(1);
            expect(blocky.offset.y).toBe(2);
        });

        it('should use default size when config is provided but size is omitted', function ()
        {
            var blocky = new Blocky(mockCamera, { offset: 1 });

            expect(blocky.size.x).toBe(4);
            expect(blocky.size.y).toBe(4);
        });

        it('should use default offset when config is provided but offset is omitted', function ()
        {
            var blocky = new Blocky(mockCamera, { size: 2 });

            expect(blocky.offset.x).toBe(0);
            expect(blocky.offset.y).toBe(0);
        });

        it('should accept a size of 1', function ()
        {
            var blocky = new Blocky(mockCamera, { size: 1 });

            expect(blocky.size.x).toBe(1);
            expect(blocky.size.y).toBe(1);
        });

        it('should accept fractional size values', function ()
        {
            var blocky = new Blocky(mockCamera, { size: { x: 1.5, y: 2.5 } });

            expect(blocky.size.x).toBe(1.5);
            expect(blocky.size.y).toBe(2.5);
        });

        it('should accept a size of 0', function ()
        {
            var blocky = new Blocky(mockCamera, { size: 0 });

            expect(blocky.size.x).toBe(0);
            expect(blocky.size.y).toBe(0);
        });

        it('should accept negative offset values', function ()
        {
            var blocky = new Blocky(mockCamera, { offset: { x: -1, y: -2 } });

            expect(blocky.offset.x).toBe(-1);
            expect(blocky.offset.y).toBe(-2);
        });

        it('should accept a zero offset', function ()
        {
            var blocky = new Blocky(mockCamera, { offset: 0 });

            expect(blocky.offset.x).toBe(0);
            expect(blocky.offset.y).toBe(0);
        });

        it('should have a paddingOverride property from the Controller base class', function ()
        {
            var blocky = new Blocky(mockCamera);

            expect(blocky.paddingOverride).toBeDefined();
        });

        it('should have a currentPadding property from the Controller base class', function ()
        {
            var blocky = new Blocky(mockCamera);

            expect(blocky.currentPadding).toBeDefined();
        });

        it('should have allowBaseDraw set to true', function ()
        {
            var blocky = new Blocky(mockCamera);

            expect(blocky.allowBaseDraw).toBe(true);
        });

        it('should have ignoreDestroy set to false', function ()
        {
            var blocky = new Blocky(mockCamera);

            expect(blocky.ignoreDestroy).toBe(false);
        });
    });

    describe('inherited Controller methods', function ()
    {
        it('should set active to false via setActive', function ()
        {
            var blocky = new Blocky(mockCamera);
            blocky.setActive(false);

            expect(blocky.active).toBe(false);
        });

        it('should set active to true via setActive', function ()
        {
            var blocky = new Blocky(mockCamera);
            blocky.setActive(false);
            blocky.setActive(true);

            expect(blocky.active).toBe(true);
        });

        it('should return itself from setActive for chaining', function ()
        {
            var blocky = new Blocky(mockCamera);
            var result = blocky.setActive(false);

            expect(result).toBe(blocky);
        });

        it('should return paddingOverride from getPadding by default', function ()
        {
            var blocky = new Blocky(mockCamera);
            var padding = blocky.getPadding();

            expect(padding).toBe(blocky.paddingOverride);
        });

        it('should return currentPadding from getPadding when paddingOverride is null', function ()
        {
            var blocky = new Blocky(mockCamera);
            blocky.setPaddingOverride(null);
            var padding = blocky.getPadding();

            expect(padding).toBe(blocky.currentPadding);
        });

        it('should null camera and renderNode on destroy', function ()
        {
            var blocky = new Blocky(mockCamera);
            blocky.destroy();

            expect(blocky.camera).toBeNull();
            expect(blocky.renderNode).toBeNull();
            expect(blocky.active).toBe(false);
        });
    });
});
