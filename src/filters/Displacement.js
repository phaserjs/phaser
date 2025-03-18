/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The Displacement Filter Controller.
 *
 * This Filter controller manages the displacement effect.
 *
 * The displacement effect is a visual technique that alters the position of pixels in an image
 * or texture based on the values of a displacement map. This effect is used to create the illusion
 * of depth, surface irregularities, or distortion in otherwise flat elements. It can be applied to
 * characters, objects, or backgrounds to enhance realism, convey movement, or achieve various
 * stylistic appearances.
 *
 * A Displacement effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 *
 * camera.filters.internal.addDisplacement();
 * camera.filters.external.addDisplacement();
 * ```
 *
 * @class Displacement
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Filters.Controller
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that owns this filter.
 * @param {string} [texture='__WHITE'] - The unique string-based key of the texture to use for displacement, which must exist in the Texture Manager.
 * @param {number} [x=0.005] - The amount of horizontal displacement to apply. A very small float number, such as 0.005.
 * @param {number} [y=0.005] - The amount of vertical displacement to apply. A very small float number, such as 0.005.
 */
var Displacement = new Class({
    Extends: Controller,

    initialize: function Displacement (camera, texture, x, y)
    {
        if (texture === undefined) { texture = '__WHITE'; }
        if (x === undefined) { x = 0.005; }
        if (y === undefined) { y = 0.005; }

        Controller.call(this, camera, 'FilterDisplacement');

        /**
         * The amount of horizontal displacement to apply.
         * The maximum horizontal displacement in pixels is `x`
         * multiplied by 0.5 times the width of the camera rendering the filter.
         *
         * @name Phaser.Filters.Displacement#x
         * @type {number}
         * @since 4.0.0
         * @default 0.005
         */
        this.x = x;

        /**
         * The amount of vertical displacement to apply.
         * The maximum vertical displacement in pixels is `y`
         * multiplied by 0.5 times the height of the camera rendering the filter.
         *
         * @name Phaser.Filters.Displacement#y
         * @type {number}
         * @since 4.0.0
         * @default 0.005
         */
        this.y = y;

        /**
         * The underlying texture used for displacement.
         *
         * @name Phaser.Filters.Displacement#texture
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @since 4.0.0
         */
        this.glTexture;

        this.setTexture(texture);
    },

    /**
     * Sets the Texture to be used for the displacement effect.
     *
     * You can only use a whole texture, not a frame from a texture atlas or sprite sheet.
     *
     * @method Phaser.Filters.Displacement#setTexture
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
    },

    getPadding: function ()
    {
        var override = this.paddingOverride;
        if (override)
        {
            this.currentPadding.setTo(override.x, override.y, override.width, override.height);
            return override;
        }

        var camera = this.camera;
        var x = Math.ceil(camera.width * this.x * 0.5);
        var y = Math.ceil(camera.height * this.y * 0.5);

        this.currentPadding.setTo(-x, -y, x * 2, y * 2);

        return this.currentPadding;
    }
});

module.exports = Displacement;
