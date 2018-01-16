require('./polyfills');

var CONST = require('./const');
var Extend = require('./utils/object/Extend');

//  This object is exported globally

var Phaser = {

    Actions: require('./actions/'),
    Animation: require('./animations/'),
    Cache: require('./cache/'),
    Cameras: require('./cameras/'),
    Class: require('./utils/Class'),
    Create: require('./create/'),
    Curves: require('./curves'),
    Display: require('./display'),
    DOM: require('./dom/'),
    EventEmitter: require('./events/EventEmitter'),
    Game: require('./boot/Game'),
    GameObjects: require('./gameobjects'),
    Geom: require('./geom'),
    Input: require('./input'),
    Loader: require('./loader'),
    Math: require('./math'),
    Physics: require('./physics'),
    Scene: require('./scene/Scene'),
    Sound: require('./sound'),
    Structs: require('./structs'),
    Textures: require('./textures'),
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
 * "Documentation is like sex:  when it is good, it is very, very good;
 * and when it is bad, it is better than nothing."
 *  -- Dick Brandon
 */

/*
 * "Sometimes, the elegant implementation is just a function.
 * Not a method. Not a class. Not a framework. Just a function."
 *  -- John Carmack
 */
