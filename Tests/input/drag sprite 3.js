/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, null, render);
    function preload() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('sprite', 'assets/sprites/atari800.png');
    }
    var sprite;
    function create() {
        sprite = game.add.sprite(500, 300, 'sprite');
        sprite.input.start(0, false, true);
        //  This will ensure the sprite is dragged from its center
        sprite.input.enableDrag(true);
    }
    function render() {
        Phaser.DebugUtils.renderSpriteCorners(sprite);
        Phaser.DebugUtils.renderInputInfo(32, 32);
        Phaser.DebugUtils.renderSpriteInfo(sprite, 32, 200);
    }
})();
