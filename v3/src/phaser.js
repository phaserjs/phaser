require('./polyfills');

var CONST = require('./const');
var Extend = require('./utils/object/Extend');

//  This object is exported globally

var Phaser = {

    DOM: require('./dom/'),

    Game: require('./boot/Game'),

    Event: require('./events/Event'),
    EventDispatcher: require('./events/EventDispatcher'),

    Math: require('./math'),

    Components: require('./components'),

    Geom: require('./geom'),

    GameObjects: {

        Factory: require('./gameobjects/FactoryContainer')

    },

    State: require('./state/State'),

    Loader: {

        ImageFile: require('./loader/filetypes/ImageFile')

    },

    Sound: require('./sound'),

    Utils: {

        Array: require('./utils/array/'),
        Objects: require('./utils/object/'),
        String: require('./utils/string/')

    }

};

//  Required, but don't need Phaser level exports

require('./gameobjects/blitter/BlitterFactory');
require('./gameobjects/image/ImageFactory');
require('./gameobjects/sprite/SpriteFactory');
require('./gameobjects/container/ContainerFactory');

//   Merge in the consts

Phaser = Extend(false, Phaser, CONST);

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;

/*
 * “Sometimes, the elegant implementation is just a function.
 * Not a method. Not a class. Not a framework. Just a function.”
 * - John Carmack
 */
