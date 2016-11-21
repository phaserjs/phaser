(function () {
    'use strict';

    requirejs.config({
        baseUrl: "src/",
        
        paths: {
            // phaser.min.js library location, by default this is the location where bower will place it.
            // Feel free to edit the below path to point to wherever you have placed this file.
            phaser: 'libs/phaser/build/phaser.min'
        },

        shim: {
            'phaser': {
                exports: 'Phaser'
            }
        }
    });
 
    require(['phaser', 'game'], function (Phaser, Game) {
        var game = new Game();
        game.start();
    });
}());
