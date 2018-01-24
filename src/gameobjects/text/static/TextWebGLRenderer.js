var GameObject = require('../../GameObject');
var Utils = require('../../../renderer/webgl/Utils');

var TextWebGLRenderer = function (renderer, text, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== text.renderFlags || (text.cameraFilter > 0 && (text.cameraFilter & camera._id)) || text.text === '')
    {
        return;
    }
    
    if (text.dirty)
    {
        text.canvasTexture = renderer.canvasToTexture(text.canvas, text.canvasTexture, true, text.scaleMode);
        text.dirty = false;
    }

    var getTint = Utils.getTintAppendFloatAlpha;

    renderer.pipelines.TextureTintPipeline.batchTexture(
        text.canvasTexture,
        text.x, text.y,
        text.canvasTexture.width, text.canvasTexture.height,
        text.scaleX, text.scaleY,
        text.rotation,
        text.flipX, text.flipY,
        text.scrollFactorX, text.scrollFactorY,
        text.displayOriginX, text.displayOriginY,
        0, 0, text.canvasTexture.width, text.canvasTexture.height,
        getTint(text._tintTL, text._alphaTL), 
        getTint(text._tintTR, text._alphaTR), 
        getTint(text._tintBL, text._alphaBL), 
        getTint(text._tintBR, text._alphaBR),
        camera
    );
};

module.exports = TextWebGLRenderer;
