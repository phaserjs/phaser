/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var Extend = require('../utils/object/Extend');

/**
 * @namespace Phaser.Scenes
 */

var Scene = {

    SceneManager: require('./SceneManager'),
    ScenePlugin: require('./ScenePlugin'),
    Settings: require('./Settings'),
    Systems: require('./Systems')

};

//   Merge in the consts
Scene = Extend(false, Scene, CONST);

module.exports = Scene;
