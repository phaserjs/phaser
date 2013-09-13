/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);
    function preload() {
        game.load.image('atari', 'assets/sprites/atari130xe.png');
    }
    var atari;
    function create() {
        atari = game.add.sprite(300, 0, 'atari');
        game.add.tween(atari).to({
            y: 500
        }, 5000, Phaser.Easing.Bounce.Out, true, 5000);
    }
})();
