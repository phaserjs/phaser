/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 *
 * @class BaseFX
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {number} type - The FX Type constant.
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var BaseFX = new Class({

    initialize:

    function BaseFX (type, gameObject)
    {
        this.type = type;

        this.gameObject = gameObject;

        this.active = true;
    },

    destroy: function ()
    {
        this.gameObject = null;
    }

});

module.exports = BaseFX;
