/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('fuji', 'assets/pics/atari_fujilogo.png');
        game.loader.load();

    }

    var fuji: Phaser.Sprite;
    var tweenUp: Phaser.Tween;
    var tweenDown: Phaser.Tween;

    function create() {

        game.stage.backgroundColor = 'rgb(0,0,100)';

        //  Here we'll assign the new sprite to the local fuji variable
        fuji = game.add.sprite(game.stage.centerX, game.stage.centerY, 'fuji');

        //  The sprite is 320 x 200 pixels in size
        //  Here we set the origin to the center of the sprite again, so we can rotate and scale it at the same time
        fuji.origin.setTo(160, 100);

        game.add.tween(fuji).to({ angle: 360 }, 2000, Phaser.Easing.Linear.None, true, 0, true);

        tweenUp = game.add.tween(fuji.scale);
        tweenUp.onComplete.add(scaleDown, this);

        tweenDown = game.add.tween(fuji.scale);
        tweenDown.onComplete.add(scaleUp, this);

        scaleUp();

    }

    function scaleUp() {

        tweenUp.to({ x: 2, y: 2 }, 1000, Phaser.Easing.Elastic.Out);
        tweenUp.start();

    }

    function scaleDown() {

        tweenDown.to({ x: 0.5, y: 0.5 }, 1000, Phaser.Easing.Elastic.Out);
        tweenDown.start();

    }

})();
