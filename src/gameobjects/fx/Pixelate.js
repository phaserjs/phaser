/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var FX_CONST = require('./const');

/**
 * @classdesc
 *
 * @class Pixelate
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Pixelate = new Class({

    initialize:

    function Pixelate (gameObject)
    {
        this.type = FX_CONST.PIXELATE;

        this.gameObject = gameObject;

        this.active = true;

        this.amount = 1;
    },

    destroy: function ()
    {
        this.gameObject = null;
    }

});

module.exports = Pixelate;
