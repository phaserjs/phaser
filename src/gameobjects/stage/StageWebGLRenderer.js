/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.WebGL.GameObjects.Stage = {

    TYPES: [
        Phaser.Stage.prototype
    ],

    render: function (renderer, src)
    {
        if (!src.visible || src.alpha === 0 || src.children.list.length === 0)
        {
            return;
        }

        for (var i = 0; i < src.children.list.length; i++)
        {
            var child = src.children.list[i];

            child.render(renderer, child);
        }

        /*
        var i;

        if (src._mask || src._filters)
        {
            // push filter first as we need to ensure the stencil buffer is correct for any masking
            if (src._filters)
            {
                renderer.spriteBatch.flush();
                renderer.filterManager.pushFilter(src._filterBlock);
            }

            if (src._mask)
            {
                renderer.spriteBatch.stop();
                renderer.pushMask(src.mask);
                renderer.spriteBatch.start();
            }

            // simple render children!
            for (i = 0; i < src.children.length; i++)
            {
                var child = src.children[i];
                child.render(renderer, child);
            }

            renderer.spriteBatch.stop();

            if (src._mask)
            {
                renderer.popMask(src._mask);
            }

            if (src._filters)
            {
                renderer.filterManager.popFilter();
            }
            
            renderer.spriteBatch.start();
        }
        else
        {
            // simple render children!
            for (i = 0; i < src.children.length; i++)
            {
                var child = src.children[i];
                child.render(renderer, child);
            }
        }
        */

    }

};
