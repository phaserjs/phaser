var EffectLayerWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }
    renderer.effectRenderer.renderEffect(src, camera, src.dstRenderTexture, src.width, src.height);
};

module.exports = EffectLayerWebGLRenderer;
 