/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CanvasPool = require('../display/canvas/CanvasPool');
var Class = require('../utils/Class');
var IsSizePowerOfTwo = require('../math/pow2/IsSizePowerOfTwo');
var ScaleModes = require('../renderer/ScaleModes');
var WebGLTextureWrapper = require('../renderer/webgl/wrappers/WebGLTextureWrapper');

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
 * @param {(HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|Phaser.GameObjects.RenderTexture|Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper|Phaser.Types.Textures.CompressedTextureData|Phaser.Textures.DynamicTexture)} source - The source image data.
 * @param {number} [width] - Optional width of the source image. If not given it's derived from the source itself.
 * @param {number} [height] - Optional height of the source image. If not given it's derived from the source itself.
 * @param {boolean} [flipY=true] - Sets the `UNPACK_FLIP_Y_WEBGL` flag the WebGL Texture uses during upload.
 */
var TextureSource = class {

    constructor(texture, source, width, height, flipY)
    {
        if (flipY === undefined) { flipY = true; }

        var game = texture.manager.game;

        /**
         * A reference to the Canvas or WebGL Renderer.
         *
         * @name Phaser.Textures.TextureSource#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.7.0
         */
        this.renderer = game.renderer;

        /**
         * The Texture this TextureSource instance belongs to.
         *
         * @name Phaser.Textures.TextureSource#texture
         * @type {Phaser.Textures.Texture}
         * @since 3.0.0
         */
        this.texture = texture;

        /**
         * The source of the image data.
         *
         * This is either an Image Element, a Canvas Element, a Video Element, a RenderTexture or a WebGLTextureWrapper.
         *
         * In Phaser 3.60 and above it can also be a Compressed Texture data object.
         *
         * @name Phaser.Textures.TextureSource#source
         * @type {(HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|Phaser.GameObjects.RenderTexture|Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper|Phaser.Types.Textures.CompressedTextureData|Phaser.Textures.DynamicTexture)}
         * @since 3.12.0
         */
        this.source = source;

        /**
         * The image data.
         *
         * This is either an Image element, Canvas element, Video Element, or Uint8Array.
         *
         * @name Phaser.Textures.TextureSource#image
         * @type {(HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|Uint8Array)}
         * @since 3.0.0
         */
        this.image = (source.compressed) ? null : source;

        /**
         * Holds the compressed textured algorithm, or `null` if it's not a compressed texture.
         *
         * Prior to Phaser 3.60 this value always held `null`.
         *
         * @name Phaser.Textures.TextureSource#compressionAlgorithm
         * @type {number}
         * @default null
         * @since 3.0.0
         */
        this.compressionAlgorithm = (source.compressed) ? source.format : null;

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
        this.isRenderTexture = (source.type === 'RenderTexture' || source.type === 'DynamicTexture');

        /**
         * Is the source image a WebGLTextureWrapper?
         *
         * @name Phaser.Textures.TextureSource#isGLTexture
         * @type {boolean}
         * @since 3.19.0
         */
        this.isGLTexture = source instanceof WebGLTextureWrapper;

        /**
         * Are the source image dimensions a power of two?
         *
         * @name Phaser.Textures.TextureSource#isPowerOf2
         * @type {boolean}
         * @since 3.0.0
         */
        this.isPowerOf2 = IsSizePowerOfTwo(this.width, this.height);

        /**
         * The wrapped WebGL Texture of the source image.
         * If this TextureSource is driven from a WebGLTexture already,
         * then this wrapper contains a reference to that WebGLTexture.
         *
         * @name Phaser.Textures.TextureSource#glTexture
         * @type {?Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @default null
         * @since 3.0.0
         */
        this.glTexture = null;

        /**
         * Sets the `UNPACK_FLIP_Y_WEBGL` flag the WebGL Texture uses during upload.
         *
         * @name Phaser.Textures.TextureSource#flipY
         * @type {boolean}
         * @since 3.20.0
         */
        this.flipY = flipY;

        this.init(game);
    }

    /**
     * Creates a WebGL Texture, if required, and sets the Texture filter mode.
     *
     * @method Phaser.Textures.TextureSource#init
     * @since 3.0.0
     *
     * @param {Phaser.Game} game - A reference to the Phaser Game instance.
     */
    init(game)
    {
        var renderer = this.renderer;

        if (renderer)
        {
            var source = this.source;

            if (renderer.gl)
            {
                var image = this.image;
                var flipY = this.flipY;
                var width = this.width;
                var height = this.height;
                var scaleMode = this.scaleMode;

                if (this.isCanvas)
                {
                    this.glTexture = renderer.createCanvasTexture(image, false, flipY);
                }
                else if (this.isVideo)
                {
                    this.glTexture = renderer.createVideoTexture(image, false, flipY);
                }
                else if (this.isRenderTexture)
                {
                    this.glTexture = renderer.createTextureFromSource(null, width, height, scaleMode, undefined, flipY);
                }
                else if (this.isGLTexture)
                {
                    this.glTexture = source;
                }
                else if (this.compressionAlgorithm)
                {
                    this.glTexture = renderer.createTextureFromSource(source, undefined, undefined, scaleMode, undefined, flipY);
                }
                else if (source instanceof Uint8Array)
                {
                    this.glTexture = renderer.createUint8ArrayTexture(source, width, height, scaleMode, undefined, flipY);
                }
                else
                {
                    this.glTexture = renderer.createTextureFromSource(image, width, height, scaleMode, undefined, flipY);
                }

                if (typeof WEBGL_DEBUG)
                {
                    this.glTexture.spectorMetadata = { textureKey: this.texture.key };
                }
            }
            else if (this.isRenderTexture)
            {
                this.image = source.canvas;
            }
        }

        if (!game.config.antialias)
        {
            this.setFilter(1);
        }
    }

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
    setFilter(filterMode)
    {
        if (this.renderer && this.renderer.gl)
        {
            this.renderer.setTextureFilter(this.glTexture, filterMode);
        }

        this.scaleMode = filterMode;
    }

    /**
     * Sets the `UNPACK_FLIP_Y_WEBGL` flag for the WebGL Texture during texture upload.
     *
     * @method Phaser.Textures.TextureSource#setFlipY
     * @since 3.20.0
     *
     * @param {boolean} [value=true] - Should the WebGL Texture be flipped on the Y axis on texture upload or not?
     */
    setFlipY(value)
    {
        if (value === undefined) { value = true; }

        if (value === this.flipY) { return this; }

        this.flipY = value;
        this.update();

        return this;
    }

    /**
     * If this TextureSource is backed by a Canvas and is running under WebGL,
     * it updates the WebGLTexture using the canvas data.
     *
     * @method Phaser.Textures.TextureSource#update
     * @since 3.7.0
     */
    update()
    {
        var renderer = this.renderer;
        var image = this.image;
        var flipY = this.flipY;
        var gl = renderer.gl;

        if (gl)
        {
            var textureWrapper = this.glTexture;
            if (this.isCanvas)
            {
                renderer.updateCanvasTexture(image, textureWrapper, flipY);
            }
            else if (this.isVideo)
            {
                renderer.updateVideoTexture(image, textureWrapper, flipY);
            }
            else
            {
                textureWrapper.update(
                    image,
                    this.width,
                    this.height,
                    flipY,
                    textureWrapper.wrapS,
                    textureWrapper.wrapT,
                    textureWrapper.magFilter,
                    textureWrapper.minFilter,
                    textureWrapper.format
                );
            }
        }
    }

    /**
     * Updates the dimensions of this Texture Source.
     * This is called automatically by game systems which manage textures,
     * such as Text, which renders to a dedicated canvas that changes size.
     *
     * @method Phaser.Textures.TextureSource#updateSize
     * @since 4.0.0
     * @param {number} width - The new width of the source image.
     * @param {number} height - The new height of the source image.
     */
    updateSize(width, height)
    {
        if (this.width === width && this.height === height)
        {
            return;
        }
        this.width = width;
        this.height = height;
        this.isPowerOf2 = IsSizePowerOfTwo(width, height);
    }

    /**
     * Destroys this Texture Source and nulls the references.
     *
     * @method Phaser.Textures.TextureSource#destroy
     * @since 3.0.0
     */
    destroy()
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

};

module.exports = TextureSource;
