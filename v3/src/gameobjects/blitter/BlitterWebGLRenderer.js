var BlitterWebGLRenderer = function (renderer, src, interpolationPercentage)
{
    var worldAlpha = src.color.worldAlpha;
    var list = src.getRenderList();

    //  Skip rendering?

    if (src.skipRender || !src.visible || worldAlpha === 0 || list.length === 0)
    {
        return;
    }

    //  Render bobs

    for (var i = 0; i < list.length; i++)
    {
        var bob = list[i];

        renderer.blitterBatch.add(bob.x, bob.y, bob.frame, bob.alpha);
    }
};

module.exports = BlitterWebGLRenderer;
