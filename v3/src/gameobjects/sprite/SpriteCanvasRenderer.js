
var SpriteCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    var frame = src.frame;
    var alpha = src.color.worldAlpha * 255 << 24;

    //  Skip rendering?

    if (src.skipRender || !src.visible || alpha === 0 || !frame.cutWidth || !frame.cutHeight)
    {
        return;
    }

    var data = src.transform.getCanvasTransformData(interpolationPercentage, renderer);
    var tint = src.color._glTint;
    var bg = src.color._glBg;

    renderer.drawImage(frame, src.blendMode, data, alpha, tint, bg, camera);

    //  Render children
    for (var i = 0; i < src.children.list.length; i++)
    {
        var child = src.children.list[i];

        child.renderCanvas(renderer, child, interpolationPercentage, canvas, camera);
    }
};

module.exports = SpriteCanvasRenderer;
