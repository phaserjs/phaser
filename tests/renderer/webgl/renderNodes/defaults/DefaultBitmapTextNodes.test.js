var DefaultBitmapTextNodes = require('../../../../../src/renderer/webgl/renderNodes/defaults/DefaultBitmapTextNodes');

describe('DefaultBitmapTextNodes', function ()
{
    it('should be a Phaser Map instance', function ()
    {
        expect(DefaultBitmapTextNodes).toBeDefined();
        expect(typeof DefaultBitmapTextNodes).toBe('object');
        expect(DefaultBitmapTextNodes.entries).toBeDefined();
    });

    it('should contain a Submitter entry mapped to SubmitterQuad', function ()
    {
        expect(DefaultBitmapTextNodes.get('Submitter')).toBe('SubmitterQuad');
    });

    it('should contain a BatchHandler entry mapped to BatchHandlerQuad', function ()
    {
        expect(DefaultBitmapTextNodes.get('BatchHandler')).toBe('BatchHandlerQuad');
    });

    it('should have exactly two entries', function ()
    {
        expect(DefaultBitmapTextNodes.size).toBe(2);
    });

    it('should return undefined for unknown keys', function ()
    {
        expect(DefaultBitmapTextNodes.get('NonExistent')).toBeUndefined();
    });

    it('should report that Submitter key exists', function ()
    {
        expect(DefaultBitmapTextNodes.has('Submitter')).toBe(true);
    });

    it('should report that BatchHandler key exists', function ()
    {
        expect(DefaultBitmapTextNodes.has('BatchHandler')).toBe(true);
    });

    it('should report that unknown keys do not exist', function ()
    {
        expect(DefaultBitmapTextNodes.has('NonExistent')).toBe(false);
    });

    it('should have entries object with Submitter and BatchHandler keys', function ()
    {
        expect(DefaultBitmapTextNodes.entries['Submitter']).toBe('SubmitterQuad');
        expect(DefaultBitmapTextNodes.entries['BatchHandler']).toBe('BatchHandlerQuad');
    });
});
