/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, null, render);
    function preload() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('sprite', 'assets/sprites/atari130xe.png');
    }
    var sprite;
    function create() {
        sprite = game.add.sprite(200, 200, 'sprite');
        //  Enable Input detection
        sprite.input.start(0, false, true);
    }
    function render() {
        Phaser.DebugUtils.renderInputInfo(32, 32);
        Phaser.DebugUtils.renderSpriteInputInfo(sprite, 300, 32);
    }
})();
