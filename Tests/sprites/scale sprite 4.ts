/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('bunny', 'assets/sprites/bunny.png');
        game.load.start();

    }

    var bunny: Phaser.Sprite;
    var tweenUp: Phaser.Tween;
    var tweenDown: Phaser.Tween;

    function create() {

        //  Here we'll assign the new sprite to the local bunny variable
        bunny = game.add.sprite(0, 0, 'bunny');

        bunny.transform.scale.setTo(0.5, 0.5);

        //  This time let's scale the sprite by a looped tween
        game.add.tween(bunny.transform.scale).to({ x: 2, y: 2 }, 2000, Phaser.Easing.Elastic.Out, true, 0, true, true);

    }

})();
