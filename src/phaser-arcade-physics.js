/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

require('./polyfills');

var CONST = require('./const');
var Extend = require('./utils/object/Extend');

/**
 * @namespace Phaser
 */

/**
 * The root types namespace.
 * 
 * @namespace Phaser.Types
 * @since 3.17.0
 */

var Phaser = {

    Actions: require('./actions'),
    Animations: require('./animations'),
    Cache: require('./cache'),
    Cameras: require('./cameras'),
    Core: require('./core'),
    Class: require('./utils/Class'),
    Create: require('./create'),
    Curves: require('./curves'),
    Data: require('./data'),
    Display: require('./display'),
    DOM: require('./dom'),
    Events: require('./events'),
    Game: require('./core/Game'),
    GameObjects: require('./gameobjects'),
    Geom: require('./geom'),
    Input: require('./input'),
    Loader: require('./loader'),
    Math: require('./math'),
    Physics: {
        Arcade: require('./physics/arcade')
    },
    Plugins: require('./plugins'),
    Scale: require('./scale'),
    Scene: require('./scene/Scene'),
    Scenes: require('./scene'),
    Structs: require('./structs'),
    Textures: require('./textures'),
    Tilemaps: require('./tilemaps'),
    Time: require('./time'),
    Tweens: require('./tweens'),
    Utils: require('./utils')

};

//   Merge in the consts

Phaser = Extend(false, Phaser, CONST);

if (typeof FEATURE_SOUND)
{
    Phaser.Sound = require('./sound');
}

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;

/*
 * "Documentation is like pizza: when it is good, it is very, very good;
 * and when it is bad, it is better than nothing."
 *  -- Dick Brandon
 */
