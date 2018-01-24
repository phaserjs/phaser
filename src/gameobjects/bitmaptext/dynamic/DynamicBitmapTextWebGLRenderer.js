var GameObject = require('../../GameObject');
var TransformMatrix = require('../../components/TransformMatrix');
var Utils = require('../../../renderer/webgl/Utils');
var tempMatrix = new TransformMatrix();
var tempMatrixChar = new TransformMatrix();

var DynamicBitmapTextWebGLRenderer = function (renderer, bitmapText, interpolationPercentage, camera)
{
    var text = bitmapText.text;
    var textLength = text.length;

    if (GameObject.RENDER_MASK !== bitmapText.renderFlags || textLength === 0 || (bitmapText.cameraFilter > 0 && (bitmapText.cameraFilter & camera._id)))
    {
        return;
    }

    renderer.pipelines.TextureTintPipeline.batchDynamicBitmapText(bitmapText, camera);
};

module.exports = DynamicBitmapTextWebGLRenderer;
