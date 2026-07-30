var DefaultQuadNodes = require('../../../../../src/renderer/webgl/renderNodes/defaults/DefaultQuadNodes');

describe('DefaultQuadNodes', function ()
{
    it('should be importable', function ()
    {
        expect(DefaultQuadNodes).toBeDefined();
    });

    it('should be a Phaser Map instance', function ()
    {
        expect(typeof DefaultQuadNodes).toBe('object');
        expect(DefaultQuadNodes.entries).toBeDefined();
    });

    it('should have a BatchHandler entry', function ()
    {
        expect(DefaultQuadNodes.get('BatchHandler')).toBe('BatchHandlerQuad');
    });

    it('should contain exactly one entry', function ()
    {
        expect(DefaultQuadNodes.size).toBe(1);
    });

    it('should return undefined for unknown keys', function ()
    {
        expect(DefaultQuadNodes.get('NonExistent')).toBeUndefined();
    });

    it('should report that BatchHandler key exists', function ()
    {
        expect(DefaultQuadNodes.has('BatchHandler')).toBe(true);
    });

    it('should report that unknown keys do not exist', function ()
    {
        expect(DefaultQuadNodes.has('BatchHandlerQuad')).toBe(false);
        expect(DefaultQuadNodes.has('')).toBe(false);
    });

    it('should return keys array containing BatchHandler', function ()
    {
        var keys = DefaultQuadNodes.keys();
        expect(keys).toContain('BatchHandler');
        expect(keys.length).toBe(1);
    });

    it('should return values array containing BatchHandlerQuad', function ()
    {
        var values = DefaultQuadNodes.values();
        expect(values).toContain('BatchHandlerQuad');
        expect(values.length).toBe(1);
    });
});
