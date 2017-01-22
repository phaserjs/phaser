
var BlitterWebGLRenderer = function (renderer, src, interpolationPercentage)
{
    // var frame = src.frame;
    var worldAlpha = src.color.worldAlpha * 255 << 24;

    //  Skip rendering?

    if (src.skipRender || !src.visible || worldAlpha === 0)
    {
        return;
    }

    // var verts = src.transform.getVertexData(interpolationPercentage, renderer);
    // var index = src.frame.source.glTextureIndex;
    // var tint = src.color._glTint;
    // var bg = src.color._glBg;
    // renderer.batch.add(frame.source, src.blendMode, verts, frame.uvs, index, alpha, tint, bg);
    // var transform = src.transform;

    //  Render children
    for (var i = 0; i < src.children.list.length; i++)
    {
        var bob = src.children.list[i];
        var frame = bob.frame;
        var alpha = (worldAlpha * bob.alpha) * 255 << 24;

        if (!bob.visible || alpha === 0 || !frame.cutWidth || !frame.cutHeight)
        {
            continue;
        }

        var index = frame.source.glTextureIndex;
        var verts = bob.transform.getVertexData(interpolationPercentage);

        //  tint and bg values come from the parent Blitter object, not the Bob
        renderer.batch.add(frame.source, src.blendMode, verts, frame.uvs, index, alpha, tint, bg);
    }

    // renderer.spriteBatch.add(
    //     frame,
    //     transform._pivotX, transform._pivotY,
    //     transform.world.tx, transform.world.ty,
    //     transform._worldScaleX, transform._worldScaleY,
    //     transform._worldRotation
    // );
};

module.exports = BlitterWebGLRenderer;
