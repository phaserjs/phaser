Phaser.Renderer.WebGL.GameObjects.TileSprite = {

    TYPES: [
        Phaser.GameObject.TileSprite.prototype
    ],

    render: function (renderer, src)
    {
        if (src.visible === false || src.alpha === 0 || src.renderable === false)
        {
            return;
        }

        if (src._mask)
        {
            renderer.spriteBatch.stop();
            renderer.pushMask(src.mask);
            renderer.spriteBatch.start();
        }

        if (src._filters)
        {
            if (!src._mask)
            {
                //  Don't need to do this again if we've already flushed for a mask
                renderer.spriteBatch.flush();
            }

            renderer.filterManager.pushFilter(src._filterBlock);
        }

        if (src.refreshTexture)
        {
            src.generateTilingTexture(true, renderer);

            if (src.tilingTexture)
            {
                if (src.tilingTexture.needsUpdate)
                {
                    src.tilingTexture.baseTexture.textureIndex = src.texture.baseTexture.textureIndex;
                    renderer.updateTexture(src.tilingTexture.baseTexture);
                    src.tilingTexture.needsUpdate = false;
                }
            }
            else
            {
                return;
            }
        }
        
        Phaser.Renderer.WebGL.GameObjects.TileSprite.batchRender(renderer, src);

        //  Render children!
        for (i = 0; i < src.children.length; i++)
        {
            var child = src.children[i];
            child.render(renderer, child);
        }

        var restartBatch = false;

        if (src._filters)
        {
            restartBatch = true;
            renderer.spriteBatch.stop();
            renderer.filterManager.popFilter();
        }

        if (src._mask)
        {
            if (!restartBatch)
            {
                renderer.spriteBatch.stop();
            }

            renderer.popMask(src._mask);
        }

        if (restartBatch)
        {
            renderer.spriteBatch.start();
        }

    },

    batchRender: function (renderer, src)
    {
        var gl = renderer.gl;
        var batch = renderer.spriteBatch;

        var texture = src.tilingTexture;
        var baseTexture = texture.baseTexture;
        var textureIndex = src.texture.baseTexture.textureIndex;

        if (renderer.textureArray[textureIndex] !== baseTexture)
        {
            batch.flush();

            gl.activeTexture(gl.TEXTURE0 + textureIndex);
            gl.bindTexture(gl.TEXTURE_2D, baseTexture._glTextures);

            renderer.textureArray[textureIndex] = baseTexture;
        }

        //  Check texture
        if (batch.currentBatchSize >= batch.size)
        {
            batch.flush();
            batch.currentBaseTexture = texture.baseTexture;
        }

        //  Set the textures UVs temporarily
        if (!src._uvs)
        {
            src._uvs = new PIXI.TextureUvs();
        }

        var uvs = src._uvs;

        var w = texture.baseTexture.width;
        var h = texture.baseTexture.height;

        src.tilePosition.x %= w * src.tileScaleOffset.x;
        src.tilePosition.y %= h * src.tileScaleOffset.y;

        var offsetX = src.tilePosition.x / (w * src.tileScaleOffset.x);
        var offsetY = src.tilePosition.y / (h * src.tileScaleOffset.y);

        var scaleX = (src.width / w) / (src.tileScale.x * src.tileScaleOffset.x);
        var scaleY = (src.height / h) / (src.tileScale.y * src.tileScaleOffset.y);

        uvs.x0 = 0 - offsetX;
        uvs.y0 = 0 - offsetY;

        uvs.x1 = (1 * scaleX) - offsetX;
        uvs.y1 = 0 - offsetY;

        uvs.x2 = (1 * scaleX) - offsetX;
        uvs.y2 = (1 * scaleY) - offsetY;

        uvs.x3 = 0 - offsetX;
        uvs.y3 = (1 * scaleY) - offsetY;

        //  Get the srcs current alpha and tint and combine them into a single color
        var tint = src.tint;
        var color = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16) + (src.worldAlpha * 255 << 24);

        var positions = batch.positions;
        var colors = batch.colors;

        var width = src.width;
        var height = src.height;

        var aX = src.anchor.x;
        var aY = src.anchor.y;
        var w0 = width * (1 - aX);
        var w1 = width * -aX;

        var h0 = height * (1 - aY);
        var h1 = height * -aY;

        var i = batch.currentBatchSize * batch.vertexSize;

        var resolution = texture.baseTexture.resolution;

        var wt = src.worldTransform;

        var a = wt.a / resolution;
        var b = wt.b / resolution;
        var c = wt.c / resolution;
        var d = wt.d / resolution;
        var tx = wt.tx;
        var ty = wt.ty;

        // xy
        positions[i++] = a * w1 + c * h1 + tx;
        positions[i++] = d * h1 + b * w1 + ty;

        // uv
        positions[i++] = uvs.x0;
        positions[i++] = uvs.y0;

        // color
        colors[i++] = color;

        // texture index
        positions[i++] = textureIndex;

        // xy
        positions[i++] = (a * w0 + c * h1 + tx);
        positions[i++] = d * h1 + b * w0 + ty;

        // uv
        positions[i++] = uvs.x1;
        positions[i++] = uvs.y1;

        // color
        colors[i++] = color;

        // texture index
        positions[i++] = textureIndex;

        // xy
        positions[i++] = a * w0 + c * h0 + tx;
        positions[i++] = d * h0 + b * w0 + ty;

        // uv
        positions[i++] = uvs.x2;
        positions[i++] = uvs.y2;

        // color
        colors[i++] = color;

        // texture index
        positions[i++] = textureIndex;

        // xy
        positions[i++] = a * w1 + c * h0 + tx;
        positions[i++] = d * h0 + b * w1 + ty;

        // uv
        positions[i++] = uvs.x3;
        positions[i++] = uvs.y3;

        // color
        colors[i++] = color;

        // texture index
        positions[i++] = textureIndex;

        // increment the batchsize
        batch.sprites[batch.currentBatchSize++] = src;
    }

};
