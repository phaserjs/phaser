var GameObject = require('../GameObject');

var ParticleManagerWebGLRenderer = function (renderer, emitterManager, interpolationPercentage, camera)
{
    var emitters = emitterManager.emitters;

    if (emitters.length === 0 || GameObject.RENDER_MASK !== emitterManager.renderFlags || (emitterManager.cameraFilter > 0 && (emitterManager.cameraFilter & camera._id)))
    {
        return;
    }

    renderer.particleRenderer.renderEmitterManager(emitterManager, camera);
};

module.exports = ParticleManagerWebGLRenderer;
