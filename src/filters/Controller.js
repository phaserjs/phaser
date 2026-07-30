/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Rectangle = require('../geom/rectangle/Rectangle');

/**
 * @classdesc
 * The base class for a post-processing filter effect applied to a Camera.
 *
 * Filters are visual effects rendered on top of a Camera's output, such as blur, glow, or color grading.
 * Each filter is managed by a Controller, which holds its configuration and provides padding information to the renderer.
 *
 * You should not normally create an instance of this class directly, but instead use one of the built-in filters that extend it,
 * such as those found in the `Phaser.Filters` namespace.
 *
 * You should not use a Controller for more than one Camera.
 * Create a new instance for each Camera that you wish to apply the filter to.
 * If you share Controllers, and destroy one owner, the Controller will be destroyed.
 *
 * @class Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that owns this filter.
 * @param {string} renderNode - The ID of the RenderNode that this filter uses.
 */
var Controller = new Class({
    initialize: function Controller (camera, renderNode)
    {
        /**
         * Toggle this boolean to enable or disable this filter,
         * without removing it from and re-adding it to the Camera's filter list.
         *
         * @name Phaser.Filters.Controller#active
         * @type {boolean}
         * @since 4.0.0
         */
        this.active = true;

        /**
         * A reference to the Camera that owns this filter.
         *
         * @name Phaser.Filters.Controller#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @since 4.0.0
         */
        this.camera = camera;

        /**
         * The ID of the RenderNode that this filter uses.
         *
         * @name Phaser.Filters.Controller#renderNode
         * @type {string}
         * @since 4.0.0
         */
        this.renderNode = renderNode;

        /**
         * Padding override. This is on by default. If this is set,
         * the filter will use this padding instead of calculating it.
         * Prefer using `setPaddingOverride` instead of modifying this directly.
         *
         * @name Phaser.Filters.Controller#paddingOverride
         * @type {Phaser.Geom.Rectangle}
         * @since 4.0.0
         */
        this.paddingOverride = new Rectangle();

        /**
         * The padding currently being used by this filter.
         * This is read during rendering via `getPadding`, and may be updated by subclass implementations.
         * It is necessary for filters being used in an external list.
         * You should not modify this value directly.
         *
         * @name Phaser.Filters.Controller#currentPadding
         * @type {Phaser.Geom.Rectangle}
         * @since 4.0.0
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
         * @name Phaser.Filters.Controller#allowBaseDraw
         * @type {boolean}
         * @since 4.0.0
         * @default true
         * @readonly
         */
        this.allowBaseDraw = true;

        /**
         * Whether this filter controller will be destroyed when the FilterList
         * that owns it is destroyed. If you enable this, you must ensure that
         * you clean up the filter controller at an appropriate time.
         * This allows you to reuse a controller for multiple objects;
         * this is not recommended unless you know what you're doing.
         * It tends to work best with external filters.
         *
         * @name Phaser.Filters.Controller#ignoreDestroy
         * @type {boolean}
         * @since 4.0.0
         * @default false
         */
        this.ignoreDestroy = false;
    },

    /**
     * Returns the raw padding required for this filter.
     * This is typically not what you want to call; use `getPaddingCeil` instead.
     * Values from this method are not rounded, which can cause quality loss.
     *
     * Override this method when creating a Filter that requires extra room,
     * e.g. a blur or glow effect.
     *
     * @method Phaser.Filters.Controller#getPadding
     * @since 4.0.0
     * @return {Phaser.Geom.Rectangle} The padding required by this filter.
     */
    getPadding: function ()
    {
        return this.paddingOverride || this.currentPadding;
    },

    /**
     * Returns the rounded padding required for this filter.
     *
     * Most filters don't need extra padding,
     * but some may sample beyond the texture boundaries, such as a blur or glow effect.
     *
     * The bounds are encoded as a Rectangle.
     * To enlarge the bounds, the top and left values should be negative,
     * and the bottom and right values should be positive.
     *
     * This method calls `getPadding()` to get the raw padding values,
     * and uses `Math.ceil()` to set the values of `paddingOverride`
     * and `currentPadding`.
     *
     * @method Phaser.Filters.Controller#getPaddingCeil
     * @since 4.1.0
     * @returns {Phaser.Geom.Rectangle} The rounded padding required by this filter.
     */
    getPaddingCeil: function ()
    {
        var padding = this.getPadding();
        var paddingCeil = new Rectangle(
            Math.ceil(padding.x),
            Math.ceil(padding.y),
            Math.ceil(padding.width),
            Math.ceil(padding.height)
        );
        this.currentPadding.setTo(
            paddingCeil.x,
            paddingCeil.y,
            paddingCeil.width,
            paddingCeil.height
        );
        return paddingCeil;
    },

    /**
     * Sets the padding override.
     * If this is set, the filter will use this padding instead of calculating it.
     * Call `setPaddingOverride(null)` to clear the override.
     * Call `setPaddingOverride()` to set the padding to 0.
     *
     * @method Phaser.Filters.Controller#setPaddingOverride
     * @since 4.0.0
     * @param {number|null} [left=0] - The left padding.
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
     * @method Phaser.Filters.Controller#setActive
     * @since 4.0.0
     * @param {boolean} value - `true` to enable this filter, or `false` to disable it.
     * @return {this} This filter instance.
     */
    setActive: function (value)
    {
        this.active = value;

        return this;
    },

    /**
     * Destroys this Controller and nulls any references it holds.
     *
     * @method Phaser.Filters.Controller#destroy
     * @since 4.0.0
     */
    destroy: function ()
    {
        this.active = false;
        this.renderNode = null;
        this.camera = null;
    }
});

module.exports = Controller;
