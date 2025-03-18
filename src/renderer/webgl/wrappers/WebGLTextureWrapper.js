/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var IsSizePowerOfTwo = require('../../../math/pow2/IsSizePowerOfTwo');

/**
 * @classdesc
 * Wrapper for a WebGL texture, containing all the information that was used
 * to create it.
 *
 * A WebGLTexture should never be exposed outside the WebGLRenderer,
 * so the WebGLRenderer can handle context loss and other events
 * without other systems having to be aware of it.
 * Always use WebGLTextureWrapper instead.
 *
 * @class WebGLTextureWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 3.80.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer instance that owns this wrapper.
 * @param {number} mipLevel - Mip level of the texture.
 * @param {number} minFilter - Filtering of the texture.
 * @param {number} magFilter - Filtering of the texture.
 * @param {number} wrapT - Wrapping mode of the texture.
 * @param {number} wrapS - Wrapping mode of the texture.
 * @param {number} format - Which format does the texture use.
 * @param {?object} pixels - pixel data.
 * @param {number} width - Width of the texture in pixels.
 * @param {number} height - Height of the texture in pixels.
 * @param {boolean} [pma=true] - Does the texture have premultiplied alpha?
 * @param {boolean} [forceSize=false] - If `true` it will use the width and height passed to this method, regardless of the pixels dimension.
 * @param {boolean} [flipY=true] - Sets the `UNPACK_FLIP_Y_WEBGL` flag the WebGL Texture uses during upload.
 */
