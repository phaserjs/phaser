/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.Renderer.Canvas.GameObjects.Sprite = {

    TYPES: [
        Phaser.GameObject.Sprite.prototype
    ],

    render: function (renderer, src)
    {
        var color = src.color;
        var frame = src.frame;
        var source = frame.source;

        //  Skip rendering?

        if (src.skipRender || !src.visible || color.worldAlpha <= 0 || !frame.cutWidth || !frame.cutHeight)
        {
            return;
        }

        //  Blend Mode

        if (renderer.currentBlendMode !== color.blendMode)
        {
            renderer.currentBlendMode = color.blendMode;
            renderer.context.globalCompositeOperation = renderer.blendModes[renderer.currentBlendMode];
        }

        //  Alpha

        if (renderer.currentAlpha !== color.worldAlpha)
        {
            renderer.currentAlpha = color.worldAlpha;
            renderer.context.globalAlpha = color.worldAlpha;
        }

        //  Smoothing (should this be a Game Object, or Frame / Texture level property?)

        if (renderer.currentScaleMode !== source.scaleMode)
        {
            renderer.currentScaleMode = source.scaleMode;
            renderer.context[renderer.smoothProperty] = (source.scaleMode === Phaser.scaleModes.LINEAR);
        }

        var wt = src.transform.world;

        var resolution = source.resolution / renderer.game.resolution;

        var dx = frame.x - (src.anchorX * frame.width);
        var dy = frame.y - (src.anchorY * frame.height);

        var tx = (wt.tx * renderer.game.resolution) + renderer.game.camera._shake.x;
        var ty = (wt.ty * renderer.game.resolution) + renderer.game.camera._shake.y;

        //  Round Pixels

        if (renderer.roundPixels)
        {
            tx |= 0;
            ty |= 0;
            dx |= 0;
            dy |= 0;
        }

        var cw = frame.cutWidth;
        var ch = frame.cutHeight;
        var cwr = cw / resolution;
        var chr = ch / resolution;

        renderer.context.setTransform(wt.a, wt.b, wt.c, wt.d, tx, ty);

        //  Does this Sprite have a mask?

        if (src._mask)
        {
            renderer.pushMask(src._mask);
        }

        //  Color Component

        if (color._hasBackground)
        {
            renderer.context.fillStyle = color._rgba;
            renderer.context.fillRect(dx, dy, cwr, chr);
        }

        renderer.context.drawImage(source.image, frame.cutX, frame.cutY, cw, ch, dx, dy, cwr, chr);

        for (var i = 0; i < src.children.list.length; i++)
        {
            var child = src.children.list[i];

            child.render(renderer, child);
        }

        /*
        //  Move this to either the Renderer, or the Texture Manager, but not here (as it's repeated all over the place)
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
        */

        if (src._mask)
        {
            renderer.popMask();
        }

    }

};
