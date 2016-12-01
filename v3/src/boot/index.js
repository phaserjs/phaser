module.exports = {

    //  Doing this makes it available under Phaser.Game
    Game: require('./Game'),

    Loader: {
        ImageFile: require('../loader/filetypes/ImageFile')
    }

};
