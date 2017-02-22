
var BlitterCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    var worldAlpha = 1; //src.color.worldAlpha;
    var list = src.getRenderList();

    //  Skip rendering?

    if (src.skipRender || !src.visible || worldAlpha === 0 || list.length === 0)
    {
        return;
    }

    renderer.resetTransform();
    renderer.setBlendMode(src.blendMode);

    var ca = renderer.currentAlpha;

    //  Render bobs
    for (var i = 0; i < list.length; i++)
    {
        var bob = list[i];

        if (ca !== bob.alpha)
        {
            ca = renderer.setAlpha(bob.alpha);
        }

        renderer.blitImage(bob.x, bob.y, bob.frame, camera);
    }
};

module.exports = BlitterCanvasRenderer;
