/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.Canvas.GameObjects.Sprite = {

    render: function (renderer)
    {
        // If the sprite is not visible or the alpha is 0 then no need to render this element
        if (!this.visible || this.alpha === 0 || !this.renderable)
        {
            return;
        }

        // Add back in: || src.texture.crop.width <= 0 || src.texture.crop.height <= 0

        var wt = this.worldTransform;

        if (this.blendMode !== renderer.currentBlendMode)
        {
            renderer.currentBlendMode = this.blendMode;
            renderer.context.globalCompositeOperation = Phaser.blendModesCanvas[renderer.currentBlendMode];
        }

        //  Check if the texture can be rendered

        if (this._mask)
        {
            renderer.pushMask(this._mask);
        }

        //  Ignore null thiss
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

        var resolution = this.texture.baseTexture.resolution / renderer.game.resolution;

        renderer.context.globalAlpha = this.worldAlpha;

        //  If smoothingEnabled is supported and we need to change the smoothing property for src texture
        if (renderer.smoothProperty && renderer.currentScaleMode !== this.texture.baseTexture.scaleMode)
        {
            renderer.currentScaleMode = this.texture.baseTexture.scaleMode;
            renderer.context[renderer.smoothProperty] = (renderer.currentScaleMode === Phaser.scaleModes.LINEAR);
        }

        //  If the texture is trimmed we offset by the trim x/y, otherwise we use the frame dimensions
        var dx = (this.texture.trim) ? this.texture.trim.x - this.anchor.x * this.texture.trim.width : this.anchor.x * -this.texture.frame.width;
        var dy = (this.texture.trim) ? this.texture.trim.y - this.anchor.y * this.texture.trim.height : this.anchor.y * -this.texture.frame.height;

        var tx = (wt.tx * renderer.game.resolution) + renderer.game.camera._shake.x;
        var ty = (wt.ty * renderer.game.resolution) + renderer.game.camera._shake.y;

        var cw = this.texture.crop.width;
        var ch = this.texture.crop.height;

        if (this.texture.rotated)
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

        if (this.tint !== 0xFFFFFF)
        {
            if (this.texture.requiresReTint || this.cachedTint !== this.tint)
            {
                this.tintedTexture = PIXI.CanvasTinter.getTintedTexture(this, this.tint);

                this.cachedTint = this.tint;
                this.texture.requiresReTint = false;
            }

            renderer.context.drawImage(this.tintedTexture, 0, 0, cw, ch, dx, dy, cw / resolution, ch / resolution);
        }
        else
        {
            var cx = this.texture.crop.x;
            var cy = this.texture.crop.y;

            renderer.context.drawImage(this.texture.baseTexture.source, cx, cy, cw, ch, dx, dy, cw / resolution, ch / resolution);
        }

        for (var i = 0; i < this.children.length; i++)
        {
            var child = this.children[i];

            child.render(renderer, child);
        }

        if (this._mask)
        {
            renderer.popMask();
        }

    }

};
