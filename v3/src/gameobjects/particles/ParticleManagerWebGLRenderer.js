var GameObject = require('../GameObject');

var ParticleManagerWebGLRenderer = function (renderer, emitterManager, interpolationPercentage, camera)
{
    var emitters = emitterManager.emitters;

    if (emitters.length === 0 || GameObject.RENDER_MASK !== emitterManager.renderFlags || (emitterManager.cameraFilter > 0 && (emitterManager.cameraFilter & camera._id)))
    {
        return;
    }

    for (var i = 0; i < emitters.length; i++)
    {
        renderer.particleRenderer.renderEmitter(emitters[i], camera);
    }
};

module.exports = ParticleManagerWebGLRenderer;
