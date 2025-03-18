/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var StarRender = require('./StarRender');
var Class = require('../../../utils/Class');
var Earcut = require('../../../geom/polygon/Earcut');
var Shape = require('../Shape');

/**
 * @classdesc
 * The Star Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 *
 * This shape supports both fill and stroke colors.
 *
 * As the name implies, the Star shape will display a star in your game. You can control several
 * aspects of it including the number of points that constitute the star. The default is 5. If
 * you change it to 4 it will render as a diamond. If you increase them, you'll get a more spiky
 * star shape.
 *
 * You can also control the inner and outer radius, which is how 'long' each point of the star is.
 * Modify these values to create more interesting shapes.
 *
 * @class Star
 * @extends Phaser.GameObjects.Shape
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [points=5] - The number of points on the star.
 * @param {number} [innerRadius=32] - The inner radius of the star.
 * @param {number} [outerRadius=64] - The outer radius of the star.
 * @param {number} [fillColor] - The color the star will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the star will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 */
var Star = new Class({

    Extends: Shape,

    Mixins: [
        StarRender
    ],

    initialize:

    function Star (scene, x, y, points, innerRadius, outerRadius, fillColor, fillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (points === undefined) { points = 5; }
        if (innerRadius === undefined) { innerRadius = 32; }
        if (outerRadius === undefined) { outerRadius = 64; }

        Shape.call(this, scene, 'Star', null);

        /**
         * Private internal value.
         * The number of points in the star.
         *
         * @name Phaser.GameObjects.Star#_points
         * @type {number}
         * @private
         * @since 3.13.0
         */
        this._points = points;

        /**
         * Private internal value.
         * The inner radius of the star.
         *
         * @name Phaser.GameObjects.Star#_innerRadius
         * @type {number}
         * @private
         * @since 3.13.0
         */
        this._innerRadius = innerRadius;

        /**
         * Private internal value.
         * The outer radius of the star.
         *
         * @name Phaser.GameObjects.Star#_outerRadius
         * @type {number}
         * @private
         * @since 3.13.0
         */
        this._outerRadius = outerRadius;

        this.setPosition(x, y);
        this.setSize(outerRadius * 2, outerRadius * 2);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    },

    /**
     * Sets the number of points that make up the Star shape.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Star#setPoints
     * @since 3.13.0
     *
     * @param {number} value - The amount of points the Star will have.
     *
     * @return {this} This Game Object instance.
     */
    setPoints: function (value)
    {
        this._points = value;

        return this.updateData();
    },

    /**
     * Sets the inner radius of the Star shape.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Star#setInnerRadius
     * @since 3.13.0
     *
     * @param {number} value - The amount to set the inner radius to.
     *
     * @return {this} This Game Object instance.
     */
    setInnerRadius: function (value)
    {
        this._innerRadius = value;

        return this.updateData();
    },

    /**
     * Sets the outer radius of the Star shape.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Star#setOuterRadius
     * @since 3.13.0
     *
     * @param {number} value - The amount to set the outer radius to.
     *
     * @return {this} This Game Object instance.
     */
    setOuterRadius: function (value)
    {
        this._outerRadius = value;

        return this.updateData();
    },

    /**
     * The number of points that make up the Star shape.
     *
     * @name Phaser.GameObjects.Star#points
     * @type {number}
     * @default 5
     * @since 3.13.0
     */
    points: {

        get: function ()
        {
            return this._points;
        },

        set: function (value)
        {
            this._points = value;

            this.updateData();
        }

    },

    /**
     * The inner radius of the Star shape.
     *
     * @name Phaser.GameObjects.Star#innerRadius
     * @type {number}
     * @default 32
     * @since 3.13.0
     */
    innerRadius: {

        get: function ()
        {
            return this._innerRadius;
        },

        set: function (value)
        {
            this._innerRadius = value;

            this.updateData();
        }

    },

    /**
     * The outer radius of the Star shape.
     *
     * @name Phaser.GameObjects.Star#outerRadius
     * @type {number}
     * @default 64
     * @since 3.13.0
     */
    outerRadius: {

        get: function ()
        {
            return this._outerRadius;
        },

        set: function (value)
        {
            this._outerRadius = value;

            this.updateData();
        }

    },

    /**
     * Internal method that updates the data and path values.
     *
     * @method Phaser.GameObjects.Star#updateData
     * @private
     * @since 3.13.0
     *
     * @return {this} This Game Object instance.
     */
    updateData: function ()
    {
        var path = [];

        var points = this._points;
        var innerRadius = this._innerRadius;
        var outerRadius = this._outerRadius;

        var rot = Math.PI / 2 * 3;
        var step = Math.PI / points;

        //  So origin 0.5 = the center of the star
        var x = outerRadius;
        var y = outerRadius;

        path.push(x, y + -outerRadius);

        for (var i = 0; i < points; i++)
        {
            path.push(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);

            rot += step;

            path.push(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);

            rot += step;
        }

        path.push(x, y + -outerRadius);

        this.pathIndexes = Earcut(path);
        this.pathData = path;

        return this;
    }

});

module.exports = Star;
