var DefaultPointLightNodes = require('../../../../../src/renderer/webgl/renderNodes/defaults/DefaultPointLightNodes');

describe('DefaultPointLightNodes', function ()
{
    it('should be a Phaser Map instance', function ()
    {
        expect(DefaultPointLightNodes).toBeDefined();
        expect(typeof DefaultPointLightNodes).toBe('object');
    });

    it('should have an entries property', function ()
    {
        expect(DefaultPointLightNodes.entries).toBeDefined();
        expect(typeof DefaultPointLightNodes.entries).toBe('object');
    });

    it('should contain the BatchHandler key', function ()
    {
        expect(DefaultPointLightNodes.entries).toHaveProperty('BatchHandler');
    });

    it('should map BatchHandler to BatchHandlerPointLight', function ()
    {
        expect(DefaultPointLightNodes.entries['BatchHandler']).toBe('BatchHandlerPointLight');
    });

    it('should have a size of 1', function ()
    {
        expect(DefaultPointLightNodes.size).toBe(1);
    });

    it('should return the correct value when using get', function ()
    {
        expect(DefaultPointLightNodes.get('BatchHandler')).toBe('BatchHandlerPointLight');
    });

    it('should return undefined for a key that does not exist', function ()
    {
        expect(DefaultPointLightNodes.get('NonExistentKey')).toBeUndefined();
    });

    it('should confirm BatchHandler key exists via has', function ()
    {
        expect(DefaultPointLightNodes.has('BatchHandler')).toBe(true);
    });

    it('should return false for has with a non-existent key', function ()
    {
        expect(DefaultPointLightNodes.has('NonExistentKey')).toBe(false);
    });

    it('should return the keys array containing BatchHandler', function ()
    {
        var keys = DefaultPointLightNodes.keys();
        expect(Array.isArray(keys)).toBe(true);
        expect(keys).toContain('BatchHandler');
        expect(keys.length).toBe(1);
    });

    it('should return the values array containing BatchHandlerPointLight', function ()
    {
        var values = DefaultPointLightNodes.values();
        expect(Array.isArray(values)).toBe(true);
        expect(values).toContain('BatchHandlerPointLight');
        expect(values.length).toBe(1);
    });
});
