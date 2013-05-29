/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('bunny', 'assets/sprites/bunny.png');
        game.loader.load();
    }
    var bunny;
    var tweenUp;
    var tweenDown;
    function create() {
        //  Here we'll assign the new sprite to the local bunny variable
        bunny = game.add.sprite(0, 0, 'bunny');
        //  This time let's scale the sprite by using two tweens
        //  The first tween will scale the sprite up, the second will scale it down again
        //  Create our 2 tweens
        tweenUp = game.add.tween(bunny.scale);
        tweenUp.onComplete.add(scaleDown, this);
        tweenDown = game.add.tween(bunny.scale);
        tweenDown.onComplete.add(scaleUp, this);
        //  Start it going
        scaleUp();
    }
    function scaleUp() {
        tweenUp.to({
            x: 2,
            y: 2
        }, 2000, Phaser.Easing.Elastic.Out);
        tweenUp.start();
    }
    function scaleDown() {
        tweenDown.to({
            x: 0.5,
            y: 0.5
        }, 2000, Phaser.Easing.Elastic.Out);
        tweenDown.start();
    }
})();
