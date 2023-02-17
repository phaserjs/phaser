/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @classdesc
 *
 * @class Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {number} type - The FX Type constant.
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Controller = new Class({

    initialize:

    function Controller (type, gameObject)
    {
        /**
         * The FX_CONST type of this effect.
         *
         * @name Phaser.FX.Controller#type
         * @type {number}
         * @since 3.60.0
         */
        this.type = type;

        /**
         * A reference to the Game Object that owns this effect.
         *
         * @name Phaser.FX.Controller#gameObject
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.60.0
         */
        this.gameObject = gameObject;

        /**
         * Toggle this boolean to enable or disable this effect,
         * without removing and adding it from the Game Object.
         *
         * @name Phaser.FX.Controller#active
         * @type {boolean}
         * @since 3.60.0
         */
        this.active = true;
    },

    /**
     * Destroys this FX Controller.
     *
     * @method Phaser.FX.Controller#destroy
     * @since 3.60.0
     */
    destroy: function ()
    {
        this.gameObject = null;
        this.active = false;
    }

});

module.exports = Controller;
