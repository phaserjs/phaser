/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('bunny', 'assets/sprites/bunny.png');
        game.load.start();

    }

    function create() {

        //  This will create a Sprite positioned at the top-left of the game (0,0)
        //  Try changing the 0, 0 values
        game.add.sprite(0, 0, 'bunny');

        game.camera.texture.alpha = 0.5;

    }

})();
