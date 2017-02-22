
var SpriteCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    var frame = src.frame;
    var alpha = 1; //src.color.worldAlpha * 255 << 24;

    //  Skip rendering?

    if (src.skipRender || !src.visible || alpha === 0 || !frame.cutWidth || !frame.cutHeight)
    {
        return;
    }

    var tint = null; //src.color._glTint;
    var bg = null; //src.color._glBg;

    renderer.drawImage(frame, src, /*blendMode*/ null, alpha, tint, bg, camera);

    //  Render children
    for (var i = 0; i < src.children.list.length; i++)
    {
        var child = src.children.list[i];

        child.renderCanvas(renderer, child, interpolationPercentage, canvas, camera);
    }
};

module.exports = SpriteCanvasRenderer;
