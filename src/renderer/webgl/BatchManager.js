/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Manages the different WebGL Sprite Batches.
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.WebGL.BatchManager = function (renderer, batchSize)
{
    this.renderer = renderer;

    this.gl = null;

    this.currentBatch = null;

    this.imageBatch = new Phaser.Renderer.WebGL.Batch.Image(this, batchSize);

    // this.multiTextureBatch = new Phaser.Renderer.WebGL.Batch.Image(this, batchSize);
    // this.pixelBatch = null;
    // this.fxBatch = null;

    // this.currentBatchSize = 0;
    // this.dirty = true;
    // this.list = [];

};

Phaser.Renderer.WebGL.BatchManager.prototype.constructor = Phaser.Renderer.WebGL.BatchManager;

Phaser.Renderer.WebGL.BatchManager.prototype = {

    init: function ()
    {
        console.log('BatchManager.init');

        this.gl = this.renderer.gl;

        this.imageBatch.init();

        this.currentBatch = this.imageBatch;
    },

    start: function ()
    {
        this.currentBatch.start();
    },

    stop: function ()
    {
        this.currentBatch.stop();
    },

    add: function (batch, source)
    {
        //  Check Batch Size and flush if needed, OR if a different batch then swap
        //  Also what about blend mode or shader swaps?
        if (this.currentBatch.size >= this.currentBatch.maxSize)
        {
            this.currentBatch.flush();
        }

        if (source)
        {
            source.glLastUsed = this.renderer.startTime;

            //  Does this TextureSource need updating?
            if (source.glDirty)
            {
                this.renderer.updateTexture(source);
            }

            //  Does the batch need to activate a new texture?
            if (this.renderer.textureArray[source.glTextureIndex] !== source)
            {
                this.setCurrentTexture(source);
            }
        }

        //  Swap Batch check

        //  At this point the game object should call 'add' on the batch it needs (ImageBatch, FXBatch, etc)

    },

    __flush: function ()
    {
        var gl = this.gl;

        //  Always dirty the first pass through but subsequent calls may be clean
        if (this.dirty)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            this.initShader();
        }

        //  Upload the vertex data to the GPU - is this cheaper (overall) than creating a new TypedArray view?
        //  The tradeoff is sending 224KB of data to the GPU every frame, even if most of it is empty should the
        //  batch be only slightly populated, vs. the creation of a new TypedArray view and its corresponding gc every frame.

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);

        /*
        if (this.currentBatchSize > this.halfBatchSize)
        {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        }
        else
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            //  This creates a brand new Typed Array - what's the cost of this vs. just uploading all vert data?
            var view = this.positions.subarray(0, this.currentBatchSize * this.vertSize);

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
        }
        */

        var sprite;

        var start = 0;
        var currentSize = 0;

        //  Rather than keep the sprites in a list, we can simply flush and switch when
        //  we encounter a new one in the add method, then we don't need to track any offsets?
        for (var i = 0; i < this.currentBatchSize; i++)
        {
            sprite = this.list[i];

            if (sprite.blendMode !== this.renderer.currentBlendMode)
            {
                if (currentSize > 0)
                {
                    gl.drawElements(gl.TRIANGLES, currentSize * 6, gl.UNSIGNED_SHORT, start * 6 * 2);
                    this.renderer.drawCount++;

                    //  Reset the batch
                    start = i;
                    currentSize = 0;
                }

                this.renderer.setBlendMode(sprite.blendMode);
            }

            if (sprite.shader === 2)
            {
                gl.drawElements(gl.TRIANGLES, currentSize * 6, gl.UNSIGNED_SHORT, start * 6 * 2);
                this.renderer.drawCount++;

                //  Reset the batch
                start = i;
                currentSize = 0;

                this.initAttributes(this.program2);
                this.initShader();
            }
            else if (sprite.shader === 1)
            {
                gl.drawElements(gl.TRIANGLES, currentSize * 6, gl.UNSIGNED_SHORT, start * 6 * 2);
                this.renderer.drawCount++;

                //  Reset the batch
                start = i;
                currentSize = 0;

                this.initAttributes(this.program);
                this.initShader();
            }

            //  TODO: Check for shader here

            //  If either blend or shader set, we need to drawElements and swap

            currentSize++;
        }

        if (currentSize > 0)
        {
            gl.drawElements(gl.TRIANGLES, currentSize * 6, gl.UNSIGNED_SHORT, start * 6 * 2);
            this.renderer.drawCount++;
        }

        //  Reset the batch
        this.currentBatchSize = 0;
        this._i = 0;

    },

    setCurrentTexture: function (source)
    {
        var gl = this.gl;

        this.currentBatch.flush();

        gl.activeTexture(gl.TEXTURE0 + source.glTextureIndex);

        gl.bindTexture(gl.TEXTURE_2D, source.glTexture);

        this.renderer.textureArray[source.glTextureIndex] = source;
    },

    destroy: function ()
    {
        this.imageBatch.destroy();

        this.renderer = null;
        this.gl = null;
    }

};
