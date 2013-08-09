/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);

    function preload() {
        game.load.image('atari', 'assets/sprites/atari130xe.png');
    }

    var atari;

    function create() {
        atari = game.add.sprite(300, 0, 'atari');

        startBounceTween();
    }

    function startBounceTween() {
        atari.y = 0;

        var bounce = game.add.tween(atari);

        bounce.to({ y: 500 }, 1000 + Math.random() * 3000, Phaser.Easing.Bounce.Out);
        bounce.onComplete.add(startBounceTween, this);
        bounce.start();
    }
})();
