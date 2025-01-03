/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  These properties get injected into the Scene and map to local systems
//  The map value is the property that is injected into the Scene, the key is the Scene.Systems reference.
//  These defaults can be modified via the Scene config object
//          var config = {
//            map: {
//                add: 'makeStuff',
//                load: 'loader'
//            }
//        };

var InjectionMap = {

    game: 'game',
    renderer: 'renderer',

    anims: 'anims',
    cache: 'cache',
    plugins: 'plugins',
    registry: 'registry',
    scale: 'scale',
    sound: 'sound',
    textures: 'textures',

    events: 'events',
    cameras: 'cameras',
    add: 'add',
    make: 'make',
    scenePlugin: 'scene',
    displayList: 'children',
    lights: 'lights',

    data: 'data',
    input: 'input',
    load: 'load',
    time: 'time',
    tweens: 'tweens',

    arcadePhysics: 'physics',
    impactPhysics: 'impact',
    matterPhysics: 'matter'

};

if (typeof PLUGIN_CAMERA3D)
{
    InjectionMap.cameras3d = 'cameras3d';
}

if (typeof PLUGIN_FBINSTANT)
{
    InjectionMap.facebook = 'facebook';
}

module.exports = InjectionMap;
