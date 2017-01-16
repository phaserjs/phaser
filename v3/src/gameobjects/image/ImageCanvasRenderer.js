
var ImageCanvasRenderer = function (renderer, src, interpolationPercentage)
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

    renderer.drawImage(frame, src.blendMode, data, alpha, tint, bg);
};

module.exports = ImageCanvasRenderer;
