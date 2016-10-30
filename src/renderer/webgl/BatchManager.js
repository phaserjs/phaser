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
    this.fxBatch = new Phaser.Renderer.WebGL.Batch.FX(this, batchSize);
    this.multiTextureBatch = new Phaser.Renderer.WebGL.Batch.MultiTexture(this, batchSize);
    this.pixelBatch = new Phaser.Renderer.WebGL.Batch.Pixel(this, batchSize);

};

Phaser.Renderer.WebGL.BatchManager.prototype.constructor = Phaser.Renderer.WebGL.BatchManager;

Phaser.Renderer.WebGL.BatchManager.prototype = {

    init: function ()
    {
        this.gl = this.renderer.gl;

        this.imageBatch.init();
        this.fxBatch.init();
        this.multiTextureBatch.init();
        this.pixelBatch.init();

        // this.currentBatch = this.imageBatch;
        // this.currentBatch = this.fxBatch;
        // this.currentBatch = this.multiTextureBatch;
        this.currentBatch = this.pixelBatch;
    },

    start: function ()
    {
        this.currentBatch.start();
    },

    stop: function ()
    {
        this.currentBatch.stop();
    },

    addPixel: function (verts, color)
    {
        //  Check Batch Size and flush if needed
        if (this.currentBatch.size >= this.currentBatch.maxSize)
        {
            this.currentBatch.flush();
        }

        this.pixelBatch.add(verts, color);
    },

    add: function (source, blendMode, verts, uvs, textureIndex, alpha, tintColors, bgColors)
    {
        var hasFlushed = false;

        //  Check Batch Size and flush if needed
        if (this.currentBatch.size >= this.currentBatch.maxSize)
        {
            this.currentBatch.flush();

            hasFlushed = true;
        }

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

        //  Blend Mode?
        if (blendMode !== this.renderer.currentBlendMode)
        {
            if (!hasFlushed)
            {
                this.currentBatch.flush();

                hasFlushed = true;
            }

            this.renderer.setBlendMode(blendMode);
        }

        //  Shader?

        // this.imageBatch.add(verts, uvs, textureIndex, alpha, tintColors, bgColors);
        // this.fxBatch.add(verts, uvs, textureIndex, alpha, tintColors, bgColors);
        // this.multiTextureBatch.add(verts, uvs, textureIndex, alpha, tintColors, bgColors);

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
