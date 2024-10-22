/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Rectangle = require('../geom/rectangle/Rectangle');

/**
 * @classdesc
 * The Controller for a filter effect.
 *
 * You should not normally create an instance of this class directly, but instead use one of the built-in filters that extend it.
 *
 * @class Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that owns this filter.
 * @param {string} renderNode - The ID of the RenderNode that this filter uses.
 */
var Controller = new Class({
    initialize: function Controller (camera, renderNode)
    {
        /**
         * Toggle this boolean to enable or disable this filter,
         * without removing and adding it from the Game Object.
         *
         * @name Phaser.Filter.Controller#active
         * @type {boolean}
         * @since 3.90.0
         */
        this.active = true;

        /**
         * A reference to the Camera that owns this filter.
         *
         * @name Phaser.Filter.Controller#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @since 3.90.0
         */
        this.camera = camera;

        /**
         * The ID of the RenderNode that this filter uses.
         *
         * @name Phaser.Filter.Controller#renderNode
         * @type {string}
         * @since 3.90.0
         */
        this.renderNode = renderNode;

        /**
         * Padding override. This is on by default. If this is set,
         * the filter will use this padding instead of calculating it.
         * Prefer using `setPaddingOverride` instead of modifying this directly.
         *
         * @name Phaser.Filter.Controller#paddingOverride
         * @type {Phaser.Geom.Rectangle}
         * @since 3.90
         */
        this.paddingOverride = new Rectangle();

        /**
         * The padding currently being used by this filter.
         * This is set and used during rendering using `getPadding`.
         * It is necessary for filters being used in an external list.
         * You should not modify this value directly.
         *
         * @name Phaser.Filter.Controller#currentPadding
         * @type {Phaser.Geom.Rectangle}
         * @since 3.90.0
         */
        this.currentPadding = new Rectangle();

        /**
         * If `true`, this filter will be permitted to draw to the base texture.
         * This can be unwanted if, for example, the filter doesn't actually
         * draw anything.
         * 
         * This is an internal flag used by the renderer.
         * You should not modify this value directly.
         *
         * @name Phaser.Filter.Controller#allowBaseDraw
         * @type {boolean}
         * @since 3.90.0
         * @default true
         * @readonly
         */
        this.allowBaseDraw = true;
    },

    /**
     * Returns the padding required for this filter,
     * and sets `currentPadding` to the result.
     * Most filters don't need extra padding,
     * but some might sample beyond the texture size, such as a blur.
     *
     * The bounds are encoded as a Rectangle.
     * To enlarge the bounds, the top and left values should be negative,
     * and the bottom and right values should be positive.
     *
     * @method Phaser.Filter.Controller#getPadding
     * @since 3.90.0
     * @returns {Phaser.Geom.Rectangle} The padding required by this filter.
     */
    getPadding: function ()
    {
        return this.paddingOverride || this.currentPadding;
    },

    /**
     * Sets the padding override.
     * If this is set, the filter will use this padding instead of calculating them.
     *it Call `setPaddingOverride(null)` to clear the override.
     * Call `setPaddingOverride()` to set the padding to 0.
     *
     * @method Phaser.Filter.Controller#setPaddingOverride
     * @since 3.90.0
     * @param {number|null} [left=0] - The top padding.
     * @param {number} [top=0] - The top padding.
     * @param {number} [right=0] - The right padding.
     * @param {number} [bottom=0] - The bottom padding.
     */
    setPaddingOverride: function (left, top, right, bottom)
    {
        if (left === null)
        {
            this.paddingOverride = null;
            return this;
        }

        if (left === undefined) { left = 0; }
        if (top === undefined) { top = 0; }
        if (right === undefined) { right = 0; }
        if (bottom === undefined) { bottom = 0; }

        this.paddingOverride = new Rectangle(left, top, right - left, bottom - top);

        return this;
    },

    /**
     * Sets the active state of this filter.
     *
     * A disabled filter will not be used.
     *
     * @method Phaser.Filter.Controller#setActive
     * @since 3.90.0
     * @param {boolean} value - `true` to enable this filter, or `false` to disable it.
     * @returns {this} This filter instance.
     */
    setActive: function (value)
    {
        this.active = value;

        return this;
    },

    /**
     * Destroys this Controller and nulls any references it holds.
     *
     * @method Phaser.Filter.Controller#destroy
     * @since 3.90.0
     */
    destroy: function ()
    {
        this.active = false;
        this.renderNode = null;
        this.camera = null;
    }
});

module.exports = Controller;
