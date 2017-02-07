
var BlitterCanvasRenderer = function (renderer, src, interpolationPercentage)
{
    var worldAlpha = src.color.worldAlpha;
    var len = src.children.list.length;

    //  Skip rendering?

    if (src.skipRender || !src.visible || worldAlpha === 0 || len === 0)
    {
        return;
    }

    renderer.resetTransform();
    renderer.setBlendMode(src.blendMode);
    renderer.setAlpha(worldAlpha);

    //  Render bobs
    for (var i = 0; i < len; i++)
    {
        var bob = src.children.list[i];
        var frame = bob.frame;

        // if (!bob.visible)
        // {
            // continue;
        // }

        renderer.blitImage(bob.x, bob.y, frame);
    }
};

module.exports = BlitterCanvasRenderer;
