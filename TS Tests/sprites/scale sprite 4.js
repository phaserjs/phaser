/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);
    function preload() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('bunny', 'assets/sprites/bunny.png');
    }
    var bunny;
    var tweenUp;
    var tweenDown;
    function create() {
        //  Here we'll assign the new sprite to the local bunny variable
        bunny = game.add.sprite(0, 0, 'bunny');
        bunny.transform.scale.setTo(0.5, 0.5);
        //  This time let's scale the sprite by a looped tween
        game.add.tween(bunny.transform.scale).to({
            x: 1.5,
            y: 1.5
        }, 2000, Phaser.Easing.Elastic.Out, true, 0, true, true);
    }
})();
