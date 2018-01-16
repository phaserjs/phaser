require('./polyfills');

var CONST = require('./const');
var Extend = require('./utils/object/Extend');

//  This object is exported globally

var Phaser = {

    Actions: require('./actions/'),

    Create: require('./create/'),

    Cameras: require('./cameras/'),

    DOM: require('./dom/'),

    EventEmitter: require('./events/EventEmitter'),

    Game: require('./boot/Game'),

    Math: require('./math'),

    Geom: require('./geom'),

    Display: require('./display'),

    Input: require('./input'),

    GameObjects: require('./gameobjects'),

    Scene: require('./scene/local/Scene'),

    Loader: {

        ImageFile: require('./loader/filetypes/ImageFile')

    },

    Sound: require('./sound'),

    Structs: require('./structs'),
    
    Curves: require('./curves'),

    Physics: require('./physics'),

    Class: require('./utils/Class'),

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
