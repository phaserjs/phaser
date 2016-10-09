/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.Renderer.Canvas.GameObjects.TileSprite = {

    TYPES: [
        Phaser.GameObject.TileSprite.prototype
    ],

    render: function (renderer, src)
    {
        // If the sprite is not visible or the alpha is 0 then no need to render this element
        if (!src.visible || src.alpha === 0 || !src.renderable)
        {
            return;
        }

        var context = renderer.context;

        if (src._mask)
        {
            renderer.pushMask(src._mask);
        }

        context.globalAlpha = src.worldAlpha;

        var resolution = renderer.resolution;
        
        var wt = src.worldTransform;
        var tx = (wt.tx * resolution) + renderer.game.camera._shake.x;
        var ty = (wt.ty * resolution) + renderer.game.camera._shake.y;

        context.setTransform(wt.a * resolution, wt.b * resolution, wt.c * resolution, wt.d * resolution, tx, ty);

        if (src.refreshTexture)
        {
            src.generateTilingTexture(false, renderer);
        
            if (src.tilingTexture)
            {
                src.tilePattern = context.createPattern(src.tilingTexture.baseTexture.source, 'repeat');
            }
            else
            {
                return;
            }
        }

        var sessionBlendMode = renderer.currentBlendMode;

        //  Check blend mode
        if (src.blendMode !== renderer.currentBlendMode)
        {
            renderer.currentBlendMode = src.blendMode;

            context.globalCompositeOperation = renderer.blendModes[renderer.currentBlendMode];
        }

        var tilePosition = src.tilePosition;
        var tileScale = src.tileScale;

        tilePosition.x %= src.tilingTexture.baseTexture.width;
        tilePosition.y %= src.tilingTexture.baseTexture.height;

        //  Translate
        context.scale(tileScale.x, tileScale.y);
        context.translate(tilePosition.x + (src.anchor.x * -src._width), tilePosition.y + (src.anchor.y * -src._height));

        context.fillStyle = src.tilePattern;

        tx = -tilePosition.x;
        ty = -tilePosition.y;

        var tw = src._width / tileScale.x;
        var th = src._height / tileScale.y;

        //  Allow for pixel rounding
        if (renderer.roundPixels)
        {
            tx |= 0;
            ty |= 0;
            tw |= 0;
            th |= 0;
        }

        context.fillRect(tx, ty, tw, th);

        //  Translate back again
        context.scale(1 / tileScale.x, 1 / tileScale.y);
        context.translate(-tilePosition.x + (src.anchor.x * src._width), -tilePosition.y + (src.anchor.y * src._height));

        for (var i = 0; i < src.children.length; i++)
        {
            var child = src.children[i];

            child.render(child);
        }

        if (src._mask)
        {
            renderer.popMask();
        }

        //  Reset blend mode
        if (sessionBlendMode !== src.blendMode)
        {
            renderer.currentBlendMode = sessionBlendMode;
            context.globalCompositeOperation = renderer.blendModes[sessionBlendMode];
        }
    }

};
