/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.WebGL.GameObjects.Text = {

    TYPES: [
        Phaser.GameObject.Text.prototype
    ],

    render: function (renderer, src)
    {
        if (src.dirty)
        {
            src.updateText();
            src.dirty = false;
        }

        // If the sprite is not visible or the alpha is 0 then no need to render this element
        if (!src.visible || src.alpha === 0 || !src.renderable)
        {
            return;
        }

        // Add back in: || src.texture.crop.width <= 0 || src.texture.crop.height <= 0

        var i;

        //  Would be good to get this down to 1 check, or even none.
        if (src._mask || src._filters)
        {
            var spriteBatch = renderer.spriteBatch;

            // push filter first as we need to ensure the stencil buffer is correct for any masking
            if (src._filters)
            {
                spriteBatch.flush();
                renderer.filterManager.pushFilter(src._filterBlock);
            }

            if (src._mask)
            {
                spriteBatch.stop();
                renderer.pushMask(src.mask);
                spriteBatch.start();
            }

            // add this sprite to the batch
            spriteBatch.render(src);

            // now loop through the children and make sure they get rendered
            for (i = 0; i < src.children.length; i++)
            {
                var child = src.children[i];
                child.render(renderer, child);
            }

            // time to stop the sprite batch as either a mask element or a filter draw will happen next
            spriteBatch.stop();

            if (src._mask)
            {
                renderer.popMask(src._mask);
            }

            if (src._filters)
            {
                renderer.filterManager.popFilter();
            }

            spriteBatch.start();
        }
        else
        {
            renderer.spriteBatch.render(src);

            //  Render children!
            for (i = 0; i < src.children.length; i++)
            {
                var child = src.children[i];
                child.render(renderer, child);
            }
        }

    }

};
