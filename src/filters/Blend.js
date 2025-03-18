/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The Blend Filter Controller.
 *
 * This filter controller manages the blend effect for a Camera.
 * A blend effect allows you to apply another texture to the view
 * using a specific blend mode.
 * This supports blend modes not otherwise available in WebGL.
 *
 * A Blend effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 * camera.filters.internal.addBlend();
 * camera.filters.external.addBlend();
 * ```
 *
 * @class Blend
 * @extends Phaser.Filters.Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 * @param {Phaser.Textures.Texture} [texture='__WHITE'] - The texture to apply to the view.
 * @param {Phaser.BlendModes} [blendMode=Phaser.BlendModes.NORMAL] - The blend mode to apply to the view.
 * @param {number} [amount=1] - The amount of the blend effect to apply to the view. At 0, the original image is preserved. At 1, the blend texture is fully applied. The expected range is 0 to 1, but you can go outside that range for different effects.
 * @param {number[]} [color=[1, 1, 1, 1]] - The color to apply to the blend texture. Each value corresponds to a color channel in RGBA. The expected range is 0 to 1, but you can go outside that range for different effects.
 */
var Blend = new Class({
    Extends: Controller,

    initialize: function Blend (camera, texture, blendMode, amount, color)
    {
        if (texture === undefined) { texture = '__WHITE'; }
        if (blendMode === undefined) { blendMode = 0; }
        if (amount === undefined) { amount = 1; }
        if (color === undefined) { color = [ 1, 1, 1, 1 ]; }

        Controller.call(this, camera, 'FilterBlend');

        /**
         * The underlying texture used for the mask.
         *
         * @name Phaser.Filters.Blend#glTexture
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @since 4.0.0
         */
        this.glTexture;

        /**
         * The blend mode to apply to the view.
         * This supports blend modes not otherwise available in WebGL.
         *
         * @name Phaser.Filters.Blend#blendMode
         * @type {Phaser.BlendModes}
         * @since 4.0.0
         * @default Phaser.BlendModes.NORMAL
         */
        this.blendMode = blendMode;

        /**
         * The amount of the blend effect to apply to the view.
         * At 0, the original image is preserved. At 1, the blend texture is fully applied.
         *
         * @name Phaser.Filters.Blend#amount
         * @type {number}
         * @since 4.0.0
         * @default 1
         */
        this.amount = amount;

        /**
         * The color to apply to the blend texture.
         * Each value corresponds to a color channel in RGBA.
         * The expected range is 0 to 1, but you can go outside that range for different effects.
         *
         * @name Phaser.Filters.Blend#color
         * @type {number[]}
         * @since 4.0.0
         * @default [1, 1, 1, 1]
         */
        this.color = color;

        this.setTexture(texture);
    },

    /**
     * Sets the texture used for the blend.
     *
     * @method Phaser.Filters.Blend#setTexture
     * @since 4.0.0
     * @param {string} [texture='__WHITE'] - The unique string-based key of the texture to use for displacement, which must exist in the Texture Manager.
     * @returns {this} This Filter Controller.
     */
    setTexture: function (texture)
    {
        var phaserTexture = this.camera.scene.sys.textures.getFrame(texture);

        if (phaserTexture)
        {
            this.glTexture = phaserTexture.glTexture;
        }

        return this;
    }
});

module.exports = Blend;
