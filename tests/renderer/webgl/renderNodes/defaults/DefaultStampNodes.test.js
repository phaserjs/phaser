var DefaultStampNodes = require('../../../../../src/renderer/webgl/renderNodes/defaults/DefaultStampNodes');

describe('DefaultStampNodes', function ()
{
    it('should be a Phaser Map instance', function ()
    {
        expect(DefaultStampNodes).toBeDefined();
        expect(typeof DefaultStampNodes).toBe('object');
    });

    it('should contain the Submitter key mapped to SubmitterQuad', function ()
    {
        expect(DefaultStampNodes.get('Submitter')).toBe('SubmitterQuad');
    });

    it('should contain the BatchHandler key mapped to BatchHandlerQuad', function ()
    {
        expect(DefaultStampNodes.get('BatchHandler')).toBe('BatchHandlerQuad');
    });

    it('should contain the Transformer key mapped to TransformerStamp', function ()
    {
        expect(DefaultStampNodes.get('Transformer')).toBe('TransformerStamp');
    });

    it('should contain the Texturer key mapped to TexturerImage', function ()
    {
        expect(DefaultStampNodes.get('Texturer')).toBe('TexturerImage');
    });

    it('should have exactly four entries', function ()
    {
        expect(DefaultStampNodes.size).toBe(4);
    });

    it('should return undefined for a key that does not exist', function ()
    {
        expect(DefaultStampNodes.get('NonExistent')).toBeUndefined();
    });

    it('should report that all four keys exist via has()', function ()
    {
        expect(DefaultStampNodes.has('Submitter')).toBe(true);
        expect(DefaultStampNodes.has('BatchHandler')).toBe(true);
        expect(DefaultStampNodes.has('Transformer')).toBe(true);
        expect(DefaultStampNodes.has('Texturer')).toBe(true);
    });

    it('should report false for a key that does not exist via has()', function ()
    {
        expect(DefaultStampNodes.has('NonExistent')).toBe(false);
    });

    it('should return all four keys via getArray()', function ()
    {
        var keys = DefaultStampNodes.keys();
        expect(keys).toContain('Submitter');
        expect(keys).toContain('BatchHandler');
        expect(keys).toContain('Transformer');
        expect(keys).toContain('Texturer');
        expect(keys.length).toBe(4);
    });

    it('should return all four values via values()', function ()
    {
        var vals = DefaultStampNodes.values();
        expect(vals).toContain('SubmitterQuad');
        expect(vals).toContain('BatchHandlerQuad');
        expect(vals).toContain('TransformerStamp');
        expect(vals).toContain('TexturerImage');
        expect(vals.length).toBe(4);
    });
});
