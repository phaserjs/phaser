var GameObject = require('../../GameObject');
var TransformMatrix = require('../../components/TransformMatrix');
var tempMatrix = new TransformMatrix();

var BitmapTextWebGLRenderer = function (renderer, gameObject, interpolationPercentage, camera)
{
    var text = gameObject.text;
    var textLength = text.length;

    if (GameObject.RENDER_MASK !== gameObject.renderFlags || textLength === 0 || (gameObject.cameraFilter > 0 && (gameObject.cameraFilter & camera._id)))
    {
        return;
    }

    this.pipeline.batchBitmapText(this, camera);
};

module.exports = BitmapTextWebGLRenderer;
