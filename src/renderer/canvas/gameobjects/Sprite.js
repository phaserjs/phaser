/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession}
* @param {Matrix} [matrix] - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
* @private
*/
Phaser.Renderer.Canvas.GameObjects.Sprite = {

    render: function (renderer, source, matrix)
    {
        // If the sprite is not visible or the alpha is 0 then no need to render this element
        if (!source.visible || source.alpha === 0 || !source.renderable)
        {
            return;
        }

        // Add back in: || src.texture.crop.width <= 0 || src.texture.crop.height <= 0

        //  If they provided an alternative rendering matrix then use it
        var wt = (matrix) ? matrix : source.worldTransform;

        if (source.blendMode !== renderer.currentBlendMode)
        {
            renderer.currentBlendMode = source.blendMode;
            renderer.context.globalCompositeOperation = Phaser.blendModesCanvas[renderer.currentBlendMode];
        }

        //  Check if the texture can be rendered

        if (source._mask)
        {
            renderer.pushMask(source._mask);
        }

        //  Ignore null sources
        /*
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
        */

        var resolution = source.texture.baseTexture.resolution / renderer.game.resolution;

        renderer.context.globalAlpha = source.worldAlpha;

        //  If smoothingEnabled is supported and we need to change the smoothing property for src texture
        if (renderer.smoothProperty && renderer.currentScaleMode !== source.texture.baseTexture.scaleMode)
        {
            renderer.currentScaleMode = source.texture.baseTexture.scaleMode;
            renderer.context[renderer.smoothProperty] = (renderer.currentScaleMode === Phaser.scaleModes.LINEAR);
        }

        //  If the texture is trimmed we offset by the trim x/y, otherwise we use the frame dimensions
        var dx = (source.texture.trim) ? source.texture.trim.x - source.anchor.x * source.texture.trim.width : source.anchor.x * -source.texture.frame.width;
        var dy = (source.texture.trim) ? source.texture.trim.y - source.anchor.y * source.texture.trim.height : source.anchor.y * -source.texture.frame.height;

        var tx = (wt.tx * renderer.game.resolution) + renderer.game.camera._shake.x;
        var ty = (wt.ty * renderer.game.resolution) + renderer.game.camera._shake.y;

        var cw = source.texture.crop.width;
        var ch = source.texture.crop.height;

        if (source.texture.rotated)
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
        if (renderer.roundPixels)
        {
            renderer.context.setTransform(wt.a, wt.b, wt.c, wt.d, tx | 0, ty | 0);
            dx |= 0;
            dy |= 0;
        }
        else
        {
            renderer.context.setTransform(wt.a, wt.b, wt.c, wt.d, tx, ty);
        }

        dx /= resolution;
        dy /= resolution;

        if (source.tint !== 0xFFFFFF)
        {
            if (source.texture.requiresReTint || source.cachedTint !== source.tint)
            {
                source.tintedTexture = PIXI.CanvasTinter.getTintedTexture(source, source.tint);

                source.cachedTint = source.tint;
                source.texture.requiresReTint = false;
            }

            renderer.context.drawImage(source.tintedTexture, 0, 0, cw, ch, dx, dy, cw / resolution, ch / resolution);
        }
        else
        {
            var cx = source.texture.crop.x;
            var cy = source.texture.crop.y;

            renderer.context.drawImage(source.texture.baseTexture.source, cx, cy, cw, ch, dx, dy, cw / resolution, ch / resolution);
        }

        for (var i = 0; i < source.children.length; i++)
        {
            var child = source.children[i];

            child.render(renderer, child);
        }

        if (source._mask)
        {
            renderer.popMask();
        }

    }

};
