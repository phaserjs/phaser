/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CanvasPool = require('../display/canvas/CanvasPool');
var Class = require('../utils/Class');
var IsSizePowerOfTwo = require('../math/pow2/IsSizePowerOfTwo');
var ScaleModes = require('../renderer/ScaleModes');

/**
 * @classdesc
 * A Texture Source is the encapsulation of the actual source data for a Texture.
 *
 * This is typically an Image Element, loaded from the file system or network, a Canvas Element or a Video Element.
 *
 * A Texture can contain multiple Texture Sources, which only happens when a multi-atlas is loaded.
 *
 * @class TextureSource
 * @memberof Phaser.Textures
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture this TextureSource belongs to.
 * @param {(HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|Phaser.GameObjects.RenderTexture|WebGLTexture)} source - The source image data.
 * @param {number} [width] - Optional width of the source image. If not given it's derived from the source itself.
 * @param {number} [height] - Optional height of the source image. If not given it's derived from the source itself.
 * @param {boolean} [flipY=false] - Sets the `UNPACK_FLIP_Y_WEBGL` flag the WebGL Texture uses during upload.
 */
var TextureSource = new Class({

    initialize:

    function TextureSource (texture, source, width, height, flipY)
    {
        if (flipY === undefined) { flipY = false; }

        var game = texture.manager.game;

        /**
         * The Texture this TextureSource belongs to.
         *
         * @name Phaser.Textures.TextureSource#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.7.0
         */
        this.renderer = game.renderer;

        /**
         * The Texture this TextureSource belongs to.
         *
         * @name Phaser.Textures.TextureSource#texture
         * @type {Phaser.Textures.Texture}
         * @since 3.0.0
         */
        this.texture = texture;

        /**
         * The source of the image data.
         *
         * This is either an Image Element, a Canvas Element, a Video Element, a RenderTexture or a WebGLTexture.
         *
         * @name Phaser.Textures.TextureSource#source
         * @type {(HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|Phaser.GameObjects.RenderTexture|WebGLTexture)}
         * @since 3.12.0
         */
        this.source = source;

        /**
         * The image data.
         *
         * This is either an Image element, Canvas element or a Video Element.
         *
         * @name Phaser.Textures.TextureSource#image
         * @type {(HTMLImageElement|HTMLCanvasElement|HTMLVideoElement)}
         * @since 3.0.0
         */
        this.image = source;

        /**
         * Currently un-used.
         *
         * @name Phaser.Textures.TextureSource#compressionAlgorithm
         * @type {number}
         * @default null
         * @since 3.0.0
         */
        this.compressionAlgorithm = null;

        /**
         * The resolution of the source image.
         *
         * @name Phaser.Textures.TextureSource#resolution
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.resolution = 1;

        /**
         * The width of the source image. If not specified in the constructor it will check
         * the `naturalWidth` and then `width` properties of the source image.
         *
         * @name Phaser.Textures.TextureSource#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = width || source.naturalWidth || source.videoWidth || source.width || 0;

        /**
         * The height of the source image. If not specified in the constructor it will check
         * the `naturalHeight` and then `height` properties of the source image.
         *
         * @name Phaser.Textures.TextureSource#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = height || source.naturalHeight || source.videoHeight || source.height || 0;

        /**
         * The Scale Mode the image will use when rendering.
         * Either Linear or Nearest.
         *
         * @name Phaser.Textures.TextureSource#scaleMode
         * @type {number}
         * @since 3.0.0
         */
        this.scaleMode = ScaleModes.DEFAULT;

        /**
         * Is the source image a Canvas Element?
         *
         * @name Phaser.Textures.TextureSource#isCanvas
         * @type {boolean}
         * @since 3.0.0
         */
        this.isCanvas = (source instanceof HTMLCanvasElement);

        /**
         * Is the source image a Video Element?
         *
         * @name Phaser.Textures.TextureSource#isVideo
         * @type {boolean}
         * @since 3.20.0
         */
        this.isVideo = (window.hasOwnProperty('HTMLVideoElement') && source instanceof HTMLVideoElement);

        /**
         * Is the source image a Render Texture?
         *
         * @name Phaser.Textures.TextureSource#isRenderTexture
         * @type {boolean}
         * @since 3.12.0
         */
        this.isRenderTexture = (source.type === 'RenderTexture');

        /**
         * Is the source image a WebGLTexture?
         *
         * @name Phaser.Textures.TextureSource#isGLTexture
         * @type {boolean}
         * @since 3.19.0
         */
        this.isGLTexture = (window.hasOwnProperty('WebGLTexture') && source instanceof WebGLTexture);

        /**
         * Are the source image dimensions a power of two?
         *
         * @name Phaser.Textures.TextureSource#isPowerOf2
         * @type {boolean}
         * @since 3.0.0
         */
        this.isPowerOf2 = IsSizePowerOfTwo(this.width, this.height);

        /**
         * The WebGL Texture of the source image. If this TextureSource is driven from a WebGLTexture
         * already, then this is a reference to that WebGLTexture.
         *
         * @name Phaser.Textures.TextureSource#glTexture
         * @type {?WebGLTexture}
         * @default null
         * @since 3.0.0
         */
        this.glTexture = null;

        /**
         * The current texture unit index as assigned by the WebGL Renderer.
         * Un-used in canvas. Should be treated as read-only.
         *
         * @name Phaser.Textures.TextureSource#glIndex
         * @type {number}
         * @default 0
         * @since 3.50.0
         */
        this.glIndex = 0;

        /**
         * The counter value when this texture was last assigned an index by the WebGL Renderer.
         * Un-used in canvas. Should be treated as read-only.
         *
         * @name Phaser.Textures.TextureSource#glIndexCounter
         * @type {number}
         * @default -1
         * @since 3.50.0
         */
        this.glIndexCounter = -1;

        /**
         * Sets the `UNPACK_FLIP_Y_WEBGL` flag the WebGL Texture uses during upload.
         *
         * @name Phaser.Textures.TextureSource#flipY
         * @type {boolean}
         * @since 3.20.0
         */
        this.flipY = flipY;

        this.init(game);
    },

    /**
     * Creates a WebGL Texture, if required, and sets the Texture filter mode.
     *
     * @method Phaser.Textures.TextureSource#init
     * @since 3.0.0
     *
     * @param {Phaser.Game} game - A reference to the Phaser Game instance.
     */
    init: function (game)
    {
        var renderer = this.renderer;

        if (renderer)
        {
            if (renderer.gl)
            {
                if (this.isCanvas)
                {
                    this.glTexture = renderer.createCanvasTexture(this.image, false, this.flipY);
                }
                else if (this.isVideo)
                {
                    this.glTexture = renderer.createVideoTexture(this.image, false, this.flipY);
                }
                else if (this.isRenderTexture)
                {
                    this.image = this.source.canvas;

                    this.glTexture = renderer.createTextureFromSource(null, this.width, this.height, this.scaleMode);
                }
                else if (this.isGLTexture)
                {
                    this.glTexture = this.source;
                }
                else
                {
                    this.glTexture = renderer.createTextureFromSource(this.image, this.width, this.height, this.scaleMode);
                }
            }
            else if (this.isRenderTexture)
            {
                this.image = this.source.canvas;
            }
        }

        if (!game.config.antialias)
        {
            this.setFilter(1);
        }
    },

    /**
     * Sets the Filter Mode for this Texture.
     *
     * The mode can be either Linear, the default, or Nearest.
     *
     * For pixel-art you should use Nearest.
     *
     * @method Phaser.Textures.TextureSource#setFilter
     * @since 3.0.0
     *
     * @param {Phaser.Textures.FilterMode} filterMode - The Filter Mode.
     */
    setFilter: function (filterMode)
    {
        if (this.renderer.gl)
        {
            this.renderer.setTextureFilter(this.glTexture, filterMode);
        }

        this.scaleMode = filterMode;
    },

    /**
     * Sets the `UNPACK_FLIP_Y_WEBGL` flag for the WebGL Texture during texture upload.
     *
     * @method Phaser.Textures.TextureSource#setFlipY
     * @since 3.20.0
     *
     * @param {boolean} [value=true] - Should the WebGL Texture be flipped on the Y axis on texture upload or not?
     */
    setFlipY: function (value)
    {
        if (value === undefined) { value = true; }

        this.flipY = value;

        return this;
    },

    /**
     * If this TextureSource is backed by a Canvas and is running under WebGL,
     * it updates the WebGLTexture using the canvas data.
     *
     * @method Phaser.Textures.TextureSource#update
     * @since 3.7.0
     */
    update: function ()
    {
        var gl = this.renderer.gl;

        if (gl && this.isCanvas)
        {
            this.glTexture = this.renderer.updateCanvasTexture(this.image, this.glTexture, this.flipY);
        }
        else if (gl && this.isVideo)
        {
            this.glTexture = this.renderer.updateVideoTexture(this.image, this.glTexture, this.flipY);
        }
    },

    /**
     * Destroys this Texture Source and nulls the references.
     *
     * @method Phaser.Textures.TextureSource#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        if (this.glTexture)
        {
            this.renderer.deleteTexture(this.glTexture, true);
        }

        if (this.isCanvas)
        {
            CanvasPool.remove(this.image);
        }

        this.renderer = null;
        this.texture = null;
        this.source = null;
        this.image = null;
        this.glTexture = null;
    }

});

module.exports = TextureSource;
