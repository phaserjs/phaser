/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/


Phaser.Renderer.Canvas.GameObjects.Container = {

    TYPES: [
        Phaser.Group.prototype,
        PIXI.DisplayObjectContainer.prototype
    ],

    render: function (renderer, src)
    {
        if (src.visible === false || src.alpha === 0)
        {
            return;
        }

        if (src._cacheAsBitmap)
        {
            return this.renderCachedSprite(renderer, src);
        }

        if (src._mask)
        {
            renderer.pushMask(src._mask);
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

    },

    renderCachedSprite: function (renderer, src)
    {
        //  TODO
        return src;
    }

};
