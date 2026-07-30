var helper = require('../../../helper');

describe('BatchHandler', function ()
{
    var BatchHandler;

    beforeAll(async function ()
    {
        await helper.createGame();
        BatchHandler = helper.Phaser.Renderer.WebGL.RenderNodes.BatchHandler;
    });

    afterAll(function ()
    {
        helper.destroyGame();
    });

    it('should be defined', function ()
    {
        expect(BatchHandler).toBeDefined();
    });

    it('should be a function (class constructor)', function ()
    {
        expect(typeof BatchHandler).toBe('function');
    });

    describe('prototype methods', function ()
    {
        it('should have a resize method on the prototype', function ()
        {
            expect(typeof BatchHandler.prototype.resize).toBe('function');
        });

        it('should have an updateTextureCount method on the prototype', function ()
        {
            expect(typeof BatchHandler.prototype.updateTextureCount).toBe('function');
        });

        it('should have a run method on the prototype', function ()
        {
            expect(typeof BatchHandler.prototype.run).toBe('function');
        });

        it('should have a batch method on the prototype', function ()
        {
            expect(typeof BatchHandler.prototype.batch).toBe('function');
        });

        it('resize should be a no-op stub that returns undefined', function ()
        {
            var result = BatchHandler.prototype.resize.call({}, 800, 600);
            expect(result).toBeUndefined();
        });

        it('updateTextureCount should be a no-op stub that returns undefined', function ()
        {
            var result = BatchHandler.prototype.updateTextureCount.call({}, 8);
            expect(result).toBeUndefined();
        });

        it('run should be a no-op stub that returns undefined', function ()
        {
            var result = BatchHandler.prototype.run.call({}, {});
            expect(result).toBeUndefined();
        });

        it('batch should be a no-op stub that returns undefined', function ()
        {
            var result = BatchHandler.prototype.batch.call({});
            expect(result).toBeUndefined();
        });

        it('resize should accept width and height without throwing', function ()
        {
            expect(function ()
            {
                BatchHandler.prototype.resize.call({}, 0, 0);
                BatchHandler.prototype.resize.call({}, 1920, 1080);
                BatchHandler.prototype.resize.call({}, -1, -1);
            }).not.toThrow();
        });

        it('updateTextureCount should accept any count without throwing', function ()
        {
            expect(function ()
            {
                BatchHandler.prototype.updateTextureCount.call({}, 0);
                BatchHandler.prototype.updateTextureCount.call({}, 16);
                BatchHandler.prototype.updateTextureCount.call({}, undefined);
            }).not.toThrow();
        });
    });
});
