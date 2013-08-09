/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);

    function preload() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('bunny', 'assets/sprites/bunny.png');
    }

    var bunny;

    function create() {
        //  Here we'll assign the new sprite to the local bunny variable
        bunny = game.add.sprite(0, 0, 'bunny');

        //  You don't have to use the same values when scaling a sprite,
        //  here we'll create a short and wide bunny
        bunny.transform.scale.setTo(3, 0.7);
    }
})();
