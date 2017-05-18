var MeshWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }
    if (src.indices.length > 0)
        renderer.spriteBatch.addMeshIndexed(src, camera);
    else
        renderer.spriteBatch.addMesh(src, camera);
};

module.exports = MeshWebGLRenderer
