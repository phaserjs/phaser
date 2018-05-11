/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

require('./polyfills');

var CONST = require('./const');
var Extend = require('./utils/object/Extend');

/**
 * @namespace Phaser
 */

var Phaser = {

    Actions: require('./actions'),
    Animation: require('./animations'),
    Cache: require('./cache'),
    Cameras: require('./cameras'),
    Class: require('./utils/Class'),
    Create: require('./create'),
    Curves: require('./curves'),
    Data: require('./data'),
    Display: require('./display'),
    DOM: require('./dom'),
    Events: require('./events'),
    Game: require('./boot/Game'),
    GameObjects: require('./gameobjects'),
    Geom: require('./geom'),
    Input: require('./input'),
    Loader: require('./loader'),
    Math: require('./math'),
    Physics: require('./physics'),
    Plugins: require('./plugins'),
    Renderer: require('./renderer'),
    Scene: require('./scene/Scene'),
    Scenes: require('./scene'),
    Sound: require('./sound'),
    Structs: require('./structs'),
    Textures: require('./textures'),
    Tilemaps: require('./tilemaps'),
    Time: require('./time'),
    Tweens: require('./tweens'),
    Utils: require('./utils')

};

//   Merge in the consts

Phaser = Extend(false, Phaser, CONST);

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;

/*
 * "Documentation is like pizza: when it is good, it is very, very good;
 * and when it is bad, it is better than nothing."
 *  -- Dick Brandon
 */
