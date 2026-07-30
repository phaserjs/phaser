var helper = require('../../../helper');

var BatchHandlerStrip = helper.Phaser &&
    helper.Phaser.Renderer &&
    helper.Phaser.Renderer.WebGL &&
    helper.Phaser.Renderer.WebGL.RenderNodes &&
    helper.Phaser.Renderer.WebGL.RenderNodes.BatchHandlerStrip;

describe('BatchHandlerStrip', function ()
{
    it('should be importable', function ()
    {
        expect(BatchHandlerStrip).toBeDefined();
    });

    it('should be a function (class constructor)', function ()
    {
        expect(typeof BatchHandlerStrip).toBe('function');
    });

    it('should have a defaultConfig property on its prototype', function ()
    {
        expect(BatchHandlerStrip.prototype.defaultConfig).toBeDefined();
    });

    it('should have the correct defaultConfig name', function ()
    {
        expect(BatchHandlerStrip.prototype.defaultConfig.name).toBe('BatchHandlerStrip');
    });

    it('should have verticesPerInstance of 2 in defaultConfig', function ()
    {
        expect(BatchHandlerStrip.prototype.defaultConfig.verticesPerInstance).toBe(2);
    });

    it('should have indicesPerInstance of 2 in defaultConfig', function ()
    {
        expect(BatchHandlerStrip.prototype.defaultConfig.indicesPerInstance).toBe(2);
    });

    it('should have the correct shaderName in defaultConfig', function ()
    {
        expect(BatchHandlerStrip.prototype.defaultConfig.shaderName).toBe('STRIP');
    });

    it('should have a vertexBufferLayout in defaultConfig', function ()
    {
        expect(BatchHandlerStrip.prototype.defaultConfig.vertexBufferLayout).toBeDefined();
    });

    it('should have DYNAMIC_DRAW usage in defaultConfig vertexBufferLayout', function ()
    {
        expect(BatchHandlerStrip.prototype.defaultConfig.vertexBufferLayout.usage).toBe('DYNAMIC_DRAW');
    });

    it('should have the correct vertex buffer layout fields', function ()
    {
        var layout = BatchHandlerStrip.prototype.defaultConfig.vertexBufferLayout.layout;
        expect(Array.isArray(layout)).toBe(true);
        var names = layout.map(function (entry) { return entry.name; });
        expect(names).toContain('inPosition');
        expect(names).toContain('inTexCoord');
        expect(names).toContain('inTexDatum');
        expect(names).toContain('inTintEffect');
        expect(names).toContain('inTint');
    });

    it('should have inPosition with size 2', function ()
    {
        var layout = BatchHandlerStrip.prototype.defaultConfig.vertexBufferLayout.layout;
        var inPosition = layout.find(function (e) { return e.name === 'inPosition'; });
        expect(inPosition.size).toBe(2);
    });

    it('should have inTexCoord with size 2', function ()
    {
        var layout = BatchHandlerStrip.prototype.defaultConfig.vertexBufferLayout.layout;
        var inTexCoord = layout.find(function (e) { return e.name === 'inTexCoord'; });
        expect(inTexCoord.size).toBe(2);
    });

    it('should have inTint with size 4, UNSIGNED_BYTE type, and normalized true', function ()
    {
        var layout = BatchHandlerStrip.prototype.defaultConfig.vertexBufferLayout.layout;
        var inTint = layout.find(function (e) { return e.name === 'inTint'; });
        expect(inTint.size).toBe(4);
        expect(inTint.type).toBe('UNSIGNED_BYTE');
        expect(inTint.normalized).toBe(true);
    });

    it('should have shaderAdditions array in defaultConfig', function ()
    {
        expect(Array.isArray(BatchHandlerStrip.prototype.defaultConfig.shaderAdditions)).toBe(true);
        expect(BatchHandlerStrip.prototype.defaultConfig.shaderAdditions.length).toBeGreaterThan(0);
    });

    it('should have batchStrip as a prototype method', function ()
    {
        expect(typeof BatchHandlerStrip.prototype.batchStrip).toBe('function');
    });
});
