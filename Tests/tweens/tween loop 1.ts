/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('swirl', 'assets/pics/color_wheel_swirl.png');
        game.loader.load();

    }

    var swirl: Phaser.Sprite;

    function create() {

        //  Here we'll assign the new sprite to the local swirl variable
        swirl = game.add.sprite(game.stage.centerX, game.stage.centerY, 'swirl');

        //  Increase the size of the sprite a little so it covers the edges of the stage
        swirl.scale.setTo(1.4, 1.4);

        //  Create a tween that rotates a full 306 degrees and then repeats (loop set to true)
        game.add.tween(swirl).to({ rotation: 360 }, 2000, Phaser.Easing.Linear.None, true, 0, true);

    }

})();
