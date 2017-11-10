var Class = require('../utils/Class');

//  Phaser.Loader.BaseSoundManager

var BaseSoundManager = new Class({

    // TODO define sound manager interface

    initialize:

    function BaseSoundManager (game)
    {
        /**
         * @property {Phaser.Game} game - Local reference to game.
         */
        this.game = game;
    }

});

module.exports = BaseSoundManager;
