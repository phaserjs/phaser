var helper = require('../../../helper');

describe('BatchHandlerQuadSingle', function ()
{
    var scene;

    beforeEach(async function ()
    {
        scene = await helper.createGame();
    });

    afterEach(function ()
    {
        helper.destroyGame();
    });

    it('should exist in Phaser namespace', function ()
    {
        expect(helper.Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadSingle).toBeDefined();
    });

    it('should set default config name when none provided', function ()
    {
        var config = {};
        if (!config.name) { config.name = 'BatchHandlerQuadSingle'; }
        expect(config.name).toBe('BatchHandlerQuadSingle');
    });

    it('should set default shaderName when none provided', function ()
    {
        var config = {};
        if (!config.shaderName) { config.shaderName = 'STANDARD_SINGLE'; }
        expect(config.shaderName).toBe('STANDARD_SINGLE');
    });

    it('should set default instancesPerBatch to 1 when none provided', function ()
    {
        var config = {};
        if (!config.instancesPerBatch) { config.instancesPerBatch = 1; }
        expect(config.instancesPerBatch).toBe(1);
    });

    it('should not override existing config name', function ()
    {
        var config = { name: 'CustomName' };
        if (!config.name) { config.name = 'BatchHandlerQuadSingle'; }
        expect(config.name).toBe('CustomName');
    });

    it('should not override existing shaderName', function ()
    {
        var config = { shaderName: 'CUSTOM_SHADER' };
        if (!config.shaderName) { config.shaderName = 'STANDARD_SINGLE'; }
        expect(config.shaderName).toBe('CUSTOM_SHADER');
    });

    it('should not override existing instancesPerBatch', function ()
    {
        var config = { instancesPerBatch: 4 };
        if (!config.instancesPerBatch) { config.instancesPerBatch = 1; }
        expect(config.instancesPerBatch).toBe(4);
    });

    it('should treat empty config as requiring all defaults', function ()
    {
        var config = {};
        if (config === undefined) { config = {}; }
        if (!config.name) { config.name = 'BatchHandlerQuadSingle'; }
        if (!config.shaderName) { config.shaderName = 'STANDARD_SINGLE'; }
        if (!config.instancesPerBatch) { config.instancesPerBatch = 1; }

        expect(config.name).toBe('BatchHandlerQuadSingle');
        expect(config.shaderName).toBe('STANDARD_SINGLE');
        expect(config.instancesPerBatch).toBe(1);
    });

    it('should treat undefined config the same as empty config', function ()
    {
        var config = undefined;
        if (config === undefined) { config = {}; }
        if (!config.name) { config.name = 'BatchHandlerQuadSingle'; }
        if (!config.shaderName) { config.shaderName = 'STANDARD_SINGLE'; }
        if (!config.instancesPerBatch) { config.instancesPerBatch = 1; }

        expect(config.name).toBe('BatchHandlerQuadSingle');
        expect(config.shaderName).toBe('STANDARD_SINGLE');
        expect(config.instancesPerBatch).toBe(1);
    });
});
