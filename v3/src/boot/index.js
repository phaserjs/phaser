module.exports = {

    //  Doing this makes it available under Phaser.Game
    Game: require('./Game'),

    Event: require('../events/Event'),
    EventDispatcher: require('../events/EventDispatcher'),

    Loader: {
        ImageFile: require('../loader/filetypes/ImageFile')
    }

};
