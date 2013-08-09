/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);

    function preload() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('bunny', 'assets/sprites/bunny.png');
    }

    var smallBunny;

    function create() {
        //  Here we'll assign the new sprite to the local smallBunny variable
        smallBunny = game.add.sprite(0, 0, 'bunny');

        //  And now let's scale the sprite by half
        //  You can do either:
        //smallBunny.scale.x = 0.5;
        //smallBunny.scale.y = 0.5;
        //  Or you can set them both at the same time using setTo:
        smallBunny.scale.setTo(0.5, 0.5);
    }
})();
