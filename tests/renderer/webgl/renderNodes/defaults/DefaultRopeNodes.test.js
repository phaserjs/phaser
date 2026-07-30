var DefaultRopeNodes = require('../../../../../src/renderer/webgl/renderNodes/defaults/DefaultRopeNodes');

describe('DefaultRopeNodes', function ()
{
    it('should be a Phaser Map instance', function ()
    {
        expect(typeof DefaultRopeNodes).toBe('object');
        expect(DefaultRopeNodes).not.toBeNull();
    });

    it('should have an entries property', function ()
    {
        expect(typeof DefaultRopeNodes.entries).toBe('object');
    });

    it('should contain the BatchHandler key', function ()
    {
        expect(DefaultRopeNodes.get('BatchHandler')).toBe('BatchHandlerStrip');
    });

    it('should have exactly one entry', function ()
    {
        expect(DefaultRopeNodes.size).toBe(1);
    });

    it('should return undefined for unknown keys', function ()
    {
        expect(DefaultRopeNodes.get('NonExistentKey')).toBeUndefined();
    });

    it('should have BatchHandler in its entries object', function ()
    {
        expect(DefaultRopeNodes.entries['BatchHandler']).toBe('BatchHandlerStrip');
    });

    it('should report that it contains the BatchHandler key', function ()
    {
        expect(DefaultRopeNodes.has('BatchHandler')).toBe(true);
    });

    it('should report that it does not contain unknown keys', function ()
    {
        expect(DefaultRopeNodes.has('BatchHandlerStrip')).toBe(false);
        expect(DefaultRopeNodes.has('')).toBe(false);
    });

    it('should return the correct values array', function ()
    {
        var values = DefaultRopeNodes.getArray();
        expect(Array.isArray(values)).toBe(true);
        expect(values.length).toBe(1);
        expect(values[0]).toBe('BatchHandlerStrip');
    });

    it('should return the correct keys array', function ()
    {
        var keys = DefaultRopeNodes.keys();
        expect(Array.isArray(keys)).toBe(true);
        expect(keys.length).toBe(1);
        expect(keys[0]).toBe('BatchHandler');
    });

    it('should return the correct values from values()', function ()
    {
        var vals = DefaultRopeNodes.values();
        expect(Array.isArray(vals)).toBe(true);
        expect(vals.length).toBe(1);
        expect(vals[0]).toBe('BatchHandlerStrip');
    });
});
