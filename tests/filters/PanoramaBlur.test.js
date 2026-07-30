var PanoramaBlur = require('../../src/filters/PanoramaBlur');

describe('PanoramaBlur', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = {
            id: 1,
            renderList: [],
            filters: {}
        };
    });

    describe('constructor', function ()
    {
        it('should create an instance with default values when no config is provided', function ()
        {
            var filter = new PanoramaBlur(mockCamera);

            expect(filter.radius).toBe(1);
            expect(filter.samplesX).toBe(32);
            expect(filter.samplesY).toBe(16);
            expect(filter.power).toBe(1);
        });

        it('should create an instance with default values when an empty config is provided', function ()
        {
            var filter = new PanoramaBlur(mockCamera, {});

            expect(filter.radius).toBe(1);
            expect(filter.samplesX).toBe(32);
            expect(filter.samplesY).toBe(16);
            expect(filter.power).toBe(1);
        });

        it('should apply custom radius from config', function ()
        {
            var filter = new PanoramaBlur(mockCamera, { radius: 0.5 });

            expect(filter.radius).toBe(0.5);
        });

        it('should apply custom samplesX from config', function ()
        {
            var filter = new PanoramaBlur(mockCamera, { samplesX: 64 });

            expect(filter.samplesX).toBe(64);
        });

        it('should apply custom samplesY from config', function ()
        {
            var filter = new PanoramaBlur(mockCamera, { samplesY: 8 });

            expect(filter.samplesY).toBe(8);
        });

        it('should apply custom power from config', function ()
        {
            var filter = new PanoramaBlur(mockCamera, { power: 2 });

            expect(filter.power).toBe(2);
        });

        it('should apply all custom config values at once', function ()
        {
            var filter = new PanoramaBlur(mockCamera, {
                radius: 0.25,
                samplesX: 16,
                samplesY: 8,
                power: 3
            });

            expect(filter.radius).toBe(0.25);
            expect(filter.samplesX).toBe(16);
            expect(filter.samplesY).toBe(8);
            expect(filter.power).toBe(3);
        });

        it('should set the renderNode name to FilterPanoramaBlur', function ()
        {
            var filter = new PanoramaBlur(mockCamera);

            expect(filter.renderNode).toBe('FilterPanoramaBlur');
        });

        it('should store a reference to the camera', function ()
        {
            var filter = new PanoramaBlur(mockCamera);

            expect(filter.camera).toBe(mockCamera);
        });

        it('should default active to true', function ()
        {
            var filter = new PanoramaBlur(mockCamera);

            expect(filter.active).toBe(true);
        });

        it('should fall back to default radius of 1 when radius is 0 in config', function ()
        {
            var filter = new PanoramaBlur(mockCamera, { radius: 0 });

            // Due to || operator, falsy 0 falls back to 1
            expect(filter.radius).toBe(1);
        });

        it('should fall back to default samplesX of 32 when samplesX is 0 in config', function ()
        {
            var filter = new PanoramaBlur(mockCamera, { samplesX: 0 });

            // Due to || operator, falsy 0 falls back to 32
            expect(filter.samplesX).toBe(32);
        });

        it('should fall back to default samplesY of 16 when samplesY is 0 in config', function ()
        {
            var filter = new PanoramaBlur(mockCamera, { samplesY: 0 });

            // Due to || operator, falsy 0 falls back to 16
            expect(filter.samplesY).toBe(16);
        });

        it('should fall back to default power of 1 when power is 0 in config', function ()
        {
            var filter = new PanoramaBlur(mockCamera, { power: 0 });

            // Due to || operator, falsy 0 falls back to 1
            expect(filter.power).toBe(1);
        });

        it('should accept floating point values for radius', function ()
        {
            var filter = new PanoramaBlur(mockCamera, { radius: 0.1 });

            expect(filter.radius).toBeCloseTo(0.1);
        });

        it('should accept floating point values for power', function ()
        {
            var filter = new PanoramaBlur(mockCamera, { power: 2.5 });

            expect(filter.power).toBeCloseTo(2.5);
        });

        it('should accept large sample values', function ()
        {
            var filter = new PanoramaBlur(mockCamera, { samplesX: 128, samplesY: 64 });

            expect(filter.samplesX).toBe(128);
            expect(filter.samplesY).toBe(64);
        });
    });

    describe('property mutation', function ()
    {
        it('should allow radius to be changed after construction', function ()
        {
            var filter = new PanoramaBlur(mockCamera);

            filter.radius = 0.5;

            expect(filter.radius).toBe(0.5);
        });

        it('should allow samplesX to be changed after construction', function ()
        {
            var filter = new PanoramaBlur(mockCamera);

            filter.samplesX = 64;

            expect(filter.samplesX).toBe(64);
        });

        it('should allow samplesY to be changed after construction', function ()
        {
            var filter = new PanoramaBlur(mockCamera);

            filter.samplesY = 32;

            expect(filter.samplesY).toBe(32);
        });

        it('should allow power to be changed after construction', function ()
        {
            var filter = new PanoramaBlur(mockCamera);

            filter.power = 4;

            expect(filter.power).toBe(4);
        });
    });
});
