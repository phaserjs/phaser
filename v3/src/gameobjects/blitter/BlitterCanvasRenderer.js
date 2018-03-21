
var BlitterCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }

    var list = src.getRenderList();

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
