
var ImageCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    var frame = src.frame;

    //  Calculate this in the Color component
    var alpha = 1; //src.color.worldAlpha * 255 << 24;

    //  Move all of these to accessors that automatically remove this GO from the display list anyway
    if (src.skipRender || !src.visible || alpha === 0 || !frame.cutWidth || !frame.cutHeight)
    {
        return;
    }

    var tint = null; //src.color._glTint;
    var bg = null; //src.color._glBg;

    renderer.drawImage(frame, src, /* blendMode */null, alpha, tint, bg, camera);
};

module.exports = ImageCanvasRenderer;
