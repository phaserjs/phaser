var GameObject = require('../../GameObject');

var StaticTilemapLayerWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    var gameObject = src;
    var frame = gameObject.frame;
    var gl = gameObject.gl;

    renderer.setRenderer(gameObject.tilemapRenderer, frame.texture.source[frame.sourceIndex].glTexture, gameObject.renderTarget);

    gameObject.tilemapRenderer.bind();
    gameObject.upload(camera);
    gameObject.vbo.bind();

    gl.drawArrays(gl.TRIANGLES, 0, gameObject.vertexCount);
};

module.exports = StaticTilemapLayerWebGLRenderer;
