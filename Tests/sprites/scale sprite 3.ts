/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('bunny', 'assets/sprites/bunny.png');
        game.loader.load();

    }

    var bunny: Phaser.Sprite;

    function create() {

        //  Here we'll assign the new sprite to the local bunny variable
        bunny = game.add.sprite(0, 0, 'bunny');

        //  You don't have to use the same values when scaling a sprite,
        //  here we'll create a short and wide bunny

        bunny.scale.setTo(3, 0.7);

    }

})();
