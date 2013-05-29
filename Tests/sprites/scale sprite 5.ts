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

        //  sets origin to the center of the sprite (half the width and half the height)
        fuji.origin.setTo(160, 100);

        //  We'll tween the scale down to zero (which will make the sprite invisible) and then flip it
        //  The end result should look like turning over a card

        //  Create our tween
        tween = game.add.tween(fuji.scale);

        //  Start it going
        scaleLeft();

    }

    function scaleLeft() {

        tween.clear();
        tween.to({ x: 0 }, 1000);
        tween.onComplete.add(scaleRight, this);
        tween.start();

    }

    function scaleRight() {

        tween.clear();
        tween.to({ x: 1 }, 1000);
        tween.onComplete.add(scaleLeft, this);
        tween.start();

        //  This line says "if the texture is flippedX then unflip it (set flippedX to false), otherwise set flippedX to true
        (fuji.texture.flippedX) ? fuji.texture.flippedX = false: fuji.texture.flippedX = true;

    }

})();
