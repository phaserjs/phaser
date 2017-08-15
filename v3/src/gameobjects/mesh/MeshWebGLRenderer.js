var MeshWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (src.renderMask !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    if (src.indices.length > 0)
    {
        renderer.spriteBatch.addMeshIndexed(src, camera);
    }
    else
    {
        renderer.spriteBatch.addMesh(src, camera);
    }
};

module.exports = MeshWebGLRenderer;
