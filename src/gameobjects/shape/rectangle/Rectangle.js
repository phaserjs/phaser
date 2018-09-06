/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var GeomRectangle = require('../../../geom/rectangle/Rectangle');
var Shape = require('../Shape');
var RectangleRender = require('./RectangleRender');

/**
 * @classdesc
 *
 * @class Rectangle
 * @extends Phaser.GameObjects.Shape
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 */
var Rectangle = new Class({

    Extends: Shape,

    Mixins: [
        RectangleRender
    ],

    initialize:

    function Rectangle (scene, x, y, width, height, fillColor, fillAlpha)
    {
        Shape.call(this, scene, 'Rectangle', new GeomRectangle(x, y, width, height));

        this.setPosition(x, y);
        this.setSize(width, height);

        this.updateDisplayOrigin();

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }
    }

});

module.exports = Rectangle;
