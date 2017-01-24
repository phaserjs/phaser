
var BlitterWebGLRenderer = function (renderer, src, interpolationPercentage)
{
    var worldAlpha = src.color.worldAlpha * 255 << 24;
    var len = src.children.list.length;

    //  Skip rendering?

    if (src.skipRender || !src.visible || worldAlpha === 0 || len === 0)
    {
        return;
    }

    //  Render children
    for (var i = 0; i < len; i++)
    {
        var bob = src.children.list[i];
        var frame = bob.frame;

        if (!bob.visible || !frame.cutWidth || !frame.cutHeight)
        {
            continue;
        }

        renderer.blitterBatch.add(bob.x, bob.y, frame);
    }
};

module.exports = BlitterWebGLRenderer;
