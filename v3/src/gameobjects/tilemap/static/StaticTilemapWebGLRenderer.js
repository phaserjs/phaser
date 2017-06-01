var StaticTilemapWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }

    var gameObject = src;
    var frame = gameObject.frame;
    var gl = gameObject.gl;

    renderer.setRenderer(gameObject.tilemapRenderer, frame.texture.source[frame.sourceIndex].glTexture, gameObject.renderTarget);
    gameObject.upload();
    gameObject.vbo.bind();
    gl.drawArrays(gl.TRIANGLES, 0, gameObject.vertexCount);
};

module.exports = StaticTilemapWebGLRenderer;
