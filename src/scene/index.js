/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('./const');
var Extend = require('../utils/object/Extend');

/**
 * @namespace Phaser.Scenes
 */

var Scene = {

    Events: require('./events'),
    GetPhysicsPlugins: require('./GetPhysicsPlugins'),
    GetScenePlugins: require('./GetScenePlugins'),
    SceneManager: require('./SceneManager'),
    ScenePlugin: require('./ScenePlugin'),
    Settings: require('./Settings'),
    Systems: require('./Systems')

};

//   Merge in the consts
Scene = Extend(false, Scene, CONST);

module.exports = Scene;
