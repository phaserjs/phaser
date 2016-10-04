/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.WebGL.GameObjects.Graphics = {

    render: function (renderer)
    {
        var local = Phaser.Renderer.Canvas.GameObjects.Graphics;

        if (this.visible === false || this.alpha === 0 || this.isMask === true)
        {
            return;
        }

        if (this._cacheAsBitmap)
        {
            if (this.dirty || this.cachedSpriteDirty)
            {
                this._generateCachedSprite();
       
                // we will also need to update the texture on the gpu too!
                this.updateCachedSpriteTexture();

                this.cachedSpriteDirty = false;
                this.dirty = false;
            }

            this._cachedSprite.worldAlpha = this.worldAlpha;

            // PIXI.Sprite.prototype._renderWebGL.call(this._cachedSprite, renderSession);

            return;
        }
        else
        {
            renderer.spriteBatch.stop();
            renderer.setBlendMode(this.blendMode);

            if (this._mask)
            {
                renderer.pushMask(this._mask);
            }

            if (this._filters)
            {
                renderer.filterManager.pushFilter(this._filterBlock);
            }
          
            // check blend mode
            if (this.blendMode !== renderer.spriteBatch.currentBlendMode)
            {
                renderer.spriteBatch.currentBlendMode = this.blendMode;

                var blendModeWebGL = renderer.blendModes[renderer.spriteBatch.currentBlendMode];

                renderer.spriteBatch.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
            }
            
            // check if the webgl graphic needs to be updated
            if (this.webGLDirty)
            {
                this.dirty = true;
                this.webGLDirty = false;
            }
            
            //  Merge with this class
            // PIXI.WebGLGraphics.renderGraphics(this, renderSession);
            
            // only render if it has children!
            if (this.children.length)
            {
                renderer.spriteBatch.start();

                for (var i = 0; i < this.children.length; i++)
                {
                    this.children[i].render(renderer);
                }

                renderer.spriteBatch.stop();
            }

            if (this._filters)
            {
                renderer.filterManager.popFilter();
            }

            if (this._mask)
            {
                renderer.popMask(this.mask);
            }
              
            renderer.drawCount++;

            renderer.spriteBatch.start();
        }
    }

};
