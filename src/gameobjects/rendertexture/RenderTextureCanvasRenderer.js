var GameObject = require('../GameObject');

var RenderTextureCanvasRenderer = function (renderer, renderTexture, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== renderTexture.renderFlags || (renderTexture.cameraFilter > 0 && (renderTexture.cameraFilter & camera._id)))
    {
        return;
    }

};

module.exports = RenderTextureCanvasRenderer;
