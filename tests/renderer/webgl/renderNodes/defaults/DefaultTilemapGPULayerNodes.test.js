var DefaultTilemapGPULayerNodes = require('../../../../../src/renderer/webgl/renderNodes/defaults/DefaultTilemapGPULayerNodes');

describe('DefaultTilemapGPULayerNodes', function ()
{
    it('should be importable', function ()
    {
        expect(DefaultTilemapGPULayerNodes).toBeDefined();
    });

    it('should be a Phaser Map instance', function ()
    {
        expect(typeof DefaultTilemapGPULayerNodes).toBe('object');
        expect(typeof DefaultTilemapGPULayerNodes.get).toBe('function');
        expect(typeof DefaultTilemapGPULayerNodes.set).toBe('function');
    });

    it('should contain the Submitter entry', function ()
    {
        expect(DefaultTilemapGPULayerNodes.get('Submitter')).toBe('SubmitterTilemapGPULayer');
    });

    it('should have exactly one entry', function ()
    {
        expect(DefaultTilemapGPULayerNodes.size).toBe(1);
    });

    it('should return undefined for unknown keys', function ()
    {
        expect(DefaultTilemapGPULayerNodes.get('NonExistent')).toBeUndefined();
    });

    it('should confirm SubmitterTilemapGPULayer value exists via contains', function ()
    {
        expect(DefaultTilemapGPULayerNodes.contains('SubmitterTilemapGPULayer')).toBe(true);
    });

    it('should return false for a value that does not exist', function ()
    {
        expect(DefaultTilemapGPULayerNodes.contains('Missing')).toBe(false);
    });
});
