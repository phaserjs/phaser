
var SpriteWebGLRenderer = function (renderer, src, interpolationPercentage)
{
    var frame = src.frame;
    var alpha = src.color.worldAlpha * 255 << 24;

    //  Skip rendering?

    if (src.skipRender || !src.visible || alpha === 0 || !frame.cutWidth || !frame.cutHeight)
    {
        return;
    }

    var transform = src.transform;

    renderer.setBlendMode(src.color._blendMode);

    renderer.spriteBatch.add(
        frame,
        transform._anchorX, transform._anchorY,
        transform.world.tx, transform.world.ty,
        transform._worldScaleX, transform._worldScaleY,
        transform._worldRotation,
        src.color._glTint
    );

    //  Render children
    for (var i = 0; i < src.children.list.length; i++)
    {
        var child = src.children.list[i];

        child.renderWebGL(renderer, child, interpolationPercentage);
    }
};

module.exports = SpriteWebGLRenderer;
