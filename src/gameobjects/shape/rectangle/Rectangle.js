/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var GeomRectangle = require('../../../geom/rectangle/Rectangle');
var Shape = require('../Shape');
var RectangleRender = require('./RectangleRender');

/**
 * @classdesc
 * The Rectangle Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 * 
 * This shape supports both fill and stroke colors.
 * 
 * You can change the size of the rectangle by changing the `width` and `height` properties.
 *
 * @class Rectangle
 * @extends Phaser.GameObjects.Shape
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the rectangle.
 * @param {number} [height=128] - The height of the rectangle.
 * @param {number} [fillColor] - The color the rectangle will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the rectangle will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 */
var Rectangle = new Class({

    Extends: Shape,

    Mixins: [
        RectangleRender
    ],

    initialize:

    function Rectangle (scene, x, y, width, height, fillColor, fillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 128; }
        if (height === undefined) { height = 128; }

        Shape.call(this, scene, 'Rectangle', new GeomRectangle(0, 0, width, height));

        this.setPosition(x, y);
        this.setSize(width, height);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    },

    /**
     * Internal method that updates the data and path values.
     *
     * @method Phaser.GameObjects.Rectangle#updateData
     * @private
     * @since 3.13.0
     *
     * @return {this} This Game Object instance.
     */
    updateData: function ()
    {
        var path = [];
        var rect = this.geom;
        var line = this._tempLine;

        rect.getLineA(line);

        path.push(line.x1, line.y1, line.x2, line.y2);

        rect.getLineB(line);

        path.push(line.x2, line.y2);

        rect.getLineC(line);

        path.push(line.x2, line.y2);

        rect.getLineD(line);

        path.push(line.x2, line.y2);

        this.pathData = path;

        return this;
    }

});

module.exports = Rectangle;
