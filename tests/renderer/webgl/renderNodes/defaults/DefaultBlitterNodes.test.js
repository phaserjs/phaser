var DefaultBlitterNodes = require('../../../../../src/renderer/webgl/renderNodes/defaults/DefaultBlitterNodes');

describe('DefaultBlitterNodes', function ()
{
    it('should be a Phaser Map instance', function ()
    {
        expect(typeof DefaultBlitterNodes).toBe('object');
        expect(DefaultBlitterNodes).not.toBeNull();
    });

    it('should have exactly two entries', function ()
    {
        expect(DefaultBlitterNodes.size).toBe(2);
    });

    it('should contain the Submitter key', function ()
    {
        expect(DefaultBlitterNodes.has('Submitter')).toBe(true);
    });

    it('should map Submitter to SubmitterQuad', function ()
    {
        expect(DefaultBlitterNodes.get('Submitter')).toBe('SubmitterQuad');
    });

    it('should contain the BatchHandler key', function ()
    {
        expect(DefaultBlitterNodes.has('BatchHandler')).toBe(true);
    });

    it('should map BatchHandler to BatchHandlerQuad', function ()
    {
        expect(DefaultBlitterNodes.get('BatchHandler')).toBe('BatchHandlerQuad');
    });

    it('should not contain unknown keys', function ()
    {
        expect(DefaultBlitterNodes.has('Unknown')).toBe(false);
        expect(DefaultBlitterNodes.has('Renderer')).toBe(false);
    });

    it('should return undefined for unknown keys', function ()
    {
        expect(DefaultBlitterNodes.get('NonExistent')).toBeUndefined();
    });

    it('should expose entries as a plain object', function ()
    {
        expect(typeof DefaultBlitterNodes.entries).toBe('object');
        expect(DefaultBlitterNodes.entries['Submitter']).toBe('SubmitterQuad');
        expect(DefaultBlitterNodes.entries['BatchHandler']).toBe('BatchHandlerQuad');
    });
});
