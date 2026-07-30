var DefaultTilemapLayerNodes = require('../../../../../src/renderer/webgl/renderNodes/defaults/DefaultTilemapLayerNodes');

describe('DefaultTilemapLayerNodes', function ()
{
    it('should be a Phaser Map instance', function ()
    {
        expect(DefaultTilemapLayerNodes).toBeDefined();
        expect(typeof DefaultTilemapLayerNodes).toBe('object');
    });

    it('should have an entries property', function ()
    {
        expect(DefaultTilemapLayerNodes.entries).toBeDefined();
        expect(typeof DefaultTilemapLayerNodes.entries).toBe('object');
    });

    it('should contain the Submitter entry mapped to SubmitterTile', function ()
    {
        expect(DefaultTilemapLayerNodes.get('Submitter')).toBe('SubmitterTile');
    });

    it('should contain the BatchHandler entry mapped to BatchHandlerTileSprite', function ()
    {
        expect(DefaultTilemapLayerNodes.get('BatchHandler')).toBe('BatchHandlerTileSprite');
    });

    it('should contain the Transformer entry mapped to TransformerTile', function ()
    {
        expect(DefaultTilemapLayerNodes.get('Transformer')).toBe('TransformerTile');
    });

    it('should have exactly three entries', function ()
    {
        expect(DefaultTilemapLayerNodes.size).toBe(3);
    });

    it('should return undefined for a key that does not exist', function ()
    {
        expect(DefaultTilemapLayerNodes.get('NonExistent')).toBeUndefined();
    });

    it('should confirm it contains the Submitter key', function ()
    {
        expect(DefaultTilemapLayerNodes.has('Submitter')).toBe(true);
    });

    it('should confirm it contains the BatchHandler key', function ()
    {
        expect(DefaultTilemapLayerNodes.has('BatchHandler')).toBe(true);
    });

    it('should confirm it contains the Transformer key', function ()
    {
        expect(DefaultTilemapLayerNodes.has('Transformer')).toBe(true);
    });

    it('should return false for a key that does not exist', function ()
    {
        expect(DefaultTilemapLayerNodes.has('NonExistent')).toBe(false);
    });

    it('should return all keys', function ()
    {
        var keys = DefaultTilemapLayerNodes.keys();
        expect(keys).toContain('Submitter');
        expect(keys).toContain('BatchHandler');
        expect(keys).toContain('Transformer');
        expect(keys.length).toBe(3);
    });

    it('should return all values', function ()
    {
        var values = DefaultTilemapLayerNodes.values();
        expect(values).toContain('SubmitterTile');
        expect(values).toContain('BatchHandlerTileSprite');
        expect(values).toContain('TransformerTile');
        expect(values.length).toBe(3);
    });
});
