var ParticleEmitterRender = require('../../../src/gameobjects/particles/ParticleEmitterRender');

describe('ParticleEmitterRender', function ()
{
    it('should be importable', function ()
    {
        expect(ParticleEmitterRender).toBeDefined();
    });

    it('should export a renderWebGL property', function ()
    {
        expect(ParticleEmitterRender).toHaveProperty('renderWebGL');
    });

    it('should export a renderCanvas property', function ()
    {
        expect(ParticleEmitterRender).toHaveProperty('renderCanvas');
    });

    it('should export renderWebGL as a function', function ()
    {
        expect(typeof ParticleEmitterRender.renderWebGL).toBe('function');
    });

    it('should export renderCanvas as a function', function ()
    {
        expect(typeof ParticleEmitterRender.renderCanvas).toBe('function');
    });

    it('should have renderWebGL be a named function', function ()
    {
        expect(ParticleEmitterRender.renderWebGL.name).toBeTruthy();
    });

    it('should have renderCanvas be a named function', function ()
    {
        expect(ParticleEmitterRender.renderCanvas.name).toBeTruthy();
    });
});
