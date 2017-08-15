var StaticTilemapWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    var gameObject = src;
    var frame = gameObject.frame;
    var gl = gameObject.gl;

    renderer.setRenderer(gameObject.tilemapRenderer, frame.texture.source[frame.sourceIndex].glTexture, gameObject.renderTarget);
    gameObject.tilemapRenderer.bind();
    gameObject.upload(camera);
    //gameObject.cull(camera);
    gameObject.vbo.bind();

    //var vertexCount = gameObject.cullEnd - gameObject.cullStart;
    //if (vertexCount > 0)
    //{
    //    gl.drawArrays(gl.TRIANGLES, gameObject.cullStart, vertexCount);
    //}
    gl.drawArrays(gl.TRIANGLES, 0, gameObject.vertexCount);
};

module.exports = StaticTilemapWebGLRenderer;
