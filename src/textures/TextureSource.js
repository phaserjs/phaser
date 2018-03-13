/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('../const');
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
 * @memberOf Phaser.Textures
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture this TextureSource belongs to.
 * @param {Image|HTMLCanvasElement} source - The source image data.
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
         * @name Phaser.Textures.TextureSource#texture
         * @type {string}
         * @since 3.0.0
         */
        this.texture = texture;

        /**
         * The source image data. This is either an Image Element, or a Canvas Element.
         *
         * @name Phaser.Textures.TextureSource#image
         * @type {Image|HTMLCanvasElement}
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
         * @type {[type]}
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
         * @type {?[type]}
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
        if (game.config.renderType === CONST.WEBGL)
        {
            this.glTexture = game.renderer.createTextureFromSource(this.image, this.width, this.height, this.scaleMode);
        }

        if (game.config.pixelArt)
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
     * @param {Phaser.Textures.FilterMode.LINEAR|Phaser.Textures.FilterMode.NEAREST} filterMode - The Filter Mode.
     */
    setFilter: function (filterMode)
    {
        var game = this.texture.manager.game;

        if (game.config.renderType === CONST.WEBGL)
        {
            game.renderer.setTextureFilter(this.glTexture, filterMode);
        }
    },

    /**
     * Destroys this Texture Source and nulls the source image reference.
     *
     * @method Phaser.Textures.TextureSource#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.texture = null;

        this.image = null;
    }

});

module.exports = TextureSource;
