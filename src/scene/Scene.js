/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var Systems = require('./Systems');

/**
 * @classdesc
 * [description]
 *
 * @class Scene
 * @memberOf Phaser
 * @constructor
 * @since 3.0.0
 *
 * @param {(string|SettingsConfig)} config - Scene specific configuration settings.
 */
var Scene = new Class({

    initialize:

    function Scene (config)
    {
        /**
         * The Scene Systems. You must never overwrite this property, or all hell will break lose.
         *
         * @name Phaser.Scene#sys
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.sys = new Systems(this, config);
    },

    /**
     * Should be overridden by your own Scenes.
     *
     * @method Phaser.Scene#update
     * @override
     * @since 3.0.0
     */
    update: function ()
    {
    }

});

module.exports = Scene;
