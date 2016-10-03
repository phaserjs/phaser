/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession} 
* @private
*/
Phaser.Renderer.Canvas.GameObjects.Container = {

    render: function (renderer, source)
    {
        if (source.visible === false || source.alpha === 0)
        {
            return;
        }

        // if (this._cacheAsBitmap)
        // {
        //     this._renderCachedSprite(renderSession);
        //     return;
        // }

        if (source._mask)
        {
            renderer.pushMask(source._mask);
        }

        for (var i = 0; i < source.children.length; i++)
        {
            var child = source.children[i];

            child.render(renderer, child);
        }

        if (this._mask)
        {
            renderer.popMask();
        }

    },

    renderCache: function (renderer, source)
    {
        //  Do something

        return source;
    }

};
