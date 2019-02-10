/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BlendModes = require('../../renderer/BlendModes');
var Circle = require('../../geom/circle/Circle');
var CircleContains = require('../../geom/circle/Contains');
var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var Rectangle = require('../../geom/rectangle/Rectangle');
var RectangleContains = require('../../geom/rectangle/Contains');

/**
 * @classdesc
 * A Zone Game Object.
 *
 * A Zone is a non-rendering rectangular Game Object that has a position and size.
 * It has no texture and never displays, but does live on the display list and
 * can be moved, scaled and rotated like any other Game Object.
 *
 * Its primary use is for creating Drop Zones and Input Hit Areas and it has a couple of helper methods
 * specifically for this. It is also useful for object overlap checks, or as a base for your own
 * non-displaying Game Objects.

 * The default origin is 0.5, the center of the Zone, the same as with Game Objects.
 *
 * @class Zone
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {number} [width=1] - The width of the Game Object.
 * @param {number} [height=1] - The height of the Game Object.
 */
var Zone = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Depth,
        Components.GetBounds,
        Components.Origin,
        Components.ScaleMode,
        Components.Transform,
        Components.ScrollFactor,
        Components.Visible
    ],

    initialize:

    function Zone (scene, x, y, width, height)
    {
        if (width === undefined) { width = 1; }
        if (height === undefined) { height = width; }

        GameObject.call(this, scene, 'Zone');

        this.setPosition(x, y);

        /**
         * The native (un-scaled) width of this Game Object.
         *
         * @name Phaser.GameObjects.Zone#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = width;

        /**
         * The native (un-scaled) height of this Game Object.
         *
         * @name Phaser.GameObjects.Zone#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = height;

        /**
         * The Blend Mode of the Game Object.
         * Although a Zone never renders, it still has a blend mode to allow it to fit seamlessly into
         * display lists without causing a batch flush.
         *
         * @name Phaser.GameObjects.Zone#blendMode
         * @type {integer}
         * @since 3.0.0
         */
        this.blendMode = BlendModes.NORMAL;

        this.updateDisplayOrigin();
    },

    /**
     * The displayed width of this Game Object.
     * This value takes into account the scale factor.
     *
     * @name Phaser.GameObjects.Zone#displayWidth
     * @type {number}
     * @since 3.0.0
     */
    displayWidth: {

        get: function ()
        {
            return this.scaleX * this.width;
        },

        set: function (value)
        {
            this.scaleX = value / this.width;
        }

    },

    /**
     * The displayed height of this Game Object.
     * This value takes into account the scale factor.
     *
     * @name Phaser.GameObjects.Zone#displayHeight
     * @type {number}
     * @since 3.0.0
     */
    displayHeight: {

        get: function ()
        {
            return this.scaleY * this.height;
        },

        set: function (value)
        {
            this.scaleY = value / this.height;
        }

    },

    /**
     * Sets the size of this Game Object.
     *
     * @method Phaser.GameObjects.Zone#setSize
     * @since 3.0.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     * @param {boolean} [resizeInput=true] - If this Zone has a Rectangle for a hit area this argument will resize the hit area as well.
     *
     * @return {Phaser.GameObjects.Zone} This Game Object.
     */
    setSize: function (width, height, resizeInput)
    {
        if (resizeInput === undefined) { resizeInput = true; }

        this.width = width;
        this.height = height;

        if (resizeInput && this.input && this.input.hitArea instanceof Rectangle)
        {
            this.input.hitArea.width = width;
            this.input.hitArea.height = height;
        }

        return this;
    },

    /**
     * Sets the display size of this Game Object.
     * Calling this will adjust the scale.
     *
     * @method Phaser.GameObjects.Zone#setDisplaySize
     * @since 3.0.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     *
     * @return {Phaser.GameObjects.Zone} This Game Object.
     */
    setDisplaySize: function (width, height)
    {
        this.displayWidth = width;
        this.displayHeight = height;

        return this;
    },

    /**
     * Sets this Zone to be a Circular Drop Zone.
     * The circle is centered on this Zones `x` and `y` coordinates.
     *
     * @method Phaser.GameObjects.Zone#setCircleDropZone
     * @since 3.0.0
     *
     * @param {number} radius - The radius of the Circle that will form the Drop Zone.
     *
     * @return {Phaser.GameObjects.Zone} This Game Object.
     */
    setCircleDropZone: function (radius)
    {
        return this.setDropZone(new Circle(0, 0, radius), CircleContains);
    },

    /**
     * Sets this Zone to be a Rectangle Drop Zone.
     * The rectangle is centered on this Zones `x` and `y` coordinates.
     *
     * @method Phaser.GameObjects.Zone#setRectangleDropZone
     * @since 3.0.0
     *
     * @param {number} width - The width of the rectangle drop zone.
     * @param {number} height - The height of the rectangle drop zone.
     *
     * @return {Phaser.GameObjects.Zone} This Game Object.
     */
    setRectangleDropZone: function (width, height)
    {
        return this.setDropZone(new Rectangle(0, 0, width, height), RectangleContains);
    },

    /**
     * Allows you to define your own Geometry shape to be used as a Drop Zone.
     *
     * @method Phaser.GameObjects.Zone#setDropZone
     * @since 3.0.0
     *
     * @param {object} shape - A Geometry shape instance, such as Phaser.Geom.Ellipse, or your own custom shape.
     * @param {HitAreaCallback} callback - A function that will return `true` if the given x/y coords it is sent are within the shape.
     *
     * @return {Phaser.GameObjects.Zone} This Game Object.
     */
    setDropZone: function (shape, callback)
    {
        if (shape === undefined)
        {
            this.setRectangleDropZone(this.width, this.height);
        }
        else if (!this.input)
        {
            this.setInteractive(shape, callback, true);
        }

        return this;
    },

    /**
     * A NOOP method so you can pass a Zone to a Container.
     * Calling this method will do nothing. It is intentionally empty.
     *
     * @method Phaser.GameObjects.Zone#setAlpha
     * @private
     * @since 3.11.0
     */
    setAlpha: function ()
    {
    },
    
    /**
     * A NOOP method so you can pass a Zone to a Container in Canvas.
     * Calling this method will do nothing. It is intentionally empty.
     *
     * @method Phaser.GameObjects.Zone#setBlendMode
     * @private
     * @since 3.16.2
     */
    setBlendMode: function ()
    {
    },

    /**
     * A Zone does not render.
     *
     * @method Phaser.GameObjects.Zone#renderCanvas
     * @private
     * @since 3.0.0
     */
    renderCanvas: function ()
    {
    },

    /**
     * A Zone does not render.
     *
     * @method Phaser.GameObjects.Zone#renderWebGL
     * @private
     * @since 3.0.0
     */
    renderWebGL: function ()
    {
    }

});

module.exports = Zone;
