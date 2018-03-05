var GameObject = require('../GameObject');

var RenderTextureCanvasRenderer = function (renderer, renderTexture, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== renderTexture.renderFlags || (renderTexture.cameraFilter > 0 && (renderTexture.cameraFilter & camera._id)))
    {
        return;
    }

    var ctx = renderer.currentContext;

    if (renderer.currentBlendMode !== renderTexture.blendMode)
    {
        renderer.currentBlendMode = renderTexture.blendMode;
        ctx.globalCompositeOperation = renderer.blendModes[renderTexture.blendMode];
    }

    if (renderer.currentAlpha !== renderTexture.alpha)
    {
        renderer.currentAlpha = renderTexture.alpha;
        ctx.globalAlpha = renderTexture.alpha;
    }

    if (renderer.currentScaleMode !== renderTexture.scaleMode)
    {
        renderer.currentScaleMode = renderTexture.scaleMode;
    }

    var dx = 0;
    var dy = 0;

    var fx = 1;
    var fy = 1;

    if (renderTexture.flipX)
    {
        fx = -1;
        dx -= renderTexture.canvas.width - renderTexture.displayOriginX;
    }
    else
    {
        dx -= renderTexture.displayOriginX;
    }

    if (renderTexture.flipY)
    {
        fy = -1;
        dy -= renderTexture.canvas.height - renderTexture.displayOriginY;
    }
    else
    {
        dy -= renderTexture.displayOriginY;
    }

    ctx.save();
    ctx.translate(renderTexture.x - camera.scrollX * renderTexture.scrollFactorX, renderTexture.y - camera.scrollY * renderTexture.scrollFactorY);
    ctx.rotate(renderTexture.rotation);
    ctx.scale(renderTexture.scaleX, renderTexture.scaleY);
    ctx.scale(fx, fy);
    ctx.drawImage(renderTexture.canvas, dx, dy);
    ctx.restore();
};

module.exports = RenderTextureCanvasRenderer;
