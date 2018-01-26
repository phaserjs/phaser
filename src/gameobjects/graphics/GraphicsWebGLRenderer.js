var GameObject = require('../GameObject');

var GraphicsWebGLRenderer = function (renderer, graphics, interpolationPercentage, camera, forceRenderTarget)
{
    if (GameObject.RENDER_MASK !== graphics.renderFlags || (graphics.cameraFilter > 0 && (graphics.cameraFilter & camera._id)))
    {
        return;
    }

    renderer.pipelines.FlatTintPipeline.batchGraphics(this, camera);
};

module.exports = GraphicsWebGLRenderer;
