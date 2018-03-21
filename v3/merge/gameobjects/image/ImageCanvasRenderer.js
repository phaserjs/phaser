/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.Renderer.Canvas.GameObjects.Image = {

    TYPES: [
        Phaser.GameObject.Image.prototype
    ],

    render: function (renderer, src)
    {
        var frame = src.frame;
        var source = frame.source;

        //  Skip rendering?

        if (src.skipRender || !src.visible || src.worldAlpha <= 0 || !frame.cutWidth || !frame.cutHeight)
        {
            return;
        }

        //  Blend Mode

        if (renderer.currentBlendMode !== src.blendMode)
        {
            renderer.currentBlendMode = src.blendMode;
            renderer.context.globalCompositeOperation = renderer.blendModes[renderer.currentBlendMode];
        }

        //  Alpha

        if (renderer.currentAlpha !== src.worldAlpha)
        {
            renderer.currentAlpha = src.worldAlpha;
            renderer.context.globalAlpha = src.worldAlpha;
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

        //  Color Component

        if (src.color._hasBackground)
        {
            //  context save?
            renderer.context.fillStyle = src.color._rgba;
            renderer.context.fillRect(dx, dy, cwr, chr);
        }

        // renderer.context.drawImage(source.image, frame.cutX, frame.cutY, cw, ch, dx, dy, cw / resolution, ch / resolution);

        //  Test drawing over the top
        // renderer.currentBlendMode = src.blendMode;

        //  TESTS Works fine :)
        if (src.texture.key === 'bunny')
        {
            renderer.context.drawImage(source.image, frame.cutX, frame.cutY, cw, ch, dx, dy, cw / resolution, ch / resolution);
            renderer.context.save();
            // renderer.context.globalCompositeOperation = 'source-in';
            renderer.context.globalCompositeOperation = 'xor';
            renderer.context.beginPath();
            renderer.context.fillStyle = 'rgba(255,0,255,0.5)';
            renderer.context.fillRect(dx, dy, cwr, chr);
            renderer.context.closePath();
            // renderer.context.drawImage(source.image, frame.cutX, frame.cutY, cw, ch, dx, dy, cw / resolution, ch / resolution);
            renderer.context.restore();
            renderer.context.globalCompositeOperation = 'source-over';
        }
        else
        {
            renderer.context.drawImage(source.image, frame.cutX, frame.cutY, cw, ch, dx, dy, cw / resolution, ch / resolution);
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
        */

        /*
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
        */

    }

};
