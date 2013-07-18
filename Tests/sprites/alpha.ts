/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('bunny', 'assets/sprites/bunny.png');
        game.load.start();

    }

    function create() {

        //  Here we'll assign the new sprite to the local bunny variable
        var bunny = game.add.sprite(0, 0, 'bunny');

        //  And this sets the alpha of the sprite to 0.5, which is 50% opaque
        bunny.alpha = 0.5;

    }

})();
