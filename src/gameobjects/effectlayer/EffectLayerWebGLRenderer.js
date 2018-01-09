var GameObject = require('../GameObject');

var EffectLayerWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    renderer.effectRenderer.renderEffect(src, camera, src.renderTexture, src.width, src.height);
};

module.exports = EffectLayerWebGLRenderer;
