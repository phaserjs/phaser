
var ContainerWebGLRenderer = function (renderer, src, interpolationPercentage)
{
    var frame = src.frame;
    var alpha = src.color.worldAlpha * 255 << 24;

    //  Skip rendering?

    if (src.skipRender || !src.visible || alpha === 0 || src.children.list.length === 0)
    {
        return;
    }

    //  Render children
    for (var i = 0; i < src.children.list.length; i++)
    {
        var child = src.children.list[i];

        child.render(renderer, child);
    }
};

module.exports = ContainerWebGLRenderer;
