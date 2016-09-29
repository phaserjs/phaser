/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Texture consists of a source, usually an Image from the Cache, or a Canvas, and a collection
* of Frames. The Frames represent the different areas of the Texture. For example a texture atlas
* may have many Frames, one for each element within the atlas. Where-as a single image would have
* just one frame, that encompasses the whole image.
*
* Textures are managed by the global TextureManager. This is a singleton class that is
* responsible for creating and delivering Textures and their corresponding Frames to Game Objects.
*
* Sprites and other Game Objects get the texture data they need from the TextureManager.
*
* @class Phaser.Texture
* @constructor
* @param {object} source
* @param {number} scaleMode
*/
Phaser.Texture = function (source, scaleMode) {

    /**
    * The Resolution of the texture.
    *
    * @property resolution
    * @type Number
    */
    this.resolution = 1;
    
    /**
    * The width of the Texture.
    *
    * @property width
    * @type Number
    * @readOnly
    */
    this.width = 0;

    /**
    * The height of the Texture.
    *
    * @property height
    * @type Number
    * @readOnly
    */
    this.height = 0;

    /**
    * The scale mode to apply when scaling this texture
    * 
    * @property scaleMode
    * @type {Number}
    * @default PIXI.scaleModes.LINEAR
    */
    this.scaleMode = scaleMode || PIXI.scaleModes.DEFAULT;

    /**
    * The source that is used to create the texture.
    * Usually an Image, but can also be a Canvas.
    *
    * @property source
    * @type Image
    */
    this.source = source;

    /**
    * Controls if RGB channels should be pre-multiplied by Alpha  (WebGL only)
    *
    * @property premultipliedAlpha
    * @type Boolean
    * @default true
    */
    this.premultipliedAlpha = true;

    /**
    * @property _glTextures
    * @type Array
    * @private
    */
    this._glTextures = [];

    /**
    * Set this to true if a mipmap of this texture needs to be generated. This value needs to be set before the texture is used
    * Also the texture must be a power of two size to work
    * 
    * @property mipmap
    * @type {Boolean}
    */
    this.mipmap = false;

    /**
    * The multi texture batching index number.
    * @property textureIndex
    * @type Number
    */
    this.textureIndex = 0;

    /**
    * @property _dirty
    * @type Array
    * @private
    */
    this._dirty = [ true, true, true, true ];

    /**
    * A BaseTexture can be set to skip the rendering phase in the WebGL Sprite Batch.
    * 
    * You may want to do this if you have a parent Sprite with no visible texture (i.e. uses the internal `__default` texture)
    * that has children that you do want to render, without causing a batch flush in the process.
    * 
    * @property skipRender
    * @type Boolean
    */
    this.skipRender = false;

    /**
    * @property _powerOf2
    * @type Boolean
    * @private
    */
    this._powerOf2 = false;

    if (!source)
    {
        return;
    }

    if ((this.source.complete || this.source.getContext) && this.source.width && this.source.height)
    {
        this.width = this.source.naturalWidth || this.source.width;
        this.height = this.source.naturalHeight || this.source.height;
        this._powerOf2 = Phaser.Math.isPowerOfTwo(this.width, this.height);
        this.dirty();
    }
    
};

Phaser.Texture.prototype.constructor = Phaser.Texture;

Phaser.Texture.prototype = {

    /**
     * Forces this BaseTexture to be set as loaded, with the given width and height.
     * Then calls BaseTexture.dirty.
     * Important for when you don't want to modify the source object by forcing in `complete` or dimension properties it may not have.
     *
     * @method forceLoaded
     * @param {number} width - The new width to force the BaseTexture to be.
     * @param {number} height - The new height to force the BaseTexture to be.
     */
    forceLoaded: function(width, height) {

        this.width = width;
        this.height = height;
        this.dirty();

    },

    /**
    * Destroys this base texture
    *
    * @method destroy
    */
    destroy: function() {

        if (this.source)
        {
            Phaser.CanvasPool.removeByCanvas(this.source);
        }

        this.source = null;

        this.unloadFromGPU();

    },

    /**
    * Sets all glTextures to be dirty.
    *
    * @method dirty
    */
    dirty: function() {

        for (var i = 0; i < this._glTextures.length; i++)
        {
            this._dirty[i] = true;
        }

    },

    /**
    * Removes the base texture from the GPU, useful for managing resources on the GPU.
    * Atexture is still 100% usable and will simply be reuploaded if there is a sprite on screen that is using it.
    *
    * @method unloadFromGPU
    */
    unloadFromGPU: function () {

        this.dirty();

        // delete the webGL textures if any.
        for (var i = this._glTextures.length - 1; i >= 0; i--)
        {
            var glTexture = this._glTextures[i];
            var gl = PIXI.glContexts[i];

            if (gl && glTexture)
            {
                gl.deleteTexture(glTexture);
            }
        }

        this._glTextures.length = 0;

        this.dirty();

    },



};

/**
* Helper function that creates a base texture from the given canvas element.
*
* @static
* @method fromCanvas
* @param canvas {Canvas} The canvas element source of the texture
* @param scaleMode {Number} See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @return {BaseTexture}
*/
Phaser.Texture.fromCanvas = function (canvas, scaleMode) {

    if (canvas.width === 0)
    {
        canvas.width = 1;
    }

    if (canvas.height === 0)
    {
        canvas.height = 1;
    }

    return new Phaser.Texture(canvas, scaleMode);

};
