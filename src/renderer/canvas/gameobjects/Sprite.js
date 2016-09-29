/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession}
* @param {Matrix} [matrix] - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
* @private
*/
Phaser.CanvasRenderer.GameObjects.Sprite = function (src, renderSession, matrix) {

    // If the sprite is not visible or the alpha is 0 then no need to render this element
    if (!src.visible || src.alpha === 0 || !src.renderable || src.texture.crop.width <= 0 || src.texture.crop.height <= 0)
    {
        return;
    }

    var wt = src.worldTransform;

    //  If they provided an alternative rendering matrix then use it
    if (matrix)
    {
        wt = matrix;
    }

    if (src.blendMode !== renderSession.currentBlendMode)
    {
        renderSession.currentBlendMode = src.blendMode;
        renderSession.context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];
    }

    if (src._mask)
    {
        renderSession.maskManager.pushMask(src._mask, renderSession);
    }

    //  Ignore null sources
    if (!src.texture.valid)
    {
        //  Update the children and leave
        for (var i = 0; i < src.children.length; i++)
        {
            src.children[i]._renderCanvas(renderSession);
        }

        if (src._mask)
        {
            renderSession.maskManager.popMask(renderSession);
        }

        return;
    }

    var resolution = src.texture.baseTexture.resolution / renderSession.resolution;

    renderSession.context.globalAlpha = src.worldAlpha;

    //  If smoothingEnabled is supported and we need to change the smoothing property for src texture
    if (renderSession.smoothProperty && renderSession.scaleMode !== src.texture.baseTexture.scaleMode)
    {
        renderSession.scaleMode = src.texture.baseTexture.scaleMode;
        renderSession.context[renderSession.smoothProperty] = (renderSession.scaleMode === PIXI.scaleModes.LINEAR);
    }

    //  If the texture is trimmed we offset by the trim x/y, otherwise we use the frame dimensions
    var dx = (src.texture.trim) ? src.texture.trim.x - src.anchor.x * src.texture.trim.width : src.anchor.x * -src.texture.frame.width;
    var dy = (src.texture.trim) ? src.texture.trim.y - src.anchor.y * src.texture.trim.height : src.anchor.y * -src.texture.frame.height;

    var tx = (wt.tx * renderSession.resolution) + renderSession.shakeX;
    var ty = (wt.ty * renderSession.resolution) + renderSession.shakeY;

    var cw = src.texture.crop.width;
    var ch = src.texture.crop.height;

    if (src.texture.rotated)
    {
        var a = wt.a;
        var b = wt.b;
        var c = wt.c;
        var d = wt.d;
        var e = cw;
        
        // Offset before rotating
        tx = wt.c * ch + tx;
        ty = wt.d * ch + ty;
        
        // Rotate matrix by 90 degrees
        // We use precalculated values for sine and cosine of rad(90)
        wt.a = a * 6.123233995736766e-17 + -c;
        wt.b = b * 6.123233995736766e-17 + -d;
        wt.c = a + c * 6.123233995736766e-17;
        wt.d = b + d * 6.123233995736766e-17;

        // Update cropping dimensions.
        cw = ch;
        ch = e;
    }

    //  Allow for pixel rounding
    if (renderSession.roundPixels)
    {
        renderSession.context.setTransform(wt.a, wt.b, wt.c, wt.d, tx | 0, ty | 0);
        dx |= 0;
        dy |= 0;
    }
    else
    {
        renderSession.context.setTransform(wt.a, wt.b, wt.c, wt.d, tx, ty);
    }

    dx /= resolution;
    dy /= resolution;

    if (src.tint !== 0xFFFFFF)
    {
        if (src.texture.requiresReTint || src.cachedTint !== src.tint)
        {
            src.tintedTexture = PIXI.CanvasTinter.getTintedTexture(src, src.tint);

            src.cachedTint = src.tint;
            src.texture.requiresReTint = false;
        }

        renderSession.context.drawImage(src.tintedTexture, 0, 0, cw, ch, dx, dy, cw / resolution, ch / resolution);
    }
    else
    {
        var cx = src.texture.crop.x;
        var cy = src.texture.crop.y;

        renderSession.context.drawImage(src.texture.baseTexture.source, cx, cy, cw, ch, dx, dy, cw / resolution, ch / resolution);
    }

    for (var i = 0; i < src.children.length; i++)
    {
        src.children[i]._renderCanvas(renderSession);
    }

    if (src._mask)
    {
        renderSession.maskManager.popMask(renderSession);
    }

};
