/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.Canvas.GameObjects.Container = {

    render: function (renderer)
    {
        if (this.visible === false || this.alpha === 0)
        {
            return;
        }

        if (this._cacheAsBitmap)
        {
            return this.renderCachedSprite(renderer);
        }

        if (this._mask)
        {
            renderer.pushMask(this._mask);
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

    },

    renderCachedSprite: function (renderer)
    {
        //  TODO
        return renderer;
    }

};
