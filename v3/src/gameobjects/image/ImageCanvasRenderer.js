
var ImageCanvasRenderer = function (renderer, src, interpolationPercentage)
{
    var frame = src.frame;
    var alpha = src.color.worldAlpha * 255 << 24;

    //  Move all of these to accessors that automatically remove this GO from the display list anyway
    if (src.skipRender || !src.visible || alpha === 0 || !frame.cutWidth || !frame.cutHeight)
    {
        return;
    }

    // var data = src.transform.worldMatrix;
    var tint = src.color._glTint;
    var bg = src.color._glBg;

    renderer.drawImage(frame, src.blendMode, src.transform, alpha, tint, bg);
};

module.exports = ImageCanvasRenderer;
