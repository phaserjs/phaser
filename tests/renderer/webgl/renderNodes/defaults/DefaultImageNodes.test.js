var DefaultImageNodes = require('../../../../../src/renderer/webgl/renderNodes/defaults/DefaultImageNodes');

describe('DefaultImageNodes', function ()
{
    it('should be a Phaser Map instance', function ()
    {
        expect(DefaultImageNodes).toBeDefined();
        expect(typeof DefaultImageNodes).toBe('object');
    });

    it('should have a get method', function ()
    {
        expect(typeof DefaultImageNodes.get).toBe('function');
    });

    it('should contain a Submitter entry mapped to SubmitterQuad', function ()
    {
        expect(DefaultImageNodes.get('Submitter')).toBe('SubmitterQuad');
    });

    it('should contain a BatchHandler entry mapped to BatchHandlerQuad', function ()
    {
        expect(DefaultImageNodes.get('BatchHandler')).toBe('BatchHandlerQuad');
    });

    it('should contain a Transformer entry mapped to TransformerImage', function ()
    {
        expect(DefaultImageNodes.get('Transformer')).toBe('TransformerImage');
    });

    it('should contain a Texturer entry mapped to TexturerImage', function ()
    {
        expect(DefaultImageNodes.get('Texturer')).toBe('TexturerImage');
    });

    it('should have exactly four entries', function ()
    {
        expect(DefaultImageNodes.size).toBe(4);
    });

    it('should return undefined for a key that does not exist', function ()
    {
        expect(DefaultImageNodes.get('NonExistent')).toBeUndefined();
    });

    it('should contain all four expected keys', function ()
    {
        expect(DefaultImageNodes.has('Submitter')).toBe(true);
        expect(DefaultImageNodes.has('BatchHandler')).toBe(true);
        expect(DefaultImageNodes.has('Transformer')).toBe(true);
        expect(DefaultImageNodes.has('Texturer')).toBe(true);
    });

    it('should return false for has on a missing key', function ()
    {
        expect(DefaultImageNodes.has('Missing')).toBe(false);
    });

    it('should return all keys via getArray or keys', function ()
    {
        var keys = DefaultImageNodes.keys();
        expect(keys).toContain('Submitter');
        expect(keys).toContain('BatchHandler');
        expect(keys).toContain('Transformer');
        expect(keys).toContain('Texturer');
        expect(keys.length).toBe(4);
    });

    it('should return all values via values', function ()
    {
        var values = DefaultImageNodes.values();
        expect(values).toContain('SubmitterQuad');
        expect(values).toContain('BatchHandlerQuad');
        expect(values).toContain('TransformerImage');
        expect(values).toContain('TexturerImage');
        expect(values.length).toBe(4);
    });
});
