
var ContainerCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }

    //  Render children
    for (var i = 0; i < src.children.list.length; i++)
    {
        var child = src.children.list[i];

        child.renderCanvas(renderer, child, interpolationPercentage, camera);
    }
};

module.exports = ContainerCanvasRenderer;
