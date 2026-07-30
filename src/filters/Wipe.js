/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var Texture = require('../textures/Texture');

/**
 * @classdesc
 * The Wipe Filter Controller.
 *
 * This controller manages the wipe effect for a Camera.
 *
 * The wipe or reveal effect is a visual technique that gradually uncovers or conceals elements
 * in the game, such as images, text, or scene transitions. This effect is often used to create
 * a sense of progression, reveal hidden content, or provide a smooth and visually appealing transition
 * between game states.
 *
 * You can set both the direction and the axis of the wipe effect. The following combinations are possible:
 *
 * * left to right: direction 0, axis 0
 * * right to left: direction 1, axis 0
 * * top to bottom: direction 1, axis 1
 * * bottom to top: direction 0, axis 1
 *
 * It is up to you to set the `progress` value yourself, e.g. via a Tween, in order to transition the effect.
 *
 * A Wipe effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 * camera.filters.internal.addWipe();
 * camera.filters.external.addWipe();
 * ```
 *
 * @class Wipe
 * @extends Phaser.Filters.Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 * @param {number} [wipeWidth=0.1] - The width of the wipe effect. This value is normalized in the range 0 to 1.
 * @param {number} [direction=0] - The direction of the wipe effect. Either 0 (left to right, or top to bottom) or 1 (right to left, or bottom to top). Set in conjunction with the axis property.
 * @param {number} [axis=0] - The axis of the wipe effect. Either 0 (X) or 1 (Y). Set in conjunction with the direction property.
 * @param {number} [reveal=0] - Is this a reveal (1) or a wipe (0) effect? Reveal shows the input in wiped areas; wipe shows the input in unwiped areas.
 * @param {string | Phaser.Textures.Texture} [wipeTexture='__DEFAULT'] - Texture or texture key to use where the input texture is not shown. The default texture is blank. Use another texture for a wipe transition.
 */
