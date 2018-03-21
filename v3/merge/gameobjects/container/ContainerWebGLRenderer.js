Phaser.Renderer.WebGL.GameObjects.Container = {

    TYPES: [
        Phaser.GameObject.Container.prototype
    ],

    render: function (renderer, src)
    {
        var alpha = src.color.worldAlpha * 255 << 24;

        //  Skip rendering?
        if (src.skipRender || !src.visible || alpha === 0 || src.children.list.length === 0)
        {
            return;
        }

        // if (src._cacheAsBitmap)
        // {
        //     return Phaser.Renderer.WebGL.GameObjects.Container.renderCachedSprite(renderer, src);
        // }
    
        //  Render children
        for (var i = 0; i < src.children.list.length; i++)
        {
            var child = src.children.list[i];

            child.render(renderer, child);
        }

    },

    renderCachedSprite: function (renderer, src)
    {
        //  TODO
        return renderer;
    }

};
