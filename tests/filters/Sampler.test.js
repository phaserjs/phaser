var Sampler = require('../../src/filters/Sampler');

describe('Sampler', function ()
{
    var mockCamera;
    var mockCallback;

    beforeEach(function ()
    {
        mockCamera = { id: 'test-camera' };
        mockCallback = function () {};
    });

    describe('constructor', function ()
    {
        it('should create a Sampler with required arguments', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            expect(sampler).toBeDefined();
        });

        it('should store the camera reference', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            expect(sampler.camera).toBe(mockCamera);
        });

        it('should store the callback', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            expect(sampler.callback).toBe(mockCallback);
        });

        it('should set region to null by default', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            expect(sampler.region).toBeNull();
        });

        it('should set region to null when explicitly passed undefined', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback, undefined);

            expect(sampler.region).toBeNull();
        });

        it('should store a point region (Vector2Like)', function ()
        {
            var region = { x: 10, y: 20 };
            var sampler = new Sampler(mockCamera, mockCallback, region);

            expect(sampler.region).toBe(region);
            expect(sampler.region.x).toBe(10);
            expect(sampler.region.y).toBe(20);
        });

        it('should store a rectangle region', function ()
        {
            var region = { x: 0, y: 0, width: 100, height: 100 };
            var sampler = new Sampler(mockCamera, mockCallback, region);

            expect(sampler.region).toBe(region);
        });

        it('should store null when region is explicitly null', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback, null);

            expect(sampler.region).toBeNull();
        });

        it('should set renderNode to FilterSampler', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            expect(sampler.renderNode).toBe('FilterSampler');
        });

        it('should set allowBaseDraw to false', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            expect(sampler.allowBaseDraw).toBe(false);
        });

        it('should set active to true (inherited from Controller)', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            expect(sampler.active).toBe(true);
        });

        it('should set ignoreDestroy to false (inherited from Controller)', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            expect(sampler.ignoreDestroy).toBe(false);
        });

        it('should create paddingOverride rectangle (inherited from Controller)', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            expect(sampler.paddingOverride).toBeDefined();
        });

        it('should create currentPadding rectangle (inherited from Controller)', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            expect(sampler.currentPadding).toBeDefined();
        });
    });

    describe('inherited Controller methods', function ()
    {
        it('should return paddingOverride from getPadding when set', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            expect(sampler.getPadding()).toBe(sampler.paddingOverride);
        });

        it('should return currentPadding from getPadding when paddingOverride is null', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            sampler.paddingOverride = null;

            expect(sampler.getPadding()).toBe(sampler.currentPadding);
        });

        it('should enable/disable via setActive', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            sampler.setActive(false);
            expect(sampler.active).toBe(false);

            sampler.setActive(true);
            expect(sampler.active).toBe(true);
        });

        it('should return itself from setActive for chaining', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);
            var result = sampler.setActive(false);

            expect(result).toBe(sampler);
        });

        it('should set paddingOverride via setPaddingOverride', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            sampler.setPaddingOverride(1, 2, 3, 4);

            expect(sampler.paddingOverride).toBeDefined();
            expect(sampler.paddingOverride.x).toBe(1);
            expect(sampler.paddingOverride.y).toBe(2);
        });

        it('should clear paddingOverride when null is passed to setPaddingOverride', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            sampler.setPaddingOverride(null);

            expect(sampler.paddingOverride).toBeNull();
        });

        it('should set zero padding when setPaddingOverride is called with no args', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            sampler.setPaddingOverride();

            expect(sampler.paddingOverride.x).toBe(0);
            expect(sampler.paddingOverride.y).toBe(0);
        });

        it('should null camera and renderNode on destroy', function ()
        {
            var sampler = new Sampler(mockCamera, mockCallback);

            sampler.destroy();

            expect(sampler.camera).toBeNull();
            expect(sampler.renderNode).toBeNull();
            expect(sampler.active).toBe(false);
        });
    });
});
