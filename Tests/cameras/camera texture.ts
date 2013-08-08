/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, null, render);

    function preload() {
        game.world.setSize(800, 600, true);
        game.load.image('background', 'assets/misc/water_texture.jpg');

        
    }
    function create() {
        game.camera.texture.loadImage('background', false);
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = 'rgb(255, 255, 255)';
        Phaser.DebugUtils.context.fillText('Draw background image using camera.texture property.',
            196, 320);
    }
})();
