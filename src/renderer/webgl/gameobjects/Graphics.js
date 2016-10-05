/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.WebGL.GameObjects.Graphics = {

    TYPES: [
        Phaser.Graphics.prototype
    ],

    render: function (renderer, src)
    {
        if (src.visible === false || src.alpha === 0 || src.isMask === true)
        {
            return;
        }

        if (src._cacheAsBitmap)
        {
            if (src.dirty || src.cachedSpriteDirty)
            {
                src._generateCachedSprite();
       
                // we will also need to update the texture on the gpu too!
                src.updateCachedSpriteTexture();

                src.cachedSpriteDirty = false;
                src.dirty = false;
            }

            src._cachedSprite.worldAlpha = src.worldAlpha;

            // PIXI.Sprite.prototype._renderWebGL.call(this._cachedSprite, renderSession);

            return;
        }
        else
        {
            renderer.spriteBatch.stop();
            renderer.setBlendMode(src.blendMode);

            if (src._mask)
            {
                renderer.pushMask(src._mask);
            }

            if (src._filters)
            {
                renderer.filterManager.pushFilter(src._filterBlock);
            }
          
            // check blend mode
            if (src.blendMode !== renderer.spriteBatch.currentBlendMode)
            {
                renderer.spriteBatch.currentBlendMode = src.blendMode;

                var blendModeWebGL = renderer.blendModes[renderer.spriteBatch.currentBlendMode];

                renderer.spriteBatch.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
            }
            
            // check if the webgl graphic needs to be updated
            if (src.webGLDirty)
            {
                src.dirty = true;
                src.webGLDirty = false;
            }
            
            //  Merge with this class
            // PIXI.WebGLGraphics.renderGraphics(this, renderSession);
            
            // only render if it has children!
            if (src.children.length)
            {
                renderer.spriteBatch.start();

                for (var i = 0; i < src.children.length; i++)
                {
                    var child = src.children[i];
                    child.render(renderer, child);
                }

                renderer.spriteBatch.stop();
            }

            if (src._filters)
            {
                renderer.filterManager.popFilter();
            }

            if (src._mask)
            {
                renderer.popMask(src.mask);
            }
              
            renderer.drawCount++;

            renderer.spriteBatch.start();
        }
    }

};
