require('./polyfills');

//  This object is exported globally

var Phaser = {

    Game: require('./boot/Game'),

    Event: require('./events/Event'),
    EventDispatcher: require('./events/EventDispatcher'),

    Math: require('./math'),

    GameObjects: {

        Factory: require('./gameobjects/FactoryContainer'),

    },

    Loader: {

        ImageFile: require('./loader/filetypes/ImageFile')

    }

};

//  Required, but don't need Phaser level exports

require('./gameobjects/image/ImageFactory');
require('./gameobjects/container/ContainerFactory');

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;
