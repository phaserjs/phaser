/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Body = require('./Body');
var Class = require('../../utils/Class');

/**
 * @classdesc
 * An Arcade Physics Image is an Image with an Arcade Physics body and related components.
 * The body can be dynamic or static.
 *
 * The main difference between an Arcade Image and an Arcade Sprite is that you cannot animate an Arcade Image.
 *
 * @class Rectangle
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.17.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {number} width - .
 * @param {number} height - .
 */
var ArcadeRectangle = new Class({

    Extends: Body,

    initialize:

    function ArcadeRectangle (world, x, y, width, height)
    {
        Body.call(this, world, null, x, y, width, height);
    }

});

module.exports = ArcadeRectangle;
