var GameObject = require('../GameObject');

var MeshWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    renderer.pipelines.TextureTintPipeline.batchMesh(src, camera);
};

module.exports = MeshWebGLRenderer;
