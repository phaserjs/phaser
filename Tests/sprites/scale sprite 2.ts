/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('bunny', 'assets/sprites/bunny.png');
        game.load.start();

    }

    var bigBunny: Phaser.Sprite;

    function create() {

        //  Here we'll assign the new sprite to the local bigBunny variable
        bigBunny = game.add.sprite(0, 0, 'bunny');

        //  And now let's scale the sprite by two

        //  You can do either:
        //  smallBunny.scale.x = 2;
        //  smallBunny.scale.y = 2;

        //  Or you can set them both at the same time using setTo:
        bigBunny.scale.setTo(2, 2);

    }

})();
