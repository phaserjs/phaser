
/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.Canvas.GameObjects.Text = {

    TYPES: [
        Phaser.GameObject.Text.prototype
    ],

    render: function (renderer, src)
    {
        if (src.dirty)
        {
            src.updateText();
            src.dirty = false;
        }

        // If the sprite is not visible or the alpha is 0 then no need to render this element
        if (!src.visible || src.alpha === 0 || !src.renderable)
        {
            return;
        }

        // Add back in: || src.texture.crop.width <= 0 || src.texture.crop.height <= 0

        var wt = src.worldTransform;

        if (src.blendMode !== renderer.currentBlendMode)
        {
            renderer.currentBlendMode = src.blendMode;
            renderer.context.globalCompositeOperation = Phaser.blendModesCanvas[renderer.currentBlendMode];
        }

        //  Check if the texture can be rendered

        if (src._mask)
        {
            renderer.pushMask(src._mask);
        }

        var resolution = src.texture.baseTexture.resolution / renderer.game.resolution;

        renderer.context.globalAlpha = src.worldAlpha;

        //  If smoothingEnabled is supported and we need to change the smoothing property for src texture
        if (renderer.smoothProperty && renderer.currentScaleMode !== src.texture.baseTexture.scaleMode)
        {
            renderer.currentScaleMode = src.texture.baseTexture.scaleMode;
            renderer.context[renderer.smoothProperty] = (renderer.currentScaleMode === Phaser.scaleModes.LINEAR);
        }

        //  If the texture is trimmed we offset by the trim x/y, otherwise we use the frame dimensions
        var dx = (src.texture.trim) ? src.texture.trim.x - src.anchor.x * src.texture.trim.width : src.anchor.x * -src.texture.frame.width;
        var dy = (src.texture.trim) ? src.texture.trim.y - src.anchor.y * src.texture.trim.height : src.anchor.y * -src.texture.frame.height;

        var tx = (wt.tx * renderer.game.resolution) + renderer.game.camera._shake.x;
        var ty = (wt.ty * renderer.game.resolution) + renderer.game.camera._shake.y;

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

        if (src.tint !== 0xFFFFFF)
        {
            if (src.texture.requiresReTint || src.cachedTint !== src.tint)
            {
                src.tintedTexture = PIXI.CanvasTinter.getTintedTexture(src, src.tint);

                src.cachedTint = src.tint;
                src.texture.requiresReTint = false;
            }

            renderer.context.drawImage(src.tintedTexture, 0, 0, cw, ch, dx, dy, cw / resolution, ch / resolution);
        }
        else
        {
            var cx = src.texture.crop.x;
            var cy = src.texture.crop.y;

            renderer.context.drawImage(src.texture.baseTexture.source, cx, cy, cw, ch, dx, dy, cw / resolution, ch / resolution);
        }

        for (var i = 0; i < src.children.length; i++)
        {
            var child = src.children[i];
            child.render(renderer, child);
        }

        if (src._mask)
        {
            renderer.popMask();
        }

    }

};
