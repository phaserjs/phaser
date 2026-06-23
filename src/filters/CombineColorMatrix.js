/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var ColorMatrix = require('../display/ColorMatrix');
var Texture = require('../textures/Texture');

/**
 * @classdesc
 * The CombineColorMatrix Filter controller.
 *
 * This filter combines color channels from two textures: a base input and a
 * secondary transfer texture. Each source is transformed independently by its
 * own `ColorMatrix` (`colorMatrixSelf` and `colorMatrixTransfer`), and the
 * results are then blended per-channel using configurable addition weights
 * (`additions`) and multiplication weights (`multiplications`). This makes it
 * suitable for a wide range of compositing effects, though its primary use is
 * alpha channel manipulation — for example, using a greyscale transfer texture
 * as a soft mask or applying a brightness-derived alpha to the base image.
 * Use `setupAlphaTransfer` to configure the matrices and weights for common
 * alpha-transfer patterns, or set the `colorMatrixSelf`, `colorMatrixTransfer`,
 * `additions`, and `multiplications` properties directly for custom effects.
 *
 * A CombineColorMatrix filter is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 * camera.filters.internal.addCombineColorMatrix();
 * camera.filters.external.addCombineColorMatrix();
 * ```
 *
 * @class CombineColorMatrix
 * @extends Phaser.Filters.Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 * @param {string | Phaser.Textures.Texture} [texture='__WHITE'] - The texture or texture key to use for the transfer texture.
 */
var CombineColorMatrix = new Class({
    Extends: Controller,

    initialize: function CombineColorMatrix (camera, texture)
    {
        Controller.call(this, camera, 'FilterCombineColorMatrix');

        /**
         * The transfer texture used to provide extra channels.
         *
         * @name Phaser.Filters.CombineColorMatrix#glTexture
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @since 4.0.0
         */
        this.glTexture;

        /**
         * The color matrix which contributes values from the base input.
         *
         * @name Phaser.Filters.CombineColorMatrix#colorMatrixSelf
         * @type {Phaser.Display.ColorMatrix}
         * @since 4.0.0
         */
        this.colorMatrixSelf = new ColorMatrix();

        /**
         * The color matrix which contributes values from the transfer texture.
         *
         * @name Phaser.Filters.CombineColorMatrix#colorMatrixTransfer
         * @type {Phaser.Display.ColorMatrix}
         * @since 4.0.0
         */
        this.colorMatrixTransfer = new ColorMatrix();

        /**
         * Weight of addition for each channel (R, G, B, A).
         * The final output includes values from the self and transfer matrices
         * added together; those values are multiplied by this array.
         * So values of 1 are kept, while values of 0 are discarded.
         *
         * By default, RGB values are added together in the final output.
         *
         * @name Phaser.Filters.CombineColorMatrix#additions
         * @type {number[]}
         * @since 4.0.0
         * @default [ 1, 1, 1, 0 ]
         */
        this.additions = [ 1, 1, 1, 0 ];

        /**
         * Weight of multiplication for each channel (R, G, B, A).
         * The final output includes values from the self and transfer matrices
         * multiplied together; those values are multiplied by this array.
         * So values of 1 are kept, while values of 0 are discarded.
         *
         * By default, alpha values are multiplied together in the final output.
         *
         * @name Phaser.Filters.CombineColorMatrix#multiplications
         * @type {number[]}
         * @since 4.0.0
         * @default [ 0, 0, 0, 1 ]
         */
        this.multiplications = [ 0, 0, 0, 1 ];

        this.setTexture(texture || '__WHITE');
    },

    /**
     * Set the transfer texture. This is used as an extra channel source,
     * transferring its data into the filtered image.
     *
     * @method Phaser.Filters.CombineColorMatrix#setTexture
     * @since 4.0.0
     * @param {string | Phaser.Textures.Texture} texture - The texture or texture key to use for the transfer texture.
     *
     * @return {this} This filter instance.
     */
    setTexture: function (texture)
    {
        var phaserTexture = texture instanceof Texture ? texture : this.camera.scene.sys.textures.getFrame(texture);

        if (phaserTexture)
        {
            this.glTexture = phaserTexture.glTexture;
        }

        return this;
    },

    /**
     * Resets both color matrices and the `additions` and `multiplications`
     * weighting arrays, then applies a preset configuration for alpha transfer
     * — a common use case for this filter. In the preset, RGB channels are
     * combined by addition and the alpha channel is combined by multiplication.
     * The boolean parameters control which color and brightness-to-alpha
     * transformations are applied to each source before blending.
     *
     * @example
     * // Use just the base image, with unified alpha, like Mask.
     * myFilter.setupAlphaTransfer(true, false);
     *
     * @example
     * // Use just the transfer image, with unified alpha,
     * // where the base alpha is derived from inverted base brightness.
     * myFilter.setupAlphaTransfer(false, true, false, false, true);
     *
     * @method Phaser.Filters.CombineColorMatrix#setupAlphaTransfer
     * @since 4.0.0
     * @param {boolean} [colorSelf] - Whether to keep color from the base image.
     * @param {boolean} [colorTransfer] - Whether to keep color from the transfer texture.
     * @param {boolean} [brightnessToAlphaSelf] - Whether to determine the base alpha from the base brightness.
     * @param {boolean} [brightnessToAlphaTransfer] - Whether to determine the transfer alpha from the transfer brightness.
     * @param {boolean} [brightnessToAlphaInverseSelf] - Whether to determine the base alpha from the base brightness, inverted. This overrides `brightnessToAlphaSelf`.
     * @param {boolean} [brightnessToAlphaInverseTransfer] - Whether to determine the transfer alpha from the transfer brightness, inverted. This overrides `brightnessToAlphaTransfer`.
     *
     * @return {this} This filter instance.
     */
    setupAlphaTransfer: function (colorSelf, colorTransfer, brightnessToAlphaSelf, brightnessToAlphaTransfer, brightnessToAlphaInverseSelf, brightnessToAlphaInverseTransfer)
    {
        var s = this.colorMatrixSelf;
        var t = this.colorMatrixTransfer;
        s.reset();
        t.reset();

        this.additions = [ 1, 1, 1, 0 ];
        this.multiplications = [ 0, 0, 0, 1 ];

        if (!colorSelf) { s.black(); }
        if (!colorTransfer) { t.black(); }
        if (brightnessToAlphaInverseSelf) { s.brightnessToAlphaInverse(true); }
        else if (brightnessToAlphaSelf) { s.brightnessToAlpha(true); }
        if (brightnessToAlphaInverseTransfer) { t.brightnessToAlphaInverse(true); }
        else if (brightnessToAlphaTransfer) { t.brightnessToAlpha(true); }
    },

    /**
     * Destroys this filter, releasing all references and resources.
     *
     * @method Phaser.Filters.CombineColorMatrix#destroy
     * @since 4.0.0
     */
    destroy: function ()
    {
        this.colorMatrixSelf = null;
        this.colorMatrixTransfer = null;

        Controller.prototype.destroy.call(this);
    }
});

module.exports = CombineColorMatrix;
