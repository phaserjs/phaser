/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
*
* @class Phaser.TextureSource
* @constructor
* @param {object} source
* @param {number} scaleMode
*/
Phaser.TextureSource = function (texture, source)
{
    this.texture = texture;

    this.image = source;

    this.compressionAlgorithm = null;

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
    * The scale mode to apply when scaling this texture.
    * NEAREST or DEFAULT
    *
    * @property scaleMode
    * @type {Number}
    * @default Phaser.scaleModes.DEFAULT;
    */
    // this.scaleMode = Phaser.scaleModes.DEFAULT;
    this.scaleMode = Phaser.scaleModes.NEAREST;

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
    * A BaseTexture can be set to skip the rendering phase in the WebGL Sprite Batch.
    *
    * You may want to do this if you have a parent Sprite with no visible texture (i.e. uses the internal `__default` texture)
    * that has children that you do want to render, without causing a batch flush in the process.
    *
    * @property renderable
    * @type Boolean
    */
    this.renderable = true;

    /**
    * @property isPowerOf2
    * @type boolean
    */
    this.isPowerOf2 = Phaser.Math.isPowerOfTwo(this.width, this.height);

    /**
    * @property glTexture
    */
    this.glTexture = null;

    /**
    * The multi texture batching index number.
    * @property glTextureIndex
    * @type Number
    */
    this.glTextureIndex = 0;

    /**
    * The timestamp when this texture was last used by the WebGL renderer.
    * Can be used to purge out 'dead' textures from GPU memory.
    * @property glLastUsed
    * @type Number
    */
    this.glLastUsed = 0;

    /**
    * @property glDirty
    */
    this.glDirty = true;
};
