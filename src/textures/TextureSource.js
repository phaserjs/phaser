/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CanvasPool = require('../display/canvas/CanvasPool');
var Class = require('../utils/Class');
var IsSizePowerOfTwo = require('../math/pow2/IsSizePowerOfTwo');
var ScaleModes = require('../renderer/ScaleModes');

/**
 * @classdesc
 * A Texture Source is the encapsulation of the actual source data for a Texture.
 * This is typically an Image Element, loaded from the file system or network, or a Canvas Element.
 *
 * A Texture can contain multiple Texture Sources, which only happens when a multi-atlas is loaded.
 *
 * @class TextureSource
 * @memberof Phaser.Textures
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture this TextureSource belongs to.
 * @param {(HTMLImageElement|HTMLCanvasElement)} source - The source image data.
 * @param {integer} [width] - Optional width of the source image. If not given it's derived from the source itself.
 * @param {integer} [height] - Optional height of the source image. If not given it's derived from the source itself.
 */
var TextureSource = new Class({

    initialize:

    function TextureSource (texture, source, width, height)
    {
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
         * This is either an Image Element, a Canvas Element or a RenderTexture.
         *
         * @name Phaser.Textures.TextureSource#source
         * @type {(HTMLImageElement|HTMLCanvasElement|Phaser.GameObjects.RenderTexture)}
         * @since 3.12.0
         */
        this.source = source;

        /**
         * The image data.
         * This is either an Image element or a Canvas element.
         *
         * @name Phaser.Textures.TextureSource#image
         * @type {(HTMLImageElement|HTMLCanvasElement)}
         * @since 3.0.0
         */
        this.image = source;

        /**
         * Currently un-used.
         *
         * @name Phaser.Textures.TextureSource#compressionAlgorithm
         * @type {integer}
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
         * @type {integer}
         * @since 3.0.0
         */
        this.width = width || source.naturalWidth || source.width || 0;

        /**
         * The height of the source image. If not specified in the constructor it will check
         * the `naturalHeight` and then `height` properties of the source image.
         *
         * @name Phaser.Textures.TextureSource#height
         * @type {integer}
         * @since 3.0.0
         */
        this.height = height || source.naturalHeight || source.height || 0;

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
         * Is the source image a Render Texture?
         *
         * @name Phaser.Textures.TextureSource#isRenderTexture
         * @type {boolean}
         * @since 3.12.0
         */
        this.isRenderTexture = (source.type === 'RenderTexture');

        /**
         * Are the source image dimensions a power of two?
         *
         * @name Phaser.Textures.TextureSource#isPowerOf2
         * @type {boolean}
         * @since 3.0.0
         */
        this.isPowerOf2 = IsSizePowerOfTwo(this.width, this.height);

        /**
         * The WebGL Texture of the source image.
         *
         * @name Phaser.Textures.TextureSource#glTexture
         * @type {?WebGLTexture}
         * @default null
         * @since 3.0.0
         */
        this.glTexture = null;

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
        if (this.renderer)
        {
            if (this.renderer.gl)
            {
                if (this.isCanvas)
                {
                    this.glTexture = this.renderer.canvasToTexture(this.image);
                }
                else if (this.isRenderTexture)
                {
                    this.image = this.source.canvas;
                 
                    this.glTexture = this.renderer.createTextureFromSource(null, this.width, this.height, this.scaleMode);
                }
                else
                {
                    this.glTexture = this.renderer.createTextureFromSource(this.image, this.width, this.height, this.scaleMode);
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
        if (this.renderer.gl && this.isCanvas)
        {
            this.glTexture = this.renderer.canvasToTexture(this.image, this.glTexture);

            //  Update all the Frames using this TextureSource

            /*
            var index = this.texture.getTextureSourceIndex(this);
            
            var frames = this.texture.getFramesFromTextureSource(index, true);

            for (var i = 0; i < frames.length; i++)
            {
                frames[i].glTexture = this.glTexture;
            }
            */
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
            this.renderer.deleteTexture(this.glTexture);
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
