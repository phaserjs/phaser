var GameObject = require('../GameObject');

var RenderTextureWebGLRenderer = function (renderer, renderTexture, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== renderTexture.renderFlags || (renderTexture.cameraFilter > 0 && (renderTexture.cameraFilter & camera._id)))
    {
        return;
    }

    this.pipeline.batchTexture(
        renderTexture,
        renderTexture.texture,
        renderTexture.texture.width, renderTexture.texture.height,
        renderTexture.x, renderTexture.y,
        renderTexture.width, renderTexture.height,
        renderTexture.scaleX, renderTexture.scaleY,
        renderTexture.rotation,
        renderTexture.flipX, renderTexture.flipY,
        renderTexture.scrollFactorX, renderTexture.scrollFactorY,
        renderTexture.displayOriginX, renderTexture.displayOriginY,
        0, 0, renderTexture.texture.width, renderTexture.texture.height,
        0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff,
        0, 0, 
        camera
    );
};

module.exports = RenderTextureWebGLRenderer;
