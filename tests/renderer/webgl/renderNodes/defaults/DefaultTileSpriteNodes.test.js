var DefaultTileSpriteNodes = require('../../../../../src/renderer/webgl/renderNodes/defaults/DefaultTileSpriteNodes');

describe('DefaultTileSpriteNodes', function ()
{
    it('should be a Phaser Map instance', function ()
    {
        expect(DefaultTileSpriteNodes).toBeDefined();
        expect(typeof DefaultTileSpriteNodes).toBe('object');
    });

    it('should have a Submitter entry mapped to SubmitterTileSprite', function ()
    {
        expect(DefaultTileSpriteNodes.get('Submitter')).toBe('SubmitterTileSprite');
    });

    it('should have a BatchHandler entry mapped to BatchHandlerTileSprite', function ()
    {
        expect(DefaultTileSpriteNodes.get('BatchHandler')).toBe('BatchHandlerTileSprite');
    });

    it('should have a Transformer entry mapped to TransformerTileSprite', function ()
    {
        expect(DefaultTileSpriteNodes.get('Transformer')).toBe('TransformerTileSprite');
    });

    it('should have a Texturer entry mapped to TexturerTileSprite', function ()
    {
        expect(DefaultTileSpriteNodes.get('Texturer')).toBe('TexturerTileSprite');
    });

    it('should contain exactly four entries', function ()
    {
        expect(DefaultTileSpriteNodes.size).toBe(4);
    });

    it('should return undefined for unknown keys', function ()
    {
        expect(DefaultTileSpriteNodes.get('NonExistentKey')).toBeUndefined();
    });

    it('should have all four expected keys present via has()', function ()
    {
        expect(DefaultTileSpriteNodes.has('Submitter')).toBe(true);
        expect(DefaultTileSpriteNodes.has('BatchHandler')).toBe(true);
        expect(DefaultTileSpriteNodes.has('Transformer')).toBe(true);
        expect(DefaultTileSpriteNodes.has('Texturer')).toBe(true);
    });

    it('should return false for has() on unknown keys', function ()
    {
        expect(DefaultTileSpriteNodes.has('UnknownRole')).toBe(false);
    });

    it('should return all four keys via keys()', function ()
    {
        var keys = DefaultTileSpriteNodes.keys();
        expect(keys).toContain('Submitter');
        expect(keys).toContain('BatchHandler');
        expect(keys).toContain('Transformer');
        expect(keys).toContain('Texturer');
        expect(keys.length).toBe(4);
    });

    it('should return all four values via values()', function ()
    {
        var values = DefaultTileSpriteNodes.values();
        expect(values).toContain('SubmitterTileSprite');
        expect(values).toContain('BatchHandlerTileSprite');
        expect(values).toContain('TransformerTileSprite');
        expect(values).toContain('TexturerTileSprite');
        expect(values.length).toBe(4);
    });
});
