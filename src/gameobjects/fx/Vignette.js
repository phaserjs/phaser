/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseFX = require('./BaseFX');
var Class = require('../../utils/Class');
var FX_CONST = require('./const');

/**
 * @classdesc
 *
 * @class Vignette
 * @extends Phaser.GameObjects.FX.BaseFX
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Vignette = new Class({

    Extends: BaseFX,

    initialize:

    function Vignette (gameObject, x, y, radius, strength)
    {
        if (x === undefined) { x = 0.5; }
        if (y === undefined) { y = 0.5; }
        if (radius === undefined) { radius = 0.5; }
        if (strength === undefined) { strength = 0.5; }

        BaseFX.call(this, FX_CONST.VIGNETTE, gameObject);

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.strength = strength;
    }

});

module.exports = Vignette;