var WebGLTextureWrapper = new Class({

    initialize:

    function WebGLTextureWrapper (renderer, mipLevel, minFilter, magFilter, wrapT, wrapS, format, pixels, width, height, pma, forceSize, flipY)
    {
        if (flipY === undefined) { flipY = true; }

        /**
         * The WebGLRenderer this WebGLTexture belongs to.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

        /**
         * The WebGLTexture that this wrapper is wrapping.
         *
         * This property could change at any time.
         * Therefore, you should never store a reference to this value.
         * It should only be passed directly to the WebGL API for drawing.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#webGLTexture
         * @type {?WebGLTexture}
         * @default null
         * @since 3.80.0
         */
        this.webGLTexture = null;

        /**
         * Whether this is used as a RenderTexture.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#isRenderTexture
         * @type {boolean}
         * @default false
         * @since 3.80.0
         */
        this.isRenderTexture = false;

        /**
         * Mip level of the texture.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#mipLevel
         * @type {number}
         * @since 3.80.0
         */
        this.mipLevel = mipLevel;

        /**
         * Filtering of the texture.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#minFilter
         * @type {number}
         * @since 3.80.0
         */
        this.minFilter = minFilter;

        /**
         * Filtering of the texture.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#magFilter
         * @type {number}
         * @since 3.80.0
         */
        this.magFilter = magFilter;

        /**
         * Wrapping mode of the texture.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#wrapT
         * @type {number}
         * @since 3.80.0
         */
        this.wrapT = wrapT;

        /**
         * Wrapping mode of the texture.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#wrapS
         * @type {number}
         * @since 3.80.0
         */
        this.wrapS = wrapS;

        /**
         * Which format does the texture use.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#format
         * @type {number}
         * @since 3.80.0
         */
        this.format = format;

        /**
         * Pixel data. This is the source data used to create the WebGLTexture.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#pixels
         * @type {?object}
         * @since 3.80.0
         */
        this.pixels = pixels;

        /**
         * Width of the texture in pixels.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#width
         * @type {number}
         * @since 3.80.0
         */
        this.width = width;

        /**
         * Height of the texture in pixels.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#height
         * @type {number}
         * @since 3.80.0
         */
        this.height = height;

        /**
         * Does the texture have premultiplied alpha?
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#pma
         * @type {boolean}
         * @since 3.80.0
         */
        this.pma = (pma === undefined || pma === null) ? true : pma;

        /**
         * Whether to use the width and height properties, regardless of pixel dimensions.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#forceSize
         * @type {boolean}
         * @since 3.80.0
         */
        this.forceSize = !!forceSize;

        /**
         * Sets the `UNPACK_FLIP_Y_WEBGL` flag the WebGL Texture uses during upload.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#flipY
         * @type {boolean}
         * @since 3.80.0
         */
        this.flipY = !!flipY;

        /**
         * Metadata for the SpectorJS tool, set if debug is enabled.
         * You should set this via the `spectorMetadata` property,
         * which will update the `__SPECTOR_Metadata` property on the WebGLTexture.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#__SPECTOR_Metadata
         * @type {object}
         * @private
         * @since 3.80.0
         */
        // eslint-disable-next-line camelcase
        this.__SPECTOR_Metadata = {};

        /**
         * The texture unit this texture will be bound to in the current
         * rendering batch.
         *
         * This should be set by the batcher. It is a quick way to tell whether
         * this texture has been included in the batch. If it is -1, it has not.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#batchUnit
         * @type {number}
         * @since 4.0.0
         * @default -1
         */
        this.batchUnit = -1;

        this.createResource();
    },

    /**
     * Creates a WebGLTexture from the given parameters.
     *
     * This is called automatically by the constructor. It may also be
     * called again if the WebGLTexture needs re-creating.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#createResource
     * @since 3.80.0
     */
    createResource: function ()
    {
        var gl = this.renderer.gl;

        if (gl.isContextLost())
        {
            // GL state can't be updated right now.
            // `createResource` will run when the context is restored.
            return;
        }

        if (this.pixels instanceof WebGLTextureWrapper)
        {
            // Use the source texture directly.
            this.webGLTexture = this.pixels.webGLTexture;
            return;
        }

        var texture = gl.createTexture();

        // Set Spector metadata.
        // eslint-disable-next-line camelcase
        texture.__SPECTOR_Metadata = this.__SPECTOR_Metadata;

        // Assign the texture to our wrapper.
        this.webGLTexture = texture;

        this._processTexture();
    },

    /**
     * Resizes the WebGLTexture to the new dimensions.
     * This will destroy the contents of the texture.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#resize
     * @since 4.0.0
     * @param {number} width - The new width of the WebGLTexture.
     * @param {number} height - The new height of the WebGLTexture.
     */
    resize: function (width, height)
    {
        if (this.width === width && this.height === height)
        {
            return;
        }

        this.width = width;
        this.height = height;

        this._processTexture();
    },

    /**
     * Updates the WebGLTexture from an updated source.
     *
     * This should only be used when the source is a Canvas or Video element.
     *
     * Because textures usually change into something complex and unique,
     * this method forces all properties to update without checking.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#update
     * @since 3.80.0
     *
     * @param {?object} source - The source to update the WebGLTexture with.
     * @param {number} width - The new width of the WebGLTexture.
     * @param {number} height - The new height of the WebGLTexture.
     * @param {boolean} flipY - Should the WebGLTexture set `UNPACK_MULTIPLY_FLIP_Y`?
     * @param {number} wrapS - The new wrapping mode for the WebGLTexture.
     * @param {number} wrapT - The new wrapping mode for the WebGLTexture.
     * @param {number} minFilter - The new minification filter for the WebGLTexture.
     * @param {number} magFilter - The new magnification filter for the WebGLTexture.
     * @param {number} format - The new format for the WebGLTexture.
     */
    update: function (source, width, height, flipY, wrapS, wrapT, minFilter, magFilter, format)
    {
        if (width === 0 || height === 0)
        {
            return;
        }

        // Assume that the source might change.
        this.pixels = source;
        this.width = width;
        this.height = height;
        this.flipY = flipY;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.format = format;

        this._processTexture();
    },

    /**
     * Set all parameters of this WebGLTexture per the stored values.
     *
     * @function Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#_processTexture
     * @protected
     * @since 4.0.0
     * @ignore
     */
    _processTexture: function ()
    {
        var gl = this.renderer.gl;

        this.renderer.glTextureUnits.bind(this, 0);
        this.renderer.glWrapper.updateTexturing({
            texturing:
            {
                flipY: this.flipY,
                premultiplyAlpha: this.pma
            }
        });

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);

        var pixels = this.pixels;
        var mipLevel = this.mipLevel;
        var width = this.width;
        var height = this.height;
        var format = this.format;

        var generateMipmap = false;

        if (pixels === null || pixels === undefined)
        {
            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, width, height, 0, format, gl.UNSIGNED_BYTE, null);

            generateMipmap = IsSizePowerOfTwo(width, height);
        }
        else if (pixels.compressed)
        {
            width = pixels.width;
            height = pixels.height;
            generateMipmap = pixels.generateMipmap;

            for (var i = 0; i < pixels.mipmaps.length; i++)
            {
                gl.compressedTexImage2D(gl.TEXTURE_2D, i, pixels.internalFormat, pixels.mipmaps[i].width, pixels.mipmaps[i].height, 0, pixels.mipmaps[i].data);
            }
        }
        else if (pixels instanceof Uint8Array)
        {
            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, width, height, 0, format, gl.UNSIGNED_BYTE, pixels);

            generateMipmap = IsSizePowerOfTwo(width, height);
        }
        else
        {
            if (!this.forceSize)
            {
                width = pixels.width;
                height = pixels.height;
            }

            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, format, gl.UNSIGNED_BYTE, pixels);

            generateMipmap = IsSizePowerOfTwo(width, height);
        }

        if (generateMipmap)
        {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
    },

    /**
     * The `__SPECTOR_Metadata` property of the `WebGLTexture`,
     * used to add extra data to the debug SpectorJS integration.
     *
     * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#spectorMetadata
     * @type {object}
     * @since 3.80.0
     */
    spectorMetadata: {

        get: function ()
        {
            return this.__SPECTOR_Metadata;
        },

        set: function (value)
        {
            // eslint-disable-next-line camelcase
            this.__SPECTOR_Metadata = value;

            // eslint-disable-next-line camelcase
            this.webGLTexture.__SPECTOR_Metadata = value;
        }
    },

    /**
     * Deletes the WebGLTexture from the GPU, if it has not been already.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper#destroy
     * @since 3.80.0
     */
    destroy: function ()
    {
        if (this.webGLTexture === null)
        {
            return;
        }

        if (!(this.pixels instanceof WebGLTextureWrapper))
        {
            // Do not delete a texture that belongs to another wrapper.
            this.renderer.gl.deleteTexture(this.webGLTexture);
        }

        this.pixels = null;
        this.webGLTexture = null;
        this.renderer = null;
    }
});

module.exports = WebGLTextureWrapper;
