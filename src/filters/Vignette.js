/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var Color = require('../display/color/Color');

/**
 * @classdesc
 * The Vignette Filter Controller.
 *
 * This controller manages the vignette effect for a Camera.
 *
 * The vignette effect is a visual technique where the edges of the screen,
 * or a Game Object, gradually darken or blur,
 * creating a frame-like appearance. This effect is used to draw the player's
 * focus towards the central action or subject, enhance immersion,
 * and provide a cinematic or artistic quality to the game's visuals.
 *
 * This filter supports colored borders, and a limited set of blend modes,
 * to increase its stylistic power.
 *
 * A Vignette effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 *
 * camera.filters.internal.addVignette();
 * camera.filters.external.addVignette();
 * ```
 *
 * @class Vignette
 * @extends Phaser.Filters.Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 * @param {number} [x=0.5] - The horizontal offset of the vignette effect. This value is normalized to the range 0 to 1.
 * @param {number} [y=0.5] - The vertical offset of the vignette effect. This value is normalized to the range 0 to 1.
 * @param {number} [radius=0.5] - The radius of the vignette effect. This value is normalized to the range 0 to 1.
 * @param {number} [strength=0.5] - The strength of the vignette effect.
 * @param {number | string | Phaser.Types.Display.InputColorObject | Phaser.Display.Color} [color=0x000000] - The color of the vignette effect, as a hex code or Color object.
 * @param {number} [blendMode=Phaser.BlendModes.NORMAL] - The blend mode to use with the vignette. Only NORMAL, ADD, MULTIPLY, and SCREEN are supported.
 */
var Vignette = new Class({

    Extends: Controller,

    initialize: function Vignette (camera, x, y, radius, strength, color, blendMode)
    {
        if (x === undefined) { x = 0.5; }
        if (y === undefined) { y = 0.5; }
        if (radius === undefined) { radius = 0.5; }
        if (strength === undefined) { strength = 0.5; }
        if (color === undefined) { color = 0x000000; }
        if (blendMode === undefined) { blendMode = 0; }

        Controller.call(this, camera, 'FilterVignette');

        /**
         * The horizontal offset of the vignette effect. This value is normalized to the range 0 to 1.
         *
         * @name Phaser.Filters.Vignette#x
         * @type {number}
         * @since 4.0.0
         */
        this.x = x;

        /**
         * The vertical offset of the vignette effect. This value is normalized to the range 0 to 1.
         *
         * @name Phaser.Filters.Vignette#y
         * @type {number}
         * @since 4.0.0
         */
        this.y = y;

        /**
         * The radius of the vignette effect. This value is normalized to the range 0 to 1.
         *
         * @name Phaser.Filters.Vignette#radius
         * @type {number}
         * @since 4.0.0
         */
        this.radius = radius;

        /**
         * The strength of the vignette effect. Higher values produce a more
         * intense, opaque vignette overlay at the edges, while lower values
         * produce a subtler, more transparent effect.
         *
         * @name Phaser.Filters.Vignette#strength
         * @type {number}
         * @since 4.0.0
         */
        this.strength = strength;

        /**
         * The color of the vignette effect.
         *
         * @name Phaser.Filters.Vignette#color
         * @type {Phaser.Display.Color}
         * @since 4.0.0
         */
        this.color = new Color();

        /**
         * The blend mode used to combine the vignette color with the input.
         * Note that only NORMAL, ADD, MULTIPLY and SCREEN are supported.
         *
         * @name Phaser.Filters.Vignette#blendMode
         * @type {Phaser.BlendModes}
         * @since 4.0.0
         * @default Phaser.BlendModes.NORMAL
         */
        this.blendMode = blendMode;

        this.setColor(color);
    },

    /**
     * Sets the color of the vignette overlay.
     *
     * @method Phaser.Filters.Vignette#setColor
     * @since 4.0.0
     * @param {number | string | Phaser.Types.Display.InputColorObject | Phaser.Display.Color} color - The color to set. Note that a Color object will be copied, not attached.
     * @return {this} This filter instance.
     */
    setColor: function (color)
    {
        if (typeof color === 'number')
        {
            Color.IntegerToColor(color, this.color);
        }
        else if (typeof color === 'string')
        {
            Color.HexStringToColor(color, this.color);
        }
        else if (color.setTo)
        {
            this.color.setTo(color.red, color.green, color.blue, color.alpha);
        }
        else if (color)
        {
            this.color.setTo(color.r || 0, color.g || 0, color.b || 0, color.a || 255);
        }
        else
        {
            this.color.setTo(0, 0, 0, 255);
        }

        return this;
    }
});

module.exports = Vignette;
