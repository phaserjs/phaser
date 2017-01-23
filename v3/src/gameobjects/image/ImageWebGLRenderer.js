
var ImageWebGLRenderer = function (renderer, src, interpolationPercentage)
{
    var frame = src.frame;
    var alpha = src.color.worldAlpha * 255 << 24;

    //  Skip rendering?

    if (src.skipRender || !src.visible || alpha === 0 || !frame.cutWidth || !frame.cutHeight)
    {
        return;
    }

    // var verts = src.transform.getVertexData(interpolationPercentage, renderer);
    // var index = src.frame.source.glTextureIndex;
    // var tint = src.color._glTint;
    // var bg = src.color._glBg;
    // renderer.batch.add(frame.source, src.blendMode, verts, frame.uvs, index, alpha, tint, bg);

    var transform = src.transform;

    renderer.spriteBatch.add(
        frame,
        transform._anchorX, transform._anchorY,
        transform.world.tx, transform.world.ty,
        transform._worldScaleX, transform._worldScaleY,
        transform._worldRotation,
        src.color._glTint
    );
};

module.exports = ImageWebGLRenderer;
