var MeshWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }
    renderer.spriteBatch.addMesh(src, camera);
};

module.exports = MeshWebGLRenderer
