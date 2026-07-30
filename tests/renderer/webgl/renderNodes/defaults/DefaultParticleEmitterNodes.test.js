var DefaultParticleEmitterNodes = require('../../../../../src/renderer/webgl/renderNodes/defaults/DefaultParticleEmitterNodes');

describe('DefaultParticleEmitterNodes', function ()
{
    it('should export a Map instance', function ()
    {
        expect(DefaultParticleEmitterNodes).toBeDefined();
        expect(typeof DefaultParticleEmitterNodes).toBe('object');
    });

    it('should have a size of 2', function ()
    {
        expect(DefaultParticleEmitterNodes.size).toBe(2);
    });

    it('should contain the Submitter key mapped to SubmitterQuad', function ()
    {
        expect(DefaultParticleEmitterNodes.get('Submitter')).toBe('SubmitterQuad');
    });

    it('should contain the BatchHandler key mapped to BatchHandlerQuad', function ()
    {
        expect(DefaultParticleEmitterNodes.get('BatchHandler')).toBe('BatchHandlerQuad');
    });

    it('should return undefined for a key that does not exist', function ()
    {
        expect(DefaultParticleEmitterNodes.get('NonExistent')).toBeUndefined();
    });

    it('should contain the Submitter key', function ()
    {
        expect(DefaultParticleEmitterNodes.has('Submitter')).toBe(true);
    });

    it('should contain the BatchHandler key', function ()
    {
        expect(DefaultParticleEmitterNodes.has('BatchHandler')).toBe(true);
    });

    it('should not contain keys that were not added', function ()
    {
        expect(DefaultParticleEmitterNodes.has('BatchHandlerTriangle')).toBe(false);
    });

    it('should have entries for both keys', function ()
    {
        var keys = DefaultParticleEmitterNodes.keys();

        expect(keys).toContain('Submitter');
        expect(keys).toContain('BatchHandler');
    });

    it('should have values for both node types', function ()
    {
        var values = DefaultParticleEmitterNodes.values();

        expect(values).toContain('SubmitterQuad');
        expect(values).toContain('BatchHandlerQuad');
    });
});
