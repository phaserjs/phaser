/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.WebGL.GameObjects.Stage = {

    render: function (renderer)
    {
        if (this.visible === false || this.alpha === 0 || this.children.length === 0)
        {
            return;
        }

        var i;

        if (this._mask || this._filters)
        {
            // push filter first as we need to ensure the stencil buffer is correct for any masking
            if (this._filters)
            {
                renderer.spriteBatch.flush();
                renderer.filterManager.pushFilter(this._filterBlock);
            }

            if (this._mask)
            {
                renderer.spriteBatch.stop();
                renderer.pushMask(this.mask);
                renderer.spriteBatch.start();
            }

            // simple render children!
            for (i = 0; i < this.children.length; i++)
            {
                if (!this.children[i].render)
                {
                    console.dir(this.children[i]);
                    debugger;
                }

                this.children[i].render(renderer);
            }

            renderer.spriteBatch.stop();

            if (this._mask)
            {
                renderer.popMask(this._mask);
            }

            if (this._filters)
            {
                renderer.filterManager.popFilter();
            }
            
            renderer.spriteBatch.start();
        }
        else
        {
            // simple render children!
            for (i = 0; i < this.children.length; i++)
            {
                if (!this.children[i].render)
                {
                    console.dir(this.children[i]);
                    debugger;
                }

                this.children[i].render(renderer);
            }
        }

    }

};
