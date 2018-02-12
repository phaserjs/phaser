/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  These properties get injected into the Scene and map to local systems
//  The map key is the property that is added to the Scene, the value is the Scene.Systems reference
//  These defaults can be modified via the Scene config object

var InjectionMap = {

    game: 'game',

    anims: 'anims',
    cache: 'cache',
    registry: 'registry',
    sound: 'sound',
    textures: 'textures',

    events: 'events',
    cameras: 'cameras',
    cameras3d: 'cameras3d',
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

module.exports = InjectionMap;
