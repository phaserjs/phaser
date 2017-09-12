var GameObject = require('../../GameObject');

var TextWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }
    
    if (src.dirty)
    {
        src.canvasTexture = renderer.uploadCanvasToGPU(src.canvas, src.canvasTexture, true);
        src.dirty = false;
    }

    renderer.spriteBatch.addSpriteTexture(src, camera, src.canvasTexture, src.canvas.width, src.canvas.height);
};

module.exports = TextWebGLRenderer;
