/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);
    function init() {
        game.world.setSize(800, 600, true);
        game.load.image('background', 'assets/misc/water_texture.jpg');
        game.load.start();
    }
    function create() {
        game.camera.texture.loadImage('background', false);
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = 'rgb(255, 255, 255)';
        Phaser.DebugUtils.context.fillText('Draw background image using camera.texture property.', 196, 320);
    }
})();
