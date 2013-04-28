/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create);
    function init() {
        myGame.loader.addImageFile('atari', 'assets/sprites/atari130xe.png');
        myGame.loader.load();
    }
    var atari;
    function create() {
        atari = myGame.createSprite(300, 0, 'atari');
        startBounceTween();
    }
    function startBounceTween() {
        atari.y = 0;
        var bounce = myGame.createTween(atari);
        bounce.to({
            x: 2
        }, 1000 + Math.random() * 3000, Phaser.Easing.Bounce.Out);
        bounce.onComplete.add(startBounceTween, this);
        bounce.start();
    }
})();
