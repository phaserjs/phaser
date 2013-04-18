/// <reference path="../../Phaser/Phaser.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create);
    function init() {
        myGame.loader.addImageFile('atari', 'assets/sprites/atari130xe.png');
        myGame.loader.load();
    }
    function create() {
        var atari = myGame.createSprite(300, 0, 'atari');
        //  Here is the short-hand way of creating a tween, by chaining the call to it:
        myGame.createTween(atari).to({
            y: 400
        }, 5000, Phaser.Easing.Elastic.Out, true);
    }
})();
