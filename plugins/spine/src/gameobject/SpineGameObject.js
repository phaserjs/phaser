/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../src/utils/Class');
var GameObject = require('../../../../src/gameobjects/GameObject');

/**
 * @classdesc
 * TODO
 *
 * @class Skeleton
 * @constructor
 * @since 3.16.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that has installed this plugin.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Phaser Plugin Manager.
 */
var SpineGameObject = new Class({

    Extends: GameObject,

    initialize:

    function SpineGameObject (scene, x, y, key, animation)
    {
        GameObject.call(this, scene, 'Spine');
    }

});

module.exports = SpineGameObject;
