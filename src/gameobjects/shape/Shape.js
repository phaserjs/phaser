/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var Line = require('../../geom/line/Line');

/**
 * @classdesc
 * The Shape Game Object is a base class for the various different shapes, such as the Arc, Star or Polygon.
 * You cannot add a Shape directly to your Scene, it is meant as a base for your own custom Shape classes.
 *
 * @class Shape
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {string} [type] - The internal type of the Shape.
 * @param {any} [data] - The data of the source shape geometry, if any.
 */
var Shape = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.ComputedSize,
        Components.Depth,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.Pipeline,
        Components.ScaleMode,
        Components.ScrollFactor,
        Components.Transform,
        Components.Visible
    ],

    initialize:

    function Shape (scene, type, data)
    {
        if (type === undefined) { type = 'Shape'; }

        GameObject.call(this, scene, type);

        /**
         * The source Shape data. Typically a geometry object.
         * You should not manipulate this directly.
         *
         * @name Phaser.GameObjects.Shape#data
         * @type {any}
         * @readonly
         * @since 3.13.0
         */
        this.geom = data;

        /**
         * Holds the polygon path data for filled rendering.
         *
         * @name Phaser.GameObjects.Shape#pathData
         * @type {number[]}
         * @readonly
         * @since 3.13.0
         */
        this.pathData = [];

        /**
         * Holds the earcut polygon path index data for filled rendering.
         *
         * @name Phaser.GameObjects.Shape#pathIndexes
         * @type {integer[]}
         * @readonly
         * @since 3.13.0
         */
        this.pathIndexes = [];

        /**
         * The fill color used by this Shape.
         *
         * @name Phaser.GameObjects.Shape#fillColor
         * @type {number}
         * @since 3.13.0
         */
        this.fillColor = 0xffffff;

        /**
         * The fill alpha value used by this Shape.
         *
         * @name Phaser.GameObjects.Shape#fillAlpha
         * @type {number}
         * @since 3.13.0
         */
        this.fillAlpha = 1;

        /**
         * The stroke color used by this Shape.
         *
         * @name Phaser.GameObjects.Shape#strokeColor
         * @type {number}
         * @since 3.13.0
         */
        this.strokeColor = 0xffffff;

        /**
         * The stroke alpha value used by this Shape.
         *
         * @name Phaser.GameObjects.Shape#strokeAlpha
         * @type {number}
         * @since 3.13.0
         */
        this.strokeAlpha = 1;

        /**
         * The stroke line width used by this Shape.
         *
         * @name Phaser.GameObjects.Shape#lineWidth
         * @type {number}
         * @since 3.13.0
         */
        this.lineWidth = 1;

        /**
         * Controls if this Shape is filled or not.
         * Note that some Shapes do not support being filled (such as Line shapes)
         *
         * @name Phaser.GameObjects.Shape#isFilled
         * @type {boolean}
         * @since 3.13.0
         */
        this.isFilled = false;

        /**
         * Controls if this Shape is stroked or not.
         * Note that some Shapes do not support being stroked (such as Iso Box shapes)
         *
         * @name Phaser.GameObjects.Shape#isStroked
         * @type {boolean}
         * @since 3.13.0
         */
        this.isStroked = false;

        /**
         * Controls if this Shape path is closed during rendering when stroked.
         * Note that some Shapes are always closed when stroked (such as Ellipse shapes)
         *
         * @name Phaser.GameObjects.Shape#closePath
         * @type {boolean}
         * @since 3.13.0
         */
        this.closePath = true;

        /**
         * Private internal value.
         * A Line used when parsing internal path data to avoid constant object re-creation.
         *
         * @name Phaser.GameObjects.Curve#_tempLine
         * @type {Phaser.Geom.Line}
         * @private
         * @since 3.13.0
         */
        this._tempLine = new Line();

        this.initPipeline();
    },

    /**
     * Sets the fill color and alpha for this Shape.
     * 
     * If you wish for the Shape to not be filled then call this method with no arguments, or just set `isFilled` to `false`.
     * 
     * Note that some Shapes do not support fill colors, such as the Line shape.
     * 
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Shape#setFillStyle
     * @since 3.13.0
     * 
     * @param {number} [color] - The color used to fill this shape. If not provided the Shape will not be filled.
     * @param {number} [alpha=1] - The alpha value used when filling this shape, if a fill color is given.
     *
     * @return {this} This Game Object instance.
     */
    setFillStyle: function (color, alpha)
    {
        if (alpha === undefined) { alpha = 1; }

        if (color === undefined)
        {
            this.isFilled = false;
        }
        else
        {
            this.fillColor = color;
            this.fillAlpha = alpha;
            this.isFilled = true;
        }

        return this;
    },

    /**
     * Sets the stroke color and alpha for this Shape.
     * 
     * If you wish for the Shape to not be stroked then call this method with no arguments, or just set `isStroked` to `false`.
     * 
     * Note that some Shapes do not support being stroked, such as the Iso Box shape.
     * 
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Shape#setStrokeStyle
     * @since 3.13.0
     * 
     * @param {number} [lineWidth] - The width of line to stroke with. If not provided or undefined the Shape will not be stroked.
     * @param {number} [color] - The color used to stroke this shape. If not provided the Shape will not be stroked.
     * @param {number} [alpha=1] - The alpha value used when stroking this shape, if a stroke color is given.
     *
     * @return {this} This Game Object instance.
     */
    setStrokeStyle: function (lineWidth, color, alpha)
    {
        if (alpha === undefined) { alpha = 1; }

        if (lineWidth === undefined)
        {
            this.isStroked = false;
        }
        else
        {
            this.lineWidth = lineWidth;
            this.strokeColor = color;
            this.strokeAlpha = alpha;
            this.isStroked = true;
        }

        return this;
    },

    /**
     * Sets if this Shape path is closed during rendering when stroked.
     * Note that some Shapes are always closed when stroked (such as Ellipse shapes)
     * 
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Shape#setClosePath
     * @since 3.13.0
     * 
     * @param {boolean} value - Set to `true` if the Shape should be closed when stroked, otherwise `false`.
     *
     * @return {this} This Game Object instance.
     */
    setClosePath: function (value)
    {
        this.closePath = value;

        return this;
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.Shape#preDestroy
     * @protected
     * @since 3.13.0
     */
    preDestroy: function ()
    {
        this.geom = null;
        this._tempLine = null;
        this.pathData = [];
        this.pathIndexes = [];
    }

});

module.exports = Shape;
