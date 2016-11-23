(function () {
    'use strict';

    requirejs.config({
        baseUrl: "src/",
        
        paths: {
            //  Edit the below path to point to where-ever you have placed the phaser.min.js file
            phaser: 'libs/phaser/phaser.min'
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