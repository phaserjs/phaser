/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/


Phaser.Renderer.Canvas.GameObjects.Container = {

    TYPES: [
        Phaser.GameObject.Container.prototype
    ],

    render: function (renderer, src)
    {
        //  Skip rendering?

        if (src.visible === false || src.alpha === 0)
        {
            return;
        }

        //  Blend Mode

        if (src.blendMode !== renderer.currentBlendMode)
        {
            renderer.currentBlendMode = src.blendMode;
            renderer.context.globalCompositeOperation = renderer.blendModes[renderer.currentBlendMode];
        }

        //  Alpha (World Alpha?)

        if (src.alpha !== renderer.context.globalAlpha)
        {
            renderer.context.globalAlpha = src.alpha;
        }

        //  Smoothing (should this be a Game Object, or Frame / Texture level property?)

        if (src.scaleMode !== renderer.currentScaleMode)
        {
            renderer.currentScaleMode = src.scaleMode;
            renderer.context[renderer.smoothProperty] = (src.scaleMode === Phaser.scaleModes.LINEAR);
        }

        /*
        if (src._cacheAsBitmap)
        {
            return this.renderCachedSprite(renderer, src);
        }

        if (src._mask)
        {
            renderer.pushMask(src._mask);
        }
        */

        for (var i = 0; i < src.children.list.length; i++)
        {
            var child = src.children.list[i];

            child.render(renderer, child);
        }

        /*
        if (src._mask)
        {
            renderer.popMask();
        }
        */

    },

    renderCachedSprite: function (renderer, src)
    {
        //  TODO
        return src;
    }

};
