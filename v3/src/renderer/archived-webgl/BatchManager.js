/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var SingleTextureBatch = require('./batches/SingleTextureBatch');
var MultiTextureBatch = require('./batches/MultiTextureBatch');

/**
* Manages the different WebGL Sprite Batches.
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
var BatchManager = function (renderer, batchSize)
{
    this.renderer = renderer;

    this.gl = null;

    this.currentBatch = null;
    this.spriteBatch = null;

    this.singleTextureBatch = new SingleTextureBatch(this, batchSize);
    this.multiTextureBatch = new MultiTextureBatch(this, batchSize);

    // this.pixelBatch = new Batch.Pixel(this, batchSize);
    // this.fxBatch = new Batch.FX(this, batchSize);
};

BatchManager.prototype.constructor = BatchManager;

BatchManager.prototype = {

    init: function ()
    {
        this.gl = this.renderer.gl;

        this.singleTextureBatch.init();
        this.multiTextureBatch.init();

        // this.pixelBatch.init();
        // this.fxBatch.init();

        if (this.renderer.multiTexture)
        {
            this.currentBatch = this.multiTextureBatch;
            this.spriteBatch = this.multiTextureBatch;
        }
        else
        {
            this.currentBatch = this.singleTextureBatch;
            this.spriteBatch = this.singleTextureBatch;
        }
    },

    start: function ()
    {
        this.currentBatch.start();
    },

    stop: function ()
    {
        this.currentBatch.stop();
    },

    setBatch: function (newBatch)
    {
        if (this.currentBatch.type === newBatch.type)
        {
            return false;
        }

        //  Flush whatever was in the current batch (if anything)
        this.currentBatch.flush();

        this.currentBatch = newBatch;

        this.currentBatch.start(true);

        return true;
    },

    //  Add a new entry into the current sprite batch
    add: function (source, blendMode, verts, uvs, textureIndex, alpha, tintColors, bgColors)
    {
        //  Set the current batch (if different from this one)
        var hasFlushed = this.setBatch(this.spriteBatch);

        //  Check Batch Size and flush if needed
        if (!hasFlushed && this.spriteBatch.size >= this.spriteBatch.maxSize)
        {
            this.spriteBatch.flush();

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
            // console.log('setCurrentTexture to', source.glTextureIndex);
            // console.log(source.image.currentSrc);
            this.setCurrentTexture(source);
        }

        //  Blend Mode?
        if (blendMode !== this.renderer.currentBlendMode)
        {
            if (!hasFlushed)
            {
                this.spriteBatch.flush();
            }

            this.renderer.setBlendMode(blendMode);
        }

        this.spriteBatch.add(verts, uvs, textureIndex, alpha, tintColors, bgColors);
    },

    addCustomShader: function ()
    {
        //  TODO
    },

    addFX: function ()
    {
        //  TODO
    },

    addPixel: function (x0, y0, x1, y1, x2, y2, x3, y3, color)
    {
        var hasFlushed = this.setBatch(this.pixelBatch);

        //  Check Batch Size and flush if needed
        if (!hasFlushed && this.pixelBatch.size >= this.pixelBatch.maxSize)
        {
            this.pixelBatch.flush();
        }

        this.pixelBatch.add(x0, y0, x1, y1, x2, y2, x3, y3, color);
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
        this.singleTextureBatch.destroy();

        this.renderer = null;
        this.gl = null;
    }

};

module.exports = BatchManager;