var Wipe = new Class({
    Extends: Controller,

    initialize: function Wipe (camera, wipeWidth, direction, axis, reveal, wipeTexture)
    {
        if (wipeWidth === undefined)
        {
            wipeWidth = 0.1;
        }

        Controller.call(this, camera, 'FilterWipe');

        /**
         * The progress of the Wipe effect. This value is normalized to the range 0 to 1.
         *
         * Adjust this value to make the wipe transition (e.g. via a Tween).
         *
         * @name Phaser.Filters.Wipe#progress
         * @type {number}
         * @since 4.0.0
         */
        this.progress = 0;

        /**
         * The width of the wipe effect. This value is normalized in the range 0 to 1.
         *
         * @name Phaser.Filters.Wipe#wipeWidth
         * @type {number}
         * @since 4.0.0
         * @default 0.1
         */
        this.wipeWidth = wipeWidth;

        /**
         * The direction of the wipe effect. Either 0 (left to right, or top to bottom) or 1 (right to left, or bottom to top). Set in conjunction with the axis property.
         *
         * @name Phaser.Filters.Wipe#direction
         * @type {number}
         * @since 4.0.0
         */
        this.direction = direction || 0;

        /**
         * The axis of the wipe effect. Either 0 (X) or 1 (Y). Set in conjunction with the direction property.
         *
         * @name Phaser.Filters.Wipe#axis
         * @type {number}
         * @since 4.0.0
         */
        this.axis = axis || 0;

        /**
         * Is this a reveal (1) or a wipe (0) effect?
         * Reveal shows the input in wiped areas;
         * wipe shows the input in unwiped areas.
         *
         * @name Phaser.Filters.Wipe#reveal
         * @type {number}
         * @since 4.0.0
         */
        this.reveal = reveal || 0;

        /**
         * The texture to use where the input is removed.
         * The default texture '__DEFAULT' is blank.
         * Use another texture for a wipe transition.
         *
         * @name Phaser.Filters.Wipe#wipeTexture
         * @type {Phaser.Textures.Texture}
         * @since 4.0.0
         */
        this.wipeTexture = null;

        this.setTexture(wipeTexture);
    },

    /**
     * Set the width of the wipe effect.
     *
     * @method Phaser.Filters.Wipe#setWipeWidth
     * @since 4.0.0
     * @param {number} width - The width of the wipe effect. This value is normalized in the range 0 to 1.
     * @return {this} - This filter instance.
     */
    setWipeWidth: function (width)
    {
        if (width === undefined)
        {
            width = 0.1;
        }
        this.wipeWidth = width;
        return this;
    },

    /**
     * Set the wipe effect to run left to right.
     *
     * @method Phaser.Filters.Wipe#setLeftToRight
     * @since 4.0.0
     * @return {this} - This filter instance.
     */
    setLeftToRight: function ()
    {
        this.direction = 0;
        this.axis = 0;
        return this;
    },

    /**
     * Set the wipe effect to run right to left.
     *
     * @method Phaser.Filters.Wipe#setRightToLeft
     * @since 4.0.0
     * @return {this} - This filter instance.
     */
    setRightToLeft: function ()
    {
        this.direction = 1;
        this.axis = 0;
        return this;
    },

    /**
     * Set the wipe effect to run top to bottom.
     *
     * @method Phaser.Filters.Wipe#setTopToBottom
     * @since 4.0.0
     * @return {this} - This filter instance.
     */
    setTopToBottom: function ()
    {
        this.direction = 1;
        this.axis = 1;
        return this;
    },

    /**
     * Set the wipe effect to run bottom to top.
     *
     * @method Phaser.Filters.Wipe#setBottomToTop
     * @since 4.0.0
     * @return {this} - This filter instance.
     */
    setBottomToTop: function ()
    {
        this.direction = 0;
        this.axis = 1;
        return this;
    },

    /**
     * Configures this filter to run as a wipe effect, where the input is removed
     * as the transition progresses. Also resets `progress` to 0.
     * Use `setRevealEffect` for the opposite behavior.
     *
     * @method Phaser.Filters.Wipe#setWipeEffect
     * @since 4.0.0
     * @return {this} - This filter instance.
     */
    setWipeEffect: function ()
    {
        this.reveal = 0;
        this.progress = 0;
        return this;
    },

    /**
     * Configures this filter to run as a reveal effect, where the input is gradually
     * uncovered as the transition progresses. Also resets the texture to the default
     * blank texture and resets `progress` to 0.
     * Use `setWipeEffect` for the opposite behavior.
     *
     * @method Phaser.Filters.Wipe#setRevealEffect
     * @since 4.0.0
     * @return {this} - This filter instance.
     */
    setRevealEffect: function ()
    {
        this.setTexture();
        this.reveal = 1;
        this.progress = 0;
        return this;
    },


    /**
     * Set the texture to use where the input is removed.
     * The default texture is blank, so the input is just hidden.
     *
     * @method Phaser.Filters.Wipe#setTexture
     * @since 4.0.0
     * @param {string | Phaser.Textures.Texture} [texture='__DEFAULT'] - Texture or texture key to use for regions where the input is removed.
     * @return {this} - This filter instance.
     */
    setTexture: function (texture)
    {
        if (texture === undefined)
        {
            texture = '__DEFAULT';
        }
        if (texture instanceof Texture)
        {
            this.wipeTexture = texture;
        }
        else
        {
            this.wipeTexture = this.camera.scene.sys.textures.get(texture) || this.camera.scene.sys.textures.get('__DEFAULT');
        }
        return this;
    },

    /**
     * Sets the progress of the wipe effect, controlling how far along the transition
     * has advanced. A value of 0 means the transition has not started, and 1 means it
     * is complete. You would typically drive this via a Tween rather than setting it directly.
     *
     * @method Phaser.Filters.Wipe#setProgress
     * @since 4.0.0
     * @param {number} value - Progress, normalized to the range 0-1.
     * @return {this} - This filter instance.
     */
    setProgress: function (value)
    {
        this.progress = value;
        return this;
    }
});

module.exports = Wipe;
