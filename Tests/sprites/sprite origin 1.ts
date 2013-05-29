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
        fuji = game.add.sprite(200, 200, 'fuji');

        //  The sprite is 320 x 200 pixels in size
        //  If we don't set an origin then the sprite will rotate around 0,0 - the top left corner

        tween = game.add.tween(fuji);

        //  Start it going
        rotate();

    }

    function rotate() {

        tween.clear();
        tween.to({ rotation: 360 }, 2000);
        tween.onComplete.add(rotate, this);
        tween.start();

    }

})();
