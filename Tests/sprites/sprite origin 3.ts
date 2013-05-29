/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('fuji', 'assets/pics/atari_fujilogo.png');
        game.loader.load();

    }

    var fuji: Phaser.Sprite;
    var tween: Phaser.Tween;

    function create() {

        game.stage.backgroundColor = 'rgb(0,0,100)';

        //  Here we'll assign the new sprite to the local fuji variable
        fuji = game.add.sprite(game.stage.centerX, game.stage.centerY, 'fuji');

        //  The sprite is 320 x 200 pixels in size
        //  Here we set the origin to be the bottom-right of the sprite
        fuji.origin.setTo(320, 200);

        game.add.tween(fuji).to({ rotation: 360 }, 2000, Phaser.Easing.Linear.None, true, 0, true);

    }

})();
