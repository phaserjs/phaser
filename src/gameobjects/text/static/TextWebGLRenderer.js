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

    this.pipeline.batchText(this, camera);
};

module.exports = TextWebGLRenderer;
