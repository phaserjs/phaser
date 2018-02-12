/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  These are the core plugins that are installed into every Scene.Systems, no matter what.
//  They are optionally exposed in the Scene as well (see the InjectionMap for details)

//  They are created in the order in which they appear in the array, EventEmitter is always first.

var CoreScenePlugins = [

    'EventEmitter',

    'CameraManager',
    'GameObjectCreator',
    'GameObjectFactory',
    'ScenePlugin',
    'DisplayListPlugin',
    'UpdateListPlugin'

];

module.exports = CoreScenePlugins;
