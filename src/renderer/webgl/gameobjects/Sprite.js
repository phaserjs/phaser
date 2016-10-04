/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.WebGL.GameObjects.Sprite = {

    render: function (renderer)
    {
        // If the sprite is not visible or the alpha is 0 then no need to render this element
        if (!this.visible || this.alpha === 0 || !this.renderable)
        {
            return;
        }

        // Add back in: || src.texture.crop.width <= 0 || src.texture.crop.height <= 0

        var i;

        //  Would be good to get this down to 1 check, or even none.
        if (this._mask || this._filters)
        {
            var spriteBatch = renderer.spriteBatch;

            // push filter first as we need to ensure the stencil buffer is correct for any masking
            if (this._filters)
            {
                spriteBatch.flush();
                renderer.filterManager.pushFilter(this._filterBlock);
            }

            if (this._mask)
            {
                spriteBatch.stop();
                renderer.pushMask(this.mask);
                spriteBatch.start();
            }

            // add this sprite to the batch
            spriteBatch.render(this);

            // now loop through the children and make sure they get rendered
            for (i = 0; i < this.children.length; i++)
            {
                this.children[i].render(renderer);
            }

            // time to stop the sprite batch as either a mask element or a filter draw will happen next
            spriteBatch.stop();

            if (this._mask)
            {
                renderer.popMask(this._mask);
            }

            if (this._filters)
            {
                renderer.filterManager.popFilter();
            }

            spriteBatch.start();
        }
        else
        {
            renderer.spriteBatch.render(this);

            //  Render children!
            for (i = 0; i < this.children.length; i++)
            {
                this.children[i].render(renderSession);
            }
        }
    }

};
