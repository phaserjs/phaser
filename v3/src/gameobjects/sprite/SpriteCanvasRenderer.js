
var SpriteCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask === this.renderFlags)
    {
        renderer.drawImage(src, camera);
    }
};

module.exports = SpriteCanvasRenderer;
