var BlitterWebGLRenderer = function (renderer, src, interpolationPercentage)
{
    var worldAlpha = src.color.worldAlpha;
    var len = src.children.list.length - 1;

    //  Skip rendering?

    if (src.skipRender || !src.visible || worldAlpha === 0 || len === 0)
    {
        return;
    }

    //  Render bobs

    for (var i = 0; i <= len; ++i)
    {
        var bob = src.children.list[i];
        var frame = bob.frame;

        renderer.blitterBatch.add(bob.x, bob.y, frame, worldAlpha);
    }
};

module.exports = BlitterWebGLRenderer;
