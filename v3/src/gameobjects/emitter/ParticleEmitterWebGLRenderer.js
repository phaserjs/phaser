var GameObject = require('../GameObject');

var ParticleEmitterWebGLRenderer = function (renderer, emitter, interpolationPercentage, camera)
{
    if (emitter.isEmpty() || GameObject.RENDER_MASK !== emitter.renderFlags || (emitter.cameraFilter > 0 && (emitter.cameraFilter & camera._id)))
    {
        return;
    }

    renderer.particleRenderer.renderEmitter(emitter, camera);
};

module.exports = ParticleEmitterWebGLRenderer;
