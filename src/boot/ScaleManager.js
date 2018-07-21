/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var GetValue = require('../utils/object/GetValue');

/*

    scale: {
        width: 800,
        height: 600,
        resolution: window.devicePixelRatio,
    },

    Canvas width / height in the element
    Canvas CSS width / height in the style

    Detect orientation
    Lock orientation (Android only?)
    Full-screen support

    Scale Mode - 


*/

/**
 * @classdesc
 * [description]
 *
 * @class ScaleManager
 * @memberOf Phaser.Boot
 * @constructor
 * @since 3.12.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser.Game instance.
 * @param {ScaleManagerConfig} config
 */
var ScaleManager = new Class({

    initialize:

    function ScaleManager (game, config)
    {
        /**
         * A reference to the Phaser.Game instance.
         *
         * @name Phaser.Boot.ScaleManager#game
         * @type {Phaser.Game}
         * @readOnly
         * @since 3.12.0
         */
        this.game = game;
    },

    /**
     * Destroys the ScaleManager.
     *
     * @method Phaser.Boot.ScaleManager#destroy
     * @since 3.12.0
     */
    destroy: function ()
    {
        this.game = null;
    }

});

module.exports = ScaleManager;
