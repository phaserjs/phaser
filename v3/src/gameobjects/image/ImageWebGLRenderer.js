
var ImageWebGLRenderer = function (renderer, src, interpolationPercentage)
{
    var frame = src.frame;
    // var alpha = src.color.worldAlpha * 255 << 24;

    var alpha = 16777216;

    //  Skip rendering?

    // if (src.skipRender || !src.visible || alpha === 0 || !frame.cutWidth || !frame.cutHeight)
    // {
    //     return;
    // }

    // var verts = src.transform.getVertexData(interpolationPercentage, renderer);
    // var index = src.frame.source.glTextureIndex;
    // var tint = src.color._glTint;
    // var bg = src.color._glBg;
    // renderer.batch.add(frame.source, src.blendMode, verts, frame.uvs, index, alpha, tint, bg);

    var transform = src.transform;
    renderer.setBlendMode(src.color._blendMode);
    renderer.spriteBatch.add(
        frame,
        src.anchorX, src.anchorY,
        transform.worldMatrix.matrix,
        src.color._glTint
    );
};

module.exports = ImageWebGLRenderer;
