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
Phaser.Texture = function (key, source, scaleMode)
{
    this.key = key;

    /**
    * The source that is used to create the texture.
    * Usually an Image, but can also be a Canvas.
    *
    * @property source
    * @type Image
    */
    this.source = source;

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
    this.width = source.naturalWidth || source.width || 0;

    /**
    * The height of the Texture.
    *
    * @property height
    * @type Number
    * @readOnly
    */
    this.height = source.naturalHeight || source.height || 0;

    /**
    * The scale mode to apply when scaling this texture
    * 
    * @property scaleMode
    * @type {Number}
    * @default PIXI.scaleModes.LINEAR
    */
    this.scaleMode = scaleMode || PIXI.scaleModes.DEFAULT;

    /**
    * Controls if RGB channels should be pre-multiplied by Alpha  (WebGL only)
    *
    * @property premultipliedAlpha
    * @type Boolean
    * @default true
    */
    this.premultipliedAlpha = true;

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
    * A BaseTexture can be set to skip the rendering phase in the WebGL Sprite Batch.
    * 
    * You may want to do this if you have a parent Sprite with no visible texture (i.e. uses the internal `__default` texture)
    * that has children that you do want to render, without causing a batch flush in the process.
    * 
    * @property renderable
    * @type Boolean
    */
    this.renderable = false;

    /**
    * @property isPowerOf2
    * @type boolean
    */
    this.isPowerOf2 = Phaser.Math.isPowerOfTwo(this.width, this.height);

    /**
    * @property {object} frames - Frames
    */
    this.frames = {
        __BASE: new Phaser.TextureFrame(this, '__BASE', 0, 0, this.width, this.height)
    };

    /**
    * @property _dirty
    * @type Array
    * @private
    */
    this._dirty = [ true, true, true, true ];

    /**
    * @property _glTextures
    * @type Array
    * @private
    */
    this._glTextures = [];
    
};

Phaser.Texture.prototype.constructor = Phaser.Texture;

Phaser.Texture.prototype = {

    add: function (name, x, y, width, height)
    {
        var frame = new Phaser.TextureFrame(this, name, x, y, width, height);

        this.frames[name] = frame;

        return frame;
    },

    get: function (name)
    {
        if (name === undefined) { name = '__BASE'; }

        return this.frames[name];

    },

    /**
    * Sets all glTextures to be dirty.
    *
    * @method dirty
    */
    dirty: function ()
    {
        for (var i = 0; i < this._glTextures.length; i++)
        {
            this._dirty[i] = true;
        }
    },

    /**
    * Removes the base texture from the GPU, useful for managing resources on the GPU.
    * A texture is still 100% usable and will simply be re-uploaded if there is a sprite on screen that is using it.
    *
    * @method unloadFromGPU
    */
    unloadFromGPU: function ()
    {
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

    /**
    * Destroys this base texture
    *
    * @method destroy
    */
    destroy: function ()
    {
        if (this.source)
        {
            Phaser.CanvasPool.removeByCanvas(this.source);
        }

        this.source = null;

        this.unloadFromGPU();

        //  TODO: Clear out the Frames
    }

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
Phaser.Texture.fromCanvas = function (canvas, scaleMode)
{
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
